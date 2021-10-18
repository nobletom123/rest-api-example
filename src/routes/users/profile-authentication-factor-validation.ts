import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validate-request";
import { NotFoundError } from "../../errors/not-found-error";
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { verifyEmailToken } from "../../library/verify-token";
import { User } from "../../models/user";

const router = express.Router();

router.post(
  "/users/authentication-factor",
  [body("emailToken").not().isEmpty().isString()],
  validateRequest,
  async (request: Request, response: Response) => {
    const { emailToken } = request.body;

    const tokenIsValid = await jwt.verify(emailToken, process.env.JWT_KEY!);

    console.log("tokenIsValid", tokenIsValid);

    if (!tokenIsValid || typeof tokenIsValid === "string") {
      throw new NotAuthorizedError();
    }

    const user = await User.findById(tokenIsValid.id);

    if (!user) {
      throw NotFoundError;
    }

    if (emailToken) {
      const isEmailTokenValid = await verifyEmailToken(emailToken, user.email);

      if (!isEmailTokenValid) {
        throw new NotAuthorizedError();
      }

      user.emailValidated = true;

      if (user.pendingEmail) {
        user.email = user.pendingEmail;
        user.pendingEmail = null;
      }
    }

    await user.save();

    response.send(user);
  }
);

export { router as validateProfileAuthenticationFactor };
