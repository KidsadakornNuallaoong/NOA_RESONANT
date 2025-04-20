import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

interface Row {
  x: number;
  y: number;
  z: number;
}

interface Props {
  title: string;
  unitLabel: string;
  data: Row[];
}

const SensorDataTable = ({ title, unitLabel, data }: Props) => {
  const renderRow = ({ item }: { item: Row }) => (
    <View style={styles.row}>
      <Text style={styles.value}>{item.x.toFixed(2)}</Text>
      <Text style={styles.value}>{item.y.toFixed(2)}</Text>
      <Text style={styles.value}>{item.z.toFixed(2)}</Text>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>
          ⚙️{title} {unitLabel}
        </Text>
        <View style={styles.colLabels}>
          <Text style={styles.col}>X</Text>
          <Text style={styles.col}>Y</Text>
          <Text style={styles.col}>Z</Text>
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderRow}
      />
    </>
  );
};

export default SensorDataTable;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 5,
  },
  headerLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  colLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 5,
  },
  col: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f2f4fa",
    paddingVertical: 12,
    marginBottom: 30,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
