import { app, isFirebaseConfigured } from "../firebase.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
  } from "firebase/auth";
import { getDatabase, get, ref } from "firebase/database";

export function mountPage(navigate) {
  // ---- Replace with your own Firebase project config ----

    const auth = isFirebaseConfigured ? getAuth(app) : null;
  
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
  
    function friendlyAuthError(err){
      const code = err && err.code ? err.code : '';
      switch(code){
        case 'auth/invalid-email': return 'That email address doesn\u2019t look right.';
        case 'auth/user-disabled': return 'This account has been disabled. Contact support.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': return 'Incorrect email or password.';
        case 'auth/too-many-requests': return 'Too many attempts. Wait a moment and try again.';
        case 'auth/network-request-failed': return 'Network error. Check your connection and try again.';
        default: return 'Something went wrong. Please try again.';
      }
    }
  
    function setLoading(btn, labelEl, isLoading, loadingText, restText){
      btn.disabled = isLoading;
      labelEl.innerHTML = isLoading
        ? `<span class="spinner"></span><span>${loadingText}</span>`
        : restText;
    }
  
    // ---------- panel switching ----------
    const loginPanel = $('loginPanel');
    const resetPanel = $('resetPanel');
    const sentPanel = $('sentPanel');
  
    function showPanel(panel){
      [loginPanel, resetPanel, sentPanel].forEach(p => {
        if(p === panel){
          p.classList.remove('panel-hidden');
        } else {
          p.classList.add('panel-hidden');
        }
      });
    }
  
    $('forgotLink').addEventListener('click', () => {
      $('resetEmail').value = $('loginEmail').value || '';
      showPanel(resetPanel);
    });
    $('backToLogin').addEventListener('click', () => showPanel(loginPanel));
    $('backToLoginFromSent').addEventListener('click', () => showPanel(loginPanel));
  
    // ---------- password visibility ----------
    const pwInput = $('loginPassword');
    const eyeIcon = $('eyeIcon');
    $('togglePassword').addEventListener('click', () => {
      const isPw = pwInput.type === 'password';
      pwInput.type = isPw ? 'text' : 'password';
      eyeIcon.innerHTML = isPw
        ? '<path d="M2 2l16 16M9.3 5.1A8.7 8.7 0 0 1 10 5c5.5 0 8.5 6 8.5 6a15 15 0 0 1-3.2 4M6.6 6.6A15 15 0 0 0 1.5 10s3 6 8.5 6c1.2 0 2.3-.2 3.3-.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>'
        : '<path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.4"/>';
    });
  
    // ---------- log in ----------
    $('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('loginEmail').value.trim();
      const password = $('loginPassword').value;
      let valid = true;
  
      if(!isValidEmail(email)){
        setFieldError('loginEmail', 'Enter a valid email address.');
        valid = false;
      } else {
        setFieldError('loginEmail', '');
      }
  
      if(!password){
        setFieldError('loginPassword', 'Enter your password.');
        valid = false;
      } else {
        setFieldError('loginPassword', '');
      }
  
      if(!valid) return;
      if(!auth){
        showToast('Firebase is not configured. Add your Firebase project settings to src/firebase.js.', true);
        return;
      }
  
      const btn = $('loginBtn');
      const label = $('loginBtnLabel');
      setLoading(btn, label, true, 'Logging in…', 'Log in');
  
      try{
        await setPersistence(auth, $('rememberMe').checked ? browserLocalPersistence : browserSessionPersistence);
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const token = await credential.user.getIdTokenResult(true);
        let isAdmin = token.claims.admin === true;

        if(!isAdmin){
          const adminRecord = await get(ref(getDatabase(app), `admins/${credential.user.uid}`));
          const record = adminRecord.val();
          isAdmin = !!record && record.enabled !== false;
        }

        showToast('Welcome back — redirecting…');
        navigate(isAdmin ? '/admin' : '/dashboard');
      } catch(err){
        console.error('Unable to complete sign-in or verify admin access:', err);
        showToast(friendlyAuthError(err), true);
      } finally {
        setLoading(btn, label, false, '', 'Log in');
      }
    });
  
    // ---------- forgot password ----------
    let lastResetEmail = '';
  
    async function sendReset(email){
      if(!auth){
        showToast('Firebase is not configured. Add your Firebase project settings to src/firebase.js.', true);
        return;
      }
      const btn = $('resetBtn');
      const label = $('resetBtnLabel');
      setLoading(btn, label, true, 'Sending…', 'Send reset link');
      try{
        await sendPasswordResetEmail(auth, email);
        lastResetEmail = email;
        $('sentEmailDisplay').textContent = email;
        showPanel(sentPanel);
      } catch(err){
        showToast(friendlyAuthError(err), true);
      } finally {
        setLoading(btn, label, false, '', 'Send reset link');
      }
    }
  
    $('resetForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('resetEmail').value.trim();
      if(!isValidEmail(email)){
        setFieldError('resetEmail', 'Enter a valid email address.');
        return;
      }
      setFieldError('resetEmail', '');
      await sendReset(email);
    });
  
    $('resendLink').addEventListener('click', () => {
      if(lastResetEmail) sendReset(lastResetEmail);
    });
}
