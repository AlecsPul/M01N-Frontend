/**
 * Service for handling no-match prompt submissions
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Submit a no-match prompt and user comment to the backend
 * @param {Object} data - The no-match data
 * @param {string} data.prompt_text - The user's original search prompt
 * @param {string} data.comment_text - Optional user comment
 * @returns {Promise<Object>} Response from the server
 */
export const submitNoMatch = async ({ prompt_text, comment_text }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/backlog/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt_text,
        comment_text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit no-match data: ${response.statusText}`);
    }

    // Backend returns 204 No Content, so no JSON to parse
    return { success: true };
  } catch (error) {
    console.error('Error submitting no-match data:', error);
    throw error;
  }
};
