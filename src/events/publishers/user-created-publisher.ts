import { Subjects, Publisher, UserCreatedEvent } from "@noereum/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
