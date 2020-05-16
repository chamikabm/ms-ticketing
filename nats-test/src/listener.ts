import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

// This command will clear the previous command logs.
// So that we will only have application specific logs.
console.clear();

// const client = nats.connect()
// As a community convention for nasts streaming server clients are
// referred to as 'stan', Hence let's use stan for client.
const stan = nats.connect('ticketing',
    randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222',
});


stan.on('connect', () => {
    console.log('Listener connected to the NATS.');

    stan.on('close', () => {
        console.log('NATS connection closed!');
        process.exit();
    });

    // const options = stan.subscriptionOptions()
    //     // NATS waits for clients to Ack each event, otherwise it will replay after Ack Wait time.
    //     .setManualAckMode(true)
    //
    //     // Deliver all messages from the beginning on running first time.
    //     .setDeliverAllAvailable()
    //
    //     // Deliver all messages which has not ack by the client on restart.
    //     .setDurableName('order-service')
    //
    //     // NATS server expect a ACK response from the corresponding client with in the time
    //     // period, if not it will replay the event to one of other existing client after this period of time.
    //     .setAckWait(6 * 1000);
    //
    // const subscription = stan.subscribe(
    //     'ticker:created',
    //     'order-service-queue-group',
    //     options,
    //     );
    // subscription.on('message', (msg: Message) => {
    //     console.log('Message received!');
    //     const data = msg.getData();
    //
    //     if(typeof data === 'string') {
    //         console.log(`Received event #${msg.getSequence()}, with data:${data}`);
    //     }
    //
    //     msg.ack();
    //
    //     // setTimeout(() => {
    //     //     msg.ack();
    //     // }, 7*1000);
    // });

    // All above the code now being handled by the Listener class below.
    new TicketCreatedListener(stan).listen();
});


// These SIGINT and SIGTERM are not used in Windows
// also these will not execute if we forcefully kill the running process
// (i.e: Stopping running process by a Program Manager)
// To tackle that scenario we need to use the health endpoint check.
process.on('SIGINT', () => {
    // Exit by CMD + C etc.
    console.log('SIGINT Received!')
    stan.close();
});
process.on('SIGTERM', () => {
    // Restart
    console.log('SIGTERM Received!')
    stan.close();
});

// NATS Subscribers List
// http://localhost:8222/streaming/channelsz?subs=1

abstract class Listener {
    abstract subject: string;
    abstract queueGroupName: string;
    abstract onMessage(data: any, msg: Message): void;

    private client: Stan;
    protected ackWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            // In a very rare case we use different name than the queue group name
            // for the durable name, hence it's fine to use the same name for both cases.
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();

        // If it is a string data then parse it, if it is a data buffer parse and convert to utf-8 string.
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8'));
    }
}


class TicketCreatedListener extends Listener {
    subject = 'ticket:created';
    queueGroupName = 'payments-service';

    onMessage(data: any, msg: Message): void {
        console.log(`Event data : ${data}`);
        msg.ack();
    }
}
