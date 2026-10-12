# SunGrid Energy Nigeria - Web Platform & Solar Sizing Engine

> **Project Name:** SunGrid Energy Nigeria Website  
> **Team:** Green Team  
> **Organization:** `Tech4Youth Abuja`  
> **Head Office:** Plot 1504, Cadzone B06, after the Ministry of Transportation, Mabushi, F.C.T., Abuja, Nigeria  
> **Contact:** +234 9076660060 | hello@sungrid.com  

---

## 🌟 Overview

**SunGrid Energy Nigeria** is a modern, responsive renewable energy web platform engineered for Nigerian households, businesses, and industrial facilities. The platform showcases turnkey solar installations, energy storage setups, Tier-1 hardware catalogs (Jinko, Canadian Solar, Astronergy, Growatt, LuxPower, Gennex), and features a proprietary **Solar Sizing Calculator & Quote Generator Module**.

---

## 👥 Green Team Members & Roles

| Member | Role | Specialization |
| :--- | :--- | :--- |
| **Ruth Amedu** | Managing Director | Executive Leadership & Strategic Vision |
| **Yusrah Yusuf** | Head of Operations | Project Execution & Supply Chain Logistics |
| **Igwe Uchenna** | Lead Solar Engineer | Solar PV System Design & Technical Architecture |
| **Gbenle Kamolideen Ajibola** | Solar Technical Specialist | Inverter Systems, Battery Sizing & Quality Verification |
| **David Igoche** | Project Manager | Client Delivery, Milestone Oversight & Site Coordination |
| **Chiemela Emmanuel** | Project & Quality Consultant | Standards Compliance, Performance Testing & Quality Assurance |

---

## 🚀 Key Features

1. **Brand & Design System**:
   - Built on a fresh **Sage Green & Warm Cream** design palette (`--primary-color: #718447`, `--accent-color: #536B2E`, `--background-color: #F1EBD7`).
   - Premium typography using Google Fonts **Inter Tight** (headings) and **Manrope** (body text).
   - Glassmorphism overlays, jarallax hero banners, micro-animations (`fx-slide`, `btn-main`, `btn-line`), and responsive counters.

2. **Solar Sizing Calculator Module (`solar_calculator_module/`)**:
   - **Step 1: Energy Estimation**:
     - *Appliance Sizing*: Calculates daily kWh by appliances (lighting, fans, TVs, ACs, freezers, pumps) with quick load presets.
     - *NEPA / DisCo Bill Estimation*: Computes daily load directly from monthly electricity bills using Band A tariffs (~₦209/kWh).
     - *Battery Backup Duration*: Configurable from 4 to 24 hours of autonomous runtime.
   - **Step 2: Recommended Sizing & Instant Pricing**:
     - Solar PV array (kWp) & 550W Tier-1 panel count.
     - Pure sine wave inverter rating (kVA).
     - LiFePO4 Lithium battery capacity (kWh).
     - Estimated turnkey investment bracket (₦ Naira) with responsive, non-overflowing layouts.
   - **Step 3: Engineering Quote Submission**:
     - Complete customer profile and site capture.
     - Resend API email integration ready.

3. **Interactive Google Map Integration**:
   - Fully responsive location map embedded on the Contact page targeting **Plot 1504, Mabushi, F.C.T., Abuja**.

4. **100% Multi-Device Responsive**:
   - Optimized for large desktops, laptops, tablets, foldables, and mobile smartphones.
   - Mobile touch targets, flexible input grids, and responsive navbar drawers.

---

## 📁 Repository Structure

```text
green_team_project/
├── index.html                   # Home page with hero, statistics, services & video showcase
├── about.html                   # About Us page, Green Team profiles & company mission
├── services.html                # Comprehensive renewable energy services overview
├── service-single.html          # Individual service details & specifications
├── product.html                 # Tier-1 solar panels, inverters, batteries & accessories catalog
├── project-single.html          # Case studies and landed project portfolio
├── contact.html                 # Contact form, direct hotline & Mabushi Google Map embed
├── solar_calculator_module/     # Self-contained solar sizing engine
│   ├── calculator-page.html     # Standalone full calculator page matching site header/footer
│   ├── calculator-markup.html   # Embeddable component HTML markup
│   ├── calculator.css           # Modular scoped CSS (Sage Green & Cream theme)
│   ├── calculator-data.js       # Nigerian PSH irradiance, inverter tiers & appliance catalog
│   ├── calculator.js           # Core sizing algorithms, appliance state & 3-step wizard
│   ├── calculator-quote.js      # Quote submission logic & Resend API dispatch
│   └── README.md                # Calculator integration guide & formulas
├── css/                         # Site stylesheets (Bootstrap, plugins, style.css, scheme-1.css)
├── js/                          # Site scripts (designesia.js, plugins, swiper, animations)
├── fonts/                       # Icon fonts (FontAwesome 6, Elegant Icons, IcoFont)
├── images/                      # Optimized image assets, logos, and team pictures
└── README.md                    # Project documentation
```

---

## 🛠️ Technology Stack

- **Markup & Structure**: Semantic HTML5 with accessibility attributes and SEO meta tags.
- **Styling**: Vanilla CSS3, CSS Custom Properties (Variables), Bootstrap 5 Grid System, Swiper CSS.
- **Interactivity**: Vanilla JavaScript (ES6+), Designesia UI engine, Jarallax, Swiper.js, WOW.js.
- **Icons**: FontAwesome 6, IcoFont, Elegant Font icons.
- **External Services**: Google Maps Embed API, Resend Email API.

---

## 💻 How to Run Locally

Because this is a static web application with client-side JavaScript, no complex build tools or database installations are required.

### Option 1: Direct File Access
Double-click `index.html` or open any `.html` file directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures all module scripts, Google Maps embeds, and video backgrounds load without CORS restrictions:

**Using VS Code Live Server:**
1. Open the project folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

**Using Python:**
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using Node.js (`npx serve`):**
```bash
npx serve .
```

---

## ⚙️ Sizing & Engineering Constants (Nigeria Profile)

* **Peak Sun Hours (PSH):** 4.8 hours/day (Abuja & Central Nigeria average).
* **System Loss Factor:** 1.25 (25% balance of system derating for heat, dust, and cabling).
* **Tier-1 Panel Unit:** 550W Monocrystalline.
* **Standard Inverters:** 1.5, 2.5, 3.5, 5.0, 7.5, 10.0, 15.0, 20.0, 30.0 kVA.
* **Storage Chemistry:** Lithium Iron Phosphate (LiFePO4) at 80% Depth of Discharge & 90% round-trip efficiency.
* **Average Reference Tariff:** Band A DisCo benchmark (~₦209/kWh).

---

## 📄 License & Attribution

&copy; 2026 **SunGrid Energy Nigeria**. Developed and maintained by the **Green Team**. All rights reserved.
