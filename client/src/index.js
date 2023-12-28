import React from 'react';
import ReactDOM from 'react-dom';
import {App } from './app';

// Create a container element for your app
const rootContainer = document.getElementById('root') 


// Import createRoot from "react-dom/client"
const root = ReactDOM.createRoot(rootContainer);
root.render(<App />);

