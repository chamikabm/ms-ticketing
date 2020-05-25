import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketsCreatedEvent } from '@ms-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // Create an instance of the listener.
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Create fake data event
    const data: TicketsCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return { listener, data, message };
};

describe('Ticket Created Lister', () => {
    it('Should create and saves a ticket.', async () => {

        const { listener, data, message } = await setup();

        // Call the onMessage function
        await listener.onMessage(data, message);

        // Write assertions to make sure that the ticket is created
        const ticket = await Ticket.findById(data.id);

        expect(ticket).toBeDefined();
        expect(ticket!.title).toEqual(data.title);
        expect(ticket!.price).toEqual(data.price);
    });

    it('Should ack the message.', async () => {

        const { listener, data, message } = await setup();

        // Call the onMessage function
        await listener.onMessage(data, message);

        // Write assertions to make sure that ack function is called
        expect(message.ack).toHaveBeenCalled();
    });
});