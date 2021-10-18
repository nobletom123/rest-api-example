import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { Comment } from "../../models/comments";

const router = express.Router();

router.get(
  "/comments/:id",
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const comment = await Comment.findById(id);

    response.status(200).send(comment);
  }
);

export { router as commentGet };
