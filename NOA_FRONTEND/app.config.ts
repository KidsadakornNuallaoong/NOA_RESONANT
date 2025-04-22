import * as dotenv from "dotenv";
import path from "path";

// โหลด ENV ชุดที่ต้องการตาม APP_ENV
dotenv.config({ path: path.resolve(__dirname, `env/.env.development`) });

export default {
  expo: {
    name: "NOA_FRONTEND",
    slug: "NOA_FRONTEND",
    version: "1.0.0",
    SDKVersion: "48.0.0",
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
      
      usesCleartextTraffic: true,
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
      eas: {
        projectId: ""
      }
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
