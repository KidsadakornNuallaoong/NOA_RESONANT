import * as SecureStore from "expo-secure-store";

// Email
export async function saveRememberedEmail(email: string) {
  await SecureStore.setItemAsync("rememberedEmail", email);
}
export async function getRememberedEmail() {
  return await SecureStore.getItemAsync("rememberedEmail");
}
export async function clearRememberedEmail() {
  await SecureStore.deleteItemAsync("rememberedEmail");
}

// 🔐 Token
export async function saveToken(token: string) {
  await SecureStore.setItemAsync("userToken", token);
}
export async function getToken() {
  return await SecureStore.getItemAsync("userToken");
}
export async function clearToken() {
  await SecureStore.deleteItemAsync("userToken");
}
export async function clearAllSecureStore() {
  await SecureStore.deleteItemAsync("userToken");
  await SecureStore.deleteItemAsync("rememberedEmail");
}
export async function getAllSecureStore() {
  const token = await getToken();
  const email = await getRememberedEmail();
  return { token, email };
}
