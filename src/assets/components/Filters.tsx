import { Box, VStack, Text } from "@chakra-ui/react"
import { Checkbox } from "@chakra-ui/react/checkbox"
import { useState } from "react"

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void
  availableTags?: string[]
}

export interface FilterState {
  categories: string[]
}

export default function Filters({ onFilterChange, availableTags = [] }: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category)
    setSelectedCategories(updated)
    if (onFilterChange) {
      onFilterChange({ categories: updated })
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

        {/* Categories Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={3}>
            Categories
          </Text>
          {availableTags.length > 0 ? (
            <VStack align="stretch" gap={2}>
              {availableTags.map((category) => (
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
      </VStack>
    </Box>
  )
}
