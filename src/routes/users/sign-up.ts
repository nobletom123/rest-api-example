import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError } from "@noereum/common";
import { UserCreatedPublisher } from "../events/publishers/user-created-publisher";
import { User } from "../models/user";
import { natsWrapper } from "../nats-wrapper";
import { sendVerificationEmail } from "../library/send-email-verification";
const router = express.Router();

router.post(
  "/api/auth/signup",
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

    const user = User.build({ email, password, firstName, lastName });

    if (
      admin &&
      (currentUser?.admin || adminPassword === process.env.ADMIN_PASSWORD)
    ) {
      user.admin = true;
    }

    await user.save();

    await sendVerificationEmail(email, user._id);

    new UserCreatedPublisher(natsWrapper.client).publish({
      _id: user._id,
      email,
      firstName,
      lastName,
      isAdmin: user.admin,
      version: user.version,
    });

    res.status(201).send(user);
  }
);

export { router as signupRouter };
