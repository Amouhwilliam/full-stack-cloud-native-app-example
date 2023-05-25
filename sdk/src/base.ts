import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
type Config = {
    baseUrl?: string;
    accessToken?: string;
}

export enum ContentType {
    JSON = "application/json",
    FORM = "application/x-www-form-urlencoded",
    MULTIPART_FORM_DATA = "multipart/form-data",
    XML = "application/xml",
    TEXT = "text/plain",
    HTML = "text/html"
}

export type ResponseTypeDto<T> = {
    status: number,
    message: string,
    error?: any,
    data?: T 
}

export abstract class Base {
    private readonly baseUrl?: string;
    private readonly accessToken?: string;

    constructor(config: Config) {
        this.baseUrl = config.baseUrl;
        this.accessToken = config.accessToken;
    }

    protected async invoke<T>(endpoint: string, options?: AxiosRequestConfig, contentType?: ContentType): Promise<ResponseTypeDto<T>>
    {
        const url = `${this.baseUrl}/${endpoint}`;
        const headers  = {
            Authorization: `Bearer ${this.accessToken}`,
            Accept: ContentType.JSON,
            "Content-Type": contentType || ContentType.JSON,
        }
        
        const config = { url, headers, ...options }
        return axios(config).then(response => response.data)
    }

}