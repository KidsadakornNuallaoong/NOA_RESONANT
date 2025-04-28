import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";

type Axis = "x" | "y" | "z";

interface Props {
  selectedAxes: { x: boolean; y: boolean; z: boolean };
  setSelectedAxes: React.Dispatch<
    React.SetStateAction<{ x: boolean; y: boolean; z: boolean }>
  >;
}

const axisColors: Record<Axis, string> = {
  x: "#FF9AA2", // ชมพู
  y: "#9EDFFF", // ฟ้า
  z: "#B5EAD7", // เขียว
};

const AxisSelector = ({ selectedAxes, setSelectedAxes }: Props) => {
  const toggleAxis = (axis: Axis) => {
    setSelectedAxes((prev) => ({ ...prev, [axis]: !prev[axis] }));
  };

  return (
    <View style={styles.container}>
      {(["x", "y", "z"] as Axis[]).map((axis) => (
        <TouchableOpacity
          key={axis}
          style={styles.checkboxWrapper}
          onPress={() => toggleAxis(axis)}
        >
          <Checkbox
            value={selectedAxes[axis]}
            onValueChange={() => toggleAxis(axis)}
            color={selectedAxes[axis] ? axisColors[axis] : undefined}
          />
          <Text style={styles.label}>{axis.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AxisSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  label: {
    marginLeft: 8,
    fontFamily: "Koulen",
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#000",
  },
});
