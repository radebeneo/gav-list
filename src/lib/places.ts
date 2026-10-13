export const PLACE_CATEGORIES = ['Nature', 'Food', 'Culture', 'Adventure', 'Other'] as const;
export const CATEGORIES = PLACE_CATEGORIES;

export type Category = (typeof PLACE_CATEGORIES)[number];

export type Place = {
  id: string;
  name: string;
  address: string;
  notes?: string;
  category: Category;
  visited: boolean;
  createdAt: number;
};

export type PlaceInput = {
  name: string;
  address: string;
  notes?: string;
  category: Category;
  visited?: boolean;
};

export const DEMO_PLACES: Place[] = [
  {
    id: 'demo-sentinel-peak',
    name: 'Sentinel Peak',
    address: 'Tucson, Arizona',
    notes: 'Sunset hike and lookout.',
    category: 'Adventure',
    visited: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'demo-cafe',
    name: 'Copper House Café',
    address: 'Downtown Tucson',
    notes: 'Coffee and pastries after the trail.',
    category: 'Food',
    visited: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

export function normalizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function validatePlaceInput(input: unknown): { ok: true; value: PlaceInput } | { ok: false; errors: string[] } {
  if (!input || typeof input !== 'object') {
    return { ok: false, errors: ['Place data is required.'] };
  }

  const value = input as Record<string, unknown>;
  const errors: string[] = [];

  const name = normalizeText(value.name);
  if (name.length < 1 || name.length > 100) {
    errors.push('Name must be 1-100 characters.');
  }

  const address = normalizeText(value.address);
  if (address.length < 1 || address.length > 250) {
    errors.push('Address must be 1-250 characters.');
  }

  const notes = normalizeText(value.notes);
  if (notes.length > 500) {
    errors.push('Notes must be 500 characters or fewer.');
  }

  const category = typeof value.category === 'string' ? value.category : '';
  if (!(PLACE_CATEGORIES as readonly string[]).includes(category)) {
    errors.push('Category is invalid.');
  }

  const visited = value.visited === true || value.visited === false ? value.visited : false;

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      address,
      notes: notes || undefined,
      category: category as Category,
      visited,
    },
  };
}

export function createPlaceId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `place-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function parsePlaceRecord(record: unknown): Place {
  const validation = validatePlaceInput(record);
  if (!validation.ok) {
    throw new Error(validation.errors.join(' '));
  }

  const candidate = record as Record<string, unknown> & { id?: string; createdAt?: number };
  const value = validation.value;
  return {
    id: typeof candidate.id === 'string' ? candidate.id : createPlaceId(),
    name: value.name,
    address: value.address,
    notes: value.notes,
    category: value.category,
    visited: value.visited ?? false,
    createdAt:
      typeof candidate.createdAt === 'number' && Number.isFinite(candidate.createdAt)
        ? candidate.createdAt
        : Date.now(),
  };
}

export function createPlace(input: PlaceInput): Place {
  return {
    id: createPlaceId(),
    name: input.name,
    address: input.address,
    notes: input.notes,
    category: input.category,
    visited: input.visited ?? false,
    createdAt: Date.now(),
  };
}

export function buildGoogleMapsSearchUrl(name: string, address: string = ''): string {
  const query = [name, address].filter(Boolean).join(' ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
