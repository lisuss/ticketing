import { Publisher, OrderCreatedEvent, Subjects } from '@lisustickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
