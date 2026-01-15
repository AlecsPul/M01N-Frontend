import { Box, VStack, Text } from "@chakra-ui/react"
import { Checkbox } from "@chakra-ui/react/checkbox"
import { useState } from "react"

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void
  availableCategories?: string[]
  availableIndustries?: string[]
}

export interface FilterState {
  categories: string[]
  priceType: string | null  // 'free', 'paid', or null for all
}

export default function Filters({ onFilterChange, availableCategories = [], availableIndustries = [] }: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceType, setPriceType] = useState<string | null>(null)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category)
    setSelectedCategories(updated)
    if (onFilterChange) {
      onFilterChange({ categories: updated, priceType })
    }
  }

  const handlePriceChange = (type: string, checked: boolean) => {
    const newPriceType = checked ? type : null
    setPriceType(newPriceType)
    if (onFilterChange) {
      onFilterChange({ categories: selectedCategories, priceType: newPriceType })
    }
  }

  return (
    <Box
      w="100%"
      h="100%"
      bg="white"
      p={6}
      paddingRight={4}
      overflowY="auto"
    >
      <VStack align="stretch" gap={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="black" mb={2}>
            Filters
          </Text>
        </Box>

        {/* Price Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={3}>
            Price
          </Text>
          <VStack align="stretch" gap={2}>
            <Checkbox.Root
              checked={priceType === 'free'}
              onCheckedChange={(e) => handlePriceChange('free', !!e.checked)}
              colorScheme="blue"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text color="gray.700">Free</Text>
              </Checkbox.Label>
            </Checkbox.Root>
            <Checkbox.Root
              checked={priceType === 'paid'}
              onCheckedChange={(e) => handlePriceChange('paid', !!e.checked)}
              colorScheme="blue"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>
                <Text color="gray.700">Paid</Text>
              </Checkbox.Label>
            </Checkbox.Root>
          </VStack>
        </Box>

        {/* Categories Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={3}>
            Categories
          </Text>
          {availableCategories.length > 0 ? (
            <VStack align="stretch" gap={2}>
              {availableCategories.map((category) => (
                <Checkbox.Root
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(e) => handleCategoryChange(category, !!e.checked)}
                  colorScheme="blue"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <Text color="gray.700">{category}</Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">No categories available</Text>
          )}
        </Box>

        {/* Industries Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={3}>
            Industries
          </Text>
          {availableIndustries.length > 0 ? (
            <VStack align="stretch" gap={2}>
              {availableIndustries.map((industry) => (
                <Checkbox.Root
                  key={industry}
                  checked={selectedCategories.includes(industry)}
                  onCheckedChange={(e) => handleCategoryChange(industry, !!e.checked)}
                  colorScheme="blue"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>
                    <Text color="gray.700">{industry}</Text>
                  </Checkbox.Label>
                </Checkbox.Root>
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500">No industries available</Text>
          )}
        </Box>
      </VStack>
    </Box>
  )
}
