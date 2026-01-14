// New file: BacklogFormModal.tsx
import { useState } from "react"
import { Box, Text, Input, Textarea, Button, VStack, HStack, IconButton } from "@chakra-ui/react"
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogBackdrop } from "@chakra-ui/react"
import { FaPlus, FaCheckCircle, FaTimes } from "react-icons/fa"
import { createBacklogCard } from "../../services/backlogService"

interface CreateCardRequest {
  title: string
  description: string
}

interface CreateCardResponse {
  card_id: string
  title: string
  description: string
}

interface BacklogFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (card: CreateCardResponse) => void
}

export default function BacklogFormModal({ isOpen, onClose, onSuccess }: BacklogFormModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isCloseHovered, setIsCloseHovered] = useState(false)

  // Validation constants
  const TITLE_MIN = 3
  const TITLE_MAX = 200
  const DESC_MIN = 10
  const DESC_MAX = 2000

  // Validation checks
  const isTitleValid = title.length >= TITLE_MIN && title.length <= TITLE_MAX
  const isDescValid = description.length >= DESC_MIN && description.length <= DESC_MAX
  const isFormValid = isTitleValid && isDescValid
  const canSubmit = isFormValid && !isSubmitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit) return

    setIsSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const cardData: CreateCardRequest = {
        title: title.trim(),
        description: description.trim(),
      }

      const response = await createBacklogCard(cardData) as unknown as CreateCardResponse
      
      // Show success message
      setSuccessMessage(`Card created successfully! ID: ${response.card_id}`)
      
      // Clear form
      setTitle("")
      setDescription("")
      
      // Notify parent component
      if (onSuccess) {
        onSuccess(response)
      }

      // Close modal after success
      setTimeout(() => {
        setSuccessMessage("")
        onClose()
      }, 1500)

    } catch (error) {
      // Handle errors
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage("An unexpected error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getTitleColor = () => {
    if (title.length === 0) return "gray.500"
    if (isTitleValid) return "green.500"
    return "red.500"
  }

  const getDescColor = () => {
    if (description.length === 0) return "gray.500"
    if (isDescValid) return "green.500"
    return "red.500"
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    setErrorMessage("")
    setSuccessMessage("")
    onClose()
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && handleClose()} size="xl">
      <DialogBackdrop />
      <DialogContent
        position="fixed"
        right="0"
        top="0"
        bottom="0"
        maxW="500px"
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
        <DialogHeader borderBottom="2px solid" borderColor="gray.200" pb="4" pt="4" position="relative" minH="70px">
          <HStack align="start" pr="40px">
            <Box as={FaPlus} color="blue.500" boxSize="20px" mt="1" flexShrink="0" />
            <DialogTitle fontSize="2xl" fontWeight="bold" color="black" lineHeight="1.3">
              Create New Card
            </DialogTitle>
          </HStack>
          <IconButton
            onClick={handleClose}
            onMouseEnter={() => setIsCloseHovered(true)}
            onMouseLeave={() => setIsCloseHovered(false)}
            position="absolute"
            top="4"
            right="4"
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
          <form onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              {/* Title Input */}
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Title <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Text fontSize="xs" color={getTitleColor()}>
                    {title.length}/{TITLE_MAX}
                  </Text>
                </HStack>
                <Input
                  placeholder="Enter card title (min 3 chars)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={TITLE_MAX}
                  bg="white"
                  borderColor={title.length > 0 && !isTitleValid ? "red.300" : "gray.300"}
                  _focus={{ 
                    borderColor: isTitleValid ? "green.400" : "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                  }}
                />
                {title.length > 0 && !isTitleValid && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {title.length < TITLE_MIN 
                      ? `Minimum ${TITLE_MIN} characters required` 
                      : `Maximum ${TITLE_MAX} characters allowed`}
                  </Text>
                )}
              </Box>

              {/* Description Textarea */}
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                    Description <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Text fontSize="xs" color={getDescColor()}>
                    {description.length}/{DESC_MAX}
                  </Text>
                </HStack>
                <Textarea
                  placeholder="Enter card description (min 10 chars)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={DESC_MAX}
                  rows={6}
                  bg="white"
                  borderColor={description.length > 0 && !isDescValid ? "red.300" : "gray.300"}
                  _focus={{ 
                    borderColor: isDescValid ? "green.400" : "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)"
                  }}
                />
                {description.length > 0 && !isDescValid && (
                  <Text fontSize="xs" color="red.500" mt={1}>
                    {description.length < DESC_MIN 
                      ? `Minimum ${DESC_MIN} characters required` 
                      : `Maximum ${DESC_MAX} characters allowed`}
                  </Text>
                )}
              </Box>

              {/* Error Message */}
              {errorMessage && (
                <Box 
                  bg="red.50" 
                  p={3} 
                  borderRadius="md" 
                  border="1px solid"
                  borderColor="red.200"
                >
                  <Text fontSize="sm" color="red.600" fontWeight="medium">
                    {errorMessage}
                  </Text>
                </Box>
              )}

              {/* Success Message */}
              {successMessage && (
                <Box 
                  bg="green.50" 
                  p={3} 
                  borderRadius="md" 
                  border="1px solid"
                  borderColor="green.200"
                >
                  <HStack>
                    <Box as={FaCheckCircle} color="green.500" />
                    <Text fontSize="sm" color="green.600" fontWeight="medium">
                      {successMessage}
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                disabled={!canSubmit}
                loading={isSubmitting}
                loadingText="Creating..."
              >
                Create Card
              </Button>
            </VStack>
          </form>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}