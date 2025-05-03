import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/css/app.css'
import Modal from 'react-modal'

// Set app element để react-modal hoạt động đúng
Modal.setAppElement('#root')

// Log để debug
console.log("Mounting React app, root element:", document.getElementById('root'))
console.log("Modal setting appElement to #root")

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
)
