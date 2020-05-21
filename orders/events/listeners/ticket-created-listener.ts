import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketsCreatedEvent } from '@ms-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../src/models/ticket';

export class TicketCreatedListener extends Listener<TicketsCreatedEvent> {
    subject: TicketsCreatedEvent["subject"] =  Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketsCreatedEvent["data"], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price,
        });
        await ticket.save();

        msg.ack();
    }
}

