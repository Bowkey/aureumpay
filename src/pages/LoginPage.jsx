import PageLayout from "../components/PageLayout.jsx";
import PageStyles from "../components/PageStyles.jsx";
import PageScript from "../components/PageScript.jsx";
import { mountPage } from "../scripts/login.js";
import css from "../styles/login.css?inline";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <PageLayout page="login">
      <PageStyles css={css} />
      <PageScript mount={mountPage} />
      <div className="page page-login">
        <div>

<div className="min-h-screen lg:grid lg:grid-cols-2">

  {/* ============ LEFT — brand panel, hidden below lg ============ */}
  <div className="relative hidden lg:flex flex-col justify-between overflow-hidden px-14 py-14" style={{background: 'linear-gradient(160deg, var(--forest) 0%, var(--forest-2) 60%, #0A2118 100%)'}}>
    <div className="grain"></div>
    <div className="watermark absolute -bottom-10 -left-6 select-none">Aureumpay</div>

    <Link to="/" className="relative flex items-baseline gap-2">
      <span className="font-serif italic-serif text-2xl text-[var(--paper)]">Aureumpay</span>
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--paper)]/40">Est. 2019</span>
    </Link>

    <div className="relative max-w-md">
      <span className="font-serif text-6xl leading-none select-none" style={{color: 'var(--leaf-bright)', opacity: '.35'}}>&ldquo;</span>
      <p className="font-serif italic-serif text-3xl leading-snug text-[var(--paper)] -mt-4">
        Banking held to a higher standard — one balance, total clarity.
      </p>
      <div className="flex items-center gap-3 mt-8">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs shrink-0" style={{background: 'rgba(251,250,246,.12)', color: 'var(--paper)'}}>MO</div>
        <div>
          <p className="text-sm text-[var(--paper)]">Maya Okonkwo</p>
          <p className="font-mono text-[11px] text-[var(--paper)]/45">Founder, Studio Fern</p>
        </div>
      </div>
    </div>

    <p className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--paper)]/35">
      FDIC insured · 256-bit encryption · 4.9★ from 38,000 members
    </p>
  </div>

  {/* ============ RIGHT — auth panel ============ */}
  <div className="relative flex items-center justify-center px-6 py-12 sm:py-16">
    <div className="w-full max-w-[400px]">

      {/* logo, shown only when the brand panel is hidden */}
      <Link to="/" className="fade-up lg:hidden flex items-baseline gap-2 justify-center mb-10">
        <span className="font-serif italic-serif text-2xl">Aureumpay</span>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--forest)]/40">Est. 2019</span>
      </Link>

      <div className="relative">

        {/* ---------- LOG IN PANEL ---------- */}
        <div id="loginPanel" className="panel-swap">
          <p className="fade-up font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-4" style={{animationDelay: '.05s'}}>Welcome back</p>
          <h1 className="fade-up font-serif font-medium text-3xl sm:text-4xl tracking-tight mb-2" style={{animationDelay: '.1s'}}>Log in to Aureumpay.</h1>
          <p className="fade-up text-[var(--forest)]/60 text-sm mb-8" style={{animationDelay: '.15s'}}>See where your money's been, and where it's headed.</p>

          <form id="loginForm" className="fade-up space-y-5" style={{animationDelay: '.2s'}} noValidate>
            <div>
              <label htmlFor="loginEmail" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Email</label>
              <input id="loginEmail" type="email" required autoComplete="email" placeholder="you@email.com" className="field-input"/>
              <p id="loginEmailMsg" className="field-msg text-xs mt-1.5 hidden" style={{color: 'var(--error)'}}></p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="loginPassword" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50">Password</label>
                <button type="button" id="forgotLink" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em]" style={{color: 'var(--leaf)'}}>Forgot password?</button>
              </div>
              <div className="relative">
                <input id="loginPassword" type="password" required autoComplete="current-password" placeholder="••••••••" className="field-input pr-11"/>
                <button type="button" id="togglePassword" aria-label="Show password" className="eye-btn absolute right-3 top-1/2 -translate-y-1/2">
                  <svg id="eyeIcon" width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4"/></svg>
                </button>
              </div>
              <p id="loginPasswordMsg" className="field-msg text-xs mt-1.5 hidden" style={{color: 'var(--error)'}}></p>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input id="rememberMe" type="checkbox" className="checkbox-custom"/>
              <label htmlFor="rememberMe" className="text-sm text-[var(--forest)]/65 cursor-pointer select-none">Stay signed in on this device</label>
            </div>

            <button type="submit" id="loginBtn" className="sweep w-full flex items-center justify-center gap-2 text-white text-sm font-medium tracking-wide py-3.5" style={{background: 'var(--forest)'}}>
              <span id="loginBtnLabel">Log in</span>
            </button>
          </form>

          <p className="fade-up text-center text-sm text-[var(--forest)]/60 mt-8" style={{animationDelay: '.25s'}}>
            New to Aureumpay? <Link to="/register" className="underline-hover font-medium" style={{color: 'var(--forest)'}}>Open an account</Link>
          </p>
        </div>

        {/* ---------- FORGOT PASSWORD PANEL ---------- */}
        <div id="resetPanel" className="panel-swap panel-hidden">
          <button type="button" id="backToLogin" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 hover:text-[var(--forest)] transition-colors mb-8">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M12.5 4 6 10l6.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to log in
          </button>

          <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-4">Reset password</p>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-tight mb-2">Let's get you back in.</h1>
          <p className="text-[var(--forest)]/60 text-sm mb-8">Enter the email on your account and we'll send a link to reset your password.</p>

          <form id="resetForm" className="space-y-5" noValidate>
            <div>
              <label htmlFor="resetEmail" className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Email</label>
              <input id="resetEmail" type="email" required autoComplete="email" placeholder="you@email.com" className="field-input"/>
              <p id="resetEmailMsg" className="field-msg text-xs mt-1.5 hidden" style={{color: 'var(--error)'}}></p>
            </div>

            <button type="submit" id="resetBtn" className="sweep w-full flex items-center justify-center gap-2 text-white text-sm font-medium tracking-wide py-3.5" style={{background: 'var(--forest)'}}>
              <span id="resetBtnLabel">Send reset link</span>
            </button>
          </form>
        </div>

        {/* ---------- RESET SENT CONFIRMATION ---------- */}
        <div id="sentPanel" className="panel-swap panel-hidden text-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{background: 'rgba(30,143,82,.1)'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6.5 12 13l8-6.5M4 6.5h16v11H4v-11Z" stroke="var(--leaf)" strokeWidth="1.6" strokeLinejoin="round"/></svg>
          </div>
          <h1 className="font-serif font-medium text-3xl tracking-tight mb-2">Check your email.</h1>
          <p className="text-[var(--forest)]/60 text-sm mb-1">We've sent a reset link to</p>
          <p id="sentEmailDisplay" className="font-medium mb-8"></p>
          <button type="button" id="backToLoginFromSent" className="sweep w-full text-white text-sm font-medium tracking-wide py-3.5" style={{background: 'var(--forest)'}}>Back to log in</button>
          <p className="text-sm text-[var(--forest)]/50 mt-6">
            Didn't get it? <button type="button" id="resendLink" className="underline-hover font-medium" style={{color: 'var(--leaf)'}}>Resend</button>
          </p>
        </div>

      </div>
    </div>
  </div>
</div>

<div id="toast" className="toast"></div>


{/*Start of Tawk.to Script*/}

{/*End of Tawk.to Script*/}
</div>
      </div>
    </PageLayout>
  );
}
