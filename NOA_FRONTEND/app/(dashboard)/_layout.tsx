import React, { createContext, useEffect, useState, useCallback } from "react";
import { Tabs, useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import ExploreBottom from "@/components/ExploreBottom";
import DropdownMenu from "@/components/DropdownMenu";

export const DeviceContext = createContext<{
  deviceID: string;
  userID: string;
  deviceName: string;
}>({
  deviceID: "",
  userID: "",
  deviceName: "",
});

export default function DashboardTabLayout() {
  const { id, userID, deviceName } = useLocalSearchParams();

  useEffect(() => {
    console.log("Device ID:", id);
    console.log("User ID:", userID);
    console.log("Device Name:", deviceName);
  }, []);

  return (
    <DeviceContext.Provider
      value={{
        deviceID: id as string,
        userID: userID as string,
        deviceName: deviceName as string,
      }}
    >
      <DashboardLayout />
    </DeviceContext.Provider>
  );
}

const DashboardLayout = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [currentCategory, setCurrentCategory] = useState("Dashboard");
  const { id, userID, deviceName } = useLocalSearchParams();

  const handleCategoryChange = useCallback(
    (category: string) => {
      setCurrentCategory(category);

      const targetPath = {
        Dashboard: "/dashboard",
        Acceleration: "/acceleration",
        VelocityAngular: "/velocityAngular",
        VibrationSpeed: "/vibrationSpeed",
        VibrationAngle: "/vibrationAngle",
        "Vibration Displacement": "/vibrationDisplacement",
        Frequency: "/frequency",
        Temperature: "/temperature",
      }[category] as
        | "/dashboard"
        | "/acceleration"
        | "/velocityAngular"
        | "/vibrationSpeed"
        | "/vibrationAngle"
        | "/vibrationDisplacement"
        | "/frequency"
        | "/temperature";

      if (targetPath) {
        router.replace({
          pathname: targetPath,
          params: {
            id: id?.toString(),
            userID: userID?.toString(),
            deviceName: deviceName?.toString(),
          },
        });
      }
    },
    [id, userID, deviceName]
  );

  return (
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
          { name: "temperature", title: "Temperature" },
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
  );
};
