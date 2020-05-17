import { OrderCancelledEvent, Publisher, Subjects } from '../../../common/src';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled;
}