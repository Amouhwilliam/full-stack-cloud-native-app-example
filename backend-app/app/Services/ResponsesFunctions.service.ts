import {ResponseTypeDto} from "App/Dtos/HTTP_TYPES";
import Device from "App/Models/Device";

/**
 * ResponseFunctions service
 * @class ResponseFunctionsService
 * @example import ResponseFunctionsService from "App/Services/ResponseFunctionsService";
 * @export ResponseFunctionsService
 * @since 1.0.0
 * @version 1.0.0
 */
export default class ResponseFunctionsService {

  /**
   * Render Error Response
   * @returns {Promise<ResponseTypeDto<Device>>}
   * @memberOf ResponseFunctionsService
   * @example return ResponseFunctionsService.renderErrorResponse(status: 404, message: "Error", error:{ message: "missing id" });
   * @param status
   * @param message
   * @param error
   */
  public renderErrorResponse(status: number, message: string, error: any) : ResponseTypeDto<Device>
  {
    return { status, message, error }
  }

  public renderSuccessResponse(status: number, message: string, data: any): ResponseTypeDto<Device>
  {
    return { status, message, data }
  }

  public renderErrorResponseForPaginatedData(status: number, message: string, error: any) : ResponseTypeDto<Device[]>
  {
    return { status, message, error }
  }

  public renderSuccessResponseForPaginatedData(status: number, message: string, data: any): ResponseTypeDto<Device[]>
  {
    return { status, message, data }
  }
}
