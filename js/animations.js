/* ============================================================
   Mind Cafe — Scroll Reveal (IntersectionObserver)
   ============================================================ */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Apply data-delay as inline transition-delay
  elements.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) {
      el.style.transitionDelay = (parseInt(delay, 10) * 100) + 'ms';
    }
  });

  if (!('IntersectionObserver' in window)) {
    // Fallback: reveal all immediately
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
}
