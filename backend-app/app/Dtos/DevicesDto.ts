export type CreateDeviceDto = {
  name: string,
  owner_name: string,
  type: Type_Enum,
  status: number
}

export type UpdateDeviceDto = {
  name?: string,
  owner_name?: string,
  type?: Type_Enum,
  status?: number
}


export enum Type_Enum {
  smartphone = "Smartphone",
  tablet = "Tablet",
  camera = "Camera"
}
