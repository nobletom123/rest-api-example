import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";
import { Product } from "../../../models/products";
import { stripe } from "../../../stripe";

it("tests that an object is deleted correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);
  const createProductData = {
    title: "Delete Object Test",
    description: "Delete product description",
  };
  const stripeProduct = await stripe.products.create({
    name: createProductData.title,
  });

  const newProduct = Product.build({
    ...createProductData,
    stripeProductId: stripeProduct.id,
  });
  await newProduct.save();

  await request(app)
    .delete(`/products/${newProduct._id}`)
    .set("Cookie", user)
    .expect(201);

  const foundProduct = await Product.findById(newProduct._id);

  expect(foundProduct).toBe(null);
});
