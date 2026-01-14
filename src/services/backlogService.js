/**
 * Service for handling backlog operations
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Create a new backlog card
 * @param {Object} cardData - The card data
 * @param {string} cardData.title - The title of the card (min 3, max 200 chars)
 * @param {string} cardData.description - The description of the card (min 10, max 2000 chars)
 * @returns {Promise<Object>} Response from the server with card_id, title, and description
 * @throws {Error} With validation errors or server errors
 */
export const createBacklogCard = async ({ title, description }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/backlog/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Log the full error response for debugging
      console.error('Server error response:', data);
      
      // Handle validation errors (400) or server errors (500)
      if (response.status === 400) {
        throw new Error(data.detail || data.message || 'Validation error');
      } else if (response.status === 500) {
        // Include more details from the server error
        const errorMsg = data.detail || data.message || 'Server error. Please try again later.';
        throw new Error(errorMsg);
      } else {
        throw new Error(`Failed to create backlog card: ${response.statusText}`);
      }
    }

    return data;
  } catch (error) {
    console.error('Error creating backlog card:', error);
    throw error;
  }
};

/**
 * Drop/delete a backlog card
 * @param {string} id - The ID of the backlog item to drop
 * @returns {Promise<Object>} Response from the server
 */
export const dropBacklogCard = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/backlog/drop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to drop backlog card: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error dropping backlog card:', error);
    throw error;
  }
};