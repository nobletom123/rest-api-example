import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { BadRequestError } from "../../errors/bad-request-error";
import { stripe } from "../../stripe";
import { Product } from "../../models/products";
import { parsePrice } from "../../library/parse-price";

const router = express.Router();

router.post(
  "/products",
  requireAuth,
  [
    body("title").isString(),
    body("description").isString(),
    body("price").isNumeric(),
  ],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    const { title, description, image, price: requestPrice } = request.body;
    const userId = request.currentUser!.id;

    const price = parsePrice(requestPrice);

    const newStripeProduct = await stripe.products.create({
      name: title,
      description,
      ...(image && { image }),
    });

    const newStripePrice = await stripe.prices.create({
      product: newStripeProduct.id,
      currency: "GBP",
      unit_amount: price,
    });

    const newProductData = {
      title,
      description,
      stripeProductId: newStripeProduct.id,
      stripePriceId: newStripePrice.id,
    };

    const newProduct = Product.build(newProductData);

    await newProduct.save();
    response.status(201).send(newProduct);
  }
);

export { router as productCreate };
