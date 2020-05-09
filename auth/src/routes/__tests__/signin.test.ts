import request from 'supertest';
import { app } from '../../app';

describe('Signin Route', () => {
    it('Should failed when an supplied a none existing email', async () => {
        return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'sdfdfs',
            })
            .expect(400);
    });

    it('Should failed when an incorrect password used', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(201);

        return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password2',
            })
            .expect(400);
    });

    it('Should response with a cookie with valid credentials', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(201);

        const response = await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(200);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});