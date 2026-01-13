import { Text, Button, Card, Image, Box, HStack } from "@chakra-ui/react"
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

interface Product {
  id: string
  title: string
  description: string
  price: string
  image?: string
  percentage?:string
  rating?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleClick = () => {
    // TODO: Add navigation/redirect logic here
    console.log(`Clicked product: ${product.id}`)
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
      bg="white"
      position="relative"
      cursor="pointer"
      onClick={handleClick}
      border="2px solid"
      borderColor="black"
      borderRadius="md"
      _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
    >
      {product.percentage && (
        <Box position="absolute" top="2" right="2" zIndex="10" bg="green.500" px="3" py="2" borderRadius="md">
          <Text fontSize="lg" color="white" fontWeight="bold">{product.percentage}</Text>
        </Box>)}
      <Card.Body gap="3">
        {product.image && (
          <Image src={product.image} alt={product.title} borderRadius="md" w="60%"
            h="auto"
            maxH="200px"
            objectFit="contain"
            mb={4}/>
        )}
        <Card.Title color={"black"}>{product.title} </Card.Title>
  <Card.Description 
    textStyle="md"
    color="black"
    minH="7.5em"
    sx={{
      display: "-webkit-box",
      WebkitLineClamp: 5,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "clip"
    }}>
    {product.description}
  </Card.Description>
        
      </Card.Body>
      <Card.Footer gap="2" justifyContent="space-between" alignItems="center">
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
    </Card.Root>
  )
}