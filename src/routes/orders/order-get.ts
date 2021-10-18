import express, { Request, Response } from "express";
import { Order } from "../../models/orders";
import { requireAuth } from "../../middlewares/require-auth";

const router = express.Router();

router.get(
  "/order/:id",
  requireAuth,
  async (request: Request, response: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const order = await Order.findById(id);

    response.status(200).send(order);
  }
);

export { router as orderGet };
