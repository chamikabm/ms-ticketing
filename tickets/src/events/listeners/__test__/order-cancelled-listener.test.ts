import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent, OrderStatus } from '@ms-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();

    // Create and Save a ticket.
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
        userId: 'sdfsdf',
    });
    ticket.set({ orderId });
    await ticket.save();

    // Create fake data event.
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    };

    // Create fake msg.
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { message, data, ticket, listener, orderId };
};

describe('Order Cancelled Lister', () => {
    it('Should update the ticket, publishes and event and ack the message.', async () => {
        const { message, data, ticket, listener, orderId } = await setup();

        await listener.onMessage(data, message);
        const updatedTicket = await Ticket.findById(ticket.id);
        expect(updatedTicket!.orderId).not.toBeDefined();
        expect(message.ack).toHaveBeenCalled();
        expect(natsWrapper.client.publish).toHaveBeenCalled();

    });
});
