import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";

it("tests that an blog is created correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const testData = {
    title: "test title",
    description: "test description",
    body: "test blog",
  };

  const {
    body: { title, description, body },
  } = await request(app)
    .post(`/blogs`)
    .set("Cookie", user)
    .send(testData)
    .expect(201);

  expect(title).toBe(testData.title);
  expect(description).toBe(testData.description);
  expect(body).toBe(testData.body);
});
