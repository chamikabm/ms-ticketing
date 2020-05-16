import { Publisher, Subjects, TicketsCreatedEvent } from '@ms-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketsCreatedEvent>{
    subject: TicketsCreatedEvent["subject"] = Subjects.TicketCreated;
}