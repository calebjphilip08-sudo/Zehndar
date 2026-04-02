// theme.js — small, dependency-free theme toggle and nav utilities
(() => {
  const STORAGE_KEY = 'alvora-theme';
  const DOC = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const metaThemeColor = document.getElementById('meta-theme-color');
  const darkMeta = '#071025';
  const lightMeta = '#ffffff';

  function applyTheme(theme) {
    if (theme === 'dark') {
      DOC.setAttribute('data-theme', 'dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', darkMeta);
      if (toggle) {
        toggle.setAttribute('aria-pressed', 'true');
        toggle.title = 'Switch to light mode';
      }
    } else if (theme === 'light') {
      DOC.setAttribute('data-theme', 'light');
      if (metaThemeColor) metaThemeColor.setAttribute('content', lightMeta);
      if (toggle) {
        toggle.setAttribute('aria-pressed', 'false');
        toggle.title = 'Switch to dark mode';
      }
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      if (theme === null) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // ignore storage failures
    }
  }

  function updateActiveNav() {
    const fileName = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    document.querySelectorAll('.nav-links a, .dropdown-content a').forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href === fileName) {
        link.classList.add('active');
      }
    });
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
      dropdown.classList.remove('open');
      const toggleButton = dropdown.querySelector('.dropdown-toggle');
      if (toggleButton) toggleButton.setAttribute('aria-expanded', 'false');
    });
  }

  function initDropdownAccessibility() {
    document.querySelectorAll('.dropdown-toggle').forEach(button => {
      button.setAttribute('role', 'button');
      button.setAttribute('aria-haspopup', 'true');
      if (!button.hasAttribute('aria-expanded')) {
        button.setAttribute('aria-expanded', 'false');
      }
      button.addEventListener('click', () => {
        const dropdown = button.closest('.dropdown');
        if (!dropdown) return;
        const expanded = button.getAttribute('aria-expanded') === 'true';
        closeAllDropdowns();
        button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        dropdown.classList.toggle('open', !expanded);
      });
    });

    document.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', () => {
        closeAllDropdowns();
      });
    });

    document.addEventListener('click', event => {
      if (!event.target.closest('.dropdown')) {
        closeAllDropdowns();
      }
    });
  }

  const stored = getStoredTheme();
  const initialTheme = stored === 'dark' || stored === 'light' ? stored : 'dark';
  applyTheme(initialTheme);
  if (!stored) setStoredTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = getStoredTheme() || (toggle.getAttribute('aria-pressed') === 'true' ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      setStoredTheme(next);
      applyTheme(next);
    });
  }

  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  if (mq && typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', () => {
      if (!getStoredTheme()) applyTheme('dark');
    });
  } else if (mq && mq.addListener) {
    mq.addListener(() => {
      if (!getStoredTheme()) applyTheme('dark');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateActiveNav();
    initDropdownAccessibility();
  });

  window.siteTheme = {
    get: getStoredTheme,
    set: (t) => {
      if (t === 'dark' || t === 'light' || t === null) {
        setStoredTheme(t);
        applyTheme(t === null ? 'dark' : t);
      }
    },
    reset: () => {
      setStoredTheme(null);
      applyTheme('dark');
    }
  };
})();
