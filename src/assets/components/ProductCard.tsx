import { Text, Button, Card, Image, Box, HStack } from "@chakra-ui/react"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

interface Product {
  id?: string
  title: string
  description: string
  price: string
  image?: string
  link?: string
  percentage?: string
  rating?: number
}

interface ProductCardProps {
  product: Product
  onClick?: () => void
  seeOptionsButtonProps?: any
  onSelect?: (id: string, name: string) => void
  showSelect?: boolean
  isSelected?: boolean
  isSelectionDisabled?: boolean
}

export default function ProductCard({
  product,
  onClick,
  seeOptionsButtonProps,
  onSelect,
  showSelect = false,
  isSelected = false,
  isSelectionDisabled = false
}: ProductCardProps) {
  const BRAND_COLOR = "#2F6FED"

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onSelect && product.id) {
      onSelect(product.id, product.title)
    }
  }

  const renderStars = (rating: number = 0) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} color="#1a3570" size={16} />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} color="#1a3570" size={16} />)
      } else {
        stars.push(<FaRegStar key={i} color="#1a3570" size={16} />)
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
      <HStack gap={3} justifyContent="space-between" alignItems="center" flexShrink={0} px={4} py={3} mt="auto">
        <Text fontSize="md" fontWeight="bold" letterSpacing="tight" color="black">
          {product.price}
        </Text>
        {product.rating !== undefined && (
          <HStack gap={1}>
            {renderStars(product.rating)}
            <Text fontSize="sm" color="#1a3570" ml={2} fontWeight="semibold">
              ({product.rating.toFixed(1)})
            </Text>
          </HStack>
        )}
      </HStack>
      {/* Selection Button */}
      {showSelect && (
        <Box px={4} pb={2}>
          <Button
            w="100%"
            mt={2}
            fontWeight="bold"
            borderRadius="md"
            onClick={handleSelect}
            disabled={isSelectionDisabled && !isSelected}
            colorScheme={isSelected ? "blue" : "gray"}
            variant={isSelected ? "solid" : "outline"}
          >
            {isSelected ? "Selected" : "Select for Comparison"}
          </Button>
        </Box>
      )}
      {/* Visit Page Button */}
      <Box px={4} pb={4}>
        <Button
          w="100%"
          mt={2}
          fontWeight="bold"
          borderRadius="md"
          _hover={{ bg: "#162e5c", color: "white" }}
          onClick={(e) => {
            e.stopPropagation()
            if (onClick) onClick()
          }}
          {...seeOptionsButtonProps}
          bg="#1a3570"
          color="white"
          _active={{ bg: "#162e5c" }}
        >
          Visit Page
        </Button>
      </Box>
    </Box>
  )
}