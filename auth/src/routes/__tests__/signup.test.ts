import request from 'supertest';
import { app } from '../../app';

describe('Signup Route', () => {
    it('Should returns 201 on successful signup', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'sdfdfs',
            })
            .expect(201);
    });

    it('Should returns 400 with an invalid email', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'te.com',
                password: 'sdfdfs',
            })
            .expect(400);
    });

    it('Should returns 400 with an invalid password', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'sdd@te.com',
                password: '',
            })
            .expect(400);
    });

    it('Should returns 400 with an invalid email and password', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'sd.com',
                password: '',
            })
            .expect(400);
    });

    it('Should disallow duplicate email signups', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(201);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(400);
    });


    it('Should sets a cookie after successful signup', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password',
            })
            .expect(201);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});