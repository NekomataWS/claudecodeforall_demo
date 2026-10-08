/* ============================================================
   Menu Detail Drawer
   Opens when clicking anywhere on a .menu-card
   (Add to Cart and bookmark clicks bubble-stop themselves)
   ============================================================ */

(function () {
  'use strict';

  /* ---- Build overlay HTML once ---- */
  const overlay = document.createElement('div');
  overlay.className = 'detail-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'detail-name');
  overlay.innerHTML = `
    <div class="detail-drawer" id="detail-drawer">
      <button class="detail-close" id="detail-close" aria-label="Close details">&#x2715;</button>
      <div class="detail-image">
        <img id="detail-img" src="" alt="">
      </div>
      <div class="detail-body">
        <span class="detail-tag" id="detail-tag"></span>
        <h2 class="detail-name" id="detail-name"></h2>
        <p  class="detail-desc" id="detail-desc"></p>

        <p class="detail-section-title">Ingredients</p>
        <ul class="detail-ingredients" id="detail-ingredients"></ul>

        <div class="detail-notes" id="detail-notes"></div>

        <div class="detail-allergens" id="detail-allergens-wrap">
          <p class="detail-section-title">Allergens</p>
          <div id="detail-allergen-content"></div>
        </div>

        <div class="detail-footer">
          <span class="detail-price" id="detail-price"></span>
          <button class="btn btn--primary detail-add-btn" id="detail-add-btn" type="button">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  /* ---- Element refs ---- */
  const elClose       = overlay.querySelector('#detail-close');
  const elImg         = overlay.querySelector('#detail-img');
  const elTag         = overlay.querySelector('#detail-tag');
  const elName        = overlay.querySelector('#detail-name');
  const elDesc        = overlay.querySelector('#detail-desc');
  const elIngredients = overlay.querySelector('#detail-ingredients');
  const elNotes       = overlay.querySelector('#detail-notes');
  const elAllergens   = overlay.querySelector('#detail-allergen-content');
  const elPrice       = overlay.querySelector('#detail-price');
  const elAddBtn      = overlay.querySelector('#detail-add-btn');

  let currentCard = null;

  /* ---- Open ---- */
  function open(card) {
    const sku  = card.dataset.sku;
    const data = (window.MENU_DETAIL || {})[sku];

    const img   = card.querySelector('.menu-card__image img');
    const name  = card.querySelector('.menu-card__name')?.textContent  || '';
    const desc  = card.querySelector('.menu-card__desc')?.textContent  || '';
    const price = card.querySelector('.menu-card__price')?.textContent || '';
    const tag   = card.querySelector('.menu-card__tag')?.textContent   || '';

    elImg.src  = img?.src  || '';
    elImg.alt  = name;
    elTag.textContent  = tag;
    elName.textContent = name;
    elDesc.textContent = desc;
    elPrice.textContent = price;

    /* Ingredients */
    elIngredients.innerHTML = '';
    if (data?.ingredients?.length) {
      data.ingredients.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        elIngredients.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'Details not available.';
      elIngredients.appendChild(li);
    }

    /* Notes */
    elNotes.textContent = data?.notes || '';
    elNotes.style.display = data?.notes ? 'block' : 'none';

    /* Allergens */
    elAllergens.innerHTML = '';
    if (data?.allergens?.length) {
      const wrap = document.createElement('div');
      wrap.className = 'detail-allergen-list';
      data.allergens.forEach(a => {
        const span = document.createElement('span');
        span.className = 'detail-allergen-tag';
        span.textContent = a;
        wrap.appendChild(span);
      });
      elAllergens.appendChild(wrap);
    } else {
      const p = document.createElement('p');
      p.className = 'detail-allergen-none';
      p.textContent = 'No common allergens listed.';
      elAllergens.appendChild(p);
    }

    /* Add to Cart button: sync state */
    syncAddBtn(card);
    currentCard = card;

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    /* Scroll drawer to top */
    overlay.querySelector('#detail-drawer').scrollTop = 0;

    elClose.focus();
  }

  function syncAddBtn(card) {
    const sku   = card.dataset.sku;
    const price = parseInt(card.dataset.price, 10);
    const name  = card.querySelector('.menu-card__name')?.textContent || '';
    const img   = card.querySelector('.menu-card__image img')?.src || '';

    const cart  = window.MindCart?.getCart() || [];
    const inCart = cart.some(i => i.sku === sku);

    elAddBtn.textContent  = inCart ? 'Added ✓' : 'Add to Cart';
    elAddBtn.classList.toggle('is-added', inCart);

    elAddBtn.onclick = function () {
      if (!window.MindCart) return;
      window.MindCart.addToCart({ sku, name, price, img });
      elAddBtn.textContent = 'Added ✓';
      elAddBtn.classList.add('is-added');
      /* Mirror state back to the card's own button */
      const cardBtn = card.querySelector('.menu-card__add-btn');
      if (cardBtn) {
        cardBtn.textContent = 'Added ✓';
        cardBtn.classList.add('is-added');
      }
    };
  }

  /* ---- Close ---- */
  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    currentCard = null;
  }

  elClose.addEventListener('click', close);

  /* Click outside drawer = close */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  /* Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
  });

  /* ---- Wire up all menu cards ---- */
  document.querySelectorAll('.menu-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
      /* Let bookmark + add-to-cart handle their own clicks */
      if (e.target.closest('.menu-card__bookmark') || e.target.closest('.menu-card__add-btn')) return;
      open(card);
    });
  });
})();
