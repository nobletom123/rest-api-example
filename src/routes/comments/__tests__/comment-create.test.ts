import request from "supertest";
import mongoose from "mongoose";
import { Blog } from "../../../models/blogs";

import { app } from "../../../app";

it("tests that a comment is created correctly for a post", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdBlog = Blog.build({
    title: "Test",
    description: "Test description",
    body: "test body",
  });

  await createdBlog.save();

  const testData = {
    text: "test text",
    blog: createdBlog._id,
  };

  const {
    body: { text, blog },
  } = await request(app)
    .post(`/comments`)
    .set("Cookie", user)
    .send(testData)
    .expect(201);

  expect(text).toBe(testData.text);
  expect(blog).toBe(testData.blog);
});
