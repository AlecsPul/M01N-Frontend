import { Box, Text, VStack, Image } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"

export default function NavBar() {
  const location = useLocation()

  return (
    <VStack
      w="100%"
      minH="8vh"
      gap={0}
    >
      <Box 
        w="100%"
        minH="8vh"
        bg="#ffffff" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        px={8}
        borderBottom="1px solid"
        borderColor="gray.200"
        position="relative"
      >
        <Link to="/" style={{ textDecoration: 'none', position: 'absolute', left: '32px' }}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            height="110px"
            cursor="pointer"
            _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}
          />
        </Link>

        <Box display="flex" gap={4}>
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
        </Box>
      </Box>
    </VStack>
  )
}
