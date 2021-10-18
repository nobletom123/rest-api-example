import { Subjects, Publisher, UserDeletedEvent } from "@noereum/common";

export class UserDeletedPublisher extends Publisher<UserDeletedEvent> {
  subject: Subjects.UserDeleted = Subjects.UserDeleted;
}
