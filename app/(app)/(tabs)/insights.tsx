import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import SubscriptionIcon from "@/components/SubscriptionIcon";
import SubscriptionStateView from "@/components/SubscriptionStateView";
import {
  formatPlaceDate,
  getCategoryBadgeStyle,
  getCategoryIcon,
} from "@/features/subscriptions/utils";
import { buildGoogleMapsSearchUrl } from "@/lib/places";
import { useApp } from "@/providers/app-provider";
import { useSubscriptions } from "@/providers/SubscriptionContext";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Details = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { toggleVisited, removePlace, updatePlace } = useApp();
  const { state, subscriptions: places } = useSubscriptions();

  const [editVisible, setEditVisible] = useState(false);

  // If id is provided in route params, find that place; otherwise default to first place
  const selectedPlace = useMemo(() => {
    if (id) {
      const match = places.find((p) => p.id === id);
      if (match) return match;
    }
    return places[0] ?? null;
  }, [id, places]);

  if (state.status !== "ready") {
    return <SubscriptionStateView />;
  }

  if (!selectedPlace) {
    return (
      <SafeAreaView className="flex-1 bg-background p-6" edges={["top", "left", "right"]}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-2xl font-sans-bold text-primary">
            No Place Selected
          </Text>
          <Text className="mt-2 text-center text-sm font-sans-medium text-muted-foreground">
            Save a place or select one from your saved places list to view its details.
          </Text>
          <Pressable
            onPress={() => router.push("/(app)/(tabs)/index" as any)}
            className="mt-6 rounded-full bg-primary px-6 py-3"
          >
            <Text className="font-sans-bold text-background">Go to Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const badgeStyle = getCategoryBadgeStyle(selectedPlace.category);
  const categoryIcon = getCategoryIcon(selectedPlace.category);
  const mapsUrl = buildGoogleMapsSearchUrl(selectedPlace.name, selectedPlace.address ?? "");

  const handleOpenMaps = () => {
    void Linking.openURL(mapsUrl).catch(() => undefined);
  };

  const handleToggleVisited = () => {
    void toggleVisited(selectedPlace.id);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Place?",
      `Are you sure you want to remove "${selectedPlace.name}" from your saved places?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void removePlace(selectedPlace.id);
            router.push("/(app)/(tabs)/subscriptions" as any);
          },
        },
      ]
    );
  };

  const otherPlaces = places.filter((p) => p.id !== selectedPlace.id);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <ScrollView
        className="px-5"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View className="mb-4 mt-2 flex-row items-center justify-between">
          <Text className="text-3xl font-sans-bold text-primary">
            Place Details
          </Text>
          <Pressable
            onPress={() => setEditVisible(true)}
            className="rounded-full bg-primary/10 px-4 py-2"
            accessibilityRole="button"
            accessibilityLabel="Edit place"
          >
            <Text className="text-xs font-sans-bold text-primary">Edit</Text>
          </Pressable>
        </View>

        {/* Hero Card */}
        <View className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <View className="flex-row items-start justify-between">
            <View
              className="rounded-full px-3.5 py-1.5"
              style={{
                backgroundColor: badgeStyle.bg,
                borderWidth: 1,
                borderColor: badgeStyle.border,
              }}
            >
              <Text className="text-xs font-sans-bold" style={{ color: badgeStyle.text }}>
                {selectedPlace.category}
              </Text>
            </View>

            <Pressable
              onPress={handleToggleVisited}
              className={`rounded-full px-3.5 py-1.5 border ${
                selectedPlace.visited
                  ? "bg-emerald-100 border-emerald-300"
                  : "bg-amber-100 border-amber-300"
              }`}
            >
              <Text
                className={`text-xs font-sans-bold ${
                  selectedPlace.visited ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                {selectedPlace.visited ? "✓ Visited" : "○ Plan to visit"}
              </Text>
            </Pressable>
          </View>

          <View className="mt-4 flex-row items-center gap-3">
            <View className="items-center justify-center rounded-2xl bg-muted p-3">
              <SubscriptionIcon source={categoryIcon} size={40} />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-sans-bold text-primary">
                {selectedPlace.name}
              </Text>
              <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">
                {selectedPlace.address}
              </Text>
            </View>
          </View>

          {/* Action buttons inside Hero card */}
          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={handleOpenMaps}
              className="flex-1 items-center justify-center rounded-2xl bg-primary py-3.5 active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Open in Google Maps"
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
                {selectedPlace.visited ? "Mark Unvisited" : "Mark Visited"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Detailed Information Section */}
        <View className="mt-6 rounded-3xl border border-border bg-card p-5">
          <Text className="text-lg font-sans-bold text-primary">
            Information
          </Text>

          <View className="mt-4 gap-4">
            <View className="border-b border-border/50 pb-3">
              <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
                Location / Address
              </Text>
              <Text className="mt-1 text-base font-sans-medium text-primary">
                {selectedPlace.address}
              </Text>
            </View>

            <View className="border-b border-border/50 pb-3">
              <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Text>
              <Text className="mt-1 text-base font-sans-medium text-primary">
                {selectedPlace.category}
              </Text>
            </View>

            <View className="border-b border-border/50 pb-3">
              <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </Text>
              <Text className="mt-1 text-base font-sans-medium text-primary">
                {selectedPlace.visited
                  ? "Visited - You've explored this place!"
                  : "To Visit - Still on your bucket list"}
              </Text>
            </View>

            {selectedPlace.notes ? (
              <View className="border-b border-border/50 pb-3">
                <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
                  Personal Notes
                </Text>
                <Text className="mt-1 text-base font-sans-medium text-primary">
                  {selectedPlace.notes}
                </Text>
              </View>
            ) : null}

            {selectedPlace.createdAt ? (
              <View className="pb-1">
                <Text className="text-xs font-sans-semibold uppercase tracking-wider text-muted-foreground">
                  Saved On
                </Text>
                <Text className="mt-1 text-base font-sans-medium text-primary">
                  {formatPlaceDate(selectedPlace.createdAt)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Danger zone / delete */}
        <View className="mt-6">
          <Pressable
            onPress={handleDelete}
            className="rounded-2xl border border-destructive/40 bg-red-50/50 py-3.5 items-center active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel="Delete place"
          >
            <Text className="text-sm font-sans-bold text-destructive">
              Delete Place
            </Text>
          </Pressable>
        </View>

        {/* Switch to other saved places */}
        {otherPlaces.length > 0 && (
          <View className="mt-8">
            <Text className="mb-3 text-lg font-sans-bold text-primary">
              Other Saved Places
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3"
            >
              {otherPlaces.map((place) => {
                const catStyle = getCategoryBadgeStyle(place.category);
                return (
                  <Pressable
                    key={place.id}
                    onPress={() =>
                      router.replace({
                        pathname: "/(app)/(tabs)/insights",
                        params: { id: place.id },
                      } as any)
                    }
                    className="w-44 rounded-2xl border border-border bg-card p-3.5"
                  >
                    <View
                      className="self-start rounded-full px-2 py-0.5"
                      style={{ backgroundColor: catStyle.bg }}
                    >
                      <Text className="text-[10px] font-sans-bold" style={{ color: catStyle.text }}>
                        {place.category}
                      </Text>
                    </View>
                    <Text
                      className="mt-2 text-sm font-sans-bold text-primary"
                      numberOfLines={1}
                    >
                      {place.name}
                    </Text>
                    <Text
                      className="mt-0.5 text-xs font-sans-medium text-muted-foreground"
                      numberOfLines={1}
                    >
                      {place.address}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Edit Place Modal */}
      <CreateSubscriptionModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        initialData={{
          id: selectedPlace.id,
          name: selectedPlace.name,
          address: selectedPlace.address,
          category: selectedPlace.category,
          notes: selectedPlace.notes,
          visited: selectedPlace.visited,
        }}
        onSubmit={async (input) => {
          await updatePlace(selectedPlace.id, input);
          setEditVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Details;
