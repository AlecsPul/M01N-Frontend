import { Box, VStack, Text, Textarea, Button, Input, HStack, Spinner } from "@chakra-ui/react"
import { useState, useRef, useEffect } from "react"
import { useInteractiveSearch } from "../../hooks/useInteractiveSearch"
import { MatchResult } from "../../services/interactiveMatchService"

interface UserPromptsProps {
  onSubmit?: (description: string) => void
  onResults?: (results: MatchResult[], finalPrompt: string) => void
  isLoading?: boolean
}

export default function UserPrompts({ onSubmit, onResults, isLoading = false }: UserPromptsProps) {
  const [description, setDescription] = useState("")
  const [chatInput, setChatInput] = useState("")

  // Use our new hook for interactive logic
  const {
    status,
    messages,
    error,
    startSearch,
    submitAnswer,
    reset
  } = useInteractiveSearch({ 
    onResults: (results, finalPrompt) => {
      // Pass results up to parent
      if (onResults) {
        onResults(results, finalPrompt)
      } else {
        // Fallback for legacy
        onSubmit?.(finalPrompt)
      }
      // We can also clear description here if desired
      setDescription("") 
    }
  })
  
  const isChatActive = status === 'needs_more' || status === 'requesting_continue' || (status === 'requesting_start' && messages.length > 0)
  const isProcessing = status === 'requesting_start' || status === 'requesting_continue' || status === 'requesting_finalize' || isLoading

  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  useEffect(() => {
    if (isChatActive) scrollToBottom()
  }, [messages, isChatActive])


  const handleSubmit = async () => {
    if (!description.trim()) return
    await startSearch(description)
  }

  const handleChatReply = async () => {
    if (!chatInput.trim()) return
    const text = chatInput
    setChatInput("") 
    await submitAnswer(text)
  }

  // Render chat mode
  if (isChatActive) {
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
           <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">Refining your match...</Text>
              <Button size="xs" colorScheme="red" variant="solid" onClick={reset}>Cancel</Button>
           </HStack>
           
           <VStack 
             maxH="300px" 
             overflowY="auto" 
             bg="gray.50" 
             p={3} 
             borderRadius="md" 
             align="stretch" 
             gap={3}
           >
             {messages.map((msg, idx) => (
                <Box 
                    key={idx} 
                    alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    bg={msg.role === 'user' ? 'blue.500' : 'white'}
                    color={msg.role === 'user' ? 'white' : 'gray.800'}
                    px={3} 
                    py={2} 
                    borderRadius="lg"
                    maxW="85%"
                    boxShadow="sm"
                >
                    <Text fontSize="sm">{msg.text}</Text>
                </Box>
             ))}
             <div ref={chatEndRef} />
             {error && <Text color="red.500" fontSize="xs">Error: {error}</Text>}
           </VStack>

           <HStack>
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your answer..."
                onKeyDown={(e) => e.key === 'Enter' && handleChatReply()}
                disabled={isProcessing}
              />
              <Button 
                onClick={handleChatReply} 
                colorScheme="blue" 
                loading={isProcessing}
              >
                Send
              </Button>
           </HStack>
        </VStack>
      </Box>
    )
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
    
    {error && <Text color="red.500" fontSize="sm">{error}</Text>}

    <Button
      onClick={handleSubmit}
      colorScheme="blue"
      disabled={!description.trim() || isProcessing}
      loading={isProcessing}
    >
      {isProcessing ? 'Matching...' : 'See options'}
    </Button>
  </VStack>
</Box>

  )
}
