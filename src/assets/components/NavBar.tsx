import { Box, Text, VStack, Flex, Image } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"

export default function NavBar() {
  const location = useLocation()

  return (
    <VStack
      w="100%"
      minH="8vh"
      gap={0}
      bg="gray.50"
    >
      <Box 
        w="100%"
        minH="8vh"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
        position="relative"
      >
        <Flex
          maxW="1200px"
          mx="auto"
          px={6}
          minH="8vh"
          alignItems="center"
          justifyContent="space-evenly"
        >
          {/* Logo on the left */}
          <Link to="/" style={{ textDecoration: 'none', position: 'absolute', left: '32px' }}>
            <Image 
              src="/logo.png" 
              alt="Logo" 
              height="110px"
              cursor="pointer"
              _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}
            />
          </Link>
          {/* Navigation links */}
          <Box display="flex" gap={4} mx="auto">
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
        </Flex>
      </Box>
    </VStack>
  )
}
