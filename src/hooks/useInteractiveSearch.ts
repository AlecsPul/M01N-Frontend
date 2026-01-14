import { useState, useCallback, useRef } from 'react';
import { interactiveMatchService, InteractiveSession, MatchResult } from '../services/interactiveMatchService';

export type ChatMessage = {
  role: 'user' | 'assistant';
  text: string;
};

export type InteractiveState = 
  | 'idle' 
  | 'requesting_start' 
  | 'needs_more' 
  | 'requesting_continue' 
  | 'requesting_finalize' 
  | 'ready' 
  | 'error';

interface UseInteractiveSearchResult {
  status: InteractiveState;
  messages: ChatMessage[];
  error: string | null;
  reset: () => void;
  startSearch: (query: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  finalizeSearch: () => Promise<void>;
}

interface UseInteractiveSearchProps {
  onResults?: (results: MatchResult[], finalPrompt: string) => void;
}

export function useInteractiveSearch({ onResults }: UseInteractiveSearchProps = {}): UseInteractiveSearchResult {
  const [status, setStatus] = useState<InteractiveState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<InteractiveSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // AbortController ref to cancel pending requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('idle');
    setMessages([]);
    setSession(null);
    setError(null);
  }, []);

  const startSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    reset();
    setStatus('requesting_start');
    
    // Setup new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await interactiveMatchService.start(query, abortController.signal);
      
      if (res.status === 'needs_more') {
        setSession(res.session);
        setMessages([
          { role: 'user', text: query },
          { role: 'assistant', text: res.question || "Can you provide more details?" }
        ]);
        setStatus('needs_more');
      } else if (res.status === 'ready') {
        setSession(res.session);
        // If results provided directly, use them
        if (res.results && onResults) {
            setStatus('ready');
            onResults(res.results, res.final_prompt || query);
        } else {
            // Otherwise finalize to get results
            await finalizeInternal(res.session, abortController.signal);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to start search');
        setStatus('error');
      }
    }
  }, [onResults, reset]);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!answer.trim() || !session) return;

    setStatus('requesting_continue');
    setMessages(prev => [...prev, { role: 'user', text: answer }]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const res = await interactiveMatchService.continue(session, answer, abortController.signal);
      
      if (res.status === 'needs_more') {
        setSession(res.session);
        setMessages(prev => [...prev, { role: 'assistant', text: res.question || "Anything else?" }]);
        setStatus('needs_more');
      } else if (res.status === 'ready') {
        setSession(res.session);
        if (res.results && onResults) {
            setStatus('ready');
            onResults(res.results, res.final_prompt || "");
        } else {
            await finalizeInternal(res.session, abortController.signal);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to submit answer');
        setStatus('error'); // Or keep in needs_more but show error?
      }
    }
  }, [session, onResults]);

  const finalizeInternal = async (currentSession: InteractiveSession, signal: AbortSignal) => {
      setStatus('requesting_finalize');
      try {
          const finalRes = await interactiveMatchService.finalize(currentSession, signal);
          setStatus('ready');
          if (onResults && finalRes.results) {
              onResults(finalRes.results, finalRes.final_prompt || "");
          }
      } catch (err: any) {
          if (err.name !== 'AbortError') {
              setError(err.message || 'Failed to get final results');
              setStatus('error');
          }
      }
  };

  const finalizeSearch = useCallback(async () => {
    if (!session) return;
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    await finalizeInternal(session, abortController.signal);
  }, [session]);

  return {
    status,
    messages,
    error,
    reset,
    startSearch,
    submitAnswer,
    finalizeSearch
  };
}
