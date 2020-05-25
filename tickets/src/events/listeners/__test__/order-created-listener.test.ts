import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@ms-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and Save a ticket.
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'sdfsdf',
    });
    await ticket.save();

    // Create fake data event.
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'kjjjlkj',
        expiresAt: 'kjhkjh',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    };

    // Create fake msg.
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { message, data, ticket, listener };
};

describe('Order Created Lister', () => {
    it('Should sets the userId of the ticket.', async () => {
        const { message, data, ticket, listener } = await setup();

        await listener.onMessage(data, message);
        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket!.orderId).toEqual(data.id);
    });

    it('Should ack the message.', async () => {
        const { message, data, ticket, listener } = await setup();

        await listener.onMessage(data, message);
        expect(message.ack).toHaveBeenCalled();
    });

    it('Should publishes a ticket updated event.', async () => {
        const { message, data, ticket, listener } = await setup();

        await listener.onMessage(data, message);

        // When we call the above onMessage method on the created listener instance,
        // behind the scene it will call the base listener's client publish method.
        expect(natsWrapper.client.publish).toHaveBeenCalled();

        // @ts-ignore
        // Since natsWrapper is a mocked function when we running test,
        // we can log it's parameter that we passed as below.
        // console.log(natsWrapper.client.publish.mock.calls);

        // When we access the mock.calls inside the jest mocked function, we get a
        // typescript warning, to by pass we can add //@ts-ignore above the call as above,
        // or we can wrap the call as below.
        // console.log((natsWrapper.client.publish as jest.Mock).mock.calls);

        const ticketUpdateData =
            JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

        expect(data.id).toEqual(ticketUpdateData.orderId);
    });
});
