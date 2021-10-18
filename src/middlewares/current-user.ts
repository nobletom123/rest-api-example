import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenTypesEnum } from "..";
import { Module } from "../types/authorization";

interface JwtTokenpPayload {
  type: TokenTypesEnum;
}

interface UserPayload extends JwtTokenpPayload {
  id: string;
  email: string;
  admin: boolean;
}

interface ApiKeyPayload extends JwtTokenpPayload {
  name: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
      apiKey?: ApiKeyPayload;
      module?: Module;
    }
  }
}

const getJwtToken = (req) => {
  if (req.headers.authorization) {
    return req.headers.authorization.split(" ")[1];
  }

  return req.session.jwt;
};

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt && !req.headers.authorization) {
    return next();
  }

  const jwtToken = getJwtToken(req);

  try {
    const payload = jwt.verify(
      jwtToken,
      process.env.JWT_KEY!
    ) as JwtTokenpPayload;

    if (payload.type === TokenTypesEnum.Profile) {
      req.currentUser = payload as UserPayload;
    }

    if (payload.type === TokenTypesEnum.ApiKey) {
      req.apiKey === (payload as ApiKeyPayload);
    }
  } catch (err) {}

  next();
};
