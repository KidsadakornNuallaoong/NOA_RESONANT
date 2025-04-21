import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import * as Haptics from "expo-haptics";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ SVG Icons
import DeviceIcon from "../assets/icons/assistant_device.svg";
import BookmarkIcon from "../assets/icons/bookmark.svg";
import HistoryIcon from "../assets/icons/deployed_code_history.svg";
import LocationIcon from "../assets/icons/location_on.svg";
import SettingIcon from "../assets/icons/settings.svg";

const tabItems = [
  { label: "Device", value: "device", icon: DeviceIcon },
  { label: "Bookmark", value: "bookmark", icon: BookmarkIcon },
  { label: "History", value: "history", icon: HistoryIcon },
  { label: "Location", value: "location", icon: LocationIcon },
  { label: "Setting", value: "setting", icon: SettingIcon },
];

export default function TabbarBottom({ state, navigation }: BottomTabBarProps) {
  const [fontsLoaded] = useFonts({
    LilitaOne: require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <View style={styles.tabBar}>
        {tabItems.map((item, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const route = state.routes[index];
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = item.icon;

          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={onPress}
            >
              <Icon
                width={24}
                height={24}
                color={isFocused ? "#3FDE7F" : "#fff"}
              />
              <Text
                style={{
                  color: isFocused ? "#3FDE7F" : "#fff",
                  fontFamily: "LilitaOne",
                  fontSize: 12,
                  marginTop: 8,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent", // ปล่อยให้ view ด้านในมีพื้นหลัง
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#2d2d2d",
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
