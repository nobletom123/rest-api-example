import express, { Request, Response } from "express";
import {
  NotFoundError,
  validateRequest,
  BadRequestError,
} from "@noereum/common";
import { param } from "express-validator";
import { isValidObjectId } from "mongoose";

import { natsWrapper } from "../nats-wrapper";
import { UserUpdatedPublisher } from "../events/publishers/user-updated-publisher";
import { User } from "../models/user";
import { Password } from "../services/password";
import { sendVerificationEmail } from "../library/send-email-verification";

const router = express.Router();

router.put(
  "/api/auth/profiles/:id",
  [param("id").custom((id) => isValidObjectId(id))],
  validateRequest,
  async (request: Request, response: Response) => {
    const { firstName, lastName, currentPassword, newPassword, email } =
      request.body;
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const retrievedUser = await User.findById(id);

    if (!retrievedUser) {
      console.log("test 123");
      throw new NotFoundError();
    }

    if (firstName) {
      retrievedUser.firstName = firstName;
    }

    if (lastName) {
      retrievedUser.lastName = lastName;
    }

    if (email) {
      await sendVerificationEmail(email, id);
      retrievedUser.pendingEmail = email;
    }

    if (currentPassword && newPassword) {
      const passwordsMatch = await Password.compare(
        retrievedUser.password,
        currentPassword
      );
      if (!passwordsMatch) {
        throw new BadRequestError("Invalid Credentials");
      }

      retrievedUser.password = newPassword;
    }

    await retrievedUser.save();

    new UserUpdatedPublisher(natsWrapper.client).publish({
      _id: retrievedUser._id,
      email: retrievedUser.email,
      firstName: retrievedUser.firstName,
      lastName: retrievedUser.lastName,
      isAdmin: retrievedUser.admin,
      version: retrievedUser.version,
    });

    response.status(200).json(retrievedUser);
  }
);

export { router as updateProfile };
