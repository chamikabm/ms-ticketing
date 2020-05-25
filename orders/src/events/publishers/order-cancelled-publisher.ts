import { OrderCancelledEvent, Publisher, Subjects } from '@ms-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
}