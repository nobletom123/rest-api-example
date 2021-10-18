import { sendVerificationEmail } from "../send-email-verification";

test("Email is sent without error", async () => {
  await sendVerificationEmail("ttbnoble@gmail.com", "test-id");
});
