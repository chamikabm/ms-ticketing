import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketsCreatedEvent } from './tickets-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketsCreatedEvent> {
    subject: TicketsCreatedEvent['subject'] =  Subjects.TicketCreated;
    // subject: Subjects.TicketCreated =  Subjects.TicketCreated; // Also correct
    queueGroupName = 'payments-service';

    onMessage(data: TicketsCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data);
        console.log(data.id);
        msg.ack();
    }
}