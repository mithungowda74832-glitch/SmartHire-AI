import { useState, useEffect, useCallback } from 'react';
import { checkBackendHealth } from '../services/resumeApi';

export type ConnectivityMode = 'online' | 'offline';

export interface ConnectivityState {
  isBrowserOnline: boolean;
  isBackendReachable: boolean;
  geminiConfigured: boolean;
  mode: ConnectivityMode;
  lastChecked: Date | null;
  statusLabel: string;
  statusDetail: string;
  checkNow: () => Promise<void>;
}

export function useConnectivity(): ConnectivityState {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [isBackendReachable, setIsBackendReachable] = useState<boolean>(true);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const verifyBackend = useCallback(async () => {
    // If browser itself reports offline, immediately set offline without failing fetch calls
    if (!navigator.onLine) {
      setIsBrowserOnline(false);
      setIsBackendReachable(false);
      setLastChecked(new Date());
      return;
    }

    try {
      const health = await checkBackendHealth();
      setIsBrowserOnline(true);
      setIsBackendReachable(health.reachable);
      setGeminiConfigured(health.geminiConfigured);
      setLastChecked(new Date());
    } catch {
      setIsBackendReachable(false);
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    // Initial check
    verifyBackend();

    const handleOnline = () => {
      setIsBrowserOnline(true);
      verifyBackend();
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      setIsBackendReachable(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check every 25 seconds when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        verifyBackend();
      }
    }, 25000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [verifyBackend]);

  // Mode determination: true 'online' requires both browser online AND backend reachable
  const mode: ConnectivityMode = isBrowserOnline && isBackendReachable ? 'online' : 'offline';

  let statusLabel = 'Online';
  let statusDetail = 'Connected to server backend';

  if (!isBrowserOnline) {
    statusLabel = 'Offline';
    statusDetail = 'Network disconnected. Local in-browser engine active.';
  } else if (!isBackendReachable) {
    statusLabel = 'Offline';
    statusDetail = 'Server unreachable. Local in-browser engine active.';
  } else if (geminiConfigured) {
    statusLabel = 'Online (AI Ready)';
    statusDetail = 'Connected to live Gemini 3.8 Flash model.';
  } else {
    statusLabel = 'Online';
    statusDetail = 'Connected to server backend.';
  }

  return {
    isBrowserOnline,
    isBackendReachable,
    geminiConfigured,
    mode,
    lastChecked,
    statusLabel,
    statusDetail,
    checkNow: verifyBackend,
  };
}
