import { Publisher, OrderCreatedEvent, Subjects } from '@myshtickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
