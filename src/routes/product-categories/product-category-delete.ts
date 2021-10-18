import express, { Request, Response } from "express";
import { ProductCategory } from "../../models/product-categories";

import { requireAuth } from "../../middlewares/require-auth";
import { NotFoundError } from "../../errors/not-found-error";

const router = express.Router();

router.delete(
  "/product-categories/:id",
  requireAuth,
  async (request: Request, result: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      throw new NotFoundError();
    }

    await productCategory.delete();

    result.status(201).json({ delete: true });
  }
);

export { router as productCategoryDelete };
