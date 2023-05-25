export declare type DeviceInterface = {
    id?: number
    name: string
    owner_name: string
    type: string
    status: number
}

export type UpsertDeviceInterface = {
    id?: number
    name?: string
    owner_name?: string
    type?: string
    status?: number
}

export type  sort_direction = 'asc' | 'desc' | undefined

export type ResponseTypeDto<DataType> = {
    status: number,
    message: string,
    error?: any,
    data?: DataType
}


export enum Type_Enum {
    smartphone = "Smartphone",
    tablet = "Tablet",
    camera = "Camera"
}

export enum HTTP_RESPONSE_STATUS{
    OK=200
}