import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    return ticket;
};

describe('Delete Route', () => {
    it('Should mark order as an cancelled.', async () => {
        // Create a ticket with Ticket model
        const ticket = await buildTicket();

        const userCookie = global.signin();

        // Make a request to create an Order
        const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', userCookie)
            .send({ ticketId: ticket.id })
            .expect(201);

        // Make a request to cancel an Order
        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', userCookie)
            .send()
            .expect(204);

        // Expectation to make sure the order is cancelled.
         const canceledOrder = await Order.findById(order.id);
         expect(canceledOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it('Should emit order cancelled event.', async () => {
// Create a ticket with Ticket model
        const ticket = await buildTicket();

        const userCookie = global.signin();

        // Make a request to create an Order
        const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', userCookie)
            .send({ ticketId: ticket.id })
            .expect(201);

        // Make a request to cancel an Order
        await request(app)
            .delete(`/api/orders/${order.id}`)
            .set('Cookie', userCookie)
            .send()
            .expect(204);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});