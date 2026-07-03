import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_SAVE_KEY = 'scan_nfce:auto_save';

export async function getAutoSavePreference() {
  const raw = await AsyncStorage.getItem(AUTO_SAVE_KEY);
  return raw ? JSON.parse(raw) : false;
}

export async function setAutoSavePreference(value) {
  await AsyncStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(Boolean(value)));
}
