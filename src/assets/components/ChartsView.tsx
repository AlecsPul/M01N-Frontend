import { useState, useEffect } from 'react'
import { Box, Text, VStack, HStack } from '@chakra-ui/react'

const API_BASE_URL = 'http://localhost:8000'

interface Stat {
  app_id: string
  app_name: string
  click_count: number
  tags: string[]
}

interface ChartViewProps {
  apiBaseUrl: string
}

export default function ChartsView({ apiBaseUrl = API_BASE_URL }: ChartViewProps) {
  const [allStats, setAllStats] = useState<Stat[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statsLoading, setStatsLoading] = useState<boolean>(false)

  // Fetch all stats and categories once on mount
  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        setStatsLoading(true)
        const response = await fetch(`${apiBaseUrl}/api/v1/application/clicks/stats`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Stat[] = await response.json()
        console.log(`Fetched ${data.length} total stats`, data)
        setAllStats(data)
        
        // Extract categories from all stats
        const categories = new Set<string>()
        data.forEach(stat => {
          stat.tags.forEach(tag => categories.add(tag))
        })
        setAllCategories(Array.from(categories).sort())
      } catch (err) {
        console.error('Error fetching statistics:', err)
        setAllStats([])
      } finally {
        setStatsLoading(false)
      }
    }

    fetchAllStats()
  }, [apiBaseUrl])

  // Filter stats based on selected category and search query
  const filteredStats = allStats.filter(stat => {
    const matchesCategory = !selectedCategory || stat.tags.includes(selectedCategory)
    const matchesSearch = stat.app_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => b.click_count - a.click_count)

  return (
    <Box display="flex" gap="4" px="2rem" pb="2rem">
      <Box 
        flex="1"
        padding="4"
        bg="white"
        borderRadius="12px"
        display="flex"
        flexDirection="column"
      >
        <Box mb="4">
          <Text fontSize="2xl" fontWeight="bold" color="black">
            Click Statistics
          </Text>
          <Text fontSize="sm" color="gray.600" mt="1">
            Application click analytics
          </Text>
        </Box>

        {/* Search Bar */}
        <Box mb="6">
          <Text fontSize="sm" fontWeight="600" color="black" mb="2">
            Search Applications
          </Text>
          <input 
            type="text"
            placeholder="Search by app name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f7fafc',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          />
        </Box>

        {/* Category Filter - Toggle Squares */}
        <Box mb="6">
          <Text fontSize="sm" fontWeight="600" color="black" mb="3">
            Filter by Category
          </Text>
          <HStack gap="2" flexWrap="wrap">
            <Box
              onClick={() => setSelectedCategory('')}
              p="3"
              borderRadius="6px"
              border="2px solid"
              borderColor={selectedCategory === '' ? 'black' : 'gray.300'}
              bg={selectedCategory === '' ? 'black' : 'white'}
              color={selectedCategory === '' ? 'white' : 'black'}
              cursor="pointer"
              fontWeight="500"
              fontSize="sm"
              transition="all 0.2s"
              _hover={{ transform: 'scale(1.05)' }}
            >
              All
            </Box>
            {allCategories.map((category) => (
              <Box
                key={category}
                onClick={() => setSelectedCategory(category)}
                p="3"
                borderRadius="6px"
                border="2px solid"
                borderColor={selectedCategory === category ? 'black' : 'gray.300'}
                bg={selectedCategory === category ? 'black' : 'white'}
                color={selectedCategory === category ? 'white' : 'black'}
                cursor="pointer"
                fontWeight="500"
                fontSize="sm"
                transition="all 0.2s"
                _hover={{ transform: 'scale(1.05)' }}
              >
                {category}
              </Box>
            ))}
          </HStack>
        </Box>

        {/* Loading State */}
        {statsLoading && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">Loading statistics...</Text>
          </Box>
        )}

        {/* Stats List */}
        {!statsLoading && filteredStats.length > 0 && (
          <VStack gap="3" align="stretch">
            {filteredStats.map((stat, index) => (
              <Box
                key={index}
                p="4"
                bg="gray.50"
                borderRadius="8px"
                border="1px solid"
                borderColor="gray.200"
              >
                <HStack justify="space-between" mb="2">
                  <Text fontWeight="600" color="black" fontSize="md">
                    {stat.app_name}
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="black">
                    {stat.click_count} clicks
                  </Text>
                </HStack>
                <HStack gap="2" flexWrap="wrap">
                  {stat.tags && stat.tags.length > 0 ? (
                    stat.tags.map((tag, tagIndex) => (
                      <Box
                        key={tagIndex}
                        bg="blue.100"
                        px="2"
                        py="1"
                        borderRadius="4px"
                      >
                        <Text fontSize="xs" color="blue.700" fontWeight="500">
                          {tag}
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="xs" color="gray.500">
                      No tags
                    </Text>
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {!statsLoading && filteredStats.length === 0 && allStats.length > 0 && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">No apps match your search</Text>
          </Box>
        )}

        {!statsLoading && allStats.length === 0 && selectedCategory && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">No data available for this category</Text>
          </Box>
        )}

        {!statsLoading && allStats.length === 0 && !selectedCategory && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">No click data available</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
