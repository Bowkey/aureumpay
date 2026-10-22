#!/usr/bin/env node
/**
 * One-time trusted bootstrap for the first Firebase administrator.
 *
 * Usage:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\\private\\service-account.json"
 *   npm run set-admin -- promote admin@example.com
 *
 * The Realtime Database URL is read from FIREBASE_DATABASE_URL,
 * VITE_FIREBASE_DATABASE_URL, or the project's local .env file.
 */

import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const {
  cert,
  deleteApp,
  getApp,
  getApps,
  initializeApp,
} = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getDatabase } = require("firebase-admin/database");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function readLocalEnvValue(name) {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return "";

  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => new RegExp(`^\\s*${name}\\s*=`).test(entry));
  if (!line) return "";

  const value = line.slice(line.indexOf("=") + 1).trim();
  return value.replace(/^(['"])(.*)\1$/, "$2");
}

const keyPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS_FILE;
const databaseURL =
  process.env.FIREBASE_DATABASE_URL ||
  process.env.VITE_FIREBASE_DATABASE_URL ||
  readLocalEnvValue("VITE_FIREBASE_DATABASE_URL");
const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.VITE_FIREBASE_PROJECT_ID ||
  readLocalEnvValue("VITE_FIREBASE_PROJECT_ID");

if (!keyPath || !existsSync(keyPath)) {
  throw new Error(
    "Set GOOGLE_APPLICATION_CREDENTIALS to the path of your private service-account JSON file."
  );
}
if (!databaseURL) {
  throw new Error(
    "Set VITE_FIREBASE_DATABASE_URL in .env or FIREBASE_DATABASE_URL in your shell."
  );
}

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
if (projectId && serviceAccount.project_id !== projectId) {
  throw new Error(
    "The service-account key belongs to a different Firebase project than this app."
  );
}

const app =
  getApps().length === 0
    ? initializeApp({
    credential: cert(serviceAccount),
    databaseURL,
      })
    : getApp();
const auth = getAuth(app);
const database = getDatabase(app);

const [command, rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

async function findUser() {
  if (!email) throw new Error("Provide the Firebase Authentication user's email.");
  try {
    return await auth.getUserByEmail(email);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      throw new Error(`No Firebase user found for "${email}". Create the account first.`);
    }
    throw err;
  }
}

async function promote() {
  const user = await findUser();
  const customClaims = { ...user.customClaims, admin: true };

  await auth.setCustomUserClaims(user.uid, customClaims);
  await database.ref(`admins/${user.uid}`).set({
    email: user.email || email,
    role: "admin",
    enabled: true,
    promotedAt: new Date().toISOString(),
    promotedBy: "admin-bootstrap",
  });

  console.log(`Admin access granted to ${user.email} (UID: ${user.uid}).`);
  console.log("Sign out and sign back in to refresh the account's permissions.");
}

async function demote() {
  const user = await findUser();
  const customClaims = { ...user.customClaims };
  delete customClaims.admin;

  await auth.setCustomUserClaims(
    user.uid,
    Object.keys(customClaims).length ? customClaims : null
  );
  await database.ref(`admins/${user.uid}`).remove();

  console.log(`Admin access removed from ${user.email}.`);
}

try {
  if (command === "promote") {
    await promote();
  } else if (command === "demote") {
    await demote();
  } else {
    console.error("Usage: npm run set-admin -- promote <email> | demote <email>");
    process.exitCode = 1;
  }
} catch (err) {
  console.error(err.message || err);
  process.exitCode = 1;
} finally {
  await deleteApp(app);
}
