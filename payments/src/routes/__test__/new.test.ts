import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
// Since we are using the mock jest.fn() to mock the natswarepper funtion, it mock the
// import as well, here we will get the mocked import even if we import the real wrapper.
import { Order } from '../../models/order';
import { OrderStatus } from '@ms-ticketing/common';

// This is same as importing the nats-wrapper.
// jest.mock('../../nats-wrapper');
// Instead of doing this on each file where it uses the nats-wrapper, we can
// put this into `test` setup.ts tile.

describe('New Route', () => {
    it('Should return 404 when purchasing an order that does not exist', async () => {
        await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin())
            .send({
                token: 'sdfsdf',
                orderId: mongoose.Types.ObjectId().toHexString(),
            }).expect(404);
    });

    it('Should return 401 purchasing an order which does not belong to the user', async () => {
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId: mongoose.Types.ObjectId().toHexString(),
            version: 0,
            price: 20,
            status: OrderStatus.Created,
        });
        await order.save();

        await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin())
            .send({
                token: 'sdfsdf',
                orderId: order.id,
            }).expect(401);
    });

    it('Should return 400 when purchasing cancelled order', async () => {
        const userId = mongoose.Types.ObjectId().toHexString();
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId,
            version: 0,
            price: 20,
            status: OrderStatus.Cancelled,
        });
        await order.save();

        await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin(userId))
            .send({
                token: 'sdfsdf',
                orderId: order.id,
            }).expect(401);
    });
});