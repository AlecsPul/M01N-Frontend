import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCard from './assets/components/ProductCard.tsx'
import { ChakraProvider, defaultSystem, Box, Grid, HStack, Button, Text } from '@chakra-ui/react'
import Filters from './assets/components/Filters.tsx'
import NavBar from './assets/components/NavBar.tsx'

const products = [
  {
    id: "1",
    title: "Living room Sofa",
    description: "This sofa is perfect for modern tropical spaces, baroque inspired spaces.",
    price: "4 CHF/Month",
    priceValue: 4,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Sofas",
    rating: 4.5,
    inStock: true,
    onSale: false,
    freeShipping: true
  },
  {
    id: "2",
    title: "Luxury Armchair",
    description: "A luxurious armchair that adds elegance to any room.",
    price: "350 CHF",
    priceValue: 350,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Armchairs",
    rating: 5.0,
    inStock: true,
    onSale: true,
    freeShipping: false
  },
  {
    id: "3",
    title: "Stylish Coffee Table",
    description: "A stylish coffee table that complements your living space.",
    price: "Free",
    priceValue: 0,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Tables",
    percentage: "98%",
    rating: 3.8,
    inStock: true,
    onSale: true,
    freeShipping: true
  },

  {
    id: "4",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: false,
    onSale: false,
    freeShipping: true
  },

  {
    id: "5",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: true,
    onSale: false,
    freeShipping: false
  },
  {
    id: "6",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: true,
    onSale: true,
    freeShipping: true
  },
  {
    id: "7",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: true,
    onSale: false,
    freeShipping: true
  },
  {
    id: "8",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: false,
    onSale: true,
    freeShipping: false
  },
  {
    id: "9",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: true,
    onSale: false,
    freeShipping: true
  },
  {
    id: "10",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: true,
    onSale: true,
    freeShipping: false
  },
  {
    id: "11",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
    inStock: false,
    onSale: false,
    freeShipping: true
  },
  {
    id: "12",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
  },
  {
    id: "13",
    title: "Modern Bookshelf",
    description: "A modern bookshelf to organize your favorite reads. AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    price: "120 CHF",
    priceValue: 120,
    image: "https://www.tranxfer.com/wp-content/uploads/2025/09/Logo-Tranxfer-2-300x61.png",
    category: "Bookshelves",
    percentage: "76%",
    rating: 4.2,
  }

]


function App() {
  const [currentPage, setCurrentPage] = useState('marketplace')
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    minRating: 0,
    availability: []
  })

  const itemsPerPage = 9

  const filteredProducts = products.filter(product => {
    // Filter by category
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    // Filter by price
    if (product.priceValue < filters.priceRange[0] || product.priceValue > filters.priceRange[1]) {
      return false
    }

    // Filter by rating
    if (product.rating < filters.minRating) {
      return false
    }

    // Filter by availability
    if (filters.availability.includes("In Stock") && !product.inStock) {
      return false
    }
    if (filters.availability.includes("On Sale") && !product.onSale) {
      return false
    }
    if (filters.availability.includes("Free Shipping") && !product.freeShipping) {
      return false
    }

    return true
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      {currentPage === 'marketplace' && (
        <>
          <Box 
            position="fixed"
            left="2rem"
            width="20%"
            top="calc(8% + 4rem)"
            bottom="0"
            borderRadius="12px"
            overflow="hidden"
          >
            <Filters onFilterChange={setFilters} />
          </Box>
          
          <Box 
            position="fixed"
            left="calc(20% + 4rem)"
            right="0"
            top="calc(8% + 4rem)"
            bottom="0"
            padding="4"
            paddingRight="calc(4 + 2rem)"
            overflowY="auto"
            bg="white"
            borderRadius="12px"
            display="flex"
            flexDirection="column"
          >
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
              gap="4"
              w="100%"
              alignContent="start"
            >
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Grid>
            
            {/* Pagination Controls */}
            <HStack 
              justify="center" 
              gap="2" 
              padding="4"
              borderTop="1px solid"
              borderColor="gray.200"
            >
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                variant="outline"
                size="sm"
                bg="white"
                borderColor="black"
              >
                ←
              </Button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1
                // Show current page, 2 before, 2 after, and last page
                if (
                  (pageNum >= page - 2 && pageNum <= page + 2) ||
                  pageNum === totalPages
                ) {
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      variant={page === pageNum ? "solid" : "outline"}
                      colorScheme={page === pageNum ? "blue" : "gray"}
                      size="sm"
                      bg="white"
                      color="black"
                      borderColor="black"
                    >
                      {pageNum}
                    </Button>
                  )
                } else if (pageNum === page + 3 && pageNum < totalPages) {
                  return <Text key={pageNum}>...</Text>
                }
                return null
              })}
              
              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
                bg="white"
                borderColor="black"
              >
                →
              </Button>
            </HStack>
          </Box>
        </>
      )}
    </ChakraProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
