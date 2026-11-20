/**
 * DAKOTA PROVISIONS — MODERN MOBILE APPLICATION ENGINE
 * Features:
 *  - Digital Menu Customization with live modifier pricing
 *  - Table-side Ordering & QR Table Scan Simulation
 *  - Real-Time Kitchen Display System (KDS) Synchronization
 *  - Live Ingredient Availability (86'd) Inventory Tracker
 *  - Provisions Club Loyalty Rewards (Tiers, Points, Redemptions)
 *  - Handheld POS with Split-Bill (by Seat / Even), Tips & Simulated Card Terminal
 *  - Web Audio UI Sound FX Synthesizer
 */

(function () {
  'use strict';

  // =========================================================================
  // AUDIO SYNTHESIZER (Web Audio API - zero external assets needed)
  // =========================================================================
  class AudioEngine {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    playOrderSent() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.35);
      });
    }

    playKitchenBell() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1174.66, this.ctx.currentTime); // D6
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    }

    playPaymentSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const chords = [659.25, 1046.50]; // E5, C6
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.4);
      });
    }
  }

  const audio = new AudioEngine();

  // =========================================================================
  // APPLICATION DATA STORE
  // =========================================================================

  // Ingredient Inventory (86 Monitoring)
  const initialInventory = {
    turkey_breast: { name: 'Oven Smoked Turkey Breast', status: 'in-stock', category: 'Proteins', linkedItems: ['huron-club', 'prairie-bowl'] },
    turkey_pastrami: { name: 'Artisan Turkey Pastrami', status: 'in-stock', category: 'Proteins', linkedItems: ['pastrami-reuben'] },
    turkey_bacon: { name: 'Hickory Maple Turkey Bacon', status: 'in-stock', category: 'Proteins', linkedItems: ['huron-club', 'smash-burger'] },
    turkey_tenderloin: { name: 'GAP Turkey Tenderloin', status: 'in-stock', category: 'Proteins', linkedItems: ['tenderloin-platter', 'prairie-bowl'] },
    turkey_drumstick: { name: 'Smoked Turkey Drumstick', status: 'in-stock', category: 'Proteins', linkedItems: ['smokehouse-drumstick'] },
    turkey_ground: { name: 'Dakota 44 Butcher Grind', status: 'in-stock', category: 'Proteins', linkedItems: ['smash-burger', 'poblano-sliders'] },
    brioche_buns: { name: 'Artisan Brioche Buns', status: 'low-stock', category: 'Bakery', linkedItems: ['poblano-sliders', 'smash-burger'] },
    sourdough: { name: 'Rustic Dakota Sourdough', status: 'in-stock', category: 'Bakery', linkedItems: ['huron-club'] },
    marble_rye: { name: 'Heritage Marble Rye', status: 'in-stock', category: 'Bakery', linkedItems: ['pastrami-reuben'] },
    smoked_gouda: { name: 'Prairie Smoked Gouda', status: 'in-stock', category: 'Dairy', linkedItems: ['smash-burger'] },
    white_cheddar: { name: 'Sharp White Cheddar', status: 'in-stock', category: 'Dairy', linkedItems: ['huron-club'] },
    swiss_cheese: { name: 'Aged Prairie Swiss', status: 'in-stock', category: 'Dairy', linkedItems: ['pastrami-reuben'] },
    poblano_glaze: { name: 'Smoky Poblano BBQ Glaze', status: 'in-stock', category: 'Sauces', linkedItems: ['poblano-sliders'] },
    rosemary_aioli: { name: 'Rosemary Herb Aioli', status: 'in-stock', category: 'Sauces', linkedItems: ['huron-club'] },
    avocado: { name: 'Fresh Hass Avocado', status: 'in-stock', category: 'Produce', linkedItems: ['prairie-bowl'] },
    truffle_oil: { name: 'White Truffle Infused Oil', status: 'in-stock', category: 'Pantry', linkedItems: ['truffle-fries'] }
  };

  // Menu Items Catalog
  const initialMenuItems = [
    {
      id: 'huron-club',
      name: 'The Huron Harvest Club',
      category: 'deli',
      price: 16.50,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
      description: 'Shaved GAP-certified smoked turkey breast, thick maple turkey bacon, sharp white cheddar, crisp leaf lettuce, heirloom tomato, and rosemary herb aioli on toasted rustic sourdough.',
      tags: ['GAP Certified', 'Chef Signature', 'No Antibiotics Ever'],
      primaryIngredient: 'turkey_breast',
      options: [
        {
          title: 'Artisan Bread Choice',
          type: 'radio',
          key: 'bread',
          items: [
            { label: 'Rustic Dakota Sourdough', price: 0, ingredient: 'sourdough' },
            { label: 'Heritage Marble Rye', price: 0, ingredient: 'marble_rye' },
            { label: 'Toasted Brioche Bun', price: 0.50, ingredient: 'brioche_buns' },
            { label: 'Gluten-Free Herb Wrap', price: 1.00 }
          ]
        },
        {
          title: 'Artisan Farm Cheese',
          type: 'radio',
          key: 'cheese',
          items: [
            { label: 'Sharp White Cheddar', price: 0, ingredient: 'white_cheddar' },
            { label: 'Prairie Smoked Gouda', price: 0.75, ingredient: 'smoked_gouda' },
            { label: 'Aged Prairie Swiss', price: 0.50, ingredient: 'swiss_cheese' },
            { label: 'No Cheese', price: 0 }
          ]
        },
        {
          title: 'Chef Add-Ons & Extras',
          type: 'checkbox',
          key: 'addons',
          items: [
            { label: 'Extra Thick Turkey Bacon', price: 2.50, ingredient: 'turkey_bacon' },
            { label: 'Extra Shaved Turkey Breast', price: 3.50, ingredient: 'turkey_breast' },
            { label: 'Fresh Sliced Avocado', price: 1.50, ingredient: 'avocado' },
            { label: 'Extra Rosemary Herb Aioli', price: 0.75, ingredient: 'rosemary_aioli' }
          ]
        }
      ]
    },
    {
      id: 'pastrami-reuben',
      name: 'Dakota 44 Smoked Pastrami Reuben',
      category: 'deli',
      price: 17.50,
      image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&auto=format&fit=crop&q=80',
      description: 'Generous stacks of house-cured artisan turkey pastrami, tangy fermented sauerkraut, melted aged Swiss, and Thousand Island sauce pressed crisp on marble rye.',
      tags: ['Dakota 44 Brand', 'Cured In-House', 'High Protein'],
      primaryIngredient: 'turkey_pastrami',
      options: [
        {
          title: 'Bread Selection',
          type: 'radio',
          key: 'bread',
          items: [
            { label: 'Heritage Marble Rye (Classic)', price: 0, ingredient: 'marble_rye' },
            { label: 'Rustic Sourdough', price: 0, ingredient: 'sourdough' }
          ]
        },
        {
          title: 'Sauerkraut & Sauce Style',
          type: 'radio',
          key: 'prep',
          items: [
            { label: 'Traditional (Pressed Hot & Saucy)', price: 0 },
            { label: 'Sauce on the Side', price: 0 },
            { label: 'Extra Tangy Kraut', price: 0.75 }
          ]
        },
        {
          title: 'Add-Ons',
          type: 'checkbox',
          key: 'addons',
          items: [
            { label: 'Double Pastrami Meat (+4oz)', price: 4.50, ingredient: 'turkey_pastrami' },
            { label: 'Extra Swiss Cheese Melt', price: 1.00, ingredient: 'swiss_cheese' }
          ]
        }
      ]
    },
    {
      id: 'tenderloin-platter',
      name: 'Butcher Cut Turkey Tenderloin',
      category: 'smokehouse',
      price: 22.00,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
      description: 'Slow-charred whole muscle turkey tenderloin medallions basted with rosemary garlic sage butter. Served with roasted Yukon garlic mash and farm-fresh prairie beans.',
      tags: ['Chef Signature', 'Gluten Free Option', '100% Lean'],
      primaryIngredient: 'turkey_tenderloin',
      options: [
        {
          title: 'Preparation & Glaze',
          type: 'radio',
          key: 'glaze',
          items: [
            { label: 'Rosemary Garlic Sage Butter (Recommended)', price: 0 },
            { label: 'Smoky Poblano BBQ Glaze', price: 0, ingredient: 'poblano_glaze' },
            { label: 'Herb Cracked Pepper Rub (Dry)', price: 0 }
          ]
        },
        {
          title: 'Farmhouse Side Choice',
          type: 'radio',
          key: 'side',
          items: [
            { label: 'Roasted Garlic Yukon Mash & Beans', price: 0 },
            { label: 'Upgrade to Truffle Fries', price: 3.50, ingredient: 'truffle_oil' },
            { label: 'Prairie Superfood Side Slaw', price: 0 }
          ]
        }
      ]
    },
    {
      id: 'poblano-sliders',
      name: 'Smoky Poblano Turkey Sliders (3x)',
      category: 'griddle',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80',
      description: 'Trio of slow-roasted pulled turkey sliders tossed in our house smoky poblano BBQ glaze, topped with crisp tangy prairie slaw on toasted brioche slider buns.',
      tags: ['Smokehouse Favorite', 'Crowd Pick'],
      primaryIngredient: 'turkey_ground',
      options: [
        {
          title: 'Bun Preference',
          type: 'radio',
          key: 'bun',
          items: [
            { label: 'Golden Brioche Slider Buns', price: 0, ingredient: 'brioche_buns' },
            { label: 'Lettuce Wrapped (Keto)', price: 0 }
          ]
        },
        {
          title: 'Spice Level',
          type: 'radio',
          key: 'spice',
          items: [
            { label: 'Smoky Mild Poblano', price: 0, ingredient: 'poblano_glaze' },
            { label: 'Spicy Fire Sriracha Honey', price: 0.50 }
          ]
        },
        {
          title: 'Add-Ons',
          type: 'checkbox',
          key: 'addons',
          items: [
            { label: 'Add Crispy Turkey Bacon Bits', price: 1.50, ingredient: 'turkey_bacon' },
            { label: 'Melted Smoked Gouda on Sliders', price: 1.50, ingredient: 'smoked_gouda' }
          ]
        }
      ]
    },
    {
      id: 'prairie-bowl',
      name: 'Prairie Protein Power Bowl',
      category: 'bowls',
      price: 16.00,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80',
      description: 'Oven-roasted citrus herb turkey slices served over warm ancient quinoa and wild rice, roasted sweet potato wedges, pickled red onions, avocado crema, and toasted pepitas.',
      tags: ['Heart Healthy', 'High Protein (48g)', 'Clean Eats'],
      primaryIngredient: 'turkey_tenderloin',
      options: [
        {
          title: 'Base Grain Selection',
          type: 'radio',
          key: 'grain',
          items: [
            { label: 'Ancient Quinoa & Wild Rice', price: 0 },
            { label: 'Mixed Organic Prairie Greens', price: 0 },
            { label: '50/50 Grains & Greens', price: 0 }
          ]
        },
        {
          title: 'Protein Boost',
          type: 'checkbox',
          key: 'addons',
          items: [
            { label: 'Extra Sliced Turkey Tenderloin (+3oz)', price: 3.50, ingredient: 'turkey_tenderloin' },
            { label: 'Extra Fresh Avocado Scoop', price: 1.50, ingredient: 'avocado' }
          ]
        }
      ]
    },
    {
      id: 'smokehouse-drumstick',
      name: 'Hickory Smoked Turkey Drumstick',
      category: 'smokehouse',
      price: 14.50,
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&auto=format&fit=crop&q=80',
      description: 'Our iconic colossal slow-smoked turkey drumstick, pit-smoked over South Dakota hickory wood for 6 hours. Served with warm honey skillet cornbread and sweet mustard dip.',
      tags: ['Iconic Festival Item', 'Pit Smoked', 'Fall-off-the-Bone'],
      primaryIngredient: 'turkey_drumstick',
      options: [
        {
          title: 'Sauce Glaze Style',
          type: 'radio',
          key: 'glaze',
          items: [
            { label: 'Hickory Brown Sugar Glaze', price: 0 },
            { label: 'Smoky Poblano BBQ', price: 0, ingredient: 'poblano_glaze' },
            { label: 'South Dakota Dry Rub', price: 0 }
          ]
        }
      ]
    },
    {
      id: 'smash-burger',
      name: 'Dakota 44 Smash Turkey Burger',
      category: 'griddle',
      price: 15.50,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80',
      description: 'Twin seasoned Dakota 44 butcher-grind turkey patties smashed on the griddle with caramelized sweet onions, molten smoked gouda, crispy turkey bacon, and special kitchen sauce.',
      tags: ['Dakota 44 Grind', 'Juicy & Crispy'],
      primaryIngredient: 'turkey_ground',
      options: [
        {
          title: 'Bun Option',
          type: 'radio',
          key: 'bun',
          items: [
            { label: 'Toasted Brioche Bun', price: 0, ingredient: 'brioche_buns' },
            { label: 'Gluten-Free Seeded Bun', price: 1.00 },
            { label: 'Lettuce Wrap', price: 0 }
          ]
        },
        {
          title: 'Add-Ons',
          type: 'checkbox',
          key: 'addons',
          items: [
            { label: 'Extra Slice Smoked Gouda', price: 1.00, ingredient: 'smoked_gouda' },
            { label: 'Extra Strip Turkey Bacon', price: 1.50, ingredient: 'turkey_bacon' },
            { label: 'Add Sliced Avocado', price: 1.50, ingredient: 'avocado' }
          ]
        }
      ]
    },
    {
      id: 'truffle-fries',
      name: 'Huron Tap Truffle Fries',
      category: 'sides',
      price: 7.50,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
      description: 'Hand-cut russet potatoes fried crisp, tossed with Italian white truffle oil, shaved aged parmesan, and cracked rosemary sea salt. Served with roasted garlic dip.',
      tags: ['Shareable', 'Vegetarian'],
      primaryIngredient: 'truffle_oil',
      options: [
        {
          title: 'Dip Selection',
          type: 'radio',
          key: 'dip',
          items: [
            { label: 'Rosemary Garlic Aioli', price: 0, ingredient: 'rosemary_aioli' },
            { label: 'House Smoky Poblano BBQ', price: 0, ingredient: 'poblano_glaze' },
            { label: 'Classic Organic Ketchup', price: 0 }
          ]
        }
      ]
    },
    {
      id: 'craft-rootbeer',
      name: 'Huron Tap Craft Root Beer',
      category: 'sides',
      price: 4.50,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80',
      description: 'Locally crafted South Dakota cane sugar draft root beer brewed with pure vanilla bean, sarsaparilla root, and wild prairie honey. Served ice cold in a frosted glass.',
      tags: ['Local Craft Draft', 'Cane Sugar', 'Non-Alcoholic'],
      primaryIngredient: null,
      options: [
        {
          title: 'Serving Preference',
          type: 'radio',
          key: 'serve',
          items: [
            { label: 'Frosted Mug on Draft', price: 0 },
            { label: 'To-Go Sealed Bottle', price: 0 }
          ]
        }
      ]
    }
  ];

  // Table Floor Plan (12 Tables)
  const initialTables = [
    { id: 1, name: 'Table #1', zone: 'Smokehouse Room', seats: 2, status: 'vacant', checkTotal: 0 },
    { id: 2, name: 'Table #2', zone: 'Smokehouse Room', seats: 4, status: 'vacant', checkTotal: 0 },
    { id: 3, name: 'Table #3', zone: 'Smokehouse Room', seats: 4, status: 'seated', checkTotal: 0 },
    { id: 4, name: 'Table #4', zone: 'Smokehouse Room', seats: 4, status: 'ordering', checkTotal: 49.50 },
    { id: 5, name: 'Table #5', zone: 'Taproom Patio', seats: 2, status: 'vacant', checkTotal: 0 },
    { id: 6, name: 'Table #6', zone: 'Taproom Patio', seats: 6, status: 'billed', checkTotal: 84.20 },
    { id: 7, name: 'Table #7', zone: 'Taproom Patio', seats: 4, status: 'vacant', checkTotal: 0 },
    { id: 8, name: 'Table #8', zone: 'Taproom Patio', seats: 4, status: 'seated', checkTotal: 0 },
    { id: 9, name: 'Table #9', zone: "Chef's Counter", seats: 2, status: 'ordering', checkTotal: 36.50 },
    { id: 10, name: 'Table #10', zone: "Chef's Counter", seats: 2, status: 'vacant', checkTotal: 0 },
    { id: 11, name: 'Table #11', zone: "Chef's Counter", seats: 4, status: 'vacant', checkTotal: 0 },
    { id: 12, name: 'Table #12', zone: 'Smokehouse Room', seats: 6, status: 'vacant', checkTotal: 0 }
  ];

  // Seed Kitchen Orders (KDS)
  const initialOrders = [
    {
      id: 'DP-101',
      tableId: 6,
      tableName: 'Table #6',
      status: 'ready', // new, prep, ready, served
      elapsedSeconds: 520, // ~8.5 mins
      server: 'Sarah M.',
      items: [
        { name: 'The Huron Harvest Club', qty: 2, seat: 'Seat 1 & 2', mods: ['Sourdough', 'White Cheddar', '+ Turkey Bacon'] },
        { name: 'Huron Tap Truffle Fries', qty: 1, seat: 'Shared', mods: ['Rosemary Garlic Dip'] }
      ]
    },
    {
      id: 'DP-102',
      tableId: 9,
      tableName: 'Table #9',
      status: 'prep',
      elapsedSeconds: 240, // 4 mins
      server: 'Jordan K.',
      items: [
        { name: 'Dakota 44 Smoked Pastrami Reuben', qty: 1, seat: 'Seat 1', mods: ['Marble Rye', 'Hot & Saucy', '+ Extra Swiss'] },
        { name: 'Prairie Protein Power Bowl', qty: 1, seat: 'Seat 2', mods: ['Quinoa/Rice', '+ Avocado Scoop'] }
      ]
    }
  ];

  // Customer Loyalty State
  let loyaltyUser = {
    name: 'Marcus Vance',
    membershipId: 'DK-8842-SD',
    points: 420,
    tier: 'Artisan Member',
    appliedPerk: null // e.g. { code: 'FARM5', discount: 5.00, desc: '$5 Off' }
  };

  // State Containers
  let inventory = JSON.parse(JSON.stringify(initialInventory));
  let menu = JSON.parse(JSON.stringify(initialMenuItems));
  let tables = JSON.parse(JSON.stringify(initialTables));
  let orders = JSON.parse(JSON.stringify(initialOrders));
  let currentTable = tables.find(t => t.id === 4);
  let activeCart = [];
  let currentCustomizingItem = null;
  let customQty = 1;
  let currentActiveTab = 'viewGuest';
  let activeKdsFilter = 'all';
  let openCheckSplit = 'single';
  let selectedTipPercent = 18;
  let selectedPaymentMethod = 'nfc';
  let timerInterval = null;

  // =========================================================================
  // DOM ELEMENT REFERENCES
  // =========================================================================
  const els = {
    // Top environment controls
    rolePills: document.querySelectorAll('.role-pill'),
    btnToggleFrame: document.getElementById('btnToggleFrame'),
    frameToggleText: document.getElementById('frameToggleText'),
    btnToggleAudio: document.getElementById('btnToggleAudio'),
    audioIcon: document.getElementById('audioIcon'),
    btnResetDemo: document.getElementById('btnResetDemo'),
    phoneContainer: document.getElementById('phoneContainer'),
    body: document.body,

    // Dynamic island
    dynamicIsland: document.getElementById('dynamicIsland'),
    islandText: document.getElementById('islandText'),
    islandOrderTitle: document.getElementById('islandOrderTitle'),
    islandOrderStatus: document.getElementById('islandOrderStatus'),
    islandTimer: document.getElementById('islandTimer'),

    // Views
    appViews: document.querySelectorAll('.app-view'),
    navTabs: document.querySelectorAll('.nav-tab'),
    currentTableLabel: document.getElementById('currentTableLabel'),
    btnSelectTable: document.getElementById('btnSelectTable'),
    btnOpenLoyalty: document.getElementById('btnOpenLoyalty'),
    loyaltyPtsBadge: document.getElementById('loyaltyPtsBadge'),
    globalStockAlert: document.getElementById('globalStockAlert'),
    globalStockAlertMsg: document.getElementById('globalStockAlertMsg'),

    // Login & Onboarding
    viewLogin: document.getElementById('viewLogin'),
    segBtnGuest: document.getElementById('segBtnGuest'),
    segBtnStaff: document.getElementById('segBtnStaff'),
    loginPanelGuest: document.getElementById('loginPanelGuest'),
    loginPanelStaff: document.getElementById('loginPanelStaff'),
    loginTableInput: document.getElementById('loginTableInput'),
    btnLoginChangeTable: document.getElementById('btnLoginChangeTable'),
    btnEnterAsGuest: document.getElementById('btnEnterAsGuest'),
    btnLoginApple: document.getElementById('btnLoginApple'),
    btnLoginScanQR: document.getElementById('btnLoginScanQR'),
    staffProfileCards: document.querySelectorAll('.staff-profile-card'),
    btnStaffLoginLaunch: document.getElementById('btnStaffLoginLaunch'),
    btnLogoutToLogin: document.getElementById('btnLogoutToLogin'),

    // Guest view & Search
    viewGuest: document.getElementById('viewGuest'),
    menuSearchInput: document.getElementById('menuSearchInput'),
    btnClearSearch: document.getElementById('btnClearSearch'),
    menuItemsContainer: document.getElementById('menuItemsContainer'),
    catPills: document.querySelectorAll('.cat-pill'),
    guestOrderTracker: document.getElementById('guestOrderTracker'),
    trackerStatusBadge: document.getElementById('trackerStatusBadge'),
    trackerOrderNumber: document.getElementById('trackerOrderNumber'),
    trackerTimerDisplay: document.getElementById('trackerTimerDisplay'),
    trackerProgressFill: document.getElementById('trackerProgressFill'),
    guestCartDock: document.getElementById('guestCartDock'),
    cartTotalItems: document.getElementById('cartTotalItems'),
    cartTotalPrice: document.getElementById('cartTotalPrice'),
    btnOpenCartDrawer: document.getElementById('btnOpenCartDrawer'),

    // POS View
    posSubtabs: document.querySelectorAll('.pos-subtab'),
    posTabTables: document.getElementById('posTabTables'),
    posTabChecks: document.getElementById('posTabChecks'),
    posTabHistory: document.getElementById('posTabHistory'),
    tablesGridContainer: document.getElementById('tablesGridContainer'),
    openChecksContainer: document.getElementById('openChecksContainer'),
    settledChecksContainer: document.getElementById('settledChecksContainer'),
    openChecksCount: document.getElementById('openChecksCount'),
    settledCount: document.getElementById('settledCount'),
    serverActiveOrdersBadge: document.getElementById('serverActiveOrdersBadge'),
    btnQuickNewOrder: document.getElementById('btnQuickNewOrder'),

    // KDS View
    kdsBoardContainer: document.getElementById('kdsBoardContainer'),
    kdsBadgeCount: document.getElementById('kdsBadgeCount'),
    navKdsBadge: document.getElementById('navKdsBadge'),
    kdsActiveTicketHeader: document.getElementById('kdsActiveTicketHeader'),
    kdsFilters: document.querySelectorAll('.kds-filter'),
    kdsFilterAll: document.getElementById('kdsFilterAll'),
    kdsFilterNew: document.getElementById('kdsFilterNew'),
    kdsFilterPrep: document.getElementById('kdsFilterPrep'),
    kdsFilterReady: document.getElementById('kdsFilterReady'),

    // Inventory View
    inventoryListContainer: document.getElementById('inventoryListContainer'),
    invInStockCount: document.getElementById('invInStockCount'),
    invLowStockCount: document.getElementById('invLowStockCount'),
    inv86Count: document.getElementById('inv86Count'),
    inventory86Badge: document.getElementById('inventory86Badge'),
    nav86Badge: document.getElementById('nav86Badge'),
    btnRestockAll: document.getElementById('btnRestockAll'),

    // Modals & Drawers
    customizationBackdrop: document.getElementById('customizationBackdrop'),
    customizationDrawer: document.getElementById('customizationDrawer'),
    btnCloseCustomDrawer: document.getElementById('btnCloseCustomDrawer'),
    customModalCategory: document.getElementById('customModalCategory'),
    customModalTitle: document.getElementById('customModalTitle'),
    customModalPrice: document.getElementById('customModalPrice'),
    customModalImage: document.getElementById('customModalImage'),
    customModalDescription: document.getElementById('customModalDescription'),
    dynamicCustomizerOptions: document.getElementById('dynamicCustomizerOptions'),
    customSpecialNotes: document.getElementById('customSpecialNotes'),
    btnCustomQtyMinus: document.getElementById('btnCustomQtyMinus'),
    btnCustomQtyPlus: document.getElementById('btnCustomQtyPlus'),
    customQtyValue: document.getElementById('customQtyValue'),
    btnAddToCartConfirm: document.getElementById('btnAddToCartConfirm'),
    customModalAddTotal: document.getElementById('customModalAddTotal'),

    // Cart Drawer
    cartBackdrop: document.getElementById('cartBackdrop'),
    cartDrawer: document.getElementById('cartDrawer'),
    btnCloseCartDrawer: document.getElementById('btnCloseCartDrawer'),
    cartDrawerTableLabel: document.getElementById('cartDrawerTableLabel'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartTax: document.getElementById('cartTax'),
    cartLoyaltyRow: document.getElementById('cartLoyaltyRow'),
    cartLoyaltyDiscount: document.getElementById('cartLoyaltyDiscount'),
    cartFinalTotal: document.getElementById('cartFinalTotal'),
    cartPointsEarned: document.getElementById('cartPointsEarned'),
    btnSendOrderToKitchen: document.getElementById('btnSendOrderToKitchen'),
    btnOpenCheckoutFromCart: document.getElementById('btnOpenCheckoutFromCart'),

    // Table Selector Drawer
    tableSelectorBackdrop: document.getElementById('tableSelectorBackdrop'),
    btnCloseTableDrawer: document.getElementById('btnCloseTableDrawer'),
    modalTablesGrid: document.getElementById('modalTablesGrid'),
    btnSimulateScan: document.getElementById('btnSimulateScan'),

    // Loyalty Drawer
    loyaltyBackdrop: document.getElementById('loyaltyBackdrop'),
    btnCloseLoyaltyDrawer: document.getElementById('btnCloseLoyaltyDrawer'),
    loyaltyPtsDisplay: document.getElementById('loyaltyPtsDisplay'),
    loyaltyTierBadge: document.getElementById('loyaltyTierBadge'),
    redeemBtns: document.querySelectorAll('.btn-redeem'),

    // POS Checkout Drawer
    posCheckoutBackdrop: document.getElementById('posCheckoutBackdrop'),
    btnClosePosCheckout: document.getElementById('btnClosePosCheckout'),
    posCheckoutTableNum: document.getElementById('posCheckoutTableNum'),
    splitPills: document.querySelectorAll('.split-pill'),
    splitDetailsBox: document.getElementById('splitDetailsBox'),
    posDueAmount: document.getElementById('posDueAmount'),
    tipBtns: document.querySelectorAll('.tip-btn'),
    tipAmt15: document.getElementById('tipAmt15'),
    tipAmt18: document.getElementById('tipAmt18'),
    tipAmt20: document.getElementById('tipAmt20'),
    tipAmt25: document.getElementById('tipAmt25'),
    payMethodBtns: document.querySelectorAll('.pay-method-btn'),
    terminalPrompt: document.getElementById('terminalPrompt'),
    terminalSubprompt: document.getElementById('terminalSubprompt'),
    btnProcessPayment: document.getElementById('btnProcessPayment'),
    posChargeBtnTotal: document.getElementById('posChargeBtnTotal'),

    // Receipt Drawer
    receiptBackdrop: document.getElementById('receiptBackdrop'),
    btnCloseReceiptDrawer: document.getElementById('btnCloseReceiptDrawer'),
    recTableNum: document.getElementById('recTableNum'),
    recDate: document.getElementById('recDate'),
    recTime: document.getElementById('recTime'),
    recOrderNum: document.getElementById('recOrderNum'),
    recAuth: document.getElementById('recAuth'),
    recItemsList: document.getElementById('recItemsList'),
    recSubtotal: document.getElementById('recSubtotal'),
    recTax: document.getElementById('recTax'),
    recTip: document.getElementById('recTip'),
    recTotal: document.getElementById('recTotal'),
    recMethod: document.getElementById('recMethod'),
    recPointsEarned: document.getElementById('recPointsEarned'),
    recNewBalance: document.getElementById('recNewBalance'),
    btnPrintReceipt: document.getElementById('btnPrintReceipt'),
    btnFinishTable: document.getElementById('btnFinishTable')
  };

  // =========================================================================
  // INITIALIZATION & EVENT BINDINGS
  // =========================================================================
  function init() {
    renderMenu('all');
    renderInventory();
    renderTables();
    renderKDS();
    renderOpenChecks();
    updateCartUI();
    updateStockAlerts();
    startClock();
    startOrderTimers();
    bindEvents();

    // Default table: Table #4
    selectTable(4);

    // Deep-linking URL params & hash (e.g. #login, #kds, #pos, #inventory, #custom, #loyalty, #checkout)
    try {
      const hash = (window.location.hash || '').replace('#', '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role') || (['login', 'kds', 'pos', 'inventory', 'guest'].includes(hash) ? hash : null);
      const modal = params.get('modal') || (['custom', 'loyalty', 'checkout'].includes(hash) ? hash : null);

      if (role) {
        switchRole(role);
      }
      if (modal === 'custom') {
        openCustomizer(menu[0]);
      } else if (modal === 'loyalty') {
        openModal(els.loyaltyBackdrop);
      } else if (modal === 'checkout') {
        openCheckoutDrawer();
      }
    } catch (e) {
      console.warn('URL params parsing bypassed:', e);
    }
  }

  function bindEvents() {
    // Role switcher
    els.rolePills.forEach(pill => {
      pill.addEventListener('click', () => {
        audio.playClick();
        const role = pill.dataset.role;
        switchRole(role);
      });
    });

    // Login Segment Tabs (Diner vs Staff)
    if (els.segBtnGuest && els.segBtnStaff) {
      els.segBtnGuest.addEventListener('click', () => {
        audio.playClick();
        els.segBtnGuest.classList.add('active');
        els.segBtnStaff.classList.remove('active');
        if (els.loginPanelGuest) els.loginPanelGuest.classList.add('active');
        if (els.loginPanelStaff) els.loginPanelStaff.classList.remove('active');
      });

      els.segBtnStaff.addEventListener('click', () => {
        audio.playClick();
        els.segBtnStaff.classList.add('active');
        els.segBtnGuest.classList.remove('active');
        if (els.loginPanelStaff) els.loginPanelStaff.classList.add('active');
        if (els.loginPanelGuest) els.loginPanelGuest.classList.remove('active');
      });
    }

    // Login Seating Change
    if (els.btnLoginChangeTable) {
      els.btnLoginChangeTable.addEventListener('click', () => {
        audio.playClick();
        openModal(els.tableSelectorBackdrop);
      });
    }

    // Diner Login Buttons
    if (els.btnEnterAsGuest) {
      els.btnEnterAsGuest.addEventListener('click', () => {
        audio.playClick();
        switchRole('guest');
        showNotification(`Welcome to Dakota Provisions! Seated at ${currentTable ? currentTable.name : 'Table #4'}.`);
      });
    }

    if (els.btnLoginApple) {
      els.btnLoginApple.addEventListener('click', () => {
        audio.playPaymentSuccess();
        loyaltyUser.name = 'Marcus Vance';
        loyaltyUser.points = 420;
        showNotification('Signed in with Apple ID (Marcus Vance • 420 pts)');
        switchRole('guest');
      });
    }

    if (els.btnLoginScanQR) {
      els.btnLoginScanQR.addEventListener('click', () => {
        audio.playClick();
        selectTable(4);
        showNotification('QR Code Scanned: Table #4 Linked to Smokehouse Room');
        switchRole('guest');
      });
    }

    // Staff Profile Cards
    els.staffProfileCards.forEach(card => {
      card.addEventListener('click', () => {
        audio.playClick();
        els.staffProfileCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Staff Launch Terminal
    if (els.btnStaffLoginLaunch) {
      els.btnStaffLoginLaunch.addEventListener('click', () => {
        audio.playClick();
        const activeCard = document.querySelector('.staff-profile-card.active');
        const targetRole = activeCard ? activeCard.dataset.role : 'pos';
        const staffName = activeCard ? (activeCard.querySelector('strong')?.textContent || 'Staff') : 'Staff Member';
        showNotification(`Terminal Authorized: Welcome, ${staffName}!`);
        switchRole(targetRole);
      });
    }

    // Switch account / Sign out to Login
    if (els.btnLogoutToLogin) {
      els.btnLogoutToLogin.addEventListener('click', () => {
        audio.playClick();
        switchRole('login');
        showNotification('Switched to Login Screen');
      });
    }

    // Menu Live Search
    if (els.menuSearchInput) {
      els.menuSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (els.btnClearSearch) {
          els.btnClearSearch.style.display = query ? 'block' : 'none';
        }
        renderMenu(getActiveCategory(), query);
      });
    }

    if (els.btnClearSearch) {
      els.btnClearSearch.addEventListener('click', () => {
        audio.playClick();
        if (els.menuSearchInput) {
          els.menuSearchInput.value = '';
          els.menuSearchInput.focus();
        }
        els.btnClearSearch.style.display = 'none';
        renderMenu(getActiveCategory(), '');
      });
    }

    // Frame toggle (optional guard)
    if (els.btnToggleFrame) {
      els.btnToggleFrame.addEventListener('click', () => {
        audio.playClick();
        els.body.classList.toggle('device-framed');
        const isFramed = els.body.classList.contains('device-framed');
        if (els.frameToggleText) {
          els.frameToggleText.textContent = isFramed ? 'Frame: ON' : 'Frame: OFF';
        }
      });
    }

    // Audio toggle
    if (els.btnToggleAudio) {
      els.btnToggleAudio.addEventListener('click', () => {
        audio.enabled = !audio.enabled;
        els.audioIcon.textContent = audio.enabled ? '🔊' : '🔇';
      });
    }

    // Reset Demo
    if (els.btnResetDemo) {
      els.btnResetDemo.addEventListener('click', () => {
        audio.playClick();
        if (confirm('Reset prototype state to initial demo data?')) {
          inventory = JSON.parse(JSON.stringify(initialInventory));
          menu = JSON.parse(JSON.stringify(initialMenuItems));
          tables = JSON.parse(JSON.stringify(initialTables));
          orders = JSON.parse(JSON.stringify(initialOrders));
          activeCart = [];
          loyaltyUser.points = 420;
          loyaltyUser.appliedPerk = null;
          init();
          showNotification('Demo data reset successfully');
        }
      });
    }

    // Bottom navigation
    els.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        audio.playClick();
        const targetViewId = tab.dataset.target;
        setActiveView(targetViewId);
      });
    });

    // Category filter pills
    els.catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        audio.playClick();
        els.catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const currentSearch = els.menuSearchInput ? els.menuSearchInput.value : '';
        renderMenu(pill.dataset.cat, currentSearch);
      });
    });

    // Drawer openers
    els.btnSelectTable.addEventListener('click', () => {
      audio.playClick();
      openModal(els.tableSelectorBackdrop);
    });

    els.btnOpenLoyalty.addEventListener('click', () => {
      audio.playClick();
      openModal(els.loyaltyBackdrop);
    });

    els.btnOpenCartDrawer.addEventListener('click', () => {
      audio.playClick();
      openModal(els.cartBackdrop);
    });

    // Drawer closers
    els.btnCloseCustomDrawer.addEventListener('click', () => closeModal(els.customizationBackdrop));
    els.btnCloseCartDrawer.addEventListener('click', () => closeModal(els.cartBackdrop));
    els.btnCloseTableDrawer.addEventListener('click', () => closeModal(els.tableSelectorBackdrop));
    els.btnCloseLoyaltyDrawer.addEventListener('click', () => closeModal(els.loyaltyBackdrop));
    els.btnClosePosCheckout.addEventListener('click', () => closeModal(els.posCheckoutBackdrop));
    els.btnCloseReceiptDrawer.addEventListener('click', () => closeModal(els.receiptBackdrop));

    // Backdrop clicks close
    [els.customizationBackdrop, els.cartBackdrop, els.tableSelectorBackdrop, els.loyaltyBackdrop, els.posCheckoutBackdrop, els.receiptBackdrop].forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop);
      });
    });

    // Customizer quantity +/-
    els.btnCustomQtyMinus.addEventListener('click', () => {
      audio.playClick();
      if (customQty > 1) {
        customQty--;
        els.customQtyValue.textContent = customQty;
        updateCustomizerTotal();
      }
    });

    els.btnCustomQtyPlus.addEventListener('click', () => {
      audio.playClick();
      customQty++;
      els.customQtyValue.textContent = customQty;
      updateCustomizerTotal();
    });

    // Add to cart confirm
    els.btnAddToCartConfirm.addEventListener('click', () => {
      audio.playClick();
      addItemToCart();
    });

    // Send order to kitchen
    els.btnSendOrderToKitchen.addEventListener('click', () => {
      submitCartToKitchen();
    });

    // Open checkout from cart
    els.btnOpenCheckoutFromCart.addEventListener('click', () => {
      audio.playClick();
      closeModal(els.cartBackdrop);
      openCheckoutDrawer();
    });

    // QR scan simulation
    els.btnSimulateScan.addEventListener('click', () => {
      audio.playClick();
      selectTable(4);
      closeModal(els.tableSelectorBackdrop);
      showNotification('Scanned QR at Table #4: Connected to Smokehouse Room');
    });

    // POS Subtabs (Tables, Open Checks, History)
    els.posSubtabs.forEach(subtab => {
      subtab.addEventListener('click', () => {
        audio.playClick();
        els.posSubtabs.forEach(s => s.classList.remove('active'));
        subtab.classList.add('active');
        const tab = subtab.dataset.postab;
        els.posTabTables.classList.toggle('active', tab === 'tables');
        els.posTabChecks.classList.toggle('active', tab === 'activeChecks');
        els.posTabHistory.classList.toggle('active', tab === 'history');
      });
    });

    // KDS Filters
    els.kdsFilters.forEach(f => {
      f.addEventListener('click', () => {
        audio.playClick();
        els.kdsFilters.forEach(k => k.classList.remove('active'));
        f.classList.add('active');
        activeKdsFilter = f.dataset.filter;
        renderKDS();
      });
    });

    // Inventory Restock All
    els.btnRestockAll.addEventListener('click', () => {
      audio.playClick();
      Object.keys(inventory).forEach(k => {
        inventory[k].status = 'in-stock';
      });
      renderInventory();
      renderMenu(getActiveCategory());
      updateStockAlerts();
      showNotification('All ingredients restocked to In-Stock!');
    });

    // Loyalty Redemption Perks
    els.redeemBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const pts = parseInt(btn.dataset.pts, 10);
        const discount = parseFloat(btn.dataset.discount);
        const code = btn.dataset.code;

        if (loyaltyUser.points < pts) {
          alert('Not enough Provisions Club points for this perk!');
          return;
        }

        audio.playPaymentSuccess();
        loyaltyUser.points -= pts;
        loyaltyUser.appliedPerk = { code, discount, desc: btn.closest('.perk-card').querySelector('strong').textContent };
        els.loyaltyPtsBadge.textContent = loyaltyUser.points;
        els.loyaltyPtsDisplay.textContent = loyaltyUser.points;
        btn.textContent = 'Applied to Order! ✓';
        btn.disabled = true;

        updateCartUI();
        showNotification(`Perk Applied: $${discount.toFixed(2)} discount will be applied to your check!`);
      });
    });

    // POS Split Check Methods
    els.splitPills.forEach(pill => {
      pill.addEventListener('click', () => {
        audio.playClick();
        els.splitPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        openCheckSplit = pill.dataset.split;
        renderSplitDetails();
        calculatePOSTotals();
      });
    });

    // Tip Buttons
    els.tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        els.tipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedTipPercent = parseInt(btn.dataset.tip, 10);
        calculatePOSTotals();
      });
    });

    // Payment Method Buttons
    els.payMethodBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playClick();
        els.payMethodBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPaymentMethod = btn.dataset.method;
        updateTerminalPrompt();
      });
    });

    // Process POS Payment
    els.btnProcessPayment.addEventListener('click', () => {
      processPOSPayment();
    });

    // Receipt Actions
    els.btnPrintReceipt.addEventListener('click', () => {
      audio.playClick();
      window.print();
    });

    els.btnFinishTable.addEventListener('click', () => {
      audio.playClick();
      closeModal(els.receiptBackdrop);
      // Free current table
      if (currentTable) {
        currentTable.status = 'vacant';
        currentTable.checkTotal = 0;
      }
      activeCart = [];
      updateCartUI();
      renderTables();
      renderOpenChecks();
      showNotification('Table settled and marked Vacant for next guest');
    });

    // Dynamic Island Tap expands/collapses
    els.dynamicIsland.addEventListener('click', () => {
      audio.playClick();
      els.dynamicIsland.classList.toggle('is-expanded');
    });
  }

  // =========================================================================
  // ROLE SWITCHER & NAVIGATION
  // =========================================================================
  function switchRole(role) {
    els.rolePills.forEach(p => {
      const isRole = p.dataset.role === role;
      p.classList.toggle('active', isRole);
      p.setAttribute('aria-selected', isRole);
    });

    let viewTarget = 'viewGuest';
    if (role === 'login') viewTarget = 'viewLogin';
    else if (role === 'pos') viewTarget = 'viewPOS';
    else if (role === 'kds') viewTarget = 'viewKDS';
    else if (role === 'inventory') viewTarget = 'viewInventory';
    else viewTarget = 'viewGuest';

    setActiveView(viewTarget);
  }

  function setActiveView(viewId) {
    currentActiveTab = viewId;
    els.appViews.forEach(v => {
      v.classList.toggle('active', v.id === viewId);
    });

    els.navTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.target === viewId);
    });

    // Update role pills on top bar to sync
    let role = 'guest';
    if (viewId === 'viewLogin') role = 'login';
    else if (viewId === 'viewPOS') role = 'pos';
    else if (viewId === 'viewKDS') role = 'kds';
    else if (viewId === 'viewInventory') role = 'inventory';

    els.rolePills.forEach(p => {
      const match = p.dataset.role === role;
      p.classList.toggle('active', match);
      p.setAttribute('aria-selected', match);
    });
  }

  function getActiveCategory() {
    const activePill = document.querySelector('.cat-pill.active');
    return activePill ? activePill.dataset.cat : 'all';
  }

  // =========================================================================
  // VIEW 1: DIGITAL MENU & CUSTOMIZATION LOGIC
  // =========================================================================
  function isIngredient86d(ingKey) {
    if (!ingKey || !inventory[ingKey]) return false;
    return inventory[ingKey].status === '86';
  }

  function isItemUnavailable(item) {
    if (item.primaryIngredient && isIngredient86d(item.primaryIngredient)) {
      return true;
    }
    return false;
  }

  function renderMenu(category = 'all', searchQuery = '') {
    els.menuItemsContainer.innerHTML = '';

    const query = (searchQuery || (els.menuSearchInput ? els.menuSearchInput.value : '') || '').trim().toLowerCase();

    let filtered = category === 'all'
      ? menu
      : menu.filter(item => item.category === category);

    if (query) {
      filtered = filtered.filter(item => {
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(query));
        return matchName || matchDesc || matchTags;
      });
    }

    if (filtered.length === 0) {
      els.menuItemsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 16px; color: var(--text-secondary);">
          <div style="font-size: 32px; margin-bottom: 8px;">🔍</div>
          <h4 style="font-size: 15px; color: var(--text-primary); margin-bottom: 4px;">No matching items found</h4>
          <p style="font-size: 12px; color: var(--text-muted);">Try searching for turkey, bacon, or tap a category pill above.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const is86 = isItemUnavailable(item);

      const card = document.createElement('article');
      card.className = `menu-item-card ${is86 ? 'is-86d' : ''}`;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="item-thumb" style="background-image: url('${item.image}')">
          ${is86 ? '<div class="item-86-badge">86\'d / Sold Out</div>' : ''}
        </div>
        <div class="item-content">
          <div class="item-top-row">
            <h3 class="item-name">${item.name}</h3>
            <span class="item-price">$${item.price.toFixed(2)}</span>
          </div>
          <p class="item-description">${item.description}</p>
          <div class="item-tags">
            ${item.tags.map(t => `<span class="item-tag highlight">${t}</span>`).join('')}
            ${is86 ? '<span class="item-tag stock-out">Out of Stock</span>' : ''}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (is86) {
          audio.playClick();
          showNotification(`"${item.name}" is currently 86'd in the kitchen.`);
          return;
        }
        audio.playClick();
        openCustomizer(item);
      });

      els.menuItemsContainer.appendChild(card);
    });
  }

  function openCustomizer(item) {
    currentCustomizingItem = item;
    customQty = 1;
    els.customQtyValue.textContent = '1';
    els.customSpecialNotes.value = '';

    els.customModalCategory.textContent = item.category.toUpperCase();
    els.customModalTitle.textContent = item.name;
    els.customModalPrice.textContent = `$${item.price.toFixed(2)}`;
    els.customModalDescription.textContent = item.description;
    els.customModalImage.style.backgroundImage = `url('${item.image}')`;

    // Render dynamic options
    els.dynamicCustomizerOptions.innerHTML = '';
    item.options.forEach(optGroup => {
      const groupCard = document.createElement('div');
      groupCard.className = 'form-group-card';

      const title = document.createElement('label');
      title.className = 'form-section-title';
      title.textContent = optGroup.title;
      groupCard.appendChild(title);

      const list = document.createElement('div');
      list.className = 'options-list';

      optGroup.items.forEach((opt, idx) => {
        const isLocked = isIngredient86d(opt.ingredient);

        const row = document.createElement('label');
        row.className = `option-row ${isLocked ? 'is-locked' : ''}`;

        const inputType = optGroup.type; // 'radio' or 'checkbox'
        const inputName = `opt_${optGroup.key}`;

        row.innerHTML = `
          <div class="option-left">
            <input type="${inputType}" name="${inputName}" value="${opt.label}" 
                   data-price="${opt.price || 0}" 
                   data-ingredient="${opt.ingredient || ''}"
                   ${idx === 0 && inputType === 'radio' && !isLocked ? 'checked' : ''}
                   ${isLocked ? 'disabled' : ''}>
            <span>${opt.label}</span>
            ${isLocked ? '<span class="locked-badge">86\'d</span>' : ''}
          </div>
          <div class="option-right">
            ${opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}
          </div>
        `;

        row.querySelector('input').addEventListener('change', () => {
          audio.playClick();
          updateCustomizerTotal();
        });

        list.appendChild(row);
      });

      groupCard.appendChild(list);
      els.dynamicCustomizerOptions.appendChild(groupCard);
    });

    updateCustomizerTotal();
    openModal(els.customizationBackdrop);
  }

  function updateCustomizerTotal() {
    if (!currentCustomizingItem) return;
    let base = currentCustomizingItem.price;

    const checkedInputs = els.dynamicCustomizerOptions.querySelectorAll('input:checked');
    checkedInputs.forEach(input => {
      const add = parseFloat(input.dataset.price) || 0;
      base += add;
    });

    const finalTotal = base * customQty;
    els.customModalAddTotal.textContent = `$${finalTotal.toFixed(2)}`;
  }

  function addItemToCart() {
    if (!currentCustomizingItem) return;

    // Collect options
    const selectedMods = [];
    let itemPrice = currentCustomizingItem.price;

    const checkedInputs = els.dynamicCustomizerOptions.querySelectorAll('input:checked');
    checkedInputs.forEach(input => {
      const add = parseFloat(input.dataset.price) || 0;
      itemPrice += add;
      selectedMods.push(input.value);
    });

    // Special notes
    const notes = els.customSpecialNotes.value.trim();
    if (notes) {
      selectedMods.push(`Note: ${notes}`);
    }

    // Selected seat
    const seatInput = document.querySelector('input[name="orderSeat"]:checked');
    const seatName = seatInput ? seatInput.value : 'Seat 1';

    // Add to activeCart
    activeCart.push({
      cartId: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      id: currentCustomizingItem.id,
      name: currentCustomizingItem.name,
      price: itemPrice,
      qty: customQty,
      seat: seatName,
      mods: selectedMods
    });

    closeModal(els.customizationBackdrop);
    updateCartUI();
    showNotification(`Added ${customQty}x "${currentCustomizingItem.name}" for ${seatName}`);
  }

  // =========================================================================
  // VIEW 1 & 2: CART, TABLE-SIDE ORDERING & POS INTEGRATION
  // =========================================================================
  function updateCartUI() {
    const totalItems = activeCart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = activeCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0.065; // SD State & City Tax 6.5%

    let discount = 0;
    if (loyaltyUser.appliedPerk) {
      discount = Math.min(loyaltyUser.appliedPerk.discount, subtotal);
    }

    const finalTotal = Math.max(0, subtotal + tax - discount);
    const pointsEarned = Math.floor(finalTotal * 10);

    // Update Dock
    if (totalItems > 0 && currentActiveTab === 'viewGuest') {
      els.guestCartDock.style.display = 'flex';
      els.cartTotalItems.textContent = totalItems;
      els.cartTotalPrice.textContent = `$${finalTotal.toFixed(2)}`;
    } else {
      els.guestCartDock.style.display = 'none';
    }

    // Update Cart Drawer values
    els.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    els.cartTax.textContent = `$${tax.toFixed(2)}`;
    els.cartFinalTotal.textContent = `$${finalTotal.toFixed(2)}`;
    els.cartPointsEarned.textContent = pointsEarned;

    if (discount > 0) {
      els.cartLoyaltyRow.style.display = 'flex';
      els.cartLoyaltyDiscount.textContent = `-$${discount.toFixed(2)} (${loyaltyUser.appliedPerk.code})`;
    } else {
      els.cartLoyaltyRow.style.display = 'none';
    }

    // Render Cart Items
    els.cartItemsList.innerHTML = '';
    if (activeCart.length === 0) {
      els.cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <span style="font-size: 32px; display: block; margin-bottom: 8px;">🛒</span>
          Your table order is empty. Browse the menu to add artisan proteins!
        </div>
      `;
    } else {
      activeCart.forEach((item, index) => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-title">${item.qty}x ${item.name}</span>
            <span class="cart-item-seat-badge">${item.seat}</span>
            ${item.mods.length ? `<div class="cart-item-mods-sub">${item.mods.join(' &bull; ')}</div>` : ''}
          </div>
          <div class="cart-item-right">
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="cart-item-remove" data-index="${index}">Remove</button>
          </div>
        `;

        itemRow.querySelector('.cart-item-remove').addEventListener('click', (e) => {
          audio.playClick();
          const idx = parseInt(e.target.dataset.index, 10);
          activeCart.splice(idx, 1);
          updateCartUI();
        });

        els.cartItemsList.appendChild(itemRow);
      });
    }

    // Update Table status total
    if (currentTable) {
      currentTable.checkTotal = finalTotal;
    }
  }

  function submitCartToKitchen() {
    if (activeCart.length === 0) {
      alert('Please add items to your table order before sending to the kitchen.');
      return;
    }

    audio.playOrderSent();
    audio.playKitchenBell();

    const orderNum = 'DP-' + (100 + orders.length + 1);
    const newOrder = {
      id: orderNum,
      tableId: currentTable ? currentTable.id : 4,
      tableName: currentTable ? currentTable.name : 'Table #4',
      status: 'new', // new -> prep -> ready -> served
      elapsedSeconds: 0,
      server: 'Sarah M.',
      items: activeCart.map(c => ({
        name: c.name,
        qty: c.qty,
        seat: c.seat,
        mods: c.mods
      }))
    };

    orders.unshift(newOrder); // Add to beginning of KDS

    // Update table state to 'ordering'
    if (currentTable) {
      currentTable.status = 'ordering';
    }

    closeModal(els.cartBackdrop);

    // Show Guest Order Tracker & Dynamic Island
    showGuestTracker(newOrder);
    triggerDynamicIsland(newOrder);

    // Refresh KDS and POS
    renderKDS();
    renderTables();
    renderOpenChecks();

    showNotification(`Order ${orderNum} sent directly to the Kitchen KDS!`);
  }

  function showGuestTracker(order) {
    els.guestOrderTracker.style.display = 'block';
    els.trackerOrderNumber.textContent = `Order #${order.id} • ${order.tableName}`;
    updateTrackerProgress(order.status);
  }

  function updateTrackerProgress(status) {
    const stepPrep = document.getElementById('stepPrep');
    const stepReady = document.getElementById('stepReady');
    const stepServed = document.getElementById('stepServed');

    if (status === 'new') {
      els.trackerStatusBadge.textContent = 'Received by Kitchen';
      els.trackerProgressFill.style.width = '25%';
      stepPrep.classList.remove('done');
      stepReady.classList.remove('done');
      stepServed.classList.remove('done');
    } else if (status === 'prep') {
      els.trackerStatusBadge.textContent = 'In Preparation';
      els.trackerProgressFill.style.width = '50%';
      stepPrep.classList.add('done');
      stepReady.classList.remove('done');
      stepServed.classList.remove('done');
    } else if (status === 'ready') {
      els.trackerStatusBadge.textContent = 'Plated & Ready to Serve';
      els.trackerProgressFill.style.width = '75%';
      stepPrep.classList.add('done');
      stepReady.classList.add('done');
      stepServed.classList.remove('done');
    } else if (status === 'served') {
      els.trackerStatusBadge.textContent = 'Delivered to Table';
      els.trackerProgressFill.style.width = '100%';
      stepPrep.classList.add('done');
      stepReady.classList.add('done');
      stepServed.classList.add('done');
    }
  }

  function triggerDynamicIsland(order) {
    els.islandText.textContent = `${order.tableName}: Prepping (${order.id})`;
    els.islandOrderTitle.textContent = `${order.tableName} • Active Order`;
    els.islandOrderStatus.textContent = 'Kitchen preparing your craft proteins';
    els.dynamicIsland.classList.add('is-expanded');

    setTimeout(() => {
      els.dynamicIsland.classList.remove('is-expanded');
    }, 4000);
  }

  // =========================================================================
  // VIEW 3: KITCHEN DISPLAY SYSTEM (KDS)
  // =========================================================================
  function renderKDS() {
    els.kdsBoardContainer.innerHTML = '';

    const activeTickets = orders.filter(o => o.status !== 'served');
    els.kdsBadgeCount.textContent = activeTickets.length;
    els.navKdsBadge.textContent = activeTickets.length;
    els.navKdsBadge.style.display = activeTickets.length > 0 ? 'inline-block' : 'none';

    // Count badges
    const newCount = orders.filter(o => o.status === 'new').length;
    const prepCount = orders.filter(o => o.status === 'prep').length;
    const readyCount = orders.filter(o => o.status === 'ready').length;

    els.kdsFilterAll.textContent = activeTickets.length;
    els.kdsFilterNew.textContent = newCount;
    els.kdsFilterPrep.textContent = prepCount;
    els.kdsFilterReady.textContent = readyCount;
    els.kdsActiveTicketHeader.textContent = `KDS Station • ${activeTickets.length} Active Tickets`;

    const filtered = activeKdsFilter === 'all'
      ? activeTickets
      : activeTickets.filter(o => o.status === activeKdsFilter);

    if (filtered.length === 0) {
      els.kdsBoardContainer.innerHTML = `
        <div class="empty-kds">
          <span>👨‍🍳</span>
          <h3>All Kitchen Tickets Clear!</h3>
          <p>Orders sent from guest tables or server POS will appear here live.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(order => {
      const ticket = document.createElement('div');
      ticket.className = `kds-ticket status-${order.status}`;

      const mins = Math.floor(order.elapsedSeconds / 60);
      const secs = order.elapsedSeconds % 60;
      const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

      let timerClass = '';
      if (mins >= 10) timerClass = 'danger';
      else if (mins >= 5) timerClass = 'warning';

      let bumpBtnHtml = '';
      if (order.status === 'new') {
        bumpBtnHtml = `<button class="kds-bump-btn btn-prep" data-order="${order.id}">Start Prepping</button>`;
      } else if (order.status === 'prep') {
        bumpBtnHtml = `<button class="kds-bump-btn btn-ready" data-order="${order.id}">Mark Ready / Plated</button>`;
      } else if (order.status === 'ready') {
        bumpBtnHtml = `<button class="kds-bump-btn btn-served" data-order="${order.id}">Bump / Served</button>`;
      }

      ticket.innerHTML = `
        <div class="kds-ticket-header">
          <div>
            <span class="ticket-table-name">${order.tableName}</span>
            <span class="ticket-order-id">#${order.id} &bull; Svr: ${order.server}</span>
          </div>
          <span class="ticket-timer-badge ${timerClass}" id="timer_${order.id}">${timeStr}</span>
        </div>
        <div class="kds-ticket-items">
          ${order.items.map(item => `
            <div class="kds-item-row">
              <div class="kds-item-main">
                <span>${item.qty}x ${item.name}</span>
                <span class="kds-item-seat">${item.seat || 'Shared'}</span>
              </div>
              ${item.mods && item.mods.length ? `
                <div class="kds-mods-list">
                  ${item.mods.map(m => `<span class="kds-mod-tag ${m.startsWith('Note:') ? 'kds-note' : ''}">${m}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        <div class="kds-bump-bar">
          ${bumpBtnHtml}
        </div>
      `;

      // Handle Bump Bar Click
      const btn = ticket.querySelector('.kds-bump-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          bumpTicket(order.id);
        });
      }

      els.kdsBoardContainer.appendChild(ticket);
    });
  }

  function bumpTicket(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    audio.playClick();

    if (order.status === 'new') {
      order.status = 'prep';
      showNotification(`Ticket #${order.id} moved to IN PREPARATION`);
    } else if (order.status === 'prep') {
      order.status = 'ready';
      audio.playKitchenBell();
      showNotification(`Ticket #${order.id} is PLATED & READY FOR RUNNER!`);
    } else if (order.status === 'ready') {
      order.status = 'served';
      audio.playPaymentSuccess();
      showNotification(`Ticket #${order.id} marked DELIVERED to ${order.tableName}`);

      // Check if table can now be billed
      const table = tables.find(t => t.id === order.tableId);
      if (table && table.status === 'ordering') {
        table.status = 'billed';
      }
    }

    // Sync guest tracker
    updateTrackerProgress(order.status);
    renderKDS();
    renderTables();
    renderOpenChecks();
  }

  // Timer interval updates KDS timer tags every second
  function startOrderTimers() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      orders.forEach(order => {
        if (order.status !== 'served') {
          order.elapsedSeconds++;

          const badge = document.getElementById(`timer_${order.id}`);
          if (badge) {
            const mins = Math.floor(order.elapsedSeconds / 60);
            const secs = order.elapsedSeconds % 60;
            badge.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            if (mins >= 10) {
              badge.className = 'ticket-timer-badge danger';
            } else if (mins >= 5) {
              badge.className = 'ticket-timer-badge warning';
            }
          }

          // Also update dynamic island timer if current
          if (currentTable && order.tableId === currentTable.id) {
            const mins = Math.floor(order.elapsedSeconds / 60);
            const secs = order.elapsedSeconds % 60;
            els.islandTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            els.trackerTimerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          }
        }
      });
    }, 1000);
  }

  // =========================================================================
  // VIEW 4: INGREDIENT AVAILABILITY & 86 BOARD
  // =========================================================================
  function renderInventory() {
    els.inventoryListContainer.innerHTML = '';

    // Group by category
    const categories = {};
    Object.keys(inventory).forEach(key => {
      const item = inventory[key];
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      categories[item.category].push({ key, ...item });
    });

    let inStockCount = 0;
    let lowStockCount = 0;
    let count86 = 0;

    Object.keys(categories).forEach(cat => {
      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'inv-group';

      const title = document.createElement('h4');
      title.className = 'inv-group-title';
      title.textContent = cat;
      groupWrapper.appendChild(title);

      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'inv-cards-grid';

      categories[cat].forEach(ing => {
        if (ing.status === 'in-stock') inStockCount++;
        else if (ing.status === 'low-stock') lowStockCount++;
        else if (ing.status === '86') count86++;

        const card = document.createElement('div');
        card.className = `inv-card ${ing.status === '86' ? 'is-86' : ''}`;

        card.innerHTML = `
          <div class="inv-card-info">
            <span class="inv-card-name">${ing.name}</span>
            <span class="inv-card-linked">Used in: ${ing.linkedItems ? ing.linkedItems.join(', ') : 'Specialties'}</span>
          </div>
          <div class="inv-toggle-pills">
            <button class="inv-pill ${ing.status === 'in-stock' ? 'active in-stock' : ''}" data-key="${ing.key}" data-status="in-stock">In</button>
            <button class="inv-pill ${ing.status === 'low-stock' ? 'active low-stock' : ''}" data-key="${ing.key}" data-status="low-stock">Low</button>
            <button class="inv-pill ${ing.status === '86' ? 'active status-86' : ''}" data-key="${ing.key}" data-status="86">86'd</button>
          </div>
        `;

        card.querySelectorAll('.inv-pill').forEach(pill => {
          pill.addEventListener('click', (e) => {
            audio.playClick();
            const key = e.target.dataset.key;
            const newStatus = e.target.dataset.status;
            setIngredientStatus(key, newStatus);
          });
        });

        cardsGrid.appendChild(card);
      });

      groupWrapper.appendChild(cardsGrid);
      els.inventoryListContainer.appendChild(groupWrapper);
    });

    // Update Counts
    els.invInStockCount.textContent = inStockCount;
    els.invLowStockCount.textContent = lowStockCount;
    els.inv86Count.textContent = count86;

    els.inventory86Badge.textContent = count86;
    els.inventory86Badge.style.display = count86 > 0 ? 'inline-block' : 'none';
    els.nav86Badge.style.display = count86 > 0 ? 'inline-block' : 'none';
  }

  function setIngredientStatus(key, status) {
    if (!inventory[key]) return;
    inventory[key].status = status;

    renderInventory();
    renderMenu(getActiveCategory());
    updateStockAlerts();

    const ingName = inventory[key].name;
    if (status === '86') {
      showNotification(`🚨 86 ALERT: "${ingName}" is now marked OUT OF STOCK. Digital menu updated.`);
    } else {
      showNotification(`"${ingName}" status updated to ${status.toUpperCase()}`);
    }
  }

  function updateStockAlerts() {
    const outItems = Object.keys(inventory).filter(k => inventory[k].status === '86');
    if (outItems.length > 0) {
      const names = outItems.map(k => inventory[k].name).join(', ');
      els.globalStockAlert.style.display = 'flex';
      els.globalStockAlertMsg.textContent = `Unavailable today: ${names}`;
    } else {
      els.globalStockAlert.style.display = 'none';
    }
  }

  // =========================================================================
  // VIEW 2: SERVER HANDHELD POS & TABLE FLOOR PLAN
  // =========================================================================
  function renderTables() {
    els.tablesGridContainer.innerHTML = '';
    els.modalTablesGrid.innerHTML = '';

    let openChecksTotal = 0;

    tables.forEach(table => {
      if (table.status !== 'vacant') openChecksTotal++;

      // Floor Map Tile
      const tile = document.createElement('div');
      tile.className = `table-tile status-${table.status} ${currentTable && currentTable.id === table.id ? 'current' : ''}`;
      tile.innerHTML = `
        <span class="table-tile-num">${table.name}</span>
        <span class="table-tile-room">${table.zone}</span>
        <span class="table-tile-status">${table.status}</span>
        ${table.checkTotal > 0 ? `<span class="table-tile-bill">$${table.checkTotal.toFixed(2)}</span>` : ''}
      `;

      tile.addEventListener('click', () => {
        audio.playClick();
        selectTable(table.id);
      });

      els.tablesGridContainer.appendChild(tile);

      // Modal table button (for Table Selector Drawer)
      const modalBtn = document.createElement('button');
      modalBtn.className = `modal-table-btn ${currentTable && currentTable.id === table.id ? 'active' : ''}`;
      modalBtn.textContent = `${table.name} (${table.seats}p)`;
      modalBtn.addEventListener('click', () => {
        audio.playClick();
        selectTable(table.id);
        closeModal(els.tableSelectorBackdrop);
      });
      els.modalTablesGrid.appendChild(modalBtn);
    });

    els.openChecksCount.textContent = openChecksTotal;
    els.serverActiveOrdersBadge.textContent = openChecksTotal;
    els.serverActiveOrdersBadge.style.display = openChecksTotal > 0 ? 'inline-block' : 'none';
  }

  function selectTable(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    currentTable = table;
    els.currentTableLabel.textContent = `${table.name} \u2022 ${table.zone}`;
    els.cartDrawerTableLabel.textContent = `${table.name} \u2022 ${table.zone}`;
    els.posCheckoutTableNum.textContent = `${table.name} POS Terminal`;
    if (els.loginTableInput) {
      els.loginTableInput.value = `${table.name} (${table.zone})`;
    }

    // Highlight in tables grid
    document.querySelectorAll('.table-tile').forEach(t => t.classList.remove('current'));
    document.querySelectorAll('.modal-table-btn').forEach(b => b.classList.remove('active'));

    updateCartUI();
  }

  function renderOpenChecks() {
    els.openChecksContainer.innerHTML = '';
    const activeTables = tables.filter(t => t.status !== 'vacant' && t.checkTotal > 0);

    if (activeTables.length === 0) {
      els.openChecksContainer.innerHTML = `
        <div style="text-align: center; padding: 30px; color: var(--text-muted);">
          <span>🧾</span>
          <p>No open checks currently pending.</p>
        </div>
      `;
      return;
    }

    activeTables.forEach(t => {
      const card = document.createElement('div');
      card.className = 'check-card';
      card.innerHTML = `
        <div class="check-card-header">
          <strong>${t.name} &bull; ${t.zone}</strong>
          <span style="color: var(--dakota-gold); font-family: var(--font-mono); font-weight: 800;">
            $${t.checkTotal.toFixed(2)}
          </span>
        </div>
        <div style="font-size: 11px; color: var(--text-secondary);">
          Status: <strong style="text-transform: uppercase;">${t.status}</strong> &bull; Server: Sarah M.
        </div>
        <div class="check-card-actions">
          <button class="pill-btn" style="flex: 1;" data-table="${t.id}">Process Settle Check</button>
        </div>
      `;

      card.querySelector('button').addEventListener('click', () => {
        audio.playClick();
        selectTable(t.id);
        openCheckoutDrawer();
      });

      els.openChecksContainer.appendChild(card);
    });
  }

  // =========================================================================
  // VIEW 2 & 5: INTEGRATED POINT-OF-SALE (POS) CHECKOUT
  // =========================================================================
  function openCheckoutDrawer() {
    calculatePOSTotals();
    renderSplitDetails();
    updateTerminalPrompt();
    openModal(els.posCheckoutBackdrop);
  }

  function renderSplitDetails() {
    if (openCheckSplit === 'single') {
      els.splitDetailsBox.style.display = 'none';
      return;
    }

    els.splitDetailsBox.style.display = 'block';

    if (openCheckSplit === 'seat') {
      // Group items by seat
      const seats = {};
      activeCart.forEach(item => {
        const s = item.seat || 'Seat 1';
        if (!seats[s]) seats[s] = 0;
        seats[s] += (item.price * item.qty);
      });

      els.splitDetailsBox.innerHTML = `
        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px;">
          Seat Breakdown (${Object.keys(seats).length} Seats with orders):
        </div>
        ${Object.keys(seats).map(s => `
          <div style="display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0;">
            <span>${s}</span>
            <strong style="color: var(--dakota-gold); font-family: var(--font-mono);">$${seats[s].toFixed(2)}</strong>
          </div>
        `).join('')}
      `;
    } else if (openCheckSplit === 'equal') {
      const sub = currentTable ? currentTable.checkTotal : 40.00;
      els.splitDetailsBox.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px;">
          <div style="background: var(--bg-surface); padding: 6px; border-radius: 6px; text-align: center;">
            <small>2 Guests</small><br><strong style="color:var(--dakota-gold);">$${(sub / 2).toFixed(2)} ea</strong>
          </div>
          <div style="background: var(--bg-surface); padding: 6px; border-radius: 6px; text-align: center;">
            <small>3 Guests</small><br><strong style="color:var(--dakota-gold);">$${(sub / 3).toFixed(2)} ea</strong>
          </div>
          <div style="background: var(--bg-surface); padding: 6px; border-radius: 6px; text-align: center;">
            <small>4 Guests</small><br><strong style="color:var(--dakota-gold);">$${(sub / 4).toFixed(2)} ea</strong>
          </div>
        </div>
      `;
    }
  }

  function calculatePOSTotals() {
    let billBase = currentTable && currentTable.checkTotal > 0 ? currentTable.checkTotal : 45.00;

    const tip15 = billBase * 0.15;
    const tip18 = billBase * 0.18;
    const tip20 = billBase * 0.20;
    const tip25 = billBase * 0.25;

    els.tipAmt15.textContent = `$${tip15.toFixed(2)}`;
    els.tipAmt18.textContent = `$${tip18.toFixed(2)}`;
    els.tipAmt20.textContent = `$${tip20.toFixed(2)}`;
    els.tipAmt25.textContent = `$${tip25.toFixed(2)}`;

    const chosenTip = billBase * (selectedTipPercent / 100);
    const finalCharge = billBase + chosenTip;

    els.posDueAmount.textContent = `$${finalCharge.toFixed(2)}`;
    els.posChargeBtnTotal.textContent = `$${finalCharge.toFixed(2)}`;
  }

  function updateTerminalPrompt() {
    if (selectedPaymentMethod === 'nfc') {
      els.terminalPrompt.textContent = 'Hold Device Near Reader';
      els.terminalSubprompt.textContent = 'Ready for Apple Pay / Google Pay / Contactless';
    } else if (selectedPaymentMethod === 'chip') {
      els.terminalPrompt.textContent = 'Insert EMV Chip Card';
      els.terminalSubprompt.textContent = 'Follow On-Screen Prompts';
    } else {
      els.terminalPrompt.textContent = 'Cash Tender Floor Mode';
      els.terminalSubprompt.textContent = 'Collect Cash & Give Change';
    }
  }

  function processPOSPayment() {
    audio.playClick();

    // Show simulated terminal progress
    els.terminalPrompt.textContent = 'Authorizing with Bank...';
    els.terminalSubprompt.textContent = 'Please do not remove device';
    els.btnProcessPayment.disabled = true;

    setTimeout(() => {
      audio.playPaymentSuccess();
      els.terminalPrompt.textContent = 'APPROVED \u2713';
      els.terminalSubprompt.textContent = 'Authorization Code: APP-89421';
      els.btnProcessPayment.disabled = false;

      setTimeout(() => {
        closeModal(els.posCheckoutBackdrop);
        renderReceipt();
        openModal(els.receiptBackdrop);
      }, 700);
    }, 1200);
  }

  function renderReceipt() {
    const tableId = currentTable ? currentTable.id : 4;
    const subtotal = currentTable && currentTable.checkTotal > 0 ? currentTable.checkTotal : 42.50;
    const tax = subtotal * 0.065;
    const tip = subtotal * (selectedTipPercent / 100);
    const grandTotal = subtotal + tax + tip;
    const pts = Math.floor(grandTotal * 10);

    els.recTableNum.textContent = `#${tableId}`;
    const now = new Date();
    els.recDate.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    els.recTime.textContent = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    els.recOrderNum.textContent = `#DP-${100 + orders.length}`;
    els.recAuth.textContent = `APP-${Math.floor(10000 + Math.random() * 90000)}`;

    // Render receipt items
    els.recItemsList.innerHTML = '';
    const itemsToPrint = activeCart.length > 0 ? activeCart : [
      { name: 'The Huron Harvest Club', qty: 2, price: 16.50 },
      { name: 'Huron Tap Truffle Fries', qty: 1, price: 7.50 }
    ];

    itemsToPrint.forEach(item => {
      const row = document.createElement('div');
      row.className = 'rec-item-row';
      row.innerHTML = `
        <span>${item.qty}x ${item.name}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      `;
      els.recItemsList.appendChild(row);
    });

    els.recSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    els.recTax.textContent = `$${tax.toFixed(2)}`;
    els.recTip.textContent = `$${tip.toFixed(2)}`;
    els.recTotal.textContent = `$${grandTotal.toFixed(2)}`;
    els.recMethod.textContent = selectedPaymentMethod === 'nfc' ? 'Apple Pay (Mastercard ...4492)' : 'EMV Chip (Visa ...8912)';
    els.recPointsEarned.textContent = `+${pts} pts`;

    loyaltyUser.points += pts;
    els.loyaltyPtsBadge.textContent = loyaltyUser.points;
    els.loyaltyPtsDisplay.textContent = loyaltyUser.points;
    els.recNewBalance.textContent = `${loyaltyUser.points} pts`;
  }

  // =========================================================================
  // MODAL UTILITIES & CLOCK
  // =========================================================================
  function openModal(el) {
    el.classList.add('active');
  }

  function closeModal(el) {
    el.classList.remove('active');
  }

  function showNotification(msg) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#141a22';
    toast.style.color = '#fff';
    toast.style.border = '1px solid var(--dakota-gold)';
    toast.style.padding = '10px 18px';
    toast.style.borderRadius = '999px';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = '600';
    toast.style.zIndex = '9999';
    toast.style.boxShadow = '0 6px 20px rgba(0,0,0,0.6)';
    toast.style.animation = 'slideUp 0.2s ease';
    toast.textContent = msg;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function startClock() {
    const clock = document.getElementById('statusClock');
    if (!clock) return;
    function tick() {
      const d = new Date();
      let hrs = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      clock.textContent = `${hrs % 12 || 12}:${mins}`;
    }
    tick();
    setInterval(tick, 30000);
  }

  // Start app when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
