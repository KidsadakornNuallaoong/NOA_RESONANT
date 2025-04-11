import React from "react";
import { Tabs } from "expo-router";
import TabbarBottom from "@/components/TabBar"; // ✅ custom bottom tab bar

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <TabbarBottom {...props} />}
    >
      <Tabs.Screen name="device" />
      <Tabs.Screen name="bookmark" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="location" />
      <Tabs.Screen name="setting" />
    </Tabs>
  );
}
