import { ExpirationCompleteEvent, Publisher, Subjects } from '@ms-ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}