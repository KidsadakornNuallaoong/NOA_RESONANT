import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { sendOtp } from "@/service/authen";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function PdpaScreen() {
  const router = useRouter();
  const { email, username, password } = useLocalSearchParams();
  const emailString = Array.isArray(email) ? email[0] : email;
  const usernameString = Array.isArray(username) ? username[0] : username;
  const passwordString = Array.isArray(password) ? password[0] : password;

  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!consentGiven || !email) return;

    setLoading(true);
    try {
      await sendOtp(emailString); // เรียกแบบ POST
      router.replace({
        pathname: "/otp",
        params: { email, username, password },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "PDPA Consent" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View entering={FadeInDown.delay(500).duration(300)}>
          <View style={styles.card}>
            <Text style={styles.paragraph}>
              1.
              วัตถุประสงค์ของการเก็บข้อมูลแอปพลิเคชันนี้เก็บรวบรวมข้อมูลเพื่อใช้ในการวิเคราะห์แรงสั่นสะเทือนของมอเตอร์
              โดยข้อมูลที่เก็บจะถูกใช้เพื่อพัฒนาประสิทธิภาพของระบบ
              และการวิจัยเท่านั้น
              {"\n\n"}
              2. ประเภทของข้อมูลที่เก็บรวบรวม
              ข้อมูลเซนเซอร์เกี่ยวกับแรงสั่นสะเทือน ข้อมูลอุปกรณ์ เช่น
              รุ่นของอุปกรณ์ ระบบปฏิบัติการ ข้อมูลที่ผู้ใช้งานให้โดยสมัครใจ เช่น
              รายละเอียดการทดลอง
              {"\n\n"}
              3.การใช้งานและการเปิดเผยข้อมูลข้อมูลที่เก็บรวบรวมจะถูกใช้เฉพาะเพื่อวัตถุประสงค์ของการวิจัยและพัฒนาแอปเท่านั้น
              โดยไม่มีการเปิดเผยต่อบุคคลภายนอก
              เว้นแต่ได้รับความยินยอมจากผู้ใช้หรือเป็นไปตามข้อกำหนดทางกฎหมาย
              {"\n\n"}
              4.สิทธิของผู้ใช้ผู้ใช้มีสิทธิ์ในการ ขอเข้าถึง แก้ไข
              หรือขอลบข้อมูลของตนเอง เพิกถอนความยินยอมในการเก็บข้อมูลได้ทุกเมื่อ
              ร้องเรียนหากมีการใช้ข้อมูลผิดวัตถุประสงค์
              {"\n\n"}
              5.ระยะเวลาการเก็บรักษาข้อมูลข้อมูลจะถูกเก็บไว้เฉพาะระยะเวลาที่จำเป็นต่อการดำเนินการวิจัยเท่านั้น
              และจะถูกลบอย่างปลอดภัยเมื่อสิ้นสุดการใช้งาน
              {"\n\n"}
              6.การรักษาความปลอดภัยของข้อมูลเราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกัน
            </Text>
          </View>
        </Animated.View>

        <View style={styles.checkContainer}>
          <Animated.View entering={FadeInDown.delay(500).duration(300)}>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setConsentGiven(true)}
            >
              <Ionicons
                name={consentGiven ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={consentGiven ? "green" : "gray"}
              />
              <Animated.Text
                entering={FadeInDown.delay(500).duration(300)}
                style={styles.checkText}
              >
                I accept the privacy policy and consent to the collection.
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(500).duration(300)}>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setConsentGiven(false)}
            >
              <Ionicons
                name={!consentGiven ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={!consentGiven ? "green" : "gray"}
              />
              <Animated.Text
                entering={FadeInDown.delay(500).duration(300)}
                style={styles.checkText}
              >
                I do not consent to the collection or use of my personal data.
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(300)}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              { backgroundColor: consentGiven ? "#40C375" : "#ccc" },
            ]}
            onPress={handleConfirm}
            disabled={!consentGiven || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#f4f4f4",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 14,
    color: "#333",
    lineHeight: 22,
  },
  checkContainer: {
    width: "100%",
    marginBottom: 30,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  checkText: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    color: "#333",
  },
  confirmButton: {
    width: 315,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
