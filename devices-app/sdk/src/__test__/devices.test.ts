import ApiSDK from '..'
import dotEnv from 'dotenv'
import {DeviceInterface, ResponseTypeDto, Type_Enum} from '../devices/types'
import {HTTP_RESPONSE_STATUS} from "../../../backend-app/app/Dtos/HTTP_TYPES";

dotEnv.config()

describe('Test Advice API', () => {

    /* Create test client */
    const client = new ApiSDK({baseUrl: process.env.API_URL})

    const  device = {
        name: "New Device",
        owner_name: "John Doe",
        type: Type_Enum.smartphone,
        status: 10
    };

    const deviceUpdateDto = {
        name: "Updated Device",
        owner_name: "John Le Roux",
        type: Type_Enum.tablet,
        status: 40
    }

    let deviceId:number|undefined;


    it('create device', async () => {
        const res : ResponseTypeDto<DeviceInterface> =  await client.createDevice(device)
        deviceId = res.data?.id
        expect(res.data).toMatchObject(device)
    },30000)


    it('Get all devices', async () => {
        const res : ResponseTypeDto<Array<DeviceInterface>> =  await client.getDevices(1, 10)
        expect(res.data).toBeDefined()
    },30000)


    it('Get device', async () => {
        const res : ResponseTypeDto<DeviceInterface> =  await client.getDevice(deviceId)
        expect(res.data).toMatchObject(device)
    },30000)


    it('Update device', async () => {
        const res : ResponseTypeDto<DeviceInterface> =  await client.updateDevice(deviceId, deviceUpdateDto)
        expect(res.data).toMatchObject(deviceUpdateDto)
    },30000)


    it('Delete device', async () => {
        const res : ResponseTypeDto<DeviceInterface> = await client.deleteDevice(deviceId)
        expect(res.status).toEqual(HTTP_RESPONSE_STATUS.OK)
        expect(res.data.id).toEqual(deviceId)
    },30000)
})
