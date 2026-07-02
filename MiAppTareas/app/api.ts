import { create } from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_HOST = '127.0.0.1';
const LOCAL_NETWORK_IP = '172.31.0.180';

const getConfiguredHost = () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.location.hostname) {
      return window.location.hostname;
    }
    return DEFAULT_HOST;
  }
  
  if (Platform.OS === 'android') {
    const manifest = (Constants as any).manifest;
    const expoConfig = (Constants as any).expoConfig;
    return expoConfig?.extra?.API_HOST || manifest?.extra?.API_HOST || LOCAL_NETWORK_IP;
  }
  
  return process.env.EXPO_PUBLIC_API_HOST || LOCAL_NETWORK_IP;
};

const API_HOST = getConfiguredHost();
const API_BASE_URL = `http://${API_HOST}:8000/api`;

const api = create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;