import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCard from './assets/components/ProductCard.tsx'
import { ChakraProvider, defaultSystem, Box, Grid, HStack, Button, Text } from '@chakra-ui/react'
import Filters from './assets/components/Filters.tsx'
import NavBar from './assets/components/NavBar.tsx'

// Backend API base URL - update this to match your backend
const API_BASE_URL = 'http://localhost:8000' // Change to your backend URL

function App() {
  const [currentPage, setCurrentPage] = useState('marketplace')
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    minRating: 0,
    availability: []
  })

  const itemsPerPage = 9

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true) 
        const response = await fetch(`${API_BASE_URL}/api/v1/application/links`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Map backend data to frontend Product format
        const mappedProducts = data.map(app => ({
          id: String(app.id),
          title: app.name,
          description: app.description || 'No description available',
          price: app.price_text || 'Free',
          priceValue: 0,
          image: app.image_url,
          category: 'General',
          rating: app.stars || 0,
          link: app.url // This is the important field from backend
        }))
        
        setProducts(mappedProducts)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [filters])

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
            {/* Loading and Error States */}
            {loading && (
              <Box textAlign="center" padding="8">
                <Text fontSize="lg" color="gray.600">Loading...</Text>
              </Box>
            )}
            
            {error && (
              <Box textAlign="center" padding="8">
                <Text fontSize="lg" color="red.500">Error loading data: {error}</Text>
                <Text fontSize="sm" color="gray.600" mt="2">Please try refreshing the page</Text>
              </Box>
            )}
            
            {!loading && (
              <>
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
              </>
            )}
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
