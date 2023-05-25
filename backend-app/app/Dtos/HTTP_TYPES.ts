export type ResponseTypeDto<DataType> = {
  status: number,
  message: string,
  error?: any,
  data?: DataType
}

export enum HTTP_RESPONSE_STATUS{
  CREATED=201,
  OK=200,
  BAD_REQUEST=400,
  UNAUTHORIZED=401,
  NOT_FOUND=404,
  SERVER_ERROR=500
}

export type  sort_direction = 'asc' | 'desc' | undefined
