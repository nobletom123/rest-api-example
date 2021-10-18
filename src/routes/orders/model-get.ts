import express, { Request, Response } from 'express'
import { requireAuth, NotFoundError, NotAuthorizedError } from '@noereum/common'

import { Module } from '../../models/module'
import { NoeraObject } from '../../models/object'
import { checkModuleAccess } from '../../library/permissions/module-access'

const router = express.Router()

router.get(
    '/api/objects/models/:id',
    requireAuth,
    async (request: Request, response: Response) => {
        const { name } = request.body
        const { id } = request.params
        const userId = request.currentUser!.id
        const object = await NoeraObject.findById(id)
        if (!object) {
            throw new NotFoundError()
        }
        const module = await checkModuleAccess({
            userId,
            moduleId: object.module,
            permissionToCheck: {
                modulePermission: 'model:read',
                modelId: id,
                modelPermission: 'model:read',
            },
        })

        response.status(200).send(object)
    }
)

export { router as modelGet }
