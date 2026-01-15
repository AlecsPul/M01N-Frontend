import { useState, useEffect } from 'react'
import { Box, Grid, HStack, Button, Text } from '@chakra-ui/react'
import ProductCard from '../assets/components/ProductCard.tsx'
import Filters from '../assets/components/Filters.tsx'
import UserPrompts from '../assets/components/UserPrompts.tsx'
import NoMatchModal from '../assets/components/NoMatchModal.tsx'
import ComparisonModal from '../assets/components/ComparisonModal.tsx'
import { useCompareSelection } from '../hooks/useCompareSelection.ts'
import { comparisonService } from '../services/comparisonService.ts'

const API_BASE_URL = 'http://localhost:8000'

export default function Marketplace() {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    categories: [],
    priceType: null
  })
  const [matchedAppIds, setMatchedAppIds] = useState([])
  const [isMatching, setIsMatching] = useState(false)
  const [matchError, setMatchError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [lastSearchedPrompt, setLastSearchedPrompt] = useState('')
  const [showNoMatchModal, setShowNoMatchModal] = useState(false)
  const [noMatchPrompt, setNoMatchPrompt] = useState('')
  
  // Comparison State
  const { selectedApps, isFull, toggleSelection, isSelected, clearSelection } = useCompareSelection()
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false)
  const [comparisonData, setComparisonData] = useState(null)
  const [isComparing, setIsComparing] = useState(false)
  const [compareError, setCompareError] = useState(null)

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
          rating: app.rating || 0,  // Changed from app.stars to app.rating
          link: app.url
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

  // Define categories and industries
  const categoryList = [
    'Time tracking & appointment scheduling',
    'Connector apps',
    'Finances & Accounting',
    'CRM & marketing',
    'Receipts & expenses',
    'Sales',
    'Analytics & reporting',
    'Security & digital archiving',
    'Industry solutions'
  ]

  const industryList = [
    'Trade & E-Commerce',
    'Construction, Craft & Maintenance',
    'Healthcare',
    'Gastronomy & Hospitality',
    'Services & IT',
    'Transport & Logistics',
    'Manufacturing & Production',
    'Finance & Insurance',
    'Associations, Organizations & NPO',
    'Agencies & Creatives',
    'Agriculture & Environment'
  ]

  // Filter available tags into categories and industries
  const availableCategories = availableTags.filter(tag => categoryList.includes(tag))
  const availableIndustries = availableTags.filter(tag => industryList.includes(tag))

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

    // Filter by price type
    if (filters.priceType) {
      if (filters.priceType === 'free' && product.price !== 'Free') {
        return false
      }
      if (filters.priceType === 'paid' && product.price === 'Free') {
        return false
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

  const handleCompare = async () => {
    if (selectedApps.length !== 2) return;
    
    setIsComparisonModalOpen(true);
    setIsComparing(true);
    setCompareError(null);
    setComparisonData(null);

    try {
        const result = await comparisonService.compareApplications(
            selectedApps[0].name,
            selectedApps[1].name
        );
        setComparisonData(result);
    } catch (err) {
        setCompareError(err.message || 'Comparison failed');
    } finally {
        setIsComparing(false);
    }
  };

  const handleUserPrompt = async (description) => {
    // Clear selection on new search
    if (selectedApps.length > 0) {
      clearSelection();
    }

    // Don't search if it's the same prompt as last time
    if (description === lastSearchedPrompt && hasSearched) {
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
          buyer_prompt: description,
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

  const handleInteractiveResults = (results, finalPrompt) => {
    // Extract app_ids and percentages from results
    const matchedIds = results.map(result => String(result.app_id))
    
    // Update products with percentage data
    setProducts(prevProducts => prevProducts.map(product => {
      const matchResult = results.find(r => String(r.app_id) === product.id)
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
    setLastSearchedPrompt(finalPrompt)
    setPage(1) // Reset to first page
    
    // Check if all matches have low percentage
    const validMatches = results.filter(r => r.similarity_percent > 5)
    if (validMatches.length === 0 && results.length > 0) {
      setNoMatchPrompt(finalPrompt)
      setShowNoMatchModal(true)
    }
    
    setMatchError(null)
    setIsMatching(false)
  }

  const handleApplicationClick = async (appId, appLink) => {
    try {
      // Track the click in the backend
      const response = await fetch(`${API_BASE_URL}/api/v1/application/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: appId
        }),
      });

      if (!response.ok) {
        console.error('Failed to track click');
      }

      // Open the application link
      window.open(appLink, '_blank');
    } catch (error) {
      console.error('Error tracking application click:', error);
      // Still open the link even if tracking fails
      window.open(appLink, '_blank');
    }
  };

  return (
    <>
      <NoMatchModal 
        isOpen={showNoMatchModal} 
        onClose={() => setShowNoMatchModal(false)}
        userPrompt={noMatchPrompt}
      />
<<<<<<< HEAD

      {/* Marketplace Title */}
      <Text
        fontSize="3xl"
        fontWeight="bold"
        mt="4rem"
        ml="11rem"
        mb="1.5rem"
        color="gray.800"
      >
        Marketplace
      </Text>
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        data={comparisonData}
        isLoading={isComparing}
        error={compareError}
      />
=======
>>>>>>> parent of 435011d (Marketplace Affordable)
      
      <Box display="flex" gap="4" px="2rem" pt="7rem" pb="2rem">
        <Box 
          width="20%"
          borderRadius="12px"
          overflow="hidden"
          alignSelf="flex-start"
        >
          <Filters 
            onFilterChange={setFilters} 
            availableCategories={availableCategories}
            availableIndustries={availableIndustries}
          />
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
                  onResults={handleInteractiveResults}
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
                
                {/* Comparison Actions */}
                <HStack mt="4" spacing={4} justifyContent="flex-end">
                  <Button 
                     variant="solid"
                     size="sm"
                     onClick={clearSelection}
                     disabled={selectedApps.length === 0}
                     bg={selectedApps.length > 0 ? "black" : "gray.300"}
                     color={selectedApps.length > 0 ? "white" : "gray.600"}
                     _hover={selectedApps.length > 0 ? { bg: "gray.800" } : {}}
                     _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
                  >
                    Cancel selection
                  </Button>
                  <Button 
                     variant="solid"
                     size="sm"
                     onClick={handleCompare}
                     isLoading={isComparing}
                     loadingText="Comparing..."
                     disabled={selectedApps.length !== 2}
                     bg={selectedApps.length === 2 ? "black" : "blue.500"}
                     color="white"
                     _hover={selectedApps.length === 2 ? { bg: "gray.800" } : { bg: "blue.600" }}
                     _disabled={{ opacity: 0.6, cursor: "not-allowed", bg: "gray.300", color: "gray.600" }}
                  >
                    Compare {selectedApps.length > 0 ? `(${selectedApps.length}/2)` : ''}
                  </Button>
                  {compareError && (
                    <Text color="red.500" fontSize="sm">{compareError}</Text>
                  )}
                </HStack>

              </Box>

              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                gap="4"
                w="100%"
                alignContent="start"
                mb="8"
              >
                {currentProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => handleApplicationClick(product.id, product.link)} // Track clicks
<<<<<<< HEAD
                    onSelect={toggleSelection}
                    showSelect={matchedAppIds.length > 0}
                    isSelected={isSelected(product.id)}
                    isSelectionDisabled={isFull}
=======
>>>>>>> parent of 435011d (Marketplace Affordable)
                  />
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
    </>
  )
}
