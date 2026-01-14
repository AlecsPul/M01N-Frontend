import { useState, useEffect } from 'react'
import { Box, Text, VStack, HStack } from '@chakra-ui/react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const API_BASE_URL = 'http://localhost:8000'

interface Stat {
  app_id: string
  app_name: string
  click_count: number
  tags: string[]
}

interface CategoryData {
  category: string
  click_count: number
  [key: string]: string | number
}

interface ChartViewProps {
  apiBaseUrl: string
}

export default function ChartsView({ apiBaseUrl = API_BASE_URL }: ChartViewProps) {
  const [allStats, setAllStats] = useState<Stat[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [statsLoading, setStatsLoading] = useState<boolean>(false)
  const [chartView, setChartView] = useState<'list' | 'bar' | 'pie'>('list')

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C']

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

    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/v1/application/clicks/top-categories?limit=5`)
        if (response.ok) {
          const data = await response.json()
          setCategoryData(data.categories || [])
        }
      } catch (err) {
        console.error('Error fetching category data:', err)
      }
    }

    fetchAllStats()
    fetchCategoryData()
  }, [apiBaseUrl])

  // Filter stats based on selected category and search query
  const filteredStats = allStats.filter(stat => {
    const matchesCategory = !selectedCategory || stat.tags.includes(selectedCategory)
    const matchesSearch = stat.app_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => b.click_count - a.click_count)

  return (
    <>
      {/* Toggle centered below navbar */}
      <Box 
        display="flex"
        justifyContent="center"
        gap="12"
        px="2rem"
        pt="2rem"
        pb="2rem"
        borderBottom="1px solid"
        borderColor="gray.200"
        w="100%"
        bg="white"
      >
        <Box
          cursor="pointer"
          pb="3"
          borderBottom={chartView === 'list' ? '3px solid black' : 'none'}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setChartView('list')}
        >
          <Text
            fontSize="lg"
            fontWeight="600"
            color={chartView === 'list' ? 'black' : 'gray.400'}
            transition="color 0.2s"
          >
            Cards
          </Text>
        </Box>
        <Box
          cursor="pointer"
          pb="3"
          borderBottom={chartView === 'bar' ? '3px solid black' : 'none'}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setChartView('bar')}
        >
          <Text
            fontSize="lg"
            fontWeight="600"
            color={chartView === 'bar' ? 'black' : 'gray.400'}
            transition="color 0.2s"
          >
            Bar Chart
          </Text>
        </Box>
        <Box
          cursor="pointer"
          pb="3"
          borderBottom={chartView === 'pie' ? '3px solid black' : 'none'}
          transition="all 0.2s"
          _hover={{ transform: 'scale(1.08)' }}
          onClick={() => setChartView('pie')}
        >
          <Text
            fontSize="lg"
            fontWeight="600"
            color={chartView === 'pie' ? 'black' : 'gray.400'}
            transition="color 0.2s"
          >
            Pie Chart
          </Text>
        </Box>
      </Box>

      <Box display="flex" gap="4" px="2rem" pb="2rem">
        <Box 
          flex="1"
          padding="4"
          bg="white"
          borderRadius="12px"
          display="flex"
          flexDirection="column"
        >
          <Box mb="4" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="black">
                Click Statistics
              </Text>
              <Text fontSize="sm" color="gray.600" mt="1">
                Application click analytics
              </Text>
            </Box>
          </Box>

          {/* Search Bar - Only show in list view */}
          {chartView === 'list' && (
            <>
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
            </>
          )}

          {/* Loading State */}
          {statsLoading && (
            <Box textAlign="center" padding="8">
              <Text fontSize="lg" color="gray.600">Loading statistics...</Text>
            </Box>
          )}

          {/* List View */}
          {chartView === 'list' && !statsLoading && filteredStats.length > 0 && (
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

          {/* Bar Chart View */}
          {chartView === 'bar' && !statsLoading && categoryData.length > 0 && (
            <Box display="flex" justifyContent="center" mt="4">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="click_count" fill="#8884d8" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Pie Chart View */}
          {chartView === 'pie' && !statsLoading && categoryData.length > 0 && (
            <Box display="flex" flexDirection="column" justifyContent="center" mt="4" width="100%">
              <Text fontSize="lg" fontWeight="600" color="black" mb="4" textAlign="center">
                Top 5 Categories by Clicks
              </Text>
              <ResponsiveContainer width="100%" height={800}>
                <PieChart>
                  <Pie 
                    data={categoryData} 
                    dataKey="click_count" 
                    nameKey="category" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={260}
                    label={({ payload }) => payload.category}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px 12px'
                    }}
                    formatter={(value) => {
                      const numValue = Number(value) || 0
                      const total = categoryData.reduce((sum, item) => sum + item.click_count, 0)
                      const percentage = ((numValue / total) * 100).toFixed(1)
                      return [`${numValue} clicks (${percentage}%)`]
                    }}
                    labelFormatter={() => ""}
                    labelStyle={{
                      color: '#000000',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Empty States */}
          {chartView === 'list' && !statsLoading && filteredStats.length === 0 && allStats.length > 0 && (
            <Box textAlign="center" padding="8">
              <Text fontSize="lg" color="gray.600">No apps match your search</Text>
            </Box>
          )}

          {chartView === 'list' && !statsLoading && allStats.length === 0 && (
            <Box textAlign="center" padding="8">
              <Text fontSize="lg" color="gray.600">No click data available</Text>
            </Box>
          )}

          {(chartView === 'bar' || chartView === 'pie') && !statsLoading && categoryData.length === 0 && (
            <Box textAlign="center" padding="8">
              <Text fontSize="lg" color="gray.600">No category data available</Text>
            </Box>
          )}
        </Box>
      </Box>
    </>
  )
}
