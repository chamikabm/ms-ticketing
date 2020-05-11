import request from 'supertest';
import { app } from '../../app'

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

    });

    it('Should return an error if invalid price is provided.', async () => {

    });

    it('Should create a ticket if valid inputs are provided.', async () => {

    });
});