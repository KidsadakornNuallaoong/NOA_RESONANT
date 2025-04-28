import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const cards = [
  require("../../assets/images/credit1.png"),
  require("../../assets/images/credit2.png"),
];
const screenWidth = Dimensions.get("window").width;

const CreditCardScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Link href={"/setting"} asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>CREDIT CARD</Text>
      </View>

      {/* Credit Card Slider */}
      <View style={styles.cardSlider}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / (width * 0.85)
            );
            setActiveIndex(index);
          }}
          scrollEventThrottle={16}
        >
          {cards.map((img, index) => (
            <Image
              key={index}
              source={img}
              style={styles.cardImage}
              resizeMode="contain"
            />
          ))}
        </ScrollView>
      </View>

      {/* Indicator */}
      <View style={styles.indicatorContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index
                ? styles.indicatorActive
                : styles.indicatorInactive,
            ]}
          />
        ))}
      </View>

      {/* Input Fields */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>CARD HOLDER NAME</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>Name Surname</Text>
        </View>

        <Text style={styles.label}>CARD NUMBER</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>1234 5678 9012 3456</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfBox}>
            <Text style={styles.label}>EXPIRE</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>01/80</Text>
            </View>
          </View>
          <View style={styles.halfBox}>
            <Text style={styles.label}>CVV</Text>
            <View style={styles.inputBox}>
              <Text style={styles.inputText}>9635</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#2D2D2D",
    height: 250,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    top: 55,
    alignSelf: "center",
  },
  cardSlider: {
    marginTop: -80,
    marginLeft: 20,
    width: screenWidth - 35,
    height: 220,
  },
  cardImage: {
    width: width * 0.85,
    height: 200,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  indicatorActive: {
    backgroundColor: "#00C266",
  },
  indicatorInactive: {
    backgroundColor: "#D3D3D3",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 14,
    color: "#000",
  },
  inputBox: {
    backgroundColor: "#E7E7E7",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 26,
  },
  inputText: {
    fontSize: 15,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfBox: {
    width: "48%",
  },
});

export default CreditCardScreen;
