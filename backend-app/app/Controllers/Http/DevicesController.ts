import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold';
import DeviceService from "App/Services/Devices.service";
import CreateDeviceValidator from "App/Validators/CreateDeviceValidator";
import UpdateDeviceValidator from "App/Validators/UpdateDeviceValidator";

@inject()
export default class DevicesController {
  constructor(private readonly deviceService: DeviceService) {}

  public async getDevice({ params, response }: HttpContextContract) {
    const result = await this.deviceService.get(params.id);
    return response.status(result.status).send(result);
  }

  public async getDevices({ request, response }: HttpContextContract) {
    const page = request.input('page', 1);
    const limit = request.input('limit', 5);
    const search = request.input('search', "");
    const sort_direction = request.input('sort_direction', "desc");
    const result = await this.deviceService.getAll(page, limit, sort_direction, search);
    return response.status(result.status).send(result);
  }

  public async createDevice({ request, response }: HttpContextContract) {
    const data = await request.validate(CreateDeviceValidator);
    const result = await this.deviceService.create(data);
    return response.status(result.status).send(result);
  }

  public async updateDevice({ params, request, response }: HttpContextContract) {
    const data = await request.validate(UpdateDeviceValidator);
    const result = await this.deviceService.update(params.id, data);
    return response.status(result.status).send(result);
  }

  public async deleteDevice({ params, response }: HttpContextContract) {
    const result = await this.deviceService.delete(params.id);
    return response.status(result.status).send(result);
  }
}
