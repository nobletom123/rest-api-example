import request from "supertest";
import mongoose from "mongoose";
import { Blog } from "../../../models/blogs";

import { app } from "../../../app";

it("tests that a blog is updated correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdBlog = Blog.build({
    title: "Test",
    description: "Test description",
    body: "test body",
  });

  await createdBlog.save();

  const updateData = {
    title: "updated title",
    description: "updated description",
    body: "updated body",
  };

  const { body: updatedBlog } = await request(app)
    .put(`/blogs/${createdBlog._id}`)
    .set("Cookie", user)
    .send(updateData)
    .expect(200);

  expect(updateData.title).toBe(updatedBlog.title);
  expect(updateData.description).toBe(updatedBlog.description);
  expect(updateData.body).toBe(updatedBlog.body);
});
