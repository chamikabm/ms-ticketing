import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

describe('Update Route', () => {
    it('Should return 404 if the ticket is not found for the given id.', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .put(`/api/tickets/${id}`)
            .set('Cookie', global.signin())
            .send({
                title: 'lkjgjkgd',
                price: 20,
            })
            .expect(404);
    });

    it('Should return 401 if the user is not authorized.', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .put(`/api/tickets/${id}`)
            .send({
                title: 'lkjgjkgd',
                price: 20,
            })
            .expect(401);
    });

    it('Should return 401 if the user does not own the requested ticket', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: 'lkjgjkgd',
                price: 20,
            })
            .expect(201);

        const createdTicket = response.body;

        await request(app)
            .put(`/api/tickets/${createdTicket.id}`)
            .set('Cookie', global.signin())
            .send({
                title: 'fdfd',
                price: 45,
            })
            .expect(401);
    });

    it('Should return 400 if the user provides an invalid price or title.', async () => {
        const cookie = global.signin();

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title: 'lkjgjkgd',
                price: 20,
            })
            .expect(201);
        const createdTicket = response.body;

        await request(app)
            .put(`/api/tickets/${createdTicket.id}`)
            .set('Cookie', cookie)
            .send({
                title: '',
                price: 45,
            })
            .expect(400);

        await request(app)
            .put(`/api/tickets/${createdTicket.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'dfgdfg',
                price: -45,
            })
            .expect(400);
    });

    it('Should update the ticket if user has provided valid inputs.', async () => {
        const cookie = global.signin();

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title: 'lkjgjkgd',
                price: 20,
            })
            .expect(201);
        const createdTicket = response.body;

        await request(app)
            .put(`/api/tickets/${createdTicket.id}`)
            .set('Cookie', cookie)
            .send({
                title: '12345678',
                price: 45,
            })
            .expect(200);
    });

    it('Should publish ticket updated event.', async () => {
        const cookie = global.signin();

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie',cookie)
            .send({
                title: 'lkjgjkgd',
                price: 20,
            })
            .expect(201);
        const createdTicket = response.body;

        await request(app)
            .put(`/api/tickets/${createdTicket.id}`)
            .set('Cookie', cookie)
            .send({
                title: '12345678',
                price: 45,
            })
            .expect(200);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});