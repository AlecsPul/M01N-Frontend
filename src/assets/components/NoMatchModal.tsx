import { useState } from 'react'
import { 
  DialogRoot, 
  DialogContent, 
  DialogHeader, 
  DialogBody, 
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
  Button, 
  Text, 
  Textarea,
  Box
} from '@chakra-ui/react'
import { FaTimes } from 'react-icons/fa'
import { submitNoMatch } from '../../services/noMatchService'

interface NoMatchModalProps {
  isOpen: boolean
  onClose: () => void
  userPrompt: string
}

export default function NoMatchModal({ isOpen, onClose, userPrompt }: NoMatchModalProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      
      // Submit the no-match data to the backend
      await submitNoMatch({
        prompt_text: userPrompt,
        comment_text: comment.trim() || '',
      })
      
      console.log('No-match data submitted successfully')
    } catch (error) {
      console.error('Failed to submit no-match data:', error)
      // Optionally show an error message to the user
    } finally {
      setIsSubmitting(false)
      setComment('')
      onClose()
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>No Matching Applications Found</DialogTitle>
          <DialogCloseTrigger asChild>
            <Button variant="ghost" size="sm" color="white" _hover={{ color: "gray.800", bg: "gray.100" }}>
              <FaTimes />
            </Button>
          </DialogCloseTrigger>
        </DialogHeader>
        
        <DialogBody>
          <Box mb={4}>
            <Text fontWeight="semibold" mb={2}>Your search:</Text>
            <Box 
              p={3} 
              bg="gray.50" 
              borderRadius="md" 
              borderLeft="4px solid" 
              borderColor="blue.400"
            >
              <Text fontSize="sm" color="gray.700">"{userPrompt}"</Text>
            </Box>
          </Box>

          <Text mb={4} color="gray.700">
            We're sorry we couldn't find applications that match your needs. 
            Your request will be taken into account to improve our marketplace 
            application offerings.
          </Text>

          <Box>
            <Text fontWeight="semibold" mb={2}>
              Would you like to add any additional comments? (optional)
            </Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              placeholder="Write here any additional details you consider relevant..."
              rows={4}
              resize="vertical"
            />
          </Box>
        </DialogBody>

        <DialogFooter>
          <Button 
            colorScheme="blue" 
            onClick={handleConfirm}
            size="md"
            loading={isSubmitting}
            loadingText="Submitting..."
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
