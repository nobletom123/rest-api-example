import request from "supertest";
import mongoose from "mongoose";

import { Comment } from "../../../models/comments";
import { app } from "../../../app";

it("tests that an comment is deleted correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdComment = Comment.build({
    text: "Test",
    blog: new mongoose.Types.ObjectId().toHexString(),
    user: userId,
  });

  await createdComment.save();

  await request(app)
    .delete(`/comments/${createdComment._id}`)
    .set("Cookie", user)
    .send({})
    .expect(201);

  const deletedComment = await Comment.findById(createdComment._id);

  expect(deletedComment).toBe(null);
});
