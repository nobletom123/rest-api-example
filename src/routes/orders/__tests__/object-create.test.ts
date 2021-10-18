import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../../app";

it("tests that an object is created correctly", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const user = global.signin(userId);

  const newModule = Module.build({
    name: "Test Module",
    authorisation: buildAuthorizationObject({
      userId,
      permissionRights: modulePermissionsConfig.map((reference) => ({
        reference,
        permissionStatus: AccessRightsEnum.Full,
      })),
      name: "Administrators",
      configurationObject: modulePermissionsConfig,
    }),
  });

  await newModule.save();

  await request(app)
    .post(`/api/objects/objects`)
    .set("Cookie", user)
    .send({
      name: "Test Module Updated 123",
      moduleId: newModule.id,
      fields: [
        {
          type: "string",
          value: "Test",
          key: "String-Test",
        },
      ],
    })
    .expect(201);
});
