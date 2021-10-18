import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { Product } from "../../../models/products";

it("tests that several comments are retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createdProduct = Product.build({
    title: "Delete Object Test",
    description: "Delete product description",
    stripeProductId: "fake-id",
  });

  await createdProduct.save();

  const createdProductTwo = Product.build({
    title: "Delete Object Test",
    description: "Delete product description",
    stripeProductId: "fake-id",
  });

  await createdProductTwo.save();

  const { body: retrievedProducts } = await request(app)
    .get(`/products`)
    .set("Cookie", user)
    .expect(200);

  expect(retrievedProducts.length).toBe(2);
});
