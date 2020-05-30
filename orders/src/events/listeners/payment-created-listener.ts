import { Listener, PaymentCreatedEvent, Subjects } from '@ms-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order, OrderStatus } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: PaymentCreatedEvent["subject"] = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if(!order) {
            throw new Error('Order not found!');
        }

        // Ideally as we update the order here, basically it means that we are
        // creating a new version of a order, in such case we should emit an
        // order update event, but here we are not doing it, Order status complete is
        // out last event to be processed. But ideally we should emit to be
        // future proof of the system.
        order.set({
            status: OrderStatus.Complete,
        });
        await order.save();

        msg.ack();
    }
}