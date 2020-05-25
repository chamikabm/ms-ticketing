import { Listener, OrderCreatedEvent, Subjects } from '@ms-ticketing/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
// import { natsWrapper } from '../../nats-wrapper';

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
        // new TicketUpdatedPublisher(natsWrapper.client).publish({
        // We don't need to do this because we make base listener class nats
        // client variable access modifier to protected from being private
        // so that extended classes can access that client like below using this.
        new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId,
        });

        // Ack the message
        msg.ack();
    }
}