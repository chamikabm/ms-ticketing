import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketsUpdatedEvent } from '@ms-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../src/models/ticket';

export class TicketUpdatedListener extends Listener<TicketsUpdatedEvent> {
    subject: TicketsUpdatedEvent["subject"] = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketsUpdatedEvent["data"], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const ticket = await Ticket.findById(id);
        if(!ticket) {
            throw Error('Ticket not found!');
        }

        ticket.set({ title, price });
        await ticket.save();

        msg.ack();
    }
}