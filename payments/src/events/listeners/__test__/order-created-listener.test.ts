import { OrderCreatedListener } from '../order-created-listener';
import mongoose from "mongoose";
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@ms-ticketing/common';
import { Order } from '../../../models/order';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create fake data event.
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'kjjjlkj',
        expiresAt: 'kjhkjh',
        ticket: {
            id: 'popop',
            price: 10,
        }
    };

    // Create fake msg.
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { message, data, listener };
};

describe('Order Created Lister', () => {
    it('Should replicates the order info.', async () => {
        const { message, data, listener } = await setup();
        await listener.onMessage(data, message);

        const order = await Order.findById(data.id);

        expect(order!.price).toEqual(data.ticket.price);
    });

    it('Should acks the message.', async () => {
        const { message, data, listener } = await setup();
        await listener.onMessage(data, message);

        expect(message.ack).toHaveBeenCalled();
    });
});
