/**
 * Service for handling no-match prompt submissions
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/no-match';

/**
 * Submit a no-match prompt and user comment to the backend
 * @param {Object} data - The no-match data
 * @param {string} data.prompt - The user's original search prompt
 * @param {string} data.comment - Optional user comment
 * @returns {Promise<Object>} Response from the server
 */
export const submitNoMatch = async ({ prompt, comment }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/no-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        comment,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit no-match data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting no-match data:', error);
    throw error;
  }
};
