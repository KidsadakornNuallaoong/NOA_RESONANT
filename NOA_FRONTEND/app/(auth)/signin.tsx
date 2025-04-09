import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import Checkbox from "expo-checkbox";
import {
  clearRememberedEmail,
  clearToken,
  getRememberedEmail,
  saveRememberedEmail,
  saveToken,
} from "@/utils/secureStore";

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

  // Function Login
  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill the information.");
      return;
    }

    setError(""); // Clear any previous error
    setIsLoading(true); // Start loading
    const API = `${process.env.EXPO_PUBLIC_API_URL}/login`;
    console.log("🔍 API:", API);

    // const API = `${API_URL}/login`; // Replace
    // const API = "http://104.214.174.39:8000/login"; // Replace with your API endpoint

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Assuming the token is returned in the response
        console.log("Login successful:", data);

        if (isSelected) {
          await saveRememberedEmail(email);
          await saveToken(token);
        } else {
          await clearRememberedEmail();
          await clearToken();
        }
        // router.replace("/(tabs)"); // Navigate to the main app screen
        router.push("/(tabs)"); // Navigate to the main app screen

        // Navigate to home screen after successful login
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Image */}
        <View style={styles.headerBackground}>
          <Image
            source={require("../../assets/images/NOA.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Noa Resonant</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="key-outline" size={20} style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.inputField}
            secureTextEntry={!showPassword} // Toggle password visibility
            value={password}
            onChangeText={setPassword}
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

        {/* Checkbox */}
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

          {/* Forgot password link */}
          <Link href={"/forgot"} asChild>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Sign In btn */}
        <TouchableOpacity
          style={styles.btn}
          onPress={handleSignIn}
          disabled={isLoading} // Disable the button while loading
        >
          <Text style={styles.btnText}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Seperate view */}
        <View style={styles.seperatorView}>
          <View
            style={{
              flex: 1,
              borderBottomColor: "#000",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={styles.seperator}>OR</Text>
          <View
            style={{
              flex: 1,
              borderBottomColor: "#000",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>

        {/* Social login buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.btnOutline}
            // onPress={() => onSelectAuth(Strategy.Facebook)}
          >
            <Image source={require("../../assets/images/facebook.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnOutline}
            // onPress={() => onSelectAuth(Strategy.Google)}
          >
            <Image source={require("../../assets/images/google 1.png")} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnOutline}
            // onPress={() => onSelectAuth(Strategy.Github)}
          >
            <Image source={require("../../assets/images/github.png")} />
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Don't have an account? </Text>
          <Link href={"/signup"} asChild>
            <TouchableOpacity>
              <Text style={styles.loginSpan}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <Link href={"/pdpa"} asChild>
          <TouchableOpacity>
            <Text style={styles.loginSpan}>Go to homme</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  headerBackground: {
    marginBottom: 60,
    // backgroundColor: "#2d2d2d",
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#A0F5C2",
    marginTop: 20,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#d3d3d3",
    width: "80%",
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
    color: "#888",
  },
  inputField: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  btn: {
    backgroundColor: "#40C375",
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 80,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    // fontFamily: "Koulen",
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
    // fontFamily: "Koulen",
  },
  loginSpan: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
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
    color: "#888",
  },
  seperatorView: {
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    gap: 10,
    marginVertical: 15,
  },
  seperator: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 14,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#888",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#000",
    borderWidth: 1,
    height: 50,
    width: 85,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#fff",
    fontSize: 16,
    paddingLeft: 10,
    // fontFamily: "Koulen",
  },
  socialButtonsContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 20,
  },
});
