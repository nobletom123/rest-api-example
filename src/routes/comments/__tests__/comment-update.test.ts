import request from "supertest";
import mongoose from "mongoose";
import { Comment } from "../../../models/comments";

import { app } from "../../../app";

it("tests that a comment is updated correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdComment = Comment.build({
    text: "Test",
    blog: new mongoose.Types.ObjectId().toHexString(),
    user: userId,
  });

  await createdComment.save();

  const updateData = {
    text: "updated title",
  };

  const { body: updatedComment } = await request(app)
    .put(`/comments/${createdComment._id}`)
    .set("Cookie", user)
    .send(updateData)
    .expect(200);

  expect(updateData.text).toBe(updatedComment.text);
});
