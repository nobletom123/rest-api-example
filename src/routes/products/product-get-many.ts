import express, { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { Product } from "../../models/products";

const router = express.Router();

router.get("/products", async (request: Request, response: Response) => {
  const userId = request.currentUser!.id;

  const queryObject: { published?: boolean } = {};

  if (!userId) {
    queryObject.published = false;
  }

  const products = await Product.find(queryObject);

  response.status(200).send(products);
});

export { router as productGetMany };
