import { tabs } from "@/config/data";
import { colors, components } from "@/config/theme";
import { Tabs } from "expo-router";
import type { ComponentType } from "react";
import { View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

interface TabIconProps {
  focused: boolean;
  icon: ComponentType<SvgProps>;
}

const TabIcon = ({ focused, icon }: TabIconProps) => {
  const Icon = icon;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Icon
        width={24}
        height={24}
        fill={focused ? colors.primary : "#BEC9D9"}
      />
    </View>
  );
};

const TabLayout = () => {
  return <SubscriptionTabs />;
};

const SubscriptionTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: Math.max(insets.bottom, tabBar.horizontalInset),
            height: tabBar.height,
            marginHorizontal: tabBar.horizontalInset,
            borderRadius: tabBar.height / 2,
            backgroundColor: colors.card,
            borderTopWidth: 0,
            paddingTop: 0,
            paddingBottom: 0,
            elevation: 6,
            shadowColor: colors.foreground,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
          },
          tabBarItemStyle: {
            height: tabBar.height,
            paddingVertical: 0,
            paddingTop: 0,
            paddingBottom: 0,
            alignItems: "center",
            justifyContent: "center",
          },
          tabBarIconStyle: {
            width: "100%",
            // The library's tab button adds 5pt padding on every side
            height: tabBar.height - 10,
            marginTop: 0,
            marginBottom: 0,
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        {tabs.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon={tab.icon} />
              ),
            }}
          />
        ))}
    </Tabs>
  );
};

export default TabLayout;
