import request from 'supertest'
import mongoose from 'mongoose'
import { AccessRightsEnum } from '@noereum/common'

import { app } from '../../../app'
import { Module } from '../../../models/module'
import { buildAuthorizationObject } from '../../../library/authorization/user-access-object'
import { modulePermissionsConfig } from '../../../_configurations/module-config'

it('tests that an object is created correctly', async () => {
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

    await request(app)
        .post(`/api/objects/objects`)
        .set('Cookie', user)
        .send({
            name: 'Test Module Updated 123',
            moduleId: newModule.id,
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

it('tests that an object cannot be created for module that user doesnt have access rights for', async () => {
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

    await request(app)
        .post(`/api/objects/objects`)
        .set('Cookie', user)
        .send({
            name: 'Test Module Updated 123',
            moduleId: newModule.id,
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

it('tests that a bad request error is thrown when type checking fails', async () => {
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

    await request(app)
        .post(`/api/objects/objects`)
        .set('Cookie', user)
        .send({
            name: 'Test Module Updated 123',
            moduleId: newModule.id,
            fields: [
                {
                    type: 'graph',
                    key: 'graph-fail-test',
                },
            ],
        })
        .expect(400)
})
