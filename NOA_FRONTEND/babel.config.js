module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@app": "./app",
            "@components": "./components",
            "@constants": "./constants",
            "@utils": "./utils",
            "@provider": "./provider",
            "@assets": "./assets",
          },
        },
      ],
      "react-native-reanimated/plugin", // ถ้าใช้ Reanimated
    ],
  };
};
