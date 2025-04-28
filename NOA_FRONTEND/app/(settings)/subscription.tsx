import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
} from "react-native";

type Plan = {
  label: string;
  price: string;
} | null;

const SubscriptionScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dy > 100) {
        setModalVisible(false);
        pan.setValue({ x: 0, y: 0 });
      } else {
        Animated.spring(pan.y, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const plans: Plan[] = [
    { label: "12", price: " months $9.00" },
    { label: "3", price: " months $5.00" },
    { label: "1", price: "  month $1.00" },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerContainer}>
        <View style={{ position: "absolute", left: 0 }}>
          <Link href={"/(tabs)/setting"} asChild>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={30} color="#2d2d2d" />
            </TouchableOpacity>
          </Link>
        </View>
        <Text style={styles.header}>SUBSCRIPTION</Text>
      </View>
      <Image
        source={require("../../assets/images/NOA.png")}
        style={{ width: 220, height: 220, marginTop: 10 }}
        resizeMode="contain"
      />
      <Text style={styles.subtext}>Upgrade to Premium</Text>
      <Text style={styles.smallText}>
        Upgrade to get additional special functions.{"\n"}And more!
      </Text>
      <View style={styles.planContainer}>
        {plans
          .filter((plan): plan is Exclude<Plan, null> => plan !== null)
          .map((plan, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.planButton,
                selectedPlan?.label === plan.label && styles.selectedPlanButton,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <Text style={styles.planTextNum}>{plan.label}</Text>
              <Text style={styles.planText}>{plan.price}/mt</Text>
            </TouchableOpacity>
          ))}
      </View>
      <TouchableOpacity
        style={styles.getButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.getButtonText}>
          {selectedPlan
            ? `Get ${selectedPlan.label} / ${selectedPlan.price}`
            : "Please select your plan."}
        </Text>
      </TouchableOpacity>
      <View style={styles.featuresBox}>
        <View style={styles.featureTitleBox}>
          <Text style={styles.featureTitle}>Premium plan.</Text>
        </View>
        <View>
          {[
            "AI-powered predictive analytics.",
            "Basic anomaly notification and what happened?",
            "Unlimited export.",
            "Unlock features limit.",
            "Unlimited features and streaming.",
          ].map((feature, idx) => (
            <View
              key={idx}
              style={{ alignItems: "flex-start", flexDirection: "row" }}
            >
              <Image
                source={require("../../assets/images/Check Box.png")}
                style={{ width: 23, height: 23, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text style={styles.TextPlan}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: pan.y }] },
            ]}
            {...panResponder.panHandlers}
          >
            {/* ขีดโง่ */}
            <View style={styles.dragIndicator} />

            <Text style={styles.modalTitle}>SELECT CREDIT CARDS</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: 5,
                marginBottom: 15,
              }}
            >
              <View style={styles.cardLogosRow}>
                <Text style={styles.modalSubtitle}>CREDIT/DEBIT CARD</Text>
                <Image
                  source={require("../../assets/images/Visa icon.png")}
                  style={styles.cardLogoInline}
                />
                <Image
                  source={require("../../assets/images/Mastercards icon.png")}
                  style={styles.cardLogoInline}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.cardBox,
                selectedCard === "mastercard" && styles.selectedCardBox,
              ]}
              onPress={() => setSelectedCard("mastercard")}
            >
              <Image
                source={require("../../assets/images/Mastercards icon.png")}
                style={styles.cardIcon}
              />
              <View>
                <Text style={styles.cardLabel}>MASTERCARDS</Text>
                <Text style={styles.cardNumber}>**** **** **** 6853</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cardBox,
                selectedCard === "visa" && styles.selectedCardBox,
              ]}
              onPress={() => setSelectedCard("visa")}
            >
              <Image
                source={require("../../assets/images/Visa icon.png")}
                style={styles.cardIcon}
              />
              <View>
                <Text style={styles.cardLabel}>VISA</Text>
                <Text style={styles.cardNumber}>**** **** **** 5963</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addCardButton}>
              <Text style={styles.addCardText}>ADD CARD</Text>
            </TouchableOpacity>

            <View
              style={{
                marginTop: 140,
                marginBottom: 140,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#ff5555", fontFamily: "Koulen" }}>
                ⚠️ : In development.
              </Text>
              <Text>This feature is currently under development.</Text>
            </View>

            <Link href={"/(tabs)/setting"} asChild>
              <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>PAY</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 22,
    position: "relative",
  },
  header: {
    fontSize: 32,
    fontFamily: "Koulen",
  },
  subtext: {
    color: "#3fde7f",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  smallText: {
    color: "#a8a8a8",
    textAlign: "center",
    marginBottom: 15,
    fontWeight: "bold",
  },
  planContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "110%",
    marginBottom: 10,
  },
  planButton: {
    borderRadius: 10,
    padding: 10,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  selectedPlanButton: {
    borderRadius: 20,
    borderWidth: 7,
    borderColor: "#3fde7f",
    backgroundColor: "white",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  planTextNum: {
    fontSize: 30,
    fontWeight: "bold",
  },
  planText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  getButton: {
    backgroundColor: "#2d2d2d",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    height: 70,
    marginBottom: 15,
    alignContent: "center",
    justifyContent: "center",
  },
  getButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  featuresBox: {
    borderWidth: 5,
    borderColor: "#2d2d2d",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  featureTitleBox: {
    width: 170,
    height: 45,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2d2d2d",
    position: "relative",
    top: -20,
  },
  featureTitle: {
    fontWeight: "bold",
    color: "#3fde7f",
    fontSize: 18,
  },
  TextPlan: {
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Koulen",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontFamily: "Koulen",
    color: "#4b4b4b",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  cardLogos: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  cardLogo: {
    width: 40,
    height: 25,
    resizeMode: "contain",
  },
  cardBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  cardIcon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    marginRight: 15,
  },
  cardLabel: {
    fontFamily: "Koulen",
    fontSize: 18,
  },
  cardNumber: {
    color: "#555",
    fontFamily: "Koulen",
    fontSize: 15,
  },
  addCardButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addCardText: {
    fontFamily: "Koulen",
  },
  payButton: {
    marginTop: 20,
    backgroundColor: "#3fde7f",
    padding: 10,
    borderRadius: 10,
  },
  payButtonText: {
    color: "#fff",
    fontFamily: "Koulen",
    textAlign: "center",
    fontSize: 20,
  },
  selectedCardBox: {
    borderColor: "#b0bbed",
    borderWidth: 2,
  },
  cardLogosRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  cardLogoInline: {
    width: 40,
    height: 25,
    resizeMode: "contain",
    marginLeft: 8,
  },
  dragIndicator: {
    width: 170,
    height: 5,
    backgroundColor: "#323232",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: -5,
  },
});
