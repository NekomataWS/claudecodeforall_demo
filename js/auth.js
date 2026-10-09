/* ============================================================
   Mind Cafe — Member registration, sign in, account
   Uses supabase-js (CDN) against the "Mind Cafe" Supabase project.
   ============================================================ */

(function () {
  const cfg = window.MINDCAFE_SUPABASE;
  if (!cfg || !window.supabase) return;

  const db = window.supabase.createClient(cfg.url, cfg.key);

  /* ---- Shared helpers ---- */
  function setFieldState(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + '-error');
    const group = input && input.closest('.field-group');
    if (!group) return;
    group.classList.toggle('field-group--error', !!msg);
    group.classList.toggle('field-group--success', !msg);
    if (errEl) errEl.textContent = msg ? '⚠ ' + msg : '';
  }

  function validateAll(validators) {
    let first = null;
    Object.keys(validators).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      const err = validators[id](input.value);
      setFieldState(id, err);
      if (err && !first) first = input;
    });
    if (first) first.focus();
    return !first;
  }

  function showFormMessage(text, isError) {
    const el = document.getElementById('form-message');
    if (!el) return;
    el.textContent = text;
    el.className = 'form-message ' + (isError ? 'form-message--error' : 'form-message--ok');
    el.hidden = !text;
  }

  function setBusy(form, busy) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = busy; btn.classList.toggle('is-busy', busy); }
  }

  const rules = {
    full_name: v => v.trim().length >= 2 ? null : 'Please enter your full name (at least 2 characters).',
    email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email address.',
    phone:     v => v.replace(/\D/g, '').length >= 7 ? null : 'Please enter a valid phone number.',
    password:  v => v.length >= 8 ? null : 'Password must be at least 8 characters.'
  };

  /* ---- Register ---- */
  const regForm = document.getElementById('register-form');
  if (regForm) {
    const validators = {
      ...rules,
      password_confirm: v => v === document.getElementById('password').value ? null : 'Passwords do not match.'
    };

    regForm.addEventListener('submit', async e => {
      e.preventDefault();
      showFormMessage('');
      if (!validateAll(validators)) return;

      setBusy(regForm, true);
      const { data, error } = await db.auth.signUp({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        options: {
          emailRedirectTo: location.origin + '/login.html',
          data: {
            full_name: document.getElementById('full_name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            marketing_opt_in: document.getElementById('marketing_opt_in').checked
          }
        }
      });
      setBusy(regForm, false);

      if (error) { showFormMessage(error.message, true); return; }

      // Supabase returns an empty identities list for an already-registered email.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        showFormMessage('This email is already registered. Please sign in instead.', true);
        return;
      }

      if (data.session) { location.href = 'account.html'; return; }

      regForm.classList.add('hidden');
      document.getElementById('success-email').textContent = data.user.email;
      document.getElementById('register-success').classList.remove('hidden');
    });
  }

  /* ---- Sign in ---- */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const validators = { email: rules.email, password: v => v ? null : 'Please enter your password.' };

    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      showFormMessage('');
      if (!validateAll(validators)) return;

      setBusy(loginForm, true);
      const { error } = await db.auth.signInWithPassword({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      });
      setBusy(loginForm, false);

      if (error) {
        showFormMessage(error.message === 'Email not confirmed'
          ? 'Please confirm your email first — check your inbox for the link.'
          : 'Incorrect email or password.', true);
        return;
      }
      location.href = 'account.html';
    });
  }

  /* ---- Account ---- */
  const account = document.getElementById('account-view');
  if (account) {
    (async () => {
      const { data: { session } } = await db.auth.getSession();
      if (!session) { location.replace('login.html'); return; }

      const { data: p, error } = await db.from('profiles').select('*').eq('id', session.user.id).single();
      if (error || !p) { showFormMessage('Could not load your profile.', true); return; }

      document.getElementById('acc-name').textContent  = p.full_name;
      document.getElementById('acc-email').textContent = session.user.email;
      document.getElementById('acc-since').textContent =
        new Date(p.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      document.getElementById('full_name').value = p.full_name;
      document.getElementById('phone').value = p.phone;
      document.getElementById('marketing_opt_in').checked = p.marketing_opt_in;
      account.hidden = false;
    })();

    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', async e => {
      e.preventDefault();
      showFormMessage('');
      if (!validateAll({ full_name: rules.full_name, phone: rules.phone })) return;

      setBusy(profileForm, true);
      const { data: { user } } = await db.auth.getUser();
      const { error } = await db.from('profiles').update({
        full_name: document.getElementById('full_name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        marketing_opt_in: document.getElementById('marketing_opt_in').checked
      }).eq('id', user.id);
      setBusy(profileForm, false);

      if (error) { showFormMessage(error.message, true); return; }
      document.getElementById('acc-name').textContent = document.getElementById('full_name').value.trim();
      showFormMessage('Profile updated.', false);
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
      await db.auth.signOut();
      location.href = 'index.html';
    });
  }
})();
