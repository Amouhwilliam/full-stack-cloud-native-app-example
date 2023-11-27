import React, {useContext} from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Stack,
    Input,
    Select,
} from '@chakra-ui/react'
import {IDevices, DevicesContext} from '../../context/devicesContext';

interface ModalInterface {
    isOpen: boolean
    onClose: () => void
}

function DeviceModal({isOpen, onClose}: ModalInterface) {

    const {
        setDevice,
        device,
        upsertDevice,
    } = useContext<IDevices>(DevicesContext)

    /*
    * Update all inputs data 
    */
    const handleChange = (e: any) => {
        e.preventDefault()
        const {name, value} = e.target
        setDevice({...device, [name]: value})
    }

    return (
        <Modal size="lg" autoFocus={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
             <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Stack spacing={3}>
                        <label htmlFor="name">
                            Device name
                        </label>
                        <Input id="name" name="name" value={device?.name} placeholder='Name' size='lg'
                               onChange={handleChange}/>
                        <label htmlFor="owner_name">
                            Owner name
                        </label>
                        <Input id="owner_name" name="owner_name" value={device?.owner_name} placeholder='Owner name'
                               size='lg' onChange={handleChange}/>
                        <label htmlFor="owner_name">
                            Device type
                        </label>
                        <Select id="type" name="type" className="w-full" value={device?.type}
                                onChange={handleChange}>
                            <option value='Smartphone'>Smartphone</option>
                            <option value='Tablet'>Tablet</option>
                            <option value='Camera'>Camera</option>
                        </Select>
                        <label htmlFor="owner_name">
                            Device status (%)
                        </label>
                        <Input id="status" name="status" type="number" value={device?.status} placeholder='Status'
                               size='lg' onChange={handleChange}/>
                    </Stack>
                </ModalBody>

                <ModalFooter className="my-4">
                    <Button className="w-32" mr={3} colorScheme='red' variant='outline' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="w-32" variant='outline' onClick={() => {
                        upsertDevice()
                        onClose()
                    }}>
                        Submit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default DeviceModal;
