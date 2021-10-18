import express, { Request, Response } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import { body } from "express-validator";
import { Comment } from "../../models/comments";

const router = express.Router();

router.get(
  "/comments",
  [body("product").isEmpty(), body("blog").isEmpty()],
  validateRequest,
  async (request: Request, response: Response) => {
    const { product, blog } = request.body;
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const comments = Comment.find({
      ...(product && { product }),
      ...(blog && { blog }),
    });

    response.status(200).send(comments);
  }
);

export { router as commentGetMany };
