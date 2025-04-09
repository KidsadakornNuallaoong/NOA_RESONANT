import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum distinctio
        odit illum quod suscipit labore quis ipsam et tempora ratione veritatis
        laborum aut illo iste, eveniet sapiente! Aliquid, laudantium doloribus?
      </Text>
      <Text>abc</Text>
      {/* Hello */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
