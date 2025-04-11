import React from "react";
import { Tabs } from "expo-router";
import TabbarBottom from "@/components/TabBar";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Koulen: require("@/assets/fonts/Koulen-Regular.ttf"), // ✅ path ไปที่ฟอนต์
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#40C375" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => <TabbarBottom {...props} />}
    >
      <Tabs.Screen name="device" options={{ title: "Device" }} />
      <Tabs.Screen name="bookmark" options={{ title: "Bookmark" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="location" options={{ title: "Location" }} />
      <Tabs.Screen name="setting" options={{ title: "Setting" }} />
    </Tabs>
  );
}
