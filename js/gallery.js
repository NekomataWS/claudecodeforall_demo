/* ============================================================
   Mind Cafe — Gallery Lightbox
   ============================================================ */

function initGallery() {
  const grid       = document.getElementById('gallery-grid');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbCaption  = document.getElementById('lb-caption');
  const lbCounter  = document.getElementById('lb-counter');
  const lbClose    = document.getElementById('lb-close');
  const lbPrev     = document.getElementById('lb-prev');
  const lbNext     = document.getElementById('lb-next');

  if (!grid || !lightbox) return;

  /* ---- Build items array from DOM ---- */
  const items = Array.from(grid.querySelectorAll('.gallery-item')).map((el, i) => {
    const img = el.querySelector('img');
    return {
      index: i,
      src:     img ? img.src : '',
      alt:     img ? img.alt : '',
      caption: el.dataset.caption || img?.alt || ''
    };
  });

  let currentIndex = 0;
  let touchStartX  = 0;

  /* ---- Open ---- */
  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent(index, false);
    lightbox.classList.add('lightbox--open');
    lightbox.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  /* ---- Close ---- */
  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---- Update image/counter ---- */
  function updateLightboxContent(index, animate) {
    const item = items[index];
    if (!item) return;

    if (animate) {
      lbImg.classList.add('lightbox__img--loading');
      const tempImg = new Image();
      tempImg.onload = () => {
        lbImg.src = item.src;
        lbImg.alt = item.alt;
        lbImg.classList.remove('lightbox__img--loading');
      };
      tempImg.src = item.src;
    } else {
      lbImg.src = item.src;
      lbImg.alt = item.alt;
    }

    if (lbCaption) lbCaption.textContent = item.caption;
    if (lbCounter) lbCounter.textContent = `${index + 1} / ${items.length}`;
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % items.length;
    updateLightboxContent(currentIndex, true);
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightboxContent(currentIndex, true);
  }

  /* ---- Event: click on grid item ---- */
  grid.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const index = parseInt(item.dataset.index, 10);
    if (!isNaN(index)) openLightbox(index);
  });

  /* ---- Event: nav buttons ---- */
  if (lbNext)  lbNext.addEventListener('click', goNext);
  if (lbPrev)  lbPrev.addEventListener('click', goPrev);
  if (lbClose) lbClose.addEventListener('click', closeLightbox);

  /* ---- Event: click backdrop to close ---- */
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---- Event: keyboard ---- */
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
    if (e.key === 'Escape')     { e.preventDefault(); closeLightbox(); }
  });

  /* ---- Event: touch swipe ---- */
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? goNext() : goPrev();
    }
  }, { passive: true });
}
