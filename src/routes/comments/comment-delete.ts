import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { Comment } from "../../models/comments";

const router = express.Router();

router.delete(
  "/comments/:id",
  requireAuth,
  async (request: Request, result: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const comment = await Comment.findById(id);

    if (!comment) {
      throw new NotFoundError();
    }

    await comment.delete();

    result.status(201).json({ delete: true });
  }
);

export { router as commentDelete };
