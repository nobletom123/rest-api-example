import express, { Request, Response } from "express";
import { Blog } from "../../models/blogs";

const router = express.Router();

router.get("/blogs", async (request: Request, response: Response) => {
  const { name } = request.body;
  const { id } = request.params;
  const userId = request.currentUser!.id;

  const blogs = await Blog.find({ ...(!userId && { published: false }) });

  response.status(200).send(blogs);
});

export { router as blogGetMany };
