import request from "supertest";
import mongoose from "mongoose";

import { User } from "../../../models/user";
import { app } from "../../../app";
import { TypePredicateKind } from "typescript";

it("tests that an object is created correctly", async () => {
  const { body: retrievedUser } = await request(app)
    .post(`/api/auth/signup`)
    .send({
      firstName: "test",
      lastName: "test",
      email: "abc@email.com",
      password: "test1234",
    })
    .expect(201);

  expect(retrievedUser.firstName).toBe("test");
  expect(retrievedUser.lastName).toBe("test");
  expect(retrievedUser.email).toBe("abc@email.com");
});

it("tests that an admin object is created correctly", async () => {
  const { body: retrievedUser } = await request(app)
    .post(`/api/auth/signup`)
    .send({
      firstName: "test",
      lastName: "test",
      email: "abc@email.com",
      password: "test1234",
      admin: true,
      adminPassword: process.env.ADMIN_PASSWORD,
    })
    .expect(201);

  expect(retrievedUser.firstName).toBe("test");
  expect(retrievedUser.lastName).toBe("test");
  expect(retrievedUser.email).toBe("abc@email.com");
  expect(retrievedUser.admin).toBe(true);
});
