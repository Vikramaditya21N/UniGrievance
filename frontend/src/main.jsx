import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * --- Main Entry Point ---
 * Bootstraps the React application into the 'root' DOM element.
 * Wraps the App in StrictMode for development-time checks.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
