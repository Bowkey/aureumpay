import PageLayout from "../components/PageLayout.jsx";
import PageStyles from "../components/PageStyles.jsx";
import PageScript from "../components/PageScript.jsx";
import { mountPage } from "../scripts/register.js";
import css from "../styles/register.css?inline";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <PageLayout page="register">
      <PageStyles css={css} />
      <PageScript mount={mountPage} />
      <div className="page page-register">
        <div>

{/* ============ HEADER ============ */}
<header className="max-w-[860px] mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
  <Link to="/" className="flex items-baseline gap-2">
    <span className="font-serif italic-serif text-2xl">Aureumpay</span>
    <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--forest)]/40">Est. 2019</span>
  </Link>
  <p className="text-sm text-[var(--forest)]/60">
    Have an account? <Link to="/login" className="underline-hover font-medium" style={{color: 'var(--forest)'}}>Log in</Link>
  </p>
</header>

<main className="max-w-[860px] mx-auto px-6 pb-24">

  <div className="mb-10 sm:mb-2">
    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-3">Open an account</p>
    <h1 className="font-serif font-medium text-3xl sm:text-[2.6rem] tracking-tight">A few minutes, held to a higher standard.</h1>
  </div>

  {/* ============ STEPPER ============ */}
  <div className="my-10 sm:my-12">
    {/* desktop / tablet stepper */}
    <div className="hidden sm:flex items-center">
      <div className="step-item flex items-center gap-3" data-step="1">
        <span className="step-num">01</span>
        <span className="step-label font-mono text-[11px] uppercase tracking-[0.13em]">Personal</span>
      </div>
      <div className="step-line flex-1 h-px mx-4" data-line="1"></div>
      <div className="step-item flex items-center gap-3" data-step="2">
        <span className="step-num">02</span>
        <span className="step-label font-mono text-[11px] uppercase tracking-[0.13em]">Address</span>
      </div>
      <div className="step-line flex-1 h-px mx-4" data-line="2"></div>
      <div className="step-item flex items-center gap-3" data-step="3">
        <span className="step-num">03</span>
        <span className="step-label font-mono text-[11px] uppercase tracking-[0.13em]">Security</span>
      </div>
      <div className="step-line flex-1 h-px mx-4" data-line="3"></div>
      <div className="step-item flex items-center gap-3" data-step="4">
        <span className="step-num">04</span>
        <span className="step-label font-mono text-[11px] uppercase tracking-[0.13em]">Review</span>
      </div>
    </div>

    {/* mobile stepper */}
    <div className="sm:hidden">
      <p id="mobileStepLabel" className="font-mono text-[11px] uppercase tracking-[0.14em] mb-3" style={{color: 'var(--leaf)'}}>Step 1 of 4 — Personal</p>
      <div className="h-1 bg-[var(--line)] rounded-full overflow-hidden">
        <div id="mobileProgressBar" className="h-full transition-all duration-500" style={{width: '25%', background: 'var(--leaf-bright)'}}></div>
      </div>
    </div>
  </div>

  {/* ============ FORM CARD ============ */}
  <div className="border border-[var(--line)] rounded-md p-6 sm:p-10" style={{background: 'var(--paper)'}}>

    {/* ---------- STEP 1 — PERSONAL ---------- */}
    <section id="panel1" className="fade-step">
      <h2 className="font-serif text-2xl mb-1">Tell us about you.</h2>
      <p className="text-sm text-[var(--forest)]/55 mb-8">This is what will appear on your card and statements.</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">First name</label>
          <input id="firstName" type="text" placeholder="Jane" className="field-input"/>
          <p id="firstNameMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Last name</label>
          <input id="lastName" type="text" placeholder="Doe" className="field-input"/>
          <p id="lastNameMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Email</label>
          <input id="email" type="email" placeholder="you@email.com" className="field-input"/>
          <p id="emailMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Phone number</label>
          <input id="phone" type="tel" className="field-input"/>
          <p id="phoneMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Date of birth</label>
          <input id="dob" type="date" className="field-input"/>
          <p id="dobMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Country of residence</label>
          <select id="countryResidence" className="field-select"><option value="">Select country</option></select>
          <p id="countryResidenceMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
      </div>

      <div className="flex justify-end mt-9">
        <button type="button" data-next className="sweep px-8 py-3.5 text-white text-sm font-medium tracking-wide" style={{background: 'var(--forest)'}}>Continue</button>
      </div>
    </section>

    {/* ---------- STEP 2 — ADDRESS ---------- */}
    <section id="panel2" className="fade-step hidden">
      <h2 className="font-serif text-2xl mb-1">Where should statements go?</h2>
      <p className="text-sm text-[var(--forest)]/55 mb-8">A physical address — no P.O. boxes, our card carrier gets confused.</p>

      <div>
        <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Street address</label>
        <input id="address1" type="text" placeholder="14 Marina Road" className="field-input"/>
        <p id="address1Msg" className="field-msg text-xs mt-1.5 hidden"></p>
      </div>

      <div className="mt-5">
        <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Apartment, suite, etc. <span className="normal-case text-[var(--forest)]/35">(optional)</span></label>
        <input id="address2" type="text" placeholder="Unit 4B" className="field-input"/>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">City</label>
          <input id="city" type="text" placeholder="Pheonix" className="field-input"/>
          <p id="cityMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">State / Province</label>
          <input id="state" type="text" placeholder="Arizona State" className="field-input"/>
          <p id="stateMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-5">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Postal code</label>
          <input id="postalCode" type="text" placeholder="100001" className="field-input"/>
          <p id="postalCodeMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Country</label>
          <select id="countryAddress" className="field-select"><option value="">Select country</option></select>
          <p id="countryAddressMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
      </div>

      <div className="flex justify-between mt-9">
        <button type="button" data-back className="ghost-btn px-8 py-3.5 text-sm font-medium tracking-wide border border-[var(--line)]">Back</button>
        <button type="button" data-next className="sweep px-8 py-3.5 text-white text-sm font-medium tracking-wide" style={{background: 'var(--forest)'}}>Continue</button>
      </div>
    </section>

    {/* ---------- STEP 3 — SECURITY ---------- */}
    <section id="panel3" className="fade-step hidden">
      <h2 className="font-serif text-2xl mb-1">Choose your account, secure it.</h2>
      <p className="text-sm text-[var(--forest)]/55 mb-8">You can add more accounts later — start with the one you'll use most.</p>

      <div className="grid sm:grid-cols-3 gap-4" id="accountTypeGroup">
        <label className="acct-type-card selected" data-value="checking">
          <input type="radio" name="accountType" value="checking" className="sr-only" defaultChecked />
          <div className="flex items-start justify-between">
            <span className="font-serif text-lg">Checking</span>
            <svg className="acct-type-check" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="var(--leaf)"/><path d="M4.5 8.2 7 10.5 11.5 5.5" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-xs text-[var(--forest)]/55 mt-2">Everyday spending</p>
        </label>
        <label className="acct-type-card" data-value="savings">
          <input type="radio" name="accountType" value="savings" className="sr-only"/>
          <div className="flex items-start justify-between">
            <span className="font-serif text-lg">Savings</span>
            <svg className="acct-type-check" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="var(--leaf)"/><path d="M4.5 8.2 7 10.5 11.5 5.5" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-xs text-[var(--forest)]/55 mt-2">4.1% weekly interest</p>
        </label>
        <label className="acct-type-card" data-value="business">
          <input type="radio" name="accountType" value="business" className="sr-only"/>
          <div className="flex items-start justify-between">
            <span className="font-serif text-lg">Business</span>
            <svg className="acct-type-check" width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="var(--leaf)"/><path d="M4.5 8.2 7 10.5 11.5 5.5" stroke="var(--paper)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-xs text-[var(--forest)]/55 mt-2">For registered entities</p>
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Password</label>
          <div className="relative">
            <input id="password" type="password" placeholder="At least 8 characters" className="field-input pr-11"/>
            <button type="button" id="togglePassword" aria-label="Show password" className="eye-btn absolute right-3 top-1/2 -translate-y-1/2">
              <svg id="eyeIcon1" width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4"/></svg>
            </button>
          </div>
          <div className="flex gap-1.5 mt-2.5" id="strengthBars">
            <div className="strength-seg"></div><div className="strength-seg"></div><div className="strength-seg"></div>
          </div>
          <p id="passwordMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/50 block mb-2">Confirm password</label>
          <div className="relative">
            <input id="confirmPassword" type="password" placeholder="Repeat your password" className="field-input pr-11"/>
            <button type="button" id="toggleConfirmPassword" aria-label="Show password" className="eye-btn absolute right-3 top-1/2 -translate-y-1/2">
              <svg id="eyeIcon2" width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4"/></svg>
            </button>
          </div>
          <p id="confirmPasswordMsg" className="field-msg text-xs mt-1.5 hidden"></p>
        </div>
      </div>

      <div className="flex items-start gap-2.5 mt-7">
        <input id="agreeTerms" type="checkbox" className="checkbox-custom mt-0.5"/>
        <label htmlFor="agreeTerms" className="text-sm text-[var(--forest)]/65 cursor-pointer select-none">
          I agree to the <a href="#" className="underline-hover font-medium" style={{color: 'var(--forest)'}}>Terms of Service</a> and <a href="#" className="underline-hover font-medium" style={{color: 'var(--forest)'}}>Privacy Policy</a>.
        </label>
      </div>
      <p id="agreeTermsMsg" className="field-msg text-xs mt-1.5 hidden"></p>

      <div className="flex justify-between mt-9">
        <button type="button" data-back className="ghost-btn px-8 py-3.5 text-sm font-medium tracking-wide border border-[var(--line)]">Back</button>
        <button type="button" data-next className="sweep px-8 py-3.5 text-white text-sm font-medium tracking-wide" style={{background: 'var(--forest)'}}>Continue</button>
      </div>
    </section>

    {/* ---------- STEP 4 — REVIEW ---------- */}
    <section id="panel4" className="fade-step hidden">
      <h2 className="font-serif text-2xl mb-1">Check it over.</h2>
      <p className="text-sm text-[var(--forest)]/55 mb-8">Your account number is generated the moment you confirm.</p>

      <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">

        <div className="py-5 flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/40 mb-2">Personal</p>
            <p id="reviewName" className="font-medium">—</p>
            <p id="reviewEmail" className="text-sm text-[var(--forest)]/55 mt-0.5">—</p>
            <p id="reviewPhone" className="text-sm text-[var(--forest)]/55">—</p>
            <p id="reviewDob" className="text-sm text-[var(--forest)]/55">—</p>
          </div>
          <button type="button" data-goto="1" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] shrink-0" style={{color: 'var(--leaf)'}}>Edit</button>
        </div>

        <div className="py-5 flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/40 mb-2">Address</p>
            <p id="reviewAddress" className="text-sm leading-relaxed max-w-sm">—</p>
          </div>
          <button type="button" data-goto="2" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] shrink-0" style={{color: 'var(--leaf)'}}>Edit</button>
        </div>

        <div className="py-5 flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--forest)]/40 mb-2">Account</p>
            <p id="reviewAccountType" className="font-medium capitalize">—</p>
            <p className="text-sm text-[var(--forest)]/55 mt-0.5">Password set &middot; ready to secure</p>
          </div>
          <button type="button" data-goto="3" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] shrink-0" style={{color: 'var(--leaf)'}}>Edit</button>
        </div>

      </div>

      <p id="submitErrorMsg" className="field-msg text-sm mt-6 hidden"></p>

      <div className="flex justify-between mt-9">
        <button type="button" data-back className="ghost-btn px-8 py-3.5 text-sm font-medium tracking-wide border border-[var(--line)]">Back</button>
        <button type="button" id="submitBtn" className="sweep flex items-center justify-center gap-2 px-8 py-3.5 text-white text-sm font-medium tracking-wide" style={{background: 'var(--forest)'}}>
          <span id="submitBtnLabel">Create account</span>
        </button>
      </div>
    </section>

  </div>
</main>

{/* ============ SUCCESS MODAL ============ */}
<div id="successOverlay">
  <div id="successCard" className="w-full max-w-[420px] rounded-md p-8 sm:p-10 text-center" style={{background: 'var(--paper)'}}>
    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{background: 'rgba(37,99,200,.1)'}}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="13" stroke="var(--leaf)" strokeWidth="1.6"/>
        <path className="check-circle-path" d="M9 15.5 13 19.5 21 10.5" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-3">Account created</p>
    <h2 className="font-serif text-3xl tracking-tight mb-3">Welcome to Aureumpay, <span id="successFirstName" style={{color: 'var(--leaf)'}}>there</span>.</h2>
    <p className="text-sm text-[var(--forest)]/60 mb-7">Your account number has been generated. Keep it somewhere safe — you'll need it for transfers. Your account starts <strong>inactive</strong> until our team reviews and approves it.</p>

    <div className="border border-[var(--line)] rounded-md p-5 mb-8" style={{background: 'var(--paper-2)'}}>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--forest)]/45 mb-2">Account number</p>
      <div className="flex items-center justify-center gap-3">
        <p id="successAccountNumber" className="font-mono text-xl sm:text-2xl tracking-[0.12em]">—</p>
        <button type="button" id="copyAccountNumber" aria-label="Copy account number" className="eye-btn shrink-0">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="7" y="7" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 13V4a1 1 0 0 1 1-1h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>

    <Link to="/dashboard" className="sweep w-full flex items-center justify-center text-white text-sm font-medium tracking-wide py-3.5" style={{background: 'var(--forest)'}}>Go to your dashboard</Link>
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
