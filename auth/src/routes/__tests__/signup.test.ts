import request from 'supertest';
import { app } from '../../app';

describe('Signup', () => {
    it('should returns 201 on successful signup', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'sdfdfs',
            })
            .expect(201);
    });
});