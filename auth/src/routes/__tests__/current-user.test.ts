import request from 'supertest';
import { app } from '../../app';

describe('Current user Route', () => {
    it('Should returns 201 on successful signup', async () => {
        const cookie = await global.signin();
        const response = await request(app)
            .get('/api/users/currentuser')
            .set('Cookie', cookie)
            .send()
            .expect(200);

        expect(response.body.currentUser.email).toEqual('test@test.com');
    });

    it('Should returns null for currentUser if not authenticated', async () => {
        const response = await request(app)
            .get('/api/users/currentuser')
            .send()
            .expect(200);

        expect(response.body.currentUser).toEqual(null);
    });
});