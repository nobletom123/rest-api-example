import request from "supertest";
import jwt from "jsonwebtoken";

import { app } from "../../app";
import { User } from "../../models/user";

it("tests that an object is created correctly", async () => {
  const newUser = User.build({
    firstName: "test",
    lastName: "test",
    email: "abc@email.com",
    password: "test1234",
    emailValidated: true,
  });
  await newUser.save();

  const { body, headers } = await request(app)
    .post(`/api/auth/signin`)
    .send({
      email: "abc@email.com",
      password: "test1234",
    })
    .expect(200);

  const { user: retrievedUser, token } = body;

  const [cookie] = headers["set-cookie"];
  const parsedJwt = cookie.split(" ")[0].replace("express:sess=", "");
  // .slice(0, -1);

  const tokenIsValid = await jwt.verify(token, process.env.JWT_KEY!);

  expect(!!tokenIsValid).toBe(true);

  expect(!!parsedJwt).toBe(true);
});
