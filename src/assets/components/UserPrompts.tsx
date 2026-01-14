import { Box, VStack, Text, Textarea, Button } from "@chakra-ui/react"
import { useState } from "react"

interface UserPromptsProps {
  onSubmit?: (description: string) => void
  isLoading?: boolean
}

export default function UserPrompts({ onSubmit, isLoading = false }: UserPromptsProps) {
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (description.trim()) {
      onSubmit?.(description)
      // Don't clear after submit so user can see what they searched for
    }
  }

  return (
    <Box
  w="100%"
  bg="white"
  p={6}
  borderRadius="12px"
  border="1px solid"
  borderColor="gray.200"
  boxShadow="sm"
>
  <VStack align="stretch" gap={3}>
    <Text fontSize="lg" fontWeight="semibold">
      What do you need help with?
    </Text>

    <Text fontSize="sm" color="gray.600">
      We’ll suggest tools that match your needs.
    </Text>

    <Textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Example: I need an easy way to send invoices and track payments"
      minH="120px"
      borderColor="gray.300"
      _focus={{ borderColor: "blue.400", boxShadow: "none" }}
    />

    <Button
      onClick={handleSubmit}
      colorScheme="blue"
      disabled={!description.trim() || isLoading}
    >
      {isLoading ? 'Matching...' : 'See options'}
    </Button>
  </VStack>
</Box>

  )
}
