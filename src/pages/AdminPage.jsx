import PageLayout from "../components/PageLayout.jsx";
import PageStyles from "../components/PageStyles.jsx";
import PageScript from "../components/PageScript.jsx";
import { mountPage } from "../scripts/admin.js";
import css from "../styles/admin.css?inline";

export default function AdminPage() {
  return (
    <PageLayout page="admin">
      <PageStyles css={css} />
      <PageScript mount={mountPage} />
      <div className="page page-admin">
        <div>
          {/* ============ Login gate ============ */}
          <div
            id="loginGate"
            className="min-h-screen flex items-center justify-center p-5"
          >
            <div
              className="surface p-7 sm:p-9 w-full max-w-[400px]"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-serif italic-serif text-2xl">
                  Aureumpay
                </span>
                <span className="text-muted2 font-mono text-[11px] uppercase tracking-[0.16em]">
                  Admin
                </span>
              </div>
              <p className="text-muted2 text-[13.5px] mb-7">
                Sign in to manage accounts and transactions.
              </p>
              <form id="loginForm" className="space-y-5">
                <div>
                  <label className="label-sm">Admin email</label>
                  <input
                    required
                    id="loginEmail"
                    type="email"
                    className="input-field"
                    placeholder="admin@gmail.com"
                  />
                </div>
                <div>
                  <label className="label-sm">Password</label>
                  <input
                    required
                    id="loginPassword"
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                  />
                </div>
                <p id="loginError" className="hidden error-sm"></p>
                <button
                  id="loginSubmitBtn"
                  type="submit"
                  className="btn-primary font-medium text-[15px] py-3.5 w-full flex items-center justify-center gap-2 mt-2"
                >
                  <span id="loginSubmitLabel">Sign in</span>
                </button>
              </form>
            </div>
          </div>

          {/* ============ App shell ============ */}
          <div
            id="appShell"
            className="hidden min-h-screen lg:grid lg:grid-cols-[250px_1fr]"
          >
            <div
              id="drawerBackdrop"
              className="hidden fixed inset-0 bg-black/40 z-30 lg:hidden"
            ></div>
            <aside
              id="sidebar"
              className="fixed lg:sticky top-0 left-0 h-screen w-[250px] -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40 surface lg:border-r border-r flex flex-col p-5"
            >
              <div className="flex items-center justify-between mb-8">
                <a href="#" className="flex items-baseline gap-2">
                  <span className="font-serif italic-serif text-xl">
                    Aureumpay
                  </span>
                  <span className="text-muted2 font-mono text-[10px] uppercase tracking-[0.16em]">
                    Admin
                  </span>
                </a>
                <button id="closeDrawerBtn" className="lg:hidden text-muted2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 space-y-1" id="navList">
                <div className="nav-item active" data-section="overview">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 12 12 3l9 9M5 10v10h14V10" />
                  </svg>{" "}
                  Overview
                </div>
                <div className="nav-item" data-section="users">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="9" cy="8" r="3.2" />
                    <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16.5 8.5A2.8 2.8 0 1 0 16.5 3M21 20c0-2.6-1.8-4.6-4.2-5.3" />
                  </svg>{" "}
                  Users{" "}
                  <span
                    id="badgePendingUsers"
                    className="ml-auto hidden pill pill-pending"
                  ></span>
                </div>
                <div className="nav-item" data-section="deposits">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21V7m0 14-4.5-4.5M12 21l4.5-4.5M4 4h16" />
                  </svg>{" "}
                  Deposits{" "}
                  <span
                    id="badgeDeposits"
                    className="ml-auto hidden pill pill-pending"
                  ></span>
                </div>
                <div className="nav-item" data-section="transfers">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 7h13M7 7l4-4M7 7l4 4M17 17H4M17 17l-4-4M17 17l-4 4" />
                  </svg>{" "}
                  Transfers{" "}
                  <span
                    id="badgeTransfers"
                    className="ml-auto hidden pill pill-pending"
                  ></span>
                </div>
                {/* <div className="nav-item" data-section="withdrawals">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
                  </svg>{" "}
                  Withdrawals{" "}
                  <span
                    id="badgeWithdrawals"
                    className="ml-auto hidden pill pill-pending"
                  ></span>
                </div> */}
                <div className="nav-item" data-section="cards">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
                    <path d="M2.5 9.5h19" />
                  </svg>{" "}
                  Cards{" "}
                  <span
                    id="badgeCards"
                    className="ml-auto hidden pill pill-pending"
                  ></span>
                </div>
                <div className="nav-item" data-section="loans">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>{" "}
                  Loans{" "}
                  <span
                    id="badgeLoans"
                    className="ml-auto hidden pill pill-pending"
                  ></span>
                </div>
                <div className="nav-item" data-section="depositsettings">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
                    <path d="M2.5 9.5h19M7 15h4" />
                  </svg>{" "}
                  Site Settings
                </div>
              </nav>
              <button
                id="logoutBtn"
                className="nav-item mt-2"
                style={{ color: "var(--error)" }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>{" "}
                Log out
              </button>
            </aside>

            <div className="flex flex-col min-h-screen">
              <header
                className="lg:hidden sticky top-0 z-20 surface flex items-center justify-between px-4 py-3.5"
                style={{ borderRadius: 0 }}
              >
                <button id="openDrawerBtn" className="text-muted2">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                </button>
                <p id="mobileTitle" className="font-serif text-[15px]">
                  Overview
                </p>
                <div className="w-9 h-9 rounded-full bg-leaf/15 flex items-center justify-center font-serif text-[var(--leaf)] text-[13px]">
                  A
                </div>
              </header>

              <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
                {/* ===== Overview ===== */}
                <section id="sec-overview">
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--leaf)] mb-2">
                    Overview
                  </p>
                  <h1 className="font-serif font-medium text-[26px] mb-6">
                    Snapshot of Aureumpay right now.
                  </h1>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="stat-card">
                      <p className="help-sm mb-1">Total users</p>
                      <p
                        id="statTotalUsers"
                        className="font-serif font-medium text-[24px]"
                      >
                        —
                      </p>
                    </div>
                    <div className="stat-card">
                      <p className="help-sm mb-1">Pending approval</p>
                      <p
                        id="statPendingApproval"
                        className="font-serif font-medium text-[24px]"
                        style={{ color: "var(--gold)" }}
                      >
                        —
                      </p>
                    </div>
                    <div className="stat-card">
                      <p className="help-sm mb-1">Suspended users</p>
                      <p
                        id="statSuspended"
                        className="font-serif font-medium text-[24px]"
                      >
                        —
                      </p>
                    </div>
                    <div className="stat-card">
                      <p className="help-sm mb-1">Total balances held</p>
                      <p
                        id="statTotalBalance"
                        className="font-serif font-medium text-[24px]"
                      >
                        —
                      </p>
                    </div>
                    <div className="stat-card">
                      <p className="help-sm mb-1">Pending actions</p>
                      <p
                        id="statPending"
                        className="font-serif font-medium text-[24px]"
                        style={{ color: "var(--gold)" }}
                      >
                        —
                      </p>
                    </div>
                  </div>
                  <h2 className="font-serif text-[17px] mb-3">
                    Latest pending requests
                  </h2>
                  <div className="surface overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="overviewPendingBody"></tbody>
                    </table>
                    <p
                      id="overviewPendingEmpty"
                      className="hidden p-5 text-muted2 text-[13.5px] text-center"
                    >
                      Nothing pending right now.
                    </p>
                  </div>
                </section>

                {/* ===== Users ===== */}
                <section id="sec-users" className="hidden">
                  <h1 className="text-[24px] font-serif font-medium mb-1">
                    Users
                  </h1>
                  <p className="text-muted2 text-[14px] mb-4">
                    Search, review, approve, fund, or restrict any account.
                  </p>
                  <input
                    id="userSearch"
                    className="input-field mb-5 max-w-sm"
                    placeholder="Search by name, email, or account number…"
                  />
                  <div className="surface overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Account #</th>
                          <th>Type</th>
                          <th>Balance</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="usersTableBody"></tbody>
                    </table>
                    <p
                      id="usersEmpty"
                      className="hidden p-5 text-muted2 text-[13.5px] text-center"
                    >
                      No users found.
                    </p>
                  </div>
                </section>

                {/* ===== Transaction sections ===== */}
                <section id="sec-deposits" className="hidden">
                  <h1 className="text-[24px] font-serif font-medium mb-1">
                    Deposits
                  </h1>
                  <p className="text-muted2 text-[14px] mb-4">
                    Review and approve incoming deposits.
                  </p>
                  <div className="surface overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Details</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="depositsTableBody"></tbody>
                    </table>
                    <p
                      id="depositsEmpty"
                      className="hidden p-5 text-muted2 text-[13.5px] text-center"
                    >
                      No deposit requests yet.
                    </p>
                  </div>
                </section>

                <section id="sec-transfers" className="hidden">
                  <h1 className="text-[24px] font-serif font-medium mb-1">
                    Transfers
                  </h1>
                  <p className="text-muted2 text-[14px] mb-4">
                    Review and approve outgoing transfers.
                  </p>
                  <div className="surface overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Type</th>
                          <th>Amount</th>
                          <th>Details</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="transfersTableBody"></tbody>
                    </table>
                    <p
                      id="transfersEmpty"
                      className="hidden p-5 text-muted2 text-[13.5px] text-center"
                    >
                      No transfer requests yet.
                    </p>
                  </div>
                </section>

                {/* commented withdraw section */}
                {/* <section id="sec-withdrawals" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1">Withdrawals</h1>
        <p className="text-muted2 text-[14px] mb-4">Review and approve withdrawal requests.</p>
        <div className="surface overflow-x-auto">
          <table className="admin-table"><thead><tr><th>User</th><th>Method</th><th>Amount</th><th>Details</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody id="withdrawalsTableBody"></tbody></table>
          <p id="withdrawalsEmpty" className="hidden p-5 text-muted2 text-[13.5px] text-center">No withdrawal requests yet.</p>
        </div>
      </section> */}

                <section id="sec-cards" className="hidden">
                  <h1 className="text-[24px] font-serif font-medium mb-1">
                    Card applications
                  </h1>
                  <p className="text-muted2 text-[14px] mb-4">
                    Review and approve card requests.
                  </p>
                  <div className="surface overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Card type</th>
                          <th>Fee</th>
                          <th>Details</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="cardsTableBody"></tbody>
                    </table>
                    <p
                      id="cardsEmpty"
                      className="hidden p-5 text-muted2 text-[13.5px] text-center"
                    >
                      No card applications yet.
                    </p>
                  </div>
                </section>

                <section id="sec-loans" className="hidden">
                  <h1 className="text-[24px] font-serif font-medium mb-1">
                    Loan applications
                  </h1>
                  <p className="text-muted2 text-[14px] mb-4">
                    Review and approve loan requests.
                  </p>
                  <div className="surface overflow-x-auto">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Amount</th>
                          <th>Purpose</th>
                          <th>Duration</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody id="loansTableBody"></tbody>
                    </table>
                    <p
                      id="loansEmpty"
                      className="hidden p-5 text-muted2 text-[13.5px] text-center"
                    >
                      No loan applications yet.
                    </p>
                  </div>
                </section>

                {/* ===== Deposit Settings ===== */}
                <section id="sec-depositsettings" className="hidden">
                  <h1 className="text-[24px] font-serif font-medium mb-1">
                    Site Settings
                  </h1>
                  <p className="text-muted2 text-[14px] mb-6">
                    Manage support contacts shown on the website and user
                    dashboards, plus deposit details.
                  </p>

                  <div className="surface p-5 mb-8">
                    <p className="font-serif text-[16px] mb-1">
                      Support contact
                    </p>
                    <p className="help-sm mb-4">
                      These details appear in the website footer and on users'
                      dashboards. Leave a field blank to hide that contact
                      option.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-5">
                      <div>
                        <label className="label-sm" htmlFor="contactEmail">
                          Support email
                        </label>
                        <input
                          id="contactEmail"
                          type="email"
                          className="input-field"
                          placeholder="support@example.com"
                        />
                      </div>
                      <div>
                        <label className="label-sm" htmlFor="contactTelegram">
                          Telegram username
                        </label>
                        <input
                          id="contactTelegram"
                          className="input-field"
                          placeholder="@your_support_username"
                        />
                        <p className="help-sm mt-1">
                          Enter the username, with or without @.
                        </p>
                      </div>
                    </div>
                    <button
                      id="contactSaveBtn"
                      className="btn-primary font-medium text-[13.5px] py-2.5 px-5"
                    >
                      Save contact details
                    </button>
                  </div>

                  <div className="surface p-5 mb-8">
                    <p className="font-serif text-[16px] mb-1">
                      Bank transfer details
                    </p>
                    <p className="help-sm mb-4">
                      Leave account number, account name, or currency blank to
                      keep showing each user's own — only fill these in if you
                      want every user to see the same shared values instead.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="label-sm">Bank name</label>
                        <input
                          id="dsBankName"
                          className="input-field"
                          placeholder="Aureumpay"
                        />
                      </div>
                      <div>
                        <label className="label-sm">
                          Help text shown to users
                        </label>
                        <input
                          id="dsBankHelp"
                          className="input-field"
                          placeholder="Send funds to this account, then confirm below."
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mb-5">
                      <div>
                        <label className="label-sm">
                          Account number override
                        </label>
                        <input
                          id="dsBankAccountNumber"
                          className="input-field"
                          placeholder="Leave blank to use each user's own"
                        />
                      </div>
                      <div>
                        <label className="label-sm">
                          Account name override
                        </label>
                        <input
                          id="dsBankAccountName"
                          className="input-field"
                          placeholder="Leave blank to use each user's own"
                        />
                      </div>
                      <div>
                        <label className="label-sm">Currency override</label>
                        <input
                          id="dsBankCurrency"
                          className="input-field"
                          placeholder="e.g. NGN"
                        />
                      </div>
                    </div>
                    <button
                      id="dsBankSaveBtn"
                      className="btn-primary font-medium text-[13.5px] py-2.5 px-5"
                    >
                      Save bank settings
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="font-serif text-[16px]">
                      Crypto deposit addresses
                    </p>
                    <button
                      id="dsAddCoinBtn"
                      className="btn-ghost text-[12px] font-mono uppercase tracking-[0.08em] px-4 py-2"
                    >
                      + Add coin
                    </button>
                  </div>
                  <div id="dsCoinList" className="space-y-3 mb-6"></div>

                  <div id="dsCoinForm" className="surface p-5 mb-8 hidden">
                    <p
                      id="dsCoinFormTitle"
                      className="font-serif text-[16px] mb-4"
                    >
                      Add coin
                    </p>
                    <input type="hidden" id="dsCoinId" />
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="label-sm">Coin name</label>
                        <input
                          id="dsCoinName"
                          className="input-field"
                          placeholder="Bitcoin"
                        />
                      </div>
                      <div>
                        <label className="label-sm">Ticker</label>
                        <input
                          id="dsCoinTicker"
                          className="input-field"
                          placeholder="BTC"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="label-sm">Network label</label>
                      <input
                        id="dsCoinNetwork"
                        className="input-field"
                        placeholder="Bitcoin (BTC) network"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="label-sm">Wallet address</label>
                      <input
                        id="dsCoinAddress"
                        className="input-field"
                        placeholder="bc1q…"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="label-sm">
                        Warning text shown to users
                      </label>
                      <input
                        id="dsCoinWarning"
                        className="input-field"
                        placeholder="Only send BTC to this address on the Bitcoin network."
                      />
                    </div>
                    <label className="flex items-center gap-2 mb-5 text-[13.5px] font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        id="dsCoinEnabled"
                        defaultChecked
                      />{" "}
                      Visible to users
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        id="dsCoinCancelBtn"
                        className="btn-ghost font-medium text-[13.5px] py-2.5 flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        id="dsCoinSaveBtn"
                        className="btn-primary font-medium text-[13.5px] py-2.5 flex-1"
                      >
                        Save coin
                      </button>
                    </div>
                  </div>
                </section>
              </main>
            </div>
          </div>

          {/* ============ User detail modal ============ */}
          <div
            id="userModal"
            className="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="surface modal-card p-6 w-full max-w-[580px] my-8 animate-popIn max-h-[88vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p id="umName" className="font-serif font-medium text-[19px]">
                    —
                  </p>
                  <p id="umEmail" className="text-muted2 text-[13.5px]">
                    —
                  </p>
                </div>
                <button id="umCloseBtn" className="text-muted2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="surface-2 p-3">
                  <p className="help-sm mb-0.5">Account number</p>
                  <p id="umAcctNum" className="font-mono text-[13px]">
                    —
                  </p>
                </div>
                <div className="surface-2 p-3">
                  <p className="help-sm mb-0.5">Account type</p>
                  <p
                    id="umAcctType"
                    className="font-medium text-[13.5px] capitalize"
                  >
                    —
                  </p>
                </div>
                <div className="surface-2 p-3">
                  <p className="help-sm mb-0.5">Balance</p>
                  <p id="umBalance" className="font-mono text-[13px]">
                    —
                  </p>
                </div>
                <div className="surface-2 p-3">
                  <p className="help-sm mb-0.5">Phone</p>
                  <p id="umPhone" className="font-medium text-[13.5px]">
                    —
                  </p>
                </div>
                <div className="surface-2 p-3">
                  <p className="help-sm mb-0.5">Country</p>
                  <p id="umCountry" className="font-medium text-[13.5px]">
                    —
                  </p>
                </div>
                <div className="surface-2 p-3">
                  <p className="help-sm mb-0.5">Status</p>
                  <p id="umStatus" className="font-medium text-[13.5px]">
                    —
                  </p>
                </div>
                <div className="surface-2 p-3 col-span-2">
                  <p className="help-sm mb-0.5">Address</p>
                  <p id="umAddress" className="font-medium text-[13.5px]">
                    —
                  </p>
                </div>
              </div>

              {/* Account approval */}
              <div className="surface-2 p-4 mb-4">
                <p className="font-serif text-[15px] mb-1">Account approval</p>
                <p className="help-sm mb-3">
                  New accounts start inactive. Approve once you've verified the
                  user's details to unlock their dashboard — deposits,
                  transfers, and withdrawals stay locked until then.
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    id="umActiveDot"
                    className="w-2.5 h-2.5 rounded-full"
                  ></span>
                  <span id="umActiveText" className="text-[13.5px] font-medium">
                    —
                  </span>
                </div>
                <button
                  id="umApproveBtn"
                  className="btn-mint font-medium text-[13.5px] py-2.5 w-full"
                >
                  Approve &amp; activate account
                </button>
                <button
                  id="umDeactivateBtn"
                  className="btn-ghost font-medium text-[13.5px] py-2.5 w-full hidden"
                >
                  Set back to inactive
                </button>
              </div>
              {/* Administration */}
              <div className="surface-2 p-4 mb-4">
                <p className="font-serif text-[15px] mb-1">Administration</p>
                <p className="help-sm mb-3">
                  Only users with existing admin access can grant it to others.
                  The custom <code>admin</code> claim is the real database-rules
                  gate and can only be minted through the Admin SDK
                  (scripts/set-admin.js).
                </p>
                <div className="flex gap-2">
                  <button
                    id="umPromoteBtn"
                    className="btn-mint font-medium text-[13.5px] py-2.5 flex-1"
                  >
                    Make admin
                  </button>
                  <button
                    id="umDemoteBtn"
                    className="btn-ghost font-medium text-[13.5px] py-2.5 flex-1 hidden"
                  >
                    Remove admin
                  </button>
                </div>
              </div>

              {/* Account approval */}

              <div className="surface-2 p-4 mb-4">
                <p className="font-serif text-[15px] mb-3">Adjust balance</p>
                <div className="flex gap-2 mb-3">
                  <input
                    id="umAdjustAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                  <select
                    id="umAdjustDirection"
                    className="input-field max-w-[120px]"
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                    <option value="refund">Refund</option>
                  </select>
                </div>
                <input
                  id="umAdjustNote"
                  className="input-field mb-3"
                  placeholder="Note (optional, e.g. bonus, correction)"
                />
                <button
                  id="umAdjustBtn"
                  className="btn-primary font-medium text-[13.5px] py-2.5 w-full"
                >
                  Apply adjustment
                </button>
              </div>

              {/* Withdrawal security PINs */}
              <div className="surface-2 p-4 mb-4">
                <p className="font-serif text-[15px] mb-1">
                  Withdrawal security PINs
                </p>
                <p className="help-sm mb-3">
                  Auto-generated when the account was created. The user enters
                  these 4 PINs, in order, before a withdrawal can go through.
                  Share updates with the user out of band — never all at once,
                  and never over an insecure channel.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="label-sm">PIN 1</label>
                    <input
                      id="umPin1"
                      maxLength="4"
                      inputMode="numeric"
                      className="input-field pin-input"
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <label className="label-sm">PIN 2</label>
                    <input
                      id="umPin2"
                      maxLength="4"
                      inputMode="numeric"
                      className="input-field pin-input"
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <label className="label-sm">PIN 3</label>
                    <input
                      id="umPin3"
                      maxLength="4"
                      inputMode="numeric"
                      className="input-field pin-input"
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <label className="label-sm">PIN 4</label>
                    <input
                      id="umPin4"
                      maxLength="4"
                      inputMode="numeric"
                      className="input-field pin-input"
                      placeholder="0000"
                    />
                  </div>
                </div>
                <p id="umPinsError" className="hidden error-sm mb-2"></p>
                <div className="flex gap-2">
                  <button
                    id="umRegeneratePinsBtn"
                    type="button"
                    className="btn-ghost text-[12.5px] font-medium px-4 py-2.5 flex-1"
                  >
                    Regenerate all
                  </button>
                  <button
                    id="umSavePinsBtn"
                    type="button"
                    className="btn-primary text-[12.5px] font-medium px-4 py-2.5 flex-1"
                  >
                    Save PINs
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <button
                  id="umSuspendBtn"
                  className="btn-rose font-medium text-[13.5px] py-2.5 flex-1"
                >
                  Suspend account
                </button>
                <button
                  id="umUnsuspendBtn"
                  className="btn-mint font-medium text-[13.5px] py-2.5 flex-1 hidden"
                >
                  Unsuspend account
                </button>
              </div>

              <button
                id="umDeleteBtn"
                className="btn-ghost font-medium text-[13.5px] py-2.5 w-full mb-5"
                style={{
                  color: "var(--error)",
                  borderColor: "rgba(179,67,43,.3)",
                }}
              >
                Delete account permanently
              </button>

              <p className="font-serif text-[15px] mb-2">Recent transactions</p>
              <div
                id="umTxList"
                className="surface-2 divide-y divide-[var(--border)] max-h-[220px] overflow-y-auto"
              >
                <p className="p-4 text-muted2 text-[13px] text-center">
                  No transactions yet.
                </p>
              </div>
            </div>
          </div>

          <div
            id="toastWrap"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center px-4 w-full sm:w-auto"
          ></div>
        </div>
      </div>
    </PageLayout>
  );
}
