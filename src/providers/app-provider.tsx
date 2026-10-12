import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { ensureGuestPlaces, writeGuestPlaces } from '../lib/demo-store';
import { createPlace, type Place, type PlaceInput, validatePlaceInput } from '../lib/places';

export type SessionMode = 'guest' | 'account';

type AppContextValue = {
  sessionMode: SessionMode | null;
  places: Place[];
  isLoading: boolean;
  error: string | null;
  setGuestSession: () => Promise<void>;
  clearGuestSession: () => void;
  signOut: () => void;
  addPlace: (input: PlaceInput) => Promise<void>;
  removePlace: (id: string) => Promise<void>;
  toggleVisited: (id: string) => Promise<void>;
  clearError: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionMode: SessionMode | null = isSignedIn ? 'account' : isGuest ? 'guest' : null;
  const isLoading = !isLoaded || isGuestLoading;

  const setGuestSession = useCallback(async () => {
    setIsGuestLoading(true);
    try {
      const saved = await ensureGuestPlaces();
      setIsGuest(true);
      setPlaces(saved);
      setError(null);
    } catch (guestError) {
      const message = guestError instanceof Error ? guestError.message : 'Unable to start guest session.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsGuestLoading(false);
    }
  }, []);

  const clearGuestSession = useCallback(() => {
    setIsGuest(false);
    setPlaces([]);
    setError(null);
  }, []);

  const signOut = useCallback(() => {
    if (isSignedIn) {
      void clerkSignOut()
        .then(clearGuestSession)
        .catch((signOutError: unknown) => {
          setError(signOutError instanceof Error ? signOutError.message : 'Unable to sign out.');
        });
      return;
    }

    clearGuestSession();
  }, [isSignedIn, clerkSignOut, clearGuestSession]);

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
      clearGuestSession,
      signOut,
      addPlace,
      removePlace,
      toggleVisited,
      clearError,
    }),
    [sessionMode, places, isLoading, error, setGuestSession, clearGuestSession, signOut, addPlace, removePlace, toggleVisited, clearError]
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
