import React, { useState } from 'react';
import { Box, Text, Heading, VStack, HStack, Grid, Button } from '@chakra-ui/react';
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaSearch, FaComments, FaExchangeAlt, FaLightbulb, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  const [algorithmExpanded, setAlgorithmExpanded] = useState(false);

  return (
    <Box w="100%" bg="gray.50">
      {/* Hero Section */}
      <Box bg="white" py={20} px={8} textAlign="center" borderBottom="1px solid" borderColor="gray.200">
        <Heading size="3xl" mb={4} color="black">About BexInsights</Heading>
        <Text fontSize="xl" color="gray.600" maxW="800px" mx="auto">
          The intelligent marketplace that helps businesses find the right software applications through AI-powered matching
        </Text>
      </Box>

      {/* What is BexInsights */}
      <Box py={16} px={8} bg="white">
        <Box maxW="1200px" mx="auto">
          <Heading size="2xl" mb={6} color="black">What is BexInsights?</Heading>
          <Text fontSize="lg" color="gray.700" mb={4}>
            BexInsights is an intelligent application marketplace designed specifically for businesses looking to discover and compare software solutions. 
            Instead of manually searching through hundreds of applications, you simply describe what you need in natural language, and our AI-powered 
            matching system finds the best options for you.
          </Text>
          <Text fontSize="lg" color="gray.700">
            Whether you're looking for a CRM system, accounting software, project management tools, or specialized integrations, BexInsights understands 
            your requirements and delivers personalized recommendations in seconds.
          </Text>
        </Box>
      </Box>

      {/* Key Features */}
      <Box py={16} px={8} bg="gray.50">
        <Box maxW="1200px" mx="auto">
          <Heading size="2xl" mb={8} color="black">Key Features</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack mb={3}>
                <Box color="blue.500" fontSize="2xl"><FaSearch /></Box>
                <Heading size="md">Semantic Search</Heading>
              </HStack>
              <Text color="gray.600">
                Describe what you need in natural language. Our AI understands intent and context, not just keywords, to find applications that truly match your requirements.
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack mb={3}>
                <Box color="purple.500" fontSize="2xl"><FaComments /></Box>
                <Heading size="md">Interactive Clarification</Heading>
              </HStack>
              <Text color="gray.600">
                If your initial request needs more detail, our chat-like interface asks smart follow-up questions to refine results and ensure accurate recommendations.
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack mb={3}>
                <Box color="green.500" fontSize="2xl"><FaExchangeAlt /></Box>
                <Heading size="md">Side-by-Side Comparison</Heading>
              </HStack>
              <Text color="gray.600">
                Select up to two applications to compare features, integrations, and AI-generated highlights side by side, helping you make informed decisions quickly.
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack mb={3}>
                <Box color="orange.500" fontSize="2xl"><FaLightbulb /></Box>
                <Heading size="md">AI-Generated Insights</Heading>
              </HStack>
              <Text color="gray.600">
                Each application includes AI-extracted highlights from feature descriptions, giving you instant visibility into key advantages and capabilities.
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack mb={3}>
                <Box color="red.500" fontSize="2xl"><FaChartLine /></Box>
                <Heading size="md">Match Confidence Scoring</Heading>
              </HStack>
              <Text color="gray.600">
                Every result includes a similarity percentage that represents how well the application fits your specific needs, combining semantic matching with structured requirements.
              </Text>
            </Box>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack mb={3}>
                <Box color="teal.500" fontSize="2xl"><FaCheckCircle /></Box>
                <Heading size="md">Backlog for Unmatched Needs</Heading>
              </HStack>
              <Text color="gray.600">
                Can't find what you're looking for? Your request is captured in our backlog, helping us identify market gaps and prioritize new applications to onboard.
              </Text>
            </Box>
          </Grid>
        </Box>
      </Box>

      {/* How the Algorithm Works */}
      <Box py={16} px={8} bg="white">
        <Box maxW="1200px" mx="auto">
          <Heading size="2xl" mb={6} color="black">How the Matching Algorithm Works</Heading>
          
          <Text fontSize="lg" color="gray.700" mb={8}>
            BexInsights uses a sophisticated multi-layered approach that combines natural language understanding with structured data analysis. 
            Our hybrid algorithm doesn't just match keywords—it understands intent, enforces must-have requirements, and balances multiple priorities 
            to deliver accurate, personalized recommendations.
          </Text>

          {/* Visual Pipeline */}
          <Box bg="gray.50" p={8} borderRadius="lg" mb={8}>
            <Heading size="lg" mb={6} textAlign="center">Matching Pipeline</Heading>
            <VStack gap={4}>
              <HStack w="100%" justify="space-between" align="center">
                <Box flex="1" bg="blue.500" color="white" p={4} borderRadius="md" textAlign="center">
                  <Text fontWeight="bold" mb={1}>1. Understand Request</Text>
                  <Text fontSize="sm">Semantic embeddings + structured extraction</Text>
                </Box>
                <Box px={2} fontSize="2xl" color="gray.400">→</Box>
                <Box flex="1" bg="purple.500" color="white" p={4} borderRadius="md" textAlign="center">
                  <Text fontWeight="bold" mb={1}>2. Interactive Clarification</Text>
                  <Text fontSize="sm">Smart follow-up questions if needed</Text>
                </Box>
              </HStack>

              <Box px={2} fontSize="2xl" color="gray.400" alignSelf="center">↓</Box>

              <HStack w="100%" justify="space-between" align="center">
                <Box flex="1" bg="green.500" color="white" p={4} borderRadius="md" textAlign="center">
                  <Text fontWeight="bold" mb={1}>3. Find Candidates</Text>
                  <Text fontSize="sm">Vector similarity search (top 30)</Text>
                </Box>
                <Box px={2} fontSize="2xl" color="gray.400">→</Box>
                <Box flex="1" bg="orange.500" color="white" p={4} borderRadius="md" textAlign="center">
                  <Text fontWeight="bold" mb={1}>4. Filter & Score</Text>
                  <Text fontSize="sm">Hard constraints + hybrid scoring</Text>
                </Box>
              </HStack>

              <Box px={2} fontSize="2xl" color="gray.400" alignSelf="center">↓</Box>

              <Box bg="teal.500" color="white" p={4} borderRadius="md" textAlign="center" w="50%">
                <Text fontWeight="bold" mb={1}>5. Match Percentage</Text>
                <Text fontSize="sm">Confidence score (0-100%)</Text>
              </Box>
            </VStack>
          </Box>

          {/* Collapsible Detailed Explanation */}
          <Box>
            <Button
              onClick={() => setAlgorithmExpanded(!algorithmExpanded)}
              rightIcon={algorithmExpanded ? <FaChevronUp /> : <FaChevronDown />}
              bg="gray.300"
              color="gray.600"
              _hover={{ bg: "gray.400" }}
              size="lg"
              w="100%"
              mb={4}
            >
              {algorithmExpanded ? 'Hide' : 'Read More'} About the Algorithm
            </Button>

            {algorithmExpanded && (
              <VStack align="stretch" gap={6} bg="gray.50" p={8} borderRadius="lg">
                <Box>
                  <Heading size="md" mb={3}>Step 1: Understanding Your Request</Heading>
                  <Text color="gray.700" mb={3}>
                    When you submit a requirement, the system translates it into structured, analyzable components:
                  </Text>
                  <VStack align="stretch" gap={2}>
                    <HStack align="start">
                      <Box color="green.500" mt={1}><FaCheckCircle /></Box>
                      <Text><strong>Semantic Understanding:</strong> Your description is converted into a 1536-dimensional embedding vector that captures meaning and context</Text>
                    </HStack>
                    <HStack align="start">
                      <Box color="green.500" mt={1}><FaCheckCircle /></Box>
                      <Text><strong>Structured Extraction:</strong> Identifies functional labels, business context tags, and integration requirements</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={3}>Step 2: Interactive Clarification</Heading>
                  <Text color="gray.700" mb={3}>
                    If your request is too vague, the system asks targeted follow-up questions to gather:
                  </Text>
                  <VStack align="stretch" gap={2}>
                    <HStack align="start">
                      <Box color="purple.500" mt={1}><FaCheckCircle /></Box>
                      <Text>At least 2 functional categories (what the software should do)</Text>
                    </HStack>
                    <HStack align="start">
                      <Box color="purple.500" mt={1}><FaCheckCircle /></Box>
                      <Text>1 business context tag (your industry or company profile)</Text>
                    </HStack>
                    <HStack align="start">
                      <Box color="purple.500" mt={1}><FaCheckCircle /></Box>
                      <Text>1 integration requirement (what it must connect with)</Text>
                    </HStack>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={3}>Step 3: Finding Candidates</Heading>
                  <Text color="gray.700">
                    Using vector similarity search (cosine similarity), the system identifies the 30 most semantically similar applications from the marketplace, 
                    regardless of specific keywords.
                  </Text>
                </Box>

                <Box>
                  <Heading size="md" mb={3}>Step 4: Filtering and Hybrid Scoring</Heading>
                  <Text color="gray.700" mb={3}>
                    Each candidate undergoes rigorous evaluation:
                  </Text>
                  <Text fontWeight="bold" color="gray.800" mb={2}>Hard Constraint Filtering:</Text>
                  <VStack align="stretch" gap={2} mb={4}>
                    <HStack align="start">
                      <Box color="orange.500" mt={1}><FaCheckCircle /></Box>
                      <Text>Must-have functional labels</Text>
                    </HStack>
                    <HStack align="start">
                      <Box color="orange.500" mt={1}><FaCheckCircle /></Box>
                      <Text>Required integrations</Text>
                    </HStack>
                    <HStack align="start">
                      <Box color="orange.500" mt={1}><FaCheckCircle /></Box>
                      <Text>Budget constraints</Text>
                    </HStack>
                  </VStack>
                  <Text fontWeight="bold" color="gray.800" mb={2}>Hybrid Score Calculation:</Text>
                  <VStack align="stretch" gap={1}>
                    <Text>• 60% - Semantic similarity</Text>
                    <Text>• 10% - Must-have tag alignment</Text>
                    <Text>• 10% - Nice-to-have labels</Text>
                    <Text>• 5% - Nice-to-have tags</Text>
                    <Text>• 15% - Nice-to-have integrations</Text>
                  </VStack>
                </Box>

                <Box>
                  <Heading size="md" mb={3}>Step 5: Match Percentage Translation</Heading>
                  <Text color="gray.700" mb={3}>
                    The raw score is transformed using a sigmoid function into an intuitive confidence percentage:
                  </Text>
                  <VStack align="stretch" gap={1}>
                    <Text><strong>80-100%:</strong> Excellent match, strongly recommended</Text>
                    <Text><strong>60-79%:</strong> Good match, likely meets most needs</Text>
                    <Text><strong>40-59%:</strong> Moderate match, review carefully</Text>
                    <Text><strong>20-39%:</strong> Weak match, may lack key features</Text>
                    <Text><strong>0-19%:</strong> Poor match or constraint violations</Text>
                  </VStack>
                </Box>

                <Box bg="blue.50" p={6} borderRadius="md">
                  <Heading size="md" mb={3} color="blue.700">Why Embeddings Alone Are Not Enough</Heading>
                  <Text color="gray.700" mb={3}>
                    Pure semantic search has critical limitations:
                  </Text>
                  <VStack align="stretch" gap={1}>
                    <Text>• Cannot enforce must-have requirements (like specific integrations)</Text>
                    <Text>• Treats all features equally, cannot prioritize deal-breakers</Text>
                    <Text>• Misses business context (industry-specific needs)</Text>
                    <Text>• No way to distinguish between similar but functionally different applications</Text>
                  </VStack>
                  <Text color="gray.700" mt={3}>
                    <strong>BexInsights combines embeddings with structured constraints</strong> to deliver both semantic understanding and practical precision.
                  </Text>
                </Box>
              </VStack>
            )}
          </Box>
        </Box>
      </Box>

      {/* Comparison Table: Backlog vs Community */}
      <Box py={16} px={8} bg="white">
        <Box maxW="900px" mx="auto">
          <Heading size="2xl" mb={8} color="black" textAlign="center">
            Backlog vs Community: Feature Comparison
          </Heading>
          <Box
            bg="gray.50"
            borderRadius="lg"
            boxShadow="md"
            p={{ base: 4, md: 8 }}
            overflowX="auto"
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontWeight: 700, fontSize: "1.1rem", color: "#1a3570", padding: "12px 8px" }}></th>
                  <th style={{ textAlign: "center", fontWeight: 700, fontSize: "1.1rem", color: "#1a3570", padding: "12px 8px" }}>Backlog</th>
                  <th style={{ textAlign: "center", fontWeight: 700, fontSize: "1.1rem", color: "#1a3570", padding: "12px 8px" }}>Community</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>Create <b>created_by_bexio</b> card</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#1a3570", fontSize: "1.5rem" }}>✔️</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#b23a3a", fontSize: "1.5rem" }}>❌</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>Upvote cards</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#b23a3a", fontSize: "1.5rem" }}>❌</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#1a3570", fontSize: "1.5rem" }}>✔️</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>Upvote comments</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#b23a3a", fontSize: "1.5rem" }}>❌</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#1a3570", fontSize: "1.5rem" }}>✔️</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>Comment on <b>created_by_bexio</b> cards</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#b23a3a", fontSize: "1.5rem" }}>❌</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#1a3570", fontSize: "1.5rem" }}>✔️</span>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>Delete cards</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#1a3570", fontSize: "1.5rem" }}>✔️</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#b23a3a", fontSize: "1.5rem" }}>❌</span>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "12px 8px", fontWeight: 500 }}>Change status of cards</td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#1a3570", fontSize: "1.5rem" }}>✔️</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span style={{ color: "#b23a3a", fontSize: "1.5rem" }}>❌</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      {/* Team Placeholder Section */}
      <Box py={16} px={8} bg="gray.50">
        <Box maxW="1200px" mx="auto">
          <Heading size="2xl" mb={6} color="black">Who We Are</Heading>
          <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
            <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={4}>BlankSpace</Text>
            <Text fontSize="md" color="gray.700" mb={6}>We are a team of Computer Engineering students from Pompeu Fabra University with a strong enthusiasm for developing software applied across different domains and industries. As a team, we have built services such as VisualizeML, where we developed a web platform to estimate the probability of product purchases using a LightGBM model, complemented by explainability models to highlight the factors behind a sale or a non-sale; and PiggyBack Ride, where we developed a simulation infrastructure to optimize transportation logistics in the pig farming sector.</Text>
            <Box>
              <Text fontWeight="bold" mb={2}>Team Members:</Text>
              <Text color="gray.600">Pau Puig Guillén</Text>
              <Text color="gray.600">Alejandro Poole Becerra</Text>
              <Text color="gray.600">Joan Vicente Martín</Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;
