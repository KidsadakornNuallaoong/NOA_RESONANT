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

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);
  const params = useLocalSearchParams();
  const email = params.email as string;

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

    // const API = `${process.env.EXPO_PUBLIC_API_URL}/verifyotp`; // ✅ เปลี่ยนเป็น API ที่ถูกต้อง
    const API = "http://104.214.174.39:8000/verifyotp"; // ✅ เปลี่ยนเป็น API ที่ถูกต้อง

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, otp: otpCode }), // ✅ ส่งค่า OTP และ Email
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/"); // สำเร็จแล้วไปหน้า /login
      } else {
        Alert.alert("Error", data.message || "Invalid OTP, please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชัน Resend OTP
  const handleResend = async () => {
    setLoading(true);
    const API = `${process.env.API_URL}/sendotp`;
    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email }), // ✅ ส่ง Email กลับไปที่ Backend
      });

      if (response.ok) {
        Alert.alert("Success", "A new OTP has been sent to your email");
        setOtp(["", "", "", ""]);
        inputs.current[0]?.focus(); // กลับไปที่ช่องแรก
      } else {
        const data = await response.json();
        Alert.alert("Error", data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "OTP Verification" }} />
      <View style={styles.container}>
        <View style={styles.centeredContainer}>
          <Image source={require("../../assets/images/email.png")} />
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent an OTP to {email}. Please enter the code below.
          </Text>

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

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't get the code?</Text>
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={[styles.sendSpan, loading && styles.disabledText]}>
                {loading ? "Resending..." : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
