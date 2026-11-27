import Cookies from 'js-cookie';
import { BAKERY_SESSION_ID } from '@/constants/cookies';

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOrCreateSessionId(): string | null {
  if (typeof window === 'undefined') return null;

  let sessionId =
    Cookies.get(BAKERY_SESSION_ID) ||
    window.localStorage.getItem(BAKERY_SESSION_ID);

  if (!sessionId) {
    sessionId = generateUuid();
  }

  Cookies.set(BAKERY_SESSION_ID, sessionId, {
    expires: 30,
    path: '/',
    sameSite: 'Lax',
    secure: window.location.protocol === 'https:',
  });

  try {
    window.localStorage.setItem(BAKERY_SESSION_ID, sessionId);
  } catch {
    // Ignore storage quota errors in private browsing
  }

  return sessionId;
}

