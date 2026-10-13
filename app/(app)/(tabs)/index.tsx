import Feather from "@expo/vector-icons/Feather";
import Avatar from "../../../assets/images/avatar.svg";
import Details from "../../../assets/icons/details.svg";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import SubscriptionStateView from "@/components/SubscriptionStateView";
import { colors } from "@/config/theme";
import { type Category, CATEGORIES } from "@/lib/places";
import { useApp } from "@/providers/app-provider";
import { useSubscriptions } from "@/providers/SubscriptionContext";
import { useUser } from "@clerk/expo";
import { type Href, router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categoryArtwork: Record<Category, string> = {
  Nature: "#DDE8D8",
  Food: "#F2E2D3",
  Culture: "#E5E0EA",
  Adventure: "#DCE7E4",
  Other: "#E8E6DC",
};

export default function Home() {
  const [createVisible, setCreateVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");

  const { sessionMode, toggleVisited } = useApp();
  const { state, subscriptions: places, createSubscription } = useSubscriptions();
  const { user } = useUser();

  const displayName =
    user?.firstName ||
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    (sessionMode === "guest" ? "Guest Explorer" : "Explorer");
  const firstName = displayName.split(/[ ._-]/)[0];

  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return places.filter((place) => {
      if (selectedCategory !== "All" && place.category !== selectedCategory) {
        return false;
      }

      if (!query) return true;
      const searchableText = [place.name, place.address, place.notes ?? ""]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [places, searchQuery, selectedCategory]);

  const travelPlaces = filteredPlaces.filter((place) => !place.visited);

  const openPlace = (id: string) => {
    router.push({
      pathname: "/(app)/(tabs)/insights",
      params: { id },
    } as any);
  };

  const showAllPlaces = () => {
    router.push("/(app)/(tabs)/subscriptions" as Href);
  };

  if (state.status !== "ready") return <SubscriptionStateView />;

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 132 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-7 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            {user?.imageUrl ? (
              <Image
                className="h-12 w-12 rounded-full"
                source={{ uri: user.imageUrl }}
              />
            ) : (
              <Avatar width={48} height={48} />
            )}
            <Text className="text-base font-sans-bold text-foreground">
              Hello {firstName}
            </Text>
          </View>
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-primary"
            onPress={() => setCreateVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Save a new place"
          >
            <Feather name="plus" size={20} color={colors.card} />
          </Pressable>
        </View>

        <Text className="mb-5 text-[22px] leading-[27px] font-sans-bold text-foreground">
          Explore the{"\n"}Beautiful world!
        </Text>

        <View className="mb-6 flex-row items-center gap-3">
          <View className="h-[54px] flex-1 flex-row items-center rounded-[20px] bg-card px-4">
            <Feather name="search" size={18} color={colors.foreground} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Places"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              className="ml-3 flex-1 text-sm font-sans-medium text-foreground"
              accessibilityLabel="Search saved places"
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery("")}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Feather name="x" size={17} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
          <Pressable
            className="h-[54px] w-[54px] items-center justify-center rounded-[18px] bg-primary"
            onPress={() => setFiltersVisible((visible) => !visible)}
            accessibilityRole="button"
            accessibilityLabel={filtersVisible ? "Hide place filters" : "Show place filters"}
            accessibilityState={{ expanded: filtersVisible }}
          >
            <Feather name="sliders" size={20} color={colors.card} />
          </Pressable>
        </View>

        {filtersVisible && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 20 }}
          >
            {(["All", ...CATEGORIES] as (Category | "All")[]).map((category) => {
              const active = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 ${
                    active ? "border-primary bg-primary" : "border-border bg-card"
                  }`}
                >
                  <Text
                    className={`text-xs font-sans-semibold ${
                      active ? "text-white" : "text-foreground"
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-sans-bold text-foreground">
            Travel Places
          </Text>
          <Pressable
            onPress={showAllPlaces}
            accessibilityRole="button"
            accessibilityLabel="Show all places"
          >
            <Text className="text-xs font-sans-medium text-muted-foreground">
              Show more ›
            </Text>
          </Pressable>
        </View>

        {travelPlaces.length > 0 ? (
          <FlatList
            data={travelPlaces}
            horizontal
            keyExtractor={(place) => place.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16, paddingRight: 4 }}
            renderItem={({ item }) => {
              const artwork =
                categoryArtwork[item.category as Category] ?? categoryArtwork.Other;
              return (
                <Pressable
                  onPress={() => openPlace(item.id)}
                  className="mr-4 w-[166px] rounded-[22px] bg-card p-2.5 shadow-sm"
                  accessibilityRole="button"
                  accessibilityLabel={`View ${item.name}`}
                >
                  <View
                    className="mb-2 h-[128px] items-center justify-center overflow-hidden rounded-[16px]"
                    style={{ backgroundColor: artwork }}
                  >
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-white/75">
                      <Details width={36} height={36} />
                    </View>
                    <View className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-white/90">
                      <Feather name="bookmark" size={13} color={colors.primary} />
                    </View>
                  </View>
                  <Text
                    className="text-xs font-sans-bold text-foreground"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View className="mt-1 flex-row items-center">
                    <Feather name="map-pin" size={11} color={colors.primary} />
                    <Text
                      className="ml-1 flex-1 text-[11px] font-sans-medium text-muted-foreground"
                      numberOfLines={1}
                    >
                      {item.address || item.location || item.category}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        ) : (
          <View className="mb-5 rounded-2xl bg-card p-4">
            <Text className="text-sm font-sans-medium text-muted-foreground">
              {searchQuery || selectedCategory !== "All"
                ? "No places match your filters."
                : "Your next adventure starts here."}
            </Text>
          </View>
        )}

        <View className="mb-4 mt-1 flex-row items-center justify-between">
          <Text className="text-lg font-sans-bold text-foreground">
            My Schedule
          </Text>
          <Pressable
            onPress={showAllPlaces}
            accessibilityRole="button"
            accessibilityLabel="Show schedule"
          >
            <Text className="text-xs font-sans-medium text-muted-foreground">
              Show more ›
            </Text>
          </Pressable>
        </View>

        <View className="gap-3">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <View
                key={place.id}
                className="min-h-[80px] flex-row items-center rounded-[20px] bg-card px-3.5 py-3"
              >
                <Pressable
                  className="flex-1 flex-row items-center"
                  onPress={() => openPlace(place.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${place.name}`}
                >
                  <View
                    className="h-[54px] w-[70px] items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        categoryArtwork[place.category as Category] ??
                        categoryArtwork.Other,
                    }}
                  >
                    <Details width={32} height={32} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text
                      className="text-sm font-sans-bold text-foreground"
                      numberOfLines={1}
                    >
                      {place.name}
                    </Text>
                    <View className="mt-1 flex-row items-center">
                      <Feather
                        name="map-pin"
                        size={11}
                        color={colors.primary}
                      />
                      <Text
                        className="ml-1 text-xs font-sans-medium text-muted-foreground"
                        numberOfLines={1}
                      >
                        {place.address || place.location || place.category}
                      </Text>
                    </View>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => void toggleVisited(place.id)}
                  className={`ml-2 min-w-[68px] items-center rounded-full px-3 py-2 ${
                    place.visited ? "bg-muted" : "bg-primary"
                  }`}
                  accessibilityRole="button"
                  accessibilityLabel={
                    place.visited
                      ? `Mark ${place.name} as planned`
                      : `Mark ${place.name} as visited`
                  }
                >
                  <Text
                    className={`text-[11px] font-sans-semibold ${
                      place.visited ? "text-foreground" : "text-white"
                    }`}
                  >
                    {place.visited ? "Visited" : "To visit"}
                  </Text>
                </Pressable>
              </View>
            ))
          ) : (
            <View className="items-center rounded-2xl bg-card p-5">
              <Text className="text-sm font-sans-medium text-muted-foreground">
                {searchQuery
                  ? `No places found matching "${searchQuery}".`
                  : "No saved places yet."}
              </Text>
              <Pressable
                onPress={() => setCreateVisible(true)}
                className="mt-3 rounded-full bg-primary px-4 py-2.5"
                accessibilityRole="button"
              >
                <Text className="text-xs font-sans-semibold text-white">
                  Save your first place
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      <CreateSubscriptionModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onSubmit={createSubscription}
      />
    </SafeAreaView>
  );
}
