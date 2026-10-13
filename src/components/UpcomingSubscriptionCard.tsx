import SubscriptionIcon from "@/components/SubscriptionIcon";
import { getCategoryBadgeStyle } from "@/features/subscriptions/utils";
import { Pressable, Text, View } from "react-native";

const UpcomingSubscriptionCard = ({
  name,
  category = "Other",
  address,
  location,
  visited,
  icon,
  onPress,
}: UpcomingSubscriptionCardProps) => {
  const displayAddress = address || location || "";
  const badgeStyle = getCategoryBadgeStyle(category);

  return (
    <Pressable
      className="mr-3 w-48 rounded-2xl border border-border bg-card p-4 shadow-sm active:opacity-90"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${name}`}
    >
      <View className="mb-2 flex-row items-center justify-between">
        <View
          className="rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: badgeStyle.bg, borderWidth: 1, borderColor: badgeStyle.border }}
        >
          <Text className="text-[10px] font-sans-bold" style={{ color: badgeStyle.text }}>
            {category}
          </Text>
        </View>
        {icon ? <SubscriptionIcon source={icon} size={28} /> : null}
      </View>

      <Text className="text-base font-sans-bold text-primary" numberOfLines={1}>
        {name}
      </Text>

      {displayAddress ? (
        <Text className="mt-1 text-xs font-sans-medium text-muted-foreground" numberOfLines={1}>
          {displayAddress}
        </Text>
      ) : null}

      <View className="mt-3">
        <Text
          className={`text-[11px] font-sans-semibold ${
            visited ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          {visited ? "✓ Visited" : "○ Plan to visit"}
        </Text>
      </View>
    </Pressable>
  );
};

export default UpcomingSubscriptionCard;
