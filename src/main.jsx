import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCard from './assets/components/ProductCard.tsx'
import BacklogCard from './assets/components/BacklogCard.tsx'
import { ChakraProvider, defaultSystem, Box, Grid, HStack, Button, Text } from '@chakra-ui/react'
import Filters from './assets/components/Filters.tsx'
import NavBar from './assets/components/NavBar.tsx'
import UserPrompts from './assets/components/UserPrompts.tsx'
import NoMatchModal from './assets/components/NoMatchModal.tsx'

// Backend API base URL - update this to match your backend
const API_BASE_URL = 'http://localhost:8000' // Change to your backend URL

function App() {
  const [currentPage, setCurrentPage] = useState('marketplace')
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    categories: []
  })
  const [matchedAppIds, setMatchedAppIds] = useState([])
  const [isMatching, setIsMatching] = useState(false)
  const [matchError, setMatchError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchedPrompt, setLastSearchedPrompt] = useState('')
  const [showNoMatchModal, setShowNoMatchModal] = useState(false)
  const [noMatchPrompt, setNoMatchPrompt] = useState('')
  const [backlogItems, setBacklogItems] = useState([
    {
      id: '1',
      title: 'Advanced Analytics Dashboard',
      requestCount: 15,
      status: 'not-completed'
    },
    {
      id: '2',
      title: 'Inventory Management System',
      requestCount: 8,
      status: 'completed'
    },
    {
      id: '3',
      title: 'Customer Relationship Manager',
      requestCount: 23,
      status: 'not-completed'
    }
  ])

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
          category: app.tags && app.tags.length > 0 ? app.tags[0] : 'General',
          tags: app.tags || [],
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

  // Extract unique tags from all products
  const availableTags = [...new Set(products.flatMap(product => product.tags || []))].sort()

  const filteredProducts = products.filter(product => {
    // Filter by matched app IDs if matching is active
    if (matchedAppIds.length > 0) {
      if (!matchedAppIds.includes(product.id)) {
        return false
      }
      
      // Filter out products with percentage <= 5%
      if (product.percentage) {
        const percentValue = parseFloat(product.percentage)
        if (percentValue <= 5) {
          return false
        }
      }
    }

    // Filter by category (tags)
    if (filters.categories.length > 0) {
      const productTags = product.tags || []
      const hasMatchingTag = filters.categories.some(cat => productTags.includes(cat))
      if (!hasMatchingTag) return false
    }

    return true
  }).sort((a, b) => {
    // Sort by percentage in decreasing order when matching is active
    if (matchedAppIds.length > 0 && a.percentage && b.percentage) {
      const percentA = parseFloat(a.percentage)
      const percentB = parseFloat(b.percentage)
      return percentB - percentA
    }
    return 0
  })
  
  // Check if all matched products were filtered out due to low percentage
  const hasLowPercentageMatches = hasSearched && matchedAppIds.length > 0 && filteredProducts.length === 0

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


    // USER PROMPT HANDLING (VALIDATION)
  const handleUserPrompt = async (description) => {
    // Don't search if it's the same prompt as last time
    if (description === lastSearchedPrompt && hasSearched) {
      return
    }

    // Validate prompt length (backend requires 10-2000 characters)
    const trimmedDescription = description.trim()
    
    if (trimmedDescription.length < 10) {
      setMatchError('Please provide more details. Your description must be at least 10 characters long.')
      setHasSearched(false)
      setMatchedAppIds([])
      return
    }

    if (trimmedDescription.length > 2000) {
      setMatchError('Your description is too long. Please keep it under 2000 characters.')
      setHasSearched(false)
      setMatchedAppIds([])
      return
    }

    try {
      setIsMatching(true)
      setMatchError(null)
      setHasSearched(false)
      
      const response = await fetch(`${API_BASE_URL}/api/v1/matching/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyer_prompt: trimmedDescription,
          top_k: 30,
          top_n: 10
        })
      })

      if (!response.ok) {
        if (response.status === 400) {
          // Treat 400 as no matches found
          setMatchedAppIds([])
          setHasSearched(true)
          setLastSearchedPrompt(description)
          setNoMatchPrompt(description)
          setShowNoMatchModal(true)
          setIsMatching(false)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract app_ids and percentages from results
      const matchedIds = data.results.map(result => String(result.app_id))
      
      // Update products with percentage data
      setProducts(prevProducts => prevProducts.map(product => {
        const matchResult = data.results.find(r => String(r.app_id) === product.id)
        if (matchResult) {
          return {
            ...product,
            percentage: `${matchResult.similarity_percent}%`
          }
        }
        return { ...product, percentage: undefined }
      }))
      
      setMatchedAppIds(matchedIds)
      setHasSearched(true)
      setLastSearchedPrompt(description)
      setPage(1) // Reset to first page
      
      // Check if all matches have low percentage
      const validMatches = data.results.filter(r => r.similarity_percent > 5)
      if (validMatches.length === 0 && data.results.length > 0) {
        setNoMatchPrompt(description)
        setShowNoMatchModal(true)
      }
      
    } catch (err) {
      console.error('Error matching applications:', err)
      setMatchError(err.message)
    } finally {
      setIsMatching(false)
    }
  }










  
  return (
    <ChakraProvider value={defaultSystem}>
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      <NoMatchModal 
        isOpen={showNoMatchModal} 
        onClose={() => setShowNoMatchModal(false)}
        userPrompt={noMatchPrompt}
      />
      
      {currentPage === 'marketplace' && (
        <Box display="flex" gap="4" px="2rem" pt="7rem" pb="2rem">
          <Box 
            width="20%"
            borderRadius="12px"
            overflow="hidden"
            alignSelf="flex-start"
          >
            <Filters onFilterChange={setFilters} availableTags={availableTags} />
          </Box>
          
          <Box 
            flex="1"
            padding="4"
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
                {/* User Prompts Section */}
                <Box mb="6">
                  <UserPrompts 
                    onSubmit={handleUserPrompt} 
                    isLoading={isMatching}
                  />
                  {matchError && (
                    <Text color="red.500" mt="2" fontSize="sm">
                      Error: {matchError}
                    </Text>
                  )}
                  {hasSearched && matchedAppIds.length === 0 && (
                    <Box mt="3" p="3" bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                      <Text color="blue.800" fontSize="sm" fontWeight="medium">
                        Sorry, we couldn't find a match. We are working on your petition.
                      </Text>
                    </Box>
                  )}
                  {hasLowPercentageMatches && (
                    <Box mt="3" p="3" bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                      <Text color="blue.800" fontSize="sm" fontWeight="medium">
                        There are no products that fit your criteria. We'll work on your petition.
                      </Text>
                    </Box>
                  )}
                  {matchedAppIds.length > 0 && filteredProducts.length > 0 && (
                    <Text color="green.600" mt="2" fontSize="sm">
                      Showing {filteredProducts.length} matched applications
                    </Text>
                  )}
                </Box>

                <Grid 
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                  gap="4"
                  w="100%"
                  alignContent="start"
                  mb="8"
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
              paddingTop="6"
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
        </Box>
      )}

      {currentPage === 'backlog' && (
        <Box display="flex" gap="4" px="2rem" pt="7rem" pb="2rem">
          <Box 
            flex="1"
            padding="4"
            bg="white"
            borderRadius="12px"
            display="flex"
            flexDirection="column"
          >
            <Box mb="4">
              <Text fontSize="2xl" fontWeight="bold" color="black">
                Application Backlog
              </Text>
              <Text fontSize="sm" color="gray.600" mt="1">
                Requested applications from users
              </Text>
            </Box>

            {backlogItems.length === 0 ? (
              <Box textAlign="center" padding="8">
                <Text fontSize="lg" color="gray.600">No backlog items yet</Text>
              </Box>
            ) : (
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                gap="4"
                w="100%"
                alignContent="start"
                mb="8"
              >
                {backlogItems.map((item) => (
                  <BacklogCard 
                    key={item.id} 
                    item={item}
                    onStatusToggle={(id, status) => {
                      setBacklogItems(prev => prev.map(i => 
                        i.id === id ? { ...i, status } : i
                      ))
                    }}
                    onClick={(id) => {
                      console.log('Backlog item clicked:', id)
                    }}
                    onDiscard={(id) => {
                      setBacklogItems(prev => prev.filter(i => i.id !== id))
                    }}
                  />
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      )}
    </ChakraProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
