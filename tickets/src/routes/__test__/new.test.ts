import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// Since we are using the mock jest.fn() to mock the natswarepper funtion, it mock the
// import as well, here we will get the mocked import even if we import the real wrapper.
import { natsWrapper } from '../../nats-wrapper';

// This is same as importing the nats-wrapper.
// jest.mock('../../nats-wrapper');
// Instead of doing this on each file where it uses the nats-wrapper, we can
// put this into `test` setup.ts tile.

describe('New Route', () => {
    it('Should have a route handler to /api/tickets for post requests.', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({});

        expect(response.status).not.toEqual(404);
    });

    it('Should only be accessed if user is signed in.', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({});

        expect(response.status).toEqual(401);
    });

    it('Should return status other than 401 if user is signed in.', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({});

        expect(response.status).not.toEqual(401);
    });

    it('Should return an error if invalid title is provided.', async () => {
         await request(app)
             .post('/api/tickets')
             .set('Cookie', global.signin())
             .send({
                title: '',
                price: 10,
             })
             .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                price: 10,
            })
            .expect(400);
    });

    it('Should return an error if invalid price is provided.', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: 'adfdaf',
                price: -10,
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: 'adfdaf',
                price: -10,
            })
            .expect(400);
    });

    it('Should create a ticket if valid inputs are provided.', async () => {
        let tickets = await Ticket.find({}); // Get all the tickets inside the collection.
        expect(tickets.length).toEqual(0);

        const title = 'asdfasdf';

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title,
                price: 20,
            })
            .expect(201);

        tickets = await Ticket.find({});
        expect(tickets.length).toEqual(1);
        expect(tickets[0].price).toEqual(20);
        expect(tickets[0].title).toEqual(title);
    });

    it('Should publish ticket created event.', async () => {
        const title = 'asdfasdf';

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title,
                price: 20,
            })
            .expect(201);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});