import { Box, Center, Text, VStack, Separator } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"

export default function NavBar() {
  const location = useLocation()
  
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
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Box 
          bg="transparent" 
          px="12px" 
          py="8px" 
          borderRadius="8px" 
          cursor="pointer" 
          _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
          borderBottom={location.pathname === '/' ? '2px solid black' : 'none'}
        >
          <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">MarketPlace</Text>
        </Box>
      </Link>
      <Link to="/backlog" style={{ textDecoration: 'none' }}>
        <Box 
          bg="transparent" 
          px="12px" 
          py="8px" 
          borderRadius="8px" 
          cursor="pointer" 
          _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
          borderBottom={location.pathname === '/backlog' ? '2px solid black' : 'none'}
        >
          <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">Backlog</Text>
        </Box>
      </Link>
      <Link to="/community" style={{ textDecoration: 'none' }}>
        <Box 
          bg="transparent" 
          px="12px" 
          py="8px" 
          borderRadius="8px" 
          cursor="pointer" 
          _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
          borderBottom={location.pathname === '/community' ? '2px solid black' : 'none'}
        >
          <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">Community</Text>
        </Box>
      </Link>
      <Link to="/about" style={{ textDecoration: 'none' }}>
        <Box 
          bg="transparent" 
          px="12px" 
          py="8px" 
          borderRadius="8px" 
          cursor="pointer" 
          _hover={{ transform: "scale(1.1)", transition: "transform 0.2s" }}
          borderBottom={location.pathname === '/about' ? '2px solid black' : 'none'}
        >
          <Text color="black" fontSize="16px" fontWeight="500" letterSpacing="0.2px">About</Text>
        </Box>
      </Link>
    </Box>
    </VStack>
  )
}
