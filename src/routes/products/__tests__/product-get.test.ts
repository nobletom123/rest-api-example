import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { Product } from "../../../models/products";

it("tests that an object is retrieved correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const createProductData = {
    title: "Delete Object Test",
    description: "Delete product description",
    stripeProductId: "fake-id",
  };

  const newProduct = Product.build(createProductData);
  await newProduct.save();

  const { body: retrievedProduct } = await request(app)
    .get(`/products/${newProduct._id}`)
    .set("Cookie", user)
    .expect(201);

  expect(retrievedProduct.title).toBe(createProductData.title);
  expect(retrievedProduct.description).toBe(createProductData.description);
});
