import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { PaperProvider } from "react-native-paper";

// === Component ===
const AccelerationScreen = () => {
  return (
    <PaperProvider>
      <View style={styles.container}>
      </View>
    </PaperProvider>
  );
};

export default AccelerationScreen;

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
