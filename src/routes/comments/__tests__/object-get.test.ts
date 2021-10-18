import request from 'supertest'
import mongoose from 'mongoose'
import { AccessRightsEnum } from '@noereum/common'

import { app } from '../../../app'
import { Module } from '../../../models/module'
import { NoeraObject } from '../../../models/object'
import { buildAuthorizationObject } from '../../../library/authorization/user-access-object'
import { modulePermissionsConfig } from '../../../_configurations/module-config'

it('tests that an object is retrieved correctly', async () => {
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

    const { body: retrievedModel } = await request(app)
        .get(`/api/objects/objects/${newObject._id}`)
        .set('Cookie', user)
        .expect(200)

    expect(newObject._id.toString()).toBe(retrievedModel.id)
})
