import {Subjects, Publisher, ExpirationCompleteEvent} from '@myshtickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}