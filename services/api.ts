import { AppConfig, hasBackend } from '@/constants/config';

export type AuthUser = {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  isDemo?: boolean;
};

export type SignInPayload = { email: string; password: string };
export type SignUpPayload = {
  email: string;
  password: string;
  fullName?: string;
  companyName?: string;
};
export type RequestAccessPayload = {
  fullName: string;
  email: string;
  companyName: string;
  role?: string;
  message?: string;
};

export class ApiError extends Error {}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = `${AppConfig.apiBaseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(text || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

async function deleteRequest(path: string): Promise<void> {
  const url = `${AppConfig.apiBaseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(text || `Request failed (${res.status})`);
  }
}

function makeUser(partial: Partial<AuthUser> & { email: string }): AuthUser {
  return {
    id: partial.id ?? `local-${Date.now()}`,
    email: partial.email,
    fullName: partial.fullName,
    companyName: partial.companyName,
    isDemo: partial.isDemo,
  };
}

/**
 * NOTE: The backend is not connected yet (AppConfig.apiBaseUrl is empty).
 * When `hasBackend` is true the calls below hit the real API. Until then they
 * fall back to a local session so the app is fully explorable for any user
 * and for App Review. Replace the fallbacks once the backend is live.
 */
export const Api = {
  async signIn(payload: SignInPayload): Promise<AuthUser> {
    if (hasBackend) {
      // TODO(backend): wire to POST /auth/login -> { user, token }
      const data = await postJson<{ user: AuthUser }>('/auth/login', payload);
      return data.user;
    }

    if (
      payload.email.trim().toLowerCase() === AppConfig.demo.email.toLowerCase() &&
      payload.password === AppConfig.demo.password
    ) {
      return makeUser({ email: AppConfig.demo.email, fullName: 'Demo Driver', isDemo: true });
    }

    // Local placeholder until the backend validates credentials.
    return makeUser({ email: payload.email.trim() });
  },

  async signInDemo(): Promise<AuthUser> {
    return this.signIn({ email: AppConfig.demo.email, password: AppConfig.demo.password });
  },

  async signUp(payload: SignUpPayload): Promise<AuthUser> {
    if (hasBackend) {
      // TODO(backend): wire to POST /auth/register -> { user, token }
      const data = await postJson<{ user: AuthUser }>('/auth/register', payload);
      return data.user;
    }

    // Local placeholder account creation until the backend is connected.
    return makeUser({
      email: payload.email.trim(),
      fullName: payload.fullName,
      companyName: payload.companyName,
    });
  },

  async requestAccess(payload: RequestAccessPayload): Promise<void> {
    if (hasBackend) {
      // TODO(backend): wire to POST /access-requests
      await postJson<void>('/access-requests', payload);
      return;
    }

    // No backend yet: the UI falls back to an email/contact link and informs
    // the user clearly. Nothing to persist here.
    return;
  },

  /**
   * Permanently deletes the signed-in user's account.
   * Uses the existing DELETE /Users/{id} endpoint when the backend is connected.
   * The id MUST be the real logged-in user's id (never hardcoded).
   */
  async deleteUser(userId: string | number): Promise<void> {
    if (hasBackend) {
      await deleteRequest(`/Users/${userId}`);
      return;
    }

    // No backend yet: succeed locally so the demo/local session can be removed.
    return;
  },
};
