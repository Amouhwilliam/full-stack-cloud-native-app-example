import React, {useState, createContext, Context} from 'react'
// @ts-ignore
import ApiSDK, {types} from '@devices-app/api-sdk'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify';

export interface IDevices {
    devices: any,//Array<types.DeviceInterface>
    device: types.DeviceInterface,
    deviceId: number | null,
    limit: number,
    page: number,
    isLoading: boolean,
    errorOnLoadingDevices: boolean,
    isFetchingDevices: boolean
    isPreviousData: boolean
    canLoadMore: boolean
    canFetchPreviousData: boolean
    search: string,
    setDeviceId: Function,
    sort: types.sort_direction,
    setPage: Function,
    setSort: Function,
    total: number,
    setLimit: Function,
    setSearch: Function,
    setDevice: Function,
    resetDevice: Function,
    upsertDevice: Function,
    deleteDevice: Function,
}

type ResponseTypeDto<DataType> = {
    status: number,
    message: string,
    error?: any,
    data?: DataType
}
//: ResponseTypeDto<types.DeviceInterface[]>
type PaginatedResponseType = {
    data: types.DeviceInterface[],
    meta: any
}

const defaultDevice: types.DeviceInterface = {
    name: "",
    owner_name: "",
    type: "Smartphone",
    status: 0,
}

const defaultState: IDevices = {
    devices: [],
    device: defaultDevice,
    deviceId: null,
    page: 1,
    isLoading: false,
    errorOnLoadingDevices: false,
    isFetchingDevices: false,
    isPreviousData: false,
    canLoadMore: false,
    canFetchPreviousData: false,
    limit: 5,
    sort: "desc",
    total: 0,
    search: "",
    setSearch: () => {},
    setPage: () => {},
    setLimit: () => {},
    setSort: () => {},
    setDeviceId: () => {},
    setDevice: () => {},
    resetDevice: () => {},
    upsertDevice: () => {},
    deleteDevice: () => {},
}

export const DevicesContext: Context<IDevices> = createContext(defaultState)
const client = new ApiSDK({baseUrl: process.env.REACT_APP_API_URL})

const DevicesProvider = (props: any) => {
    const [deviceId, setDeviceId] = useState<number | null>(null)
    const [device, setDevice] = useState<types.DeviceInterface>(defaultDevice)
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(5)
    const [search, setSearch] =  useState<string>("")
    const [sort, setSort] = useState<types.sort_direction>('desc')
    const queryClient = useQueryClient()

    /*
    * fetch paginated devices once the device page is mounted once page, limit, sort changes
    * and cache the data for 100s for performance
    */
    const {
        isLoading,
        isError,
        data,
        isFetching,
        isPreviousData,
    } = useQuery({
        queryKey: ['devices', page, limit, sort, search],
        queryFn: async () => {
           const data: ResponseTypeDto<PaginatedResponseType> = await client.getDevices(page, limit, sort, search)
           console.log("DATA: ",data)
           return data?.data
        },
        keepPreviousData : true,
        staleTime: 100000
    })

    /*
    * fetch device once the device id is available or once it changes
    */
    useQuery({
        queryKey: [`device${deviceId}`],
        queryFn: async () => deviceId && await client.getDevice(deviceId),
        enabled : Boolean(deviceId),
        onSuccess: (res: any) =>{
            setDevice(res?.data)
        },
        onError: (e: any) =>{
            toast.error("Incorrect input status !", {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    })

    /*
    * Mutation for upserting a device
    */
    const upsertMutation = useMutation({
        mutationFn: async (data: types.DeviceInterface) => {
            if(data.status >= 0 && data.status <= 100){
                return data.id ? await client.updateDevice(data.id, data) : await client.createDevice(data)
            }else{
                throw new Error("Incorrect input status !")
            }
        },
        onSuccess: ()=>{
            setTimeout(()=>{
                queryClient.invalidateQueries({ queryKey: ["devices"] })
            }, 300) // invalidate the cache after 300 ms
            toast.success("Saved successfully !", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        },
        onError: (e: any) => {
            if(JSON.stringify(e?.message) === "Incorrect input status !"){
                toast.error("Incorrect input status !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error(JSON.stringify(e?.message), {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    })

    /*
    * Mutation for delete a device
    */
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await client.deleteDevice(id)
        },
        onSuccess: ()=>{
            setTimeout(()=>{
                queryClient.invalidateQueries({ queryKey: ["devices"] })
            }, 300) // invalidate the cache after 500 ms
            toast.success("Deleted successfully !", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000
            });
        },
        onError: (e: any) => {
            toast.error(JSON.stringify(e?.message), {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    })

    const resetDevice = () => {
        setDeviceId(null)
        setDevice(defaultDevice)
    }

    const upsertDevice = () => {
        upsertMutation.mutate(device)
    }

    const deleteDevice = (id: number) => {
        deleteMutation.mutate(id)
    }
   
    // @ts-ignore
    const state: IDevices = {
        devices: (data?.data),
        device,
        deviceId,
        page,
        isLoading,
        errorOnLoadingDevices: isError,
        isFetchingDevices: isFetching,
        isPreviousData,
        canLoadMore: !isPreviousData && data?.meta?.next_page_url !== null,
        canFetchPreviousData: page > 1,
        limit,
        total: data?.meta?.total,
        search,
        sort,
        setSort,
        setPage,
        setLimit,
        setDeviceId,
        setDevice,
        setSearch,
        resetDevice,
        upsertDevice,
        deleteDevice,
    }

    return <DevicesContext.Provider value={state}>{props?.children}</DevicesContext.Provider>
}

export default DevicesProvider