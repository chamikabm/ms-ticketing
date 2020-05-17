import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    return ticket;
};

describe('Show Route', () => {
    it('Should fetch orders for particular user.', async () => {
        // Create a ticket.
        const ticket = await buildTicket();

        const userCookie = global.signin();

        // Make a request to build an order with this ticket.
        const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', userCookie)
            .send({ ticketId: ticket.id })
            .expect(201);

        // Make request to fetch the order
        const { body: fetchedOrder } = await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', userCookie)
            .expect(200);
        expect(fetchedOrder.id).toEqual(order.id);
    });

    it('Should returns an error if one user tries to fetch another user order.', async () => {
        // Create a ticket.
        const ticket = await buildTicket();

        const userCookie = global.signin();
        // Make a request to build an order with this ticket.
        const { body: order } = await request(app)
            .post('/api/orders')
            .set('Cookie', userCookie)
            .send({ ticketId: ticket.id })
            .expect(201);

        // Make request to fetch the order
        await request(app)
            .get(`/api/orders/${order.id}`)
            .set('Cookie', global.signin())
            .send()
            .expect(401);
    });
});