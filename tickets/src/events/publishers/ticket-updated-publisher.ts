import { Publisher, Subjects, TicketsUpdatedEvent } from '@ms-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketsUpdatedEvent>{
    subject: TicketsUpdatedEvent["subject"] = Subjects.TicketUpdated;
}