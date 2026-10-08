// Authoritative server-side price catalog — never trust client-submitted prices.
// price: amount in THB (whole baht, no satang).

const CATALOG = [
  { sku: 'classic-espresso',         name: 'Classic Espresso',        category: 'espresso',   price: 90  },
  { sku: 'flat-white',               name: 'Flat White',              category: 'espresso',   price: 130 },
  { sku: 'cortado',                  name: 'Cortado',                 category: 'espresso',   price: 110 },
  { sku: 'oat-cappuccino',           name: 'Oat Cappuccino',          category: 'espresso',   price: 140 },
  { sku: 'lavender-latte',           name: 'Lavender Latte',          category: 'espresso',   price: 160 },
  { sku: 'classic-cold-brew',        name: 'Classic Cold Brew',       category: 'cold-brew',  price: 140 },
  { sku: 'nitro-cold-brew',          name: 'Nitro Cold Brew',         category: 'cold-brew',  price: 160 },
  { sku: 'cold-brew-tonic',          name: 'Cold Brew Tonic',         category: 'cold-brew',  price: 170 },
  { sku: 'salted-caramel-cold-brew', name: 'Salted Caramel Cold Brew',category: 'cold-brew',  price: 170 },
  { sku: 'cascara-cold-brew',        name: 'Cascara Cold Brew',       category: 'cold-brew',  price: 180 },
  { sku: 'matcha-latte',             name: 'Matcha Latte',            category: 'non-coffee', price: 150 },
  { sku: 'hojicha-latte',            name: 'Hojicha Latte',           category: 'non-coffee', price: 150 },
  { sku: 'golden-milk',              name: 'Golden Milk',             category: 'non-coffee', price: 140 },
  { sku: 'masala-chai',              name: 'Masala Chai',             category: 'non-coffee', price: 140 },
  { sku: 'pure-cacao',               name: 'Pure Cacao',              category: 'non-coffee', price: 160 },
  { sku: 'almond-croissant',         name: 'Almond Croissant',        category: 'snacks',     price: 120 },
  { sku: 'dark-chocolate-tart',      name: 'Dark Chocolate Tart',     category: 'snacks',     price: 160 },
  { sku: 'banana-bread',             name: 'Banana Bread',            category: 'snacks',     price: 110 },
  { sku: 'avocado-toast',            name: 'Avocado Toast',           category: 'snacks',     price: 280 },
  { sku: 'granola-bowl',             name: 'Granola Bowl',            category: 'snacks',     price: 220 },
];

const BY_SKU = Object.fromEntries(CATALOG.map(item => [item.sku, item]));

function findBySku(sku) {
  return BY_SKU[sku] || null;
}

module.exports = { CATALOG, findBySku };
