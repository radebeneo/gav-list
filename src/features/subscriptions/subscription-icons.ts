import type { ImageSourcePropType } from "react-native";

import { icons } from "@/config/icons";

const ICONIFY_SEARCH_URL = "https://api.iconify.design/search";
const ICONIFY_API_URL = "https://api.iconify.design";

interface IconifySearchResponse {
  icons?: string[];
}

interface IconCandidates {
  exactMatch?: string;
  simpleIconMatch?: string;
  firstResult?: string;
}

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const iconUri = (iconName: string) => {
  const [prefix, name] = iconName.split(":");
  return `${ICONIFY_API_URL}/${encodeURIComponent(prefix)}/${encodeURIComponent(name)}.svg`;
};

const searchIconify = async (query: string): Promise<IconCandidates> => {
  const response = await fetch(
    `${ICONIFY_SEARCH_URL}?query=${encodeURIComponent(query)}&limit=30`,
  );
  if (!response.ok) return {};

  const data = (await response.json()) as IconifySearchResponse;
  const results = data.icons ?? [];
  const normalizedQuery = normalize(query);
  const matchingIcons = results.filter((result) => result.includes(":"));

  return {
    exactMatch: matchingIcons.find(
      (result) => normalize(result.split(":")[1]) === normalizedQuery,
    ),
    simpleIconMatch: matchingIcons.find((result) =>
      result.startsWith("simple-icons:"),
    ),
    firstResult: matchingIcons[0],
  };
};

// "Confident" = either the icon's own name matches exactly, or it's a
// simple-icons brand logo. Both are safe to trust without a fallback.
const confidentMatch = (candidates: IconCandidates) =>
  candidates.exactMatch ?? candidates.simpleIconMatch;

export const findSubscriptionIcon = async (
  placeNameOrCategory: string,
): Promise<ImageSourcePropType> => {
  const name = placeNameOrCategory.trim();
  if (!name) return icons.location;

  try {
    const lower = name.toLowerCase();
    if (lower.includes("food") || lower.includes("cafe") || lower.includes("restaurant") || lower.includes("coffee")) {
      return icons.location;
    }
    if (lower.includes("nature") || lower.includes("park") || lower.includes("trail") || lower.includes("hike") || lower.includes("mountain")) {
      return icons.star;
    }
    if (lower.includes("culture") || lower.includes("museum") || lower.includes("art")) {
      return icons.pencil;
    }
    return icons.location;
  } catch {
    return icons.location;
  }
};
