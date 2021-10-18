import request from "supertest";
import mongoose from "mongoose";
import { Comment } from "../../../models/comments";

import { app } from "../../../app";

it("tests that several comments are retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdComment = Comment.build({
    text: "Test",
    user: userId,
    blog: new mongoose.Types.ObjectId().toHexString(),
  });

  await createdComment.save();

  const createdCommentTwo = Comment.build({
    text: "Test",
    user: userId,
    blog: new mongoose.Types.ObjectId().toHexString(),
  });

  await createdCommentTwo.save();

  const { body: retrievedComments } = await request(app)
    .get(`/comments`)
    .set("Cookie", user)
    .expect(200);

  expect(retrievedComments.length).toBe(2);
});
