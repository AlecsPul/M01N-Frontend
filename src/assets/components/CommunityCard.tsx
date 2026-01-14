import { Box, Text, HStack, VStack } from '@chakra-ui/react'

interface CommunityCardProps {
  item: {
    id: string
    title: string
    upvotes: number
    requests: number
    status: 'completed' | 'not-completed'
  }
  onClick?: (id: string) => void
  onUpvote?: (id: string) => void
}

export default function CommunityCard({ item, onClick, onUpvote }: CommunityCardProps) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="8px"
      padding="4"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{ 
        transform: "translateY(-2px)",
        boxShadow: "md"
      }}
      onClick={() => onClick?.(item.id)}
    >
      <VStack align="stretch" gap="3">
        <HStack justify="space-between" align="start">
          <Text 
            fontSize="md" 
            fontWeight="600" 
            color="black"
            flex="1"
          >
            {item.title}
          </Text>
          <Box
            bg={item.status === 'completed' ? 'green.100' : 'gray.100'}
            px="2"
            py="1"
            borderRadius="4px"
          >
            <Text 
              fontSize="xs" 
              fontWeight="500"
              color={item.status === 'completed' ? 'green.700' : 'gray.600'}
            >
              {item.status === 'completed' ? 'Completed' : 'Pending'}
            </Text>
          </Box>
        </HStack>

        <HStack gap="2">
          <Box
            bg="blue.50"
            px="3"
            py="2"
            borderRadius="6px"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: 'blue.100' }}
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.(item.id)
            }}
          >
            <HStack gap="1">
              <Text fontSize="lg">👍</Text>
              <Text fontSize="sm" fontWeight="600" color="blue.700">
                {item.upvotes}
              </Text>
              <Text fontSize="xs" color="blue.600">upvotes</Text>
            </HStack>
          </Box>
          
          <Box
            bg="gray.50"
            px="3"
            py="2"
            borderRadius="6px"
          >
            <HStack gap="1">
              <Text fontSize="lg">📝</Text>
              <Text fontSize="sm" fontWeight="600" color="gray.700">
                {item.requests}
              </Text>
              <Text fontSize="xs" color="gray.600">requests</Text>
            </HStack>
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}
