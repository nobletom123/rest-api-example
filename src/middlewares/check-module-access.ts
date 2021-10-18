import { Request, Response, NextFunction } from "express";
import {
  GetModuleFunction,
  NotAuthorizedError,
  PreParsedPermissionsConfig,
} from "..";

import { ModuleAccess } from "../authorisation";
import { Permission } from "../authorisation/PermissionConfig";

export const checkModuleAccess =
  ({
    permissionsToCheck,
    getModuleFunction,
    requestParameter,
  }: {
    permissionsToCheck: PreParsedPermissionsConfig;
    getModuleFunction: any;
    requestParameter?: string;
  }) =>
  async (request: Request, response: Response, next: NextFunction) => {
    let moduleId;

    if (requestParameter) {
      moduleId = request[requestParameter];
    } else {
      moduleId = request.params.id;
    }

    if (!moduleId) {
      throw new NotAuthorizedError();
    }

    const userId = request.currentUser?.id;
    const apiKeyName = request.apiKey?.name;

    const parsedPermission = Permission.parsePermissionConfig(
      permissionsToCheck,
      request
    );

    const moduleAccess = new ModuleAccess(
      parsedPermission,
      async () => await getModuleFunction(request),
      { userId, apiKeyName }
    );

    const moduleHasPermission = await moduleAccess.checkPermissions();

    if (!moduleHasPermission) {
      throw new NotAuthorizedError();
    }

    request.module = moduleAccess.module;

    next();
  };
