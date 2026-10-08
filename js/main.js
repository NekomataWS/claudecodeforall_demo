/* ============================================================
   Mind Cafe — Main Coordinator
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* Always init scroll reveal on every page */
  if (typeof initScrollReveal === 'function') {
    initScrollReveal();
  }

  /* Page-specific modules — guard with element existence check */
  if (document.getElementById('gallery-grid') && typeof initGallery === 'function') {
    initGallery();
  }

  if (document.getElementById('menu-grid') && typeof initMenuFilter === 'function') {
    initMenuFilter();
  }

  if (document.getElementById('reservation-form') && typeof initReservation === 'function') {
    initReservation();
  }

  /* Hero image load transition */
  const hero = document.querySelector('.hero');
  if (hero) {
    const heroBgImg = hero.querySelector('.hero__bg img');
    if (heroBgImg) {
      if (heroBgImg.complete) {
        hero.classList.add('hero--loaded');
      } else {
        heroBgImg.addEventListener('load', () => hero.classList.add('hero--loaded'));
      }
    }
  }

});
