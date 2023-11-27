import {HTTP_RESPONSE_STATUS, ResponseTypeDto, sort_direction} from "App/Dtos/HTTP_TYPES";
import { CreateDeviceDto, UpdateDeviceDto } from "App/Dtos/DevicesDto";
import Logger from "@ioc:Adonis/Core/Logger";
import Device from "App/Models/Device";
import ResponseFunctionsService from "App/Services/ResponsesFunctions.service";
import { inject } from '@adonisjs/fold';
import Redis from "@ioc:Adonis/Addons/Redis"
import Rabbit from '@ioc:Adonis/Addons/Rabbit'

/**
 * Device service
 * @class DeviceService
 * @example import DeviceService from "App/Services/DeviceService";
 * @export DeviceService
 * @since 1.0.0
 * @version 1.0.0
 */
@inject()
export default class DeviceService {
  constructor(private readonly responseService: ResponseFunctionsService) {}

  /**
   * @param {Partial<CreateDeviceDto>} dto
   * @returns {Promise<ResponseTypeDto<Device>>}
   * @memberOf DeviceService
   * @example const device = await deviceService.create({ name: "Leather", owner_name: "Leather device", type: "Smartphone", status: 0 });
   */
  public async create(dto: CreateDeviceDto): Promise<ResponseTypeDto<Device>>
  {
    try {
      const device = new Device();
      await device.fill(dto).save();
      await Redis.set(`device${device.id}`, JSON.stringify(device))
      const devices = await Device.all()
      //console.log(`url:  ${Env.get('RABBITMQ_PROTOCOL')}${Env.get('RABBITMQ_USER')}:${Env.get('RABBITMQ_PASSWORD')}@${Env.get('RABBITMQ_HOSTNAME')}:${Env.get('RABBITMQ_PORT')}`);
      await Rabbit.assertQueue('to_python_app_queue', {durable: true})
      await Rabbit.sendToQueue('to_python_app_queue', Buffer.from(JSON.stringify(devices)))
      return this.responseService.renderSuccessResponse(HTTP_RESPONSE_STATUS.CREATED, "Device created successfully", device)
    } catch (error) {
      Logger.error(error)
      return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.SERVER_ERROR, error.message, error)
    }
  }

  /**
   * Get device by id
   * @param {number} id
   * @returns {Promise<ResponseTypeDto<Device>>}
   * @memberOf DeviceService
   * @example const device = await deviceService.getDevice(1);
   * Search the data in the cache if the data is not founded it fetches it from the db and update the cache
   */
  public async get(id: number): Promise<ResponseTypeDto<Device>>
  {
    try {
      let device: Device
      const cachedData = await Redis.get(`device${id}`)
      if (cachedData) {
        device = JSON.parse(cachedData)
      } else {
        const dbData = await Device.find(id);
        if (!dbData) {
          return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.NOT_FOUND, "Device not found", new Error("Device not found"))
        } else {
          await Redis.set(`device${id}`, JSON.stringify(dbData))
          device = dbData
        }
      }
      return this.responseService.renderSuccessResponse(HTTP_RESPONSE_STATUS.OK, "Device retrieved successfully", device)
    } catch (error) {
      Logger.error(error)
      return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.SERVER_ERROR, error.message, error)
    }
  }

  /**
   * Get all devices
   * @param {number} page
   * @param {number} limit
   * @param sort_direction
   * @param search
   * @returns {Promise<ResponseTypeDto<Device[]>>}
   * @memberOf DeviceService
   * @example const devices = await deviceService.getAll(1, 10);
   * No need to cache paginated data
   */
  public async getAll(page: number, limit: number, sort_direction: sort_direction = "desc", search: string = ""): Promise<ResponseTypeDto<Device[]>>
  {
    try {
      const devices = await Device.query()
        .where('name', 'ilike', `%${search}%`).orderBy("id", sort_direction)
        .paginate(search === "" ? page : 1, limit);
      return this.responseService.renderSuccessResponseForPaginatedData(HTTP_RESPONSE_STATUS.OK, "Devices retrieved successfully", devices)
    } catch (error) {
      Logger.error(error)
      return this.responseService.renderErrorResponseForPaginatedData(HTTP_RESPONSE_STATUS.SERVER_ERROR, error.message, error)
    }
  }

    /**
   * Get all devices at once
   * @memberOf DeviceService
   * @example const devices = await deviceService.getAllDevices();
   */
    public async getAllDevices(): Promise<ResponseTypeDto<Device[]>>
    {
      try {
        const devices = await Device.all()
        return this.responseService.renderSuccessResponseForPaginatedData(HTTP_RESPONSE_STATUS.OK, "Devices retrieved successfully", devices)
      } catch (error) {
        Logger.error(error)
        return this.responseService.renderErrorResponseForPaginatedData(HTTP_RESPONSE_STATUS.SERVER_ERROR, error.message, error)
      }
    }

  /**
   * Update device
   * @param {number} id
   * @param {Partial<UpdateDeviceDto>} dto
   * @returns {Promise<ResponseTypeDto<Device>>}
   * @memberOf DeviceService
   * @example const device = await deviceService.update(1, { name: "Camera", status: 50 });
   * @example const device = await deviceService.update(1, { name: "Leather" });
   * @example const device = await deviceService.update(1, { type: "Smartphone" });
   */
  public async update(id: number, dto: UpdateDeviceDto): Promise<ResponseTypeDto<Device>>
  {
    try {
      const device = await Device.find(id);
      if (!device) {
        return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.NOT_FOUND, "Device not found", new Error("Device not found"))
      }
      await device.merge(dto).save();
      await Redis.set(`device${id}`, JSON.stringify(device))
      
      const devices = await Device.all()
      await Rabbit.assertQueue('to_python_app_queue', {durable: true})
      await Rabbit.sendToQueue('to_python_app_queue', Buffer.from(JSON.stringify(devices)))
      
      return this.responseService.renderSuccessResponse(HTTP_RESPONSE_STATUS.OK, "Device updated successfully", device)
    } catch (error) {
      Logger.error(error)
      return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.SERVER_ERROR, error.message, error)
    }
  }

  /**
   * Delete device
   * @param {number} id
   * @returns {Promise<ResponseTypeDto<Device>>}
   * @memberOf DeviceService
   * @example const device = await deviceService.delete(1);
   */
  public async delete(id: number): Promise<ResponseTypeDto<Device>>
  {
    try {
      const device = await Device.find(id);
      if (!device) {
        return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.NOT_FOUND, "Device not found", new Error("Device not found"))
      }
      await device.delete();
      await Redis.del(`device${id}`)
      const devices = await Device.all()
      await Rabbit.assertQueue('to_python_app_queue', {durable: true})
      await Rabbit.sendToQueue('to_python_app_queue', Buffer.from(JSON.stringify(devices)))

      return this.responseService.renderSuccessResponse(HTTP_RESPONSE_STATUS.OK, "Device deleted successfully", device)
    } catch (error) {
      Logger.error(error)
      return this.responseService.renderErrorResponse(HTTP_RESPONSE_STATUS.SERVER_ERROR, error.message, error)
    }
  }

  /*
  * Clear the cache
  */
  public async invalidateCache() {
    await Redis.flushdb()
  }
}
