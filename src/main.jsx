import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import LoadingScreen from './components/LoadingScreen'
import './index.css'

function Root() {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
