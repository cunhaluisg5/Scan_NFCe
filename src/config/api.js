import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

const API_PORT = '3000';
const API_PROTOCOL = 'http';
const MANUAL_API_URL = process.env.EXPO_PUBLIC_API_URL || '';
const MANUAL_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS || '15000');

function resolveHost() {
  const expoHostUri =
    Constants.expoConfig?.hostUri ||
    Constants.platform?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (expoHostUri) {
    const [host] = expoHostUri.split(':');
    if (host) {
      return host;
    }
  }

  const scriptURL = NativeModules.SourceCode?.scriptURL;

  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^/:]+)/);
    if (match?.[1]) {
      return match[1];
    }
  }

  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

export const API_BASE_URL = MANUAL_API_URL || `${API_PROTOCOL}://${resolveHost()}:${API_PORT}`;
export const API_TIMEOUT_MS = Number.isFinite(MANUAL_TIMEOUT_MS) ? MANUAL_TIMEOUT_MS : 15000;
