import { Listener, OrderCreatedEvent, Subjects } from '@ms-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message): Promise<void> {
        await expirationQueue.add({
            orderId: data.id,
        });

        msg.ack();
    }
}