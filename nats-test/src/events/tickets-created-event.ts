import { Subjects } from './subjects';

export interface TicketsCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    }
}