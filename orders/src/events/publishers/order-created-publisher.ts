import { OrderCreatedEvent, Publisher, Subjects } from '@ms-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
}
