declare global {
  interface MenuItem {
    name: string;
    price: number;
    image_url: string;
    description: string;
    calories: number;
    protein: number;
    rating: number;
    type: string;
  }

  interface User {
    name: string;
    email: string;
    avatar: string;
  }

  interface CartCustomization {
    id: string;
    name: string;
    price: number;
    type: string;
  }

  interface CartItemType {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
    customizations?: CartCustomization[];
  }

  interface TabBarIconProps {
    focused: boolean;
    icon: any;
    title: string;
  }

  interface TabIconProps {
    focused: boolean;
    icon: any;
  }

  interface AppTab {
    name: string;
    title: string;
    icon: any;
  }

  interface ListHeadingProps {
    title: string;
    onPress?: () => void;
    actionLabel?: string;
  }

  interface Subscription {
    id: string;
    name: string;
    address?: string;
    location?: string;
    category: string;
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

  interface SubscriptionCardProps {
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

  interface UpcomingSubscriptionCardProps {
    id?: string;
    name: string;
    address?: string;
    location?: string;
    category?: string;
    daysLeft?: number;
    price?: number;
    currency?: string;
    icon?: any;
    visited?: boolean;
    onPress?: () => void;
  }
}

export {};