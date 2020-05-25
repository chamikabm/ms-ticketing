import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from "mongoose";
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
import { ExpirationCompleteEvent, OrderStatus } from '@ms-ticketing/common';

const setup = async () => {
    // Create an instance of the listener.
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'sfsdfs',
        expiresAt: new Date(),
        ticket,
    });
    await order.save();

    // Create fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    // Create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn(),
    }

    return { listener, order, ticket, data, message };
};


describe('Expiration Complete Lister', () => {
    it('Should update the order status to cancelled.', async () => {
        const { listener, order, data, message } = await setup();
        await listener.onMessage(data, message);
        const updatedOrder = await Order.findById(order.id);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it('Should emit an OrderCancelled event.', async () => {
        const { listener, order, data, message } = await setup();
        await listener.onMessage(data, message);
        expect(natsWrapper.client.publish).toHaveBeenCalled();

        const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
        expect(eventData.id).toEqual(order.id);
    });

    it('Should ack the message.', async () => {
        const { listener, data, message } = await setup();
        await listener.onMessage(data, message);
        expect(message.ack).toHaveBeenCalled();
    });
});