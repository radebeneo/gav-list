
import { icons } from "@/config/icons";
import type { Category, Place } from "@/lib/places";

/**
 * Formats a given value as a currency string.
 * Defaults to South African Rand (ZAR) formatting.
 *
 * @param value - The numerical or string value to format.
 * @param currency - The currency code to use (default: "ZAR").
 * @returns The formatted currency string.
 */
export const formatCurrency = (value: number | string, currency: string = "ZAR"): string => {
  try {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      throw new Error("Invalid number provided");
    }

    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    // Fallback in case of an error (e.g., unsupported currency code or invalid number)
    let safeValue = 0;
    if (typeof value === "number" && !isNaN(value)) {
      safeValue = value;
    } else if (typeof value === "string") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        safeValue = parsed;
      }
    }

    const prefix = currency === "ZAR" ? "R" : `${currency} `;
    return `${prefix}${safeValue.toFixed(2)}`;
  }
};

export const formatSubscriptionDateTime = (value?: string | number): string => {
  if (!value) return "Not provided";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Not provided";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

export const formatPlaceDate = (value?: number | string): string => {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  if (value === "to-visit") return "To Visit";
  if (value === "visited") return "Visited";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const getRenewalDays = (
  renewalDate: string,
  now: string | Date = new Date(),
): number => {
  const target = new Date(renewalDate);
  const current = typeof now === "string" ? new Date(now) : now;
  const targetUtc = Date.UTC(
    target.getUTCFullYear(),
    target.getUTCMonth(),
    target.getUTCDate(),
  );
  const currentUtc = Date.UTC(
    current.getUTCFullYear(),
    current.getUTCMonth(),
    current.getUTCDate(),
  );
  return Math.round((targetUtc - currentUtc) / (1000 * 60 * 60 * 24));
};

export const formatRenewalDueLabel = (days: number): string => {
  if (days < 0) {
    const overdueDays = Math.abs(days);
    return `Overdue by ${overdueDays} ${overdueDays === 1 ? "day" : "days"}`;
  }
  if (days === 0) return "Due Today";
  if (days === 1) return "Due Tomorrow";
  return `${days} days left`;
};

interface RenewalSubscription<TIcon> {
  id: string;
  icon: TIcon;
  name: string;
  price: number;
  currency?: string;
  status?: string;
  renewalDate?: string | null;
}

interface UpcomingRenewal<TIcon> {
  id: string;
  icon: TIcon;
  name: string;
  price: number;
  currency?: string;
  daysLeft: number;
}

export const getUpcomingSubscriptions = <TIcon>(
  subscriptions: RenewalSubscription<TIcon>[],
  now: string | Date = new Date(),
): UpcomingRenewal<TIcon>[] =>
  subscriptions
    .filter(
      (subscription) =>
        subscription.status === "active" &&
        Boolean(subscription.renewalDate) &&
        !isNaN(new Date(subscription.renewalDate!).getTime()),
    )
    .map((subscription) => ({
      id: subscription.id,
      icon: subscription.icon,
      name: subscription.name,
      price: subscription.price,
      currency: subscription.currency,
      daysLeft: getRenewalDays(subscription.renewalDate!, now),
    }))
    .sort((first, second) => first.daysLeft - second.daysLeft);

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string }> = {
  Nature: { bg: "#e8f5e9", text: "#2e7d32", border: "#a5d6a7" },
  Food: { bg: "#fff3e0", text: "#e65100", border: "#ffcc80" },
  Culture: { bg: "#ede7f6", text: "#512da8", border: "#b39ddb" },
  Adventure: { bg: "#e0f2f1", text: "#00695c", border: "#80cbc4" },
  Other: { bg: "#eceff1", text: "#37474f", border: "#b0bec5" },
};

export function getCategoryBadgeStyle(category: string) {
  return CATEGORY_COLORS[category as Category] ?? CATEGORY_COLORS.Other;
}

export function getCategoryIcon(category: string) {
  switch (category) {
    case "Nature":
    case "Adventure":
      return icons.star;
    case "Food":
      return icons.location;
    case "Culture":
      return icons.pencil;
    default:
      return icons.location;
  }
}

export function filterPlaces(
  places: Place[],
  query: string,
  statusFilter?: "all" | "visited" | "to-visit",
  categoryFilter?: string,
): Place[] {
  const normalized = query.trim().toLowerCase();

  return places.filter((place) => {
    if (statusFilter === "visited" && !place.visited) return false;
    if (statusFilter === "to-visit" && place.visited) return false;
    if (categoryFilter && categoryFilter !== "All" && place.category !== categoryFilter) return false;

    if (!normalized) return true;
    const haystack = [place.name, place.address, place.category, place.notes ?? ""]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
