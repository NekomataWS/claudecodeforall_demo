/* ============================================================
   Mind Cafe — Navbar member link (Sign In / Account)
   Reads the Supabase session from localStorage; no library needed.
   ============================================================ */

(function () {
  const list = document.querySelector('.navbar__links');
  const cfg  = window.MINDCAFE_SUPABASE;
  if (!list || !cfg) return;

  let signedIn = false;
  try {
    const ref = new URL(cfg.url).hostname.split('.')[0];
    const raw = localStorage.getItem('sb-' + ref + '-auth-token');
    signedIn  = !!(raw && JSON.parse(raw).access_token);
  } catch (_) { /* storage blocked or malformed — treat as signed out */ }

  const li = document.createElement('li');
  const a  = document.createElement('a');
  a.className   = 'navbar__link';
  a.href        = signedIn ? 'account.html' : 'login.html';
  a.textContent = signedIn ? 'Account' : 'Sign In';
  if (location.pathname.split('/').pop() === a.getAttribute('href')) {
    a.classList.add('navbar__link--active');
  }
  li.appendChild(a);

  const cta = list.querySelector('.navbar__cta');
  list.insertBefore(li, cta || null);
})();
