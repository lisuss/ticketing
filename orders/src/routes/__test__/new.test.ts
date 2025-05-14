import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exisst', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(403);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Order.build({
    userId: '12345',
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves the ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('Emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
