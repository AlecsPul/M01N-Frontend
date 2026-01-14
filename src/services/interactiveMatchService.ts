// Types for the interactive search flow

export interface InteractiveSession {
    // Treat session as opaque object as requested, but we know it has structure
    [key: string]: any; 
}

export interface MatchResult {
    app_id: string;
    name: string;
    similarity_percent: number;
}

export interface InteractiveResponse {
    status: 'needs_more' | 'ready';
    question?: string;
    final_prompt?: string;
    results?: MatchResult[] | null;
    session: InteractiveSession;
    missing?: {
        labels_needed: number;
        tags_needed: number;
        integrations_needed: number;
    };
}

const API_BASE_URL = 'http://localhost:8000/api/v1/match/interactive';

export const interactiveMatchService = {
  async start(promptText: string, signal?: AbortSignal): Promise<InteractiveResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt_text: promptText }),
        signal
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error;
      console.error('Error starting interactive match:', error);
      throw error;
    }
  },

  async continue(session: InteractiveSession, answerText: string, signal?: AbortSignal): Promise<InteractiveResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/continue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session,
          answer_text: answerText
        }),
        signal
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error;
      console.error('Error continuing match:', error);
      throw error;
    }
  },

  async finalize(session: InteractiveSession, signal?: AbortSignal): Promise<InteractiveResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session,
          top_k: 30,
          top_n: 10
        }),
        signal
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if ((error as Error).name === 'AbortError') throw error;
      console.error('Error finalizing match:', error);
      throw error;
    }
  }
};

