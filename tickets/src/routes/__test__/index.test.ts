import request from 'supertest';
import { app } from '../../app';
jest.mock('../../nats-wrapper');

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'anytitle', price: 30 });
};

it('should return all tickets when anyone reaches the endpoint', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
