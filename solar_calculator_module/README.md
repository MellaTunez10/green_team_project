# SunGrid Solar Sizing Calculator & Get-Quote Module

A self-contained, standalone module for solar energy sizing calculations, equipment estimations, and instant quote generation for Nigerian residential and commercial installations.

Fully integrated with the **SunGrid Energy Nigeria** design system (`css/style.css`, `css/colors/scheme-1.css`, and `about.html` header/footer layout).

---

## 📁 Module Contents

| File | Purpose |
| :--- | :--- |
| `calculator-page.html` | **Full, standalone page** featuring the exact header, topbar, hero subheader, and footer from `about.html`. |
| `calculator.css` | Scoped styling system using SunGrid's sage green color variables (`--primary-color: #718447`, `#536B2E`, `#35451F`). |
| `calculator-markup.html` | Modular HTML component ready to embed in existing pages (`services.html`, `product.html`, `index.html`, etc.). |
| `calculator-data.js` | Sizing constants (peak sun hours, derating, battery efficiency), standard Nigerian inverter tiers, DisCo tariffs, and appliance catalog. |
| `calculator.js` | Core sizing algorithms, appliance & bill computation, 3-step wizard workflow, and result bindings. |
| `calculator-quote.js` | Form validation, customer payload construction, state bundling, and quote submission handling. |

---

## 🌐 Quick Test

Open `calculator-page.html` in your browser. It includes:
1. **Header & Topbar**: Mabushi F.C.T. Abuja location, phone `+234 9076660060`, `hello@sungrid.com`, and logo.
2. **Hero Subheader**: Background image with breadcrumbs, stats badges, and action buttons.
3. **Interactive 3-Step Calculator**: Appliance calculation / NEPA bill estimation, solar kWp sizing, battery kWh storage, and instant quote request form.
4. **Footer & Drawer Menu**: 4-column SunGrid footer, subfooter copyright, and slide-out sidebar drawer identical to `about.html`.

---

## 🚀 How to Embed in Any Existing Page

### 1. Include the Stylesheet (In the `<head>` section)
```html
<link rel="stylesheet" href="solar_calculator_module/calculator.css">
```

### 2. Paste the Markup (Inside your page body)
Copy the contents of `calculator-markup.html` into your desired section:
```html
<section id="calculator-section" class="bg-dark text-light">
  <div class="container">
    <!-- Paste contents of calculator-markup.html here -->
  </div>
</section>
```

### 3. Load the Scripts (At the bottom of `<body>` before closing tag)
```html
<script src="solar_calculator_module/calculator-data.js"></script>
<script src="solar_calculator_module/calculator.js"></script>
<script src="solar_calculator_module/calculator-quote.js"></script>
```

---

## 🧮 Core Engineering Formulas

### 1. Energy Consumption ($\text{kWh/day}$)
* **By Appliances:**
  $$\text{Daily kWh} = \sum \frac{\text{Quantity} \times \text{Watts} \times \text{Hours/Day}}{1000}$$
* **By Monthly NEPA / DisCo Bill:**
  $$\text{Estimated Daily kWh} = \frac{\text{Monthly Bill in } \unicode{x20A6}}{\text{Tariff per kWh } (\approx \unicode{x20A6}209)} \div 30$$

### 2. Solar PV Array Size ($\text{kWp}$)
$$\text{Array kWp} = \frac{\text{Daily kWh} \times 1.25 \text{ (System Loss Factor)}}{4.8 \text{ Peak Sun Hours}}$$
$$\text{Panels Count} = \left\lceil \frac{\text{Array kWp} \times 1000}{550\text{W}} \right\rceil$$

### 3. Inverter Sizing ($\text{kVA}$)
$$\text{Required kW} = \frac{\text{Running Load Watts} \times 0.75 \text{ Diversity} \times 1.25 \text{ Surge Margin}}{1000}$$
*Standard Nigerian inverter steps:* `1.5, 2.5, 3.5, 5.0, 7.5, 10.0, 15.0, 20.0, 30.0 kVA`.

### 4. Battery Storage ($\text{kWh}$ for LiFePO4 Lithium)
$$\text{Storage kWh} = \frac{\text{Daily kWh} \times (\text{Backup Hours} / 24)}{0.80 \text{ (DoD)} \times 0.90 \text{ (Efficiency)}}$$

### 5. Turnkey Investment Estimate ($\unicode{x20A6}$ Naira)
* **Minimum:** $\text{Array kWp} \times \unicode{x20A6}850,000$
* **Maximum:** $\text{Array kWp} \times \unicode{x20A6}1,100,000$
