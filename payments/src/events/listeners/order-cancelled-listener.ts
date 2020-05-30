import {
    Listener, OrderCancelledEvent, OrderStatus, Subjects,
} from '@ms-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        }); // As we did before we can extract this findOne method to order model itself.

        if(!order) {
            throw new Error('Order not found!');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}