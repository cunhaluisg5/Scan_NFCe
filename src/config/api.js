import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

const API_PORT = '3000';
const API_PROTOCOL = 'http';
const MANUAL_API_URL = process.env.EXPO_PUBLIC_API_URL || '';
const MANUAL_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS || '15000');

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function resolveExpoHost() {
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

  return '';
}

function resolveScriptHost() {
  const scriptURL = NativeModules.SourceCode?.scriptURL;

  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^/:]+)/);
    if (match?.[1]) {
      return match[1];
    }
  }

  return '';
}

function resolveFallbackHosts() {
  if (Platform.OS === 'android') {
    return ['10.0.2.2', '10.0.3.2', 'localhost', '127.0.0.1'];
  }

  return ['localhost', '127.0.0.1'];
}

function buildBaseUrls() {
  const urls = [];
  const pushUrl = (value) => {
    const normalized = normalizeBaseUrl(value);
    if (normalized && !urls.includes(normalized)) {
      urls.push(normalized);
    }
  };

  pushUrl(MANUAL_API_URL);

  const expoHost = resolveExpoHost();
  if (expoHost) {
    pushUrl(`${API_PROTOCOL}://${expoHost}:${API_PORT}`);
  }

  const scriptHost = resolveScriptHost();
  if (scriptHost) {
    pushUrl(`${API_PROTOCOL}://${scriptHost}:${API_PORT}`);
  }

  resolveFallbackHosts().forEach((host) => {
    pushUrl(`${API_PROTOCOL}://${host}:${API_PORT}`);
  });

  return urls;
}

export const API_BASE_URLS = buildBaseUrls();
export const API_BASE_URL = API_BASE_URLS[0];
export const API_TIMEOUT_MS = Number.isFinite(MANUAL_TIMEOUT_MS) ? MANUAL_TIMEOUT_MS : 15000;
