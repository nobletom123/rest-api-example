import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
  validateRequest,
} from "@noereum/common";
import { User } from "../models/user";
import { param } from "express-validator";
import { isValidObjectId } from "mongoose";

const router = express.Router();

router.delete(
  "/api/auth/profiles/:id",
  requireAuth,
  [param("id").custom((id) => isValidObjectId(id))],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.currentUser!.id;

    if (userId !== id) {
      throw new NotAuthorizedError();
    }

    const retrievedUser = await User.findById(id);

    if (!retrievedUser) {
      throw new NotFoundError();
    }

    retrievedUser.accountActive = false;

    await retrievedUser.save();

    res.status(200).json(retrievedUser);
  }
);

export { router as deactivateProfile };
