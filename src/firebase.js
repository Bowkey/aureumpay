import { getApp, getApps, initializeApp } from "firebase/app";

const env = import.meta.env;

export const firebaseConfig = {

  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyCrBn-SGY7W0m1z0O7wtCq2OAl_eNSkSmA",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID || "aureumpay-28c7a",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "aureumpay-28c7a.firebasestorage.app",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "698444813351",
  appId: env.VITE_FIREBASE_APP_ID
};

const requiredConfigKeys = ["apiKey", "authDomain", "databaseURL", "projectId", "appId"];

export const isFirebaseConfigured = requiredConfigKeys.every((key) => {
  const value = firebaseConfig[key];
  return typeof value === "string" && value.trim().length > 0;
});

/* ---------- admin allowlist ----------
 * Comma-separated list of emails that are always allowed into the admin
 * console, regardless of what the database says. This is the bootstrap path:
 * it lets the very first administrator reach the console before any
 * `admins/{uid}` record exists (and before the custom `admin` claim has been
 * minted). Anyone else must be promoted at runtime through the admin console.
 */
export const ADMIN_EMAILS = (env.VITE_ADMIN_EMAILS || "admin@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email) {
  return typeof email === "string" && ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;
