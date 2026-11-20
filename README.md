# Dakota Provisions — Mobile Culinary & POS Experience Prototype

A high-modern, fully functioning mobile application prototype built specifically for **Dakota Provisions** ([dakotaprovisions.com](https://dakotaprovisions.com)), honoring their Huron, South Dakota heritage, independent family farming cooperative (Dakota 44), GAP-certified vegetarian-fed poultry, and smokehouse artisanal proteins.

---

## 🌟 Key Functional Features

### 1. Digital Menu Customization
- **Dakota Provisions Culinary Offerings**:
  - *The Huron Harvest Club*: GAP-certified smoked turkey breast, thick-cut maple bacon, sharp white cheddar, artisan sourdough.
  - *Dakota 44 Smoked Pastrami Reuben*: House-cured turkey pastrami, sauerkraut, melted aged Swiss, grilled marble rye.
  - *Butcher Cut Turkey Tenderloin Platter*: Flame-charred medallions, roasted garlic Yukon mash, prairie greens.
  - *Smoky Poblano Turkey Sliders (3x)*: Slow-roasted pulled turkey, spicy poblano BBQ glaze, prairie slaw, brioche.
  - *Prairie Protein Power Bowl*: Citrus herb turkey slices, ancient quinoa/rice, sweet potato, avocado crema.
  - *Hickory Pit Smoked Turkey Drumstick*: Colossal slow-smoked drumstick, honey skillet cornbread.
  - *Dakota 44 Smash Turkey Burger*: Smashed butcher-grind patties, smoked gouda, crispy turkey bacon.
  - *Huron Tap Truffle Fries & Craft Cane Root Beer*.
- **Deep Customization Drawer**:
  - Bread choices, farm cheeses, protein preparation, add-on toppings with dynamic price calculation.
  - Seat assignment selector (**Seat 1**, **Seat 2**, **Seat 3**, **Shared**).
  - Special kitchen notes & allergy instructions.

### 2. Table-Side Ordering
- Interactive table selector across 12 restaurant tables (Smokehouse Room, Taproom Patio, Chef's Counter).
- Simulated **Table Stand QR Code Scanner** with active targeting laser and one-tap test scan.
- Seat-tagged cart management with subtotal, South Dakota state & local tax (6.5%), applied loyalty discounts, and points earned preview.
- **Dynamic Island Status**: Real-time prep timer expanding/collapsing at the top of the mobile screen.

### 3. Real-Time Kitchen Display System (KDS)
- Synchronized kitchen tickets board with real-time progression:
  - `NEW` → `IN PREPARATION` → `READY TO SERVE` → `DELIVERED / SERVED`
- Active ticket timers that shift color from Green to Warning Amber (>5m) to Blinking Red (>10m).
- Bump bar controls for kitchen expo and line cooks.
- Audio cues (kitchen bell and order chime) powered by Web Audio API.

### 4. Live Ingredient Availability & 86 Monitoring
- Dedicated inventory pantry tracking 16 key ingredients across Proteins, Bakery, Dairy, Produce, and Sauces.
- Toggling an ingredient to **86'd / Sold Out**:
  - Dynamically disables and flags menu items with an "86'd / Sold Out" badge overlay.
  - Immediately greys out and locks modifiers in the customization modal with "86'd" chips.
  - Triggers real-time alerts across the guest tableside view.
- "Restock All" one-tap reset.

### 5. Provisions Club Loyalty Rewards
- Interactive VIP Rewards Card for member Marcus Vance (Artisan Tier).
- Tier progress tracking toward Pitmaster status.
- Redeemable Perks:
  - *$5 Off Farmhouse Entrée* (150 pts)
  - *Free Smoked Turkey Sliders* (300 pts)
  - *Free Huron Craft Tap Beverage* (100 pts)
- Instant perk application that updates the checkout subtotal.

### 6. Integrated Handheld POS & Checkout
- **Floor Plan Management**: 12 tables displaying status (`Vacant`, `Seated`, `Kitchen Active`, `Payment Due`).
- **Split Check Engine**:
  - Single Check
  - Split by Seat (calculates exact seat subtotals)
  - Split Evenly (2, 3, or 4 equal ways)
- **Gratuity / Tip Calculator**: Quick percentage buttons (15%, 18%, 20%, 25%) with live dollar amounts.
- **Payment Terminal Simulation**:
  - Contactless NFC (Apple Pay / Google Pay) with pulsing wave animation.
  - EMV Chip Insert simulation.
  - Cash tender mode.
  - Bank authorization and approval flow with audible chime.
- **Digital Itemized Guest Receipt**:
  - Dakota Provisions Huron, SD branding and contact info.
  - Perforated thermal paper styling.
  - Itemized dishes, seat breakdowns, modifiers, tax, tip, and auth code.
  - Loyalty points earned and updated balance.
  - Print / Save Receipt button and table clearing action.

---

## 🚀 How to Run and Experience the Prototype

1. Navigate to the project directory:
   ```
   C:\Users\Osama\.gemini\antigravity\scratch\dakota-provisions-app
   ```
2. Double-click **`index.html`** or open it in any modern browser (Google Chrome, Microsoft Edge, Safari, Firefox).
3. Use the **Active Role** switcher at the top to toggle between:
   - 📱 **Guest Tableside**: Browse, customize, add to cart, and send orders.
   - 📲 **Server POS**: View floor plan, open checks, split bills, and process payments.
   - 🍳 **Kitchen KDS**: Watch incoming tickets, bump orders through prep stages.
   - 📦 **86 Inventory**: Toggle ingredient availability and watch menu options react in real time.
4. Toggle **Frame: ON / OFF** at the top right to switch between the mobile phone mockup and fullscreen responsive view.
