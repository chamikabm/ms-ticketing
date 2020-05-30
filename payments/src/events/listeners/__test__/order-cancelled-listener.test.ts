import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from '@ms-ticketing/common';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // Create new Order
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'ddf',
        version: 0,
    });
    await order.save();

    // Create fake data event.
    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'popop',
        }
    };

    // Create fake msg.
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    };

    return { message, data, order, listener };
};

describe('Order Cancelled Lister', () => {
    it('Should update the status of the order.', async () => {
        const { message, data, listener, order } = await setup();
        await listener.onMessage(data, message);

        const updatedOrder = await Order.findById(order.id);

        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it('Should acks the message.', async () => {
        const { message, data, listener } = await setup();
        await listener.onMessage(data, message);

        expect(message.ack).toHaveBeenCalled();
    });
});
