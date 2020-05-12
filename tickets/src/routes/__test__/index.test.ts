import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title : 'sdfsf',
            price: 20,
        })
}

describe('Index Route', () => {
    it('Should fetch list of tickers.', async () => {

        // Create 3 Tickets - Different Ids
        await createTicket();
        await createTicket();
        await createTicket();

        const ticketsResponse = await request(app)
            .get('/api/tickets')
            .send()
            .expect(200);

        expect(ticketsResponse.body.length).toEqual(3);
    });
});