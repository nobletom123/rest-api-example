import express, { Request, Response } from "express";
import { param } from "express-validator";
import { isValidObjectId } from "mongoose";

import { Password } from "../../services/password";
import { validateRequest } from "../../middlewares/validate-request";
import { NotFoundError } from "../../errors/not-found-error";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import { sendVerificationEmail } from "../../library/send-email-verification";

const router = express.Router();

router.put(
  "/users/:id",
  [param("id").custom((id) => isValidObjectId(id))],
  validateRequest,
  async (request: Request, response: Response) => {
    const { firstName, lastName, currentPassword, newPassword, email } =
      request.body;
    const { id } = request.params;

    const retrievedUser = await User.findById(id);

    if (!retrievedUser) {
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

    response.status(200).json(retrievedUser);
  }
);

export { router as updateProfile };
