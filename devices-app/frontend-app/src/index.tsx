import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {ChakraProvider} from '@chakra-ui/react'
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'
import './index.css';
import reportWebVitals from './reportWebVitals';
import DevicesProvider from "./context/devicesContext";

const queryClient = new QueryClient()
const Devices = React.lazy(() => import('./devices'));

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Devices/>}/>
            <Route path={'*'} element={<Navigate to="/"/>}/>
        </>
    )
);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ChakraProvider>
            <QueryClientProvider client={queryClient}>
                <DevicesProvider>
                    <Suspense fallback={<div/>}>
                       <RouterProvider router={router}/>
                    </Suspense>
                </DevicesProvider>
            </QueryClientProvider>
        </ChakraProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
