import { Text, Button, Card, Image, Box, HStack } from "@chakra-ui/react"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

interface Product {
  title: string
  description: string
  price: string
  image?: string
  link?: string
  percentage?: string
  rating?: number  // This should come from the backend database
}

interface ProductCardProps {
  product: Product
  onClick?: () => void
  seeOptionsButtonProps?: any
}

export default function ProductCard({ product, onClick, seeOptionsButtonProps }: ProductCardProps) {
  const BRAND_COLOR = "#2F6FED"

  // Debug: log the full product object
  console.log('Product data:', { title: product.title, rating: product.rating, fullProduct: product })

  const handleClick = () => {
    // Call the parent's onClick first (which tracks the click)
    if (onClick) {
      onClick()
    } else {
      // Fallback: just open the link if no onClick is provided
      if (product.link) {
        window.open(product.link, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const renderStars = (rating: number = 0) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="#FFD700" size={16} />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} color="#FFD700" size={16} />)
      } else {
        stars.push(<FaRegStar key={i} color="#FFD700" size={16} />)
      }
    }
    return stars
  }

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="xs"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s ease"
      overflow="visible"
      m={4}
      position="relative"
      cursor="pointer"
      onClick={handleClick}
      display="flex"
      flexDirection="column"
      h="100%"
      border="2px solid"
      borderColor="gray.200"
    >
      {/* Logo area */}
      <Box bg="gray.50" borderRadius="md" p={4} mb={4} display="flex" alignItems="center" justifyContent="center" h="120px">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            borderRadius="md"
            maxW="100%"
            maxH="80px"
            objectFit="contain"
          />
        ) : (
          <Box w="100%" h="80px" bg="gray.100" borderRadius="md" />
        )}
      </Box>
      {/* Percentage badge */}
      {product.percentage && (
        <Box position="absolute" top="12px" right="12px" zIndex={2}>
          <Text fontSize="md" color="green.600" fontWeight="bold" bg="white" px={2} py={1} borderRadius="md" boxShadow="sm">
            {product.percentage}
          </Text>
        </Box>
      )}
      {/* Title */}
      <Text color="black" minH="3em" lineHeight="1.5em" fontSize="xl" fontWeight="bold" flexShrink={0} px={4}>
        {product.title}
      </Text>
      {/* Description */}
      <Box h="6em" flexShrink={0} overflow="hidden" px={4} mt={2}>
        <Text
          fontSize="md"
          color="gray.600"
          lineHeight="1.5em"
          fontWeight="medium"
          display="-webkit-box"
          css={{
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {product.description}
        </Text>
      </Box>
      {/* Footer */}
      <HStack gap="2" justifyContent="space-between" alignItems="center" flexShrink={0} px={4} py={3} mt="auto">
        <Text fontSize="md" fontWeight="bold" letterSpacing="tight" color="black">
          {product.price}
        </Text>
        {product.rating !== undefined && (
          <HStack gap={1}>
            {renderStars(product.rating)}
            <Text fontSize="sm" color={BRAND_COLOR} ml={2} fontWeight="semibold">
              ({product.rating.toFixed(1)})
            </Text>
          </HStack>
        )}
      </HStack>
      <Box px={4} pb={4}>
        <Button
          w="100%"
          mt={2}
          fontWeight="bold"
          borderRadius="md"
          _hover={{ bg: "black", color: "white" }}
          onClick={(e) => {
            e.stopPropagation()
            if (onClick) onClick()
          }}
          {...seeOptionsButtonProps}
          bg="#204a99" // less shiny version of #2F6FED
          color="white"
          _active={{ bg: "#204a99" }}
        >
          Visit Page
        </Button>
      </Box>
    </Box>
  )
}