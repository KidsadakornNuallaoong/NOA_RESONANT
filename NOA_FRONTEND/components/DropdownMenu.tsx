import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";

// SVG icons
import Settings from "../assets/icons/settings.svg";
import Share from "../assets/icons/bigtop_updates_colorable.svg";
import Graph from "../assets/icons/analytics_colorable.svg";
import Pair from "../assets/icons/cable_colorable.svg";

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelect = (action: string) => {
    setOpen(false);
    switch (action) {
      case "setting":
        router.push("/setting");
        break;
      case "share":
        break;
      case "pair":
        break;
      case "export":
        break;
    }
  };

  const iconMap: Record<string, JSX.Element> = {
    setting: <Settings width={20} height={20} color="#2d2d2d" />,
    share: <Share width={20} height={20} color="#2d2d2d" />,
    pair: <Pair width={20} height={20} color="#2d2d2d" />,
    graph: <Graph width={20} height={20} color="#2d2d2d" />,
    export: <Ionicons name="share-outline" size={20} color="#2d2d2d" />,
  };

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Ionicons name="ellipsis-horizontal" size={20} color="#2d2d2d" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <MenuItem
                  icon={iconMap.setting}
                  label="Setting"
                  onPress={() => handleSelect("setting")}
                />
                <MenuItem
                  icon={iconMap.share}
                  label="Share"
                  onPress={() => handleSelect("share")}
                />
                <MenuItem
                  icon={iconMap.pair}
                  label="Pair"
                  onPress={() => handleSelect("pair")}
                />
                <MenuItem
                  icon={iconMap.graph}
                  label="Graph"
                  onPress={() => handleSelect("graph")}
                />
                <MenuItem
                  icon={iconMap.export}
                  label="Export"
                  onPress={() => handleSelect("export")}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: JSX.Element;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    {icon}
    <Text style={styles.text}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 40,
    paddingRight: 20,
  },
  dropdown: {
    backgroundColor: "#eff2fa",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 115,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 10,
    gap: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: "Koulen",
    color: "#2d2d2d",
  },
});
