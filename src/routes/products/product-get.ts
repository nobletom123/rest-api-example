import express, { Request, Response } from "express";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { requireAuth } from "../../middlewares/require-auth";

import { Product } from "../../models/products";

const router = express.Router();

router.get(
  "/products/:id",
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const product = await Product.findById(id);

    if (!product.published) {
      throw new NotAuthorizedError();
    }

    response.status(200).send(product);
  }
);

export { router as productGet };
