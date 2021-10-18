import request from "supertest";
import mongoose from "mongoose";

import { ProductCategory } from "../../../models/product-categories";
import { app } from "../../../app";

it("tests that an blog is deleted correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdProductCategory = ProductCategory.build({
    title: "Test",
    description: "Test description",
  });

  await request(app)
    .delete(`/product-categories/${createdProductCategory._id}`)
    .set("Cookie", user)
    .expect(201);
});
