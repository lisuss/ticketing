import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from '@lisustickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
