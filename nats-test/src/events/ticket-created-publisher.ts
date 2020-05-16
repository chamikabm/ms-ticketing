import { Publisher } from './base-publisher';
import { TicketsCreatedEvent } from './tickets-created-event';
import { Subjects } from './subjects';

export class TicketCreatedPublisher extends Publisher<TicketsCreatedEvent>{
    subject: TicketsCreatedEvent['subject'] = Subjects.TicketCreated;
}