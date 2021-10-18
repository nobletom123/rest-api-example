import express, { Request, Response } from 'express'
import { requireAuth, NotFoundError, NotAuthorizedError } from '@noereum/common'
import { ObjectId } from 'mongoose'

import { Module } from '../../models/module'
import { NoeraObject } from '../../models/object'
import { Instance } from '../../models/instance'
import { checkModuleAccess } from '../../library/permissions/module-access'

const router = express.Router()

router.get(
    '/api/objects/models/:id/instances',
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
                modulePermission: 'model:read-instances',
                modelId: id,
                modelPermission: 'model:read-instances',
            },
        })

        const instances = await Instance.find({
            'instanceSchema.model': object.id,
        }).exec()

        response.status(200).send(instances)
    }
)

export { router as modelGetInstances }
