import { useState, useEffect } from 'react'
import { Box, Grid, Text, Button, HStack } from '@chakra-ui/react'
import { FaPlus, FaThLarge, FaChartBar } from 'react-icons/fa'
import BacklogCard from '../assets/components/BacklogCard.tsx'
import BacklogDetailModal from '../assets/components/BacklogDetailModal.tsx'
import BacklogFormModal from '../assets/components/BacklogFormModal.tsx'
import ChartsView from '../assets/components/ChartsView.tsx'

const API_BASE_URL = 'http://localhost:8000'

export default function Backlog() {
  const [backlogItems, setBacklogItems] = useState([])
  const [backlogLoading, setBacklogLoading] = useState(false)
  const [backlogError, setBacklogError] = useState(null)
  
  const [viewMode, setViewMode] = useState('backlog')
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  // Fetch backlog items from backend
  const fetchBacklogItems = async () => {
    try {
      setBacklogLoading(true)
      setBacklogError(null)
      const response = await fetch(`${API_BASE_URL}/api/v1/cards`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      console.log('Raw backend data:', data)
      
      // Map backend data to frontend format and sort by upvotes (descending)
      const mappedBacklog = data
        .map(card => ({
          id: String(card.id),
          title: card.title,
          requestCount: card.number_of_requests || 0,
          upvotes: card.upvote || 0,  // This matches the backend field name
          status: card.status === 1 ? 'completed' : 'not-completed',
          created_by_bexio: card.created_by_bexio || false
        }))
        .sort((a, b) => b.upvotes - a.upvotes) // Sort by upvotes descending
      
      console.log('Mapped backlog items:', mappedBacklog)
      
      setBacklogItems(mappedBacklog)
    } catch (err) {
      console.error('Error fetching backlog items:', err)
      setBacklogError(err.message)
    } finally {
      setBacklogLoading(false)
    }
  }

  useEffect(() => {
    fetchBacklogItems()
  }, [])

  return (
    <>
      <BacklogDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedCardId(null)
        }}
        cardId={selectedCardId}
        canToggleStatus={true}
        canUpvote={false}  // Disable upvoting from Backlog
        onStatusUpdate={(cardId, newStatus) => {
          setBacklogItems(prev => prev.map(item => 
            item.id === cardId 
              ? { ...item, status: newStatus === 1 ? 'completed' : 'not-completed' }
              : item
          ))
        }}
      />

      <BacklogFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={(newCard) => {
          fetchBacklogItems()
        }}
      />

      {/* View Toggle - Below Navbar */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        gap="64px"
        pt="2rem" 
        pb="0"
        w="100%"
      >
        <Box
          cursor="pointer"
          pb="3"
          px="0"
          display="flex"
          justifyContent="center"
          borderBottom={viewMode === 'backlog' ? '3px solid black' : 'none'}
          width="fit-content"
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setViewMode('backlog')}
        >
          <Text 
            fontSize="lg" 
            fontWeight="600"
            color={viewMode === 'backlog' ? 'black' : 'gray.400'}
            transition="color 0.2s"
            textAlign="center"
            px="2"
          >
            Cards
          </Text>
        </Box>
        <Box
          cursor="pointer"
          pb="3"
          px="0"
          display="flex"
          justifyContent="center"
          borderBottom={viewMode === 'charts' ? '3px solid black' : 'none'}
          width="fit-content"
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setViewMode('charts')}
        >
          <Text 
            fontSize="lg" 
            fontWeight="600"
            color={viewMode === 'charts' ? 'black' : 'gray.400'}
            transition="color 0.2s"
            textAlign="center"
            px="2"
          >
            Charts
          </Text>
        </Box>
      </Box>
      <Box h="2.5rem" /> {/* Add extra space below the toggle */}
      {/* Cards header only for cards view */}
      
      
      <Box display="flex" gap="4" px="2rem" pb="2rem">
        <Box 
          flex="1"
          padding="4"
          bg="white"
          borderRadius="12px"
          display="flex"
          flexDirection="column"
        >
          {/* Header with Title and Create Button */}
          <Box mb="4" display="flex" justifyContent="space-between" alignItems="center">
            {/* Left: Title */}
            <Box flex="1">
              <Text fontSize="2xl" fontWeight="bold" color="black">
                Backlog
              </Text>
            </Box>

            {/* Right: Create New Card Button - Only show in backlog view */}
            <Box flex="1" display="flex" justifyContent="flex-end">
              {viewMode === 'backlog' && (
                <Button
                  onClick={() => setIsFormModalOpen(true)}
                  colorScheme="blue"
                  size="lg"
                  leftIcon={<FaPlus />}
                >
                  Create New Card
                </Button>
              )}
            </Box>
          </Box>

          {/* Charts View */}
          {viewMode === 'charts' && (
            <ChartsView />
          )}

          {/* Backlog Cards View */}
          {viewMode === 'backlog' && (
            <>
              {/* Loading and Error States */}
              {backlogLoading && (
                <Box textAlign="center" padding="8">
                  <Text fontSize="lg" color="gray.600">Loading backlog items...</Text>
                </Box>
              )}
              
              {backlogError && (
                <Box textAlign="center" padding="8">
                  <Text fontSize="lg" color="red.500">Error loading backlog: {backlogError}</Text>
                  <Text fontSize="sm" color="gray.600" mt="2">Please try refreshing the page</Text>
                </Box>
              )}
              
              {!backlogLoading && !backlogError && backlogItems.length > 0 && (
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
                      onClick={(id) => {
                        setSelectedCardId(id)
                        setIsDetailModalOpen(true)
                      }}
                      onDiscard={async (id) => {
                        try {
                          // Call the backend API to drop the card
                          const response = await fetch(`${API_BASE_URL}/api/v1/dropcard`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              card_id: id
                            }),
                          })
                          
                          if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`)
                          }
                          
                          const data = await response.json()
                          console.log('Backlog card dropped:', data.message)
                          
                          // Remove from local state after successful API call
                          setBacklogItems(prev => prev.filter(i => i.id !== id))
                        } catch (error) {
                          console.error('Failed to drop backlog card:', error)
                          // Optionally show an error message to the user
                        }
                      }}
                    />
                  ))}
                </Grid>
              )}

              {/* Show message when no items exist */}
              {!backlogLoading && !backlogError && backlogItems.length === 0 && (
                <Box textAlign="center" padding="8">
                  <Text fontSize="lg" color="gray.600">No backlog items yet</Text>
                  <Text fontSize="sm" color="gray.500" mt="2">Click "Create New Card" to add one</Text>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
