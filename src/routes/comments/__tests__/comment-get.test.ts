import request from "supertest";
import mongoose from "mongoose";
import { Comment } from "../../../models/comments";

import { app } from "../../../app";

it("tests that an object is retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdComment = Comment.build({
    text: "Test",
    blog: new mongoose.Types.ObjectId().toHexString(),
    user: userId,
  });

  await createdComment.save();

  const { body: retrievedComment } = await request(app)
    .get(`/comment/${createdComment._id}`)
    .set("Cookie", user)
    .expect(200);

  expect(retrievedComment.text).toBe(createdComment.text);
  expect(retrievedComment.blog).toBe(createdComment.blog);
  expect(retrievedComment.user).toBe(createdComment.user);
});
