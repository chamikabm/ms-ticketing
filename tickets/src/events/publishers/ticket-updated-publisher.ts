import { Publisher, Subjects, TicketUpdatedEvent } from '@ms-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: TicketUpdatedEvent["subject"] = Subjects.TicketUpdated;
}