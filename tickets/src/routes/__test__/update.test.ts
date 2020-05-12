import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('Update Route', () => {
    it('Should have a route handler to /api/tickets for post requests.', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({});

        expect(response.status).not.toEqual(404);
    });
});