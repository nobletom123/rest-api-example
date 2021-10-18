import request from "supertest";
import mongoose from "mongoose";
import { Product } from "../../../models/products";
import { app } from "../../../app";
import { stripe } from "../../../stripe";

it("tests that an object is created correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const creationData = {
    title: "test title",
    description: "test description",
    price: 10.05,
  };

  const { body: createdProduct } = await request(app)
    .post(`/api/objects/objects`)
    .set("Cookie", user)
    .send(creationData)
    .expect(201);

  expect(createdProduct.title).toBe(creationData.title);
  expect(createdProduct.description).toBe(creationData.description);
  expect(createdProduct.price).toBe(creationData.price);

  const retrievedProduct = await Product.findById(createdProduct.id);

  const stripeProduct = await stripe.products.retrieve(
    retrievedProduct.stripeProductId
  );

  const stripePrice = await stripe.prices.retrieve(
    retrievedProduct.stripePriceId
  );

  expect(!!stripeProduct).toBe(true);
  expect(!!stripePrice).toBe(true);
  expect(stripePrice.unit_amount).toBe(
    Number.parseInt(creationData.price.toString().split(".").join(""))
  );
});
