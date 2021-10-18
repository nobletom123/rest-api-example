import request from "supertest";
import mongoose from "mongoose";
import { Blog } from "../../../models/blogs";

import { app } from "../../../app";

it("tests that an object is retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdBlog = Blog.build({
    title: "Test",
    description: "Test description",
    body: "test body",
  });

  const { body: retrievedModel } = await request(app)
    .get(`/blogs/${createdBlog._id}`)
    .set("Cookie", user)
    .expect(200);

  expect(updateData.title).toBe(updatedBlog.title);
  expect(updateData.description).toBe(updatedBlog.description);
  expect(updateData.body).toBe(updatedBlog.body);
});
