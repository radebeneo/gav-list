import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEMO_PLACES, Place, parsePlaceRecord } from './places';

export const GUEST_PLACE_STORAGE_KEY = '@gav-list/guest-places/v1';

export type GuestPlaceEnvelope = {
  version: 1;
  places: Place[];
};

export async function readGuestPlaces(): Promise<Place[]> {
  const raw = await AsyncStorage.getItem(GUEST_PLACE_STORAGE_KEY);

  if (!raw) {
    const seeded = DEMO_PLACES.map((place) => ({ ...place }));
    await AsyncStorage.setItem(GUEST_PLACE_STORAGE_KEY, JSON.stringify({ version: 1, places: seeded }));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<GuestPlaceEnvelope>;
    if (!Array.isArray(parsed.places) || parsed.version !== 1) {
      throw new Error('Guest storage format is unreadable.');
    }

    return parsed.places.map((entry) => parsePlaceRecord(entry));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unable to read local guest data.');
  }
}

export async function writeGuestPlaces(places: Place[]): Promise<void> {
  const envelope: GuestPlaceEnvelope = { version: 1, places };
  await AsyncStorage.setItem(GUEST_PLACE_STORAGE_KEY, JSON.stringify(envelope));
}

export async function ensureGuestPlaces(): Promise<Place[]> {
  try {
    return await readGuestPlaces();
  } catch {
    const fallback = DEMO_PLACES.map((place) => ({ ...place }));
    await writeGuestPlaces(fallback);
    return fallback;
  }
}
