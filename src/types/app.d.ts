import type { ImageSourcePropType } from "react-native";
import type { Category } from "@/lib/places";

export interface TabIconProps {
  focused: boolean;
  icon: ImageSourcePropType | any;
}

export interface AppTab {
  name: string;
  title: string;
  icon: ImageSourcePropType | any;
}

export interface ListHeadingProps {
  title: string;
  onPress?: () => void;
  actionLabel?: string;
}

export interface Subscription {
  id: string;
  name: string;
  address?: string;
  location?: string;
  category: Category | string;
  notes?: string;
  visited?: boolean;
  status?: string;
  createdAt?: number;
  icon?: any;
  price?: number;
  currency?: string;
  billing?: string;
  plan?: string;
  paymentMethod?: string;
  startDate?: string;
  renewalDate?: string | null;
  mapsUrl?: string;
}

export interface SubscriptionCardProps {
  id?: string;
  name: string;
  address?: string;
  location?: string;
  category?: string;
  notes?: string;
  visited?: boolean;
  status?: string;
  icon?: any;
  price?: number;
  currency?: string;
  billing?: string;
  plan?: string;
  paymentMethod?: string;
  startDate?: string;
  renewalDate?: string | null;
  expanded?: boolean;
  color?: string;
  onPress?: () => void;
  onMapPress?: () => void;
  onToggleVisited?: () => void;
  onDelete?: () => void;
}

export interface UpcomingSubscriptionCardProps {
  id?: string;
  name: string;
  address?: string;
  category?: string;
  daysLeft?: number;
  price?: number;
  currency?: string;
  icon?: any;
  visited?: boolean;
  onPress?: () => void;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}
