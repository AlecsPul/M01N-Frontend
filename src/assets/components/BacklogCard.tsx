import { Text, Card, Box, HStack, Badge, IconButton } from "@chakra-ui/react"
import { FaCheckCircle, FaTimesCircle, FaTrash, FaArrowUp } from "react-icons/fa"

interface BacklogItem {
  id: string
  title: string
  requestCount: number
  upvotes?: number
  status: "completed" | "not-completed"
  created_by_bexio?: boolean
}

interface BacklogCardProps {
  item: BacklogItem
  onStatusToggle?: (id: string, newStatus: "completed" | "not-completed") => void
  onClick?: (id: string) => void
  onDiscard?: (id: string) => void
  onUpvote?: (id: string) => void
}

export default function BacklogCard({ item, onStatusToggle, onClick, onDiscard, onUpvote }: BacklogCardProps) {
  console.log('BacklogCard - item:', item) // Debug log
  
  const handleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    if (onDiscard) {
      onDiscard(item.id)
    }
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(item.id)
    }
  }

  return (
    <Card.Root 
      overflow="visible" 
      m={4} 
      bg={item.created_by_bexio ? "#FEF08A" : "white"}
      position="relative"
      cursor="pointer"
      onClick={handleCardClick}
      
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="md"
      _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
      display="flex"
      flexDirection="column"
      h="100%"
    >
      <Card.Body gap="3" display="flex" flexDirection="column" flex="1" p="4">
        {/* Status Badge and Discard Button */}
        <HStack 
          justifyContent="space-between" 
          alignItems="center"
        >
          <HStack gap="2" flexWrap="wrap">
            <Badge 
              colorScheme={item.status === "completed" ? "green" : "red"}
              fontSize="sm" 
              px="3" 
              py="1" 
              borderRadius="full"
              display="flex"
              alignItems="center"
              gap="1"
              bg={item.status === "completed" ? "green.500" : "red.500"}
              color="white"
            >
              {item.status === "completed" ? (
                <><FaCheckCircle size={12} /> Completed</>
              ) : (
                <><FaTimesCircle size={12} /> Not Completed</>
              )}
            </Badge>
            {item.created_by_bexio && (
              <Badge 
                fontSize="xs" 
                px="2" 
                py="1" 
                borderRadius="full"
                bg="#FBBF24"
                color="gray.800"
                fontWeight="bold"
              >
                Created by Bexio
              </Badge>
            )}
          </HStack>
          {onDiscard && (
            <IconButton
              aria-label="Discard item"
              onClick={handleDiscard}
              size="sm"
              colorScheme="red"
              _hover={{ bg: "red.100" }}
            >
              <FaTrash />
            </IconButton>
          )}
        </HStack>

        {/* Title */}
        <Card.Title 
          color="black" 
          fontSize="xl" 
          fontWeight="semibold" 
          lineHeight="1.4"
          minH="2.8em"
        >
          {item.title}
        </Card.Title>

        {/* Request Count Badge and Upvotes */}
        <HStack mt="auto" justify="space-between" align="center">
          {item.created_by_bexio ? (
            <Badge 
              fontSize="xs" 
              px="2" 
              py="1" 
              borderRadius="full"
              bg="purple.400"
              color="white"
              fontWeight="bold"
            >
              Comment and suggest
            </Badge>
          ) : (
            <Badge 
              colorScheme="blue" 
              fontSize="md" 
              px="3" 
              py="1" 
              borderRadius="md"
            >
              {item.requestCount} {item.requestCount === 1 ? "Request" : "Requests"}
            </Badge>
          )}
          <HStack 
            gap="2" 
            bg="gray.100" 
            px="3" 
            py="1" 
            borderRadius="full"
            border="2px solid"
            borderColor="gray.300"
            cursor={onUpvote ? "pointer" : "default"}
            onClick={onUpvote ? (e) => {
              e.stopPropagation()
              onUpvote(item.id)
            } : undefined}
            _hover={onUpvote ? { 
              bg: "green.50", 
              borderColor: "green.400"
            } : {}}
            transition="all 0.2s"
          >
            <FaArrowUp color="#38A169" size={16} />
            <Text fontSize="md" fontWeight="bold" color="gray.700">
              {item.upvotes || 0}
            </Text>
          </HStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  )
}
