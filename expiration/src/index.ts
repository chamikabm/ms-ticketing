import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    if(!process.env.NATS_URL) {
        throw Error('NATS_URL must be defined.');
    }

    if(!process.env.NATS_CLUSTER_ID) {
        throw Error('NATS_CLUSTER_ID must be defined.');
    }

    if(!process.env.NATS_CLIENT_ID) {
        throw Error('NATS_CLIENT_ID must be defined.');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL,
        );

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => {
            // Exit by CMD + C etc.
            console.log('SIGINT Received!')
            natsWrapper.client.close();
        });

        process.on('SIGTERM', () => {
            // Restart
            console.log('SIGTERM Received!')
            natsWrapper.client.close();
        });

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }
};

start();
