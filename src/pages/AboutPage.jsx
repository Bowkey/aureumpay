import PageLayout from "../components/PageLayout.jsx";
import PageStyles from "../components/PageStyles.jsx";
import PageScript from "../components/PageScript.jsx";
import { mountPage } from "../scripts/about.js";
import css from "../styles/about.css?inline";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <PageLayout page="about">
      <PageStyles css={css} />
      <PageScript mount={mountPage} />
      <div className="page page-about">
        <div>

{/* ============ PRELOADER ============ */}
<div id="preloader" aria-hidden="true">
  <div className="preload-mark">
    <span className="preload-word">Aureumpay</span>
    <div className="preload-rule"></div>
    <span className="preload-caption">Turning to the front page</span>
  </div>
</div>

<div className="relative">
<div className="grain"></div>

{/* ============ MASTHEAD ============ */}
<header className="relative z-30 max-w-[1400px] mx-auto px-6 md:px-12 pt-8">
  <nav className="flex items-center justify-between">
    <Link to="/" className="flex items-baseline gap-2">
      <span className="font-serif text-2xl tracking-tight">Aureumpay</span>
      <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--forest)]/40">Est. 2019</span>
    </Link>
    <div className="hidden md:flex items-center gap-10 text-xs font-mono uppercase tracking-[0.12em] text-[var(--forest)]/65">
      <Link to="/" className="underline-hover">Personal</Link>
      <Link to="/" className="underline-hover">Business</Link>
      <Link to="/#features" className="underline-hover">Pricing</Link>
      <Link to="/about" className="underline-hover" style={{color: 'var(--forest)'}}>About</Link>
    </div>
    <div className="flex items-center gap-4 sm:gap-6">
      <Link to="/login" className="hidden sm:inline text-xs font-mono uppercase tracking-[0.12em] underline-hover">Log in</Link>
      <Link to="/register" className="sweep hidden sm:inline-flex items-center text-xs font-mono uppercase tracking-[0.12em] text-white px-6 py-3 border border-[var(--forest)]" style={{background: 'var(--forest)'}}>
        Open account
      </Link>
      <button id="burgerBtn" aria-label="Open menu" aria-expanded="false" className="burger md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]">
        <span className="burger-line block w-6 h-[1.5px]" style={{background: 'var(--forest)'}}></span>
        <span className="burger-line block w-6 h-[1.5px]" style={{background: 'var(--forest)'}}></span>
        <span className="burger-line block w-6 h-[1.5px]" style={{background: 'var(--forest)'}}></span>
      </button>
    </div>
  </nav>
  <div className="rule mt-7"></div>

  <div id="mobilePanel" className="mobile-panel md:hidden">
    <div className="flex flex-col gap-6 py-8 text-sm font-mono uppercase tracking-[0.12em]">
      <Link to="/" className="underline-hover w-fit">Personal</Link>
      <Link to="/" className="underline-hover w-fit">Business</Link>
      <Link to="/#features" className="underline-hover w-fit">Pricing</Link>
      <Link to="/about" className="underline-hover w-fit" style={{color: 'var(--leaf)'}}>About</Link>
      <Link to="/login" className="underline-hover w-fit">Log in</Link>
      <Link to="/register" className="sweep inline-flex items-center justify-center text-white px-6 py-3.5 border border-[var(--forest)] w-full" style={{background: 'var(--forest)'}}>
        Open account
      </Link>
    </div>
  </div>
</header>

{/* ============ HERO ============ */}
<section className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-6 pb-24 overflow-hidden">

  <div id="watermark" className="watermark absolute -top-6 md:top-2 left-1/2 -translate-x-1/2 leading-none whitespace-nowrap select-none">
    About
  </div>

  <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-14 items-end pt-16 md:pt-24">

    <div>
      <p className="fade-up font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7" style={{animationDelay: '.05s'}}>
        001 — Our Story
      </p>
      <h1 className="fade-up font-serif font-medium leading-[0.96] tracking-tight" style={{animationDelay: '.18s', fontSize: 'clamp(2.75rem, 8.5vw, 5rem)'}}>
        An account we'd
        <br/>
        actually want
        <br/>
        <span className="italic-serif" style={{color: 'var(--leaf)'}}>ourselves.</span>
      </h1>
      <p className="fade-up mt-8 text-lg text-[var(--forest)]/65 max-w-md leading-relaxed" style={{animationDelay: '.32s'}}>
        Aureumpay started as a complaint, not a business plan. Three overdraft fees in one month, a hold-music apology, and a decision to just build the account we kept wishing existed.
      </p>

      <div className="fade-up mt-10 flex flex-wrap items-center gap-5" style={{animationDelay: '.45s'}}>
        <Link to="/register" className="sweep px-8 py-4 text-white text-sm font-medium tracking-wide" style={{background: 'var(--forest)'}}>
          Open your account
        </Link>
        <a href="#principles" className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide">
          <span className="w-11 h-11 rounded-full border border-[var(--forest)]/25 flex items-center justify-center group-hover:border-[var(--forest)] transition-colors">▾</span>
          Read what we believe
        </a>
      </div>

      <div className="fade-up mt-14 sm:mt-16 grid grid-cols-3 gap-6 sm:flex sm:items-center sm:gap-10 max-w-lg" style={{animationDelay: '.6s'}}>
        <div>
          <p className="font-serif text-2xl sm:text-3xl"><span className="countup" data-target="2019" data-decimals="0">0</span></p>
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--forest)]/45 mt-2">Founded</p>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[var(--line)]"></div>
        <div>
          <p className="font-serif text-2xl sm:text-3xl"><span className="countup" data-target="260" data-decimals="0">0</span><span className="italic-serif" style={{color: 'var(--leaf)'}}>k</span></p>
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--forest)]/45 mt-2">Members</p>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[var(--line)]"></div>
        <div>
          <p className="font-serif text-2xl sm:text-3xl">$<span className="countup" data-target="1.9" data-decimals="1">0</span><span className="italic-serif" style={{color: 'var(--leaf)'}}>B</span></p>
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--forest)]/45 mt-2">Deposits protected</p>
        </div>
      </div>
    </div>

    {/* Right: a note from the founder, in the same ledger-card language as the homepage statement */}
    <div className="fade-up relative" style={{animationDelay: '.4s'}}>
      <div id="ledgerCard" className="ledger-card p-8 sm:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--forest)]/45 mb-6">A note, from the founder</p>
        <p className="font-serif italic-serif text-xl sm:text-2xl leading-snug" style={{color: 'var(--forest)'}}>
          "I opened four accounts trying to dodge one overdraft fee. That was the whole idea, honestly — build the bank I kept wishing existed, and stop apologizing for the one I had."
        </p>
        <div className="mt-8 rule"></div>
        <div className="mt-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-mono text-sm" style={{background: 'var(--forest)', color: 'var(--paper)'}}>AR</div>
          <div>
            <p className="signature text-lg" style={{color: 'var(--forest)'}}>Alex Rivera</p>
            <p className="font-mono text-[11px] text-[var(--forest)]/45 uppercase tracking-[0.1em] mt-0.5">Founder &amp; CEO, Aureumpay</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>
</div>

{/* ============ ORIGIN ============ */}
<section id="origin" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="reveal grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16 items-start">
    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)]">
      002 — Where it started
    </p>
    <div className="max-w-2xl">
      <h2 className="font-serif font-medium leading-[1.05] text-3xl sm:text-4xl lg:text-[2.6rem] tracking-tight mb-8">
        Nobody set out to start a bank. We set out to stop being <span className="italic-serif" style={{color: 'var(--leaf)'}}>annoyed.</span>
      </h2>
      <div className="space-y-6 text-[var(--forest)]/70 leading-relaxed">
        <p>In 2018, Alex Rivera was running a small design studio and doing what most business owners do: juggling three accounts across two banks, none of which spoke to each other, all of which found new fees to invent. A missed transfer triggered an overdraft charge, then a second one for the "insufficient funds" notice about the first.</p>
        <p>The call to sort it out took forty minutes, most of it hold music. The apology, when it finally came, changed nothing — the fees stayed. That afternoon became the first page of a notebook that eventually became Aureumpay: a running list of everything a bank does that it has no good reason to do.</p>
        <p>Eighteen months later, with two former bank examiners and a partner bank willing to build something stricter than regulation required, Aureumpay opened its first hundred accounts by invitation only — mostly friends of friends, all of them warned it might break. It didn't. The waitlist that followed grew for two years before we let it grow fast.</p>
      </div>
    </div>
  </div>
</section>

{/* ============ PRINCIPLES — itemized ledger, same device as the homepage feature list ============ */}
<section id="principles" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="reveal grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16 items-start mb-16">
    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)]">
      003 — What we believe
    </p>
    <h2 className="font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight max-w-2xl">
      Five rules we've never
      <span className="italic-serif" style={{color: 'var(--leaf)'}}>quietly</span> broken.
    </h2>
  </div>

  <div className="border-t border-[var(--line)]">

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2">
      <span className="entry-num font-serif text-2xl text-[var(--forest)]/30">01</span>
      <h3 className="font-serif text-2xl">No fine print</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">If a policy needs a footnote to defend it, we rewrite the policy — not the footnote. Every statement is written to be read, not decoded.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--forest)]/35 uppercase tracking-wide justify-self-end">Since day one</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.08s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--forest)]/30">02</span>
      <h3 className="font-serif text-2xl">Slow before big</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">We ran on a waitlist for two years before opening up, because a bank that breaks under its own growth breaks its members first.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--forest)]/35 uppercase tracking-wide justify-self-end">Since day one</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.16s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--forest)]/30">03</span>
      <h3 className="font-serif text-2xl">A person, always</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">Call us and a person picks up — not a queue, not a bot pretending to be one. That was true at account one hundred, and it's true at account 260,000.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--forest)]/35 uppercase tracking-wide justify-self-end">Since day one</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.24s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--forest)]/30">04</span>
      <h3 className="font-serif text-2xl">Money you understand</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">Every fee is explained before you pay it, in plain language, or there is no fee. We test our own statements on people who've never opened a bank account.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--forest)]/35 uppercase tracking-wide justify-self-end">Since day one</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 px-2 -mx-2" style={{transitionDelay: '.32s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--forest)]/30">05</span>
      <h3 className="font-serif text-2xl">Held like our own</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">An open complaint doesn't wait for morning. Every account, every balance, every flagged charge is handled the way we'd want our own handled.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--forest)]/35 uppercase tracking-wide justify-self-end">Since day one</span>
    </div>

  </div>
</section>

{/* ============ TIMELINE — same ledger-row device, repurposed as milestones ============ */}
<section id="timeline" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="reveal grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16 items-start mb-16">
    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)]">
      004 — Milestones
    </p>
    <h2 className="font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight max-w-2xl">
      Seven years, kept in the <span className="italic-serif" style={{color: 'var(--leaf)'}}>ledger.</span>
    </h2>
  </div>

  <div className="border-t border-[var(--line)]">

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2">
      <span className="entry-num font-mono text-lg text-[var(--forest)]/30">2019</span>
      <h3 className="font-serif text-2xl">Aureumpay opens, invitation only</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">One hundred accounts, mostly friends of friends, all warned it might break. It didn't.</p>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.06s'}}>
      <span className="entry-num font-mono text-lg text-[var(--forest)]/30">2021</span>
      <h3 className="font-serif text-2xl">Public waitlist opens</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">Two years of quiet growth ends; the waitlist crosses 40,000 names in its first month.</p>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.12s'}}>
      <span className="entry-num font-mono text-lg text-[var(--forest)]/30">2022</span>
      <h3 className="font-serif text-2xl">The Aureumpay Card ships</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">No rotating categories, no portal to sign into — reward multipliers that just work in the background.</p>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.18s'}}>
      <span className="entry-num font-mono text-lg text-[var(--forest)]/30">2023</span>
      <h3 className="font-serif text-2xl">Business accounts launch</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">Built for the exact frustration that started it all — treasury, payroll, and invoicing without three separate logins.</p>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr] gap-4 md:gap-10 items-center py-8 md:py-10 px-2 -mx-2" style={{transitionDelay: '.24s'}}>
      <span className="entry-num font-mono text-lg text-[var(--forest)]/30">2026</span>
      <h3 className="font-serif text-2xl">260,000 members, one balance each</h3>
      <p className="text-[var(--forest)]/60 text-sm leading-relaxed max-w-md">Still answering the phone ourselves. Still no monthly fee. Still the same five rules from the first notebook.</p>
    </div>

  </div>
</section>

{/* ============ LEADERSHIP ============ */}
<section id="leadership" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-14 md:mb-16">
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7">
        005 — Leadership
      </p>
      <h2 className="font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight max-w-xl">
        The people who keep the <span className="italic-serif" style={{color: 'var(--leaf)'}}>ledger</span> honest.
      </h2>
    </div>
    <p className="text-[var(--forest)]/55 text-sm max-w-xs">Four of us signed the founding paperwork. All four still read every complaint personally.</p>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="reveal ledger-card p-7 flex flex-col" style={{transitionDelay: '.06s'}}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 font-mono text-sm" style={{background: 'var(--forest)', color: 'var(--paper)'}}>AR</div>
      <p className="font-serif text-xl mb-1">Alex Rivera</p>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--leaf)] mb-4">Founder &amp; CEO</p>
      <p className="text-sm text-[var(--forest)]/60 leading-relaxed">Ran a design studio before this. Still answers escalated complaints personally, most weeks.</p>
    </div>

    <div className="reveal ledger-card p-7 flex flex-col" style={{transitionDelay: '.12s'}}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 font-mono text-sm" style={{background: 'var(--paper-2)', border: '1px solid var(--line)', color: 'var(--forest)'}}>NB</div>
      <p className="font-serif text-xl mb-1">Nadia Boström</p>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--leaf)] mb-4">Chief Risk Officer</p>
      <p className="text-sm text-[var(--forest)]/60 leading-relaxed">Fourteen years as a bank examiner before joining. Writes the rules she used to enforce.</p>
    </div>

    <div className="reveal ledger-card p-7 flex flex-col" style={{transitionDelay: '.18s'}}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 font-mono text-sm" style={{background: 'var(--paper-2)', border: '1px solid var(--line)', color: 'var(--forest)'}}>TO</div>
      <p className="font-serif text-xl mb-1">Theo Osei</p>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--leaf)] mb-4">Head of Product</p>
      <p className="text-sm text-[var(--forest)]/60 leading-relaxed">Believes every screen should survive being read aloud to a stranger. Usually right.</p>
    </div>

    <div className="reveal ledger-card p-7 flex flex-col" style={{transitionDelay: '.24s'}}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 font-mono text-sm" style={{background: 'var(--paper-2)', border: '1px solid var(--line)', color: 'var(--forest)'}}>JM</div>
      <p className="font-serif text-xl mb-1">Jules Mercer</p>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--leaf)] mb-4">Head of Support</p>
      <p className="text-sm text-[var(--forest)]/60 leading-relaxed">Built the "a person, always" promise into the org chart before it was a slogan.</p>
    </div>

  </div>
</section>

{/* ============ CTA BANNER ============ */}
<section className="section-fade relative">
  <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-24">
    <div className="reveal flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-10 px-8 py-12 sm:px-12 sm:py-16" style={{background: 'var(--forest)', color: 'var(--paper)'}}>
      <div className="max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4" style={{color: 'var(--mint)'}}>006 — Join the ledger</p>
        <h2 className="font-serif font-medium text-3xl sm:text-4xl leading-tight">
          Come write the next chapter with <span className="italic-serif" style={{color: 'var(--leaf-bright)'}}>us.</span>
        </h2>
        <p className="mt-4 text-[var(--paper)]/65 leading-relaxed">Whether that's opening an account or opening a laptop on our team — we're hiring across risk, product, and support.</p>
      </div>
      <div className="flex flex-wrap gap-4 shrink-0">
        <Link to="/register" className="sweep sweep-dark inline-flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] text-white px-7 py-4 border border-[var(--paper)]/30">
          Open an account
        </Link>
        <a href="#" className="inline-flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.12em] px-7 py-4 border border-[var(--paper)]/30 underline-hover" style={{color: 'var(--paper)'}}>
          See open roles
        </a>
      </div>
    </div>
  </div>
</section>

{/* ============ FOOTER ============ */}
<footer className="relative border-t border-[var(--line)] mt-8" style={{background: 'var(--forest-2)'}}>
  <div className="grain" style={{opacity: '.03', mixBlendMode: 'screen'}}></div>

  <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-16 sm:pt-20 pb-10">

    <div className="reveal grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end pb-14 sm:pb-16">
      <div>
        <p className="font-serif italic-serif text-3xl sm:text-4xl text-[var(--mint)]">Aureumpay</p>
        <p className="mt-4 text-[var(--paper)] text-sm leading-relaxed max-w-sm">
          Banking held to a higher standard — one balance, four accounts, and a statement that reads like plain English.
        </p>
      </div>

      <form className="w-full lg:w-[22rem]">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/70 mb-3">Notes from the ledger, monthly</p>
        <div className="flex items-stretch border-b border-[var(--mint)]/30 focus-within:border-[var(--leaf-bright)] transition-colors">
          <input type="email" required placeholder="you@email.com"
            className="w-full bg-transparent text-[var(--mint)] placeholder-[var(--mint)]/45 text-sm py-3 focus:outline-none"/>
          <button type="submit" aria-label="Subscribe" className="shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--leaf-bright)] px-2">
            Sign up →
          </button>
        </div>
      </form>
    </div>

    <div className="rule" style={{background: 'rgba(213,229,255,.16)'}}></div>

    <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10 py-14 sm:py-16" style={{transitionDelay: '.06s'}}>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Personal</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><Link to="/" className="underline-hover">Checking</Link></li>
          <li><Link to="/" className="underline-hover">Savings</Link></li>
          <li><Link to="/#card" className="underline-hover">Card</Link></li>
          <li><Link to="/#insights" className="underline-hover">Insights</Link></li>
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Business</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><Link to="/" className="underline-hover">Treasury</Link></li>
          <li><Link to="/" className="underline-hover">Payroll</Link></li>
          <li><Link to="/" className="underline-hover">Invoicing</Link></li>
          <li><Link to="/" className="underline-hover">API access</Link></li>
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Company</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><Link to="/about" className="underline-hover">About</Link></li>
          <li><a href="#" className="underline-hover">Careers</a></li>
          <li><a href="#" className="underline-hover">Press</a></li>
          <li><Link to="/#security" className="underline-hover">Security</Link></li>
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Support</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><a href="#" className="underline-hover">Help center</a></li>
          <li><a href="#" className="underline-hover">Contact us</a></li>
          <li><a href="#" className="underline-hover">Status</a></li>
          <li><a href="#" className="underline-hover">Accessibility</a></li>
        </ul>
      </div>
    </div>

    <div className="rule" style={{background: 'rgba(213,229,255,.16)'}}></div>

    <div className="reveal flex flex-col-reverse sm:flex-row items-center sm:items-center justify-between gap-6 pt-8 text-center sm:text-left" style={{transitionDelay: '.12s'}}>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
        <p className="font-mono text-[10px] text-[var(--mint)]/70">© 2026 Aureumpay Financial, Inc.</p>
        <div className="hidden sm:block w-px h-3 bg-[var(--mint)]/25"></div>
        <p className="font-mono text-[10px] text-[var(--mint)]/70 max-w-md">Deposits FDIC-insured to $250,000 through our partner bank</p>
      </div>

      <div className="flex items-center gap-5">
        <a href="#" aria-label="X / Twitter" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mint)]">X</a>
        <a href="#" aria-label="Instagram" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mint)]">IG</a>
        <a href="#" aria-label="LinkedIn" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mint)]">In</a>
        <a href="#" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mint)]">Privacy</a>
        <a href="#" className="underline-hover font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--mint)]">Terms</a>
      </div>
    </div>
  </div>
</footer>


{/*Start of Tawk.to Script*/}

{/*End of Tawk.to Script*/}
</div>
      </div>
    </PageLayout>
  );
}
