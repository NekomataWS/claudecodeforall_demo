/* ============================================================
   Mind Cafe — Cart (localStorage)
   ============================================================ */

(function () {
  const CART_KEY = 'mindcafe_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function addToCart(sku, name, priceUSD) {
    const cart = getCart();
    const existing = cart.find(i => i.sku === sku);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ sku, name, priceUSD, qty: 1 });
    }
    saveCart(cart);
    updateBadge();
  }

  function removeFromCart(sku) {
    saveCart(getCart().filter(i => i.sku !== sku));
    updateBadge();
  }

  function updateQty(sku, qty) {
    if (qty < 1) { removeFromCart(sku); return; }
    const cart = getCart();
    const item = cart.find(i => i.sku === sku);
    if (item) { item.qty = qty; saveCart(cart); updateBadge(); }
  }

  function clearCart() {
    saveCart([]);
    updateBadge();
  }

  function getTotalCents() {
    return getCart().reduce((sum, i) => sum + i.priceUSD * i.qty, 0);
  }

  function formatPrice(baht) {
    return '฿' + baht.toLocaleString('th-TH');
  }

  function updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const count = getCart().reduce((sum, i) => sum + i.qty, 0);
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  function initMenuCartButtons() {
    document.querySelectorAll('.menu-card[data-sku]').forEach(card => {
      const btn = card.querySelector('.menu-card__add-btn');
      if (!btn) return;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const sku      = card.dataset.sku;
        const name     = card.querySelector('.menu-card__name').textContent.trim();
        const price    = parseInt(card.dataset.price, 10);
        addToCart(sku, name, price);

        btn.textContent = 'Added!';
        btn.classList.add('is-added');
        setTimeout(() => {
          btn.textContent = 'Add to Cart';
          btn.classList.remove('is-added');
        }, 1000);
      });
    });
  }

  function init() {
    updateBadge();
    initMenuCartButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MindCart = { getCart, saveCart, addToCart, removeFromCart, updateQty, clearCart, getTotalCents, formatPrice, updateBadge };
})();
