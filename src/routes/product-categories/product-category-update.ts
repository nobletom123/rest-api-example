import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { ProductCategory } from "../../models/product-categories";

const router = express.Router();

router.put(
  "/product-categories/:id",
  requireAuth,
  [body("title").isEmpty(), body("description").isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);
    const userId = req.currentUser!.id;

    if (productCategory) {
      throw new NotFoundError();
    }

    if (title) {
      productCategory.title = title;
    }

    if (description) {
      productCategory.description = description;
    }

    res.status(200).send(productCategory);
  }
);

export { router as productCategoryUpdate };
