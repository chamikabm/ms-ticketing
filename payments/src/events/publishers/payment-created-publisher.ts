import { Publisher, Subjects, PaymentCreatedEvent } from '@ms-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: PaymentCreatedEvent["subject"] = Subjects.PaymentCreated;
}
