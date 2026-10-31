import { bindContactDetails } from "../utils/contact.js";

export function mountPage() {
  const unbindContact = bindContactDetails({
    emailLinkId: "siteContactEmail",
    telegramLinkId: "siteContactTelegram",
  });

  // Blocking, runs before first paint so there's no flash of the wrong theme.
    (function(){
      try{
        var saved = localStorage.getItem('linden-theme');
        var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if(theme === 'dark') document.documentElement.classList.add('dark');
      }catch(e){}
    })();
  
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    // ---------- theme toggle ----------
    function currentTheme(){ return document.documentElement.classList.contains('dark') ? 'dark' : 'light'; }
    function syncThemeIcons(theme){
      const sun = document.getElementById('iconSun');
      const moon = document.getElementById('iconMoon');
      if(!sun || !moon) return;
      sun.style.display = theme === 'dark' ? 'none' : 'block';
      moon.style.display = theme === 'dark' ? 'block' : 'none';
    }
    syncThemeIcons(currentTheme()); // reflect whatever the pre-paint script already decided
    const themeToggleBtn = document.getElementById('themeToggle');
    if(themeToggleBtn){
      themeToggleBtn.addEventListener('click', () => {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', next === 'dark');
        try{ localStorage.setItem('linden-theme', next); }catch(e){}
        syncThemeIcons(next);
      });
    }
  
    // preloader — hold briefly so the mark is actually seen, then release the page
    const preloader = document.getElementById('preloader');
    const releasePage = () => {
      document.body.classList.remove('loading');
      if(preloader){ preloader.classList.add('done'); }
    };
    window.addEventListener('load', () => { setTimeout(releasePage, 900); });
    // safety net in case 'load' is delayed by slow assets
    setTimeout(releasePage, 3200);
  
    // scroll reveal — individual elements, fade in once
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in');
          const bar = e.target.querySelector('.bar-fill');
          if(bar){ bar.style.width = bar.dataset.bar + '%'; }
          e.target.querySelectorAll('.countup').forEach(animateCount);
          if(e.target.classList.contains('countup')) animateCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, {threshold:.15});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  
    // whole-section appear / disappear — repeats every time a section crosses the viewport
    const sectionIo = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        e.target.classList.toggle('in', e.isIntersecting);
      });
    }, {threshold:.2, rootMargin:'-8% 0px -8% 0px'});
    document.querySelectorAll('.section-fade').forEach(el=>sectionIo.observe(el));
  
    // mobile menu
    const burgerBtn = document.getElementById('burgerBtn');
    const mobilePanel = document.getElementById('mobilePanel');
    if(burgerBtn){
      burgerBtn.addEventListener('click', ()=>{
        const open = mobilePanel.classList.toggle('open');
        burgerBtn.classList.toggle('open', open);
        burgerBtn.setAttribute('aria-expanded', open);
      });
      mobilePanel.querySelectorAll('a').forEach(a=>{
        a.addEventListener('click', ()=>{
          mobilePanel.classList.remove('open');
          burgerBtn.classList.remove('open');
          burgerBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  
    // count-up numbers
    function animateCount(el){
      if(el.dataset.animated === '1') return;
      el.dataset.animated = '1';
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const commas = el.dataset.commas === '1';
      if(reduceMotion || isNaN(target)){ el.textContent = target.toFixed(decimals); return; }
      const duration = 1500;
      const start = performance.now();
      function tick(now){
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = target * eased;
        el.textContent = commas
          ? val.toLocaleString('en-US', {minimumFractionDigits:decimals, maximumFractionDigits:decimals})
          : val.toFixed(decimals);
        if(t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('load', ()=>{
      setTimeout(()=>{
        document.querySelectorAll('.countup').forEach(animateCount);
      }, 550);
    });
  
    // ledger card tilt (pointer devices only)
    const ledgerCard = document.getElementById('ledgerCard');
    if(ledgerCard && window.matchMedia('(pointer: fine)').matches && !reduceMotion){
      ledgerCard.addEventListener('mousemove', (e)=>{
        const r = ledgerCard.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ledgerCard.style.transform = `perspective(1000px) rotateX(${(-py*6).toFixed(2)}deg) rotateY(${(px*8).toFixed(2)}deg) translateY(-4px)`;
      });
      ledgerCard.addEventListener('mouseleave', ()=>{
        ledgerCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    }
  
    // card visual tilt (pointer devices only)
    const cardVisual = document.getElementById('cardVisual');
    if(cardVisual && window.matchMedia('(pointer: fine)').matches && !reduceMotion){
      cardVisual.addEventListener('mousemove', (e)=>{
        const r = cardVisual.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cardVisual.style.transform = `perspective(900px) rotateX(${(-py*8).toFixed(2)}deg) rotateY(${(px*10).toFixed(2)}deg)`;
      });
      cardVisual.addEventListener('mouseleave', ()=>{
        cardVisual.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    }
  
    // subtle watermark parallax
    const watermark = document.getElementById('watermark');
    if(watermark && !reduceMotion){
      let ticking = false;
      window.addEventListener('scroll', ()=>{
        if(!ticking){
          requestAnimationFrame(()=>{
            const y = Math.min(window.scrollY * 0.06, 40);
            watermark.style.transform = `translate(-50%, ${y}px)`;
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  return unbindContact;
}
