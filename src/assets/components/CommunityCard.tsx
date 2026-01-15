import { Box, Text, HStack, VStack, Badge } from '@chakra-ui/react'

interface CommunityCardProps {
  item: {
    id: string
    title: string
    upvotes: number
    requests: number
    status: 'completed' | 'not-completed'
    created_by_bexio?: boolean
  }
  onClick?: (id: string) => void
  onUpvote?: (id: string) => void
}

export default function CommunityCard({ item, onClick, onUpvote }: CommunityCardProps) {
  console.log('CommunityCard - item:', item) // Debug log
  
  return (
    <Box
      bg={item.created_by_bexio ? "#FEF08A" : "white"}
      border="1px solid"
      borderColor={item.created_by_bexio ? "#FBBF24" : "gray.200"}
      borderRadius="lg"
      px={6}
      py={5}
      boxShadow="md"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
        borderColor: item.created_by_bexio ? "#FBBF24" : "gray.300"
      }}
      mb={6}
      onClick={() => onClick?.(item.id)}
      display="flex"
      flexDirection="column"
      gap={3}
    >
      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={3}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="black"
            flex="1"
            lineHeight="1.4"
          >
            {item.title}
          </Text>
          <HStack gap={2}>
            <Box
              bg={item.status === 'completed' ? 'green.100' : 'gray.100'}
              px={3}
              py={1}
              borderRadius="md"
              
            >
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={item.status === 'completed' ? 'green.700' : 'gray.600'}
              >
                {item.status === 'completed' ? 'Completed' : 'Pending'}
              </Text>
            </Box>
            {item.created_by_bexio && (
              <Badge
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
                bg="#FBBF24"
                color="gray.000"
                fontWeight="bold"
              >
                Created by Bexio
              </Badge>
            )}
          </HStack>
        </HStack>

        <HStack gap={3}>
          <Box
            bg="#1a3570"
            px={4}
            py={2}
            borderRadius="md"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: "#162e5c" }}
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.(item.id)
            }}
          >
            <HStack gap={1}>
              <Text fontSize="lg" color="white">👍</Text>
              <Text fontSize="sm" fontWeight="bold" color="white">
                {item.upvotes}
              </Text>
              <Text fontSize="xs" color="blue.100">upvotes</Text>
            </HStack>
          </Box>

          {item.created_by_bexio ? (
            <Badge
              fontSize="xs"
              px={2}
              py={1}
              borderRadius="full"
              bg="purple.400"
              color="white"
              fontWeight="bold"
            >
              Comment and suggest
            </Badge>
          ) : (
            <Box
              bg="gray.50"
              px={4}
              py={2}
              borderRadius="md"
            >
              <HStack gap={1}>
                <Text fontSize="lg">📝</Text>
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  {item.requests}
                </Text>
                <Text fontSize="xs" color="gray.600">requests</Text>
              </HStack>
            </Box>
          )}
        </HStack>
      </VStack>
    </Box>
  )
}
