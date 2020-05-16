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
        .setManualAckMode(true)
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

        setTimeout(() => {
            msg.ack();
        }, 7*1000);
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
