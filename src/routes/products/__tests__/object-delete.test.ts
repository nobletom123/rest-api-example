import request from 'supertest'
import mongoose from 'mongoose'
import { AccessRightsEnum } from '@noereum/common'

import { app } from '../../../app'
import { Module } from '../../../models/module'
import { NoeraObject } from '../../../models/object'
import { buildAuthorizationObject } from '../../../library/authorization/user-access-object'
import { modulePermissionsConfig } from '../../../_configurations/module-config'

it('tests that an object is deleted correctly', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()

    const user = global.signin(userId)

    const newModule = Module.build({
        name: 'Test Module',
        authorisation: buildAuthorizationObject({
            userId,
            permissionRights: modulePermissionsConfig.map((reference) => ({
                reference,
                permissionStatus: AccessRightsEnum.Full,
            })),
            name: 'Administrators',
            configurationObject: modulePermissionsConfig,
        }),
    })

    await newModule.save()

    const newObject = NoeraObject.build({
        name: 'Delete Object Test',
        module: newModule.id,
        fields: [],
    })

    await newObject.save()

    await request(app)
        .delete(`/api/objects/objects/${newObject._id}`)
        .set('Cookie', user)
        .send({
            name: 'Test Module Updated 123',
            moduleId: newModule._id,
            fields: [
                {
                    type: 'string',
                    value: 'Test',
                    key: 'String-Test',
                },
            ],
        })
        .expect(201)
})

it('tests that an object when deleted will throw a not authorized error', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()

    const user = global.signin(userId)

    const newModule = Module.build({
        name: 'Test Module',
        authorisation: buildAuthorizationObject({
            permissionRights: modulePermissionsConfig.map((reference) => ({
                reference,
                permissionStatus: AccessRightsEnum.Full,
            })),
            name: 'Administrators',
            configurationObject: modulePermissionsConfig,
        }),
    })

    await newModule.save()

    const newObject = NoeraObject.build({
        name: 'Delete Object Test',
        module: newModule._id,
        fields: [],
    })

    await newObject.save()

    await request(app)
        .delete(`/api/objects/objects/${newObject._id}`)
        .set('Cookie', user)
        .send({
            name: 'Test Module Updated 123',
            moduleId: newModule._id,
            fields: [
                {
                    type: 'string',
                    value: 'Test',
                    key: 'String-Test',
                },
            ],
        })
        .expect(401)
})
