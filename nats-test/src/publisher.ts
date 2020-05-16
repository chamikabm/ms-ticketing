import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

// This command will clear the previous command logs.
// So that we will only have application specific logs.
console.clear();

// const client = nats.connect()
// As a community convention for nasts streaming server clients are
// referred to as 'stan', Hence let's use stan for client.
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222',
});

stan.on('connect', async () => {
    console.log('Publisher connected to the NATS.');

    const data = {
        id: '123',
        title: 'concert',
        price: 30,
    };

    // We only can strings or text data in NATS
    // Hence we need to transform above data into plain text string using JSON.stringify()
    // const dataString = JSON.stringify(data);
    //
    // stan.publish('ticket:created', dataString, () => {
    //     // This is a optional callback.
    //     console.log('Event published!!');
    // });

    // All above the code now being handled by the Publisher class below.
    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish(data);
    } catch (err) {
        console.log(err);
    }

});
