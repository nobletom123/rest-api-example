import express, { Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth } from "../../middlewares/require-auth";
import { validateRequest } from "../../middlewares/validate-request";

import { BadRequestError } from "../../errors/bad-request-error";

import { NoeraObject } from "../../models/object";
import { Module } from "../../models/module";

import { checkTypeForObject } from "../../library/types/type-parser";
import { objectRelationHandler } from "../../library/objects/object-relation-handler";
import { checkModuleAccess } from "../../library/permissions/module-access";

const router = express.Router();

router.post(
  "/api/objects/models",
  requireAuth,
  [body("title").isString(), body("description").isString()],
  validateRequest,
  // eslint-disable-next-line complexity
  async (request: Request, response: Response) => {
    console.log("test");
    const { name, fields, moduleId } = request.body;
    const userId = request.currentUser!.id;
    const module = await checkModuleAccess({
      userId,
      moduleId,
      permissionToCheck: {
        modulePermission: "model:create",
      },
    });

    const buildObject: { name: string; fields: any[]; module: string } = {
      name,
      fields: [],
      module: module.id,
    };
    if (fields && Array.isArray(fields)) {
      const allFieldsAreValid = fields.every((fieldObject) =>
        checkTypeForObject(fieldObject)
      );
      if (!allFieldsAreValid) {
        throw new BadRequestError("Fields incorrect");
      }
      buildObject.fields = fields;
    }
    const newObject = NoeraObject.build(buildObject);
    await newObject.save();
    response.status(201).send(newObject);
  }
);

export { router as modelCreate };
