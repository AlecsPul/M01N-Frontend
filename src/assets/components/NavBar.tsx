import { Box, Text, VStack, Flex, Heading, Image  } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"

export default function NavBar() {
  const location = useLocation()

  return (
    <VStack
      w="100%"
      minH="8vh"
      gap={0}
      bg="gray.50" // Quiet contrast: page background
    >
      <Box 
        w="100%"
        minH="8vh"
        bg="white" // Main content container: white
        borderBottom="1px solid"
        borderColor="gray.200"
        boxShadow="sm" // subtle elevation
      >
        <Flex
          maxW="1200px"
          mx="auto"
          px={6}
          minH="8vh"
          alignItems="center"
          justifyContent="space-evenly"
        >
          {/* About */}
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Box
              bg="transparent"
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{
                transform: "scale(1.1)",
                transition: "transform 0.2s",
                bg: "gray.100",
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={location.pathname === '/about' ? "semibold" : "medium"}
                color={location.pathname === '/about' ? "gray.900" : "gray.600"}
                letterSpacing="0.2px"
                position="relative"
                _hover={location.pathname === '/about' ? {} : {}}
                _after={
                  location.pathname === '/about'
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-6px",
                        height: "2px",
                        bg: "brand.500",
                        borderRadius: "full",
                      }
                    : {}
                }
              >
                About
              </Text>
            </Box>
          </Link>
          {/* Marketplace */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box
              bg="transparent"
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{
                transform: "scale(1.1)",
                transition: "transform 0.2s",
                bg: "gray.100",
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={location.pathname === '/' ? "semibold" : "medium"}
                color={location.pathname === '/' ? "gray.900" : "gray.600"}
                letterSpacing="0.2px"
                position="relative"
                _hover={location.pathname === '/' ? {} : {}}
                _after={
                  location.pathname === '/'
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-6px",
                        height: "2px",
                        bg: "brand.500",
                        borderRadius: "full",
                      }
                    : {}
                }
              >
                MarketPlace
              </Text>
            </Box>
          </Link>
          {/* Community */}
          <Link to="/community" style={{ textDecoration: 'none' }}>
            <Box
              bg="transparent"
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{
                transform: "scale(1.1)",
                transition: "transform 0.2s",
                bg: "gray.100",
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={location.pathname === '/community' ? "semibold" : "medium"}
                color={location.pathname === '/community' ? "gray.900" : "gray.600"}
                letterSpacing="0.2px"
                position="relative"
                _hover={location.pathname === '/community' ? {} : {}}
                _after={
                  location.pathname === '/community'
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-6px",
                        height: "2px",
                        bg: "brand.500",
                        borderRadius: "full",
                      }
                    : {}
                }
              >
                Community
              </Text>
            </Box>
          </Link>
          {/* Backlog */}
          <Link to="/backlog" style={{ textDecoration: 'none' }}>
            <Box
              bg="transparent"
              px={3}
              py={2}
              borderRadius="md"
              cursor="pointer"
              _hover={{
                transform: "scale(1.1)",
                transition: "transform 0.2s",
                bg: "gray.100",
              }}
            >
              <Text
                fontSize="16px"
                fontWeight={location.pathname === '/backlog' ? "semibold" : "medium"}
                color={location.pathname === '/backlog' ? "gray.900" : "gray.600"}
                letterSpacing="0.2px"
                position="relative"
                _hover={location.pathname === '/backlog' ? {} : {}}
                _after={
                  location.pathname === '/backlog'
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-6px",
                        height: "2px",
                        bg: "brand.500",
                        borderRadius: "full",
                      }
                    : {}
                }
              >
                Backlog
              </Text>
            </Box>
          </Link>
        </Flex>
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
