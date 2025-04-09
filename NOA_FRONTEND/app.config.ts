import * as dotenv from "dotenv";
import path from "path";

// โหลด ENV ชุดที่ต้องการตาม APP_ENV
const APP_ENV = process.env.APP_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, `env/.env.${APP_ENV}`) });

export default {
  expo: {
    name: "NOA_FRONTEND",
    slug: "NOA_FRONTEND",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-secure-store"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API: process.env.API_URL,
      appEnv: APP_ENV,
    },
    fonts: {
      "Inter_18pt-Medium": "./assets/fonts/Inter_18pt-Medium.ttf",
      "Koulen-Regular": "./assets/fonts/Koulen-Regular.ttf",
      "LilitaOne-Regular": "./assets/fonts/LilitaOne-Regular.ttf",
    },
  },
};
