/**
 * Service for handling backlog operations
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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