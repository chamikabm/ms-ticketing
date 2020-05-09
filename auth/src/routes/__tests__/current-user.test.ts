import request from 'supertest';
import { app } from '../../app';

describe('Current user Route', () => {
    it('Should returns 201 on successful signup', async () => {
        const authResponse = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'sdfdfs',
            })
            .expect(201);

        const cookie = authResponse.get('Set-Cookie');

        const response = await request(app)
            .get('/api/users/currentuser')
            .set('Cookie', cookie)
            .send()
            .expect(200);

        expect(response.body.currentUser.email).toEqual('test@test.com');
    });
});