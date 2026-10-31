import PageLayout from "../components/PageLayout.jsx";
import PageStyles from "../components/PageStyles.jsx";
import PageScript from "../components/PageScript.jsx";
import { mountPage } from "../scripts/home.js";
import css from "../styles/index.css?inline";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <PageLayout page="home">
      <PageStyles css={css} />
      <PageScript mount={mountPage} />
      <div className="page page-home">
        <div>

{/* ============ PRELOADER ============ */}
<div id="preloader" aria-hidden="true">
  <div className="preload-mark">
    <span className="preload-word">Aureumpay</span>
    <div className="preload-rule"></div>
    <span className="preload-caption">Opening the ledger</span>
  </div>
</div>

{/* film grain overlay across whole hero */}
<div className="relative">
<div className="grain"></div>

{/* ============ MASTHEAD ============ */}
<header className="relative z-30 max-w-[1400px] mx-auto px-6 md:px-12 pt-8">
  <nav className="flex items-center justify-between">
    <Link to="/" className="flex items-center gap-2.5">
      <img src="https://i.ibb.co/jZZLCFMn/Chat-GPT-Image-Jul-12-2026-09-36-01-AM.png" alt="Aureumpay"
           className="h-7 sm:h-8 w-auto object-contain shrink-0"/>
      <span className="font-serif text-2xl tracking-tight">Aureumpay</span>
      <span className="hidden sm:inline font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/40">Est. 2019</span>
    </Link>
    <div className="hidden md:flex items-center gap-10 text-xs font-mono uppercase tracking-[0.12em] text-[var(--ink)]/65">
      <Link to="/" className="underline-hover">Home</Link>
      <a href="#insights" className="underline-hover">Business</a>
      <a href="#features" className="underline-hover">Pricing</a>
      <Link to="/about" className="underline-hover">About</Link>
    </div>
    <div className="flex items-center gap-3 sm:gap-5">
      <button id="themeToggle" type="button" aria-label="Toggle dark mode" className="theme-toggle">
        <svg id="iconSun" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="10" cy="10" r="3.8"/>
          <path d="M10 1.6v2.1M10 16.3v2.1M3.4 10H5.5M14.5 10h2.1M4.6 4.6l1.5 1.5M13.9 13.9l1.5 1.5M15.4 4.6l-1.5 1.5M5.6 13.9l-1.5 1.5"/>
        </svg>
        <svg id="iconMoon" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{display: 'none'}}>
          <path d="M17.3 11.3A7.6 7.6 0 1 1 8.7 2.7a6.1 6.1 0 0 0 8.6 8.6Z"/>
        </svg>
      </button>
      <Link to="/login" className="hidden sm:inline text-xs font-mono uppercase tracking-[0.12em] underline-hover">Log in</Link>
      <Link to="/register" className="sweep hidden sm:inline-flex items-center text-xs font-mono uppercase tracking-[0.12em] text-white px-6 py-3 border border-[var(--forest)]" style={{background: 'var(--forest)'}}>
        Open account
      </Link>
      <button id="burgerBtn" aria-label="Open menu" aria-expanded="false" className="burger md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]">
        <span className="burger-line block w-6 h-[1.5px]" style={{background: 'var(--ink)'}}></span>
        <span className="burger-line block w-6 h-[1.5px]" style={{background: 'var(--ink)'}}></span>
        <span className="burger-line block w-6 h-[1.5px]" style={{background: 'var(--ink)'}}></span>
      </button>
    </div>
  </nav>
  <div className="rule mt-7"></div>

  {/* mobile slide-down panel */}
  <div id="mobilePanel" className="mobile-panel md:hidden">
    <div className="flex flex-col gap-6 py-8 text-sm font-mono uppercase tracking-[0.12em]">
      <Link to="/" className="underline-hover w-fit">Home</Link>
      <a href="#insights" className="underline-hover w-fit">Business</a>
      <a href="#features" className="underline-hover w-fit">Pricing</a>
      <Link to="/about" className="underline-hover w-fit">About</Link>
      <Link to="/login" className="underline-hover w-fit">Log in</Link>
      <Link to="/register" className="sweep inline-flex items-center justify-center text-white px-6 py-3.5 border border-[var(--forest)] w-full" style={{background: 'var(--forest)'}}>
        Open account
      </Link>
    </div>
  </div>
</header>

{/* ============ HERO ============ */}
<section className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-6 pb-24 overflow-hidden">

  {/* oversized watermark word, classic editorial device */}
  <div id="watermark" className="watermark absolute -top-6 md:top-2 left-1/2 -translate-x-1/2 leading-none whitespace-nowrap select-none">
    Aureumpay
  </div>

  <div className="relative grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-14 items-end pt-16 md:pt-24">

    {/* Left: copy */}
    <div>
      <p className="fade-up font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7" style={{animationDelay: '.05s'}}>
        004 — Digital Banking
      </p>
      <h1 className="fade-up font-serif font-medium leading-[0.96] tracking-tight" style={{animationDelay: '.18s', fontSize: 'clamp(2.75rem, 9.5vw, 5.6rem)'}}>
        Banking,
        <br/>
        held to a
        <br/>
        <span className="italic-serif" style={{color: 'var(--leaf)'}}>higher</span> standard.
      </h1>
      <p className="fade-up mt-8 text-lg text-[var(--ink)]/65 max-w-md leading-relaxed" style={{animationDelay: '.32s'}}>
        Aureumpay is a current account built the way private banks used to be built — unhurried, precise, and entirely without fine print. One balance. Total clarity.
      </p>

      <div className="fade-up mt-10 flex flex-wrap items-center gap-5" style={{animationDelay: '.45s'}}>
        <Link to="register" className="sweep px-8 py-4 text-white text-sm font-medium tracking-wide" style={{background: 'var(--forest)'}}>
          Open your account
        </Link>
        {/* <a href="#" className="group inline-flex items-center gap-3 text-sm font-medium tracking-wide">
          <span className="w-11 h-11 rounded-full border border-[var(--ink)]/25 flex items-center justify-center group-hover:border-[var(--ink)] transition-colors">▸</span>
          Watch the film
        </a> */}
      </div>

      <div className="fade-up mt-14 sm:mt-16 grid grid-cols-3 gap-6 sm:flex sm:items-center sm:gap-10 max-w-lg" style={{animationDelay: '.6s'}}>
        <div>
          <p className="font-serif text-2xl sm:text-3xl"><span className="countup" data-target="0" data-decimals="0">0</span><span className="italic-serif" style={{color: 'var(--leaf)'}}>%</span></p>
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--ink)]/45 mt-2">Monthly fees</p>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[var(--line)]"></div>
        <div>
          <p className="font-serif text-2xl sm:text-3xl"><span className="countup" data-target="4" data-decimals="0">0</span><span className="italic-serif" style={{color: 'var(--leaf)'}}>m</span></p>
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--ink)]/45 mt-2">To open</p>
        </div>
        <div className="hidden sm:block w-px h-10 bg-[var(--line)]"></div>
        <div>
          <p className="font-serif text-2xl sm:text-3xl"><span className="countup" data-target="4.9" data-decimals="1">0</span><span className="italic-serif" style={{color: 'var(--leaf)'}}>★</span></p>
          <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--ink)]/45 mt-2">38k reviews</p>
        </div>
      </div>
    </div>

    {/* Right: signature visual — the ledger */}
    <div className="fade-up relative" style={{animationDelay: '.4s'}}>
      <div id="ledgerCard" className="ledger-card p-8 sm:p-10">

        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]/45">Statement · July</p>
          <span className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-full" style={{color: 'var(--leaf)', background: 'rgba(37,99,200,.08)'}}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{background: 'var(--leaf-bright)'}}></span>
            +<span className="countup" data-target="12.4" data-decimals="1">0</span>%
          </span>
        </div>
        <p className="font-serif text-5xl sm:text-6xl mt-3 mb-8" style={{color: 'var(--ink)'}}>$<span className="countup" data-target="18204" data-decimals="0" data-commas="1">0</span></p>

        <svg viewBox="0 0 320 110" className="w-full h-28 sm:h-32" preserveAspectRatio="none">
          <polyline points="0,88 40,82 80,86 120,64 160,68 200,42 240,46 280,18 320,8"
            fill="none" stroke="var(--ink)" strokeOpacity="0.07" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline className="draw-line" points="0,88 40,82 80,86 120,64 160,68 200,42 240,46 280,18 320,8"
            fill="none" stroke="var(--leaf-bright)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <div className="mt-8 rule"></div>
        <div className="mt-6 flex items-center justify-between text-sm">
          <div>
            <p className="text-[var(--ink)]/80">Savings, compounding quietly</p>
            <p className="font-mono text-[11px] text-[var(--ink)]/40 mt-1">Auto-allocated from round-ups</p>
          </div>
          <p className="font-serif text-2xl">$<span className="countup" data-target="6412" data-decimals="0" data-commas="1">0</span></p>
        </div>
      </div>

      {/* floating annotation, classic marginalia touch */}
      <div className="hidden sm:block fade-up float-note absolute -left-10 top-10 w-32" style={{animationDelay: '.8s'}}>
        <p className="font-serif italic-serif text-sm leading-snug text-[var(--ink)]/60">"Interest, paid weekly — not once a year like everyone else."</p>
        <div className="w-8 h-px bg-[var(--ink)]/25 mt-3"></div>
      </div>
    </div>

  </div>
</section>
</div>

{/* ============ FEATURES — "THE LEDGER" ============ */}
<section id="features" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="reveal grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-16 items-start mb-16">
    <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)]">
      005 — What's included
    </p>
    <h2 className="font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.4rem] tracking-tight max-w-2xl">
      Everything a modern account should have.
      <span className="italic-serif" style={{color: 'var(--leaf)'}}>Nothing</span> it shouldn't.
    </h2>
  </div>

  {/* itemized ledger of features */}
  <div className="border-t border-[var(--line)]">

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2">
      <span className="entry-num font-serif text-2xl text-[var(--ink)]/30">01</span>
      <h3 className="font-serif text-2xl">Round-up savings</h3>
      <p className="text-[var(--ink)]/60 text-sm leading-relaxed max-w-md">Every card purchase rounds up to the nearest dollar, and the difference moves quietly into savings — no setup, no thought required.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--ink)]/35 uppercase tracking-wide justify-self-end">Included</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.08s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--ink)]/30">02</span>
      <h3 className="font-serif text-2xl">Weekly interest</h3>
      <p className="text-[var(--ink)]/60 text-sm leading-relaxed max-w-md">Paid every week instead of once a year, so your balance compounds the way it's meant to — visibly, and often.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--ink)]/35 uppercase tracking-wide justify-self-end">Included</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.16s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--ink)]/30">03</span>
      <h3 className="font-serif text-2xl">Instant card freeze</h3>
      <p className="text-[var(--ink)]/60 text-sm leading-relaxed max-w-md">Lock your card the moment something feels wrong, from anywhere, and unlock it just as fast once it's sorted.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--ink)]/35 uppercase tracking-wide justify-self-end">Included</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 border-b border-[var(--line)] px-2 -mx-2" style={{transitionDelay: '.24s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--ink)]/30">04</span>
      <h3 className="font-serif text-2xl">Named sub-accounts</h3>
      <p className="text-[var(--ink)]/60 text-sm leading-relaxed max-w-md">Set aside money for rent, travel, or a rainy day in accounts that carry their own name and their own quiet discipline.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--ink)]/35 uppercase tracking-wide justify-self-end">Included</span>
    </div>

    <div className="reveal entry-row group grid md:grid-cols-[80px_1.4fr_2fr_auto] gap-4 md:gap-10 items-center py-8 md:py-10 px-2 -mx-2" style={{transitionDelay: '.32s'}}>
      <span className="entry-num font-serif text-2xl text-[var(--ink)]/30">05</span>
      <h3 className="font-serif text-2xl">A person, on request</h3>
      <p className="text-[var(--ink)]/60 text-sm leading-relaxed max-w-md">For anything a screen can't resolve, a real person picks up — usually in under a minute, always without a script.</p>
      <span className="hidden md:inline font-mono text-[11px] text-[var(--ink)]/35 uppercase tracking-wide justify-self-end">Included</span>
    </div>

  </div>
</section>

{/* ============ INSIGHTS — inspired by N26's spending-breakdown screen ============ */}
<section id="insights" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 lg:gap-20 items-center">

    {/* Left: the ring chart, signature visual for this section */}
    <div className="reveal ring-pop relative order-2 lg:order-1">
      <div className="ledger-card p-8 sm:p-10 flex flex-col items-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ink)]/45 self-start mb-6">Spending · This month</p>

        <div className="relative w-56 h-56 sm:w-64 sm:h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-0">
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--paper-2)" strokeWidth="18"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--leaf-bright)" strokeWidth="18"
              strokeDasharray="170.9 331.8" strokeLinecap="round" transform="rotate(-90 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--leaf)" strokeWidth="18"
              strokeDasharray="120.6 382.1" strokeLinecap="round" transform="rotate(32.4 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--ink)" strokeWidth="18"
              strokeDasharray="110.6 392.1" strokeLinecap="round" transform="rotate(118.8 100 100)"/>
            <circle cx="100" cy="100" r="80" fill="none" stroke="var(--sage)" strokeWidth="18"
              strokeDasharray="100.5 402.2" strokeLinecap="round" transform="rotate(198 100 100)"/>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="font-serif text-3xl sm:text-4xl">$<span className="countup" data-target="2140" data-decimals="0" data-commas="1">0</span></p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink)]/45 mt-1">Total spent</p>
          </div>
        </div>

        <p className="font-serif italic-serif text-sm text-[var(--ink)]/55 mt-7 text-center max-w-[15rem]">"The one screen that made me actually understand my own money."</p>
      </div>
    </div>

    {/* Right: copy + category legend/bars */}
    <div className="order-1 lg:order-2">
      <p className="reveal font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7">
        006 — Spending Insights
      </p>
      <h2 className="reveal font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight" style={{transitionDelay: '.05s'}}>
        See exactly where it's <span className="italic-serif" style={{color: 'var(--leaf)'}}>going.</span>
      </h2>
      <p className="reveal mt-6 text-[var(--ink)]/65 leading-relaxed max-w-md" style={{transitionDelay: '.1s'}}>
        One of digital banking's best ideas came from N26's insights screen — a single glance that replaces a month of guesswork. We borrowed the idea and gave it the same quiet, paper-like clarity as the rest of Aureumpay.
      </p>

      <div className="mt-10 space-y-6">
        <div className="reveal" style={{transitionDelay: '.15s'}}>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background: 'var(--leaf-bright)'}}></span>Groceries</span>
            <span className="font-mono text-[var(--ink)]/60">$<span className="countup" data-target="728" data-decimals="0" data-commas="1">0</span></span>
          </div>
          <div className="bar-track h-1.5 rounded-full"><div className="bar-fill h-full rounded-full" data-bar="95" style={{background: 'var(--leaf-bright)'}}></div></div>
        </div>

        <div className="reveal" style={{transitionDelay: '.22s'}}>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background: 'var(--leaf)'}}></span>Transport</span>
            <span className="font-mono text-[var(--ink)]/60">$<span className="countup" data-target="514" data-decimals="0" data-commas="1">0</span></span>
          </div>
          <div className="bar-track h-1.5 rounded-full"><div className="bar-fill h-full rounded-full" data-bar="67" style={{background: 'var(--leaf)'}}></div></div>
        </div>

        <div className="reveal" style={{transitionDelay: '.29s'}}>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background: 'var(--ink)'}}></span>Dining</span>
            <span className="font-mono text-[var(--ink)]/60">$<span className="countup" data-target="471" data-decimals="0" data-commas="1">0</span></span>
          </div>
          <div className="bar-track h-1.5 rounded-full"><div className="bar-fill h-full rounded-full" data-bar="61" style={{background: 'var(--ink)'}}></div></div>
        </div>

        <div className="reveal" style={{transitionDelay: '.36s'}}>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{background: 'var(--sage)'}}></span>Other</span>
            <span className="font-mono text-[var(--ink)]/60">$<span className="countup" data-target="427" data-decimals="0" data-commas="1">0</span></span>
          </div>
          <div className="bar-track h-1.5 rounded-full"><div className="bar-fill h-full rounded-full" data-bar="56" style={{background: 'var(--sage)'}}></div></div>
        </div>
      </div>
    </div>

  </div>
</section>

{/* ============ THE CARD — Chase-inspired card showcase ============ */}
<section id="card" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32 overflow-hidden">
  <div className="rule mb-16"></div>

  <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-16 lg:gap-24 items-center">

    {/* Left: the physical card, stacked and tilted like a real wallet */}
    <div className="reveal relative order-2 lg:order-1 pt-6 pb-10 lg:py-10">
      <div className="relative mx-auto max-w-[420px]">

        {/* back card, peeking out for depth */}
        <div className="absolute inset-0 translate-x-4 translate-y-7 rotate-[7deg] rounded-2xl opacity-40"
             style={{background: 'var(--sage)', aspectRatio: '1.586'}}></div>

        {/* front card — deliberately stays a dark forest card in both themes, like a physical card mockup */}
        <div id="cardVisual" className="relative rounded-2xl aspect-[1.586] p-7 sm:p-8 flex flex-col justify-between"
             style={{background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-2) 55%, #0C2545 100%)', boxShadow: '0 40px 70px -25px rgba(16,43,78,.45)', color: 'var(--onDark)'}}>

          <div className="flex items-start justify-between">
            <span className="font-serif italic-serif text-xl tracking-tight">Aureumpay</span>
            <svg width="34" height="26" viewBox="0 0 34 26" fill="none">
              <rect x="0.5" y="0.5" width="33" height="25" rx="4.5" fill="var(--leaf-bright)" fillOpacity=".15" stroke="var(--leaf-bright)" strokeOpacity=".6"/>
              <line x1="0.5" y1="9" x2="33.5" y2="9" stroke="var(--leaf-bright)" strokeOpacity=".6"/>
              <line x1="12" y1="9" x2="12" y2="25.5" stroke="var(--leaf-bright)" strokeOpacity=".6"/>
              <line x1="22" y1="9" x2="22" y2="25.5" stroke="var(--leaf-bright)" strokeOpacity=".6"/>
            </svg>
          </div>

          <div>
            <p className="font-mono text-lg sm:text-xl tracking-[0.14em] mb-5">4471&nbsp; &nbsp;••••&nbsp; &nbsp;••••&nbsp; &nbsp;9902</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--onDark)]/45 mb-1">Card member</p>
                <p className="font-mono text-xs tracking-[0.08em]">A. RIVERA</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--onDark)]/45 mb-1">Since</p>
                <p className="font-mono text-xs tracking-[0.08em]">2019</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink)]/35 text-center mt-8">No annual fee · Ships in 5 days</p>
    </div>

    {/* Right: copy + reward tiers, Chase-style multiplier rows */}
    <div className="order-1 lg:order-2">
      <p className="reveal font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7">
        007 — The Aureumpay Card
      </p>
      <h2 className="reveal font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight" style={{transitionDelay: '.05s'}}>
        Spend well.
        <span className="italic-serif" style={{color: 'var(--leaf)'}}>Earn</span> without asking.
      </h2>
      <p className="reveal mt-6 text-[var(--ink)]/65 leading-relaxed max-w-md" style={{transitionDelay: '.1s'}}>
        No rotating categories to track, no portal to sign into — the card simply pays more where it matters most, automatically, every statement.
      </p>

      <div className="mt-10 border-t border-[var(--line)]">
        <div className="reveal flex items-center gap-6 py-6 border-b border-[var(--line)]" style={{transitionDelay: '.16s'}}>
          <span className="font-serif text-3xl sm:text-4xl leading-none w-16 shrink-0" style={{color: 'var(--leaf-bright)'}}>5<span className="italic-serif text-xl">x</span></span>
          <div>
            <p className="font-medium">Travel</p>
            <p className="text-sm text-[var(--ink)]/55">Flights, hotels, and trains booked any way you like</p>
          </div>
        </div>
        <div className="reveal flex items-center gap-6 py-6 border-b border-[var(--line)]" style={{transitionDelay: '.22s'}}>
          <span className="font-serif text-3xl sm:text-4xl leading-none w-16 shrink-0" style={{color: 'var(--leaf)'}}>3<span className="italic-serif text-xl">x</span></span>
          <div>
            <p className="font-medium">Dining</p>
            <p className="text-sm text-[var(--ink)]/55">Restaurants, delivery, and the coffee run</p>
          </div>
        </div>
        <div className="reveal flex items-center gap-6 py-6" style={{transitionDelay: '.28s'}}>
          <span className="font-serif text-3xl sm:text-4xl leading-none w-16 shrink-0" style={{color: 'var(--ink)'}}>1<span className="italic-serif text-xl">x</span></span>
          <div>
            <p className="font-medium">Everything else</p>
            <p className="text-sm text-[var(--ink)]/55">No exclusions, no fine print to check first</p>
          </div>
        </div>
      </div>

      {/* bonus banner, the Chase-style promotional strip — always sits on a dark forest fill */}
      <div className="reveal mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 px-6 py-5" style={{transitionDelay: '.34s', background: 'var(--forest)', color: 'var(--onDark)'}}>
        <p className="text-sm sm:text-base leading-snug">
          Earn a <span className="font-serif italic-serif" style={{color: 'var(--leaf-bright)'}}>$750</span> bonus after $4,000 in purchases within 90 days.
        </p>
        <a href="#" className="sweep sweep-dark shrink-0 self-start sm:self-auto font-mono text-[11px] uppercase tracking-[0.12em] px-5 py-3 border border-[var(--onDark)]/30">
          Apply
        </a>
      </div>
    </div>

  </div>
</section>

{/* ============ TRUST & SECURITY — the seal ============ */}
<section id="security" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-20 items-center">

    {/* Left: copy + guarantees, itemized like the features ledger */}
    <div>
      <p className="reveal font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7">
        008 — Trust &amp; Security
      </p>
      <h2 className="reveal font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight max-w-xl" style={{transitionDelay: '.05s'}}>
        Guarded like it's <span className="italic-serif" style={{color: 'var(--leaf)'}}>our own</span> money.
      </h2>
      <p className="reveal mt-6 text-[var(--ink)]/65 leading-relaxed max-w-md" style={{transitionDelay: '.1s'}}>
        Every deposit is insured, every session is encrypted, and every unusual charge gets a human look before it clears — not after.
      </p>

      <div className="mt-10 border-t border-[var(--line)]">
        <div className="reveal flex items-start gap-5 py-6 border-b border-[var(--line)]" style={{transitionDelay: '.16s'}}>
          <svg className="shrink-0 mt-0.5" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 1.5 3 4.8v5.6c0 5.4 3.4 9 8 10.1 4.6-1.1 8-4.7 8-10.1V4.8L11 1.5Z" stroke="var(--leaf)" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7.3 11.2l2.5 2.5 5-5.2" stroke="var(--leaf)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div>
            <p className="font-medium">FDIC insured to $250,000</p>
            <p className="text-sm text-[var(--ink)]/55 mt-1">Held through our partner bank, same protection as any national bank</p>
          </div>
        </div>
        <div className="reveal flex items-start gap-5 py-6 border-b border-[var(--line)]" style={{transitionDelay: '.22s'}}>
          <svg className="shrink-0 mt-0.5" width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4.5" y="9.5" width="13" height="9.5" rx="1.6" stroke="var(--leaf)" strokeWidth="1.4"/><path d="M7.3 9.5V6.8a3.7 3.7 0 0 1 7.4 0v2.7" stroke="var(--leaf)" strokeWidth="1.4"/></svg>
          <div>
            <p className="font-medium">256-bit encryption, always on</p>
            <p className="text-sm text-[var(--ink)]/55 mt-1">The same standard used to move money between banks</p>
          </div>
        </div>
        <div className="reveal flex items-start gap-5 py-6" style={{transitionDelay: '.28s'}}>
          <svg className="shrink-0 mt-0.5" width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8.5" stroke="var(--leaf)" strokeWidth="1.4"/><path d="M11 6.5v5l3.2 2" stroke="var(--leaf)" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div>
            <p className="font-medium">Real-time fraud review</p>
            <p className="text-sm text-[var(--ink)]/55 mt-1">A flagged charge gets a call from us, usually within minutes</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right: the seal, signature visual for this section */}
    <div className="reveal ring-pop flex items-center justify-center order-first lg:order-last" style={{transitionDelay: '.1s'}}>
      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="94" fill="var(--paper-2)" stroke="var(--line)" strokeWidth="1"/>
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--ink)" strokeOpacity=".15" strokeWidth="1"/>
          <g className="seal-ring">
            <path id="sealArc" fill="none" d="M 100,20 A 80,80 0 1 1 99.9,20"/>
            <text fontFamily="IBM Plex Mono, monospace" fontSize="8.4" letterSpacing="3.2" fill="var(--ink)" fillOpacity=".55">
              <textPath href="#sealArc" startOffset="2%">EST. 2019 · CHARTERED · INSURED · ENCRYPTED ·</textPath>
            </text>
          </g>
          <circle cx="100" cy="100" r="54" fill="var(--forest)"/>
          <path d="M100 66 78 78v22c0 21 13.5 35 22 39 8.5-4 22-18 22-39V78L100 66Z" fill="none" stroke="var(--leaf-bright)" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M89.5 100.5l7 7 14.5-15.5" fill="none" stroke="var(--leaf-bright)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>

  </div>
</section>

{/* ============ TESTIMONIALS — inspired by Wise/Monzo's member-quote sections ============ */}
<section id="testimonials" className="section-fade relative max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-32">
  <div className="rule mb-16"></div>

  <div className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-14 md:mb-16">
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-[var(--leaf)] mb-7">
        009 — In their words
      </p>
      <h2 className="font-serif font-medium leading-[1.02] text-4xl sm:text-5xl lg:text-[3.2rem] tracking-tight max-w-xl">
        Members do the <span className="italic-serif" style={{color: 'var(--leaf)'}}>talking</span> for us.
      </h2>
    </div>
    <div className="flex items-center gap-3 shrink-0">
      <div className="flex gap-0.5" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
      </div>
      <p className="font-mono text-xs text-[var(--ink)]/50">4.9 average across 38,000 reviews</p>
    </div>
  </div>

  {/* featured pull-quote, full width */}
  <div className="reveal ledger-card p-8 sm:p-12 lg:p-16 relative overflow-hidden mb-6">
    <span className="font-serif absolute -top-6 left-6 sm:left-10 text-[8rem] sm:text-[11rem] leading-none select-none pointer-events-none" style={{color: 'var(--leaf)', opacity: '.08'}}>&ldquo;</span>
    <div className="relative grid lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-16 items-center">
      <p className="font-serif italic-serif text-2xl sm:text-3xl lg:text-[2.2rem] leading-snug tracking-tight">
        I moved my whole business here after one bad renewal fee from my old bank. Eighteen months later, the thing I notice most is what Aureumpay <span style={{color: 'var(--leaf)'}}>doesn't</span> do — no surprise charges, no dark patterns, no chasing a human for a straight answer.
      </p>
      <div className="flex items-center gap-4 lg:border-l lg:border-[var(--line)] lg:pl-10">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-mono text-sm" style={{background: 'var(--forest)', color: 'var(--onDark)'}}>MO</div>
        <div>
          <p className="font-medium">Maya Okonkwo</p>
          <p className="text-sm text-[var(--ink)]/55">Founder, Studio Fern</p>
          <div className="flex gap-0.5 mt-2" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* supporting quotes, 3-up grid */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

    <div className="reveal ledger-card p-7 sm:p-8 flex flex-col justify-between" style={{transitionDelay: '.08s'}}>
      <div>
        <div className="flex gap-0.5 mb-5" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        </div>
        <p className="text-[var(--ink)]/75 leading-relaxed">"The weekly interest actually shows up weekly. I keep waiting for the catch. There isn't one."</p>
      </div>
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--line)]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-xs" style={{background: 'var(--paper-2)', border: '1px solid var(--line)', color: 'var(--ink)'}}>DK</div>
        <div>
          <p className="text-sm font-medium">Daniel Kim</p>
          <p className="font-mono text-[11px] text-[var(--ink)]/45">Member since 2021</p>
        </div>
      </div>
    </div>

    <div className="reveal ledger-card p-7 sm:p-8 flex flex-col justify-between" style={{transitionDelay: '.14s'}}>
      <div>
        <div className="flex gap-0.5 mb-5" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)" opacity=".25"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        </div>
        <p className="text-[var(--ink)]/75 leading-relaxed">"Froze my card from an airport lounge in about four seconds after I lost my wallet. Unfroze it twenty minutes later when I found it in my jacket."</p>
      </div>
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--line)]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-xs" style={{background: 'var(--paper-2)', border: '1px solid var(--line)', color: 'var(--ink)'}}>RP</div>
        <div>
          <p className="text-sm font-medium">Rosa Pellegrini</p>
          <p className="font-mono text-[11px] text-[var(--ink)]/45">Member since 2022</p>
        </div>
      </div>
    </div>

    <div className="reveal ledger-card p-7 sm:p-8 flex flex-col justify-between sm:col-span-2 lg:col-span-1" style={{transitionDelay: '.2s'}}>
      <div>
        <div className="flex gap-0.5 mb-5" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="var(--leaf-bright)"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6-4.4-4.2 6-.8L10 1.5Z"/></svg>
        </div>
        <p className="text-[var(--ink)]/75 leading-relaxed">"Support picked up in under a minute and actually fixed the problem instead of reading me a script. Wild concept, apparently."</p>
      </div>
      <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[var(--line)]">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-mono text-xs" style={{background: 'var(--paper-2)', border: '1px solid var(--line)', color: 'var(--ink)'}}>JT</div>
        <div>
          <p className="text-sm font-medium">Jonah Truitt</p>
          <p className="font-mono text-[11px] text-[var(--ink)]/45">Member since 2023</p>
        </div>
      </div>
    </div>

  </div>
</section>

{/* ============ FOOTER ============ */}
{/* The footer is deliberately always dark, in both site themes — like the card visual and bonus banner,
     it uses var(--forest-2)/var(--onDark)/var(--mint), none of which move with the light/dark toggle. */}
<footer className="relative border-t border-[var(--line)] mt-8" style={{background: 'var(--forest-2)'}}>
  <div className="grain" style={{opacity: '.03', mixBlendMode: 'screen'}}></div>

  <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-16 sm:pt-20 pb-10">

    {/* top: brand + newsletter */}
    <div className="reveal grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end pb-14 sm:pb-16">
      <div>
        <p className="font-serif italic-serif text-3xl sm:text-4xl text-[var(--mint)]">Aureumpay</p>
        <p className="mt-4 text-[var(--onDark)] text-sm leading-relaxed max-w-sm">
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

    {/* link columns, 2-up on mobile, 4-up from sm, 5-up on desktop */}
    <div className="reveal grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10 py-14 sm:py-16" style={{transitionDelay: '.06s'}}>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Personal</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><a href="#" className="underline-hover">Checking</a></li>
          <li><a href="#" className="underline-hover">Savings</a></li>
          <li><a href="#card" className="underline-hover">Card</a></li>
          <li><a href="#insights" className="underline-hover">Insights</a></li>
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Business</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><a href="#" className="underline-hover">Treasury</a></li>
          <li><a href="#" className="underline-hover">Payroll</a></li>
          <li><a href="#" className="underline-hover">Invoicing</a></li>
          <li><a href="#" className="underline-hover">API access</a></li>
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Company</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><Link to="/about" className="underline-hover">About</Link></li>
          <li><a href="#" className="underline-hover">Careers</a></li>
          <li><a href="#" className="underline-hover">Press</a></li>
          <li><a href="#security" className="underline-hover">Security</a></li>
        </ul>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--mint)]/60 mb-5">Support</p>
        <ul className="space-y-3 text-sm text-[var(--mint)]">
          <li><a id="siteContactEmail" href="#" className="underline-hover hidden">Email support</a></li>
          <li><a id="siteContactTelegram" href="#" target="_blank" rel="noreferrer" className="underline-hover hidden">Telegram support</a></li>
          <li><a href="#" className="underline-hover">Status</a></li>
          <li><a href="#" className="underline-hover">Accessibility</a></li>
        </ul>
      </div>
    </div>

    <div className="rule" style={{background: 'rgba(213,229,255,.16)'}}></div>

    {/* bottom bar: legal + socials, stacks on mobile */}
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
