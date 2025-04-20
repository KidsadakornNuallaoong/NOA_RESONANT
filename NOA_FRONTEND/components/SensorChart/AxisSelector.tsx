import React from "react";
import { View, StyleSheet } from "react-native";
import { CheckBox } from "@rneui/themed";

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
        <CheckBox
          key={axis}
          title={axis.toUpperCase()}
          checked={selectedAxes[axis]}
          onPress={() => toggleAxis(axis)}
          size={30}
          checkedColor={axisColors[axis]} // ✅ สีตามแกน
          containerStyle={styles.checkbox}
          textStyle={{
            fontWeight: "bold",
            fontSize: 20,
            color: axisColors[axis], // ✅ ให้ตัวอักษรมีสีเดียวกันด้วย
          }}
        />
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
  checkbox: {
    backgroundColor: "#fff",
    borderWidth: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 0,
  },
});
