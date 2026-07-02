import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { StoredUser } from '../types/usuario';

const isWeb = Platform.OS === 'web';
const localStorageAvailable = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const memoryStorage: Record<string, string> = {};

const safeLocalStorage = () => {
  if (localStorageAvailable) {
    return window.localStorage;
  }
  return null;
};

export async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    try {
      return safeLocalStorage()?.getItem(key) ?? null;
    } catch (error) {
      console.warn(`localStorage.getItem failed for ${key}:`, error);
      return null;
    }
  }

  try {
    if (SecureStore && typeof SecureStore.getItemAsync === 'function') {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.warn(`SecureStore.getItemAsync failed for ${key}:`, error);
  }

  if (localStorageAvailable) {
    try {
      return safeLocalStorage()?.getItem(key) ?? null;
    } catch (error) {
      console.warn(`Fallback localStorage.getItem failed for ${key}:`, error);
    }
  }

  return memoryStorage[key] ?? null;
}

export async function getStoredUser(): Promise<StoredUser | null> {
  try {
    const raw = await getItem('userData');
    if (!raw) return null;
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    try {
      safeLocalStorage()?.setItem(key, value);
      return;
    } catch (error) {
      console.warn(`localStorage.setItem failed for ${key}:`, error);
    }
  }

  try {
    if (SecureStore && typeof SecureStore.setItemAsync === 'function') {
      await SecureStore.setItemAsync(key, value);
      return;
    }
  } catch (error) {
    console.warn(`SecureStore.setItemAsync failed for ${key}:`, error);
  }

  if (localStorageAvailable) {
    try {
      safeLocalStorage()?.setItem(key, value);
      return;
    } catch (error) {
      console.warn(`Fallback localStorage.setItem failed for ${key}:`, error);
    }
  }

  memoryStorage[key] = value;
}

export async function removeItem(key: string): Promise<void> {
  if (isWeb) {
    try {
      safeLocalStorage()?.removeItem(key);
      return;
    } catch (error) {
      console.warn(`localStorage.removeItem failed for ${key}:`, error);
    }
  }

  try {
    if (SecureStore && typeof SecureStore.deleteItemAsync === 'function') {
      await SecureStore.deleteItemAsync(key);
      return;
    }
  } catch (error) {
    console.warn(`SecureStore.deleteItemAsync failed for ${key}:`, error);
  }

  if (localStorageAvailable) {
    try {
      safeLocalStorage()?.removeItem(key);
      return;
    } catch (error) {
      console.warn(`Fallback localStorage.removeItem failed for ${key}:`, error);
    }
  }

  delete memoryStorage[key];
}
