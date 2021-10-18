import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { User } from "../../models/user";
import { app } from "../../app";
import { TokenType } from "../../library/token-builder";

test("Test that profile authentication factor validation works for emails on first signup", async () => {
  const testUser = User.build({
    email: "test-email123@email.com",
    password: "test123",
    firstName: "test",
    lastName: "test",
    emailValidated: false,
  });

  await testUser.save();

  const emailToken = await jwt.sign(
    {
      id: testUser._id,
      email: "test-email123@email.com",
      type: TokenType.EmailVerificationToken,
    },
    process.env.JWT_SECRET!
  );

  const user = global.signin(testUser._id);

  const { body } = await request(app)
    .post(`/api/auth/profiles/authentication-factor`)
    .set("Cookie", user)
    .send({ emailToken })
    .expect(200);

  const retrieveUser = await User.findById(testUser._id);

  expect(retrieveUser!.emailValidated).toBe(true);
});
