import { useState, useEffect } from 'react'
import { Box, Grid, Text } from '@chakra-ui/react'
import BacklogCard from '../assets/components/BacklogCard.tsx'

const API_BASE_URL = 'http://localhost:8000'

export default function Backlog() {
  const [backlogItems, setBacklogItems] = useState([])
  const [backlogLoading, setBacklogLoading] = useState(false)
  const [backlogError, setBacklogError] = useState(null)

  // Fetch backlog items from backend
  useEffect(() => {
    const fetchBacklogItems = async () => {
      try {
        setBacklogLoading(true)
        setBacklogError(null)
        const response = await fetch(`${API_BASE_URL}/api/v1/cards`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Map backend data to frontend format
        const mappedBacklog = data.map(card => ({
          id: String(card.id),
          title: card.title,
          requestCount: card.number_of_requests || 0,
          status: card.status === 1 ? 'completed' : 'not-completed'
        }))
        
        setBacklogItems(mappedBacklog)
      } catch (err) {
        console.error('Error fetching backlog items:', err)
        setBacklogError(err.message)
      } finally {
        setBacklogLoading(false)
      }
    }

    fetchBacklogItems()
  }, [])

  return (
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

        {!backlogLoading && !backlogError && backlogItems.length === 0 && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">No backlog items yet</Text>
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
                onStatusToggle={async (id, status) => {
                  try {
                    // Call the backend API to toggle the card status
                    const response = await fetch(`${API_BASE_URL}/api/v1/cards/toggle-status`, {
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
                    
                    const updatedCard = await response.json()
                    console.log('Card status toggled:', updatedCard)
                    
                    // Update local state with the new status from backend
                    setBacklogItems(prev => prev.map(i => 
                      i.id === id ? { ...i, status: updatedCard.status === 1 ? 'completed' : 'not-completed' } : i
                    ))
                  } catch (error) {
                    console.error('Failed to toggle card status:', error)
                    // Optionally show an error message to the user
                  }
                }}
                onClick={(id) => {
                  console.log('Backlog item clicked:', id)
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
      </Box>
    </Box>
  )
}
