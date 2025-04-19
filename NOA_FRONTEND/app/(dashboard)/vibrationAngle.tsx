import { StyleSheet, Text, View } from "react-native";
import React, { useMemo } from "react";
import { PaperProvider } from "react-native-paper";

const VibrationAngleScreen = () => {
  return (
    <PaperProvider>
      <View style={styles.container}></View>
    </PaperProvider>
  );
};

export default VibrationAngleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
