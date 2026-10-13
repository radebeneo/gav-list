import SubscriptionIcon from "@/components/SubscriptionIcon";
import {
  getCategoryBadgeStyle,
} from "@/features/subscriptions/utils";
import { buildGoogleMapsSearchUrl } from "@/lib/places";
import { Linking, Pressable, Text, View } from "react-native";

const SubscriptionCard = ({
  id,
  name,
  address,
  location,
  category = "Other",
  notes,
  visited,
  status,
  icon,
  expanded,
  onPress,
  onMapPress,
  onToggleVisited,
  onDelete,
}: SubscriptionCardProps) => {
  const displayAddress = address || location || "No address provided";
  const isVisited = visited !== undefined ? visited : status === "visited";
  const badgeStyle = getCategoryBadgeStyle(category);

  const handleMapPress = () => {
    if (onMapPress) {
      onMapPress();
      return;
    }
    const url = buildGoogleMapsSearchUrl(name, displayAddress);
    void Linking.openURL(url).catch(() => undefined);
  };

  return (
    <Pressable
      onPress={onPress}
      className="rounded-3xl border border-border bg-card p-5 shadow-sm active:opacity-90"
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <View className="mb-2 flex-row flex-wrap items-center gap-2">
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: badgeStyle.bg, borderWidth: 1, borderColor: badgeStyle.border }}
            >
              <Text className="text-xs font-sans-bold" style={{ color: badgeStyle.text }}>
                {category}
              </Text>
            </View>
            <View
              className={`rounded-full px-3 py-1 ${
                isVisited ? "bg-emerald-100 border border-emerald-300" : "bg-amber-100 border border-amber-300"
              }`}
            >
              <Text
                className={`text-xs font-sans-bold ${
                  isVisited ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                {isVisited ? "Visited" : "To Visit"}
              </Text>
            </View>
          </View>

          <Text className="text-xl font-sans-bold text-primary" numberOfLines={2}>
            {name}
          </Text>
          <Text className="mt-1 text-sm font-sans-medium text-muted-foreground" numberOfLines={2}>
            {displayAddress}
          </Text>
          {notes ? (
            <Text className="mt-2 text-xs font-sans-medium text-neutral-600 italic" numberOfLines={2}>
              {`"${notes}"`}
            </Text>
          ) : null}
        </View>

        {icon && (
          <View className="ml-2 items-center justify-center rounded-2xl bg-muted p-2">
            <SubscriptionIcon source={icon} size={36} />
          </View>
        )}
      </View>

      {/* Action buttons */}
      <View className="mt-4 flex-row flex-wrap items-center justify-between border-t border-border/50 pt-3">
        <Pressable
          onPress={handleMapPress}
          className="rounded-full bg-accent/15 px-3 py-1.5"
          accessibilityRole="button"
          accessibilityLabel="Open in Google Maps"
        >
          <Text className="text-xs font-sans-bold text-accent">Map Search</Text>
        </Pressable>

        <View className="flex-row items-center gap-2">
          {onToggleVisited && (
            <Pressable
              onPress={onToggleVisited}
              className="rounded-full bg-neutral-200/80 px-3 py-1.5"
              accessibilityRole="button"
            >
              <Text className="text-xs font-sans-semibold text-primary">
                {isVisited ? "Mark To Visit" : "Mark Visited"}
              </Text>
            </Pressable>
          )}

          {onDelete && (
            <Pressable
              onPress={onDelete}
              className="rounded-full bg-red-100 px-3 py-1.5"
              accessibilityRole="button"
            >
              <Text className="text-xs font-sans-semibold text-destructive">Delete</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default SubscriptionCard;
