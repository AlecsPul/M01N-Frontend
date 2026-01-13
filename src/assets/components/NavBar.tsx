import { Box, Center, Text, VStack, Separator } from "@chakra-ui/react"

interface NavBarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  return (
    <VStack
      position="fixed" 
      top="0" 
      left="0" 
      right="0" 
      h="8%" 
      gap={0}
      zIndex="1000"
    >
      <Box 
        w="100%"
        flex="1"
        bg="#ffffff" 
        display="flex" 
        alignItems="center" 
        justifyContent="space-evenly" 
        px={8}
      >
      <Box 
        bg="transparent" 
        px="12px" 
        py="8px" 
        borderRadius="8px" 
        cursor="pointer" 
        _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
        onClick={() => onNavigate('marketplace')}
      >
        <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">MarketPlace</Text>
      </Box>
      <Box 
        bg="transparent" 
        px="12px" 
        py="8px" 
        borderRadius="8px" 
        cursor="pointer" 
        _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
        onClick={() => onNavigate('products')}
      >
        <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">Products</Text>
      </Box>
      <Box 
        bg="transparent" 
        px="12px" 
        py="8px" 
        borderRadius="8px" 
        cursor="pointer" 
        _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
        onClick={() => onNavigate('categories')}
      >
        <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">Categories</Text>
      </Box>
      <Box 
        bg="transparent" 
        px="12px" 
        py="8px" 
        borderRadius="8px" 
        cursor="pointer" 
        _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
        onClick={() => onNavigate('about')}
      >
        <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">About</Text>
      </Box>
    </Box>
    </VStack>
  )
}
