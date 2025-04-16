import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";

type Plan = {
  label: string;
  price: string;
};

const SubscriptionScreen: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan>({
    label: "12 months",
    price: "$9.00",
  });

  const plans: Plan[] = [
    { label: "12", price: " months $9.00" },
    { label: "3", price: " months $5.00" },
    { label: "1", price: "  month $1.00" },
  ];

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: 22,
          position: "relative",
        }}
      >
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
        Upgrade to get additional special functions.
        {"\n"}
        And more!
      </Text>

      <View style={styles.planContainer}>
        {plans.map((plan, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.planButton,
              selectedPlan.label === plan.label && styles.selectedPlanButton,
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            <Text style={styles.planTextNum}>{plan.label}</Text>
            <Text style={styles.planText}>{plan.price}/mt</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.getButton}>
        <Text style={styles.getButtonText}>
          Get {selectedPlan.label} / {selectedPlan.price}
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
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
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
    marginBottom: 15,
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
    marginBottom: 20,
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
    marginBottom: 15,
  },
});