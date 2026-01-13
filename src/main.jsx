import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCard from './assets/components/ProductCard.tsx'
import { ChakraProvider, defaultSystem, Box, Grid } from '@chakra-ui/react'
import Filters from './assets/components/Filters.tsx'
import NavBar from './assets/components/NavBar.tsx'

const products = [
  {
    id: "1",
    title: "Living room Sofa",
    description: "This sofa is perfect for modern tropical spaces, baroque inspired spaces.",
    price: "4 CHF/Month",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
   
    rating: 4.5
  },
  {
    id: "2",
    title: "Luxury Armchair",
    description: "A luxurious armchair that adds elegance to any room.",
    price: "350 CHF",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
   
    rating: 5.0
  },
  {
    id: "3",
    title: "Stylish Coffee Table",
    description: "A stylish coffee table that complements your living space.",
    price: "Free",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    
    percentage: "98%",
    rating: 3.8
  },

  {
    id: "4",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    
    percentage: "76%",
    rating: 4.2
  },

  {
    id: "5",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    
    percentage: "76%",
    rating: 4.2
  },
  {
    id: "6",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
   
    percentage: "76%",
    rating: 4.2
  },
  {
    id: "7",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
   
    percentage: "76%",
    rating: 4.2
  }
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <NavBar />
      
      <Box 
        position="fixed"
        left="0"
        width="25%"
        top="8%"
        bottom="0"
      >
        <Filters />
      </Box>
      
      <Box 
        position="fixed"
        left="25%"
        right="0"
        top="8%"
        bottom="0"
        padding="4"
        overflowY="auto"
        bg="white"
      >
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
          gap="4"
          w="100%"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Grid>
        
      </Box>
      
    </ChakraProvider>
  </StrictMode>,
)
