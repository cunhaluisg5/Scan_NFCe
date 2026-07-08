import { API_BASE_URL, API_BASE_URLS, API_TIMEOUT_MS } from '../config/api';
import { clearSession, getSession } from '../storage/session';

let authFailureHandler = null;
let authFailureInFlight = false;
let workingBaseUrl = API_BASE_URL;

function buildError(message, extras = {}) {
  const error = new Error(message);
  Object.assign(error, extras);
  return error;
}

function parseResponseBody(text, response) {
  if (!text) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const expectsJson = contentType.includes('application/json');

  if (!expectsJson) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw buildError('A resposta da API veio em um formato inválido.', {
      code: 'INVALID_JSON',
      cause: error,
    });
  }
}

async function notifyAuthFailure(error) {
  if (authFailureInFlight) {
    return;
  }

  authFailureInFlight = true;

  try {
    await clearSession();

    if (typeof authFailureHandler === 'function') {
      await authFailureHandler(error);
    }
  } finally {
    authFailureInFlight = false;
  }
}

async function performFetch(baseUrl, path, session, { method, body, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = parseResponseBody(text, response);

    return { response, data };
  } finally {
    clearTimeout(timer);
  }
}

function getCandidateBaseUrls() {
  const urls = [];
  const pushUrl = (value) => {
    if (value && !urls.includes(value)) {
      urls.push(value);
    }
  };

  pushUrl(workingBaseUrl);
  API_BASE_URLS.forEach(pushUrl);
  return urls;
}

async function request(path, { method = 'GET', body, auth = true, timeoutMs = API_TIMEOUT_MS } = {}) {
  const session = auth ? await getSession() : { token: null };

  if (auth && !session.token) {
    const error = buildError('Sua sessão expirou. Entre novamente para continuar.', {
      status: 401,
      code: 'AUTH_REQUIRED',
    });
    await notifyAuthFailure(error);
    throw error;
  }

  const baseUrls = getCandidateBaseUrls();
  const errors = [];

  for (const baseUrl of baseUrls) {
    try {
      const { response, data } = await performFetch(baseUrl, path, session, { method, body, timeoutMs });
      workingBaseUrl = baseUrl;

      if (!response.ok) {
        const error = buildError(
        (data && typeof data === 'object' && data.error) || 'Não foi possível concluir a requisição.',
          {
            status: response.status,
            data,
            code: response.status === 401 || response.status === 403 ? 'AUTH_EXPIRED' : 'REQUEST_FAILED',
            baseUrl,
          }
        );

        if (auth && (response.status === 401 || response.status === 403)) {
          await notifyAuthFailure(error);
        }

        throw error;
      }

      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
      throw buildError('A requisição demorou mais que o esperado. Tente novamente.', {
          status: 408,
          code: 'TIMEOUT',
          baseUrl,
        });
      }

      if (error instanceof TypeError) {
        errors.push({ baseUrl, error });
        continue;
      }

      throw error;
    }
  }

  throw buildError('Não foi possível se conectar ao servidor.', {
    status: 0,
    code: 'NETWORK_ERROR',
    baseUrlsTried: errors.map((entry) => entry.baseUrl),
  });
}

export function setAuthFailureHandler(handler) {
  authFailureHandler = handler;
}

export function getWorkingApiBaseUrl() {
  return workingBaseUrl;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export default api;
