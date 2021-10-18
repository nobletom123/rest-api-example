import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { stripe } from "../../stripe";
import { Product } from "../../models/products";

const router = express.Router();

router.put(
  "/products/:id",
  requireAuth,
  [
    body("title").isString(),
    body("description").isString(),
    body("image").isString(),
  ],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    const { title, description, image } = request.body;
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const product = await Product.findById(id);
    const stripeUpdateData: {
      name?: string;
      description?: string;
      image?: string;
    } = {};

    if (title) {
      product.title = title;
      stripeUpdateData.name = title;
    }

    if (description) {
      product.description = description;
      stripeUpdateData.description = description;
    }

    if (image) {
      product.image = image;
      stripeUpdateData.image = image;
    }

    await stripe.products.update(product.stripeProductId, stripeUpdateData);
    await product.save();
    response.status(201).send(product);
  }
);

export { router as productCreate };
