import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { Comment } from "../../models/comments";
import { Product } from "../../models/products";

const router = express.Router();

router.post(
  "/comments",
  requireAuth,
  [body("text").isString()],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    const { text, product, blog } = request.body;
    const userId = request.currentUser!.id;

    if (!product && !blog) {
      throw new BadRequestError("Please specify product OR blog");
    }

    let doesNotExist;

    if (product) {
      const foundProduct = Product.findById(product);

      if (!foundProduct) {
        doesNotExist = "Product not found";
      }
    }

    if (blog) {
      const foundBlog = Product.findById(blog);

      if (!foundBlog) {
        doesNotExist = "Blog not found";
      }
    }

    if (doesNotExist) {
      throw new NotFoundError();
    }

    const newComment = Comment.build({
      user: userId,
      text,
      ...(product && { product }),
      ...(blog && { blog }),
    });

    await newComment.save();
    response.status(201).send(newComment);
  }
);

export { router as commentCreate };
