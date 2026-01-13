import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCard from './assets/components/ProductCard.tsx'
import { ChakraProvider, defaultSystem, Box } from '@chakra-ui/react'
import { image } from 'framer-motion/client'

const product = {
  id: "1",
  title: "Living room Sofa",
  description: "This sofa is perfect for modern tropical spaces, baroque inspired spaces.",
  price: 450,
  image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
  buttonText: "Buy now"
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <Box minH="100vh" p="4" color="bgGray.800" bg="gray.800">
        <ProductCard product={product} />
        <ProductCard product={product} />
      </Box>
    </ChakraProvider>
  </StrictMode>,
)
