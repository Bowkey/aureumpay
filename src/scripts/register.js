import { app, isFirebaseConfigured } from "../firebase.js";
import {
    getAuth,
    createUserWithEmailAndPassword
  } from "firebase/auth";
import {
    getDatabase,
    ref,
    set,
    get
  } from "firebase/database";

export function mountPage() {
  // ---- Replace with your own Firebase project config ----

    const auth = isFirebaseConfigured ? getAuth(app) : null;
    const db = isFirebaseConfigured ? getDatabase(app) : null;
  
    // ---------- countries ----------
    const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Lucia","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
  
    function populateCountries(selectEl){
      COUNTRIES.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        selectEl.appendChild(opt);
      });
    }
    populateCountries(document.getElementById('countryResidence'));
    populateCountries(document.getElementById('countryAddress'));
  
    // ---------- helpers ----------
    const $ = (id) => document.getElementById(id);
  
    function showToast(message, isError = false){
      const t = $('toast');
      t.textContent = message;
      t.classList.toggle('toast-error', isError);
      t.classList.add('show');
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(() => t.classList.remove('show'), 4200);
    }
  
    function setFieldError(inputId, message){
      const input = $(inputId);
      const msg = $(inputId + 'Msg');
      if(message){
        input.classList.add('field-error');
        if(msg){ msg.textContent = message; msg.classList.remove('hidden'); }
      } else {
        input.classList.remove('field-error');
        if(msg){ msg.classList.add('hidden'); }
      }
    }
  
    function isValidEmail(value){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
  
    function calcAge(dobStr){
      const dob = new Date(dobStr);
      if(isNaN(dob.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if(m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      return age;
    }
  
    // ---------- stepper state ----------
    let currentStep = 1;
    const totalSteps = 4;
    const stepLabels = { 1:'Personal', 2:'Address', 3:'Security', 4:'Review' };
  
    function renderStepper(){
      document.querySelectorAll('.step-item').forEach(item => {
        const n = parseInt(item.dataset.step, 10);
        item.classList.remove('active','done');
        if(n < currentStep) item.classList.add('done');
        else if(n === currentStep) item.classList.add('active');
      });
      document.querySelectorAll('.step-line').forEach(line => {
        const n = parseInt(line.dataset.line, 10);
        line.classList.toggle('done', n < currentStep);
      });
      $('mobileStepLabel').textContent = `Step ${currentStep} of ${totalSteps} — ${stepLabels[currentStep]}`;
      $('mobileProgressBar').style.width = `${(currentStep / totalSteps) * 100}%`;
    }
  
    function goToStep(n){
      for(let i = 1; i <= totalSteps; i++){
        $(`panel${i}`).classList.toggle('hidden', i !== n);
      }
      currentStep = n;
      renderStepper();
      if(n === 4) populateReview();
      window.scrollTo({ top: document.querySelector('main').offsetTop - 20, behavior: 'smooth' });
    }
  
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => goToStep(parseInt(btn.dataset.goto, 10)));
    });
  
    // ---------- step validation ----------
    function validateStep1(){
      let valid = true;
      if(!$('firstName').value.trim()){ setFieldError('firstName', 'Enter your first name.'); valid = false; } else setFieldError('firstName', '');
      if(!$('lastName').value.trim()){ setFieldError('lastName', 'Enter your last name.'); valid = false; } else setFieldError('lastName', '');
      if(!isValidEmail($('email').value.trim())){ setFieldError('email', 'Enter a valid email address.'); valid = false; } else setFieldError('email', '');
      if($('phone').value.replace(/\D/g,'').length < 7){ setFieldError('phone', 'Enter a valid phone number.'); valid = false; } else setFieldError('phone', '');
      const age = calcAge($('dob').value);
      if(age === null){ setFieldError('dob', 'Enter your date of birth.'); valid = false; }
      else if(age < 18){ setFieldError('dob', 'You must be 18 or older to open an account.'); valid = false; }
      else setFieldError('dob', '');
      if(!$('countryResidence').value){ setFieldError('countryResidence', 'Select your country.'); valid = false; } else setFieldError('countryResidence', '');
      return valid;
    }
  
    function validateStep2(){
      let valid = true;
      if(!$('address1').value.trim()){ setFieldError('address1', 'Enter your street address.'); valid = false; } else setFieldError('address1', '');
      if(!$('city').value.trim()){ setFieldError('city', 'Enter your city.'); valid = false; } else setFieldError('city', '');
      if(!$('state').value.trim()){ setFieldError('state', 'Enter your state or province.'); valid = false; } else setFieldError('state', '');
      if(!$('postalCode').value.trim()){ setFieldError('postalCode', 'Enter your postal code.'); valid = false; } else setFieldError('postalCode', '');
      if(!$('countryAddress').value){ setFieldError('countryAddress', 'Select a country.'); valid = false; } else setFieldError('countryAddress', '');
      return valid;
    }
  
    function validateStep3(){
      let valid = true;
      const pw = $('password').value;
      const cpw = $('confirmPassword').value;
      if(pw.length < 8){ setFieldError('password', 'Use at least 8 characters.'); valid = false; } else setFieldError('password', '');
      if(cpw !== pw || !cpw){ setFieldError('confirmPassword', 'Passwords do not match.'); valid = false; } else setFieldError('confirmPassword', '');
      if(!$('agreeTerms').checked){
        $('agreeTerms').classList.add('field-error');
        $('agreeTermsMsg').textContent = 'You need to accept the terms to continue.';
        $('agreeTermsMsg').classList.remove('hidden');
        valid = false;
      } else {
        $('agreeTerms').classList.remove('field-error');
        $('agreeTermsMsg').classList.add('hidden');
      }
      return valid;
    }
  
    const validators = { 1: validateStep1, 2: validateStep2, 3: validateStep3 };
  
    document.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        const fn = validators[currentStep];
        if(fn && !fn()) return;
        goToStep(currentStep + 1);
      });
    });
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => goToStep(currentStep - 1));
    });
  
    // ---------- account type selection ----------
    document.querySelectorAll('.acct-type-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.acct-type-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        card.querySelector('input[type=radio]').checked = true;
      });
    });
  
    // ---------- password visibility ----------
    function wireToggle(btnId, inputId, iconId){
      const btn = $(btnId), input = $(inputId), icon = $(iconId);
      btn.addEventListener('click', () => {
        const isPw = input.type === 'password';
        input.type = isPw ? 'text' : 'password';
        icon.innerHTML = isPw
          ? '<path d="M2 2l16 16M9.3 5.1A8.7 8.7 0 0 1 10 5c5.5 0 8.5 6 8.5 6a15 15 0 0 1-3.2 4M6.6 6.6A15 15 0 0 0 1.5 10s3 6 8.5 6c1.2 0 2.3-.2 3.3-.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
          : '<path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.4"/>';
      });
    }
    wireToggle('togglePassword', 'password', 'eyeIcon1');
    wireToggle('toggleConfirmPassword', 'confirmPassword', 'eyeIcon2');
  
    // ---------- password strength ----------
    $('password').addEventListener('input', () => {
      const val = $('password').value;
      let score = 0;
      if(val.length >= 8) score++;
      if(/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
      if(/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
      const bars = document.querySelectorAll('#strengthBars .strength-seg');
      const colors = ['var(--error)', '#C98A2C', 'var(--leaf-bright)'];
      bars.forEach((bar, i) => { bar.style.background = i < score ? colors[Math.min(score,3)-1] : 'var(--line)'; });
    });
  
    // ---------- review ----------
    function populateReview(){
      $('reviewName').textContent = `${$('firstName').value.trim()} ${$('lastName').value.trim()}`;
      $('reviewEmail').textContent = $('email').value.trim();
      $('reviewPhone').textContent = $('phone').value.trim();
      $('reviewDob').textContent = $('dob').value;
      const line2 = $('address2').value.trim();
      $('reviewAddress').textContent = [
        $('address1').value.trim(),
        line2,
        `${$('city').value.trim()}, ${$('state').value.trim()} ${$('postalCode').value.trim()}`,
        $('countryAddress').value
      ].filter(Boolean).join(', ');
      const selected = document.querySelector('.acct-type-card.selected');
      $('reviewAccountType').textContent = selected ? selected.dataset.value : '—';
    }
  
    // ---------- account number generation ----------
    function randomAccountNumber(){
      let num = '';
      for(let i = 0; i < 10; i++) num += Math.floor(Math.random() * 10);
      if(num[0] === '0') num = '1' + num.slice(1);
      return num;
    }
    function formatAccountNumber(num){
      return num.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  
    async function generateUniqueAccountNumber(){
      for(let attempt = 0; attempt < 8; attempt++){
        const candidate = randomAccountNumber();
        const snap = await get(ref(db, `accountNumbers/${candidate}`));
        if(!snap.exists()) return candidate;
      }
      // extremely unlikely fallback: timestamp-derived
      return String(Date.now()).slice(-10);
    }
  
    // ---------- withdrawal PIN generation ----------
    // Four separate 4-digit PINs, entered one after another (in order) only when the
    // user withdraws money. They're generated automatically at signup so the user
    // never has to invent or remember them themselves — admin can view and reissue
    // them from the admin dashboard, and shares them with the user out of band.
    function randomFourDigitPin(){
      return String(Math.floor(1000 + Math.random() * 9000));
    }
    function generateWithdrawalPins(){
      return {
        pin1: randomFourDigitPin(),
        pin2: randomFourDigitPin(),
        pin3: randomFourDigitPin(),
        pin4: randomFourDigitPin(),
      };
    }
  
    // ---------- final submit ----------
    $('submitBtn').addEventListener('click', async () => {
      if(!validateStep1() ) { goToStep(1); return; }
      if(!validateStep2()) { goToStep(2); return; }
      if(!validateStep3()) { goToStep(3); return; }

      if(!auth || !db){
        const message = 'Firebase is not configured. Add your Firebase project settings to src/firebase.js.';
        $('submitErrorMsg').textContent = message;
        $('submitErrorMsg').classList.remove('hidden');
        showToast(message, true);
        return;
      }

      const btn = $('submitBtn');
      const label = $('submitBtnLabel');
      btn.disabled = true;
      label.innerHTML = '<span class="spinner"></span><span>Creating your account…</span>';
      $('submitErrorMsg').classList.add('hidden');
  
      const email = $('email').value.trim();
      const password = $('password').value;
  
      try{
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = cred.user.uid;
  
        const accountNumber = await generateUniqueAccountNumber();
        const selectedCard = document.querySelector('.acct-type-card.selected');
  
        const profile = {
          firstName: $('firstName').value.trim(),
          lastName: $('lastName').value.trim(),
          email,
          role: 'customer',
          phone: $('phone').value.trim(),
          dob: $('dob').value,
          countryResidence: $('countryResidence').value,
          address: {
            line1: $('address1').value.trim(),
            line2: $('address2').value.trim(),
            city: $('city').value.trim(),
            state: $('state').value.trim(),
            postalCode: $('postalCode').value.trim(),
            country: $('countryAddress').value
          },
          accountType: selectedCard ? selectedCard.dataset.value : 'checking',
          accountNumber,
          // New accounts start inactive — an admin must review and approve the
          // account before deposits, transfers, or withdrawals can be made.
          active: false,
          // Auto-generated, sequential withdrawal PINs. Only used (and only ever
          // needed) during a withdrawal; transfers keep using the PIN the user
          // sets themselves inside the dashboard.
          withdrawalPins: generateWithdrawalPins(),
          createdAt: new Date().toISOString()
        };
  
        await set(ref(db, `users/${uid}`), profile);
        await set(ref(db, `accountNumbers/${accountNumber}`), uid);
  
        $('successFirstName').textContent = profile.firstName || 'there';
        $('successAccountNumber').textContent = formatAccountNumber(accountNumber);
        $('successOverlay').classList.add('show');
  
      } catch(err){
        const code = err && err.code ? err.code : '';
        let message = 'Something went wrong creating your account. Please try again.';
        if(code === 'auth/email-already-in-use') message = 'An account already exists with this email.';
        else if(code === 'auth/invalid-email') message = 'That email address doesn\u2019t look right.';
        else if(code === 'auth/weak-password') message = 'Choose a stronger password (at least 8 characters).';
        else if(code === 'auth/network-request-failed') message = 'Network error. Check your connection and try again.';
  
        $('submitErrorMsg').textContent = message;
        $('submitErrorMsg').classList.remove('hidden');
        showToast(message, true);
      } finally {
        btn.disabled = false;
        label.textContent = 'Create account';
      }
    });
  
    // ---------- copy account number ----------
    $('copyAccountNumber').addEventListener('click', async () => {
      const num = $('successAccountNumber').textContent.replace(/\s/g, '');
      try{
        await navigator.clipboard.writeText(num);
        showToast('Account number copied.');
      } catch(_e){
        showToast('Could not copy — please copy it manually.', true);
      }
    });
  
    renderStepper();
}
