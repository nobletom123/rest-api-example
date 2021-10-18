import request from "supertest";
import mongoose from "mongoose";
import { ProductCategory } from "../../../models/product-categories";
import { app } from "../../../app";

it("tests that an product category is retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdProductCategory = ProductCategory.build({
    title: "Test",
    description: "Test description",
  });

  const { body: retrievedProductCategory } = await request(app)
    .get(`/product-categories/${createdProductCategory._id}`)
    .set("Cookie", user)
    .expect(200);

  expect(createdProductCategory.title).toBe(retrievedProductCategory.title);
  expect(createdProductCategory.description).toBe(
    retrievedProductCategory.description
  );
});
