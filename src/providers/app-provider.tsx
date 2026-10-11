import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ensureGuestPlaces, writeGuestPlaces } from '../lib/demo-store';
import { createPlace, type Place, type PlaceInput, validatePlaceInput } from '../lib/places';

export type SessionMode = 'guest' | 'account';

type AppContextValue = {
  sessionMode: SessionMode | null;
  places: Place[];
  isLoading: boolean;
  error: string | null;
  setGuestSession: () => Promise<void>;
  setAccountSession: (uid: string) => void;
  signOut: () => void;
  addPlace: (input: PlaceInput) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
  toggleVisited: (id: string) => Promise<void>;
  clearError: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sessionMode, setSessionMode] = useState<SessionMode | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setGuestSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const saved = await ensureGuestPlaces();
      setSessionMode('guest');
      setPlaces(saved);
      setError(null);
    } catch (guestError) {
      setError(guestError instanceof Error ? guestError.message : 'Unable to start guest session.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAccountSession = useCallback((uid: string) => {
    setSessionMode('account');
    setPlaces([]);
    setError(null);
    void uid;
  }, []);

  const signOut = useCallback(() => {
    setSessionMode(null);
    setPlaces([]);
    setError(null);
  }, []);

  const addPlace = useCallback(async (input: PlaceInput) => {
    const result = validatePlaceInput(input);
    if (!result.ok) {
      throw new Error(result.errors.join(' '));
    }

    const next = createPlace(result.value);
    const updated = [next, ...places];
    setPlaces(updated);

    if (sessionMode === 'guest') {
      await writeGuestPlaces(updated);
    }
  }, [places, sessionMode]);

  const removePlace = useCallback(async (id: string) => {
    const updated = places.filter((place) => place.id !== id);
    setPlaces(updated);

    if (sessionMode === 'guest') {
      await writeGuestPlaces(updated);
    }
  }, [places, sessionMode]);

  const toggleVisited = useCallback(async (id: string) => {
    const updated = places.map((place) =>
      place.id === id ? { ...place, visited: !place.visited } : place
    );
    setPlaces(updated);

    if (sessionMode === 'guest') {
      await writeGuestPlaces(updated);
    }
  }, [places, sessionMode]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AppContextValue>(
    () => ({
      sessionMode,
      places,
      isLoading,
      error,
      setGuestSession,
      setAccountSession,
      signOut,
      addPlace,
      removePlace,
      toggleVisited,
      clearError,
    }),
    [sessionMode, places, isLoading, error, setGuestSession, setAccountSession, signOut, addPlace, removePlace, toggleVisited, clearError]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
