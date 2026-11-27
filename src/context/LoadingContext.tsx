'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ConcentricRingsLoader from '@/components/ui/loading-animation-1';

type LoadingContextType = {
  isLoading: boolean;
  loadingText?: string;
  setLoading: (value: boolean, text?: string) => void;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);

  // Automatically reset loading when navigating to a new route
  useEffect(() => {
    setIsLoading(false);
    setLoadingText(undefined);
  }, [pathname]);

  const setLoading = useCallback((value: boolean, text?: string) => {
    setIsLoading(value);
    if (text !== undefined) {
      setLoadingText(text);
    }
  }, []);

  const showLoading = useCallback((text?: string) => {
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText(undefined);
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, loadingText, setLoading, showLoading, hideLoading }}
    >
      {children}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
        >
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <ConcentricRingsLoader
              size={120}
              color="#A83B55"
              showText={false}
            />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
