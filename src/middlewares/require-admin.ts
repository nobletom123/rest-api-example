import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAdministrativePriviledges = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser?.admin) {
    throw new NotAuthorizedError();
  }

  next();
};
