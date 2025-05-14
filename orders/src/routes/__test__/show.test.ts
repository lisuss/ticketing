import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  const user = global.signin();

  //create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);
});

it('returns an error if one user tries to fetch another user order', async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
