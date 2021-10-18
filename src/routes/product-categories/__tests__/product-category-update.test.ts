import request from "supertest";
import mongoose from "mongoose";
import { ProductCategory } from "../../../models/product-categories";

import { app } from "../../../app";

it("tests that a blog is updated correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdProductCateogory = ProductCategory.build({
    title: "Test",
    description: "Test description",
  });

  await createdProductCateogory.save();

  const updateData = {
    title: "updated title",
    description: "updated description",
  };

  const { body: updatedProductCategory } = await request(app)
    .put(`/product-categories/${createdProductCateogory._id}`)
    .set("Cookie", user)
    .send(updateData)
    .expect(200);

  expect(updateData.title).toBe(updatedProductCategory.title);
  expect(updateData.description).toBe(updatedProductCategory.description);
});
