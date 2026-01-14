import { useState, useEffect } from 'react'
import { Box, Grid, Text } from '@chakra-ui/react'
import BacklogCard from '../assets/components/BacklogCard.tsx'
import ChartsView from '../assets/components/ChartsView.tsx'

const API_BASE_URL = 'http://localhost:8000'

export default function Backlog() {
  const [backlogItems, setBacklogItems] = useState([])
  const [backlogLoading, setBacklogLoading] = useState(false)
  const [backlogError, setBacklogError] = useState(null)
  const [viewMode, setViewMode] = useState('backlog')

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
    <Box pt="7rem">
      {/* View Toggle */}
      <Box 
        display="flex" 
        justifyContent="center" 
        gap="12" 
        px="2rem" 
        pb="4rem"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Box
          cursor="pointer"
          pb="3"
          borderBottom={viewMode === 'backlog' ? '3px solid black' : 'none'}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setViewMode('backlog')}
        >
          <Text 
            fontSize="lg" 
            fontWeight="600"
            color={viewMode === 'backlog' ? 'black' : 'gray.400'}
            transition="color 0.2s"
          >
            Backlog
          </Text>
        </Box>
        <Box
          cursor="pointer"
          pb="3"
          borderBottom={viewMode === 'charts' ? '3px solid black' : 'none'}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setViewMode('charts')}
        >
          <Text 
            fontSize="lg" 
            fontWeight="600"
            color={viewMode === 'charts' ? 'black' : 'gray.400'}
            transition="color 0.2s"
          >
            Charts
          </Text>
        </Box>
      </Box>

      {/* Backlog View */}
      {viewMode === 'backlog' && (
        <Box display="flex" gap="4" px="2rem" pb="2rem">
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
                        setBacklogItems(prev => prev.map(i => 
                          i.id === id ? { ...i, status: updatedCard.status === 1 ? 'completed' : 'not-completed' } : i
                        ))
                      } catch (error) {
                        console.error('Failed to toggle card status:', error)
                      }
                    }}
                    onClick={(id) => {
                      console.log('Card clicked:', id)
                    }}
                    onDiscard={async (id) => {
                      try {
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
                        setBacklogItems(prev => prev.filter(i => i.id !== id))
                      } catch (error) {
                        console.error('Failed to drop backlog card:', error)
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      )}

      {/* Charts View */}
      {viewMode === 'charts' && (
        <ChartsView apiBaseUrl={API_BASE_URL} />
      )}
    </Box>
  )
}
