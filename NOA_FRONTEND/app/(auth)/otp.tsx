import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Stack, useLocalSearchParams, router, Link } from "expo-router";
import { sendOtp, verifyOtp } from "@/service/authen";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { email, username, password } = useLocalSearchParams();
  const emailString = Array.isArray(email) ? email[0] : email;
  const usernameString = Array.isArray(username) ? username[0] : username;
  const passwordString = Array.isArray(password) ? password[0] : password;

  // ✅ เช็คถ้าไม่มี email ให้กลับไปหน้า /signup
  useEffect(() => {
    if (!email) {
      Alert.alert("Error", "Email not found. Please sign up again.");
      router.push("/signup");
    }
  }, [email]);

  // ✅ ฟังก์ชันสำหรับเปลี่ยน OTP ทีละหลัก
  const handleOtpChange = (text: string, index: number) => {
    if (text && !/^\d+$/.test(text)) return; // ป้องกันการป้อนตัวอักษร

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      inputs.current[index + 1]?.focus(); // ข้ามไปช่องถัดไป
    }
  };

  // ✅ ฟังก์ชันสำหรับลบย้อนกลับ
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // ✅ ฟังก์ชันตรวจสอบ OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 4) {
      Alert.alert("Error", "Please enter the complete 4-digit code");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(usernameString, emailString, passwordString, otpCode);
      router.replace("/"); // ✅ ไปหน้า Login/Home
    } catch (err: any) {
      Alert.alert("Error", err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชัน Resend OTP
  const handleResend = async () => {
    setLoading(true);
    try {
      await sendOtp(emailString); // เปลี่ยนเป็น POST
      Alert.alert("Success", "A new OTP has been sent to your email");
      setOtp(["", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Resending failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "OTP Verification" }} />
      <View style={styles.container}>
        <View style={styles.centeredContainer}>
          <Animated.Image
            entering={FadeInRight.delay(500).duration(300)}
            source={require("../../assets/images/email.png")}
          />
          <Animated.Text
            entering={FadeInRight.delay(500).duration(300)}
            style={styles.title}
          >
            Check Your Email
          </Animated.Text>
          <Animated.Text
            entering={FadeInRight.delay(500).duration(300)}
            style={styles.subtitle}
          >
            We've sent an OTP to {email}. Please enter the code below.
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(600).duration(300)}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.input}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(700).duration(300)}>
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't get the code?</Text>
              <TouchableOpacity onPress={handleResend} disabled={loading}>
                <Text style={[styles.sendSpan, loading && styles.disabledText]}>
                  {loading ? "Resending..." : "Resend code"}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(800).duration(300)}>
          <View style={styles.otp}>
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleVerify}
              disabled={loading}
            >
              <Text style={styles.btnText}>
                {loading ? "Verifying..." : "Verify Now"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 100,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "80%",
  },
  input: {
    height: 40,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    textAlign: "center",
    width: "20%",
    fontSize: 18,
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  resendText: {
    fontSize: 16,
  },
  sendSpan: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 5,
  },
  disabledText: {
    color: "#aaa",
  },
  otp: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#000",
    width: 190,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 57,
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: "#666",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
