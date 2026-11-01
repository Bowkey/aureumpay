import { app, isFirebaseConfigured, isAdminEmail } from "../firebase.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, update, remove, get, set } from "firebase/database";

export function mountPage() {
  const ADMIN_EMAIL = "admin@gmail.com";

    const auth = isFirebaseConfigured ? getAuth(app) : null;
    const db = isFirebaseConfigured ? getDatabase(app) : null;
    const $ = (id) => document.getElementById(id);
  
    let allUsers = {};        // uid -> user object
    let allTx = [];           // flat array of {id, ...tx}
    let activeUid = null;
    let depositSettings = {}; // settings/deposit from Firebase (bank + crypto coins)
    let contactSettings = {};
    let adminUids = {};        // uid -> admin record (from `admins`)
    let currentAdminUid = null; // uid of the signed-in administrator
  
    /* ---------- helpers ---------- */
    function showToast(message, tone = "ink") {
      const wrap = $("toastWrap");
      const el = document.createElement("div");
      const tones = { ink: "bg-[var(--forest)] text-white", mint: "bg-[var(--leaf)] text-white", rose: "bg-[var(--error)] text-white" };
      el.className = `${tones[tone] || tones.ink} font-mono text-[12.5px] tracking-[0.02em] px-5 py-3 rounded-full shadow-lg max-w-[92vw] text-center`;
      el.textContent = message;
      wrap.appendChild(el);
      setTimeout(() => { el.style.transition = "opacity .3s ease, transform .3s ease"; el.style.opacity = "0"; el.style.transform = "translateY(8px)"; setTimeout(() => el.remove(), 300); }, 3200);
    }
    const CURRENCY_SYMBOLS = { USD:"$", EUR:"€", GBP:"£", NGN:"₦", GHS:"₵", KES:"KSh", ZAR:"R", EGP:"E£", XOF:"CFA", XAF:"FCFA", UGX:"USh", TZS:"TSh", MAD:"MAD", CAD:"$", AUD:"$", NZD:"$", INR:"₹", PKR:"₨", BDT:"৳", CNY:"¥", JPY:"¥", KRW:"₩", SGD:"$", THB:"฿", IDR:"Rp", PHP:"₱", VND:"₫", AED:"د.إ", SAR:"﷼", ILS:"₪", TRY:"₺", RUB:"₽", CHF:"CHF", SEK:"kr", NOK:"kr", DKK:"kr", PLN:"zł", BRL:"R$", MXN:"$", ARS:"$", COP:"$" };
    function fmtMoney(amount, code) {
      const symbol = CURRENCY_SYMBOLS[code] || "";
      const n = Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `${symbol}${n}`;
    }
    function statusPill(status) {
      const map = { pending: ["pill-pending", "Pending"], approved: ["pill-approved", "Approved"], rejected: ["pill-rejected", "Rejected"] };
      const [cls, label] = map[status] || map.pending;
      return `<span class="pill ${cls}">${label}</span>`;
    }
    // A user's overall status: suspended overrides everything; otherwise a
    // freshly registered account is "Pending" (active === false) until an
    // admin approves it, after which it reads "Active".
    function userStatusPill(u) {
      if (u.suspended) return `<span class="pill pill-suspended">Suspended</span>`;
      if (!u.active) return `<span class="pill pill-pending">Pending</span>`;
      return `<span class="pill pill-active">Active</span>`;
    }
    function txDetailsSummary(tx) {
      const d = tx.details || {};
      if (tx.type === "deposit_bank") return d.reference ? `Ref: ${d.reference}` : "—";
      if (tx.type === "deposit_crypto") return `${d.coin || ""} ${d.txHash ? "· " + d.txHash.slice(0, 14) + "…" : ""}`;
      if (tx.type === "transfer_local") return `${d.accountName || ""} · ${d.bankName || ""} · ${d.accountNumber || ""}`;
      if (tx.type === "transfer_international") return `${d.recipientName || ""} · ${d.bankName || ""} (${d.recipientCountry || ""})`;
      if (tx.type === "withdrawal") return d.method === "paypal" ? `PayPal: ${d.paypalEmail || ""}` : d.method === "cashapp" ? `Cashtag: ${d.cashtag || ""}` : `${d.bankName || ""} · ${d.accountNumber || ""}`;
      if (tx.type === "card_application") return `${d.cardholderName || ""}`;
      if (tx.type === "loan_application") return `${d.purpose || ""} · income ${d.monthlyIncome || 0}`;
      return "—";
    }
  
    /* ---------- login ---------- */
    $("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = $("loginEmail").value.trim();
      const password = $("loginPassword").value;
      $("loginError").classList.add("hidden");

      if (!auth) {
        $("loginError").textContent = "Firebase is not configured. Add your Firebase project settings to src/firebase.js.";
        $("loginError").classList.remove("hidden");
        return;
      }

      // NOTE: we deliberately do not gate on the email allowlist here. A user
      // promoted at runtime (admins/{uid}) is not in VITE_ADMIN_EMAILS, so
      // rejecting them at the form would lock them out. Access is decided in
      // onAuthStateChanged once we can read the admins node and the auth token.
      $("loginSubmitBtn").disabled = true;
      $("loginSubmitLabel").innerHTML = '<span class="spinner"></span>';
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        $("loginError").textContent = "Could not sign in — check the admin credentials and make sure the admin account exists in Firebase Authentication.";
        $("loginError").classList.remove("hidden");
        $("loginSubmitBtn").disabled = false;
        $("loginSubmitLabel").textContent = "Sign in";
      }
    });
  
    $("logoutBtn").addEventListener("click", async () => { await signOut(auth); });
  
    if (auth) {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          $("appShell").classList.add("hidden");
          $("loginGate").classList.remove("hidden");
          $("loginSubmitBtn").disabled = false;
          $("loginSubmitLabel").textContent = "Sign in";
          return;
        }
        const allowed = await checkIsAdmin(user);
        if (allowed) {
          currentAdminUid = user.uid;
          $("loginGate").classList.add("hidden");
          $("appShell").classList.remove("hidden");
          wireDataListeners();
        } else {
          $("appShell").classList.add("hidden");
          $("loginGate").classList.remove("hidden");
          $("loginError").textContent = "This account does not have admin access.";
          $("loginError").classList.remove("hidden");
          $("loginSubmitBtn").disabled = false;
          $("loginSubmitLabel").textContent = "Sign in";
          await signOut(auth);
        }
      });
    } else {
      $("loginError").textContent = "Firebase is not configured. Add your Firebase project settings to src/firebase.js.";
      $("loginError").classList.remove("hidden");
    }
  
    /* ---------- nav ---------- */
    const sections = Array.from(document.querySelectorAll("main section[id^='sec-']"));
    function goToSection(name) {
      const selectedSection = $(`sec-${name}`);
      if (!selectedSection) return;
      sections.forEach((section) => section.classList.toggle("hidden", section !== selectedSection));
      document.querySelectorAll(".nav-item[data-section]").forEach((el) => el.classList.toggle("active", el.dataset.section === name));
      const titles = { overview: "Overview", users: "Users", deposits: "Deposits", transfers: "Transfers", withdrawals: "Withdrawals", cards: "Cards", loans: "Loans", depositsettings: "Site Settings" };
      $("mobileTitle").textContent = titles[name] || "Overview";
      closeDrawer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.querySelectorAll(".nav-item[data-section]").forEach((el) => {
      if (!$(`sec-${el.dataset.section}`)) {
        el.classList.add("hidden");
        return;
      }
      el.addEventListener("click", () => goToSection(el.dataset.section));
    });
    function openDrawer() { $("sidebar").classList.remove("-translate-x-full"); $("drawerBackdrop").classList.remove("hidden"); }
    function closeDrawer() { $("sidebar").classList.add("-translate-x-full"); $("drawerBackdrop").classList.add("hidden"); }
    $("openDrawerBtn").addEventListener("click", openDrawer);
    $("closeDrawerBtn").addEventListener("click", closeDrawer);
    $("drawerBackdrop").addEventListener("click", closeDrawer);
    function syncSidebarForViewport() { if (window.innerWidth >= 1024) $("sidebar").classList.remove("-translate-x-full"); else $("sidebar").classList.add("-translate-x-full"); }
    window.addEventListener("resize", syncSidebarForViewport);
    syncSidebarForViewport();
  
    /* ---------- authorization ----------
     * Three independent signals, any one of which grants admin access:
     *   1. the `admin` custom claim on the ID token (set by the Admin SDK),
     *   2. the `admins/{uid}` record in the database,
     *   3. the VITE_ADMIN_EMAILS allowlist (bootstrap path).
     * Signals 1 and 2 are the real gate; 3 only bootstraps the first admin.
     */
    async function checkIsAdmin(user) {
      // 1. custom claim
      try {
        const token = await user.getIdTokenResult(true);
        if (token && token.claims && token.claims.admin === true) return true;
      } catch (err) {
        console.error("Could not refresh admin credentials:", err);
      }

      // 2. database record
      try {
        const snap = await get(ref(db, `admins/${user.uid}`));
        if (snap.exists() && snap.val() && snap.val().enabled !== false) return true;
      } catch (err) { /* fall through to the allowlist */ }

      // 3. allowlist
      return isAdminEmail(user.email);
    }

    /* ---------- data listeners ---------- */
    function wireDataListeners() {
      onValue(ref(db, "users"), (snap) => {
        allUsers = snap.val() || {};
        renderUsers();
        renderOverview();
        renderAllTxTables();
      }, (err) => {
        console.error("Could not load user profiles:", err);
        showToast("Could not load user details. Check the deployed Realtime Database rules.", "rose");
      });
      onValue(ref(db, "transactions"), (snap) => {
        const val = snap.val() || {};
        allTx = Object.entries(val).map(([id, tx]) => ({ id, ...tx })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderOverview(); renderAllTxTables();
        if (activeUid) renderUserTx(activeUid);
      }, (err) => {
        console.error("Could not load transactions:", err);
        showToast("Could not load transaction details. Check the deployed Realtime Database rules.", "rose");
      });
      onValue(ref(db, "settings/deposit"), (snap) => {
        depositSettings = snap.val() || {};
        renderDepositSettingsUI();
      }, (err) => {
        console.error("Could not load deposit settings:", err);
        showToast("Could not load deposit settings. Check the deployed Realtime Database rules.", "rose");
      });
      onValue(ref(db, "settings/contact"), (snap) => {
        contactSettings = snap.val() || {};
        if (document.activeElement !== $("contactEmail")) $("contactEmail").value = contactSettings.email || "";
        if (document.activeElement !== $("contactTelegram")) $("contactTelegram").value = contactSettings.telegram || "";
      }, (err) => {
        console.error("Could not load contact settings:", err);
        showToast("Could not load contact settings. Check the deployed Realtime Database rules.", "rose");
      });
      onValue(ref(db, "admins"), (snap) => {
        adminUids = snap.val() || {};
        renderUsers();
        if (activeUid) openUserModal(activeUid);
      }, (err) => {
        console.error("Could not load admin records:", err);
        showToast("Could not load admin records. Check the deployed Realtime Database rules.", "rose");
      });
    }
  
    function userLabel(uid) {
      const u = allUsers[uid];
      if (!u) return { name: "Unknown user", email: "" };
      const name = u.fullName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "Unnamed";
      return { name, email: u.email || "" };
    }
  
    /* ---------- overview ---------- */
    function renderOverview() {
      const users = Object.values(allUsers);
      $("statTotalUsers").textContent = users.length;
      $("statPendingApproval").textContent = users.filter((u) => !u.active && !u.suspended).length;
      $("statSuspended").textContent = users.filter((u) => u.suspended).length;
      const totalBalance = users.reduce((sum, u) => sum + Number(u.balance || 0), 0);
      $("statTotalBalance").textContent = totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const pending = allTx.filter((t) => t.status === "pending");
      $("statPending").textContent = pending.length;
  
      const byType = (prefix) => pending.filter((t) => t.type && t.type.startsWith(prefix)).length;
      setBadge("badgeDeposits", byType("deposit"));
      setBadge("badgeTransfers", byType("transfer"));
      setBadge("badgeWithdrawals", pending.filter((t) => t.type === "withdrawal").length);
      setBadge("badgeCards", pending.filter((t) => t.type === "card_application").length);
      setBadge("badgeLoans", pending.filter((t) => t.type === "loan_application").length);
      setBadge("badgePendingUsers", users.filter((u) => !u.active && !u.suspended).length);
  
      const recentPending = pending.slice(0, 8);
      $("overviewPendingEmpty").classList.toggle("hidden", recentPending.length > 0);
      $("overviewPendingBody").innerHTML = recentPending.map((tx) => {
        const u = userLabel(tx.uid);
        return `<tr class="row-hover">
          <td><p class="font-medium">${u.name}</p><p class="help-sm">${u.email}</p></td>
          <td>${prettyType(tx.type)}</td>
          <td>${tx.amount != null ? fmtMoney(tx.amount, tx.currency) : "—"}</td>
          <td>${new Date(tx.createdAt).toLocaleDateString()}</td>
          <td>${statusPill(tx.status)}</td>
          <td>${actionButtons(tx.id)}</td>
        </tr>`;
      }).join("");
      wireActionButtons();
    }
    function setBadge(id, count) {
      const el = $(id);
      if (!el) return;
      if (count > 0) { el.textContent = count; el.classList.remove("hidden"); } else { el.classList.add("hidden"); }
    }
    function prettyType(type) {
      const map = { deposit_bank: "Bank deposit", deposit_crypto: "Crypto deposit", transfer_local: "Local transfer", transfer_international: "Int'l transfer", withdrawal: "Withdrawal", card_application: "Card application", loan_application: "Loan application", admin_adjustment: "Admin adjustment", admin_refund: "Refund" };
      return map[type] || type;
    }
  
    /* ---------- users table ---------- */
    function renderUsers() {
      const term = ($("userSearch").value || "").toLowerCase().trim();
      const entries = Object.entries(allUsers).filter(([uid, u]) => {
        if (!term) return true;
        const name = u.fullName || [u.firstName, u.lastName].filter(Boolean).join(" ");
        return [name, u.email, u.accountNumber].filter(Boolean).some((v) => String(v).toLowerCase().includes(term));
      });
      $("usersEmpty").classList.toggle("hidden", entries.length > 0);
      $("usersTableBody").innerHTML = entries.map(([uid, u]) => {
        const name = u.fullName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "—";
        return `<tr class="row-hover" data-open-user="${uid}">
          <td class="font-medium">${name}</td>
          <td>${u.email || "—"}</td>
          <td class="font-mono">${u.accountNumber || "—"}</td>
          <td class="capitalize">${u.accountType || "—"}</td>
          <td class="font-mono">${fmtMoney(u.balance || 0, u.currency)}</td>
          <td>${userStatusPill(u)}</td>
          <td><button class="btn-ghost text-[12px] font-mono uppercase tracking-[0.06em] px-3 py-1.5" data-open-user="${uid}">View</button></td>
        </tr>`;
      }).join("");
      document.querySelectorAll("[data-open-user]").forEach((el) => el.addEventListener("click", () => openUserModal(el.dataset.openUser)));
    }
    $("userSearch").addEventListener("input", renderUsers);
  
    /* ---------- per-category transaction tables ---------- */
    function actionButtons(txId) {
      return `<div class="flex gap-2 justify-end">
        <button class="btn-mint text-[12px] font-mono uppercase tracking-[0.04em] px-3 py-1.5 tx-approve" data-tx="${txId}">Approve</button>
        <button class="btn-rose text-[12px] font-mono uppercase tracking-[0.04em] px-3 py-1.5 tx-reject" data-tx="${txId}">Reject</button>
      </div>`;
    }
    function actionOrStatus(tx) {
      if (tx.status === "pending") return actionButtons(tx.id);
      return `<span class="help-sm">Reviewed</span>`;
    }
    function wireActionButtons() {
      document.querySelectorAll(".tx-approve").forEach((btn) => btn.addEventListener("click", () => reviewTransaction(btn.dataset.tx, "approved")));
      document.querySelectorAll(".tx-reject").forEach((btn) => btn.addEventListener("click", () => reviewTransaction(btn.dataset.tx, "rejected")));
    }
  
    function renderAllTxTables() {
      const deposits = allTx.filter((t) => t.type && t.type.startsWith("deposit"));
      const transfers = allTx.filter((t) => t.type && t.type.startsWith("transfer"));
      const withdrawals = allTx.filter((t) => t.type === "withdrawal");
      const cards = allTx.filter((t) => t.type === "card_application");
      const loans = allTx.filter((t) => t.type === "loan_application");
  
      $("depositsEmpty").classList.toggle("hidden", deposits.length > 0);
      $("depositsTableBody").innerHTML = deposits.map((tx) => {
        const u = userLabel(tx.uid);
        return `<tr><td><p class="font-medium">${u.name}</p><p class="help-sm">${u.email}</p></td><td>${prettyType(tx.type)}</td><td class="font-mono">${fmtMoney(tx.amount, tx.currency)}</td><td>${txDetailsSummary(tx)}</td><td>${new Date(tx.createdAt).toLocaleDateString()}</td><td>${statusPill(tx.status)}</td><td>${actionOrStatus(tx)}</td></tr>`;
      }).join("");
  
      $("transfersEmpty").classList.toggle("hidden", transfers.length > 0);
      $("transfersTableBody").innerHTML = transfers.map((tx) => {
        const u = userLabel(tx.uid);
        return `<tr><td><p class="font-medium">${u.name}</p><p class="help-sm">${u.email}</p></td><td>${prettyType(tx.type)}</td><td class="font-mono">${fmtMoney(tx.amount, tx.currency)}</td><td>${txDetailsSummary(tx)}</td><td>${new Date(tx.createdAt).toLocaleDateString()}</td><td>${statusPill(tx.status)}</td><td>${actionOrStatus(tx)}</td></tr>`;
      }).join("");
  
      const withdrawalsEmpty = $("withdrawalsEmpty");
      const withdrawalsTableBody = $("withdrawalsTableBody");
      if (withdrawalsEmpty && withdrawalsTableBody) {
        withdrawalsEmpty.classList.toggle("hidden", withdrawals.length > 0);
        withdrawalsTableBody.innerHTML = withdrawals.map((tx) => {
          const u = userLabel(tx.uid);
          return `<tr><td><p class="font-medium">${u.name}</p><p class="help-sm">${u.email}</p></td><td>${(tx.details && tx.details.method) || "—"}</td><td class="font-mono">${fmtMoney(tx.amount, tx.currency)}</td><td>${txDetailsSummary(tx)}</td><td>${new Date(tx.createdAt).toLocaleDateString()}</td><td>${statusPill(tx.status)}</td><td>${actionOrStatus(tx)}</td></tr>`;
        }).join("");
      }
  
      $("cardsEmpty").classList.toggle("hidden", cards.length > 0);
      $("cardsTableBody").innerHTML = cards.map((tx) => {
        const u = userLabel(tx.uid);
        return `<tr><td><p class="font-medium">${u.name}</p><p class="help-sm">${u.email}</p></td><td>${(tx.details && tx.details.cardTypeName) || "—"}</td><td class="font-mono">${fmtMoney(tx.amount, tx.currency)}</td><td>${txDetailsSummary(tx)}</td><td>${new Date(tx.createdAt).toLocaleDateString()}</td><td>${statusPill(tx.status)}</td><td>${actionOrStatus(tx)}</td></tr>`;
      }).join("");
  
      $("loansEmpty").classList.toggle("hidden", loans.length > 0);
      $("loansTableBody").innerHTML = loans.map((tx) => {
        const u = userLabel(tx.uid);
        const d = tx.details || {};
        return `<tr><td><p class="font-medium">${u.name}</p><p class="help-sm">${u.email}</p></td><td class="font-mono">${fmtMoney(tx.amount, tx.currency)}</td><td>${d.purpose || "—"}</td><td>${d.durationMonths || "—"} mo</td><td>${new Date(tx.createdAt).toLocaleDateString()}</td><td>${statusPill(tx.status)}</td><td>${actionOrStatus(tx)}</td></tr>`;
      }).join("");
  
      wireActionButtons();
    }
  
    /* ---------- approve / reject logic ---------- */
    async function reviewTransaction(txId, decision) {
      const tx = allTx.find((t) => t.id === txId);
      if (!tx) return;
      const uid = tx.uid;
      const user = allUsers[uid];
      if (!user) { showToast("User not found for this transaction.", "rose"); return; }
  
      const updates = {};
      updates[`transactions/${txId}/status`] = decision;
      updates[`transactions/${txId}/reviewedAt`] = new Date().toISOString();
  
      if (decision === "approved") {
        let newBalance = Number(user.balance || 0);
        if (tx.direction === "credit") newBalance += Number(tx.amount || 0);
        else if (tx.direction === "debit") newBalance -= Number(tx.amount || 0);
        updates[`users/${uid}/balance`] = newBalance;
  
        if (tx.type === "card_application") {
          const last4 = String(Math.floor(1000 + Math.random() * 9000));
          const cardId = "card_" + Date.now();
          updates[`users/${uid}/cards/${cardId}`] = {
            typeId: tx.details?.cardTypeId || "virtual",
            typeName: tx.details?.cardTypeName || "Card",
            last4,
            issuedAt: new Date().toISOString(),
          };
        }
      }
  
      try {
        await update(ref(db), updates);
        showToast(decision === "approved" ? "Transaction approved" : "Transaction rejected", decision === "approved" ? "mint" : "rose");
      } catch (err) {
        showToast("Something went wrong — try again.", "rose");
      }
    }
  
    /* ---------- withdrawal PIN helpers ---------- */
    function randomPin() {
      return String(Math.floor(1000 + Math.random() * 9000)); // 4 digits, 1000–9999
    }
    function wirePinInput(id) {
      $(id).addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
      });
    }
    ["umPin1", "umPin2", "umPin3", "umPin4"].forEach(wirePinInput);
  
    /* ---------- promote / demote admin ---------- */
    async function promoteToAdmin(uid) {
      const u = allUsers[uid] || {};
      const name = u.fullName || u.email || "this user";
      if (!confirm(`Give ${name} admin access?\n\nThey will be able to approve transactions, adjust balances and manage every account in this console.`)) return;
      try {
        await set(ref(db, `admins/${uid}`), {
          email: u.email || "",
          role: "admin",
          enabled: true,
          promotedAt: new Date().toISOString(),
          promotedBy: currentAdminUid,
        });
        showToast("Admin access granted", "mint");
      } catch (err) {
        showToast("Could not grant admin access — check database rules.", "rose");
      }
    }

    async function demoteAdmin(uid) {
      const u = allUsers[uid] || {};
      const name = u.fullName || u.email || "this user";
      if (!confirm(`Remove admin access from ${name}?`)) return;
      try {
        await remove(ref(db, `admins/${uid}`));
        showToast("Admin access removed", "ink");
      } catch (err) {
        showToast("Could not remove admin access — check database rules.", "rose");
      }
    }

    /* ---------- user modal ---------- */
    function openUserModal(uid) {
      activeUid = uid;
      const u = allUsers[uid] || {};
      const name = u.fullName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "Unnamed user";
      const address = [u.address, u.city, u.state, u.postalCode, u.country].filter(Boolean).join(", ");
      $("umName").textContent = name;
      $("umEmail").textContent = u.email || "—";
      $("umAcctNum").textContent = u.accountNumber || "—";
      $("umAcctType").textContent = u.accountType || "—";
      $("umBalance").textContent = fmtMoney(u.balance || 0, u.currency);
      $("umPhone").textContent = u.phone || "—";
      $("umCountry").textContent = u.country || u.countryResidence || "—";
      $("umAddress").textContent = address || "—";
      $("umStatus").textContent = u.suspended ? "Suspended" : (u.active ? "Active" : "Pending approval");
      $("umSuspendBtn").classList.toggle("hidden", !!u.suspended);
      $("umUnsuspendBtn").classList.toggle("hidden", !u.suspended);
      $("umAdjustAmount").value = "";
      $("umAdjustNote").value = "";
  
      const isActive = !!u.active;
      $("umActiveDot").className = `w-2.5 h-2.5 rounded-full ${isActive ? "" : ""}`;
      $("umActiveDot").style.background = isActive ? "var(--leaf)" : "var(--error)";
      $("umActiveText").textContent = isActive ? "Active" : "Inactive — pending approval";
      $("umActiveText").style.color = isActive ? "var(--leaf)" : "var(--error)";
      $("umApproveBtn").classList.toggle("hidden", isActive);
      $("umDeactivateBtn").classList.toggle("hidden", !isActive);
  
      const isAdmin = !!adminUids[activeUid];
      $("umPromoteBtn").classList.toggle("hidden", activeUid === currentAdminUid || isAdmin);
      $("umDemoteBtn").classList.toggle("hidden", activeUid === currentAdminUid || !isAdmin);

      const pins = u.withdrawalPins || {};
      $("umPin1").value = pins.pin1 || "";
      $("umPin2").value = pins.pin2 || "";
      $("umPin3").value = pins.pin3 || "";
      $("umPin4").value = pins.pin4 || "";
      $("umPinsError").classList.add("hidden");
  
      renderUserTx(uid);
      $("userModal").classList.remove("hidden");
    }
    $("umCloseBtn").addEventListener("click", () => { $("userModal").classList.add("hidden"); activeUid = null; });
  
    function displayDescription(tx) {
      if (tx.type === "admin_refund") return tx.description || "Refund issued";
      if (tx.type === "admin_adjustment") return tx.direction === "credit" ? "Account credited" : "Account debited";
      return tx.description || prettyType(tx.type);
    }
  
    function renderUserTx(uid) {
      const list = allTx.filter((t) => t.uid === uid).slice(0, 15);
      if (!list.length) { $("umTxList").innerHTML = `<p class="p-4 text-muted2 text-[13px] text-center">No transactions yet.</p>`; return; }
      $("umTxList").innerHTML = list.map((tx) => `
        <div class="p-3.5 flex items-center justify-between gap-3">
          <div class="min-w-0"><p class="font-medium text-[13px] truncate">${displayDescription(tx)}</p><p class="help-sm">${new Date(tx.createdAt).toLocaleString()}</p></div>
          <div class="text-right flex-shrink-0">
            <p class="font-mono text-[13px] mb-1">${tx.amount != null ? (tx.direction === "credit" ? "+" : "−") + fmtMoney(tx.amount, tx.currency) : ""}</p>
            ${statusPill(tx.status)}
          </div>
        </div>
      `).join("");
    }
  
    $("umSuspendBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      await update(ref(db, `users/${activeUid}`), { suspended: true });
      showToast("Account suspended", "rose");
      openUserModal(activeUid);
    });
    $("umUnsuspendBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      await update(ref(db, `users/${activeUid}`), { suspended: false });
      showToast("Account unsuspended", "mint");
      openUserModal(activeUid);
    });
  
    /* ---------- approve / deactivate account ---------- */
    $("umApproveBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      await update(ref(db, `users/${activeUid}`), { active: true });
      showToast("Account approved and activated", "mint");
      openUserModal(activeUid);
    });
    $("umDeactivateBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      await update(ref(db, `users/${activeUid}`), { active: false });
      showToast("Account set back to inactive", "rose");
      openUserModal(activeUid);
    });
  
    $("umAdjustBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      const amount = Number($("umAdjustAmount").value);
      const action = $("umAdjustDirection").value;
      const direction = action === "debit" ? "debit" : "credit";
      if (!amount || amount <= 0) { showToast("Enter a valid amount.", "rose"); return; }
      const user = allUsers[activeUid];
      const currentBalance = Number(user.balance || 0);
      const newBalance = direction === "credit" ? currentBalance + amount : currentBalance - amount;
      const isRefund = action === "refund";
      const note = $("umAdjustNote").value.trim();
      const timestamp = new Date().toISOString();
  
      const updates = {};
      updates[`users/${activeUid}/balance`] = newBalance;
      updates[`transactions/admin_${Date.now()}`] = {
        uid: activeUid, type: isRefund ? "admin_refund" : "admin_adjustment", direction, amount, currency: user.currency,
        description: note || (isRefund ? "Refund issued" : direction === "credit" ? "Admin credit" : "Admin debit"),
        status: "approved", createdAt: timestamp, reviewedAt: timestamp,
      };
      try {
        await update(ref(db), updates);
        showToast(isRefund ? "Refund issued" : "Balance updated", "mint");
        $("umAdjustAmount").value = "";
        $("umAdjustNote").value = "";
      } catch (err) {
        console.error("Could not adjust user balance:", err);
        showToast(err && err.code === "PERMISSION_DENIED"
          ? "Balance adjustment denied. Verify that admin database rules are deployed."
          : "Could not adjust balance. Check the console for details and try again.", "rose");
      }
    });
  
    /* ---------- withdrawal PIN actions ---------- */
    $("umRegeneratePinsBtn").addEventListener("click", () => {
      $("umPin1").value = randomPin();
      $("umPin2").value = randomPin();
      $("umPin3").value = randomPin();
      $("umPin4").value = randomPin();
      $("umPinsError").classList.add("hidden");
    });
  
    $("umSavePinsBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      const pin1 = $("umPin1").value.trim();
      const pin2 = $("umPin2").value.trim();
      const pin3 = $("umPin3").value.trim();
      const pin4 = $("umPin4").value.trim();
      const allValid = [pin1, pin2, pin3, pin4].every((p) => /^\d{4}$/.test(p));
      if (!allValid) {
        $("umPinsError").textContent = "Each PIN must be exactly 4 digits.";
        $("umPinsError").classList.remove("hidden");
        return;
      }
      $("umPinsError").classList.add("hidden");
      try {
        await update(ref(db, `users/${activeUid}/withdrawalPins`), { pin1, pin2, pin3, pin4 });
        showToast("Withdrawal PINs saved", "mint");
      } catch (err) {
        showToast("Something went wrong — try again.", "rose");
      }
    });
  
    /* ---------- delete user permanently ---------- */
    // Note: this only removes the user's profile + transaction records from the
    // Realtime Database (and their reserved account number). It does NOT delete
    // their Firebase Authentication credential — client-side code can't do that
    // for security reasons. To fully remove someone, also delete their entry in
    // Firebase Console → Authentication (or wire up a Cloud Function using the
    // Admin SDK).
    $("umDeleteBtn").addEventListener("click", async () => {
      if (!activeUid) return;
      const u = allUsers[activeUid] || {};
      const name = u.fullName || [u.firstName, u.lastName].filter(Boolean).join(" ") || "this user";
      const confirmed = confirm(
        `Delete ${name}'s account?\n\nThis permanently removes their profile and transaction history from the database and cannot be undone. Their sign-in credentials are not affected — remove those separately in Firebase Authentication if needed.`
      );
      if (!confirmed) return;
  
      const updates = {};
      updates[`users/${activeUid}`] = null;
      if (u.accountNumber) updates[`accountNumbers/${u.accountNumber}`] = null;
      allTx.filter((t) => t.uid === activeUid).forEach((t) => { updates[`transactions/${t.id}`] = null; });
  
      try {
        await update(ref(db), updates);
        showToast("User deleted", "mint");
        $("userModal").classList.add("hidden");
        activeUid = null;
      } catch (err) {
        showToast("Something went wrong — try again.", "rose");
      }
    });
  
    /* ---------- Deposit Settings (bank details + crypto coins) ---------- */
    function renderDepositSettingsUI() {
      const bank = (depositSettings && depositSettings.bank) || {};
      $("dsBankName").value = bank.bankName || "";
      $("dsBankHelp").value = bank.helpText || "";
      $("dsBankAccountNumber").value = bank.accountNumber || "";
      $("dsBankAccountName").value = bank.accountName || "";
      $("dsBankCurrency").value = bank.currency || "";
  
      const coins = (depositSettings && depositSettings.crypto && depositSettings.crypto.coins) || {};
      const entries = Object.entries(coins);
      $("dsCoinList").innerHTML = entries.length ? entries.map(([id, c]) => `
        <div class="surface p-4 flex items-center justify-between gap-3 flex-wrap">
          <div class="min-w-0">
            <p class="font-medium text-[14.5px] truncate">${c.name || id} <span class="text-muted2 font-normal">(${c.ticker || ""})</span> ${c.enabled === false ? '<span class="pill pill-suspended ml-1">Hidden</span>' : '<span class="pill pill-active ml-1">Visible</span>'}</p>
            <p class="help-sm font-mono truncate max-w-[420px]">${c.address || "No address set yet"}</p>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button class="btn-ghost text-[12px] font-mono uppercase tracking-[0.04em] px-3 py-1.5 ds-coin-toggle" data-coin="${id}" data-enabled="${c.enabled === false ? "false" : "true"}">${c.enabled === false ? "Enable" : "Disable"}</button>
            <button class="btn-ghost text-[12px] font-mono uppercase tracking-[0.04em] px-3 py-1.5 ds-coin-edit" data-coin="${id}">Edit</button>
            <button class="btn-rose text-[12px] font-mono uppercase tracking-[0.04em] px-3 py-1.5 ds-coin-delete" data-coin="${id}">Delete</button>
          </div>
        </div>
      `).join("") : `<p class="surface p-5 text-muted2 text-[13.5px] text-center">No coins configured yet — add one below and it'll appear on every user's Deposit page.</p>`;
  
      document.querySelectorAll(".ds-coin-toggle").forEach((btn) => btn.addEventListener("click", () => {
        const id = btn.dataset.coin;
        const currentlyEnabled = btn.dataset.enabled === "true";
        update(ref(db, `settings/deposit/crypto/coins/${id}`), { enabled: !currentlyEnabled })
          .then(() => showToast(currentlyEnabled ? "Coin hidden from users" : "Coin now visible to users", "mint"))
          .catch(() => showToast("Something went wrong — try again.", "rose"));
      }));
      document.querySelectorAll(".ds-coin-edit").forEach((btn) => btn.addEventListener("click", () => openCoinForm(btn.dataset.coin)));
      document.querySelectorAll(".ds-coin-delete").forEach((btn) => btn.addEventListener("click", async () => {
        if (!confirm("Delete this coin? Users will no longer see it as a deposit option.")) return;
        try {
          await remove(ref(db, `settings/deposit/crypto/coins/${btn.dataset.coin}`));
          showToast("Coin removed", "mint");
        } catch (err) {
          showToast("Something went wrong — try again.", "rose");
        }
      }));
    }
  
    $("dsBankSaveBtn").addEventListener("click", async () => {
      const payload = {
        bankName: $("dsBankName").value.trim(),
        helpText: $("dsBankHelp").value.trim(),
        accountNumber: $("dsBankAccountNumber").value.trim(),
        accountName: $("dsBankAccountName").value.trim(),
        currency: $("dsBankCurrency").value.trim().toUpperCase(),
      };
      try {
        await update(ref(db, "settings/deposit/bank"), payload);
        showToast("Bank settings saved", "mint");
      } catch (err) {
        showToast("Something went wrong — try again.", "rose");
      }
    });

    $("contactSaveBtn").addEventListener("click", async () => {
      const email = $("contactEmail").value.trim();
      const telegram = $("contactTelegram").value.trim().replace(/^@/, "");
      if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        showToast("Enter a valid support email address.", "rose");
        return;
      }
      if (telegram && !/^[A-Za-z0-9_]{5,32}$/.test(telegram)) {
        showToast("Enter a valid Telegram username (5–32 letters, numbers, or underscores).", "rose");
        return;
      }

      try {
        await update(ref(db, "settings/contact"), { email, telegram });
        showToast("Contact details saved", "mint");
      } catch (err) {
        console.error("Could not save contact settings:", err);
        showToast("Could not save contact details. Check your admin access and database rules.", "rose");
      }
    });
  
    function slugifyCoinId(ticker) {
      const base = (ticker || "coin").toLowerCase().replace(/[^a-z0-9]/g, "") || "coin";
      const coins = (depositSettings.crypto && depositSettings.crypto.coins) || {};
      return coins[base] ? `${base}_${Date.now()}` : base;
    }
  
    function openCoinForm(id) {
      const coins = (depositSettings.crypto && depositSettings.crypto.coins) || {};
      const c = id ? coins[id] : null;
      $("dsCoinId").value = id || "";
      $("dsCoinFormTitle").textContent = id ? "Edit coin" : "Add coin";
      $("dsCoinName").value = c ? (c.name || "") : "";
      $("dsCoinTicker").value = c ? (c.ticker || "") : "";
      $("dsCoinNetwork").value = c ? (c.network || "") : "";
      $("dsCoinAddress").value = c ? (c.address || "") : "";
      $("dsCoinWarning").value = c ? (c.warning || "") : "";
      $("dsCoinEnabled").checked = c ? c.enabled !== false : true;
      $("dsCoinForm").classList.remove("hidden");
      $("dsCoinForm").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    $("dsAddCoinBtn").addEventListener("click", () => openCoinForm(null));
    $("dsCoinCancelBtn").addEventListener("click", () => $("dsCoinForm").classList.add("hidden"));
    $("dsCoinSaveBtn").addEventListener("click", async () => {
      const name = $("dsCoinName").value.trim();
      const ticker = $("dsCoinTicker").value.trim().toUpperCase();
      const address = $("dsCoinAddress").value.trim();
      if (!name || !ticker || !address) { showToast("Coin name, ticker, and address are required.", "rose"); return; }
  
      let id = $("dsCoinId").value;
      if (!id) id = slugifyCoinId(ticker);
      const payload = {
        name, ticker, network: $("dsCoinNetwork").value.trim(), address,
        warning: $("dsCoinWarning").value.trim(), enabled: $("dsCoinEnabled").checked,
      };
      try {
        await update(ref(db, `settings/deposit/crypto/coins/${id}`), payload);
        showToast("Coin saved — it'll now show on users' Deposit page", "mint");
        $("dsCoinForm").classList.add("hidden");
      } catch (err) {
        showToast("Something went wrong — try again.", "rose");
      }
    });
}
