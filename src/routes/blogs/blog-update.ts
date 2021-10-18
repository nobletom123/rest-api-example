import express, { Request, Response } from "express";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { Blog } from "../../models/blogs";

const router = express.Router();

router.put(
  "/blogs/:id",
  requireAuth,
  async (request: Request, response: Response) => {
    const { title, description, body } = request.body;
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const blog = await Blog.findById(id);

    if (!blog) {
      throw new NotFoundError();
    }

    const blogUpdateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(body && { body }),
    };

    await blog.update(blogUpdateData);

    response.status(200).send(blog);
  }
);

export { router as blogUpdate };
