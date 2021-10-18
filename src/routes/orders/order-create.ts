import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { Order } from "../../models/orders";
import { Product } from "../../models/products";
import { User } from "../../models/user";
import { stripe } from "../../stripe";

const router = express.Router();

router.post(
  "/orders",
  requireAuth,
  [body("product").not().isEmpty()],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    const { product: productId } = request.body;
    const userId = request.currentUser!.id;

    const product = await Product.findById(productId);
    const user = await User.findById(userId);

    if (!product) {
      throw new NotFoundError();
    }

    const stripeProduct = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: product.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL}/payments?outcome=success`,
      cancel_url: `${process.env.APP_URL}/payments?outcome=failure`,
    });

    const newOrder = Order.build({
      user: userId,
      product: productId,
      priceAtTimeOfPurchase: 1,
    });

    await newOrder.save();

    response.status(201).send({
      checkoutURL: stripeProduct.url,
    });
  }
);

export { router as orderCreate };
