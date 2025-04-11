import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type IconProps = { color: string; size?: number };

// ไอคอนแต่ละตัว
const DeviceIcon = ({ color, size = 24 }: IconProps) => (
  <MaterialCommunityIcons name="access-point" size={size} color={color} />
);

const HistoryIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="time-outline" size={size} color={color} />
);

const LocationIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="location-outline" size={size} color={color} />
);

const SettingIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="settings-outline" size={size} color={color} />
);

const BookmarkIcon = ({ color, size = 24 }: IconProps) => (
  <Ionicons name="bookmark-outline" size={size} color={color} />
);

// Export object ที่แมปกับ route name
export const icon: Record<
  "device" | "history" | "location" | "setting" | "bookmark",
  (props: IconProps) => JSX.Element
> = {
  device: DeviceIcon,
  history: HistoryIcon,
  location: LocationIcon,
  setting: SettingIcon,
  bookmark: BookmarkIcon,
};
