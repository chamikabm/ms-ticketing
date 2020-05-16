import nats, { Message } from 'node-nats-streaming';
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

    const options = stan.subscriptionOptions()
        // NATS waits for clients to Ack each event, otherwise it will replay after Ack Wait time.
        .setManualAckMode(true)

        // Deliver all messages from the beginning on running first time.
        .setDeliverAllAvailable()

        // Deliver all messages which has not ack by the client on restart.
        .setDurableName('order-service')

        // NATS server expect a ACK response from the corresponding client with in the time
        // period, if not it will replay the event to one of other existing client after this period of time.
        .setAckWait(6 * 1000);

    const subscription = stan.subscribe(
        'ticker:created',
        'order-service-queue-group',
        options,
        );
    subscription.on('message', (msg: Message) => {
        console.log('Message received!');
        const data = msg.getData();

        if(typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data:${data}`);
        }

        msg.ack();

        // setTimeout(() => {
        //     msg.ack();
        // }, 7*1000);
    });
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
