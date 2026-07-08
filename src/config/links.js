function normalizeUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

export const HELP_CENTER_URL = normalizeUrl(process.env.EXPO_PUBLIC_HELP_URL);
export const HAS_HELP_CENTER_URL = Boolean(HELP_CENTER_URL);
