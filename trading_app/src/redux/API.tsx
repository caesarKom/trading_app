import { Platform } from 'react-native';

export const BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.0.7:8000'
    : 'http://localhost:8000';

export const SOCKET_URL =
  Platform.OS === 'android'
    ? 'http://192.168.0.7:4000'
    : 'http://localhost:4000';
    
export const TRADINGVIEW_WEB_URL =
  Platform.OS === 'android'
    ? 'http://192.168.0.7:8001'
    : 'http://localhost:8001';

export const CHECK_EMAIL = `${BASE_URL}/auth/check-email`;
export const EMAIL_LOGIN = `${BASE_URL}/auth/login`;
export const REFRESH_TOKEN = `${BASE_URL}/auth/refresh-token`;
export const VERIFY_OTP = `${BASE_URL}/auth/verify-otp`;
export const SEND_OTP = `${BASE_URL}/auth/send-otp`;
export const REGISTER = `${BASE_URL}/auth/register`;
export const OAUTH = `${BASE_URL}/auth/oauth`;
export const USER_PROFILE = `${BASE_URL}/user/profile`;
