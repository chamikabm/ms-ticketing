import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
// Since we are using the mock jest.fn() to mock the natswarepper funtion, it mock the
// import as well, here we will get the mocked import even if we import the real wrapper.
import { Order } from '../../models/order';
import { OrderStatus } from '@ms-ticketing/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// This is same as importing the nats-wrapper.
// jest.mock('../../nats-wrapper');
// Instead of doing this on each file where it uses the nats-wrapper, we can
// put this into `test` setup.ts tile.

// Here we are commenting following line, as we are trying to do real test with the stripe.
// And we are not mocking the strip.ts, hence we have renamed strip.ts file
// inside the __mocks__ folder to strip.ts.no_use
//
// jest.mock('../../stripe');

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
            }).expect(400);
    });

    it.skip('Should return 201 with valid inputs with mock stirpe.js', async () => {
        // Skipping this test as we are no longer using mock stripe.js
        const userId = mongoose.Types.ObjectId().toHexString();
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId,
            version: 0,
            price: 20,
            status: OrderStatus.Created,
        });
        await order.save();

        await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin(userId))
            .send({
                token: 'tok_visa', // Stripe test token.
                orderId: order.id,
            }).expect(201);

        // When we access the mock.calls inside the jest mocked function, we get a
        // typescript warning, to by pass we can add //@ts-ignore above the call as above,
        // or we can wrap the call as below.
        // console.log((stripe.charges.create as jest.Mock).mock.calls);
        // mock.calls returns an array of arrays which has the called sequence array and call param array
        // Here mock.calls[0][0] means :
        // mock.calls[0] - First time invocation
        // mock.calls[0][0] - First time invocation input values

        const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
        expect(chargeOptions.source).toEqual('tok_visa');
        // Here 100 is there because stripe accept in the at most simple price unit(i.e for USD it's cents)
        // i.e 1 USD === 100 USD in cents
        expect(chargeOptions.amount).toEqual(order.price*100);
        expect(chargeOptions.currency).toEqual('usd');

    });

    it.only('Should return 201 with valid inputs with real stirpe.js', async () => {
        // Skipping this test as we are no longer using mock stripe.js
        const userId = mongoose.Types.ObjectId().toHexString();
        const price = Math.floor(Math.random() * 10000);
        const order = Order.build({
            id: mongoose.Types.ObjectId().toHexString(),
            userId,
            version: 0,
            price,
            status: OrderStatus.Created,
        });
        await order.save();

        await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin(userId))
            .send({
                token: 'tok_visa', // Stripe test token.
                orderId: order.id,
            }).expect(201);

        const stripeCharges = await stripe.charges.list({ limit : 50 });
        // Here 100 is there because stripe accept in the at most simple price unit(i.e for USD it's cents)
        // i.e 1 USD === 100 USD in cents
        const stripCharge = stripeCharges.data.find(charge => charge.amount === price * 100);
        expect(stripCharge).toBeDefined();

        const payment = await Payment.findOne({
            orderId: order.id,
            stripeId: stripCharge!.id,
        });
        expect(payment).not.toBeNull();
    });
});