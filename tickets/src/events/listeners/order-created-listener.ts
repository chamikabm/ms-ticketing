import { Listener, OrderCreatedEvent, Subjects } from '@ms-ticketing/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        // If no ticket, throw an error
        if(!ticket) {
            throw new Error('Ticket not found!');
        }

        // Mark the ticket as being reserved by setting it's orderId property
        ticket.set({ orderId: data.id });

        // Save the ticket
        await ticket.save();

        // Ack the message
        msg.ack();
    }
}