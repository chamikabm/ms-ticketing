import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('Show Route', () => {
    it('Should return 404 if the ticket is not found.', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
             .get(`/api/tickets/${id}`)
             .send()
             .expect(404);
    });

    it('Should return the ticket if the ticket is found.', async () => {
        const title = 'concert';
        const price = 20;
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title,
                price,
            })
            .expect(201);

        const createdTicket = response.body;
        const ticketResponse = await request(app)
            .get(`/api/tickets/${createdTicket.id}`)
            .send()
            .expect(200);

        expect(createdTicket.title).toEqual(title);
        expect(createdTicket.price).toEqual(price);
    });
});