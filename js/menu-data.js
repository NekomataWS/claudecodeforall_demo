/* ============================================================
   Mind Cafe — Menu Item Detail Data
   ============================================================ */

const MENU_DETAIL = {
  'classic-espresso': {
    ingredients: [
      'Single origin coffee beans (Ethiopia Yirgacheffe)',
      'Filtered water',
    ],
    notes: '18 g dose · 28-second pull · 36 ml yield',
    allergens: [],
  },
  'flat-white': {
    ingredients: [
      'Double ristretto (Ethiopia blend)',
      'Whole milk or oat milk',
      'Velvety microfoam',
    ],
    notes: '130 ml · served in 5 oz ceramic cup',
    allergens: ['Dairy (or oat)'],
  },
  'cortado': {
    ingredients: [
      'Double espresso (18 g)',
      'Steamed whole milk (equal parts)',
    ],
    notes: '60 ml total · minimal foam',
    allergens: ['Dairy'],
  },
  'oat-cappuccino': {
    ingredients: [
      'Double espresso',
      'Oat milk',
      'Thick microfoam cap',
    ],
    notes: '160 ml · 1:1:1 espresso / milk / foam ratio',
    allergens: ['Oat (gluten trace)'],
  },
  'lavender-latte': {
    ingredients: [
      'Double espresso',
      'House-made lavender syrup (dried lavender, cane sugar)',
      'Oat milk',
      'Edible dried lavender (garnish)',
    ],
    notes: '240 ml · syrup made fresh weekly',
    allergens: ['Oat (gluten trace)'],
  },
  'classic-cold-brew': {
    ingredients: [
      'Single origin coffee (Ethiopia Sidama)',
      'Cold filtered water',
    ],
    notes: '18-hour cold steep · served over ice',
    allergens: [],
  },
  'nitro-cold-brew': {
    ingredients: [
      'Cold brew concentrate',
      'Nitrogen gas (N₂)',
    ],
    notes: 'Poured from tap · served without ice',
    allergens: [],
  },
  'cold-brew-tonic': {
    ingredients: [
      'Cold brew concentrate',
      'Premium Indian tonic water',
      'Fresh orange peel twist',
    ],
    notes: '240 ml · served tall over ice',
    allergens: [],
  },
  'salted-caramel-cold-brew': {
    ingredients: [
      'Cold brew concentrate',
      'House salted caramel syrup (butter, cream, sea salt, cane sugar)',
      'Oat milk',
    ],
    notes: 'Layered pour · stir before drinking',
    allergens: ['Dairy', 'Oat (gluten trace)'],
  },
  'cascara-cold-brew': {
    ingredients: [
      'Cascara (dried coffee cherry skin)',
      'Cold brew blend',
      'Cold filtered water',
    ],
    notes: '240 ml · naturally fruity and lightly caffeinated',
    allergens: [],
  },
  'matcha-latte': {
    ingredients: [
      'Ceremonial grade matcha (Uji, Japan)',
      'Oat milk',
      'Raw wildflower honey',
      'Hot water (75°C for whisking)',
    ],
    notes: '240 ml · stone-ground, single-origin matcha',
    allergens: ['Oat (gluten trace)'],
  },
  'hojicha-latte': {
    ingredients: [
      'Roasted hojicha powder (Japan)',
      'Oat milk',
      'Steamed microfoam',
    ],
    notes: '240 ml · low caffeine, naturally nutty flavour',
    allergens: ['Oat (gluten trace)'],
  },
  'golden-milk': {
    ingredients: [
      'Turmeric (1 tsp)',
      'Fresh ginger',
      'Black pepper (activates curcumin)',
      'Coconut milk',
      'Raw honey',
      'Cinnamon (garnish)',
    ],
    notes: '240 ml · served warm · caffeine-free',
    allergens: ['Tree nut (coconut)'],
  },
  'masala-chai': {
    ingredients: [
      'Assam black tea',
      'Cardamom pods',
      'Cinnamon stick',
      'Fresh ginger',
      'Black peppercorns',
      'Cloves',
      'Steamed oat milk',
    ],
    notes: '240 ml · simmered house blend spices',
    allergens: ['Oat (gluten trace)'],
  },
  'pure-cacao': {
    ingredients: [
      '70% dark cacao (single origin)',
      'Oat milk',
      'Fleur de sel sea salt',
      'Coconut sugar (lightly sweetened)',
    ],
    notes: '240 ml · bean-to-bar cacao, not hot chocolate powder',
    allergens: ['Oat (gluten trace)'],
  },
  'almond-croissant': {
    ingredients: [
      'Laminated butter dough (flour, butter, yeast)',
      'Frangipane filling (almond meal, butter, eggs, sugar)',
      'Flaked almonds',
      'Powdered sugar',
    ],
    notes: 'Twice-baked · made fresh daily · contains gluten',
    allergens: ['Gluten', 'Dairy', 'Eggs', 'Tree nuts (almond)'],
  },
  'dark-chocolate-tart': {
    ingredients: [
      '65% Valrhona dark chocolate',
      'Fresh cream',
      'All-butter short-crust pastry shell',
      'Fleur de sel (finish)',
    ],
    notes: 'Set overnight · served at room temperature',
    allergens: ['Gluten', 'Dairy', 'Eggs'],
  },
  'banana-bread': {
    ingredients: [
      'Ripe heirloom bananas',
      'Walnuts',
      'Plain flour',
      'Unsalted butter',
      'Free-range eggs',
      'Muscovado sugar',
      'Whipped cultured butter (side)',
    ],
    notes: 'House-baked daily · served warm',
    allergens: ['Gluten', 'Dairy', 'Eggs', 'Tree nuts (walnut)'],
  },
  'avocado-toast': {
    ingredients: [
      'Cold-fermented sourdough (24-hour)',
      'Smashed Hass avocado',
      'Poached free-range egg',
      'Dukkah (hazelnuts, sesame, cumin, coriander)',
      'Micro herbs',
      'House chilli oil',
      'Lemon zest',
    ],
    notes: 'Gluten present · egg poached to order',
    allergens: ['Gluten', 'Eggs', 'Tree nuts (hazelnut)', 'Sesame'],
  },
  'granola-bowl': {
    ingredients: [
      'House toasted granola (oats, coconut, almonds, maple syrup)',
      'Coconut yogurt',
      'Seasonal fresh fruit',
      'Bee pollen',
      'Raw wildflower honey',
    ],
    notes: 'Vegan · gluten trace from oats',
    allergens: ['Oat (gluten trace)', 'Tree nuts (almond, coconut)'],
  },
};

window.MENU_DETAIL = MENU_DETAIL;
