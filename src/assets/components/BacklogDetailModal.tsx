import { useState, useEffect } from "react"
import { Box, Text, VStack, HStack, Badge, Button, Spinner, IconButton } from "@chakra-ui/react"
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogBackdrop } from "@chakra-ui/react"
import { FaCheckCircle, FaTimesCircle, FaSearch, FaTimes } from "react-icons/fa"

const API_BASE_URL = 'http://localhost:8000'

interface BacklogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  cardId: string
}

interface CardDetail {
  id: string
  title: string
  description: string | null
  status: number
  number_of_requests: number
  created_at: string
  updated_at: string | null
  comments: Array<{
    id: string
    prompt_text: string
    comment_text: string | null
    created_at: string
  }>
}

export default function BacklogDetailModal({ isOpen, onClose, cardId }: BacklogDetailModalProps) {
  const [cardDetail, setCardDetail] = useState<CardDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCloseHovered, setIsCloseHovered] = useState(false)

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

  const handleSearchMarketplaces = () => {
    // TODO: Implement search in popular marketplaces
    console.log('Search in marketplaces for:', cardDetail?.title)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="xl">
      <DialogBackdrop />
      <DialogContent
        maxW="900px"
        maxH="90vh"
        overflowY="auto"
        bg="white"
        borderRadius="16px"
        boxShadow="2xl"
      >
        <DialogHeader borderBottom="2px solid" borderColor="gray.200" pb="4" position="relative">
          <DialogTitle fontSize="2xl" fontWeight="bold" color="black">
            Application Details
          </DialogTitle>
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

        <DialogBody p="6">
          {loading && (
            <Box textAlign="center" py="8">
              <Spinner size="xl" color="blue.500" />
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
                <HStack justify="space-between" align="start" mb="3">
                  <Text fontSize="3xl" fontWeight="bold" color="black" flex="1">
                    {cardDetail.title}
                  </Text>
                  <HStack gap="2">
                    {cardDetail.status === 1 ? (
                      <Badge 
                        colorScheme="green" 
                        fontSize="md" 
                        px="4" 
                        py="2" 
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        gap="2"
                      >
                        <FaCheckCircle /> Completed
                      </Badge>
                    ) : (
                      <Badge 
                        colorScheme="red" 
                        fontSize="md" 
                        px="4" 
                        py="2" 
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        gap="2"
                      >
                        <FaTimesCircle /> Not Completed
                      </Badge>
                    )}
                  </HStack>
                </HStack>

                {/* Request Count */}
                <Badge 
                  colorScheme="blue" 
                  fontSize="lg" 
                  px="4" 
                  py="2" 
                  borderRadius="md"
                >
                  {cardDetail.number_of_requests} {cardDetail.number_of_requests === 1 ? 'Request' : 'Requests'}
                </Badge>
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

              {/* Search Button */}
              <Box 
                borderTop="2px solid" 
                borderColor="gray.200" 
                pt="6" 
                mt="4"
              >
                <Button
                  onClick={handleSearchMarketplaces}
                  size="lg"
                  width="100%"
                  colorScheme="blue"
                  bg="blue.500"
                  _hover={{ bg: "blue.600" }}
                  fontSize="lg"
                  py="6"
                  borderRadius="12px"
                  boxShadow="lg"
                >
                  <FaSearch style={{ marginRight: '8px' }} />
                  Search in Popular Marketplaces
                </Button>
              </Box>

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
