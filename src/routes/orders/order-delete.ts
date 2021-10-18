import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
} from "@noereum/common";

import { NoeraObject } from "../../models/object";
import { Module } from "../../models/module";
import { checkModuleAccess } from "../../library/permissions/module-access";

const router = express.Router();

router.delete(
  "/api/objects/models/:id",
  requireAuth,
  async (request: Request, result: Response) => {
    const { id } = request.params;
    const userId = request.currentUser!.id;

    const object = await NoeraObject.findById(id);

    if (!object) {
      throw new NotFoundError();
    }
    await checkModuleAccess({
      userId,
      moduleId: object.module,
      permissionToCheck: {
        modulePermission: "model:create",
        modelId: id,
        modelPermission: "model:create",
      },
    });

    await NoeraObject.findByIdAndDelete(id);
    result.status(201).json({ delete: true });
  }
);

export { router as orderDelete };
