import express, { Request, Response } from "express";
import { requireAuth } from "../../middlewares/require-auth";
import { Order } from "../../models/orders";

const router = express.Router();

router.get(
  "/orders",
  requireAuth,
  async (request: Request, response: Response) => {
    const { name } = request.body;
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const orders = Order.find({});

    response.status(200).send(orders);
  }
);

export { router as orderGetMany };
