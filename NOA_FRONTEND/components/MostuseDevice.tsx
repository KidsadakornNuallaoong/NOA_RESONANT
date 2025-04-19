import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Image, TouchableOpacity, ViewToken } from "react-native";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

interface MostUsedProps {
  devices: { id: string; name: string; usage: number }[];
}

const MostUsedSlider: React.FC<MostUsedProps> = ({ devices }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisibleIndex = viewableItems[0]?.index;
      if (firstVisibleIndex !== undefined && firstVisibleIndex !== null) {
        setCurrentIndex(firstVisibleIndex);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View>
      <FlatList
        data={devices}
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        bounces={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/dashboard", params: { id: item.id } })
            }
          >
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Image
                  source={require("../assets/images/Graph.png")}
                  style={styles.graphIcon}
                />
                <View>
                  <Text style={styles.deviceTitle}>
                    Device Address: {item.name}
                  </Text>
                  <Text style={styles.graphLabel}>Graph: Linear plot</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Dot Indicator */}
      <View style={styles.dotContainer}>
        {devices.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

export default MostUsedSlider;

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    backgroundColor: "#2d2d2d",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 10,
    width: screenWidth - 70,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  graphIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    resizeMode: "contain",
  },
  deviceTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Koulen",
  },
  graphLabel: {
    color: "#ccc",
    fontSize: 12,
    fontFamily: "Koulen",
    marginTop: 2,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#3fde7f",
  },
});
