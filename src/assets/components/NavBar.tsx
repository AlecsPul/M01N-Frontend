import { Box, Text, Flex, Image } from "@chakra-ui/react"
import { Link, useLocation } from "react-router-dom"

export default function NavBar() {
  const location = useLocation()

  return (
    <Box
      as="nav"
      position="sticky"
      top="0"
      zIndex="10"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      w="100%"
      boxShadow="0 4px 16px -8px rgba(0,0,0,0.10)"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={0}
        minH="8vh"
        alignItems="center"
        justifyContent="flex-start"
        position="relative"
      >
        {/* Logo - further left */}
        <Box minW="240px" display="flex" alignItems="center" justifyContent="flex-start" mr={10} >
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Image
              src="/logo.png"
              alt="Logo"
              height="160px"
              width="auto"
              cursor="pointer"
              _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}
            />
          </Link>
        </Box>
        {/* Navigation links - left aligned and more spread */}
        <Flex flex="1" justify="flex-start" alignItems="center" gap={40}>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <Box px={3} py={2} borderRadius="md" cursor="pointer" _hover={{ bg: "gray.100" }}>
              <Text
                color={location.pathname === '/about' ? "gray.900" : "gray.600"}
                fontWeight={location.pathname === '/about' ? "semibold" : "medium"}
                position="relative"
                fontSize="20px"
                letterSpacing="0.2px"
                _hover={{ color: "gray.900" }}
                {...(location.pathname === '/about'
                  ? {
                      _after: {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-10px",
                        height: "2px",
                        bg: "blue.600",
                        borderRadius: "full",
                      }
                    }
                  : {})}
              >
                About
              </Text>
            </Box>
          </Link>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box px={3} py={2} borderRadius="md" cursor="pointer" _hover={{ bg: "gray.100" }}>
              <Text
                color={location.pathname === '/' ? "gray.900" : "gray.600"}
                fontWeight={location.pathname === '/' ? "semibold" : "medium"}
                position="relative"
                fontSize="20px"
                letterSpacing="0.2px"
                _hover={{ color: "gray.900" }}
                {...(location.pathname === '/'
                  ? {
                      _after: {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-10px",
                        height: "2px",
                        bg: "blue.600",
                        borderRadius: "full",
                      }
                    }
                  : {})}
              >
                Marketplace
              </Text>
            </Box>
          </Link>
          <Link to="/community" style={{ textDecoration: 'none' }}>
            <Box px={3} py={2} borderRadius="md" cursor="pointer" _hover={{ bg: "gray.100" }}>
              <Text
                color={location.pathname === '/community' ? "gray.900" : "gray.600"}
                fontWeight={location.pathname === '/community' ? "semibold" : "medium"}
                position="relative"
                fontSize="20px"
                letterSpacing="0.2px"
                _hover={{ color: "gray.900" }}
                {...(location.pathname === '/community'
                  ? {
                      _after: {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-10px",
                        height: "2px",
                        bg: "blue.600",
                        borderRadius: "full",
                      }
                    }
                  : {})}
              >
                Community
              </Text>
            </Box>
          </Link>
          <Link to="/backlog" style={{ textDecoration: 'none' }}>
            <Box px={3} py={2} borderRadius="md" cursor="pointer" _hover={{ bg: "gray.100" }}>
              <Text
                color={location.pathname === '/backlog' ? "gray.900" : "gray.600"}
                fontWeight={location.pathname === '/backlog' ? "semibold" : "medium"}
                position="relative"
                fontSize="20px"
                letterSpacing="0.2px"
                _hover={{ color: "gray.900" }}
                {...(location.pathname === '/backlog'
                  ? {
                      _after: {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: "-10px",
                        height: "2px",
                        bg: "blue.600",
                        borderRadius: "full",
                      }
                    }
                  : {})}
              >
                Backlog
              </Text>
            </Box>
          </Link>
        </Flex>
      </Flex>
    </Box>
  )
}
