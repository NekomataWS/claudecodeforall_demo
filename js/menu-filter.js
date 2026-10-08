/* ============================================================
   Mind Cafe — Menu Category Filter
   ============================================================ */

function initMenuFilter() {
  const grid       = document.getElementById('menu-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const emptyMsg   = document.getElementById('menu-empty');

  if (!grid || !filterBtns.length) return;

  const cards = Array.from(grid.querySelectorAll('.menu-card'));

  function getFavouriteNames() {
    try {
      return new Set(JSON.parse(localStorage.getItem('mindcafe_favourites') || '[]'));
    } catch {
      return new Set();
    }
  }

  function filterMenu(category) {
    /* Brief fade-out */
    grid.classList.add('filtering');

    const favourites = category === 'favourites' ? getFavouriteNames() : null;

    setTimeout(() => {
      let visibleCount = 0;

      cards.forEach(card => {
        let match;
        if (category === 'all') {
          match = true;
        } else if (category === 'favourites') {
          const name = card.querySelector('.menu-card__name')?.textContent.trim();
          match = favourites.has(name);
        } else {
          match = card.dataset.category === category;
        }

        if (match) {
          card.classList.remove('hidden');
          visibleCount++;
          /* Re-trigger reveal animation */
          card.classList.remove('revealed');
          void card.offsetWidth; // reflow
          card.classList.add('revealed');
        } else {
          card.classList.add('hidden');
        }
      });

      if (emptyMsg) {
        if (visibleCount === 0) {
          emptyMsg.textContent = category === 'favourites'
            ? 'No favourites yet — bookmark a drink to save it here.'
            : 'No items in this category yet.';
          emptyMsg.classList.remove('hidden');
        } else {
          emptyMsg.classList.add('hidden');
        }
      }

      grid.classList.remove('filtering');
    }, 150);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Update active state */
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      filterMenu(btn.dataset.filter);
    });
  });

  /* Init: mark all cards as revealed (they animate in on page load via initScrollReveal) */
}
