import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on succesfull signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 on unsucesful singup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'asd', password: 'password' })
    .expect(400);
});

it('returns a 400 on unsucesful singup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'asd', password: '1' })
    .expect(400);
});

it('returns a 400 on no email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({ password: '123' })
    .expect(400);
});

it('disallows duplicate emails', async () => {
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

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
