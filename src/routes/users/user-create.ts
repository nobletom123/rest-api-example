import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../../middlewares/validate-request";
import { BadRequestError } from "../../errors/bad-request-error";
import { User } from "../../models/user";
import { stripe } from "../../stripe";
import { sendVerificationEmail } from "../../library/send-email-verification";

const router = express.Router();

router.post(
  "/users",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("firstName"),
    body("lastName"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const currentUser = req.currentUser;
    const { email, password, firstName, lastName, admin, adminPassword } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in uses");
    }

    const customer = await stripe.customers.create();

    const user = User.build({
      email,
      password,
      firstName,
      lastName,
      stripeCustomerId: customer.id,
    });

    if (
      admin &&
      (currentUser?.admin || adminPassword === process.env.ADMIN_PASSWORD)
    ) {
      user.admin = true;
    }

    await user.save();

    await sendVerificationEmail(email, user._id);

    res.status(201).send(user);
  }
);

export { router as signupRouter };
