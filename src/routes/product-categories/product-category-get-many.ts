import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { ProductCategory } from "../../models/product-categories";

const router = express.Router();

router.get(
  "/product-categories",
  requireAuth,
  async (request: Request, response: Response) => {
    const userId = request.currentUser!.id;

    const productCategories = await ProductCategory.find();

    response.status(200).send(productCategories);
  }
);

export { router as productCategoryGetMany };
