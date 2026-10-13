import { icons } from "@/config/icons";
import { getCategoryIcon } from "@/features/subscriptions/utils";
import { buildGoogleMapsSearchUrl, type Category, type Place } from "@/lib/places";

export type PlaceDto = {
  _id?: string;
  id?: string;
  name: string;
  address?: string;
  category?: string;
  notes?: string;
  visited?: boolean;
  createdAt?: number;
  [key: string]: any;
};

export function toDisplaySubscription(dto: Place | PlaceDto): Subscription {
  const id = (dto as any).id || (dto as any)._id || "";
  const name = dto.name || "Untitled Place";
  const address = dto.address || "";
  const category = (dto.category || "Other") as Category;
  const notes = dto.notes || "";
  const visited = Boolean(dto.visited);
  const createdAt = typeof dto.createdAt === "number" ? dto.createdAt : Date.now();
  const icon = getCategoryIcon(category) || icons.location;

  return {
    id,
    icon,
    name,
    address,
    location: address,
    category,
    notes,
    visited,
    status: visited ? "visited" : "to-visit",
    plan: address,
    billing: category,
    createdAt,
    startDate: new Date(createdAt).toISOString(),
    renewalDate: null,
    mapsUrl: buildGoogleMapsSearchUrl(name, address),
  };
}
