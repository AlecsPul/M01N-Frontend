import { Box, Center, Text } from "@chakra-ui/react"

export default function NavBar() {
  return (
    <Box position="fixed" top="0" left="0" right="0" h="8%" bg="darkblue" zIndex="1000" display="flex" alignItems="center" justifyContent="space-evenly" px={8}>
      <Box bg="blue.700" px={4} py={2} borderRadius="md">
        <Text color="white" fontSize="xl">MarketPlace</Text>
      </Box>
      <Box bg="blue.700" px={4} py={2} borderRadius="md">
        <Text color="white" fontSize="xl">Products</Text>
      </Box>
      <Box bg="blue.700" px={4} py={2} borderRadius="md">
        <Text color="white" fontSize="xl">Categories</Text>
      </Box>
      <Box bg="blue.700" px={4} py={2} borderRadius="md">
        <Text color="white" fontSize="xl">About</Text>
      </Box>
    </Box> 
  )
}
