import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { NotFoundError } from "../../errors/not-found-error";
import { ProductCategory } from "../../models/product-categories";

const router = express.Router();

router.get(
  "/product-category/:id",
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const productCategory = await ProductCategory.findById(id);

    response.status(200).send(productCategory);
  }
);

export { router as productCategoryGet };
