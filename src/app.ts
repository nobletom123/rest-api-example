import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { NotFoundError } from "./errors/not-found-error";
import { errorHandler } from "./middlewares/error-handler";
import { currentUser } from "./middlewares/current-user";

// User Routes

import { signupRouter } from "./routes/users/user-create";
import { signinRouter } from "./routes/users/sign-in";
import { signoutRouter } from "./routes/users/sign-out";
import { updateProfile } from "./routes/users/profile-update";
import { deactivateProfile } from "./routes/users/profile-deactivate";
import { currentUserRouter } from "./routes/users/get-user";
import { validateProfileAuthenticationFactor } from "./routes/users/profile-authentication-factor-validation";

// Blogs

import { blogCreate } from "./routes/blogs/blog-create";
import { blogUpdate } from "./routes/blogs/blog-update";
import { blogDelete } from "./routes/blogs/blog-delete";
import { blogGet } from "./routes/blogs/blog-get";
import { blogGetMany } from "./routes/blogs/blog-get-many";

// Comments

import { commentCreate } from "./routes/comments/comment-create";
import { commentUpdate } from "./routes/comments/comment-update";
import { commentDelete } from "./routes/comments/comment-delete";
import { commentGet } from "./routes/comments/comment-get";
import { commentGetMany } from "./routes/comments/comment-get-many";

// Products

import { productCreate } from "./routes/products/product-create";
import { productUpdate } from "./routes/products/product-update";
import { productDelete } from "./routes/products/product-delete";
import { productGet } from "./routes/products/product-get";
import { productGetMany } from "./routes/products/product-get-many";

// Product Categories

import { productCategoryCreate } from "./routes/product-categories/product-category-create";
import { productCategoryUpdate } from "./routes/product-categories/product-category-update";
import { productCategoryDelete } from "./routes/product-categories/product-category-delete";
import { productCategoryGet } from "./routes/product-categories/product-category-get";
import { productCategoryGetMany } from "./routes/product-categories/product-category-get-many";

// Orders

import { orderCreate } from "./routes/orders/order-create";
import { orderDelete } from "./routes/orders/order-delete";
import { orderGet } from "./routes/orders/order-get";
import { orderGetMany } from "./routes/orders/order-get-many";

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

// Blog Routes

app.use(blogCreate);
app.use(blogGet);
app.use(blogGetMany);
app.use(blogUpdate);
app.use(blogDelete);

// Comment Routes

app.use(commentCreate);
app.use(commentGet);
app.use(commentGetMany);
app.use(commentUpdate);
app.use(commentDelete);

// Product Routes

app.use(productCreate);
app.use(productGet);
app.use(productGetMany);
app.use(productUpdate);
app.use(productDelete);

// Product Category Routes

app.use(productCategoryCreate);
app.use(productCategoryGet);
app.use(productCategoryGetMany);
app.use(productCategoryUpdate);
app.use(productCategoryDelete);

// Order Routes

app.use(orderCreate);
app.use(orderGet);
app.use(orderGetMany);
app.use(orderDelete);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
