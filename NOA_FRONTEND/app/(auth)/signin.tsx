import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import {
  clearRememberedEmail,
  clearToken,
  getRememberedEmail,
  saveRememberedEmail,
  saveToken,
} from "@/utils/secureStore";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userID: string;
  message: string;
}

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadRememberedData = async () => {
      const savedEmail = await getRememberedEmail();
      if (savedEmail) {
        setEmail(savedEmail);
        setIsSelected(true);
      }
    };
    loadRememberedData();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill the information.");
      return;
    }

    setError("");
    setIsLoading(true);
    const API = `${process.env.EXPO_PUBLIC_API_URL}/login`;

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        await saveToken(token);

        // ✅ Decode to extract userID
        const decoded: DecodedToken = jwtDecode(token);
        const userID = decoded.userID;

        if (isSelected) {
          await saveRememberedEmail(email);
        }
        await saveToken(token); // เก็บ token เสมอหลัง login

        router.push("/(tabs)/device");
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.headerBackground}>
          <Animated.Image
            entering={FadeInRight.delay(500).duration(300)}
            source={require("../../assets/images/NOA.png")}
            style={styles.logo}
          />
          <Animated.Text
            style={styles.title}
            entering={FadeInRight.delay(500).duration(300)}
          >
            Noa Resonant
          </Animated.Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Animated.View entering={FadeInDown.delay(500).duration(300)}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#ccc"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(300)}>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} style={styles.icon} />
            <TextInput
              placeholder="Password"
              style={styles.inputField}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#ccc"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(300)}>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxWrapper}>
              <Checkbox
                value={isSelected}
                onValueChange={setIsSelected}
                color={isSelected ? "#40C375" : undefined}
                style={{ width: 20, height: 20, borderWidth: 2 }}
              />
              <Text style={styles.checkboxText}>Remember me</Text>
            </View>
            <Link href="/forgot" asChild>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700).duration(300)}>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.btnText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(800).duration(300)}>
          <View style={styles.seperatorView}>
            <View style={styles.seperatorLine} />
            <Text style={styles.seperator}>or</Text>
            <View style={styles.seperatorLine} />
          </View>
        </Animated.View>

        <View style={styles.socialButtonsContainer}>
          <Animated.View entering={FadeInDown.delay(900).duration(300)}>
            <TouchableOpacity style={styles.btnOutline}>
              <Image source={require("../../assets/images/facebook.png")} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(1000).duration(300)}>
            <TouchableOpacity style={styles.btnOutline}>
              <Image source={require("../../assets/images/google 1.png")} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(1100).duration(300)}>
            <TouchableOpacity style={styles.btnOutline}>
              <Image source={require("../../assets/images/github (1).png")} />
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(1200).duration(300)}>
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Don't have an account? </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.loginSpan}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <Link href="/(tabs)/device" asChild>
            <TouchableOpacity>
              <Text style={styles.loginSpan}>Go through Home</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </View>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d2d2d",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBackground: {
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#A0F5C2",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    width: "80%",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
    color: "#fff",
  },
  inputField: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  btn: {
    backgroundColor: "#40C375",
    width: 300,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  seperatorView: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    marginVertical: 20,
  },
  seperator: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 14,
    marginHorizontal: 8,
  },
  seperatorLine: {
    flex: 1,
    borderBottomColor: "#555",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  socialButtonsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 20,
  },
  btnOutline: {
    backgroundColor: "#fff",
    height: 50,
    width: 85,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
  },
  loginSpan: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
  },
});
