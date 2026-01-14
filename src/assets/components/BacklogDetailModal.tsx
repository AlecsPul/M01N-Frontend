import { useState, useEffect } from "react"
import { Box, Text, VStack, HStack, Badge, Button, Spinner, IconButton } from "@chakra-ui/react"
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogBackdrop } from "@chakra-ui/react"
import { FaCheckCircle, FaTimesCircle, FaSearch, FaTimes, FaArrowUp } from "react-icons/fa"

const API_BASE_URL = 'http://localhost:8000'

interface BacklogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  cardId: string
  showSearchButton?: boolean
  canToggleStatus?: boolean
  canUpvote?: boolean  // Add this prop to control upvote functionality
  onStatusUpdate?: (cardId: string, newStatus: number) => void
  onUpvote?: (cardId: string) => void  // Add this prop
}

interface CardDetail {
  id: string
  title: string
  description: string | null
  status: number
  number_of_requests: number
  upvote?: number  // Changed from upvotes to upvote to match backend field name
  created_at: string
  updated_at: string | null
  comments: Array<{
    id: string
    prompt_text: string
    comment_text: string | null
    created_at: string
  }>
}

export default function BacklogDetailModal({ isOpen, onClose, cardId, showSearchButton = true, canToggleStatus = false, canUpvote = false, onStatusUpdate, onUpvote }: BacklogDetailModalProps) {
  const [cardDetail, setCardDetail] = useState<CardDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCloseHovered, setIsCloseHovered] = useState(false)
  const [providerSuggestion, setProviderSuggestion] = useState<null | {
    company_name: string
    company_url: string
    marketplace_url: string
    reasoning_brief: string
  }>(null)
  const [providerLoading, setProviderLoading] = useState(false)
  const [providerError, setProviderError] = useState<string | null>(null)

  // Reset hover state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsCloseHovered(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !cardId) return

    const fetchCardDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch card basic info
        const cardResponse = await fetch(`${API_BASE_URL}/api/v1/cards/${cardId}`)
        
        if (!cardResponse.ok) {
          throw new Error(`HTTP error! status: ${cardResponse.status}`)
        }
        
        const cardData = await cardResponse.json()
        
        // Fetch comments and prompts for this card
        const commentsResponse = await fetch(`${API_BASE_URL}/api/v1/cards/${cardId}/comments`)
        
        if (!commentsResponse.ok) {
          throw new Error(`HTTP error! status: ${commentsResponse.status}`)
        }
        
        const commentsData = await commentsResponse.json()
        
        console.log('Card data:', cardData)
        console.log('Comments data:', commentsData)
        
        // Combine data
        setCardDetail({
          ...cardData,
          comments: commentsData
        })
      } catch (err) {
        console.error('Error fetching card details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load card details')
      } finally {
        setLoading(false)
      }
    }

    fetchCardDetail()
  }, [isOpen, cardId])

  const handleSearchMarketplaces = async () => {
    setProviderLoading(true)
    setProviderError(null)
    setProviderSuggestion(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/backlog/${cardId}/suggest-provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProviderSuggestion({
        company_name: data.company_name,
        company_url: data.company_url,
        marketplace_url: data.marketplace_url,
        reasoning_brief: data.reasoning_brief
      })
    } catch (err) {
      setProviderError(err instanceof Error ? err.message : 'Failed to fetch provider suggestion')
    } finally {
      setProviderLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!canToggleStatus || !cardDetail) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cards/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: cardDetail.id
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const updatedCard = await response.json()
      console.log('Card status toggled:', updatedCard)
      
      // Update local state
      setCardDetail(prev => prev ? {
        ...prev,
        status: updatedCard.status
      } : null)
      
      // Notify parent component of the change
      if (onStatusUpdate) {
        onStatusUpdate(cardDetail.id, updatedCard.status)
      }
    } catch (error) {
      console.error('Failed to toggle card status:', error)
    }
  }

  const handleUpvote = async () => {
    if (!canUpvote || !cardDetail) return  // Check canUpvote permission
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/cards/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: cardDetail.id
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const updatedCard = await response.json()
      console.log('Card upvoted:', updatedCard)
      
      // Update local state
      setCardDetail(prev => prev ? {
        ...prev,
        upvote: updatedCard.upvote
      } : null)
      
      // Notify parent component of the change
      if (onUpvote) {
        onUpvote(cardDetail.id)
      }
    } catch (error) {
      console.error('Failed to upvote card:', error)
    }
  }

  // Reset provider suggestion when cardId changes
  useEffect(() => {
    setProviderSuggestion(null)
    setProviderError(null)
    setProviderLoading(false)
  }, [cardId])

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <DialogBackdrop />
      <DialogContent
        position="fixed"
        right="0"
        top="0"
        bottom="0"
        maxW="600px"
        h="100vh"
        m="0"
        borderRadius="0"
        bg="white"
        boxShadow="2xl"
        transform={isOpen ? "translateX(0)" : "translateX(100%)"}
        transition="transform 0.3s ease-in-out"
        display="flex"
        flexDirection="column"
      >
        <DialogHeader borderBottom="2px solid" borderColor="gray.200" pb="4" position="relative">
          <HStack justify="space-between" align="center">
            <DialogTitle fontSize="2xl" fontWeight="bold" color="black">
              Upvotes
            </DialogTitle>
            <HStack 
              gap="2" 
              bg="gray.100" 
              px="4" 
              py="2" 
              borderRadius="full"
              border="2px solid"
              borderColor="gray.300"
              cursor={canUpvote ? "pointer" : "default"}  // Only clickable if canUpvote
              onClick={canUpvote ? handleUpvote : undefined}  // Only handle click if canUpvote
              transition="all 0.2s"
              _hover={canUpvote ? { 
                bg: "green.50", 
                borderColor: "green.400"
              } : {}}
            >
              <FaArrowUp color="#38A169" size={20} />
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                {cardDetail?.upvote || 0}
              </Text>
            </HStack>
          </HStack>
          <IconButton
            onClick={onClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            position="absolute"
            top="2"
            right="2"
            bg="black"
            borderRadius="md"
            width="36px"
            height="36px"
            minW="36px"
            aria-label="Close"
            _hover={{ 
              bg: "white", 
              border: "2px solid black"
            }}
          >
            <FaTimes color={isCloseHovered ? "black" : "white"} size={18} />
          </IconButton>
        </DialogHeader>

        <DialogBody p="6" overflowY="auto" flex="1">
          {loading && (
            <Box textAlign="center" py="8">
              <Spinner size="xl" color="green.500" />
              <Text mt="4" color="gray.600">Loading details...</Text>
            </Box>
          )}

          {error && (
            <Box textAlign="center" py="8">
              <Text color="red.500" fontSize="lg">{error}</Text>
            </Box>
          )}

          {!loading && !error && cardDetail && (
            <VStack align="stretch" gap="6">
              {/* Title and Status */}
              <Box>
                <HStack justify="space-between" align="start" mb="3" gap="4">
                  <Text fontSize="3xl" fontWeight="bold" color="black" flex="1" lineHeight="1.2" wordBreak="break-word">
                    {cardDetail.title}
                  </Text>
                  <HStack gap="2" flexShrink="0">
                    <Badge 
                      colorScheme={cardDetail.status === 1 ? "green" : "red"}
                      fontSize="md" 
                      px="4" 
                      py="2" 
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      gap="2"
                      bg={cardDetail.status === 1 ? "green.500" : "red.500"}
                      color="white"
                      cursor={canToggleStatus ? "pointer" : "default"}
                      onClick={canToggleStatus ? handleToggleStatus : undefined}
                      border={canToggleStatus ? "2px solid" : "none"}
                      borderColor={canToggleStatus ? (cardDetail.status === 1 ? "green.700" : "red.700") : "transparent"}
                      boxShadow={canToggleStatus ? "md" : "none"}
                      transition="all 0.2s ease-in-out"
                      _hover={canToggleStatus ? { 
                        transform: "scale(1.05)",
                        boxShadow: "lg",
                        bg: cardDetail.status === 1 ? "green.600" : "red.600"
                      } : {}}
                      _active={canToggleStatus ? {
                        transform: "scale(0.98)",
                        boxShadow: "sm"
                      } : {}}
                    >
                      {cardDetail.status === 1 ? (
                        <><FaCheckCircle /> Completed</>
                      ) : (
                        <><FaTimesCircle /> Not Completed</>
                      )}
                    </Badge>
                  </HStack>
                </HStack>

                {/* Request Count and Search Button */}
                <HStack gap="3" align="center">
                  <Badge 
                    colorScheme="blue" 
                    fontSize="lg" 
                    px="4" 
                    py="2" 
                    borderRadius="md"
                  >
                    {cardDetail.number_of_requests} {cardDetail.number_of_requests === 1 ? 'Request' : 'Requests'}
                  </Badge>
                  {showSearchButton && (
                    <Button
                      onClick={handleSearchMarketplaces}
                      size="sm"
                      colorScheme="blue"
                      bg="blue.500"
                      _hover={{ bg: "blue.600" }}
                      borderRadius="md"
                      loading={providerLoading}
                    >
                      <FaSearch style={{ marginRight: '6px' }} size={14} />
                      Search in Popular Marketplaces
                    </Button>
                  )}
                </HStack>
                {/* Provider Suggestion Result */}
                {providerLoading && (
                  <Box mt="4" textAlign="center">
                    <Spinner size="md" color="blue.500" />
                    <Text mt="2" color="gray.500">Searching for providers...</Text>
                  </Box>
                )}
                {providerError && (
                  <Box mt="4" textAlign="center">
                    <Text color="red.500">{providerError}</Text>
                  </Box>
                )}
                {providerSuggestion && (
                  <Box mt="4" bg="gray.50" p="4" borderRadius="12px" border="1px solid" borderColor="blue.200">
                    <Text fontSize="md" fontWeight="bold" color="blue.700" mb="2">
                      Suggested Provider: {providerSuggestion.company_name}
                    </Text>
                    <Text fontSize="sm" color="gray.700" mb="2">
                      {providerSuggestion.reasoning_brief}
                    </Text>
                    <HStack gap="3" mt="2">
                      {providerSuggestion.company_url && (
                        <a href={providerSuggestion.company_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button size="sm" colorScheme="blue" variant="outline" as="span">
                            Visit Company
                          </Button>
                        </a>
                      )}
                      {providerSuggestion.marketplace_url && (
                        <a href={providerSuggestion.marketplace_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button size="sm" colorScheme="green" variant="outline" as="span">
                            View in Marketplace
                          </Button>
                        </a>
                      )}
                    </HStack>
                  </Box>
                )}
              </Box>

              {/* Description */}
              {cardDetail.description && (
                <Box 
                  bg="gray.50" 
                  p="4" 
                  borderRadius="12px" 
                  borderLeft="4px solid" 
                  borderColor="blue.400"
                >
                  <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb="2">
                    DESCRIPTION
                  </Text>
                  <Text fontSize="md" color="gray.800" lineHeight="1.6">
                    {cardDetail.description}
                  </Text>
                </Box>
              )}

              {/* Comments and Prompts Section */}
              {cardDetail.comments && cardDetail.comments.length > 0 && (
                <Box>
                  <Text fontSize="xl" fontWeight="bold" color="black" mb="4">
                    User Feedback & Prompts
                  </Text>
                  <VStack align="stretch" gap="4">
                    {cardDetail.comments.map((comment) => (
                      <Box 
                        key={comment.id}
                        bg="white"
                        border="2px solid"
                        borderColor="gray.300"
                        borderRadius="12px"
                        p="5"
                        _hover={{ 
                          borderColor: "blue.400",
                          boxShadow: "md",
                          transition: "all 0.2s"
                        }}
                      >
                        {/* User Prompt */}
                        <Box mb="3">
                          <HStack mb="2">
                            <Badge colorScheme="purple" fontSize="xs" px="2" py="1">
                              USER PROMPT
                            </Badge>
                          </HStack>
                          <Text 
                            fontSize="md" 
                            fontWeight="medium" 
                            color="purple.700"
                            bg="purple.50"
                            p="3"
                            borderRadius="8px"
                            fontStyle="italic"
                          >
                            "{comment.prompt_text}"
                          </Text>
                        </Box>

                        {/* Comment */}
                        {comment.comment_text && (
                          <Box>
                            <HStack mb="2">
                              <Badge colorScheme="green" fontSize="xs" px="2" py="1">
                                COMMENT
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                {new Date(comment.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Text>
                            </HStack>
                            <Text 
                              fontSize="md" 
                              color="gray.700"
                              lineHeight="1.6"
                            >
                              {comment.comment_text}
                            </Text>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              {cardDetail.comments && cardDetail.comments.length === 0 && (
                <Box 
                  textAlign="center" 
                  py="6" 
                  bg="gray.50" 
                  borderRadius="12px"
                >
                  <Text color="gray.500" fontSize="md">
                    No user feedback yet
                  </Text>
                </Box>
              )}

              {/* Metadata */}
              <Box 
                bg="gray.50" 
                p="4" 
                borderRadius="8px"
                fontSize="xs"
                color="gray.600"
              >
                <HStack justify="space-between">
                  <Text>Created: {new Date(cardDetail.created_at).toLocaleString()}</Text>
                  {cardDetail.updated_at && (
                    <Text>Updated: {new Date(cardDetail.updated_at).toLocaleString()}</Text>
                  )}
                </HStack>
              </Box>
            </VStack>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}
