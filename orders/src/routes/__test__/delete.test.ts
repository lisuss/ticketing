import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('should delete an order', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  const user = global.signin();

  await ticket.save();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to fetch the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
});

it('should emit an event when order cancelled', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  const user = global.signin();

  await ticket.save();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // make a request to fetch the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
