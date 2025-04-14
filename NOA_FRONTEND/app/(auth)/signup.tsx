import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "@/service/authen";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const SignUpScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const checkPasswordStrength = (pass: string): number => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const getStrengthLabel = () => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "#FF4D4D"; // Red
    if (passwordStrength <= 3) return "#FFA500"; // Orange
    return "#28a745"; // Green
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(checkPasswordStrength(text));
  };

  const handleSignUp = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters long");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const data = await registerUser(username, email, password);

      router.push({
        pathname: "/pdpa",
        params: {
          email: data.email,
          username: data.username,
          password: data.password,
        },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Sign Up" }} />
      <View style={styles.container}>
        <View style={styles.headerBackground}>
          <Animated.Image
            entering={FadeInRight.delay(500).duration(300)}
            style={{ width: 145, height: 110, marginTop: 100 }}
            source={require("../../assets/images/NOA.png")}
          />
          <Animated.Text
            entering={FadeInRight.delay(500).duration(300)}
            style={[styles.title, { color: "#fff" }]}
          >
            Create an account
          </Animated.Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Form */}
        <Animated.View entering={FadeInDown.delay(500).duration(300)}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-circle-outline"
              size={20}
              style={styles.icon}
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              style={styles.inputField}
              placeholderTextColor="#666"
            />
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(600).duration(300)}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={styles.inputField}
              placeholderTextColor="#666"
            />
          </View>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(700).duration(300)}>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} style={styles.icon} />
            <TextInput
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Password"
              style={styles.inputField}
              secureTextEntry={!showPassword}
              placeholderTextColor="#666"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* Strength Meter */}
        {password.length > 0 && (
          <>
            <View style={styles.strengthBarContainer}>
              <View
                style={[
                  styles.strengthBar,
                  {
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getStrengthColor(),
                  },
                ]}
              />
            </View>
            <Text style={[styles.passwordHint, { color: getStrengthColor() }]}>
              {getStrengthLabel() === "Weak"
                ? "Please use a more complex password"
                : `Password strength: ${getStrengthLabel()}`}
            </Text>
          </>
        )}
        <Animated.View entering={FadeInDown.delay(800).duration(300)}>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} style={styles.icon} />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              style={styles.inputField}
              secureTextEntry={!showConfirm}
              placeholderTextColor="#666"
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View entering={FadeInDown.delay(900).duration(300)}>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Login Link */}
        <Animated.View entering={FadeInDown.delay(1000).duration(300)}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/">
              <Text style={styles.loginSpan}>Sign In</Text>
            </Link>
          </View>
        </Animated.View>
      </View>
    </>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 33,
    marginBottom: 75,
  },
  headerBackground: {
    backgroundColor: "#2d2d2d",
    width: "100%",
    height: 300,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    overflow: "hidden",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#000",
    width: 320,
    marginBottom: 20,
    paddingBottom: 1,
  },
  icon: {
    marginRight: 10,
    color: "gray",
  },
  inputField: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  strengthBarContainer: {
    width: "80%",
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginTop: -10,
    marginBottom: 5,
  },
  strengthBar: {
    height: "100%",
    borderRadius: 5,
  },
  passwordHint: {
    width: "80%",
    fontSize: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#000",
    width: 190,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 78,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  loginText: {
    fontSize: 14,
    color: "#000",
  },
  loginSpan: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
