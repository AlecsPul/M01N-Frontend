import { useState, useCallback } from 'react';

export interface SelectedApp {
  id: string;
  name: string;
}

interface UseCompareSelectionProps {
  maxSelection?: number;
}

export const useCompareSelection = ({ maxSelection = 2 }: UseCompareSelectionProps = {}) => {
  const [selectedApps, setSelectedApps] = useState<SelectedApp[]>([]);

  const isFull = selectedApps.length >= maxSelection;

  const toggleSelection = useCallback((id: string, name: string) => {
    setSelectedApps(prev => {
      const exists = prev.find(app => app.id === id);
      if (exists) {
        return prev.filter(app => app.id !== id);
      }
      
      if (prev.length >= maxSelection) {
        return prev;
      }

      return [...prev, { id, name }];
    });
  }, [maxSelection]);

  const clearSelection = useCallback(() => {
    setSelectedApps([]);
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedApps.some(app => app.id === id);
  }, [selectedApps]);

  return {
    selectedApps,
    isFull,
    toggleSelection,
    clearSelection,
    isSelected
  };
};
