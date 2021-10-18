import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import {
    validateRequest,
    requireAuth,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
} from '@noereum/common'

import { NoeraObject } from '../../models/object'
import { Module } from '../../models/module'

import { handleObjectFieldUpdate } from '../../library/types/type-parser'
import { objectRelationHandler } from '../../library/objects/object-relation-handler'
import { checkModuleAccess } from '../../library/permissions/module-access'

const router = express.Router()

router.put(
    '/api/objects/models/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const { name, fields, relations } = req.body
        const { id } = req.params
        const userId = req.currentUser!.id
        let object = await NoeraObject.findById(id)
        if (!object) {
            throw new NotFoundError()
        }
        await checkModuleAccess({
            userId,
            moduleId: object.module,
            permissionToCheck: {
                modulePermission: 'model:update',
                modelId: id,
                modelPermission: 'model:update',
            },
        })

        if (fields) {
            object = handleObjectFieldUpdate(object, fields)
        }

        const { returnedFunctions, errors } = await objectRelationHandler(
            {
                relations,
            },
            object
        )

        if (!object || errors) {
            console.log('bad update')
            throw new BadRequestError('Update fields incorrect')
        }

        if (name) {
            object.name = name
        }

        await object.save()

        for (const func of returnedFunctions) {
            await func
        }

        res.status(200).send(object)
    }
)

export { router as modelUpdate }
