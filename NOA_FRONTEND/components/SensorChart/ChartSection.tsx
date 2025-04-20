import { CartesianChart, Line } from "victory-native";
import React, { useMemo } from "react";

interface Props {
  xData: { x: number; y: number }[];
  yData: { x: number; y: number }[];
  zData: { x: number; y: number }[];
  selectedAxes: { x: boolean; y: boolean; z: boolean };
}

export default function ChartSection({
  xData,
  yData,
  zData,
  selectedAxes,
}: Props) {
  const mergedData = xData.map((d, i) => ({
    x: d.x,
    xVal: d.y,
    yVal: yData[i]?.y ?? 0,
    zVal: zData[i]?.y ?? 0,
  }));

  // ✅ คำนวณ domain แบบ auto
  const { minY, maxY } = useMemo(() => {
    const allY = [
      ...xData.map((d) => d.y),
      ...yData.map((d) => d.y),
      ...zData.map((d) => d.y),
    ];

    if (allY.length === 0) return { minY: -10, maxY: 10 };

    const min = Math.min(...allY);
    const max = Math.max(...allY);

    // เพิ่ม buffer เล็กน้อย
    return {
      minY: Math.floor(min) - 1,
      maxY: Math.ceil(max) + 1,
    };
  }, [xData, yData, zData]);

  return (
    <CartesianChart
      data={mergedData}
      xKey="x"
      yKeys={["xVal", "yVal", "zVal"]}
      domain={{ y: [minY, maxY] }}
    >
      {({ points }) => (
        <>
          {selectedAxes.x && (
            <Line
              points={points.xVal}
              color="#FF9AA2"
              strokeWidth={2}
              animate={{ type: "timing", duration: 300 }}
            />
          )}
          {selectedAxes.y && (
            <Line
              points={points.yVal}
              color="#9EDFFF"
              strokeWidth={2}
              animate={{ type: "timing", duration: 300 }}
            />
          )}
          {selectedAxes.z && (
            <Line
              points={points.zVal}
              color="#B5EAD7"
              strokeWidth={2}
              animate={{ type: "timing", duration: 300 }}
            />
          )}
        </>
      )}
    </CartesianChart>
  );
}
