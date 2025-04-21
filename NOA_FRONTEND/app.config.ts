import * as dotenv from "dotenv";
import path from "path";

// โหลด ENV ชุดที่ต้องการตาม APP_ENV
dotenv.config({ path: path.resolve(__dirname, `env/.env.development`) });

export default {
  expo: {
    name: "NOA_FRONTEND",
    slug: "NOA_FRONTEND",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/NOA_LOGO.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/NOA_LOGO.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/NOA_LOGO.png",
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
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      websocketUrl: process.env.EXPO_PUBLIC_WEBSOCKET_URL,
      notiSocketUrl: process.env.EXPO_PUBLIC_NOTI_WEBSOCKET_URL,
    },
    fonts: {
      "Inter_18pt-Medium": "./assets/fonts/Inter_18pt-Medium.ttf",
      "Koulen-Regular": "./assets/fonts/Koulen-Regular.ttf",
      "LilitaOne-Regular": "./assets/fonts/LilitaOne-Regular.ttf",
      "GemunuLibre-VariableFont_wght":
        "./assets/fonts/GemunuLibre-VariableFont_wght.ttf",
      "GemunuLibre-Bold": "./assets/fonts/GemunuLibre-Bold.ttf",
    },
  },
};
