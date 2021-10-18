import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";

it("tests that a product category is created correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const testData = {
    title: "test title",
    description: "test description",
  };

  const {
    body: { title, description, body },
  } = await request(app)
    .post(`/product-categories`)
    .set("Cookie", user)
    .send(testData)
    .expect(201);

  expect(title).toBe(testData.title);
  expect(description).toBe(testData.description);
});
