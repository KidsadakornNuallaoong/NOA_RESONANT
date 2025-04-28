import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { getToken } from "../utils/secureStore";

export default function Index() {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        router.replace("/(tabs)/device");
      } else {
        router.replace("/(auth)/signin");
      }
    };

    checkAuth();
  }, []);

  return (
    
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ActivityIndicator size="large" color="#40C375" />
    </View>
  );
}
