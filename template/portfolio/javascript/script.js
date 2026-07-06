/* ============================================================
   CHETAN PRAJAPAT — MAIN SCRIPT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile drawer ---------- */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      drawer.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
    }));
  }

  /* ---------- Scroll spy for in-page quick jump ---------- */
  const jumpIds = ['about', 'skills', 'projects', 'achievements'];
  const sections = Array.from(document.querySelectorAll('main [id]')).filter((s) => jumpIds.includes(s.id));
  const navLinks = document.querySelectorAll('.side-jump a');
  if (sections.length && navLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Scroll reveal ---------- */
  const rvObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.rv').forEach((el) => rvObserver.observe(el));

  /* ---------- Back to top ---------- */
  const topBtn = document.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      topBtn.classList.toggle('show', window.scrollY > 500);
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Achievement modal ---------- */
  window.openModal = function (src) {
    const modal = document.getElementById('certModal');
    const img = document.getElementById('modalImg');
    if (!modal || !img) return;
    img.src = src;
    modal.style.display = 'flex';
  };
  window.closeModal = function () {
    const modal = document.getElementById('certModal');
    if (modal) modal.style.display = 'none';
  };
  const certModal = document.getElementById('certModal');
  if (certModal) {
    certModal.addEventListener('click', (e) => { if (e.target === certModal) window.closeModal(); });
  }

  /* ---------- Visit counter (Google Sheets) ---------- */
  (function () {
    const url = 'https://script.google.com/macros/s/AKfycby0cm2hNwFnaxwGEcOsrk3KJefwNUDcrcDhSUHndZ01xNFDa1Dkv0EMVjdPRWGKH3z5/exec';
    fetch(url + '?action=track&page=' + encodeURIComponent(location.pathname) +
      '&ref=' + encodeURIComponent(document.referrer) +
      '&ua=' + encodeURIComponent(navigator.userAgent) +
      '&screen=' + encodeURIComponent(screen.width + 'x' + screen.height),
      { mode: 'no-cors' });

    fetch(url + '?action=stats').then((r) => r.json()).then((data) => {
      if (data && typeof data.total !== 'undefined') {
        const countEl = document.getElementById('visitCount');
        const wrap = document.getElementById('visitWrap');
        if (countEl && wrap) {
          animateValue(countEl, 0, data.total, 1200);
          wrap.style.display = 'inline-flex';
        }
      }
    }).catch(() => {});

    function animateValue(el, start, end, duration) {
      let startTs = null;
      function step(ts) {
        if (!startTs) startTs = ts;
        const progress = Math.min((ts - startTs) / duration, 1);
        el.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  })();

  /* ---------- Live status ledger clock (Asia/Kolkata) ---------- */
  const clockEl = document.getElementById('istClock');
  if (clockEl) {
    function tick() {
      const now = new Date();
      const opts = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
      clockEl.textContent = now.toLocaleTimeString('en-IN', opts) + ' IST';
    }
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Typed role rotator ---------- */
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    const roles = ['Full Stack Web Developer', 'Freelancer', 'Software Developer', 'Video Editor'];
    let ri = 0, ci = 0, deleting = false;
    function loop() {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        typedEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(loop, 1400); return; }
      } else {
        ci--;
        typedEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(loop, deleting ? 35 : 55);
    }
    loop();
  }
});
