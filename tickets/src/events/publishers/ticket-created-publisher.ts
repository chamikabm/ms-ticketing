import { Publisher, Subjects, TicketCreatedEvent } from '@ms-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
}