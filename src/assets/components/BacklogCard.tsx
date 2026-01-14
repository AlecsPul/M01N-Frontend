import { useState } from "react"
import { Text, Card, Box, HStack, Badge, IconButton } from "@chakra-ui/react"
import { FaCheckSquare, FaRegSquare, FaTrash } from "react-icons/fa"

interface BacklogItem {
  id: string
  title: string
  requestCount: number
  status: "completed" | "not-completed"
}

interface BacklogCardProps {
  item: BacklogItem
  onStatusToggle?: (id: string, newStatus: "completed" | "not-completed") => void
  onClick?: (id: string) => void
  onDiscard?: (id: string) => void
}

export default function BacklogCard({ item, onStatusToggle, onClick, onDiscard }: BacklogCardProps) {
  const [status, setStatus] = useState<"completed" | "not-completed">(item.status)

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    const newStatus = status === "completed" ? "not-completed" : "completed"
    setStatus(newStatus)
    if (onStatusToggle) {
      onStatusToggle(item.id, newStatus)
    }
  }

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

  const statusColor = status === "completed" ? "green.500" : "red.500"
  const statusBgColor = status === "completed" ? "green.50" : "red.50"
  const statusText = status === "completed" ? "Completed" : "Not Completed"

  return (
    <Card.Root 
      overflow="visible" 
      m={4} 
      bg="white"
      position="relative"
      cursor="pointer"
      onClick={handleCardClick}
      border="2px solid"
      borderColor="black"
      borderRadius="md"
      _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
      display="flex"
      flexDirection="column"
      h="100%"
    >
      <Card.Body gap="3" display="flex" flexDirection="column" flex="1" p="4">
        {/* Status Toggle and Discard Button */}
        <HStack 
          justifyContent="space-between" 
          alignItems="center"
        >
          <HStack 
            gap={2}
            cursor="pointer"
            onClick={handleStatusClick}
            _hover={{ opacity: 0.8 }}
            bg={statusBgColor}
            px={3}
            py={2}
            borderRadius="md"
            border="1px solid"
            borderColor={statusColor}
          >
            {status === "completed" ? (
              <FaCheckSquare color={statusColor} size={16} />
            ) : (
              <FaRegSquare color={statusColor} size={16} />
            )}
            <Text fontSize="md" fontWeight="semibold" color={statusColor}>
              {statusText}
            </Text>
          </HStack>
          <IconButton
            aria-label="Discard item"
            onClick={handleDiscard}
            size="sm"
            colorScheme="red"
            _hover={{ bg: "red.100" }}
          >
            <FaTrash />
          </IconButton>
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

        {/* Request Count Badge */}
        <Box mt="auto">
          <Badge 
            colorScheme="blue" 
            fontSize="md" 
            px="3" 
            py="1" 
            borderRadius="md"
          >
            {item.requestCount} {item.requestCount === 1 ? "Request" : "Requests"}
          </Badge>
        </Box>
      </Card.Body>
    </Card.Root>
  )
}
