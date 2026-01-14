import { useState, useEffect } from 'react'
import { Box, Text, VStack, HStack } from '@chakra-ui/react'

interface Stat {
  app_id: string
  app_name: string
  click_count: number
  tags: string[]
}

interface ChartViewProps {
  apiBaseUrl: string
}

export default function ChartsView({ apiBaseUrl }: ChartViewProps) {
  const [clickStats, setClickStats] = useState<Stat[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [statsLoading, setStatsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchClickStats = async () => {
      try {
        setStatsLoading(true)
        const query = selectedCategory ? `?category=${selectedCategory}` : ''
        const response = await fetch(`${apiBaseUrl}/api/v1/application/clicks/stats${query}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: Stat[] = await response.json()
        setClickStats(data)
        
        if (!selectedCategory) {
          const categories = new Set<string>()
          data.forEach(stat => {
            stat.tags.forEach(tag => categories.add(tag))
          })
          setAllCategories(Array.from(categories).sort())
        }
      } catch (err) {
        console.error('Error fetching click statistics:', err)
        setClickStats([])
      } finally {
        setStatsLoading(false)
      }
    }

    fetchClickStats()
  }, [selectedCategory, apiBaseUrl])

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

        {/* Category Filter */}
        <Box mb="6">
          <Text fontSize="sm" fontWeight="600" color="black" mb="2">
            Filter by Category
          </Text>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f7fafc',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="">All Categories</option>
            {allCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Box>

        {/* Loading State */}
        {statsLoading && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">Loading statistics...</Text>
          </Box>
        )}

        {/* Stats List */}
        {!statsLoading && clickStats.length > 0 && (
          <VStack gap="3" align="stretch">
            {clickStats.map((stat, index) => (
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

        {!statsLoading && clickStats.length === 0 && (
          <Box textAlign="center" padding="8">
            <Text fontSize="lg" color="gray.600">No click data available</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}
