import React, { useState, useEffect } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import CommunityCard from '../assets/components/CommunityCard.tsx';

const API_BASE_URL = 'http://localhost:8000';

const Community = () => {
  const [communityItems, setCommunityItems] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState(null);

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

        // Map backend data to frontend format
        const mappedCommunity = data.map((card) => ({
          id: String(card.id),
          title: card.title,
          upvotes: card.upvote || 0,
          requests: card.number_of_requests || 0,
          status: card.status === 1 ? 'completed' : 'not-completed',
        }));

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
    <Box display="flex" gap="4" px="2rem" pt="7rem" pb="2rem">
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
            Community Requests
          </Text>
          <Text fontSize="sm" color="gray.600" mt="1">
            Vote for the applications you want to see
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
            gap="4"
            w="100%"
            alignContent="start"
            mb="8"
          >
            {communityItems.map((item) => (
              <CommunityCard
                key={item.id}
                item={item}
                onClick={(id) => {
                  console.log('Community item clicked:', id);
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

                    // Update local state with the new upvote count only
                    setCommunityItems((prev) =>
                      prev.map((i) =>
                        i.id === id ? { 
                          ...i, 
                          upvotes: updatedCard.upvote || i.upvotes + 1
                        } : i
                      )
                    );
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
  );
};

export default Community;
