/* ============================================================
   Mind Cafe — Reservation Form Validation
   ============================================================ */

function initReservation() {
  const form       = document.getElementById('reservation-form');
  const successDiv = document.getElementById('reservation-success');

  if (!form) return;

  /* ---- Validation Rules ---- */
  const validators = {
    name:   v => v.trim().length >= 2   ? null : 'Please enter your full name (at least 2 characters).',
    email:  v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : 'Please enter a valid email address.',
    phone:  v => v.replace(/\D/g, '').length >= 7 ? null : 'Please enter a valid phone number.',
    date:   v => {
      if (!v) return 'Please select a date.';
      const selected = new Date(v);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today ? null : 'Please select a date today or in the future.';
    },
    time:   v => {
      if (!v) return 'Please select a time.';
      return v >= '08:00' && v <= '21:30' ? null : 'Please select a time between 08:00 and 21:30.';
    },
    guests: v => v ? null : 'Please select the number of guests.'
  };

  /* ---- Show/clear field error ---- */
  function setFieldState(fieldId, errorMsg) {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + '-error');
    const group = input ? input.closest('.field-group') : null;

    if (!input || !group) return;

    if (errorMsg) {
      group.classList.add('field-group--error');
      group.classList.remove('field-group--success');
      if (errEl) errEl.textContent = '⚠ ' + errorMsg;
    } else {
      group.classList.remove('field-group--error');
      group.classList.add('field-group--success');
      if (errEl) errEl.textContent = '';
    }
  }

  /* ---- Live validation on input/change ---- */
  Object.keys(validators).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!input) return;

    const eventType = ['select', 'guests'].includes(fieldId) ? 'change' : 'input';

    input.addEventListener(eventType, () => {
      const error = validators[fieldId](input.value);
      setFieldState(fieldId, error);
    });

    // Also validate date/time on change
    if (fieldId === 'date' || fieldId === 'time') {
      input.addEventListener('change', () => {
        const error = validators[fieldId](input.value);
        setFieldState(fieldId, error);
      });
    }
  });

  /* ---- Form submit ---- */
  form.addEventListener('submit', e => {
    e.preventDefault();

    let firstInvalid = null;
    let allValid = true;

    Object.keys(validators).forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (!input) return;

      const error = validators[fieldId](input.value);
      setFieldState(fieldId, error);

      if (error) {
        allValid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!allValid) {
      firstInvalid.focus();
      return;
    }

    /* ---- Show success ---- */
    const nameVal    = document.getElementById('name').value.trim();
    const emailVal   = document.getElementById('email').value.trim();
    const dateVal    = document.getElementById('date').value;
    const timeVal    = document.getElementById('time').value;
    const guestsVal  = document.getElementById('guests').value;

    const dateFormatted = new Date(dateVal + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const guestsLabel = guestsVal === '6' ? '6+ people (large group)' : `${guestsVal} ${guestsVal === '1' ? 'person' : 'people'}`;

    const successName    = document.getElementById('success-name');
    const successEmail   = document.getElementById('success-email');
    const successDetails = document.getElementById('success-details');

    if (successName)    successName.textContent    = nameVal;
    if (successEmail)   successEmail.textContent   = emailVal;
    if (successDetails) successDetails.innerHTML   =
      `📅 ${dateFormatted} at ${timeVal}<br>👥 ${guestsLabel}`;

    form.classList.add('hidden');
    successDiv.classList.remove('hidden');

    // Trigger CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        successDiv.classList.add('success--visible');
      });
    });

    successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---- Set min date on date input ---- */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
}
