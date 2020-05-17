import { OrderCreatedEvent, Publisher, Subjects } from '../../../common/src';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated;
}
