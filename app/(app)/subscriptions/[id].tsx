import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import EmptyStateArtwork from "@/components/EmptyStateArtwork";
import SubscriptionIcon from "@/components/SubscriptionIcon";
import {
  formatPlaceDate,
  getCategoryBadgeStyle,
  getCategoryIcon,
} from "@/features/subscriptions/utils";
import { buildGoogleMapsSearchUrl } from "@/lib/places";
import { useApp } from "@/providers/app-provider";
import { useSubscriptions } from "@/providers/SubscriptionContext";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <View className="border-b border-border/50 py-3">
      <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-1 text-base font-sans-medium text-primary">
        {value}
      </Text>
    </View>
  );
};

export default function PlaceDetailsScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { toggleVisited, removePlace, updatePlace } = useApp();
  const { state, subscriptions: places } = useSubscriptions();

  const [editing, setEditing] = useState(false);

  const place = places.find((item) => item.id === id);
  const loading = state.status !== "ready";

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
        <ActivityIndicator size="large" />
        <Text className="mt-4 font-sans-medium text-primary">
          Loading place...
        </Text>
      </SafeAreaView>
    );
  }

  if (!id || !place) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
        <EmptyStateArtwork />
        <Text className="text-center text-2xl font-sans-bold text-primary">
          Place not found
        </Text>
        <Text className="mt-3 text-center font-sans-medium text-muted-foreground">
          This place is unavailable or was removed.
        </Text>
        <Pressable
          className="mt-6 rounded-full bg-primary px-6 py-3"
          onPress={() => router.replace("/(app)/(tabs)/subscriptions" as any)}
          accessibilityRole="button"
        >
          <Text className="font-sans-bold text-background">Back to Saved Places</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const badgeStyle = getCategoryBadgeStyle(place.category);
  const categoryIcon = getCategoryIcon(place.category);
  const mapsUrl = buildGoogleMapsSearchUrl(place.name, place.address ?? "");

  const handleOpenMaps = () => {
    void Linking.openURL(mapsUrl).catch(() => undefined);
  };

  const handleToggleVisited = () => {
    void toggleVisited(place.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Place?",
      `Are you sure you want to remove "${place.name}" from your saved places?`,
      [
        { text: "Keep Place", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void removePlace(place.id);
            router.replace("/(app)/(tabs)/subscriptions" as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <ScrollView contentContainerClassName="px-5 pb-20" showsVerticalScrollIndicator={false}>
        <Pressable
          className="mb-4 self-start rounded-full bg-muted px-4 py-2"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text className="font-sans-bold text-primary">← Back</Text>
        </Pressable>

        {/* Hero Card */}
        <View className="items-center rounded-3xl border border-border bg-card p-6 shadow-sm">
          <View className="mb-4 flex-row items-center gap-2">
            <View
              className="rounded-full px-3.5 py-1"
              style={{
                backgroundColor: badgeStyle.bg,
                borderWidth: 1,
                borderColor: badgeStyle.border,
              }}
            >
              <Text className="text-xs font-sans-bold" style={{ color: badgeStyle.text }}>
                {place.category}
              </Text>
            </View>

            <View
              className={`rounded-full px-3.5 py-1 border ${
                place.visited
                  ? "bg-emerald-100 border-emerald-300"
                  : "bg-amber-100 border-amber-300"
              }`}
            >
              <Text
                className={`text-xs font-sans-bold ${
                  place.visited ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                {place.visited ? "Visited" : "Plan to visit"}
              </Text>
            </View>
          </View>

          <View className="items-center justify-center rounded-2xl bg-muted p-4">
            <SubscriptionIcon source={categoryIcon} size={56} />
          </View>

          <Text className="mt-4 text-center text-2xl font-sans-bold text-primary">
            {place.name}
          </Text>
          <Text className="mt-1 text-center font-sans-medium text-muted-foreground">
            {place.address}
          </Text>

          {/* Quick Action Buttons */}
          <View className="mt-6 w-full flex-row gap-3">
            <Pressable
              onPress={handleOpenMaps}
              className="flex-1 items-center justify-center rounded-2xl bg-primary py-3.5 active:opacity-90"
              accessibilityRole="button"
            >
              <Text className="text-sm font-sans-bold text-background">
                Open in Google Maps
              </Text>
            </Pressable>

            <Pressable
              onPress={handleToggleVisited}
              className="items-center justify-center rounded-2xl border border-border bg-muted px-4 py-3.5 active:opacity-90"
              accessibilityRole="button"
            >
              <Text className="text-xs font-sans-bold text-primary">
                {place.visited ? "Mark Unvisited" : "Mark Visited"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Details Card */}
        <View className="mt-5 rounded-3xl border border-border bg-card p-5">
          <Text className="text-lg font-sans-bold text-primary">Details</Text>
          <DetailRow label="Address" value={place.address} />
          <DetailRow label="Category" value={place.category} />
          <DetailRow
            label="Status"
            value={place.visited ? "Visited" : "Plan to visit"}
          />
          {place.notes ? <DetailRow label="Notes" value={place.notes} /> : null}
          {place.createdAt ? (
            <DetailRow
              label="Saved On"
              value={formatPlaceDate(place.createdAt)}
            />
          ) : null}
        </View>

        {/* Edit Button */}
        <Pressable
          className="mt-6 rounded-2xl bg-accent py-4 items-center active:opacity-90"
          onPress={() => setEditing(true)}
          accessibilityRole="button"
        >
          <Text className="text-center font-sans-bold text-primary">
            Edit Place
          </Text>
        </Pressable>

        {/* Delete Button */}
        <Pressable
          className="mt-4 rounded-2xl border border-destructive/40 bg-red-50/50 py-4 items-center active:opacity-90"
          onPress={handleDelete}
          accessibilityRole="button"
        >
          <Text className="text-center font-sans-bold text-destructive">
            Delete Place
          </Text>
        </Pressable>
      </ScrollView>

      <CreateSubscriptionModal
        visible={editing}
        onClose={() => setEditing(false)}
        initialData={{
          id: place.id,
          name: place.name,
          address: place.address,
          category: place.category,
          notes: place.notes,
          visited: place.visited,
        }}
        onSubmit={async (input) => {
          await updatePlace(place.id, input);
          setEditing(false);
        }}
      />
    </SafeAreaView>
  );
}
