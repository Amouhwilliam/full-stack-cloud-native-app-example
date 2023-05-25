import { Base, ResponseTypeDto } from "../base";
import {DeviceInterface, sort_direction, UpsertDeviceInterface} from "./types";

export class Devices extends Base {

    /**
     * Create a new device
     * @param {UpsertDeviceInterface} deviceData
     * @returns {Promise<ResponseTypeDto<DeviceInterface>>}
     * @memberOf Devices
     * @example devices.createDevice({name: "LEATHER"})
     * @example devices.createDevice({name: "LEATHER", description: "Leather device"})
     */
    public async createDevice(deviceData: UpsertDeviceInterface): Promise<ResponseTypeDto<DeviceInterface>>
    {
        return await this.invoke<DeviceInterface>(`devices`,
        {
            method: "POST",
            data: deviceData
        })
    }

    /**
     * Get a device by specifying the id
     * @param {number} deviceId The id of the device
     * @returns {Promise<ResponseTypeDto<DeviceInterface>>}
     * @memberOf Devices
     * @example devices.getDevice(1)
     */
    public async getDevice(deviceId: number): Promise<ResponseTypeDto<DeviceInterface>>
    {
        return await this.invoke<DeviceInterface>(`devices/${deviceId}`)
    }

    /**
     * Get all the devices
     * @param {number} page The page number
     * @param {number} limit The limit of the items per page
     * @param sort_direction variable for sorting data
     * @param search
     * @returns {Promise<ResponseTypeDto<DeviceInterface[]>>}
     * @memberOf Devices
     * @example devices.getAllDevice()
     * @example devices.getAllDevice(1, 10)
     * @example devices.getAllDevice(2, 10)
     * @example devices.getAllDevice(2, 20, "desc")
     */
    public async getDevices(page: number = 1, limit:number = 5, sort_direction: sort_direction = "desc", search: string = ""): Promise<ResponseTypeDto<DeviceInterface[]>>
    {
        return await this.invoke<DeviceInterface[]>(`devices`,
        {
            params: { page, limit, sort_direction, search },
        })
    }

    /**
     * Update a device by specifying the id and the fields to update
     * @param {number} deviceId The id of the device
     * @param {Partial<UpsertDeviceInterface>} deviceData The fields to update
     * @returns {Promise<ResponseTypeDto<DeviceInterface>>}
     * @memberOf Devices
     * @example devices.updateDevice(1, { name: "Camera", status: 50 })
     * @example devices.updateDevice(1, { name: "LTH<QWERTY>90" })
     */
    public async updateDevice(deviceId: number, deviceData: Partial<UpsertDeviceInterface>): Promise<ResponseTypeDto<DeviceInterface>>
    {
        return await this.invoke<DeviceInterface>(`devices/${deviceId}`,
        {
            method: "PATCH",
            data: deviceData
        })
    }

    /**
     * Delete a device by specifying the id
     * @param {number} deviceId The id of the device
     * @returns {Promise<ResponseTypeDto<DeviceInterface>>}
     * @memberOf Devices
     * @example devices.deleteDevice(1)
     */
    public async deleteDevice(deviceId: number): Promise<ResponseTypeDto<DeviceInterface>>
    {
        return await this.invoke<DeviceInterface>(`devices/${deviceId}`,
        {
            method: "DELETE"
        })
    }
}
