import jwt from "jsonwebtoken";
import mail from "./mail";
import { TokenType } from "./token-builder";

export const sendVerificationEmail = async (email: string, id: string) => {
  const token = await jwt.sign(
    {
      email,
      id,
      type: TokenType.EmailVerificationToken,
    },
    process.env.JWT_KEY!
  );

  await mail.send({
    to: email,
    from: "no-reply@noera.io",
    subject: "Verify Your Email Address",
    html: `
        <p>Thank you for signing up to Noera!</p>
        <p>Please post this token into the API: ${token}</p>
    `,
  });
};
