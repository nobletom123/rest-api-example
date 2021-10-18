import request from "supertest";
import mongoose from "mongoose";
import { ProductCategory } from "../../../models/product-categories";
import { app } from "../../../app";

it("tests that an product categories is retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdBlog = ProductCategory.build({
    title: "Test",
    description: "Test description",
  });

  const createdProductCategoryTwo = ProductCategory.build({
    title: "Test",
    description: "Test description",
  });

  const { body: retrievedProductCategories } = await request(app)
    .get(`/product-categories`)
    .set("Cookie", user)
    .expect(200);

  expect(retrievedProductCategories.length).toBe(2);
});
