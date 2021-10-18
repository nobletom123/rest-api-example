import request from "supertest";
import mongoose from "mongoose";

import { Blog } from "../../../models/blogs";
import { app } from "../../../app";

it("tests that an blog is deleted correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdBlog = Blog.build({
    title: "Test",
    description: "Test description",
    body: "test body",
  });

  await request(app)
    .delete(`/blogs/${createdBlog._id}`)
    .set("Cookie", user)
    .send({})
    .expect(201);
});
