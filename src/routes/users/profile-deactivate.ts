import express, { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { param } from "express-validator";

import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { NotFoundError } from "../../errors/not-found-error";
import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";
import { User } from "../../models/user";

const router = express.Router();

router.delete(
  "/users/:id",
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
