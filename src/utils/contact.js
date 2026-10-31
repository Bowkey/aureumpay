import { getDatabase, onValue, ref } from "firebase/database";
import { app, isFirebaseConfigured } from "../firebase.js";

function isValidEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeTelegramUsername(value) {
  const username = value.replace(/^@/, "").trim();
  return /^[A-Za-z0-9_]{5,32}$/.test(username) ? username : "";
}

export function bindContactDetails({ emailLinkId, telegramLinkId, containerId }) {
  if (!isFirebaseConfigured) return () => {};

  const emailLink = document.getElementById(emailLinkId);
  const telegramLink = document.getElementById(telegramLinkId);
  const container = containerId ? document.getElementById(containerId) : null;

  return onValue(
    ref(getDatabase(app), "settings/contact"),
    (snapshot) => {
      const settings = snapshot.val() || {};
      const rawEmail = typeof settings.email === "string" ? settings.email.trim() : "";
      const rawTelegram = typeof settings.telegram === "string" ? settings.telegram.trim() : "";
      const email = isValidEmail(rawEmail) ? rawEmail : "";
      const telegram = normalizeTelegramUsername(rawTelegram);

      emailLink.classList.toggle("hidden", !email);
      if (email) {
        emailLink.href = `mailto:${email}`;
        emailLink.textContent = email;
      }

      telegramLink.classList.toggle("hidden", !telegram);
      if (telegram) {
        telegramLink.href = `https://t.me/${telegram}`;
        telegramLink.textContent = `@${telegram}`;
      }

      if (container) container.classList.toggle("hidden", !email && !telegram);
    },
    (error) => {
      console.error("Could not load contact details:", error);
    }
  );
}
