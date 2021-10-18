import { NotAuthorizedError } from "@noereum/common";
import jwt from "jsonwebtoken";
import { TokenType } from "../library/token-builder";

export const verifyEmailToken = async (
  token: string,
  expectedEmail: string
) => {
  const tokenIsValid = await jwt.verify(token, process.env.JWT_KEY!);

  if (!tokenIsValid || typeof tokenIsValid === "string") {
    throw new NotAuthorizedError();
  }

  return (
    tokenIsValid.email === expectedEmail &&
    tokenIsValid.type === TokenType.EmailVerificationToken
  );
};
