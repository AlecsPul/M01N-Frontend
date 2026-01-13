import { Text, Button, Card, Image } from "@chakra-ui/react"

interface Product {
  id: string
  title: string
  description: string
  price: number
  image?: string
  buttonText?: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card.Root maxW="sm" overflow="hidden" m={4} color={"white"}>
      <Card.Body gap="2">
        <Card.Title color={"black"}>{product.title}</Card.Title>
        {product.image && (
          <Image src={product.image} alt={product.title} borderRadius="md" />
        )}
        <Card.Description textStyle="md" color="black">
          {product.description}
        </Card.Description>
        
      </Card.Body>
      <Card.Footer gap="2">
        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="auto" color={"black"}>
          ${product.price}
        </Text>
      </Card.Footer>
    </Card.Root>
  )
}