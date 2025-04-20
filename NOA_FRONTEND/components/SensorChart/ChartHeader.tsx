import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  chartType: "line" | "scatter";
  setChartType: (type: "line" | "scatter") => void;
}

const ChartHeader = ({ title, chartType, setChartType }: Props) => {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>
        {title}: {chartType.toUpperCase()} PLOT
      </Text>
    </View>
  );
};

export default ChartHeader;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
  },
});
