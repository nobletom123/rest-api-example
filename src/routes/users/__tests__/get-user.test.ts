import request from "supertest";
import mongoose from "mongoose";

import { User } from "../../models/user";
import { app } from "../../app";

it("tests that an object is created correctly", async () => {
  const testUser = User.build({
    email: "test-email123@email.com",
    password: "test123",
    firstName: "test",
    lastName: "test",
  });

  await testUser.save();

  const user = global.signin(testUser._id);

  const {
    body: { currentUser },
  } = await request(app)
    .get(`/api/auth/currentuser`)
    .set("Cookie", user)
    .expect(200);

  expect(currentUser.id).toBe(testUser._id.toString());
});
