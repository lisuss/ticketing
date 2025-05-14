import request from 'supertest';
import { app } from '../../app';

it('returns 400 when login with incorrect password/emal', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'asd@gmail.com', password: 'eses' })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '1234' })
    .expect(201);
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: '12345' })
    .expect(400);
});

it('respondes with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '1234' })
    .expect(201);
  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: '1234' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
