import { createHash } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

function getFirebaseApp() {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!serviceAccountJson || !databaseURL) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON and FIREBASE_DATABASE_URL must be configured.");
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON.");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL,
  });
}

function recipientsFromEnvironment() {
  const recipients = [...new Set(
    (process.env.ADMIN_NOTIFICATION_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  )];
  if (!recipients.length) throw new Error("ADMIN_NOTIFICATION_EMAILS must include at least one recipient.");
  return recipients;
}

function stableKey(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function sendEmail({ to, subject, text, key }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL must be configured.");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": stableKey(key),
    },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Resend rejected an email request.", {
      status: response.status,
      details: details.slice(0, 1000),
      recipient: to,
      subject,
    });
    throw new Error(`Resend request failed with status ${response.status}.`);
  }
}

async function sendToAdmins(args) {
  await Promise.all(recipientsFromEnvironment().map((to) =>
    sendEmail({ ...args, to, key: `${args.key}:${to}` })
  ));
}

async function sendToUser(firebaseApp, uid, args) {
  const userRecord = await getAuth(firebaseApp).getUser(uid);
  const email = userRecord.email;
  if (typeof email !== "string" || !email.trim()) {
    throw new Error("The user's Firebase Authentication account does not contain an email address.");
  }
  await sendEmail({
    ...args,
    to: email.trim(),
    key: `${args.key}:${email.trim().toLowerCase()}`,
  });
}

async function runOnce(database, key, task) {
  const stateRef = database.ref(`emailNotificationState/api/${stableKey(key)}`);
  const claim = await stateRef.transaction((current) =>
    current ? undefined : { status: "sending", createdAt: Date.now() }
  );
  if (!claim.committed) return false;

  try {
    await task();
    await stateRef.set({ status: "sent", sentAt: Date.now() });
    return true;
  } catch (error) {
    await stateRef.remove();
    throw error;
  }
}

async function verifyAdmin(database, decodedToken) {
  if (decodedToken.admin === true) return true;
  const adminSnapshot = await database.ref(`admins/${decodedToken.uid}/enabled`).get();
  return adminSnapshot.val() === true;
}

function errorResponse(res, status, message) {
  return res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return errorResponse(res, 405, "Method not allowed.");
  }

  const authorization = req.headers.authorization || "";
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) return errorResponse(res, 401, "Authentication is required.");

  let firebaseApp;
  let decodedToken;
  try {
    firebaseApp = getFirebaseApp();
    decodedToken = await getAuth(firebaseApp).verifyIdToken(tokenMatch[1]);
  } catch (error) {
    if (error?.code?.startsWith("auth/")) return errorResponse(res, 401, "Your session is invalid or expired. Sign in again.");
    console.error("Email notification backend authentication is not configured correctly.", error);
    return errorResponse(res, 500, "Email notification backend configuration is incomplete.");
  }

  try {
    const database = getDatabase(firebaseApp);
    const isAdmin = await verifyAdmin(database, decodedToken);
    const { type, transactionId } = req.body || {};
    const userRef = database.ref(`users/${decodedToken.uid}`);

    if (type === "registration") {
      const userSnapshot = await userRef.get();
      const user = userSnapshot.val();
      const authUser = await getAuth(firebaseApp).getUser(decodedToken.uid);
      if (!user || typeof authUser.email !== "string") {
        return errorResponse(res, 404, "Registered user profile was not found.");
      }

      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "A new user";
      const sent = await runOnce(database, `registration:${decodedToken.uid}`, async () => {
        await Promise.all([
          sendToAdmins({
            subject: "New Aureumpay registration",
            text: `${name} created an Aureumpay account.\nEmail: ${authUser.email}`,
            key: `registration-admin:${decodedToken.uid}`,
          }),
          sendToUser(firebaseApp, decodedToken.uid, {
            subject: "Welcome to Aureumpay",
            text: `Hello ${user.firstName || "there"},\n\nYour Aureumpay account has been created. You can sign in to view your account and its status.`,
            key: `registration-user:${decodedToken.uid}`,
          }),
        ]);
      });
      return res.status(200).json({ sent, duplicate: !sent });
    }

    if (type !== "transfer" && type !== "balance") {
      return errorResponse(res, 400, "Unsupported notification type.");
    }
    if (typeof transactionId !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(transactionId)) {
      return errorResponse(res, 400, "A valid transaction ID is required.");
    }

    const transactionSnapshot = await database.ref(`transactions/${transactionId}`).get();
    const transaction = transactionSnapshot.val();
    if (!transaction) return errorResponse(res, 404, "Transaction was not found.");

    if (type === "transfer") {
      if (transaction.uid !== decodedToken.uid) return errorResponse(res, 403, "You cannot notify for this transaction.");
      if (!["transfer_local", "transfer_international"].includes(transaction.type) || transaction.status !== "pending") {
        return errorResponse(res, 400, "This is not a pending transfer request.");
      }

      const direction = transaction.type === "transfer_international" ? "international" : "local";
      const sent = await runOnce(database, `transfer:${transactionId}`, async () => {
        await sendToAdmins({
          subject: `New ${direction} transfer request`,
          text: `A user submitted a ${direction} transfer request.\nAmount: ${transaction.currency || ""} ${Number(transaction.amount || 0).toFixed(2)}\nTransaction ID: ${transactionId}\nStatus: ${transaction.status}`,
          key: `transfer-admin:${transactionId}`,
        });
      });
      return res.status(200).json({ sent, duplicate: !sent });
    }

    const ownReservedTransfer = transaction.uid === decodedToken.uid
      && transaction.status === "pending"
      && transaction.balanceReserved === true
      && ["transfer_local", "transfer_international"].includes(transaction.type)
      && transaction.direction === "debit";
    if (!isAdmin && !ownReservedTransfer) {
      return errorResponse(res, 403, "You cannot notify for this balance change.");
    }

    let credited;
    if (transaction.type === "admin_adjustment" || transaction.type === "admin_refund") {
      if (!isAdmin || !["credit", "debit"].includes(transaction.direction)) {
        return errorResponse(res, 403, "Administrator access is required for this balance change.");
      }
      credited = transaction.direction === "credit";
    } else if (ownReservedTransfer) {
      credited = false;
    } else if (transaction.status === "approved" && transaction.direction === "credit") {
      credited = true;
    } else if (transaction.status === "approved" && transaction.direction === "debit" && !transaction.balanceReserved) {
      credited = false;
    } else if (transaction.status === "rejected" && transaction.direction === "debit" && transaction.balanceReserved) {
      credited = true;
    } else {
      return errorResponse(res, 400, "This transaction did not change the user's balance.");
    }

    const balanceSnapshot = await database.ref(`users/${transaction.uid}/balance`).get();
    const currentBalance = Number(balanceSnapshot.val());
    const amount = Number(transaction.amount);
    if (!Number.isFinite(currentBalance) || !Number.isFinite(amount) || amount <= 0) {
      return errorResponse(res, 400, "The transaction has invalid balance details.");
    }
    const currency = transaction.currency || "";
    const changeText = `${currency} ${amount.toFixed(2)}`.trim();
    const balanceText = `${currency} ${currentBalance.toFixed(2)}`.trim();

    const balanceEvent = `${transactionId}:${transaction.status}:${credited ? "credit" : "debit"}`;
    const sent = await runOnce(database, `balance:${balanceEvent}`, async () => {
      await sendToUser(firebaseApp, transaction.uid, {
        subject: credited ? "Your Aureumpay balance was credited" : "Your Aureumpay balance was debited",
        text: `Your Aureumpay balance was ${credited ? "credited" : "debited"} by ${changeText}.\nCurrent balance: ${balanceText}\n\nSign in to your account to view more details.`,
        key: `balance-user:${balanceEvent}`,
      });
    });
    return res.status(200).json({ sent, duplicate: !sent });
  } catch (error) {
    console.error("Email notification request failed.", error);
    const message = error && error.message === "Firebase ID token has expired. Get a fresh token from your client app."
      ? "Your session expired. Sign in again and retry."
      : "Could not send the email notification. Check the Vercel function logs and configuration.";
    return errorResponse(res, 500, message);
  }
}
