import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      {/* หน้า signin */}
      <Stack.Screen
        name="signin"
        options={{
          headerShown: false, // ไม่โชว์ header เพื่อให้ดีไซน์แบบ custom ได้เต็มที่
        }}
      />

      {/* หน้า signup */}
      <Stack.Screen
        name="signup"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />

      {/* หน้า forgot password */}
      <Stack.Screen
        name="forgot"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />

      {/* หน้า otp */}
      <Stack.Screen
        name="otp"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />

      {/* หน้า pdpa */}
      <Stack.Screen
        name="pdpa"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
