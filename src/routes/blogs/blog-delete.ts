import express, { Request, Response } from "express";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { Blog } from "../../models/blogs";

const router = express.Router();

router.delete(
  "/blogs/:id",
  requireAuth,
  async (request: Request, result: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const blog = await Blog.findById(id);

    if (blog) {
      throw new NotFoundError();
    }

    await blog.delete();

    result.status(201).json({ delete: true });
  }
);

export { router as blogDelete };
