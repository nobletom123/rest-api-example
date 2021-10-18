import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth } from "../../middlewares/require-auth";
import { Comment } from "../../models/comments";

const router = express.Router();

router.put(
  "/comments/:id",
  requireAuth,
  [body("text").isString()],
  async (req: Request, res: Response) => {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.currentUser!.id;

    const comment = await Comment.findById(id);
    comment.text = text;

    await comment.save();

    res.status(200).send(comment);
  }
);

export { router as commentUpdate };
