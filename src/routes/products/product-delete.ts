import express, { Request, Response } from "express";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { Product } from "../../models/products";
import { stripe } from "../../stripe";

const router = express.Router();

router.delete(
  "/products/:id",
  requireAuth,
  async (request: Request, result: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const product = await Product.findById(id);

    if (!product) {
      throw new NotFoundError();
    }
    const deletedProduct = await stripe.products.del(id);
    await product.delete();

    result.status(201).json({ deleted: true });
  }
);

export { router as productDelete };
