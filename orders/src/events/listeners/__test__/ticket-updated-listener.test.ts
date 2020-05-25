import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketsUpdatedEvent } from '@ms-ticketing/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // Create an instance of the listener.
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // Create and Save a Ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    // Create fake data event
    const data: TicketsUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // Create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return { listener, data, ticket, message };
};

describe('Ticket Updated Lister', () => {
    it('Should finds, updates and saves a ticket.', async () => {

        const { listener, data, ticket, message } = await setup();

        // Call the onMessage function
        await listener.onMessage(data, message);

        // Write assertions to make sure that the ticket is created
        const updatedTicket = await Ticket.findById(ticket.id);

        expect(updatedTicket).toBeDefined();
        expect(updatedTicket!.title).toEqual(data.title);
        expect(updatedTicket!.price).toEqual(data.price);
        expect(updatedTicket!.version).toEqual(data.version);
    });

    it('Should ack the message.', async () => {

        const { listener, data, ticket, message } = await setup();

        // Call the onMessage function
        await listener.onMessage(data, message);

        // Write assertions to make sure that ack function is called
        expect(message.ack).toHaveBeenCalled();
    });
});