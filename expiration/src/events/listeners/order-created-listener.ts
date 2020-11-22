import {Listener, OrderCreatedEvent,Subjects } from '@myshtickets/common'
import {queueGroupName} from './queue-group-name'
import {Message} from 'node-nats-streaming'
import {expirationQueue} from '../../queues/expiration-queues'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg:Message){
       
       const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
       // console.log('waiting this many millisoconds to process the job:', delay)

       await expirationQueue.add({
            orderId: data.id
        },
        {
            delay //milliseconds
        }
        )

        msg.ack()
    }

}