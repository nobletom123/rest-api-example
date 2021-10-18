import express, { Request, Response } from "express";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { NotFoundError } from "../../errors/not-found-error";
import { Blog } from "../../models/blogs";

const router = express.Router();

router.get("/blogs/:id", async (request: Request, response: Response) => {
  const { name } = request.body;
  const { id } = request.params;
  const userId = request.currentUser!.id;

  const blog = await Blog.findById(id);

  if (blog) {
    throw new NotFoundError();
  }

  if (!userId && !blog.published) {
    throw new NotAuthorizedError();
  }

  response.status(200).send(blog);
});

export { router as blogGet };
