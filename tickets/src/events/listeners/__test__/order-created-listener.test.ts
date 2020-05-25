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
});
