import jwt from "jsonwebtoken";
import { TokenType } from "../token-builder";
import { verifyEmailToken } from "../verify-token";

test("Test verify email token function works as expected", async () => {
  const fakeToken = await jwt.sign(
    {
      email: "test-email@gmail.com",
      type: TokenType.EmailVerificationToken,
    },
    process.env.JWT_SECRET!
  );

  const validationResult = await verifyEmailToken(
    fakeToken,
    "test-email@gmail.com"
  );

  expect(validationResult).toBe(true);
});
