import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'scan_nfce:token';
const USER_KEY = 'scan_nfce:user';

async function saveToken(token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

async function readToken() {
  try {
    const secureToken = await SecureStore.getItemAsync(TOKEN_KEY);
    if (secureToken) {
      return secureToken;
    }
  } catch (error) {
    // Fall back to AsyncStorage below.
  }

  return AsyncStorage.getItem(TOKEN_KEY);
}

async function clearToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    // Fall back to AsyncStorage below.
  }

  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function saveSession({ token, user }) {
  await Promise.all([
    saveToken(token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function getSession() {
  const [token, userRaw] = await Promise.all([
    readToken(),
    AsyncStorage.getItem(USER_KEY),
  ]);

  return {
    token,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
}

export async function updateStoredUser(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearSession() {
  await Promise.all([
    clearToken(),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}
