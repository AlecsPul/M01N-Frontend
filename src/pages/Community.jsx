import React, { useState, useEffect } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import BacklogCard from '../assets/components/BacklogCard.tsx';
import BacklogDetailModal from '../assets/components/BacklogDetailModal.tsx';

const API_BASE_URL = 'http://localhost:8000';

const Community = () => {
  const [communityItems, setCommunityItems] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch community items from backend
  useEffect(() => {
    const fetchCommunityItems = async () => {
      try {
        setCommunityLoading(true);
        setCommunityError(null);
        const response = await fetch(`${API_BASE_URL}/api/v1/cards`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Map backend data to frontend format and sort by upvotes (descending)
        const mappedCommunity = data
          .map((card) => ({
            id: String(card.id),
            title: card.title,
            upvotes: card.upvote || 0,
            requestCount: card.number_of_requests || 0,
            status: card.status === 1 ? 'completed' : 'not-completed',
            created_by_bexio: card.created_by_bexio || false,
          }))
          .sort((a, b) => b.upvotes - a.upvotes); // Sort by upvotes descending

        setCommunityItems(mappedCommunity);
      } catch (err) {
        console.error('Error fetching community items:', err);
        setCommunityError(err.message);
      } finally {
        setCommunityLoading(false);
      }
    };

    fetchCommunityItems();
  }, []);

  return (
    <>
      <BacklogDetailModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCardId(null);
        }}
        cardId={selectedCardId}
        showSearchButton={false}
        canComment={true}
        canUpvote={true}
        canUpvoteComments={true}  // Enable comment upvoting in Community
        onUpvote={(cardId) => {
          // Update local state when upvote happens in modal
          setCommunityItems((prev) => {
            const updated = prev.map((i) =>
              i.id === cardId ? { 
                ...i, 
                upvotes: (i.upvotes || 0) + 1
              } : i
            );
            // Re-sort by upvotes after updating
            return updated.sort((a, b) => b.upvotes - a.upvotes);
          });
        }}
      />
      
      <Box display="flex" flexDirection="column" gap="4" px="2rem" pt="5rem" pb="2rem">
        <Text  fontSize="3xl"
        fontWeight="bold"
        
        mb={11} // Big gap after hero
        color="gray.800"
        ml="15%"
        px={0}
        pt="0rem"
        textAlign="left"
        maxW="1200px">
          Community Page
        </Text>
        <Box display="flex" flexDirection="row" w="100%" pt="0rem">
          {/* Left space with page background color */}
          <Box
            width="8%"
            bg="gray.100"
            borderRadius="md"
            // No content, just for background
          />
          {/* Main content */}
          <Box
          mr="5rem"
            flex="1"
            padding="1rem"
            bg="white"
            borderRadius="md"
            display="flex"
            flexDirection="column"
            border="1px solid"
            borderColor="gray.200"
            boxShadow="md"
            alignSelf="flex-start"
          >
            <Box mb="4" ml="1rem">
              <Text fontSize="2xl" fontWeight="bold" color="black">
                Blackboard
              </Text>          
            </Box>

            {/* Loading and Error States */}
            {communityLoading && (
              <Box textAlign="center" padding="8">
                <Text fontSize="lg" color="gray.600">
                  Loading community items...
                </Text>
              </Box>
            )}

            {communityError && (
              <Box textAlign="center" padding="8">
                <Text fontSize="lg" color="red.500">
                  Error loading community: {communityError}
                </Text>
                <Text fontSize="sm" color="gray.600" mt="2">
                  Please try refreshing the page
                </Text>
              </Box>
            )}

            {!communityLoading && !communityError && communityItems.length === 0 && (
              <Box textAlign="center" padding="8">
                <Text fontSize="lg" color="gray.600">
                  No community items yet
                </Text>
              </Box>
            )}

            {!communityLoading && !communityError && communityItems.length > 0 && (
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                }}
                gap={6}
                w="100%"
                alignContent="start"
                mb={12}
              >
                {communityItems.map((item) => (
                  <BacklogCard
                    key={item.id}
                    item={item}
                    onClick={(id) => {
                      setSelectedCardId(id);
                      setIsModalOpen(true);
                    }}
                    onUpvote={async (id) => {
                      try {
                        // Call the backend API to increment upvotes
                        const response = await fetch(
                          `${API_BASE_URL}/api/v1/cards/upvote`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              card_id: id,
                            }),
                          }
                        );

                        if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const updatedCard = await response.json();
                        console.log('Card upvoted:', updatedCard);

                        // Update local state with the new upvote count and re-sort
                        setCommunityItems((prev) => {
                          const updated = prev.map((i) =>
                            i.id === id ? { 
                              ...i, 
                              upvotes: updatedCard.upvote || i.upvotes + 1
                            } : i
                          );
                          // Re-sort by upvotes after updating
                          return updated.sort((a, b) => b.upvotes - a.upvotes);
                        });
                      } catch (error) {
                        console.error('Failed to upvote card:', error);
                      }
                    }}
                  />
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Community;
