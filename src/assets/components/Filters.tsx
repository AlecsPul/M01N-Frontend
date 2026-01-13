import { Box, VStack, Text, Separator, HStack } from "@chakra-ui/react"
import { Slider } from "@chakra-ui/react/slider"
import { Checkbox } from "@chakra-ui/react/checkbox"
import { FaStar } from "react-icons/fa"
import { useState } from "react"

interface FiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  minRating: number
  availability: string[]
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [minRating, setMinRating] = useState<number>(0)
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])

  const categories = ["Sofas", "Armchairs", "Tables", "Bookshelves", "Beds", "Lamps"]
  const availabilityOptions = ["In Stock", "On Sale", "Free Shipping"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category)
    setSelectedCategories(updated)
    notifyFilterChange({ categories: updated })
  }

  const handleAvailabilityChange = (option: string, checked: boolean) => {
    const updated = checked
      ? [...selectedAvailability, option]
      : selectedAvailability.filter(a => a !== option)
    setSelectedAvailability(updated)
    notifyFilterChange({ availability: updated })
  }

  const handlePriceChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]]
    setPriceRange(range)
    notifyFilterChange({ priceRange: range })
  }

  const handleRatingChange = (value: number[]) => {
    setMinRating(value[0])
    notifyFilterChange({ minRating: value[0] })
  }

  const notifyFilterChange = (partialFilters: Partial<FilterState>) => {
    if (onFilterChange) {
      onFilterChange({
        categories: selectedCategories,
        priceRange,
        minRating,
        availability: selectedAvailability,
        ...partialFilters
      })
    }
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setMinRating(0)
    setSelectedAvailability([])
    if (onFilterChange) {
      onFilterChange({
        categories: [],
        priceRange: [0, 1000],
        minRating: 0,
        availability: []
      })
    }
  }

  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <FaStar key={i} size={14} color="#FFD700" style={{ display: 'inline' }} />
    ))
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
          <VStack align="stretch" gap={2}>
            {categories.map((category) => (
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
        </Box>

        <Separator borderWidth="1px" borderColor="black" />

        {/* Price Range Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={2}>
            Price Range
          </Text>
          <Text fontSize="sm" color="gray.600" mb={3}>
            {priceRange[0]} CHF - {priceRange[1]} CHF
          </Text>
          <Slider.Root
            min={0}
            max={1000}
            value={priceRange}
            onValueChange={(e) => handlePriceChange(e.value)}
            colorScheme="blue"
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
            <Slider.Thumb index={1} />
          </Slider.Root>
        </Box>

        <Separator borderWidth="1px" borderColor="black" />

        {/* Rating Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={2}>
            Minimum Rating
          </Text>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            {renderStars(minRating)}
            {minRating > 0 && (
              <Text fontSize="sm" color="gray.600">& up</Text>
            )}
          </Box>
          <Slider.Root
            min={0}
            max={5}
            step={1}
            value={[minRating]}
            onValueChange={(e) => handleRatingChange(e.value)}
            colorScheme="blue"
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Root>
        </Box>

        <Separator borderWidth="1px" borderColor="black" />

        {/* Availability Filter */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" color="black" mb={3}>
            Availability
          </Text>
          <VStack align="stretch" gap={2}>
            {availabilityOptions.map((option) => (
              <Checkbox.Root
                key={option}
                checked={selectedAvailability.includes(option)}
                onCheckedChange={(e) => handleAvailabilityChange(option, !!e.checked)}
                colorScheme="blue"
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>
                  <Text color="gray.700">{option}</Text>
                </Checkbox.Label>
              </Checkbox.Root>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
