/* ============================================================
   Mind Cafe — Favourites (localStorage)
   ============================================================ */

(function () {
  const STORAGE_KEY = 'mindcafe_favourites';

  const BOOKMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/></svg>`;

  function getFavourites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  function saveFavourites(set) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  }

  function updateBadge() {
    const favBtn = document.querySelector('.filter-btn[data-filter="favourites"]');
    if (!favBtn) return;
    const count = getFavourites().size;
    favBtn.textContent = count > 0 ? `Favourites (${count})` : 'Favourites';
  }

  function updateClearVisibility(isFavFilter) {
    const actions = document.getElementById('favourites-actions');
    if (!actions) return;
    const show = isFavFilter && getFavourites().size > 0;
    actions.hidden = !show;
    actions.setAttribute('aria-hidden', String(!show));
  }

  function syncCard(card, favourites) {
    const btn = card.querySelector('.menu-card__bookmark');
    if (!btn) return;
    const name = card.querySelector('.menu-card__name').textContent.trim();
    const saved = favourites.has(name);
    btn.classList.toggle('is-saved', saved);
    btn.setAttribute('aria-pressed', String(saved));
    btn.setAttribute('aria-label', saved ? 'Remove from favourites' : 'Save to favourites');
  }

  function initFavourites() {
    const cards = Array.from(document.querySelectorAll('.menu-card'));

    cards.forEach(card => {
      const imageDiv = card.querySelector('.menu-card__image');
      if (!imageDiv) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'menu-card__bookmark';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', 'Save to favourites');
      btn.innerHTML = BOOKMARK_SVG;
      imageDiv.appendChild(btn);

      btn.addEventListener('click', e => {
        e.stopPropagation();
        const name = card.querySelector('.menu-card__name').textContent.trim();
        const favs = getFavourites();
        favs.has(name) ? favs.delete(name) : favs.add(name);
        saveFavourites(favs);
        syncCard(card, favs);
        updateBadge();

        btn.classList.remove('is-popping');
        void btn.offsetWidth; // reflow to restart animation
        btn.classList.add('is-popping');
        btn.addEventListener('animationend', () => btn.classList.remove('is-popping'), { once: true });
      });
    });

    const favs = getFavourites();
    cards.forEach(card => syncCard(card, favs));
    updateBadge();

    // Show/hide clear button when filter changes
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        updateClearVisibility(btn.dataset.filter === 'favourites');
      });
    });

    // Clear all handler
    const clearBtn = document.getElementById('clear-favourites');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        saveFavourites(new Set());
        cards.forEach(card => syncCard(card, new Set()));
        updateBadge();
        updateClearVisibility(true);
        // Refresh the favourites filter view to show empty state
        const favFilterBtn = document.querySelector('.filter-btn[data-filter="favourites"]');
        if (favFilterBtn) favFilterBtn.click();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFavourites);
  } else {
    initFavourites();
  }
})();
