import { NativeModules, Platform } from 'react-native';

function getDevServerHost() {
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  const match = scriptURL?.match(/^https?:\/\/([^:/]+)/);
  const host = match?.[1];

  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  return host;
}

const devServerHost = getDevServerHost();
const REQUEST_TIMEOUT_MS = 8000;

function uniq(values) {
  return values.filter((value, index) => value && values.indexOf(value) === index);
}

function getApiBaseUrls() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return [process.env.EXPO_PUBLIC_API_URL];
  }

  return uniq([
    Platform.OS === 'android' ? 'http://10.0.2.2:3000' : null,
    devServerHost ? `http://${devServerHost}:3000` : null,
    'http://localhost:3000',
  ]);
}

export const API_BASE_URL = getApiBaseUrls()[0];

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function request(path, options = {}) {
  let response;
  let lastError;
  const apiBaseUrls = getApiBaseUrls();

  const requestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
  };

  delete requestOptions.token;

  for (const baseUrl of apiBaseUrls) {
    try {
      response = await fetchWithTimeout(`${baseUrl}${path}`, requestOptions);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!response) {
    const triedUrls = apiBaseUrls.join(', ');
    const timedOut = lastError?.name === 'AbortError';
    throw new Error(
      timedOut
        ? `Timeout verso il backend (${triedUrls}). Controlla che il server sia avviato.`
        : `Server non raggiungibile (${triedUrls}). Avvia il backend e riprova.`
    );
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || 'Errore di comunicazione con il server';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data;
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function getUserData(token) {
  return request('/me/data', {
    method: 'GET',
    token,
  });
}

export function saveUserData(token, data) {
  return request('/me/data', {
    method: 'PUT',
    token,
    body: JSON.stringify(data),
  });
}

export function updateProfile(token, profile) {
  return request('/me/profile', {
    method: 'PATCH',
    token,
    body: JSON.stringify(profile),
  });
}
