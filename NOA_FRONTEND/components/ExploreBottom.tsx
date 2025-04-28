import React, { useMemo, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useFonts } from "expo-font";

// ✅ Import SVG icon components (จากไฟล์ที่แปลงแล้ว)
import OverviewIcon from "../assets/icons/grid_view.svg";
import AccIcon from "../assets/icons/readiness_score.svg";
import VelAngIcon from "../assets/icons/device_hub.svg";
import VelSpdIcon from "../assets/icons/acute.svg";
import VibAngIcon from "../assets/icons/Group 1.svg";
import VibDisIcon from "../assets/icons/animation.svg";
import FreqIcon from "../assets/icons/earthquake.svg";
import TempIcon from "../assets/icons/device_thermostat_fixed.svg";

// ✅ Tab items array
const tabItems = [
  { label: "OVERVIEW", value: "Dashboard", icon: OverviewIcon },
  { label: "ACC.", value: "Acceleration", icon: AccIcon },
  { label: "VEL.ANG", value: "VelocityAngular", icon: VelAngIcon },
  { label: "VEL.SPD", value: "VibrationSpeed", icon: VelSpdIcon },
  { label: "VIB.ANG", value: "VibrationAngle", icon: VibAngIcon },
  { label: "VIB.DIS", value: "Vibration Displacement", icon: VibDisIcon },
  { label: "FREQ", value: "Frequency", icon: FreqIcon },
  { label: "TEMP", value: "Temperature", icon: TempIcon },
];

interface Props {
  onCategoryChanged: (category: string) => void;
}

const ExploreBottom = ({ onCategoryChanged }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // const { colors } = useTheme();
  // const styles = useMemo(() => createStyles(colors), [colors]);

  const [fontsLoaded] = useFonts({
    LilitaOne: require("../assets/fonts/LilitaOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  const selectCategory = (index: number) => {
    setActiveIndex(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(tabItems[index].value);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.tabBar}>
          {tabItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeIndex === index;

            return (
              <TouchableOpacity
                key={index}
                style={styles.tabButton}
                onPress={() => selectCategory(index)}
              >
                <IconComponent
                  width={24}
                  height={24}
                  color={isActive ? "#3FDE7F" : "#FFFFFF"}
                />
                <Text
                  style={{
                    color: isActive ? "#3FDE7F" : "#FFFFFF",
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
      </ScrollView>
    </View>
  );
};

export default ExploreBottom;

// ✅ Dynamic styles
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#2d2d2d",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollContent: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  tabBar: {
    flexDirection: "row",
    height: 90,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 17,
  },
});
