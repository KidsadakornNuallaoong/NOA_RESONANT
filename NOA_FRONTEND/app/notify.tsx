import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

const NotificationScreen = () => {
  return (
    <View>
      <Link href={"/(tabs)/device"} asChild>
        <Text>Go back</Text>
      </Link>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({});
