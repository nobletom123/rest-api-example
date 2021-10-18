import jwt from "jsonwebtoken";

export enum TokenType {
  AuthenticationToken = "profile-authentication-token",
  APIToken = "access-token",
  EmailVerificationToken = "email-verification-token",
  AdminToken = "admin-token",
}

type TokenBuilder = (tokenBuilderVariables: {
  type: TokenType;
  profileId: string;
  profileEmail?: string;
  isAdmin?: boolean;
}) => Promise<string>;

// export const tokenBuilder: TokenBuilder = async ({
//   profileId,
//   profileEmail,
//   type,
// }) => {
//   const tokenData = {
//     type,
//     sub,
//     ...(profileEmail && { profileEmail }),
//   };

//   const token = await jwt.sign(tokenData, process.env.JWT_SECRET!);

//   return token;
// };
