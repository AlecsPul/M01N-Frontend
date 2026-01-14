import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import NavBar from './assets/components/NavBar.tsx'
import Marketplace from './pages/Marketplace.jsx'
import Backlog from './pages/Backlog.jsx'
import AboutUs from './pages/AboutUs'
import Community from './pages/Community.jsx'

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/community" element={<Community />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
