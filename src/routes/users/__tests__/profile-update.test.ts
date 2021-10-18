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

  console.log("createdUser", testUser);

  const { body: updatedUser } = await request(app)
    .put(`/api/auth/profiles/${testUser._id}`)
    .set("Cookie", user)
    .send({
      firstName: "update",
      lastName: "update 2",
    })
    .expect(200);

  expect(updatedUser.firstName).toBe("update");
  expect(updatedUser.lastName).toBe("update 2");
});
