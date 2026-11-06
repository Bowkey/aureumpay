import { app, isFirebaseConfigured } from "../firebase.js";
import { bindContactDetails } from "../utils/contact.js";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, update, push, set, remove, query, orderByChild, equalTo } from "firebase/database";
import { sendEmailNotification } from "../utils/email-notifications.js";

export function mountPage(navigate) {
    if (!isFirebaseConfigured) {
      navigate("/login", { replace: true });
      return;
    }

    const auth = getAuth(app);
    const db = getDatabase(app);
    const unbindContact = bindContactDetails({
      emailLinkId: "dashboardContactEmail",
      telegramLinkId: "dashboardContactTelegram",
      containerId: "supportContactCard",
    });
  
    const $ = (id) => document.getElementById(id);
    let currentUid = null;
    let userData = {};
    let allTx = [];
  
    /* ---------- toast / alert helpers ---------- */
    function showToast(message, tone = "ink") {
      const wrap = $("toastWrap");
      const el = document.createElement("div");
      const tones = { ink: "bg-[var(--forest)] text-white", mint: "bg-[var(--leaf)] text-white", rose: "bg-[var(--error)] text-white" };
      el.className = `${tones[tone] || tones.ink} font-mono text-[12.5px] tracking-[0.02em] px-5 py-3 rounded-full shadow-lg max-w-[92vw] text-center`;
      el.textContent = message;
      wrap.appendChild(el);
      setTimeout(() => { el.style.transition = "opacity .3s ease, transform .3s ease"; el.style.opacity = "0"; el.style.transform = "translateY(8px)"; setTimeout(() => el.remove(), 300); }, 3400);
    }
    function setAlert(el, message, tone = "rose") {
      if (!el) {
        console.error("Could not display dashboard alert: its target element is missing.");
        if (message) showToast(message, tone);
        return;
      }
      if (!message) { el.classList.add("hidden"); el.textContent = ""; return; }
      const tones = { rose: "bg-[rgba(179,67,43,.08)] text-[var(--error)]", mint: "bg-[rgba(37,99,200,.1)] text-[var(--leaf)]" };
      el.className = `mb-4 rounded px-4 py-3 text-[13px] font-medium ${tones[tone] || tones.rose}`;
      el.textContent = message;
      el.classList.remove("hidden");
    }
    function shakeEl(el) { el.classList.remove("animate-shake"); void el.offsetWidth; el.classList.add("animate-shake"); }
  
    async function copyText(text, okMsg) {
      try { await navigator.clipboard.writeText(text); showToast(okMsg || "Copied", "mint"); }
      catch { showToast("Couldn't copy — copy it manually", "rose"); }
    }
  
    /* ---------- countries & currencies (shared with signup) ---------- */
    const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (DRC)","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
    const CURRENCIES = [
      { code: "USD", name: "US Dollar", symbol: "$" }, { code: "EUR", name: "Euro", symbol: "€" }, { code: "GBP", name: "British Pound", symbol: "£" },
      { code: "NGN", name: "Nigerian Naira", symbol: "₦" }, { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" }, { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
      { code: "ZAR", name: "South African Rand", symbol: "R" }, { code: "EGP", name: "Egyptian Pound", symbol: "E£" }, { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
      { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" }, { code: "UGX", name: "Ugandan Shilling", symbol: "USh" }, { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
      { code: "MAD", name: "Moroccan Dirham", symbol: "MAD" }, { code: "CAD", name: "Canadian Dollar", symbol: "$" }, { code: "AUD", name: "Australian Dollar", symbol: "$" },
      { code: "NZD", name: "New Zealand Dollar", symbol: "$" }, { code: "INR", name: "Indian Rupee", symbol: "₹" }, { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
      { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" }, { code: "CNY", name: "Chinese Yuan", symbol: "¥" }, { code: "JPY", name: "Japanese Yen", symbol: "¥" },
      { code: "KRW", name: "South Korean Won", symbol: "₩" }, { code: "SGD", name: "Singapore Dollar", symbol: "$" }, { code: "THB", name: "Thai Baht", symbol: "฿" },
      { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" }, { code: "PHP", name: "Philippine Peso", symbol: "₱" }, { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
      { code: "AED", name: "UAE Dirham", symbol: "د.إ" }, { code: "SAR", name: "Saudi Riyal", symbol: "﷼" }, { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
      { code: "TRY", name: "Turkish Lira", symbol: "₺" }, { code: "RUB", name: "Russian Ruble", symbol: "₽" }, { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
      { code: "SEK", name: "Swedish Krona", symbol: "kr" }, { code: "NOK", name: "Norwegian Krone", symbol: "kr" }, { code: "DKK", name: "Danish Krone", symbol: "kr" },
      { code: "PLN", name: "Polish Zloty", symbol: "zł" }, { code: "BRL", name: "Brazilian Real", symbol: "R$" }, { code: "MXN", name: "Mexican Peso", symbol: "$" },
      { code: "ARS", name: "Argentine Peso", symbol: "$" }, { code: "COP", name: "Colombian Peso", symbol: "$" },
    ];
    const CURRENCY_SYMBOLS = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.symbol]));
  
    // Maps a country name (as stored by the registration page's countryResidence field)
    // to the currency code most people there would actually bank in. Only codes present
    // in CURRENCIES above are used, since that's what fmtMoney can render a symbol for;
    // anything not explicitly mapped falls back to USD rather than guessing.
    const COUNTRY_CURRENCY = {
      "Nigeria": "NGN", "Ghana": "GHS",
      "Benin": "XOF", "Burkina Faso": "XOF", "Ivory Coast": "XOF", "Guinea-Bissau": "XOF",
      "Mali": "XOF", "Niger": "XOF", "Senegal": "XOF", "Togo": "XOF",
      "Cameroon": "XAF", "Central African Republic": "XAF", "Chad": "XAF",
      "Congo (Brazzaville)": "XAF", "Equatorial Guinea": "XAF", "Gabon": "XAF",
      "Kenya": "KES", "Uganda": "UGX", "Tanzania": "TZS", "South Africa": "ZAR",
      "Egypt": "EGP", "Morocco": "MAD",
      "United Kingdom": "GBP", "Switzerland": "CHF", "Liechtenstein": "CHF",
      "Sweden": "SEK", "Norway": "NOK", "Denmark": "DKK", "Poland": "PLN",
      "Turkey": "TRY", "Russia": "RUB",
      "Austria": "EUR", "Belgium": "EUR", "Croatia": "EUR", "Cyprus": "EUR", "Estonia": "EUR",
      "Finland": "EUR", "France": "EUR", "Germany": "EUR", "Greece": "EUR", "Ireland": "EUR",
      "Italy": "EUR", "Latvia": "EUR", "Lithuania": "EUR", "Luxembourg": "EUR", "Malta": "EUR",
      "Monaco": "EUR", "Netherlands": "EUR", "Portugal": "EUR", "San Marino": "EUR",
      "Slovakia": "EUR", "Slovenia": "EUR", "Spain": "EUR", "Vatican City": "EUR", "Andorra": "EUR",
      "United States": "USD", "Canada": "CAD", "Mexico": "MXN", "Brazil": "BRL",
      "Argentina": "ARS", "Colombia": "COP",
      "India": "INR", "Pakistan": "PKR", "Bangladesh": "BDT", "China": "CNY", "Japan": "JPY",
      "South Korea": "KRW", "Singapore": "SGD", "Thailand": "THB", "Indonesia": "IDR",
      "Philippines": "PHP", "Vietnam": "VND",
      "United Arab Emirates": "AED", "Saudi Arabia": "SAR", "Israel": "ILS",
      "Australia": "AUD", "New Zealand": "NZD",
    };
    function currencyForCountry(countryName) {
      return COUNTRY_CURRENCY[(countryName || "").trim()] || "USD";
    }
  
    /* ---------- timezone-aware transaction dates ----------
       Deposits/withdrawals/transfers/credits/debits should read in the user's own
       country's local time (the country picked at registration), not the browser's.
       Best-effort IANA timezone per country; falls back to the browser's own zone
       for any country not explicitly listed below. */
    const COUNTRY_TIMEZONES = {
      Nigeria: "Africa/Lagos", Ghana: "Africa/Accra", Kenya: "Africa/Nairobi", "South Africa": "Africa/Johannesburg", Egypt: "Africa/Cairo",
      "United States": "America/New_York", "United Kingdom": "Europe/London", Canada: "America/Toronto", Australia: "Australia/Sydney", "New Zealand": "Pacific/Auckland",
      Germany: "Europe/Berlin", France: "Europe/Paris", Italy: "Europe/Rome", Spain: "Europe/Madrid", Netherlands: "Europe/Amsterdam", Ireland: "Europe/Dublin", Portugal: "Europe/Lisbon",
      India: "Asia/Kolkata", Pakistan: "Asia/Karachi", Bangladesh: "Asia/Dhaka", China: "Asia/Shanghai", Japan: "Asia/Tokyo", "South Korea": "Asia/Seoul",
      Singapore: "Asia/Singapore", Thailand: "Asia/Bangkok", Indonesia: "Asia/Jakarta", Philippines: "Asia/Manila", Vietnam: "Asia/Ho_Chi_Minh",
      "United Arab Emirates": "Asia/Dubai", "Saudi Arabia": "Asia/Riyadh", Israel: "Asia/Jerusalem", Turkey: "Europe/Istanbul", Russia: "Europe/Moscow",
      Switzerland: "Europe/Zurich", Sweden: "Europe/Stockholm", Norway: "Europe/Oslo", Denmark: "Europe/Copenhagen", Poland: "Europe/Warsaw",
      Brazil: "America/Sao_Paulo", Mexico: "America/Mexico_City", Argentina: "America/Argentina/Buenos_Aires", Colombia: "America/Bogota",
      Uganda: "Africa/Kampala", Tanzania: "Africa/Dar_es_Salaam", Morocco: "Africa/Casablanca",
      Ethiopia: "Africa/Addis_Ababa", "Ivory Coast": "Africa/Abidjan", Senegal: "Africa/Dakar", Cameroon: "Africa/Douala",
    };
    function userTimeZone() {
      const country = userData.country || userData.countryResidence || (userData.address && userData.address.country) || "";
      return COUNTRY_TIMEZONES[country] || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    }
    function formatTxDate(iso) {
      try { return new Date(iso).toLocaleString(undefined, { timeZone: userTimeZone() }); }
      catch { return new Date(iso).toLocaleString(); }
    }
  
    function populateSelect(select, values, labelFn) {
      values.forEach((v) => {
        const opt = document.createElement("option");
        opt.value = labelFn ? v.code : v;
        opt.textContent = labelFn ? labelFn(v) : v;
        select.appendChild(opt);
      });
    }
    populateSelect($("itCountry"), COUNTRIES);
    populateSelect($("itCurrency"), CURRENCIES, (c) => `${c.code} — ${c.name}`);
    populateSelect($("pCountry"), COUNTRIES);
    populateSelect($("pCurrency"), CURRENCIES, (c) => `${c.code} — ${c.name}`);
  
    function fmtMoney(amount, code) {
      const symbol = CURRENCY_SYMBOLS[code] || "";
      const n = Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `${symbol}${n}`;
    }
  
    // The registration page writes firstName/lastName separately, nests the address
    // under address.{line1,line2,city,state,postalCode,country}, and never sets
    // balance/currency. The dashboard reads a flat schema (fullName, address, city,
    // state, postalCode, country, currency, balance). This reshapes a freshly loaded
    // profile into that flat schema and persists the derived fields once, so future
    // loads are already in the right shape and any admin tooling sees one consistent
    // record instead of two.
    function normalizeUserData(uid, data) {
      const patch = {};
  
      if (!data.fullName) {
        const full = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
        if (full) patch.fullName = full;
      }
  
      const nestedAddr = (data.address && typeof data.address === "object") ? data.address : null;
      if (nestedAddr) {
        const flatAddress = [nestedAddr.line1, nestedAddr.line2].filter(Boolean).join(", ");
        if (flatAddress) patch.address = flatAddress;
        if (!data.city && nestedAddr.city) patch.city = nestedAddr.city;
        if (!data.state && nestedAddr.state) patch.state = nestedAddr.state;
        if (!data.postalCode && nestedAddr.postalCode) patch.postalCode = nestedAddr.postalCode;
        if (!data.country && nestedAddr.country) patch.country = nestedAddr.country;
      }
      if (!data.country && data.countryResidence) patch.country = data.countryResidence;
  
      // Default currency comes from the country picked at registration (countryResidence),
      // not a hardcoded value — so a UK signup lands on GBP, a Kenyan signup on KES, etc.
      // Once a currency is set (here or later from the Profile page), this never overrides it.
      if (!data.currency) {
        const residenceCountry = data.countryResidence || data.country || patch.country || (nestedAddr && nestedAddr.country) || "";
        patch.currency = currencyForCountry(residenceCountry);
      }
      if (typeof data.balance !== "number") patch.balance = 0;
  
      // Accounts created before the active field existed default to
      // active (so nobody who already had full access suddenly gets locked out);
      // brand-new registrations set active:false themselves at signup time.
      if (typeof data.active !== "boolean") patch.active = true;
  
      if (Object.keys(patch).length) {
        update(ref(db, `users/${uid}`), patch).catch(() => {});
        return { ...data, ...patch };
      }
      return data;
    }
  
    /* ---------- withdraw methods (icon boxes) ---------- */
    const WITHDRAW_METHODS = [
      { id: "paypal", name: "PayPal", grad: "from-[#003087] to-[#0070E0]",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 5h6.2c2.7 0 4.4 1.6 3.9 4.1-.5 2.9-2.7 4.4-5.5 4.4H9.4L8.6 18H5.8L7 5Z" fill="white"/><path d="M9.6 8h6c2.5 0 3.9 1.4 3.5 3.8-.5 2.6-2.5 3.9-5 3.9h-2.2l-.7 3.8H8.4L9.6 8Z" fill="white" fill-opacity=".55"/></svg>` },
      { id: "cashapp", name: "Cash App", grad: "from-[#00C244] to-[#00D95F]",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6.5c-2 0-3.2.9-3.2 2.2 0 3.1 5.8 1.9 5.8 5 0 1.3-1.3 2.2-3.1 2.2-1.5 0-2.7-.6-3.4-1.6M12 5v1.3M12 17.7V19" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
      { id: "bank", name: "Bank account", grad: "from-leaf to-forest",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10 12 4l9 6M4 10v9M20 10v9M8 10v9M16 10v9M2 20h20"/></svg>` },
    ];
    function renderWithdrawMethodGrid() {
      const grid = $("withdrawMethodGrid");
      grid.innerHTML = WITHDRAW_METHODS.map((m, i) => `
        <button type="button" data-withdraw-tab="${m.id}" class="withdraw-method-btn rounded-md p-3 sm:p-4 flex flex-col items-center gap-2 text-center transition border-2 ${i === 0 ? "border-[var(--leaf)]" : "border-transparent"} surface">
          <span class="w-11 h-11 sm:w-12 sm:h-12 rounded-md bg-gradient-to-br ${m.grad} flex items-center justify-center flex-shrink-0">${m.icon}</span>
          <span class="text-[12px] sm:text-[13px] font-medium truncate w-full">${m.name}</span>
        </button>
      `).join("");
      grid.querySelectorAll("[data-withdraw-tab]").forEach((btn) => btn.addEventListener("click", () => selectWithdrawTab(btn.dataset.withdrawTab)));
    }
    function selectWithdrawTab(tab) {
      document.querySelectorAll(".withdraw-method-btn").forEach((b) => {
        b.classList.toggle("border-[var(--leaf)]", b.dataset.withdrawTab === tab);
        b.classList.toggle("border-transparent", b.dataset.withdrawTab !== tab);
      });
      $("paypalForm").classList.toggle("hidden", tab !== "paypal");
      $("cashappForm").classList.toggle("hidden", tab !== "cashapp");
      $("bankWithdrawForm").classList.toggle("hidden", tab !== "bank");
    }
  
    /* ---------- crypto coins (deposit) ---------- */
    const DEFAULT_CRYPTO_COINS = [
      { id: "btc", name: "Bitcoin", ticker: "BTC", network: "Bitcoin (BTC) network", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", grad: "from-[#F7931A] to-[#FFB74D]", warning: "Only send BTC to this address on the Bitcoin network." },
      { id: "eth", name: "Ethereum", ticker: "ETH", network: "Ethereum (ERC-20) network", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976", grad: "from-[#627EEA] to-[#8AA6FF]", warning: "Only send ETH or ERC-20 tokens to this address." },
      { id: "usdt", name: "Tether", ticker: "USDT", network: "Tether (TRC-20) network", address: "TXYZbc1a2b3c4d5e6f7g8h9i0jklmnopqrst", grad: "from-[#26A17B] to-[#5FD6AE]", warning: "Only send USDT on the TRC-20 network to this address." },
      { id: "usdc", name: "USD Coin", ticker: "USDC", network: "USD Coin (ERC-20) network", address: "0x9aB4c31e2F1d8B4A6C0e5D7f3A2B1c9D8e7F6a5B", grad: "from-[#2775CA] to-[#7FB9F2]", warning: "Only send USDC or ERC-20 tokens to this address." },
    ];
    // Replaced at runtime once admin-configured deposit settings load from Firebase (settings/deposit).
    // Falls back to the defaults above if the admin hasn't configured anything yet.
    let CRYPTO_COINS = DEFAULT_CRYPTO_COINS;
    let selectedCoin = null;
    let depositSettings = {};
    let settingsListenerAttached = false;
    function renderCryptoCoinGrid() {
      const grid = $("cryptoCoinGrid");
      grid.innerHTML = CRYPTO_COINS.map((c) => `
        <button type="button" data-coin="${c.id}" class="crypto-coin-btn rounded-md p-3 flex flex-col items-center gap-2 text-center border-2 border-transparent surface-2 transition">
          <span class="w-10 h-10 rounded-full bg-gradient-to-br ${c.grad} flex items-center justify-center text-white font-serif font-medium text-[12px] flex-shrink-0">${c.ticker.slice(0,1)}</span>
          <span class="text-[12px] font-medium">${c.ticker}</span>
        </button>
      `).join("");
      grid.querySelectorAll("[data-coin]").forEach((btn) => btn.addEventListener("click", () => selectCryptoCoin(btn.dataset.coin)));
    }
    function selectCryptoCoin(coinId) {
      selectedCoin = CRYPTO_COINS.find((c) => c.id === coinId);
      document.querySelectorAll(".crypto-coin-btn").forEach((b) => {
        b.classList.toggle("border-[var(--leaf)]", b.dataset.coin === coinId);
        b.classList.toggle("border-transparent", b.dataset.coin !== coinId);
      });
      $("cryptoAddress").textContent = selectedCoin.address;
      $("cryptoNetworkLabel").textContent = selectedCoin.name;
      $("cryptoWarning").textContent = selectedCoin.warning;
      $("cryptoQr").src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedCoin.address)}`;
      $("cryptoAddressBox").classList.remove("hidden");
      $("cryptoDepositForm").classList.remove("hidden");
    }
    $("copyCryptoBtn").addEventListener("click", () => { if (selectedCoin) copyText(selectedCoin.address, "Address copied"); });
  
    /* ---------- deposit tabs ---------- */
    document.querySelectorAll("[data-deposit-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-deposit-tab]").forEach((b) => b.classList.toggle("active", b === btn));
        $("depositBankPanel").classList.toggle("hidden", btn.dataset.depositTab !== "bank");
        $("depositCryptoPanel").classList.toggle("hidden", btn.dataset.depositTab !== "crypto");
      });
    });
    document.querySelectorAll(".copy-chip[data-copy-value]").forEach((btn) => btn.addEventListener("click", () => copyText(btn.dataset.copyValue, "Copied")));
    $("copyDepAcctBtn").addEventListener("click", () => copyText($("depAcctNumber").textContent || "", "Account number copied"));
    $("copyDepNameBtn").addEventListener("click", () => copyText($("depAcctName").textContent || "", "Copied"));
    $("copyDepBankBtn").addEventListener("click", () => copyText($("depBankName").textContent || "", "Bank name copied"));
  
    /* ---------- card types (colored) ---------- */
    const CARD_TYPES = [
      { id: "standard", name: "Standard Physical Debit", fee: 200, desc: "Classic debit card, delivered in 5–7 business days.", grad: "from-forest to-forestdeep" },
      { id: "gold", name: "Gold Physical Debit", fee: 500, desc: "Higher limits and premium perks.", grad: "from-[#C9962C] via-[#E9C46A] to-[#9C6B1F]" },
      { id: "platinum", name: "Platinum Metal Card", fee: 1000, desc: "Metal card, highest limits, concierge support.", grad: "from-[#6E7681] via-[#B7BEC7] to-[#4A5058]" },
    ];
  
    function cardVisual(grad, name, holder, numberDisplay) {
      return `
        <div class="rounded-md p-5 text-white relative overflow-hidden bg-gradient-to-br ${grad} aspect-[1.586/1] flex flex-col justify-between shadow-lg">
          <div class="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10"></div>
          <div class="absolute bottom-[-2rem] left-[-1rem] w-24 h-24 rounded-full bg-black/10"></div>
          <div class="flex items-center justify-between relative z-10">
            <span class="w-9 h-7 rounded bg-white/25"></span>
            <span class="font-serif italic-serif text-[14px] tracking-wide">Aureumpay</span>
          </div>
          <div class="relative z-10">
            <p class="font-mono font-medium text-[14.5px] sm:text-[15.5px] tracking-[0.1em] mb-2">${numberDisplay}</p>
            <div class="flex items-end justify-between">
              <div class="min-w-0">
                <p class="text-white/60 text-[9px] font-mono uppercase tracking-[0.12em]">Card holder</p>
                <p class="text-[12px] font-medium truncate max-w-[160px]">${holder || "—"}</p>
              </div>
              <p class="text-[10.5px] font-mono uppercase tracking-[0.08em] text-white/85">${name}</p>
            </div>
          </div>
        </div>`;
    }
  
    function renderCardTypeGrid() {
      const grid = $("cardTypeGrid");
      grid.innerHTML = CARD_TYPES.map((c) => `
          <div class="surface p-4 flex flex-col gap-3">
            ${cardVisual(c.grad, c.name, userData.fullName, "•••• •••• •••• ••••")}
            <p class="help-sm">${c.desc}</p>
            <div class="flex items-center justify-between">
              <span class="font-medium text-[14px]">${fmtMoney(c.fee, "USD")} fee</span>
              <button class="btn-primary font-medium text-[13px] py-2 px-4" data-apply-card="${c.id}">Apply</button>
            </div>
          </div>
        `).join("");
      grid.querySelectorAll("[data-apply-card]").forEach((btn) => {
        btn.addEventListener("click", () => openCardApplyForm(btn.dataset.applyCard));
      });
    }
  
    function renderIssuedCards() {
      const issuedCards = userData.cards ? Object.values(userData.cards) : [];
      const grid = $("issuedCardsGrid");
      if (!issuedCards.length) { grid.innerHTML = ""; return; }
      grid.innerHTML = issuedCards.map((c) => {
        const type = CARD_TYPES.find((t) => t.id === c.typeId) || CARD_TYPES[0];
        return `<div>${cardVisual(type.grad, c.typeName, userData.fullName, `•••• •••• •••• ${c.last4}`)}</div>`;
      }).join("");
    }
  
    function openCardApplyForm(typeId) {
      const type = CARD_TYPES.find((c) => c.id === typeId);
      if (!type) return;
      if (userData.currency !== "USD") {
        setAlert($("cardsAlert"), "Card fees are charged in USD. Set your account currency to USD before applying; no currency conversion is applied.", "rose");
        return;
      }
      $("cardApplyForm").dataset.typeId = typeId;
      $("cardApplyForm").dataset.fee = String(type.fee);
      $("cardApplyForm").dataset.currency = "USD";
      $("cardApplyTypeName").textContent = `${type.name} (${fmtMoney(type.fee, "USD")})`;
      $("cardholderName").value = userData.fullName || "";
      $("cardBillingAddress").value = [userData.address, userData.city, userData.state, userData.country].filter(Boolean).join(", ");
      $("cardApplyForm").classList.remove("hidden");
      $("cardApplyForm").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    $("cancelCardApplyBtn").addEventListener("click", () => $("cardApplyForm").classList.add("hidden"));
  
    /* ---------- i18n ---------- */
    const I18N = {
      en: { "nav.transfer":"Transfer","nav.withdraw":"Withdraw","nav.deposit":"Deposit","nav.cards":"Cards","nav.loans":"Loans","nav.history":"History","nav.settings":"Settings","nav.profile":"Profile","nav.logout":"Log out",
        "overview.title":"Overview","overview.balance":"Available balance","overview.recent":"Recent activity","overview.viewAll":"View all","overview.empty":"No activity yet.",
        "deposit.title":"Deposit","deposit.sub":"Fund your account via bank transfer or crypto.","deposit.bankTab":"Bank transfer","deposit.cryptoTab":"Crypto",
        "deposit.yourDetails":"Your account details","deposit.bankHelp":"Send funds to this account, then confirm below.","deposit.bankNameLbl":"Bank name",
        "deposit.acctNumLbl":"Account number","deposit.acctNameLbl":"Account name","deposit.currencyLbl":"Currency","deposit.confirmTitle":"Already sent the funds?",
        "deposit.amountSent":"Amount deposited","deposit.ref":"Reference / sender name (optional)","deposit.done":"I've made this deposit",
        "deposit.selectCoin":"Select a coin","deposit.cryptoHelp":"Send the exact amount to the address below, then confirm.","deposit.walletAddress":"wallet address",
        "deposit.amountSentUsd":"Amount deposited (USD equivalent)","deposit.txHash":"Transaction hash (optional)","deposit.history":"Deposit history",
        "transfer.sub":"Send money locally or internationally.","transfer.local":"Local transfer","transfer.intl":"International transfer","transfer.bankName":"Recipient bank name",
        "transfer.acctNum":"Recipient account number","transfer.acctName":"Recipient account name","transfer.amount":"Amount","transfer.narration":"Narration (optional)",
        "transfer.send":"Send transfer","transfer.recName":"Recipient full name","transfer.recCountry":"Recipient country","transfer.swift":"SWIFT / BIC code",
        "transfer.iban":"IBAN / account number","transfer.destCurrency":"Destination currency","transfer.purpose":"Purpose of transfer","transfer.sendIntl":"Send international transfer",
        "transfer.history":"Transfer history","transfer.p1":"Family support","transfer.p2":"Business payment","transfer.p3":"Education","transfer.p4":"Other",
        "withdraw.sub":"Cash out to PayPal, Cash App, or your bank.","withdraw.bank":"Bank account","withdraw.request":"Request withdrawal","withdraw.history":"Withdrawal history",
        "cards.sub":"Apply for a physical card. Prices and fees are fixed in USD.","cards.apply":"Apply for card","cards.submitApp":"Submit application","cards.yours":"Your cards & applications","cards.empty":"No cards yet.",
        "loans.sub":"Apply for a loan — funds arrive once approved.","loans.amount":"Loan amount","loans.purpose":"Purpose","loans.duration":"Duration","loans.income":"Monthly income (optional)",
        "loans.apply":"Apply for loan","loans.history":"Loan history","loans.p1":"Business","loans.p2":"Education","loans.p3":"Medical","loans.p4":"Personal",
        "history.title":"Transaction History","history.sub":"Every transaction on your account, from first to most recent.","history.filterType":"Type","history.filterStatus":"Status",
        "history.allTypes":"All types","history.tDeposit":"Deposits","history.tTransfer":"Transfers","history.tWithdrawal":"Withdrawals","history.tCard":"Card applications",
        "history.tLoan":"Loan applications","history.tAdjustment":"Account adjustments","history.tRefund":"Refunds","history.allStatuses":"All statuses","history.stPending":"Pending","history.stApproved":"Approved","history.stRejected":"Rejected",
        "settings.sub":"Personalize how your dashboard looks and reads.","settings.theme":"Appearance","settings.light":"Light","settings.dark":"Dark","settings.font":"Font",
        "settings.language":"Language","settings.pin":"Transaction PIN","profile.sub":"Your personal and account details.","common.select":"Select","common.cancel":"Cancel",
        "common.edit":"Edit","common.save":"Save changes" },
      fr: { "nav.transfer":"Transfert","nav.withdraw":"Retrait","nav.deposit":"Dépôt","nav.cards":"Cartes","nav.loans":"Prêts","nav.history":"Historique","nav.settings":"Paramètres","nav.profile":"Profil","nav.logout":"Déconnexion",
        "overview.title":"Aperçu","overview.balance":"Solde disponible","overview.recent":"Activité récente","overview.viewAll":"Tout voir","overview.empty":"Aucune activité pour le moment.",
        "transfer.sub":"Envoyez de l'argent localement ou à l'international.","transfer.local":"Transfert local","transfer.intl":"Transfert international","transfer.bankName":"Nom de la banque du destinataire",
        "transfer.acctNum":"Numéro de compte du destinataire","transfer.acctName":"Nom du compte du destinataire","transfer.amount":"Montant","transfer.narration":"Motif (facultatif)",
        "transfer.send":"Envoyer le transfert","transfer.recName":"Nom complet du destinataire","transfer.recCountry":"Pays du destinataire","transfer.swift":"Code SWIFT / BIC",
        "transfer.iban":"IBAN / numéro de compte","transfer.destCurrency":"Devise de destination","transfer.purpose":"Motif du transfert","transfer.sendIntl":"Envoyer le transfert international",
        "transfer.history":"Historique des transferts","transfer.p1":"Soutien familial","transfer.p2":"Paiement professionnel","transfer.p3":"Éducation","transfer.p4":"Autre",
        "withdraw.sub":"Retirez vers PayPal, Cash App ou votre banque.","withdraw.bank":"Compte bancaire","withdraw.request":"Demander un retrait","withdraw.history":"Historique des retraits",
        "cards.sub":"Demandez une carte physique. Les prix et frais sont fixes en USD.","cards.apply":"Demander une carte","cards.submitApp":"Soumettre la demande","cards.yours":"Vos cartes et demandes","cards.empty":"Aucune carte pour le moment.",
        "loans.sub":"Demandez un prêt — les fonds arrivent une fois approuvés.","loans.amount":"Montant du prêt","loans.purpose":"Motif","loans.duration":"Durée","loans.income":"Revenu mensuel (facultatif)",
        "loans.apply":"Demander un prêt","loans.history":"Historique des prêts","loans.p1":"Affaires","loans.p2":"Éducation","loans.p3":"Médical","loans.p4":"Personnel",
        "history.title":"Historique des transactions","history.sub":"Chaque transaction de votre compte, de la première à la plus récente.","history.filterType":"Type","history.filterStatus":"Statut",
        "history.allTypes":"Tous les types","history.tDeposit":"Dépôts","history.tTransfer":"Transferts","history.tWithdrawal":"Retraits","history.tCard":"Demandes de carte",
        "history.tLoan":"Demandes de prêt","history.tAdjustment":"Ajustements de compte","history.tRefund":"Remboursements","history.allStatuses":"Tous les statuts","history.stPending":"En attente","history.stApproved":"Approuvé","history.stRejected":"Rejeté",
        "settings.sub":"Personnalisez l'apparence de votre tableau de bord.","settings.theme":"Apparence","settings.light":"Clair","settings.dark":"Sombre","settings.font":"Police",
        "settings.language":"Langue","settings.pin":"Code PIN de transaction","profile.sub":"Vos informations personnelles et de compte.","common.select":"Sélectionner","common.cancel":"Annuler",
        "common.edit":"Modifier","common.save":"Enregistrer" },
      yo: { "nav.transfer":"Fífi Ránṣẹ́","nav.withdraw":"Yiyọ Owó","nav.deposit":"Ìsanwó","nav.cards":"Káàdì","nav.loans":"Awin","nav.history":"Ìtàn","nav.settings":"Ètò","nav.profile":"Àkọsílẹ̀","nav.logout":"Jáde",
        "overview.title":"Àkọ́kọ́","overview.balance":"Owó tó wà","overview.recent":"Ìṣe àìpẹ́","overview.viewAll":"Wo gbogbo","overview.empty":"Kò sí ìṣe kankan.",
        "transfer.local":"Fífirán inú ìlú","transfer.intl":"Fífirán òkèèrè","transfer.amount":"Iye owó","transfer.send":"Fi ránṣẹ́","transfer.sendIntl":"Fi ránṣẹ́ sí òkèèrè",
        "transfer.history":"Ìtàn ìfiránṣẹ́","withdraw.request":"Béèrè yíyọ owó","withdraw.history":"Ìtàn yíyọ owó","cards.apply":"Bèrè fún káàdì","cards.yours":"Káàdì rẹ",
        "cards.empty":"Kò sí káàdì bẹ́ẹ̀","loans.apply":"Bèrè fún awin","loans.history":"Ìtàn awin",
        "history.title":"Ìtàn Ìṣòwò","history.filterType":"Irú","history.filterStatus":"Ipò","history.allTypes":"Gbogbo irú","history.allStatuses":"Gbogbo ipò",
        "settings.theme":"Ìrísí","settings.light":"Ìmọ́lẹ̀","settings.dark":"Òkùnkùn",
        "settings.font":"Fọ́ọ̀nùtù","settings.language":"Èdè","common.cancel":"Fagilé","common.edit":"Ṣàtúnṣe","common.save":"Fi pamọ́" },
      ha: { "nav.transfer":"Canja wuri","nav.withdraw":"Cirewa","nav.deposit":"Ajiya","nav.cards":"Katunan","nav.loans":"Lamuni","nav.history":"Tarihi","nav.settings":"Saituna","nav.profile":"Bayanan Martaba","nav.logout":"Fita",
        "overview.title":"Bayyani","overview.balance":"Ma'auni da ake da shi","overview.recent":"Ayyukan kwanan nan","overview.viewAll":"Duba duka","overview.empty":"Babu ayyuka tukuna.",
        "transfer.local":"Canja wuri na cikin gida","transfer.intl":"Canja wurin kasa da kasa","transfer.amount":"Adadi","transfer.send":"Aika canja wuri","transfer.sendIntl":"Aika canja wurin kasa da kasa",
        "transfer.history":"Tarihin canja wuri","withdraw.request":"Nemi cirewa","withdraw.history":"Tarihin cirewa","cards.apply":"Nemi katin","cards.yours":"Katunanku",
        "cards.empty":"Babu katin tukuna","loans.apply":"Nemi lamuni","loans.history":"Tarihin lamuni",
        "history.title":"Tarihin Ma'amaloli","history.filterType":"Iri","history.filterStatus":"Matsayi","history.allTypes":"Duk nau'i","history.allStatuses":"Duk matsayi",
        "settings.theme":"Kamanni","settings.light":"Haske","settings.dark":"Duhu",
        "settings.font":"Rubutu","settings.language":"Harshe","common.cancel":"Soke","common.edit":"Gyara","common.save":"Ajiye" },
      ig: { "nav.transfer":"Ntugharị","nav.withdraw":"Ndọpụta","nav.deposit":"Nkwụnye ego","nav.cards":"Kaadị","nav.loans":"Mbinye Ego","nav.history":"Akụkọ","nav.settings":"Ntọala","nav.profile":"Profaịlụ","nav.logout":"Pụọ",
        "overview.title":"Nchịkọta","overview.balance":"Ego dị","overview.recent":"Omume ọhụrụ","overview.viewAll":"Lee ihe niile","overview.empty":"Enweghị omume ọ bụla.",
        "transfer.local":"Ntugharị nke obodo","transfer.intl":"Ntugharị mba ụwa","transfer.amount":"Ọnụọgụ","transfer.send":"Zipu ntugharị","transfer.sendIntl":"Zipu ntugharị mba ụwa",
        "transfer.history":"Akụkọ ntugharị","withdraw.request":"Rịọ ndọpụta","withdraw.history":"Akụkọ ndọpụta","cards.apply":"Rịọ maka kaadị","cards.yours":"Kaadị gị",
        "cards.empty":"Enweghị kaadị ka ugbu a","loans.apply":"Rịọ maka mbinye ego","loans.history":"Akụkọ mbinye ego",
        "history.title":"Akụkọ Azụmahịa","history.filterType":"Ụdị","history.filterStatus":"Ọkwa","history.allTypes":"Ụdị niile","history.allStatuses":"Ọkwa niile",
        "settings.theme":"Ọdịdị","settings.light":"Ìhè","settings.dark":"Ọchịchịrị",
        "settings.font":"Ụdị mkpụrụedemede","settings.language":"Asụsụ","common.cancel":"Kagbuo","common.edit":"Dezie","common.save":"Chekwaa" },
      ja: { "nav.transfer":"振込","nav.withdraw":"出金","nav.deposit":"入金","nav.cards":"カード","nav.loans":"ローン","nav.history":"履歴","nav.settings":"設定","nav.profile":"プロフィール","nav.logout":"ログアウト",
        "overview.title":"概要","overview.balance":"利用可能残高","overview.recent":"最近のアクティビティ","overview.viewAll":"すべて表示","overview.empty":"アクティビティはありません。",
        "deposit.title":"入金","deposit.sub":"銀行振込または暗号資産で入金します。","deposit.bankTab":"銀行振込","deposit.cryptoTab":"暗号資産","deposit.history":"入金履歴",
        "transfer.sub":"国内または海外へ送金します。","transfer.local":"国内送金","transfer.intl":"海外送金","transfer.bankName":"受取銀行名","transfer.acctNum":"受取口座番号","transfer.acctName":"口座名義","transfer.amount":"金額","transfer.narration":"メモ（任意）","transfer.send":"送金する","transfer.recName":"受取人の氏名","transfer.recCountry":"受取人の国","transfer.swift":"SWIFT / BICコード","transfer.iban":"IBAN / 口座番号","transfer.destCurrency":"送金先通貨","transfer.purpose":"送金目的","transfer.sendIntl":"海外送金する","transfer.history":"送金履歴",
        "withdraw.sub":"PayPal、Cash App、または銀行口座へ出金します。","withdraw.request":"出金を申請","withdraw.history":"出金履歴",
        "cards.sub":"物理カードを申し込みます。価格と手数料は米ドル固定です。","cards.apply":"カードを申し込む","cards.submitApp":"申し込みを送信","cards.yours":"カードと申請","cards.empty":"カードはまだありません。",
        "loans.apply":"ローンを申し込む","loans.history":"ローン履歴","history.title":"取引履歴","history.sub":"アカウントのすべての取引です。","history.filterType":"種類","history.filterStatus":"ステータス","history.allTypes":"すべての種類","history.allStatuses":"すべてのステータス","history.stPending":"保留中","history.stApproved":"承認済み","history.stRejected":"却下",
        "settings.sub":"ダッシュボードの表示をカスタマイズします。","settings.theme":"外観","settings.light":"ライト","settings.dark":"ダーク","settings.font":"フォント","settings.language":"言語","settings.pin":"取引PIN","profile.sub":"個人情報とアカウント情報。","common.select":"選択","common.cancel":"キャンセル","common.edit":"編集","common.save":"変更を保存" },
      de: { "nav.transfer":"Überweisung","nav.withdraw":"Auszahlung","nav.deposit":"Einzahlung","nav.cards":"Karten","nav.loans":"Kredite","nav.history":"Verlauf","nav.settings":"Einstellungen","nav.profile":"Profil","nav.logout":"Abmelden",
        "overview.title":"Übersicht","overview.balance":"Verfügbarer Kontostand","overview.recent":"Letzte Aktivitäten","overview.viewAll":"Alle anzeigen","overview.empty":"Noch keine Aktivitäten.",
        "deposit.title":"Einzahlung","deposit.sub":"Laden Sie Ihr Konto per Banküberweisung oder Kryptowährung auf.","deposit.bankTab":"Banküberweisung","deposit.cryptoTab":"Krypto","deposit.history":"Einzahlungsverlauf",
        "transfer.sub":"Senden Sie Geld im In- oder Ausland.","transfer.local":"Inlandsüberweisung","transfer.intl":"Internationale Überweisung","transfer.bankName":"Name der Empfängerbank","transfer.acctNum":"Empfängerkontonummer","transfer.acctName":"Name des Kontoinhabers","transfer.amount":"Betrag","transfer.narration":"Verwendungszweck (optional)","transfer.send":"Überweisung senden","transfer.recName":"Vollständiger Name des Empfängers","transfer.recCountry":"Land des Empfängers","transfer.swift":"SWIFT- / BIC-Code","transfer.iban":"IBAN / Kontonummer","transfer.destCurrency":"Zielwährung","transfer.purpose":"Überweisungszweck","transfer.sendIntl":"Internationale Überweisung senden","transfer.history":"Überweisungsverlauf",
        "withdraw.sub":"Auszahlung auf PayPal, Cash App oder Ihr Bankkonto.","withdraw.request":"Auszahlung beantragen","withdraw.history":"Auszahlungsverlauf",
        "cards.sub":"Physische Karte beantragen. Preise und Gebühren sind fest in USD.","cards.apply":"Karte beantragen","cards.submitApp":"Antrag absenden","cards.yours":"Ihre Karten und Anträge","cards.empty":"Noch keine Karten.",
        "loans.apply":"Kredit beantragen","loans.history":"Kreditverlauf","history.title":"Transaktionsverlauf","history.sub":"Alle Transaktionen Ihres Kontos.","history.filterType":"Typ","history.filterStatus":"Status","history.allTypes":"Alle Typen","history.allStatuses":"Alle Status","history.stPending":"Ausstehend","history.stApproved":"Genehmigt","history.stRejected":"Abgelehnt",
        "settings.sub":"Passen Sie die Darstellung Ihres Dashboards an.","settings.theme":"Darstellung","settings.light":"Hell","settings.dark":"Dunkel","settings.font":"Schriftart","settings.language":"Sprache","settings.pin":"Transaktions-PIN","profile.sub":"Ihre persönlichen und Kontodaten.","common.select":"Auswählen","common.cancel":"Abbrechen","common.edit":"Bearbeiten","common.save":"Änderungen speichern" },
      es: { "nav.transfer":"Transferir","nav.withdraw":"Retirar","nav.deposit":"Depositar","nav.cards":"Tarjetas","nav.loans":"Préstamos","nav.history":"Historial","nav.settings":"Configuración","nav.profile":"Perfil","nav.logout":"Cerrar sesión",
        "overview.title":"Resumen","overview.balance":"Saldo disponible","overview.recent":"Actividad reciente","overview.viewAll":"Ver todo","overview.empty":"Aún no hay actividad.",
        "deposit.title":"Depósito","deposit.sub":"Añade fondos mediante transferencia bancaria o criptomonedas.","deposit.bankTab":"Transferencia bancaria","deposit.cryptoTab":"Cripto","deposit.history":"Historial de depósitos",
        "transfer.sub":"Envía dinero a nivel local o internacional.","transfer.local":"Transferencia local","transfer.intl":"Transferencia internacional","transfer.bankName":"Banco del destinatario","transfer.acctNum":"Número de cuenta del destinatario","transfer.acctName":"Titular de la cuenta","transfer.amount":"Importe","transfer.narration":"Concepto (opcional)","transfer.send":"Enviar transferencia","transfer.recName":"Nombre completo del destinatario","transfer.recCountry":"País del destinatario","transfer.swift":"Código SWIFT / BIC","transfer.iban":"IBAN / número de cuenta","transfer.destCurrency":"Moneda de destino","transfer.purpose":"Motivo de la transferencia","transfer.sendIntl":"Enviar transferencia internacional","transfer.history":"Historial de transferencias",
        "withdraw.sub":"Retira a PayPal, Cash App o tu cuenta bancaria.","withdraw.request":"Solicitar retiro","withdraw.history":"Historial de retiros",
        "cards.sub":"Solicita una tarjeta física. Los precios y las comisiones son fijos en USD.","cards.apply":"Solicitar tarjeta","cards.submitApp":"Enviar solicitud","cards.yours":"Tus tarjetas y solicitudes","cards.empty":"Aún no tienes tarjetas.",
        "loans.apply":"Solicitar préstamo","loans.history":"Historial de préstamos","history.title":"Historial de transacciones","history.sub":"Todas las transacciones de tu cuenta.","history.filterType":"Tipo","history.filterStatus":"Estado","history.allTypes":"Todos los tipos","history.allStatuses":"Todos los estados","history.stPending":"Pendiente","history.stApproved":"Aprobada","history.stRejected":"Rechazada",
        "settings.sub":"Personaliza la apariencia de tu panel.","settings.theme":"Apariencia","settings.light":"Claro","settings.dark":"Oscuro","settings.font":"Fuente","settings.language":"Idioma","settings.pin":"PIN de transacciones","profile.sub":"Tus datos personales y de cuenta.","common.select":"Seleccionar","common.cancel":"Cancelar","common.edit":"Editar","common.save":"Guardar cambios" },
      pt: { "nav.transfer":"Transferir","nav.withdraw":"Sacar","nav.deposit":"Depositar","nav.cards":"Cartões","nav.loans":"Empréstimos","nav.history":"Histórico","nav.settings":"Configurações","nav.profile":"Perfil","nav.logout":"Sair",
        "overview.title":"Visão geral","overview.balance":"Saldo disponível","overview.recent":"Atividade recente","overview.viewAll":"Ver tudo","overview.empty":"Ainda não há atividades.",
        "deposit.title":"Depósito","deposit.sub":"Adicione fundos por transferência bancária ou criptomoeda.","deposit.bankTab":"Transferência bancária","deposit.cryptoTab":"Cripto","deposit.history":"Histórico de depósitos",
        "transfer.sub":"Envie dinheiro local ou internacionalmente.","transfer.local":"Transferência local","transfer.intl":"Transferência internacional","transfer.bankName":"Banco do destinatário","transfer.acctNum":"Número da conta do destinatário","transfer.acctName":"Titular da conta","transfer.amount":"Valor","transfer.narration":"Descrição (opcional)","transfer.send":"Enviar transferência","transfer.recName":"Nome completo do destinatário","transfer.recCountry":"País do destinatário","transfer.swift":"Código SWIFT / BIC","transfer.iban":"IBAN / número da conta","transfer.destCurrency":"Moeda de destino","transfer.purpose":"Finalidade da transferência","transfer.sendIntl":"Enviar transferência internacional","transfer.history":"Histórico de transferências",
        "withdraw.sub":"Retire para PayPal, Cash App ou sua conta bancária.","withdraw.request":"Solicitar saque","withdraw.history":"Histórico de saques",
        "cards.sub":"Solicite um cartão físico. Preços e tarifas fixos em USD.","cards.apply":"Solicitar cartão","cards.submitApp":"Enviar solicitação","cards.yours":"Seus cartões e solicitações","cards.empty":"Você ainda não tem cartões.",
        "loans.apply":"Solicitar empréstimo","loans.history":"Histórico de empréstimos","history.title":"Histórico de transações","history.sub":"Todas as transações da sua conta.","history.filterType":"Tipo","history.filterStatus":"Status","history.allTypes":"Todos os tipos","history.allStatuses":"Todos os status","history.stPending":"Pendente","history.stApproved":"Aprovada","history.stRejected":"Rejeitada",
        "settings.sub":"Personalize a aparência do seu painel.","settings.theme":"Aparência","settings.light":"Claro","settings.dark":"Escuro","settings.font":"Fonte","settings.language":"Idioma","settings.pin":"PIN de transação","profile.sub":"Seus dados pessoais e da conta.","common.select":"Selecionar","common.cancel":"Cancelar","common.edit":"Editar","common.save":"Salvar alterações" },
      it: { "nav.transfer":"Trasferisci","nav.withdraw":"Preleva","nav.deposit":"Deposita","nav.cards":"Carte","nav.loans":"Prestiti","nav.history":"Cronologia","nav.settings":"Impostazioni","nav.profile":"Profilo","nav.logout":"Esci",
        "overview.title":"Panoramica","overview.balance":"Saldo disponibile","overview.recent":"Attività recenti","overview.viewAll":"Visualizza tutto","overview.empty":"Nessuna attività.",
        "deposit.title":"Deposito","deposit.sub":"Aggiungi fondi tramite bonifico bancario o criptovaluta.","deposit.bankTab":"Bonifico bancario","deposit.cryptoTab":"Criptovalute","deposit.history":"Cronologia depositi",
        "transfer.sub":"Invia denaro localmente o all'estero.","transfer.local":"Bonifico nazionale","transfer.intl":"Bonifico internazionale","transfer.bankName":"Banca del destinatario","transfer.acctNum":"Numero di conto del destinatario","transfer.acctName":"Intestatario del conto","transfer.amount":"Importo","transfer.narration":"Causale (facoltativa)","transfer.send":"Invia bonifico","transfer.recName":"Nome completo del destinatario","transfer.recCountry":"Paese del destinatario","transfer.swift":"Codice SWIFT / BIC","transfer.iban":"IBAN / numero di conto","transfer.destCurrency":"Valuta di destinazione","transfer.purpose":"Motivo del bonifico","transfer.sendIntl":"Invia bonifico internazionale","transfer.history":"Cronologia bonifici",
        "withdraw.sub":"Preleva su PayPal, Cash App o sul tuo conto bancario.","withdraw.request":"Richiedi prelievo","withdraw.history":"Cronologia prelievi",
        "cards.sub":"Richiedi una carta fisica. Prezzi e commissioni fissi in USD.","cards.apply":"Richiedi carta","cards.submitApp":"Invia richiesta","cards.yours":"Le tue carte e richieste","cards.empty":"Non hai ancora carte.",
        "loans.apply":"Richiedi prestito","loans.history":"Cronologia prestiti","history.title":"Cronologia transazioni","history.sub":"Tutte le transazioni del tuo conto.","history.filterType":"Tipo","history.filterStatus":"Stato","history.allTypes":"Tutti i tipi","history.allStatuses":"Tutti gli stati","history.stPending":"In sospeso","history.stApproved":"Approvata","history.stRejected":"Rifiutata",
        "settings.sub":"Personalizza l'aspetto della dashboard.","settings.theme":"Aspetto","settings.light":"Chiaro","settings.dark":"Scuro","settings.font":"Carattere","settings.language":"Lingua","settings.pin":"PIN transazioni","profile.sub":"I tuoi dati personali e del conto.","common.select":"Seleziona","common.cancel":"Annulla","common.edit":"Modifica","common.save":"Salva modifiche" },
      ar: { "nav.transfer":"تحويل","nav.withdraw":"سحب","nav.deposit":"إيداع","nav.cards":"البطاقات","nav.loans":"القروض","nav.history":"السجل","nav.settings":"الإعدادات","nav.profile":"الملف الشخصي","nav.logout":"تسجيل الخروج",
        "overview.title":"نظرة عامة","overview.balance":"الرصيد المتاح","overview.recent":"النشاط الأخير","overview.viewAll":"عرض الكل","overview.empty":"لا توجد أنشطة بعد.",
        "deposit.title":"إيداع","deposit.sub":"أضف أموالاً عبر التحويل البنكي أو العملات الرقمية.","deposit.bankTab":"تحويل بنكي","deposit.cryptoTab":"عملات رقمية","deposit.history":"سجل الإيداعات",
        "transfer.sub":"أرسل الأموال محلياً أو دولياً.","transfer.local":"تحويل محلي","transfer.intl":"تحويل دولي","transfer.bankName":"اسم بنك المستلم","transfer.acctNum":"رقم حساب المستلم","transfer.acctName":"اسم صاحب الحساب","transfer.amount":"المبلغ","transfer.narration":"الوصف (اختياري)","transfer.send":"إرسال التحويل","transfer.recName":"الاسم الكامل للمستلم","transfer.recCountry":"بلد المستلم","transfer.swift":"رمز SWIFT / BIC","transfer.iban":"IBAN / رقم الحساب","transfer.destCurrency":"عملة الوجهة","transfer.purpose":"غرض التحويل","transfer.sendIntl":"إرسال تحويل دولي","transfer.history":"سجل التحويلات",
        "withdraw.sub":"اسحب إلى PayPal أو Cash App أو حسابك البنكي.","withdraw.request":"طلب سحب","withdraw.history":"سجل السحب",
        "cards.sub":"اطلب بطاقة فعلية. الأسعار والرسوم ثابتة بالدولار الأمريكي.","cards.apply":"طلب بطاقة","cards.submitApp":"إرسال الطلب","cards.yours":"بطاقاتك وطلباتك","cards.empty":"لا توجد بطاقات بعد.",
        "loans.apply":"طلب قرض","loans.history":"سجل القروض","history.title":"سجل المعاملات","history.sub":"جميع المعاملات في حسابك.","history.filterType":"النوع","history.filterStatus":"الحالة","history.allTypes":"جميع الأنواع","history.allStatuses":"جميع الحالات","history.stPending":"قيد الانتظار","history.stApproved":"موافق عليه","history.stRejected":"مرفوض",
        "settings.sub":"خصص مظهر لوحة التحكم.","settings.theme":"المظهر","settings.light":"فاتح","settings.dark":"داكن","settings.font":"الخط","settings.language":"اللغة","settings.pin":"رمز PIN للمعاملات","profile.sub":"بياناتك الشخصية وبيانات الحساب.","common.select":"اختيار","common.cancel":"إلغاء","common.edit":"تعديل","common.save":"حفظ التغييرات" },
    };
  
    function applyLanguage(lang) {
      const dict = I18N[lang] || I18N.en;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        el.textContent = dict[key] || I18N.en[key] || el.textContent;
      });
      applyDepositSettingsToUI();
    }
  
    /* ---------- admin-configured deposit settings (bank name/help text/account number/name/currency + crypto coins) ---------- */
    // Admin-configured settings/deposit/bank values win over the user's own profile data;
    // if the admin hasn't filled a field in yet, we fall back to the user's profile so the
    // panel never shows a blank dash where a real value could go.
    function applyDepositSettingsToUI() {
      const bank = (depositSettings && depositSettings.bank) || {};
      $("depBankName").textContent = bank.bankName || "Aureumpay";
      if (bank.helpText) $("depositBankHelpText").textContent = bank.helpText;
  
      const acctNumber = bank.accountNumber || userData.accountNumber || "";
      $("depAcctNumber").textContent = acctNumber ? acctNumber.replace(/(\d{4})(?=\d)/g, "$1 ").trim() : "—";
      $("depAcctName").textContent = bank.accountName || userData.fullName || "—";
      $("depCurrency").textContent = bank.currency || userData.currency || "—";
    }
    function refreshCryptoCoinsFromSettings() {
      const configured = depositSettings.crypto && depositSettings.crypto.coins;
      const palette = ["from-[#F7931A] to-[#FFB74D]", "from-[#627EEA] to-[#8AA6FF]", "from-[#26A17B] to-[#5FD6AE]", "from-[#2775CA] to-[#7FB9F2]", "from-leaf to-forest", "from-[#E1306C] to-[#F77737]", "from-[#00C244] to-[#00D95F]"];
      if (configured && Object.keys(configured).length) {
        const enabledCoins = Object.entries(configured)
          .filter(([id, c]) => c && c.enabled !== false && c.address)
          .map(([id, c], i) => ({
            id,
            name: c.name || c.ticker || id.toUpperCase(),
            ticker: c.ticker || id.toUpperCase(),
            network: c.network || `${c.ticker || id.toUpperCase()} network`,
            address: c.address,
            grad: palette[i % palette.length],
            warning: c.warning || `Only send ${c.ticker || ""} to this address.`,
          }));
        CRYPTO_COINS = enabledCoins.length ? enabledCoins : DEFAULT_CRYPTO_COINS;
      } else {
        CRYPTO_COINS = DEFAULT_CRYPTO_COINS;
      }
      // A coin the user had selected may no longer exist/be visible — reset the picker.
      selectedCoin = null;
      $("cryptoAddressBox").classList.add("hidden");
      $("cryptoDepositForm").classList.add("hidden");
      renderCryptoCoinGrid();
    }
  
    /* ---------- theme / font / settings ---------- */
    function applyTheme(theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.querySelectorAll(".theme-btn").forEach((b) => b.classList.toggle("active", b.dataset.theme === theme));
    }
    function applyFont(font) {
      // Headings stay locked to Aureumpay's serif (--font-display); only body/UI text follows the user's pick.
      document.documentElement.style.setProperty("--font-ui", `'${font}', sans-serif`);
      $("fontSelect").value = font;
    }
    $("fontSelect").addEventListener("change", (e) => { applyFont(e.target.value); saveSettings({ font: e.target.value }); });
    $("languageSelect").addEventListener("change", (e) => { applyLanguage(e.target.value); saveSettings({ language: e.target.value }); });
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => { applyTheme(btn.dataset.theme); saveSettings({ theme: btn.dataset.theme }); });
    });
    function saveSettings(partial) {
      if (!currentUid) return;
      update(ref(db, `users/${currentUid}/settings`), partial).catch(() => {});
    }
  
    /* ---------- sidebar nav / drawer ---------- */
    const sectionIds = ["overview", "deposit", "transfer", "withdraw", "cards", "loans", "history", "settings", "profile"];
    function goToSection(name) {
      sectionIds.forEach((s) => $(`sec-${s}`).classList.toggle("hidden", s !== name));
      document.querySelectorAll(".nav-item[data-section]").forEach((el) => el.classList.toggle("active", el.dataset.section === name));
      const titles = { overview: "Overview", deposit: "Deposit", transfer: "Transfer", withdraw: "Withdraw", cards: "Cards", loans: "Loans", history: "Transaction History", settings: "Settings", profile: "Profile" };
      $("mobileTitle").textContent = titles[name] || "Overview";
      closeDrawer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    document.querySelectorAll(".nav-item[data-section]").forEach((el) => el.addEventListener("click", () => goToSection(el.dataset.section)));
    document.querySelectorAll("[data-goto]").forEach((el) => el.addEventListener("click", () => goToSection(el.dataset.goto)));
  
    function openDrawer() { $("sidebar").classList.remove("-translate-x-full"); $("drawerBackdrop").classList.remove("hidden"); }
    function closeDrawer() { $("sidebar").classList.add("-translate-x-full"); $("drawerBackdrop").classList.add("hidden"); }
    $("openDrawerBtn").addEventListener("click", openDrawer);
    $("closeDrawerBtn").addEventListener("click", closeDrawer);
    $("drawerBackdrop").addEventListener("click", closeDrawer);
    // On large screens the sidebar should never be translated off-canvas
    function syncSidebarForViewport() {
      if (window.innerWidth >= 1024) $("sidebar").classList.remove("-translate-x-full");
      else $("sidebar").classList.add("-translate-x-full");
    }
    window.addEventListener("resize", syncSidebarForViewport);
    syncSidebarForViewport();
  
    /* ---------- transfer tabs ---------- */
    document.querySelectorAll("[data-transfer-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-transfer-tab]").forEach((b) => b.classList.toggle("active", b === btn));
        $("localTransferForm").classList.toggle("hidden", btn.dataset.transferTab !== "local");
        $("intlTransferForm").classList.toggle("hidden", btn.dataset.transferTab !== "intl");
      });
    });
  
    renderWithdrawMethodGrid();
    renderCryptoCoinGrid();
  
    /* ---------- transaction history filters ---------- */
    $("historyTypeFilter").addEventListener("change", renderHistoryList);
    $("historyStatusFilter").addEventListener("change", renderHistoryList);
  
    /* ---------- PIN hashing + modal (transfers — single user-created PIN) ---------- */
    async function sha256Hex(text) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    function wirePinBoxes(selector) {
      const boxes = Array.from(document.querySelectorAll(selector));
      boxes.forEach((box, i) => {
        box.addEventListener("input", () => {
          box.value = box.value.replace(/[^0-9]/g, "").slice(0, 1);
          if (box.value && boxes[i + 1]) boxes[i + 1].focus();
        });
        box.addEventListener("keydown", (e) => { if (e.key === "Backspace" && !box.value && boxes[i - 1]) boxes[i - 1].focus(); });
      });
    }
    wirePinBoxes(".pin-digit");
    wirePinBoxes(".pin-confirm-digit");
    function readPinBoxes(selector) { return Array.from(document.querySelectorAll(selector)).map((b) => b.value).join(""); }
    function clearPinBoxes(selector) { document.querySelectorAll(selector).forEach((b) => (b.value = "")); }
  
    let pinResolveCallback = null;
    function requireTransactionPin(onVerified) {
      pinResolveCallback = onVerified;
      const hasPin = !!userData.pinHash;
      $("pinModalTitle").textContent = hasPin ? "Enter your transaction PIN" : "Create your transaction PIN";
      $("pinModalSub").textContent = hasPin ? "Confirm this action with your 4-digit PIN." : "You'll use this to approve transfers.";
      $("pinConfirmRow").classList.toggle("hidden", hasPin);
      $("pinConfirmRow").classList.toggle("flex", !hasPin);
      $("pinError").classList.add("hidden");
      clearPinBoxes(".pin-digit,.pin-confirm-digit");
      $("pinModal").classList.remove("hidden");
      document.querySelector(".pin-digit").focus();
    }
    $("pinCancelBtn").addEventListener("click", () => { $("pinModal").classList.add("hidden"); pinResolveCallback = null; });
    $("pinSubmitBtn").addEventListener("click", async () => {
      const pin = readPinBoxes(".pin-digit");
      if (pin.length !== 4) { $("pinError").textContent = "Enter all 4 digits."; $("pinError").classList.remove("hidden"); return; }
  
      if (!userData.pinHash) {
        const confirmPin = readPinBoxes(".pin-confirm-digit");
        if (confirmPin.length !== 4 || confirmPin !== pin) { $("pinError").textContent = "PINs don't match."; $("pinError").classList.remove("hidden"); return; }
        const hash = await sha256Hex(pin);
        await update(ref(db, `users/${currentUid}`), { pinHash: hash });
        userData.pinHash = hash;
        showToast("Transaction PIN created", "mint");
      } else {
        const hash = await sha256Hex(pin);
        if (hash !== userData.pinHash) { $("pinError").textContent = "Incorrect PIN."; $("pinError").classList.remove("hidden"); shakeEl($("pinModal").firstElementChild); return; }
      }
  
      $("pinModal").classList.add("hidden");
      const cb = pinResolveCallback;
      pinResolveCallback = null;
      if (cb) cb();
    });
    $("resetPinBtn").addEventListener("click", () => {
      requireTransactionPin(() => {
        update(ref(db, `users/${currentUid}`), { pinHash: null }).then(() => {
          userData.pinHash = null;
          showToast("PIN cleared — set a new one on your next transfer", "mint");
          updatePinStatusText();
        });
      });
    });
    function updatePinStatusText() {
      $("pinStatusText").textContent = userData.pinHash ? "Your transaction PIN is set." : "Not set yet — you'll be asked to create one on your first transfer.";
    }
  
    /* ---------- one-time Digital Access Key (DAK) verification ---------- */
    let dakResolveCallback = null;
    const dakInput = $("dakInput");
    dakInput.addEventListener("input", () => {
      dakInput.value = dakInput.value.replace(/[^0-9]/g, "").slice(0, 5);
    });
  
    function requireDigitalAccessKey(onVerified) {
      if (userData.dakEnabled === false || userData.dakVerified === true) {
        onVerified();
        return;
      }
      dakResolveCallback = onVerified;
      $("dakError").classList.add("hidden");
      dakInput.value = "";
      $("dakModal").classList.remove("hidden");
      dakInput.focus();
    }
  
    $("dakCancelBtn").addEventListener("click", () => {
      $("dakModal").classList.add("hidden");
      dakResolveCallback = null;
    });
  
    $("dakSubmitBtn").addEventListener("click", async () => {
      const entered = dakInput.value.trim();
      if (!/^\d{5}$/.test(entered)) {
        $("dakError").textContent = "Enter your complete 5-digit DAK.";
        $("dakError").classList.remove("hidden");
        return;
      }
  
      const claimRef = ref(db, `dakClaims/${currentUid}`);
      try {
        await set(claimRef, entered);
        await update(ref(db, `users/${currentUid}`), { dakVerified: true });
        userData.dakVerified = true;
      } catch (error) {
        console.error("Could not verify the Digital Access Key:", error);
        $("dakError").textContent = "DAK not verified. Check the code or contact support to get your DAK.";
        $("dakError").classList.remove("hidden");
        shakeEl($("dakModal").firstElementChild);
        dakInput.value = "";
        dakInput.focus();
        try {
          await remove(claimRef);
        } catch (cleanupError) {
          console.error("Could not clear the failed DAK claim:", cleanupError);
        }
        return;
      }
  
      try {
        await remove(claimRef);
      } catch (error) {
        console.error("Could not clear the verified DAK claim:", error);
      }
      $("dakModal").classList.add("hidden");
      const callback = dakResolveCallback;
      dakResolveCallback = null;
      if (callback) callback();
    });
  
    /* ---------- active/inactive gating ---------- */
    function applyActiveGating() {
      const isActive = !!userData.active;
  
      $("pendingApprovalBanner").classList.toggle("hidden", isActive);
  
      const isActivePill = $("acctStatusPill");
      isActivePill.style.background = isActive ? "rgba(255,255,255,.14)" : "rgba(179,67,43,.28)";
      $("acctStatusDot").style.background = isActive ? "#4B8EF5" : "#F2A2A2";
      $("acctStatusText").textContent = isActive ? "Active" : "Inactive";
  
      ["qaDepositLock", "qaTransferLock"].forEach((id) => {
        $(id).classList.toggle("hidden", isActive);
        $(id).classList.toggle("flex", !isActive);
      });
  
      $("depositLockedNotice").classList.toggle("hidden", isActive);
      $("depositActionArea").classList.toggle("hidden", !isActive);
  
      $("transferLockedNotice").classList.toggle("hidden", isActive);
      $("transferActionArea").classList.toggle("hidden", !isActive);
  
      $("withdrawLockedNotice").classList.toggle("hidden", isActive);
      $("withdrawActionArea").classList.toggle("hidden", !isActive);
    }
  
    /* ---------- transactions: create + render ---------- */
    async function createTransaction(payload) {
      const txRef = push(ref(db, "transactions"));
      await set(txRef, {
        uid: currentUid,
        status: "pending",
        createdAt: new Date().toISOString(),
        ...payload,
      });
      return txRef.key;
    }

    async function notifyEmail(payload) {
      try {
        await sendEmailNotification(auth.currentUser, payload);
        return true;
      } catch (error) {
        console.error("Email notification failed after the account change was saved:", error);
        showToast("Your request was saved, but its email notification could not be sent.", "rose");
        return false;
      }
    }

    async function createPendingTransfer(payload) {
      const amount = Number(payload.amount);
      const balance = Number(userData.balance || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Enter a valid transfer amount.");
      }
      if (amount > balance) {
        throw new Error("Your available balance has changed. Check your balance and try again.");
      }

      const txRef = push(ref(db, "transactions"));
      const nextBalance = balance - amount;
      await update(ref(db), {
        [`users/${currentUid}/balance`]: nextBalance,
        [`transactions/${txRef.key}`]: {
          uid: currentUid,
          status: "pending",
          createdAt: new Date().toISOString(),
          balanceReserved: true,
          ...payload,
        },
      });

      userData.balance = nextBalance;
      await Promise.all([
        notifyEmail({ type: "transfer", transactionId: txRef.key }),
        notifyEmail({ type: "balance", transactionId: txRef.key }),
      ]);
      const balanceDisplay = $("balanceDisplay");
      if (balanceDisplay) balanceDisplay.textContent = fmtMoney(nextBalance, userData.currency);
      return txRef.key;
    }

    function statusPill(status) {
      const map = { pending: ["pill-pending", "Pending"], approved: ["pill-approved", "Approved"], rejected: ["pill-rejected", "Rejected"] };
      const [cls, label] = map[status] || map.pending;
      return `<span class="pill ${cls}">${label}</span>`;
    }
  
    // Friendly, user-facing description for a transaction row.
    // Admin balance adjustments should read as a plain credit/debit, never "Admin credit/debit".
    function displayDescription(tx) {
      if (tx.type === "admin_refund") {
        return tx.description || "Refund issued";
      }
      if (tx.type === "admin_adjustment") {
        return tx.direction === "credit" ? "Account credited" : "Account debited";
      }
      return tx.description || tx.type;
    }
  
    function renderTxList(container, list, emptyKey) {
      if (!list.length) { container.innerHTML = `<p class="p-5 text-muted2 text-[13.5px] text-center" data-i18n="${emptyKey}">No activity yet.</p>`; applyLanguage(currentLang()); return; }
      container.innerHTML = list.map((tx) => `
        <div class="p-4 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="font-medium text-[14px] truncate">${displayDescription(tx)}</p>
            <p class="help-sm">${formatTxDate(tx.createdAt)}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="font-mono font-medium text-[14px] mb-1">${tx.amount != null ? (tx.direction === "credit" ? "+" : "−") + fmtMoney(tx.amount, tx.currency || userData.currency) : ""}</p>
            ${statusPill(tx.status)}
          </div>
        </div>
      `).join("");
    }
    function currentLang() { return $("languageSelect").value || "en"; }
  
    // Type filter used only by the full Transaction History page.
    function matchesHistoryTypeFilter(tx, filter) {
      if (filter === "all") return true;
      if (filter === "deposit") return !!(tx.type && tx.type.startsWith("deposit"));
      if (filter === "transfer") return !!(tx.type && tx.type.startsWith("transfer"));
      if (filter === "withdrawal") return tx.type === "withdrawal";
      if (filter === "card_application") return tx.type === "card_application";
      if (filter === "loan_application") return tx.type === "loan_application";
      if (filter === "admin_adjustment") return tx.type === "admin_adjustment";
      if (filter === "admin_refund") return tx.type === "admin_refund";
      return true;
    }
    function renderHistoryList() {
      const typeFilter = $("historyTypeFilter").value;
      const statusFilter = $("historyStatusFilter").value;
      const filtered = allTx.filter((tx) => matchesHistoryTypeFilter(tx, typeFilter) && (statusFilter === "all" || tx.status === statusFilter));
      renderTxList($("fullHistoryList"), filtered, "overview.empty");
    }
  
    function refreshAllLists() {
      const byType = (t) => allTx.filter((tx) => tx.type === t || (t === "transfer" && tx.type?.startsWith("transfer")) || (t === "deposit" && tx.type?.startsWith("deposit")));
      // Recent activity on the Overview page is capped to the 5 most recent items;
      // older ones drop off here but remain fully available in Transaction History.
      renderTxList($("recentActivity"), allTx.slice(0, 5), "overview.empty");
      renderTxList($("depositHistory"), byType("deposit"), "overview.empty");
      renderTxList($("transferHistory"), byType("transfer"), "overview.empty");
      renderTxList($("withdrawHistory"), byType("withdrawal"), "overview.empty");
      renderTxList($("loansHistory"), byType("loan_application"), "overview.empty");
      renderHistoryList();
  
      const cardTx = byType("card_application");
      $("cardsHistory").innerHTML = cardTx.length ? cardTx.map((tx) => `
          <div class="p-4 flex items-center justify-between gap-3">
            <div><p class="font-medium text-[14px]">${displayDescription(tx)}</p><p class="help-sm">${formatTxDate(tx.createdAt)}</p></div>
            ${statusPill(tx.status)}
          </div>`).join("") : `<p class="p-5 text-muted2 text-[13.5px] text-center" data-i18n="cards.empty">No cards yet.</p>`;
      renderIssuedCards();
      applyLanguage(currentLang());
    }
  
    /* ---------- form submit handlers ---------- */
    function validateAmount(inputId, errorId, balance) {
      const val = Number($(inputId).value);
      if (!val || val <= 0) { setFieldErr(errorId, "Enter a valid amount."); return null; }
      if (val > balance) { setFieldErr(errorId, "This exceeds your available balance."); return null; }
      setFieldErr(errorId, "");
      return val;
    }
    function setFieldErr(errorId, msg) {
      const el = $(errorId);
      if (!el) {
        console.error(`Could not display field validation error: element "${errorId}" is missing.`);
        if (msg) showToast(msg, "rose");
        return;
      }
      if (msg) { el.textContent = msg; el.classList.remove("hidden"); } else { el.classList.add("hidden"); }
    }
  
    /* ---------- deposit forms (credit, pending admin approval) ---------- */
    $("bankDepositForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — deposits are locked for now.", "rose"); return; }
      const amount = Number($("bdAmount").value);
      if (!amount || amount <= 0) { setFieldErr("bdAmountError", "Enter a valid amount."); return; }
      setFieldErr("bdAmountError", "");
      await createTransaction({
        type: "deposit_bank", direction: "credit", amount, currency: userData.currency,
        description: "Bank transfer deposit",
        details: { reference: $("bdRef").value.trim() },
      });
      $("bankDepositForm").reset();
      setAlert($("depositAlert"), "Deposit submitted — pending admin approval.", "mint");
      showToast("Deposit submitted", "mint");
    });
  
    $("cryptoDepositForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — deposits are locked for now.", "rose"); return; }
      if (!selectedCoin) { setAlert($("depositAlert"), "Select a coin first.", "rose"); return; }
      const amount = Number($("cdAmount").value);
      if (!amount || amount <= 0) { setFieldErr("cdAmountError", "Enter a valid amount."); return; }
      setFieldErr("cdAmountError", "");
      await createTransaction({
        type: "deposit_crypto", direction: "credit", amount, currency: "USD",
        description: `${selectedCoin.name} (${selectedCoin.ticker}) deposit`,
        details: { coin: selectedCoin.ticker, address: selectedCoin.address, txHash: $("cdHash").value.trim() },
      });
      $("cryptoDepositForm").reset();
      setAlert($("depositAlert"), "Deposit submitted — pending admin approval.", "mint");
      showToast("Deposit submitted", "mint");
    });
  
    $("localTransferForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — transfers are locked for now.", "rose"); return; }
      const amount = validateAmount("ltAmount", "ltAmountError", userData.balance || 0);
      if (!amount) return;
      requireDigitalAccessKey(() => requireTransactionPin(async () => {
          try {
            await createPendingTransfer({
              type: "transfer_local", direction: "debit", amount, currency: userData.currency,
              description: `Local transfer to ${$("ltAccountName").value.trim()}`,
              details: { bankName: $("ltBankName").value.trim(), accountNumber: $("ltAccountNumber").value.trim(), accountName: $("ltAccountName").value.trim(), narration: $("ltNarration").value.trim() },
            });
            $("localTransferForm").reset();
            setAlert($("transferAlert"), "Transfer submitted — the amount has been reserved and is pending admin approval.", "mint");
            showToast("Transfer submitted", "mint");
          } catch (error) {
            console.error("Could not submit local transfer:", error);
            setAlert($("transferAlert"), error.message || "Could not submit transfer. Please try again.", "rose");
          }
        }));
    });
  
    $("intlTransferForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — transfers are locked for now.", "rose"); return; }
      const amount = validateAmount("itAmount", "itAmountError", userData.balance || 0);
      if (!amount) return;
      requireDigitalAccessKey(() => requireTransactionPin(async () => {
          try {
            await createPendingTransfer({
              type: "transfer_international", direction: "debit", amount, currency: userData.currency,
              description: `International transfer to ${$("itName").value.trim()} (${$("itCountry").value})`,
              details: { recipientName: $("itName").value.trim(), recipientCountry: $("itCountry").value, bankName: $("itBankName").value.trim(), swift: $("itSwift").value.trim(), accountNumber: $("itAccountNumber").value.trim(), destCurrency: $("itCurrency").value, purpose: $("itPurpose").value },
            });
            $("intlTransferForm").reset();
            setAlert($("transferAlert"), "Transfer submitted — the amount has been reserved and is pending admin approval.", "mint");
            showToast("Transfer submitted", "mint");
          } catch (error) {
            console.error("Could not submit international transfer:", error);
            setAlert($("transferAlert"), error.message || "Could not submit transfer. Please try again.", "rose");
          }
        }));
    });
  
    /* ---------- withdrawal forms — gated by the one-time DAK ---------- */
    $("paypalForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — withdrawals are locked for now.", "rose"); return; }
      const amount = validateAmount("ppAmount", "ppAmountError", userData.balance || 0);
      if (!amount) return;
      requireDigitalAccessKey(async () => {
        await createTransaction({ type: "withdrawal", direction: "debit", amount, currency: userData.currency, description: "Withdrawal to PayPal", details: { method: "paypal", paypalEmail: $("ppEmail").value.trim() } });
        $("paypalForm").reset();
        setAlert($("withdrawAlert"), "Withdrawal requested — pending admin approval.", "mint");
        showToast("Withdrawal requested", "mint");
      });
    });
    $("cashappForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — withdrawals are locked for now.", "rose"); return; }
      const amount = validateAmount("caAmount", "caAmountError", userData.balance || 0);
      if (!amount) return;
      requireDigitalAccessKey(async () => {
        await createTransaction({ type: "withdrawal", direction: "debit", amount, currency: userData.currency, description: "Withdrawal to Cash App", details: { method: "cashapp", cashtag: $("caTag").value.trim() } });
        $("cashappForm").reset();
        setAlert($("withdrawAlert"), "Withdrawal requested — pending admin approval.", "mint");
        showToast("Withdrawal requested", "mint");
      });
    });
    $("bankWithdrawForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!userData.active) { showToast("Your account is pending approval — withdrawals are locked for now.", "rose"); return; }
      const amount = validateAmount("bwAmount", "bwAmountError", userData.balance || 0);
      if (!amount) return;
      requireDigitalAccessKey(async () => {
        await createTransaction({ type: "withdrawal", direction: "debit", amount, currency: userData.currency, description: "Withdrawal to bank account", details: { method: "bank", accountHolderName: $("bwName").value.trim(), bankName: $("bwBank").value.trim(), accountNumber: $("bwAccountNumber").value.trim(), routing: $("bwRouting").value.trim() } });
        $("bankWithdrawForm").reset();
        setAlert($("withdrawAlert"), "Withdrawal requested — pending admin approval.", "mint");
        showToast("Withdrawal requested", "mint");
      });
    });
  
    $("cardApplyForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const typeId = $("cardApplyForm").dataset.typeId;
      const type = CARD_TYPES.find((c) => c.id === typeId);
      const fee = Number($("cardApplyForm").dataset.fee);
      const currency = $("cardApplyForm").dataset.currency;
      if (currency !== "USD" || userData.currency !== "USD") {
        setAlert($("cardsAlert"), "Card fees are charged in USD. Set your account currency to USD before applying; no currency conversion is applied.", "rose");
        return;
      }
      if (!Number.isFinite(fee) || !type) {
        setAlert($("cardsAlert"), "Current card pricing is unavailable. Please try again later.", "rose");
        return;
      }
      if (fee > (userData.balance || 0)) { setAlert($("cardsAlert"), "Your balance may not cover this card's fee — the fee is charged when your card is approved.", "rose"); }
      await createTransaction({
        type: "card_application", direction: "debit", amount: fee, currency,
        description: `${type.name} application`,
        details: { cardTypeId: type.id, cardTypeName: type.name, cardholderName: $("cardholderName").value.trim(), billingAddress: $("cardBillingAddress").value.trim(), basePriceUsd: type.fee },
      });
      $("cardApplyForm").classList.add("hidden");
      $("cardApplyForm").reset();
      setAlert($("cardsAlert"), "Card application submitted — pending admin approval.", "mint");
      showToast("Card application submitted", "mint");
    });
  
    $("loanForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = Number($("loanAmount").value);
      if (!amount || amount <= 0) { setAlert($("loansAlert"), "Enter a valid loan amount.", "rose"); return; }
      setAlert($("loansAlert"), "");
      await createTransaction({
        type: "loan_application", direction: "credit", amount, currency: userData.currency,
        description: `Loan application (${$("loanDuration").value} months)`,
        details: { purpose: $("loanPurpose").value, durationMonths: Number($("loanDuration").value), monthlyIncome: Number($("loanIncome").value || 0) },
      });
      $("loanForm").reset();
      setAlert($("loansAlert"), "Loan application submitted — pending admin approval.", "mint");
      showToast("Loan application submitted", "mint");
    });
  
    /* ---------- profile ---------- */
    $("editProfileBtn").addEventListener("click", () => {
      const editing = $("editProfileBtn").dataset.editing === "true";
      const fields = ["pFullName", "pPhone", "pDob", "pCountry", "pCurrency", "pAddress", "pCity", "pState", "pPostal", "pEmployment", "pOccupation"];
      fields.forEach((id) => $(id).disabled = editing);
      $("editProfileBtn").dataset.editing = String(!editing);
      $("editProfileBtn").textContent = editing ? "Edit" : "Cancel";
      $("profileSaveRow").classList.toggle("hidden", editing);
    });
    $("profileForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const updates = {
        fullName: $("pFullName").value.trim(), phone: $("pPhone").value.trim(), dob: $("pDob").value,
        country: $("pCountry").value, currency: $("pCurrency").value, address: $("pAddress").value.trim(),
        city: $("pCity").value.trim(), state: $("pState").value.trim(), postalCode: $("pPostal").value.trim(),
        employmentStatus: $("pEmployment").value, occupation: $("pOccupation").value.trim(),
      };
      await update(ref(db, `users/${currentUid}`), updates);
      userData = { ...userData, ...updates };
      setAlert($("profileAlert"), "Profile updated.", "mint");
      showToast("Profile updated", "mint");
      $("editProfileBtn").click();
      paintOverviewFromUserData();
    });
    function fillProfileForm() {
      const address = userData.address && typeof userData.address === "object" ? userData.address : {};
      const fullName = userData.fullName || [userData.firstName, userData.lastName].filter(Boolean).join(" ");
      $("pFullName").value = fullName;
      $("pEmail").value = userData.email || auth.currentUser?.email || "";
      $("pPhone").value = userData.phone || "";
      $("pDob").value = userData.dob || "";
      $("pCountry").value = userData.country || userData.countryResidence || address.country || "";
      $("pCurrency").value = userData.currency || "";
      $("pAddress").value = typeof userData.address === "string"
        ? userData.address
        : [address.line1, address.line2].filter(Boolean).join(", ");
      $("pCity").value = userData.city || address.city || "";
      $("pState").value = userData.state || address.state || "";
      $("pPostal").value = userData.postalCode || address.postalCode || "";
      $("pEmployment").value = userData.employmentStatus || "";
      $("pOccupation").value = userData.occupation || "";
    }
  
    /* ---------- overview painting ---------- */
    function paintOverviewFromUserData() {
      $("balanceDisplay").textContent = fmtMoney(userData.balance || 0, userData.currency);
      $("acctNumberChip").textContent = userData.accountNumber ? userData.accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ").trim() : "—";
      $("currencyChip").textContent = userData.currency || "—";
      $("greetingText").textContent = `Welcome back, ${(userData.fullName || "").split(" ")[0] || "there"}.`;
      $("avatarChip").textContent = (userData.fullName || "?").trim().charAt(0).toUpperCase();
      const tzNote = $("historyTzNote");
      if (tzNote) tzNote.textContent = `Times shown in ${userData.country || userData.countryResidence || "your"} time (${userTimeZone()}).`;
      updatePinStatusText();
      renderCardTypeGrid();
      applyActiveGating();
      // Re-paint the Deposit page's account number/name/currency in case user data
      // finished loading after the admin deposit settings listener already fired.
      applyDepositSettingsToUI();
    }
  
    /* ---------- auth + data wiring ---------- */
    onAuthStateChanged(auth, (user) => {
      if (!user) { navigate("/login"); return; }
      currentUid = user.uid;

      if (!settingsListenerAttached) {
        settingsListenerAttached = true;
        onValue(ref(db, "settings/deposit"), (snap) => {
          depositSettings = snap.val() || {};
          refreshCryptoCoinsFromSettings();
          applyDepositSettingsToUI();
        });
      }
  
      onValue(ref(db, `users/${currentUid}`), (snap) => {
        userData = normalizeUserData(currentUid, snap.val() || {});
        $("authGate").classList.add("hidden");
  
        if (userData.suspended) {
          $("appShell").classList.add("hidden");
          $("suspendedGate").classList.remove("hidden");
          return;
        }
        $("suspendedGate").classList.add("hidden");
        $("appShell").classList.remove("hidden");

        paintOverviewFromUserData();
        fillProfileForm();
        const settings = userData.settings || {};
        applyTheme(settings.theme || "light");
        applyFont(settings.font || "Inter");
        $("languageSelect").value = settings.language || "en";
        applyLanguage(settings.language || "en");
      });
  
      const txQuery = query(ref(db, "transactions"), orderByChild("uid"), equalTo(currentUid));
      onValue(txQuery, (snap) => {
        const val = snap.val() || {};
        allTx = Object.entries(val).map(([id, tx]) => ({ id, ...tx })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        refreshAllLists();
      }, (error) => {
        console.error("Could not load transaction history:", error);
        showToast("Could not load transaction history. Check your database rules.", "rose");
      });
    });
  
    $("logoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      navigate("/login");
    });
    $("suspendedLogoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      navigate("/login");
    });
    return unbindContact;
}
