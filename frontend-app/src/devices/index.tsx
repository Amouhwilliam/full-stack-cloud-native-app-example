import React, {Suspense, useState, useContext} from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Select,
    Input,
} from '@chakra-ui/react'
import {ArrowLeft, ArrowRight, Edit3, Plus, Trash2} from 'react-feather';
import Swal from 'sweetalert2';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {DevicesContext, IDevices} from '../context/devicesContext';

const DeviceModal = React.lazy(() => import('./components/deviceModal'));
let timer: any = null

function Devices() {

    const [onModalOpen, setOnModalOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");

    const {
        devices,
        page,
        errorOnLoadingDevices,
        isFetchingDevices,
        setPage,
        canLoadMore,
        canFetchPreviousData,
        limit,
        setLimit,
        sort,
        setSort,
        total,
        setDeviceId,
        resetDevice,
        deleteDevice,
        setSearch
    } = useContext<IDevices>(DevicesContext)

    const onDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This device will be permanently deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes delete!'
        }).then((result) => {
            if (result.value) {
                deleteDevice(id)
            }
        })
    }

    const onClickPrevious = () => {
        if (canFetchPreviousData) setPage((old: number) => old - 1)
    }

    const onClickNext = () => {
        if (canLoadMore) setPage((old: number) => old + 1)
    }

    return (
        <div>
            <div className="flex justify-center items-center h-16 w-full p-3 border-b backdrop-blur-sm bg-white/30">
                <div className="text-2xl font-bold">Devices-app</div>
            </div>
            <div className="mt-8">
                <div className="ml-6 text-xl font-bold">
                    All devices: {total}
                </div>
                <div className="flex justify-between items-center my-12 mx-6">
                    <div className="flex items-center">
                        <div className="mr-12">
                            <Input name="search" value={inputValue} placeholder='Search' size='md'
                                   onChange={(e) => {
                                       setInputValue(e?.target.value)
                                       if (timer) clearTimeout(timer)
                                       timer = setTimeout(() => {
                                           setSearch(e.target.value)
                                       }, 1000)
                                   }}
                            />
                        </div>
                        <div className="flex items-center">
                            <div className="w-24 ">Sort by</div>
                            <div className="w-48">
                                <Select className="w-full" value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="desc">Newest</option>
                                    <option value="asc">Oldest</option>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Button leftIcon={<Plus/>} colorScheme='teal' variant='outline'
                            onClick={() => {
                                setOnModalOpen(!onModalOpen)
                            }}>
                        Add device
                    </Button>
                </div>
                <TableContainer className="min-h-[400px]">
                    <Table variant='simple'>
                        {isFetchingDevices && <TableCaption>Fetching...</TableCaption>}
                        {errorOnLoadingDevices &&
                        <TableCaption>Oh!! Something happened please, reload the page.</TableCaption>}
                        {total === 0 && <TableCaption>No records</TableCaption>}
                        <Thead>
                            <Tr>
                                <Th>Id</Th>
                                <Th>Name</Th>
                                <Th>Owner name</Th>
                                <Th>Type</Th>
                                <Th isNumeric>Status</Th>
                                <Th className="flex justify-end">Action</Th>
                            </Tr>
                        </Thead>
                        {devices?.length > 0 && <Tbody>
                            {devices?.map((item,) => (
                                <Tr key={item.id}>
                                    <Td>{item.id}</Td>
                                    <Td>{item.name}</Td>
                                    <Td>{item.owner_name}</Td>
                                    <Td>{item.type}</Td>
                                    <Td isNumeric>{item.status} %</Td>
                                    <Td className="flex justify-end">
                                        <Edit3 className="mr-4 cursor-pointer"
                                               onClick={() => {
                                                   setDeviceId(item?.id)
                                                   setOnModalOpen(!onModalOpen)
                                               }}
                                        />
                                        <Trash2 className="cursor-pointer" style={{color: "#c62828"}}
                                                onClick={() => item.id && onDelete(item.id)}
                                        />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>}
                    </Table>
                </TableContainer>
                <div className="flex justify-between items-center py-12 px-6">
                    <div className="w-32">
                        <Select className="w-full" value={limit} onChange={(e) => setLimit(e.target.value)}>
                            {
                                [5, 10, 20].map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item} / Pages
                                    </option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="flex justify-center items-center">
                        <Button className={`${!canFetchPreviousData && "cursor-not-allowed"} w-32`}
                                leftIcon={<ArrowLeft/>}
                                variant='outline' onClick={onClickPrevious}>
                            Previous
                        </Button>
                        <div className="mx-6">{page}</div>
                        <Button className={`${!canLoadMore && "cursor-not-allowed"} w-32`} rightIcon={<ArrowRight/>}
                                variant='outline' onClick={onClickNext}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
            <Suspense fallback={<div>...</div>}>
                {onModalOpen && <DeviceModal isOpen={onModalOpen} onClose={() => {
                    setOnModalOpen(!onModalOpen)
                    resetDevice()
                }}/>}
            </Suspense>
            <ToastContainer/>
        </div>
    );
}

export default Devices;
