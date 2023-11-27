import { useState, useEffect } from 'react'
import './App.css'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

interface DeviceInterface {
  id: number
  name: string
  owner_name: string
  type: string
  status: number
  updated_at?: string
  created_at?: string
}


function App() {

  const [devices, setDevices] = useState<DeviceInterface[]>([])
  const [socketStatus, SetSocketStatus] = useState<boolean>(false)

  function onConnect() {
    console.log('connected to socket')
    SetSocketStatus(true)
  }

  function onMessage(data: any) {
    setDevices(data)
  }

  async function fetchDevices() {
    const url = import.meta.env.VITE_API_URL //|| "http://localhost:3333/api/v1/devices/all";
    const response = await fetch(url);
    const devices = await response.json();
    setDevices(devices.data)
  }
  useEffect(() => {
    fetchDevices().catch((error) => { console.log(error) });
  }, []);

  useEffect(() => {
    let url = import.meta.env.VITE_WS_URL //|| "ws://localhost:8000/ws";
    if(url.includes("http:")){
      const protocol: string = 'http';
      url = url.replace(protocol, 'ws')+'/ws'
    } else if(url.includes("https:")) {
      const protocol: string = 'https';
      url = url.replace(protocol, 'wss')+'/ws'
    }
    console.log("socket-url", url)

    try {
      if (!socketStatus) {
        const ws = new WebSocket(url);
  
        ws.onopen = () => {
          // ws.send("Connect");
          onConnect() // connect and reconnect to the webSocket 
        };
  
        ws.onclose = () => {
          SetSocketStatus(false)
          console.log("connection closed")
        }
  
        // recieve message every start page
        ws.onmessage = (e: any) => {
          onMessage(JSON.parse(e.data))
          console.log(JSON.parse(e.data))
        };
      }
    } catch (error) {
      console.log(error)
    }

    // setWebsckt(ws);
    //clean up function when we close page
    return () => {}
    
  }, [devices, socketStatus]);

  return (
    <>
      <div className='text-xl mb-8 underline'>
        Real time device monitoring: {devices.length}
      </div>

      {!socketStatus && <div className='mb-8'>
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Oups!! your are disconnected</AlertTitle>
          <AlertDescription>The connection to the Websocket is closed please reload the page.</AlertDescription>
        </Alert>
      </div>}

      <TableContainer className="min-h-[400px]">
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Name</Th>
              <Th>Owner name</Th>
              <Th>Type</Th>
              <Th isNumeric>Status</Th>
            </Tr>
          </Thead>
          {devices?.length > 0 && <Tbody>
            {devices?.map((item) => (
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.owner_name}</Td>
                <Td>{item.type}</Td>
                <Td isNumeric>{item.status} %</Td>
              </Tr>
            ))}
          </Tbody>}
        </Table>
      </TableContainer>
    </>
  )
}

export default App
