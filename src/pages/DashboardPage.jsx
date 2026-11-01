import PageLayout from "../components/PageLayout.jsx";
import PageStyles from "../components/PageStyles.jsx";
import PageScript from "../components/PageScript.jsx";
import { mountPage } from "../scripts/dashboard.js";
import css from "../styles/dashboard.css?inline";

export default function DashboardPage() {
  return (
    <PageLayout page="dashboard">
      <PageStyles css={css} />
      <PageScript mount={mountPage} />
      <div className="page page-dashboard">
        <div>

{/* ============ Auth gate / loading ============ */}
<div id="authGate" className="min-h-screen flex flex-col items-center justify-center gap-4">
  <svg className="animate-spinslow" width="30" height="30" viewBox="0 0 24 24" fill="none"><circle className="spinner-sm" cx="12" cy="12" r="9" stroke="#2563C8" strokeWidth="3"/><path d="M21 12a9 9 0 0 0-9-9" stroke="#2563C8" strokeWidth="3" strokeLinecap="round"/></svg>
  <p className="text-muted2 text-[13px] font-mono uppercase tracking-[0.14em]">Loading your dashboard…</p>
</div>

{/* ============ App shell ============ */}
<div id="appShell" className="hidden min-h-screen lg:grid lg:grid-cols-[248px_1fr]">

  {/* Sidebar (desktop) / Drawer (mobile) */}
  <div id="drawerBackdrop" className="hidden fixed inset-0 bg-black/40 z-30 lg:hidden"></div>
  <aside id="sidebar" className="fixed lg:sticky top-0 left-0 h-screen w-[250px] -translate-x-full lg:translate-x-0 transition-transform duration-300 z-40 surface lg:border-r lg:border-l-0 border-r flex flex-col p-5">
    <div className="flex items-center justify-between mb-8">
      <a href="#" className="flex items-baseline gap-2">
        <span className="font-serif italic-serif text-xl">Aureumpay</span>
      </a>
      <button id="closeDrawerBtn" className="lg:hidden text-muted2"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
    </div>

    <nav className="flex-1 space-y-1" id="navList">
      <div className="nav-item active" data-section="overview">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12 12 3l9 9M5 10v10h14V10"/></svg> Overview
      </div>
      <div className="nav-item" data-section="deposit">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21V7m0 14-4.5-4.5M12 21l4.5-4.5M4 4h16"/></svg> <span data-i18n="nav.deposit">Deposit</span>
      </div>
      <div className="nav-item" data-section="transfer">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h13M7 7l4-4M7 7l4 4M17 17H4M17 17l-4-4M17 17l-4 4"/></svg> <span data-i18n="nav.transfer">Transfer</span>
      </div>
      {/*
      <div className="nav-item" data-section="withdraw">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/></svg> <span data-i18n="nav.withdraw">Withdraw</span>
      </div>
      */}
      <div className="nav-item" data-section="cards">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 9.5h19"/></svg> <span data-i18n="nav.cards">Cards</span>
      </div>
      <div className="nav-item" data-section="loans">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> <span data-i18n="nav.loans">Loans</span>
      </div>
      <div className="nav-item" data-section="history">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.4 2.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 3"/></svg> <span data-i18n="nav.history">History</span>
      </div>
      <div className="nav-item" data-section="settings">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg> <span data-i18n="nav.settings">Settings</span>
      </div>
      <div className="nav-item" data-section="profile">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg> <span data-i18n="nav.profile">Profile</span>
      </div>
    </nav>

    <button id="logoutBtn" className="nav-item mt-2" style={{color: 'var(--error)'}}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg> <span data-i18n="nav.logout">Log out</span>
    </button>
  </aside>

  <div className="flex flex-col min-h-screen">
    {/* Top bar */}
    <header className="lg:hidden sticky top-0 z-20 surface flex items-center justify-between px-4 py-3.5" style={{borderRadius: 0}}>
      <button id="openDrawerBtn" className="text-muted2"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
      <p id="mobileTitle" className="font-serif text-[15px]">Overview</p>
      <div className="w-9 h-9 rounded-full bg-leaf/15 flex items-center justify-center font-serif text-[var(--leaf)] text-[13px]" id="avatarChip">–</div>
    </header>

    <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-10">

      {/* ===== Overview ===== */}
      <section id="sec-overview">
        <p className="hidden lg:block font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--leaf)] mb-2" data-i18n="overview.title">Overview</p>
        <h1 className="hidden lg:block font-serif font-medium text-[28px] mb-6" id="greetingText">Welcome back.</h1>

        <div id="pendingApprovalBanner" className="hidden surface p-4 mb-6 flex items-start gap-3" style={{borderLeft: '3px solid var(--gold)'}}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{background: 'rgba(201,138,44,.15)'}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>
          </div>
          <div>
            <p className="font-serif text-[15px] mb-0.5">Your account is pending approval</p>
            <p className="help-sm">Deposits, transfers, and withdrawals are locked until our team activates your account. Everything else here works as usual — this typically doesn't take long.</p>
          </div>
        </div>

        <div id="supportContactCard" className="hidden surface p-5 mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--leaf)] mb-2">Support</p>
          <h2 className="font-serif text-[18px] mb-3">Need help? Contact us.</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px]">
            <a id="dashboardContactEmail" href="#" className="underline text-[var(--leaf)] hidden">Email support</a>
            <a id="dashboardContactTelegram" href="#" target="_blank" rel="noreferrer" className="underline text-[var(--leaf)] hidden">Telegram support</a>
          </div>
        </div>

        <div className="hero-card p-6 sm:p-8 mb-6">
          <div id="acctStatusPill" className="status-pill relative z-10 mb-4" style={{background: 'rgba(255,255,255,.14)'}}>
            <span id="acctStatusDot" className="w-1.5 h-1.5 rounded-full" style={{background: '#4B8EF5'}}></span>
            <span id="acctStatusText" className="text-[10.5px] font-mono uppercase tracking-[0.1em] text-white">Active</span>
          </div>
          <p className="relative z-10 text-white/70 text-[11px] font-mono uppercase tracking-[0.18em] mb-2" data-i18n="overview.balance">Available balance</p>
          <p id="balanceDisplay" className="relative z-10 font-serif font-medium text-[32px] sm:text-[38px] mb-5">—</p>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-white/55 text-[10.5px] font-mono uppercase tracking-[0.14em]">Account number</p>
              <p id="acctNumberChip" className="font-mono font-medium text-[14.5px] tracking-wide">—</p>
            </div>
            <span id="currencyChip" className="text-[12px] font-mono font-medium bg-white/15 rounded-full px-3 py-1">—</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          <button className="quick-action surface p-4 flex flex-col items-center gap-2 text-center" data-goto="deposit">
            <span id="qaDepositLock" className="hidden absolute top-2 right-2 w-5 h-5 rounded-full items-center justify-center" style={{background: 'rgba(201,138,44,.15)'}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2563C8" strokeWidth="2"><path d="M12 21V7m0 14-4.5-4.5M12 21l4.5-4.5M4 4h16"/></svg>
            <span className="text-[12.5px] font-medium" data-i18n="nav.deposit">Deposit</span>
          </button>
          <button className="quick-action surface p-4 flex flex-col items-center gap-2 text-center" data-goto="transfer">
            <span id="qaTransferLock" className="hidden absolute top-2 right-2 w-5 h-5 rounded-full items-center justify-center" style={{background: 'rgba(201,138,44,.15)'}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2563C8" strokeWidth="2"><path d="M7 7h13M7 7l4-4M7 7l4 4M17 17H4M17 17l-4-4M17 17l-4 4"/></svg>
            <span className="text-[12.5px] font-medium" data-i18n="nav.transfer">Transfer</span>
          </button>
          <button className="quick-action surface p-4 flex flex-col items-center gap-2 text-center" data-goto="withdraw">
            <span id="qaWithdrawLock" className="hidden absolute top-2 right-2 w-5 h-5 rounded-full items-center justify-center" style={{background: 'rgba(201,138,44,.15)'}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </span>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2563C8" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/></svg>
            <span className="text-[12.5px] font-medium" data-i18n="nav.withdraw">Withdraw</span>
          </button>
          <button className="quick-action surface p-4 flex flex-col items-center gap-2 text-center" data-goto="cards">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2563C8" strokeWidth="2"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 9.5h19"/></svg>
            <span className="text-[12.5px] font-medium" data-i18n="cards.apply">Apply for card</span>
          </button>
          <button className="quick-action surface p-4 flex flex-col items-center gap-2 text-center" data-goto="loans">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2563C8" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span className="text-[12.5px] font-medium" data-i18n="loans.apply">Apply for loan</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-[18px]" data-i18n="overview.recent">Recent activity</h2>
          <button className="text-[var(--leaf)] text-[12px] font-mono uppercase tracking-[0.1em]" data-goto="history" data-i18n="overview.viewAll">View all</button>
        </div>
        <div id="recentActivity" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="overview.empty">No activity yet.</p>
        </div>
      </section>

      {/* ===== Deposit ===== */}
      <section id="sec-deposit" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="deposit.title">Deposit</h1>
        <p className="text-muted2 text-[14px] mb-5" data-i18n="deposit.sub">Fund your account via bank transfer or crypto.</p>

        <div id="depositLockedNotice" className="hidden surface p-6 mb-8 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(201,138,44,.15)'}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
          <p className="font-serif text-[16px] mb-1">Deposits are locked for now</p>
          <p className="help-sm max-w-sm mx-auto">Your account is pending approval. Once our team activates it, you'll be able to deposit funds here.</p>
        </div>

        <div id="depositActionArea">
        <div className="flex gap-2 mb-6 flex-wrap">
          <button className="tab-btn active" data-deposit-tab="bank" data-i18n="deposit.bankTab">Bank transfer</button>
          <button className="tab-btn" data-deposit-tab="crypto" data-i18n="deposit.cryptoTab">Crypto</button>
        </div>

        <div id="depositAlert" className="hidden mb-4 rounded px-4 py-3 text-[13px] font-medium"></div>

        {/* Bank deposit panel */}
        <div id="depositBankPanel" className="surface p-5 mb-8">
          <p className="font-serif text-[16px] mb-1" data-i18n="deposit.yourDetails">Your account details</p>
          <p className="help-sm mb-4" id="depositBankHelpText" data-i18n="deposit.bankHelp">Send funds to this account, then confirm below.</p>

          <div className="space-y-3 mb-5">
            <div className="surface-2 p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="help-sm mb-0.5" data-i18n="deposit.bankNameLbl">Bank name</p><p id="depBankName" className="font-medium text-[14.5px] truncate">Aureumpay</p></div>
              <button type="button" id="copyDepBankBtn" className="copy-chip btn-ghost text-[11px] font-mono uppercase tracking-[0.08em] rounded-full px-3 py-1.5 flex-shrink-0">Copy</button>
            </div>
            <div className="surface-2 p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="help-sm mb-0.5" data-i18n="deposit.acctNumLbl">Account number</p><p id="depAcctNumber" className="font-mono font-medium text-[14.5px] tracking-wide truncate">—</p></div>
              <button type="button" id="copyDepAcctBtn" className="copy-chip btn-ghost text-[11px] font-mono uppercase tracking-[0.08em] rounded-full px-3 py-1.5 flex-shrink-0">Copy</button>
            </div>
            <div className="surface-2 p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="help-sm mb-0.5" data-i18n="deposit.acctNameLbl">Account name</p><p id="depAcctName" className="font-medium text-[14.5px] truncate">—</p></div>
              <button type="button" id="copyDepNameBtn" className="copy-chip btn-ghost text-[11px] font-mono uppercase tracking-[0.08em] rounded-full px-3 py-1.5 flex-shrink-0">Copy</button>
            </div>
            <div className="surface-2 p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0"><p className="help-sm mb-0.5" data-i18n="deposit.currencyLbl">Currency</p><p id="depCurrency" className="font-medium text-[14.5px] truncate">—</p></div>
            </div>
          </div>

          <form id="bankDepositForm" className="space-y-4 border-t border-soft2 pt-4">
            <p className="font-serif text-[15px]" data-i18n="deposit.confirmTitle">Already sent the funds?</p>
            <div><label className="label-sm" data-i18n="deposit.amountSent">Amount deposited</label><input required id="bdAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="bdAmountError" className="hidden error-sm"></p></div>
            <div><label className="label-sm" data-i18n="deposit.ref">Reference / sender name (optional)</label><input id="bdRef" className="input-field" placeholder="e.g. transfer reference" /></div>
            <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="deposit.done">I've made this deposit</button>
          </form>
        </div>

        {/* Crypto deposit panel */}
        <div id="depositCryptoPanel" className="surface p-5 mb-8 hidden">
          <p className="font-serif text-[16px] mb-1" data-i18n="deposit.selectCoin">Select a coin</p>
          <p className="help-sm mb-4" data-i18n="deposit.cryptoHelp">Send the exact amount to the address below, then confirm.</p>

          <div id="cryptoCoinGrid" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5"></div>

          <div id="cryptoAddressBox" className="hidden surface-2 p-4 mb-5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img id="cryptoQr" alt="QR code" className="w-32 h-32 rounded-md border border-soft2 bg-white p-1.5 flex-shrink-0" />
              <div className="min-w-0 w-full">
                <p className="help-sm mb-1"><span id="cryptoNetworkLabel"></span> <span data-i18n="deposit.walletAddress">wallet address</span></p>
                <p id="cryptoAddress" className="font-mono text-[12.5px] break-all mb-2">—</p>
                <button type="button" id="copyCryptoBtn" className="btn-ghost text-[11.5px] font-mono uppercase tracking-[0.06em] rounded-full px-3.5 py-2">Copy address</button>
                <p className="help-sm mt-2" id="cryptoWarning"></p>
              </div>
            </div>
          </div>

          <form id="cryptoDepositForm" className="space-y-4 border-t border-soft2 pt-4 hidden">
            <p className="font-serif text-[15px]" data-i18n="deposit.confirmTitle">Already sent the funds?</p>
            <div><label className="label-sm" data-i18n="deposit.amountSentUsd">Amount deposited (USD equivalent)</label><input required id="cdAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="cdAmountError" className="hidden error-sm"></p></div>
            <div><label className="label-sm" data-i18n="deposit.txHash">Transaction hash (optional)</label><input id="cdHash" className="input-field" placeholder="0x… or tx id" /></div>
            <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="deposit.done">I've made this deposit</button>
          </form>
        </div>
        </div>

        <h2 className="font-serif text-[17px] mb-3" data-i18n="deposit.history">Deposit history</h2>
        <div id="depositHistory" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="overview.empty">No activity yet.</p>
        </div>
      </section>

      {/* ===== Transfer ===== */}
      <section id="sec-transfer" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="nav.transfer">Transfer</h1>
        <p className="text-muted2 text-[14px] mb-5" data-i18n="transfer.sub">Send money locally or internationally.</p>

        <div id="transferLockedNotice" className="hidden surface p-6 mb-8 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(201,138,44,.15)'}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
          <p className="font-serif text-[16px] mb-1">Transfers are locked for now</p>
          <p className="help-sm max-w-sm mx-auto">Your account is pending approval. Once our team activates it, you'll be able to send transfers.</p>
        </div>

        <div id="transferActionArea">
        <div className="flex gap-2 mb-6">
          <button className="tab-btn active" data-transfer-tab="local" data-i18n="transfer.local">Local transfer</button>
          <button className="tab-btn" data-transfer-tab="intl" data-i18n="transfer.intl">International transfer</button>
        </div>

        <div id="transferAlert" className="hidden mb-4 rounded px-4 py-3 text-[13px] font-medium"></div>

        <form id="localTransferForm" className="surface p-5 mb-8 space-y-4">
          <div><label className="label-sm" data-i18n="transfer.bankName">Recipient bank name</label><input required id="ltBankName" className="input-field" placeholder="Wells Fargo" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm" data-i18n="transfer.acctNum">Recipient account number</label><input required id="ltAccountNumber" className="input-field" placeholder="0123456789" /></div>
            <div><label className="label-sm" data-i18n="transfer.acctName">Recipient account name</label><input required id="ltAccountName" className="input-field" placeholder="Jane Doe" /></div>
          </div>
          <div><label className="label-sm" data-i18n="transfer.amount">Amount</label><input required id="ltAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="ltAmountError" className="hidden error-sm"></p></div>
          <div><label className="label-sm" data-i18n="transfer.narration">Narration (optional)</label><input id="ltNarration" className="input-field" placeholder="What's this for?" /></div>
          <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="transfer.send">Send transfer</button>
        </form>

        <form id="intlTransferForm" className="surface p-5 mb-8 space-y-4 hidden">
          <div><label className="label-sm" data-i18n="transfer.recName">Recipient full name</label><input required id="itName" className="input-field" placeholder="Jane Doe" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm" data-i18n="transfer.recCountry">Recipient country</label><select required id="itCountry" className="input-field"><option value="" disabled data-i18n="common.select">Select country</option></select></div>
            <div><label className="label-sm" data-i18n="transfer.bankName">Recipient bank name</label><input required id="itBankName" className="input-field" placeholder="Chase Bank" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm" data-i18n="transfer.swift">SWIFT / BIC code</label><input required id="itSwift" className="input-field" placeholder="CHASUS33" /></div>
            <div><label className="label-sm" data-i18n="transfer.iban">IBAN / account number</label><input required id="itAccountNumber" className="input-field" placeholder="GB29 NWBK 6016 1331 9268 19" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm" data-i18n="transfer.amount">Amount</label><input required id="itAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="itAmountError" className="hidden error-sm"></p></div>
            <div><label className="label-sm" data-i18n="transfer.destCurrency">Destination currency</label><select required id="itCurrency" className="input-field"><option value="" disabled data-i18n="common.select">Select currency</option></select></div>
          </div>
          <div>
            <label className="label-sm" data-i18n="transfer.purpose">Purpose of transfer</label>
            <select id="itPurpose" className="input-field">
              <option data-i18n="transfer.p1">Family support</option>
              <option data-i18n="transfer.p2">Business payment</option>
              <option data-i18n="transfer.p3">Education</option>
              <option data-i18n="transfer.p4">Other</option>
            </select>
          </div>
          <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="transfer.sendIntl">Send international transfer</button>
        </form>
        </div>

        <h2 className="font-serif text-[17px] mb-3" data-i18n="transfer.history">Transfer history</h2>
        <div id="transferHistory" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="overview.empty">No activity yet.</p>
        </div>
      </section>

      {/* ===== Withdraw ===== */}
      <section id="sec-withdraw" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="nav.withdraw">Withdraw</h1>
        <p className="text-muted2 text-[14px] mb-5" data-i18n="withdraw.sub">Cash out to PayPal, Cash App, or your bank.</p>

        <div id="withdrawLockedNotice" className="hidden surface p-6 mb-8 text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'rgba(201,138,44,.15)'}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          </div>
          <p className="font-serif text-[16px] mb-1">Withdrawals are locked for now</p>
          <p className="help-sm max-w-sm mx-auto">Your account is pending approval. Once our team activates it, you'll be able to withdraw funds.</p>
        </div>

        <div id="withdrawActionArea">
        <div id="withdrawMethodGrid" className="grid grid-cols-3 gap-3 mb-6"></div>

        <div id="withdrawAlert" className="hidden mb-4 rounded px-4 py-3 text-[13px] font-medium"></div>

        <form id="paypalForm" className="surface p-5 mb-8 space-y-4">
          <div><label className="label-sm">PayPal email</label><input required type="email" id="ppEmail" className="input-field" placeholder="you@paypal.com" /></div>
          <div><label className="label-sm" data-i18n="transfer.amount">Amount</label><input required id="ppAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="ppAmountError" className="hidden error-sm"></p></div>
          <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="withdraw.request">Request withdrawal</button>
        </form>

        <form id="cashappForm" className="surface p-5 mb-8 space-y-4 hidden">
          <div><label className="label-sm">$Cashtag</label><input required id="caTag" className="input-field" placeholder="$janedoe" /></div>
          <div><label className="label-sm" data-i18n="transfer.amount">Amount</label><input required id="caAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="caAmountError" className="hidden error-sm"></p></div>
          <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="withdraw.request">Request withdrawal</button>
        </form>

        <form id="bankWithdrawForm" className="surface p-5 mb-8 space-y-4 hidden">
          <div><label className="label-sm">Account holder name</label><input required id="bwName" className="input-field" placeholder="Jane Doe" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm">Bank name</label><input required id="bwBank" className="input-field" placeholder="Wells Fargo" /></div>
            <div><label className="label-sm">Account number</label><input required id="bwAccountNumber" className="input-field" placeholder="0123456789" /></div>
          </div>
          <div><label className="label-sm">Routing / sort code</label><input required id="bwRouting" className="input-field" placeholder="011000015" /></div>
          <div><label className="label-sm" data-i18n="transfer.amount">Amount</label><input required id="bwAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /><p id="bwAmountError" className="hidden error-sm"></p></div>
          <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="withdraw.request">Request withdrawal</button>
        </form>
        </div>

        <h2 className="font-serif text-[17px] mb-3" data-i18n="withdraw.history">Withdrawal history</h2>
        <div id="withdrawHistory" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="overview.empty">No activity yet.</p>
        </div>
      </section>

      {/* ===== Cards ===== */}
      <section id="sec-cards" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="nav.cards">Cards</h1>
        <p className="text-muted2 text-[14px] mb-5" data-i18n="cards.sub">Apply for a virtual or physical card.</p>

        <div id="cardsAlert" className="hidden mb-4 rounded px-4 py-3 text-[13px] font-medium"></div>

        <div id="cardTypeGrid" className="grid sm:grid-cols-2 gap-5 mb-8"></div>

        <form id="cardApplyForm" className="surface p-5 mb-8 space-y-4 hidden">
          <p className="font-serif text-[16px]">Confirm application: <span id="cardApplyTypeName" className="text-[var(--leaf)]"></span></p>
          <div><label className="label-sm">Name on card</label><input required id="cardholderName" className="input-field" /></div>
          <div><label className="label-sm">Billing address</label><input required id="cardBillingAddress" className="input-field" /></div>
          <div className="flex gap-3">
            <button type="button" id="cancelCardApplyBtn" className="btn-ghost font-medium text-[14.5px] py-3 flex-1" data-i18n="common.cancel">Cancel</button>
            <button type="submit" className="btn-primary font-medium text-[14.5px] py-3 flex-1" data-i18n="cards.submitApp">Submit application</button>
          </div>
        </form>

        <h2 className="font-serif text-[17px] mb-3" data-i18n="cards.yours">Your cards &amp; applications</h2>
        <div id="issuedCardsGrid" className="grid sm:grid-cols-2 gap-5 mb-5"></div>
        <div id="cardsHistory" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="cards.empty">No cards yet.</p>
        </div>
      </section>

      {/* ===== Loans ===== */}
      <section id="sec-loans" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="nav.loans">Loans</h1>
        <p className="text-muted2 text-[14px] mb-5" data-i18n="loans.sub">Apply for a loan — funds arrive once approved.</p>

        <div id="loansAlert" className="hidden mb-4 rounded px-4 py-3 text-[13px] font-medium"></div>

        <form id="loanForm" className="surface p-5 mb-8 space-y-4">
          <div><label className="label-sm" data-i18n="loans.amount">Loan amount</label><input required id="loanAmount" type="number" min="1" step="0.01" className="input-field" placeholder="0.00" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm" data-i18n="loans.purpose">Purpose</label>
              <select id="loanPurpose" className="input-field">
                <option data-i18n="loans.p1">Business</option>
                <option data-i18n="loans.p2">Education</option>
                <option data-i18n="loans.p3">Medical</option>
                <option data-i18n="loans.p4">Personal</option>
              </select>
            </div>
            <div>
              <label className="label-sm" data-i18n="loans.duration">Duration</label>
              <select id="loanDuration" className="input-field" defaultValue="12">
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
              </select>
            </div>
          </div>
          <div><label className="label-sm" data-i18n="loans.income">Monthly income (optional)</label><input id="loanIncome" type="number" min="0" step="0.01" className="input-field" placeholder="0.00" /></div>
          <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="loans.apply">Apply for loan</button>
        </form>

        <h2 className="font-serif text-[17px] mb-3" data-i18n="loans.history">Loan history</h2>
        <div id="loansHistory" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="overview.empty">No activity yet.</p>
        </div>
      </section>

      {/* ===== Transaction History ===== */}
      <section id="sec-history" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="history.title">Transaction History</h1>
        <p className="text-muted2 text-[14px] mb-1" data-i18n="history.sub">Every transaction on your account, from first to most recent.</p>
        <p className="text-muted2 text-[12.5px] mb-5" id="historyTzNote"></p>

        <div className="surface p-4 mb-5 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="label-sm" data-i18n="history.filterType">Type</label>
            <select id="historyTypeFilter" className="input-field">
              <option value="all" data-i18n="history.allTypes">All types</option>
              <option value="deposit" data-i18n="history.tDeposit">Deposits</option>
              <option value="transfer" data-i18n="history.tTransfer">Transfers</option>
              <option value="withdrawal" data-i18n="history.tWithdrawal">Withdrawals</option>
              <option value="card_application" data-i18n="history.tCard">Card applications</option>
              <option value="loan_application" data-i18n="history.tLoan">Loan applications</option>
              <option value="admin_adjustment" data-i18n="history.tAdjustment">Account adjustments</option>
              <option value="admin_refund" data-i18n="history.tRefund">Refunds</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="label-sm" data-i18n="history.filterStatus">Status</label>
            <select id="historyStatusFilter" className="input-field">
              <option value="all" data-i18n="history.allStatuses">All statuses</option>
              <option value="pending" data-i18n="history.stPending">Pending</option>
              <option value="approved" data-i18n="history.stApproved">Approved</option>
              <option value="rejected" data-i18n="history.stRejected">Rejected</option>
            </select>
          </div>
        </div>

        <div id="fullHistoryList" className="surface divide-y divide-[var(--border)]">
          <p className="p-5 text-muted2 text-[13.5px] text-center" data-i18n="overview.empty">No activity yet.</p>
        </div>
      </section>

      {/* ===== Settings ===== */}
      <section id="sec-settings" className="hidden">
        <h1 className="text-[24px] font-serif font-medium mb-1" data-i18n="nav.settings">Settings</h1>
        <p className="text-muted2 text-[14px] mb-6" data-i18n="settings.sub">Personalize how your dashboard looks and reads.</p>

        <div className="surface p-5 mb-5">
          <p className="font-serif text-[15.5px] mb-3" data-i18n="settings.theme">Appearance</p>
          <div className="flex gap-3">
            <button className="theme-btn tab-btn flex-1" data-theme="light" data-i18n="settings.light">Light</button>
            <button className="theme-btn tab-btn flex-1" data-theme="dark" data-i18n="settings.dark">Dark</button>
          </div>
        </div>

        <div className="surface p-5 mb-5">
          <p className="font-serif text-[15.5px] mb-3" data-i18n="settings.font">Font</p>
          <select id="fontSelect" className="input-field">
            <option value="Inter">Inter (default)</option>
            <option value="Poppins">Poppins</option>
            <option value="Roboto">Roboto</option>
            <option value="Nunito">Nunito</option>
            <option value="Merriweather">Merriweather</option>
          </select>
          <p className="help-sm mt-2">Headings stay set in Aureumpay's serif — this changes body text only.</p>
        </div>

        <div className="surface p-5 mb-5">
          <p className="font-serif text-[15.5px] mb-3" data-i18n="settings.language">Language</p>
          <select id="languageSelect" className="input-field">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="yo">Yorùbá</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
          </select>
        </div>

        <div className="surface p-5 mb-5">
          <p className="font-serif text-[15.5px] mb-1" data-i18n="settings.pin">Transaction PIN</p>
          <p className="help-sm mb-3" id="pinStatusText">Not set yet — you'll be asked to create one on your first transfer.</p>
          <button id="resetPinBtn" className="btn-ghost font-mono uppercase tracking-[0.08em] text-[11.5px] py-2.5 px-4">Reset PIN</button>
        </div>

        <div className="surface p-5">
          <p className="font-serif text-[15.5px] mb-1">Withdrawal</p>
          <p className="help-sm">Four PINs, entered one after another, are required to complete a withdrawal. These were generated automatically when your account was created and are managed by Aureumpay support — contact them if you don't have yours or need a reminder.</p>
        </div>
      </section>

      {/* ===== Profile ===== */}
      <section id="sec-profile" className="hidden">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[24px] font-serif font-medium" data-i18n="nav.profile">Profile</h1>
          <button id="editProfileBtn" className="btn-ghost font-mono uppercase tracking-[0.08em] text-[11px] py-2 px-4" data-i18n="common.edit">Edit</button>
        </div>
        <p className="text-muted2 text-[14px] mb-6" data-i18n="profile.sub">Your personal and account details.</p>

        <div id="profileAlert" className="hidden mb-4 rounded px-4 py-3 text-[13px] font-medium"></div>

        <form id="profileForm" className="surface p-5 space-y-4">
          <div><label className="label-sm">Full name</label><input disabled id="pFullName" className="input-field" /></div>
          <div><label className="label-sm">Email</label><input disabled id="pEmail" className="input-field" /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm">Phone number</label><input disabled id="pPhone" className="input-field" /></div>
            <div><label className="label-sm">Date of birth</label><input disabled id="pDob" type="date" className="input-field" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="label-sm">Country</label><select disabled id="pCountry" className="input-field"></select></div>
            <div><label className="label-sm">Currency</label><select disabled id="pCurrency" className="input-field"></select></div>
          </div>
          <div><label className="label-sm">Street address</label><input disabled id="pAddress" className="input-field" /></div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="label-sm">City</label><input disabled id="pCity" className="input-field" /></div>
            <div><label className="label-sm">State</label><input disabled id="pState" className="input-field" /></div>
            <div><label className="label-sm">Postal code</label><input disabled id="pPostal" className="input-field" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label-sm">Employment status</label>
              <select disabled id="pEmployment" className="input-field">
                <option>Employed full-time</option><option>Employed part-time</option><option>Self-employed</option>
                <option>Student</option><option>Unemployed</option><option>Retired</option>
              </select>
            </div>
            <div><label className="label-sm">Occupation</label><input disabled id="pOccupation" className="input-field" /></div>
          </div>
          <div id="profileSaveRow" className="hidden pt-2">
            <button type="submit" className="btn-primary font-medium text-[15px] py-3.5 w-full" data-i18n="common.save">Save changes</button>
          </div>
        </form>
      </section>

    </main>
  </div>
</div>

{/* ============ Suspended gate ============ */}
<div id="suspendedGate" className="hidden fixed inset-0 z-[70] min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{background: 'var(--bg)'}}>
  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{background: 'rgba(179,67,43,.1)'}}>
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B3432B" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
  </div>
  <h1 className="font-serif font-medium text-[24px] mb-2">Your account has been suspended</h1>
  <p className="text-muted2 text-[14.5px] max-w-sm mb-7 leading-relaxed">For your security, access to your Aureumpay account has been temporarily restricted. Please contact customer care to resolve this.</p>
  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
    <a href="mailto:support@aureumpay.example" className="btn-primary font-medium text-[14px] py-3 flex-1 flex items-center justify-center gap-2">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      Chat customer care
    </a>
    <button id="suspendedLogoutBtn" className="btn-ghost font-medium text-[14px] py-3 flex-1">Log out</button>
  </div>
</div>

{/* ============ PIN modal (transfers — single user-created PIN) ============ */}
<div id="pinModal" className="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
  <div className="surface modal-card p-6 w-full max-w-[360px] text-center animate-popIn">
    <p id="pinModalTitle" className="font-serif text-[19px] mb-1.5">Create your transaction PIN</p>
    <p id="pinModalSub" className="text-muted2 text-[13.5px] mb-5">You'll use this to approve transfers.</p>

    <div id="pinEntryRow" className="flex justify-center gap-2.5 mb-3">
      <input maxLength="1" inputMode="numeric" className="pin-box pin-digit" data-idx="0" />
      <input maxLength="1" inputMode="numeric" className="pin-box pin-digit" data-idx="1" />
      <input maxLength="1" inputMode="numeric" className="pin-box pin-digit" data-idx="2" />
      <input maxLength="1" inputMode="numeric" className="pin-box pin-digit" data-idx="3" />
    </div>
    <div id="pinConfirmRow" className="hidden flex-col items-center gap-2 mb-3">
      <p className="help-sm mb-1">Confirm PIN</p>
      <div className="flex justify-center gap-2.5">
        <input maxLength="1" inputMode="numeric" className="pin-box pin-confirm-digit" data-idx="0" />
        <input maxLength="1" inputMode="numeric" className="pin-box pin-confirm-digit" data-idx="1" />
        <input maxLength="1" inputMode="numeric" className="pin-box pin-confirm-digit" data-idx="2" />
        <input maxLength="1" inputMode="numeric" className="pin-box pin-confirm-digit" data-idx="3" />
      </div>
    </div>
    <p id="pinError" className="hidden error-sm mb-2"></p>

    <div className="flex gap-3 mt-4">
      <button id="pinCancelBtn" className="btn-ghost font-medium text-[14px] py-3 flex-1" data-i18n="common.cancel">Cancel</button>
      <button id="pinSubmitBtn" className="btn-primary font-medium text-[14px] py-3 flex-1">Continue</button>
    </div>
  </div>
</div>

{/* ============ Withdrawal security PIN modal (4 sequential clearance stages) ============ */}
<div id="wpinModal" className="hidden fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
  <div className="surface modal-card p-6 w-full max-w-[360px] text-center animate-popIn">
    {/* These IDs allow your JavaScript to dynamically update the text as the user advances through the stages */}
    <p id="wpinModalTitle" className="font-serif text-[19px] mb-1.5">Stage 1: IMF Clearance Code</p>
    <p id="wpinModalSub" className="text-muted2 text-[13.5px] mb-5">Enter your 4-digit International Monetary Fund code to clear this transfer.</p>

    <div className="flex justify-center gap-2.5 mb-4">
      <input maxLength="1" inputMode="numeric" className="pin-box wpin-digit" data-idx="0" />
      <input maxLength="1" inputMode="numeric" className="pin-box wpin-digit" data-idx="1" />
      <input maxLength="1" inputMode="numeric" className="pin-box wpin-digit" data-idx="2" />
      <input maxLength="1" inputMode="numeric" className="pin-box wpin-digit" data-idx="3" />
    </div>


    <p id="wpinError" className="hidden error-sm mb-2"></p>

    <div className="flex gap-3 mt-2">
      <button id="wpinCancelBtn" className="btn-ghost font-medium text-[14px] py-3 flex-1">Cancel</button>
      <button id="wpinSubmitBtn" className="btn-primary font-medium text-[14px] py-3 flex-1">Continue</button>
    </div>
  </div>
</div>

<div id="toastWrap" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center px-4 w-full sm:w-auto"></div>


{/*Start of Tawk.to Script*/}

{/*End of Tawk.to Script*/}
</div>
      </div>
    </PageLayout>
  );
}
