/* ============================================================
   THEME MANAGER — Dark / Light / System
   Runs before body paints — no flash of wrong theme.
   ============================================================ */
(function () {
  document.documentElement.classList.add('preload');
  window.addEventListener('load', () => {
    setTimeout(() => document.documentElement.classList.remove('preload'), 50);
  });

  const KEY = 'cp-theme';

  function getEffective(mode) {
    if (mode === 'dark') return 'dark';
    if (mode === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function updateButtons(mode) {
    document.querySelectorAll('[data-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  function applyTheme(mode) {
    const effective = getEffective(mode);
    document.documentElement.setAttribute('data-theme', effective);

    const run = () => updateButtons(mode);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  function setTheme(mode) {
    localStorage.setItem(KEY, mode);
    applyTheme(mode);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if ((localStorage.getItem(KEY) || 'system') === 'system') applyTheme('system');
  });

  applyTheme(localStorage.getItem(KEY) || 'system');
  window.ThemeManager = { setTheme, applyTheme };
})();
