import {Listener, Subjects, ExpirationCompleteEvent} from '@myshtickets/common'
import {Message} from 'node-nats-streaming'
import { Order } from '../../models/order'
import {queueGroupName} from './queue-group-name'
import {OrderStatus} from '@myshtickets/common'
import {OrderCancelledPublisher} from '../publishers/order-cancelled-publisher'



export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
queueGroupName = queueGroupName
readonly subject = Subjects.ExpirationComplete

async onMessage(data:ExpirationCompleteEvent['data'], msg:Message){
  const order = await Order.findById(data.orderId).populate('ticket')

  if (!order){
      throw new Error('order not found')      
  }

  if (order.status === OrderStatus.Complete){
    return msg.ack()  // make sure the completed orders are not cancelled
  }

  order.set({
      status: OrderStatus.Cancelled
      })

await order.save()

await new OrderCancelledPublisher(this.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
        id: order.ticket.id
    }
})

msg.ack()

}

}