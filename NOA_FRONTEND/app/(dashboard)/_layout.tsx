import DropdownMenu from "@/components/DropdownMenu";
import ExploreBottom from "@/components/ExploreBottom";
import { WebSocketProvider } from "@/service/WebSocketContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { Tabs, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";


export default function DashboardTabLayout() {
  return <DashboardLayout />;
}

const DashboardLayout = () => {
  const router = useRouter();
  const navigation = useNavigation(); // Get navigation object
  const [currentCategory, setCurrentCategory] = useState("Dashboard");

  const handleCategoryChange = (category: string) => {
    if (category === "Dashboard") router.push("/dashboard");
    if (category === "Acceleration") router.push("/acceleration");
    if (category === "VelocityAngular") router.push("/velocityAngular");
    if (category === "VibrationSpeed") router.push("/vibrationSpeed");
    if (category === "VibrationAngle") router.push("/vibrationAngle");
    if (category === "Vibration Displacement")
      router.push("/vibrationDisplacement");
    if (category === "Frequency") router.push("/frequency");
  };

  return (
    <WebSocketProvider deviceID="1" userID="1">
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={() => (
          <ExploreBottom onCategoryChanged={handleCategoryChange} />
        )}
        screenOptions={{ headerShown: true }}
      >
        {[
          { name: "dashboard", title: "Dashboard" },
          { name: "acceleration", title: "Acceleration" },
          { name: "velocityAngular", title: "Velocity Angular" },
          { name: "vibrationSpeed", title: "Vibration Speed" },
          { name: "vibrationAngle", title: "Vibration Angle" },
          { name: "vibrationDisplacement", title: "Vibration Displacement" },
          { name: "frequency", title: "Frequency" },
        ].map((screen) => (
          <Tabs.Screen
            key={screen.name}
            name={screen.name}
            options={{
              headerTransparent: true,
              headerTitleAlign: "center",

              headerLeft: () => (
                <View style={{ marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginLeft: 35 }}
                  >
                    <Ionicons
                      name="chevron-back-outline"
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              ),
              headerTitle: () => (
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 25, fontFamily: "Koulen" }}>
                    {screen.title.toUpperCase()}
                  </Text>
                </View>
              ),
              headerRight: () => (
                <View style={{ marginTop: 20, marginRight: 35 }}>
                  <DropdownMenu />
                </View>
              ),
            }}
          />
        ))}
      </Tabs>
    </View>
    </WebSocketProvider>
  );
};
