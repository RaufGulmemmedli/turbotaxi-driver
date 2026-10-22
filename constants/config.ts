import Constants from 'expo-constants';

/**
 * Central, environment-driven configuration for TurboTaxi.
 *
 * Values are resolved (in order) from:
 *   1. EXPO_PUBLIC_* environment variables (see .env.example)
 *   2. the `extra` block in app.json
 *   3. safe public defaults
 *
 * No secrets are hardcoded here. The demo credentials below are intentionally
 * non-sensitive review credentials, overridable via env/app.json.
 */

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

function readBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value !== 'false' && value !== '0';
}

export const AppConfig = {
  appName: 'TurboTaxi',
  tagline: 'A platform for taxi, fleet, driver, and transport service management.',
  website: process.env.EXPO_PUBLIC_WEBSITE ?? extra.website ?? 'https://turbotaxi.app',

  /** Base URL for the backend API. Empty string => backend not yet connected. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? extra.apiBaseUrl ?? '',

  supportEmail: process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? extra.supportEmail ?? 'support@turbotaxi.app',
  salesEmail: process.env.EXPO_PUBLIC_SALES_EMAIL ?? extra.salesEmail ?? 'sales@turbotaxi.app',

  /** Whether public self-service registration is open. */
  registrationEnabled: readBool(
    process.env.EXPO_PUBLIC_REGISTRATION_ENABLED ?? extra.registrationEnabled,
    true
  ),

  demo: {
    enabled: readBool(process.env.EXPO_PUBLIC_DEMO_ENABLED ?? extra.demoEnabled, true),
    email: process.env.EXPO_PUBLIC_DEMO_EMAIL ?? extra.demoEmail ?? 'demo@turbotaxi.app',
    password: process.env.EXPO_PUBLIC_DEMO_PASSWORD ?? extra.demoPassword ?? 'demo1234',
  },
} as const;

/** True when a real backend has been configured. */
export const hasBackend = AppConfig.apiBaseUrl.trim().length > 0;

/** Demo can be offered only when enabled and credentials are present. */
export const isDemoAvailable =
  AppConfig.demo.enabled && AppConfig.demo.email.length > 0 && AppConfig.demo.password.length > 0;
