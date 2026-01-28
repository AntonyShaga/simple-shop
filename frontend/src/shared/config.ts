export const API_URL = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && API_URL.includes('localhost')) {
  throw new Error('❌ Production build is using localhost API_URL');
}
