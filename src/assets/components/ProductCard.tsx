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
  rating?: number  // This should come from the backend database
}

interface ProductCardProps {
  product: Product
  onClick?: () => void
  onSelect?: (id: string, name: string) => void
  showSelect?: boolean
  isSelected?: boolean
  isSelectionDisabled?: boolean
}

export default function ProductCard({ 
  product, 
  onClick, 
  onSelect, 
  showSelect = false, 
  isSelected = false, 
  isSelectionDisabled = false 
}: ProductCardProps) {
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
    <Card.Root 
      overflow="visible" 
      m={4} 
      bg={isSelected ? "blue.50" : "white"}
      position="relative"
      cursor="pointer"
      onClick={handleClick}
      border="2px solid"
      borderColor={isSelected ? "blue.400" : "black"}
      borderRadius="md"
      _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
      display="flex"
      flexDirection="column"
      h="100%"
      transition="all 0.2s"
    >
      <Card.Body gap="2" display="flex" flexDirection="column" flex="1" pb="2">
        <Box display="flex" w="100%" h="180px" mb={3} flexShrink={0}>
          {product.image ? (
            <Box 
              w="90%" 
              h="100%" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <Image 
                src={product.image} 
                alt={product.title} 
                borderRadius="md" 
                maxW="100%"
                maxH="100%"
                objectFit="contain"
              />
            </Box>
          ) : (
            <Box w="90%" h="100%" bg="gray.100" borderRadius="md" />
          )}
          {product.percentage && (
            <Box w="10%" display="flex" alignItems="flex-start" justifyContent="center" pt={2}>
              <Text fontSize="md" color="green.600" fontWeight="bold">
                {product.percentage}
              </Text>
            </Box>
          )}
        </Box>
        <Card.Title color={"black"} minH="3em" lineHeight="1.5em" fontSize="xl" fontWeight="semibold" flexShrink={0}>
          {product.title}
        </Card.Title>
        <Box
          h="6em"
          flexShrink={0}
          overflow="hidden"
        >
          <Card.Description 
            textStyle="md"
            color="black"
            lineHeight="1.5em"
            display="-webkit-box"
            css={{
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
            {product.description}
          </Card.Description>
        </Box>
        
      </Card.Body>
      <Card.Footer gap="2" justifyContent="space-between" alignItems="center" flexShrink={0}>
        <Text fontSize="md" fontWeight="medium" letterSpacing="tight" color={"black"}>
          {product.price} 
        </Text>
        {product.rating !== undefined && (
          <HStack gap={1}>
            {renderStars(product.rating)}
            <Text fontSize="sm" color="gray.600" ml={2}>({product.rating.toFixed(1)})</Text>
          </HStack>
        )}
      </Card.Footer>
      {showSelect && (
        <Box p={4} pt={0} width="100%">
           <Button 
             width="100%" 
             onClick={handleSelect}
             disabled={!isSelected && isSelectionDisabled}
             variant={isSelected ? "solid" : "outline"}
             bg={isSelected ? "blue.700" : "white"}
             color={isSelected ? "white" : "gray.800"}
             borderColor={isSelected ? "blue.700" : "gray.600"}
             opacity={(!isSelected && isSelectionDisabled) ? 0.4 : 1}
             _hover={isSelected ? { bg: "blue.800" } : { bg: "gray.50" }}
             _disabled={{ opacity: 0.4, cursor: "not-allowed", bg: "gray.200", color: "gray.500" }}
           >
             {isSelected ? "Selected" : "Select"}
           </Button>
        </Box>
      )}
    </Card.Root>
  )
}