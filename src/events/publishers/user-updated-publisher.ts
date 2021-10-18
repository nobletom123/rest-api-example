import { Subjects, Publisher, UserUpdatedEvent } from "@noereum/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
