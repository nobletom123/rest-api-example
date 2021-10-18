import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { currentUser } from "./middlewares/current-user";

import { signupRouter } from "./routes/users/sign-up";
import { signinRouter } from "./routes/users/sign-in";
import { signoutRouter } from "./routes/users/sign-out";

import { updateProfile } from "./routes/users/profile-update";
import { deactivateProfile } from "./routes/users/profile-deactivate";
import { currentUserRouter } from "./routes/users/get-user";
import { validateProfileAuthenticationFactor } from "./routes/users/profile-authentication-factor-validation";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test',
    secure: false,
  })
);

app.use(currentUser);

app.use(signupRouter);
app.use(signoutRouter);
app.use(signinRouter);
app.use(updateProfile);
app.use(deactivateProfile);
app.use(currentUserRouter);
app.use(validateProfileAuthenticationFactor);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
