import React from 'react';
import ReactDOM from 'react-dom/client';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css"; 
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css';
import './responsive.css'
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools' 
const root = ReactDOM.createRoot(document.getElementById('root'));
let queryClient = new QueryClient() 
root.render(
    <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
);
