import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { Blog } from "../../models/blogs";

const router = express.Router();

router.post(
  "/blogs",
  requireAuth,
  [
    body("title").not().isEmpty(),
    body("description").not().isEmpty(),
    body("body").not().isEmpty(),
  ],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    const { title, description, body, image } = request.body;
    const userId = request.currentUser!.id;

    const newBlogData = { title, description, body, ...(image && { image }) };

    const blog = Blog.build(newBlogData);

    await blog.save();

    response.status(201).send(blog);
  }
);

export { router as blogCreate };
