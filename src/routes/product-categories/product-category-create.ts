import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";

import { ProductCategory } from "../../models/product-categories";

const router = express.Router();

router.post(
  "/product-categories",
  requireAuth,
  [body("title").not().isEmpty(), body("description").not().isEmpty()],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    const { title, description } = request.body;
    const userId = request.currentUser!.id;

    const productCategory = { title, description };

    const newProductCategory = ProductCategory.build(productCategory);
    await newProductCategory.save();

    response.status(201).send(newProductCategory);
  }
);

export { router as productCategoryCreate };
