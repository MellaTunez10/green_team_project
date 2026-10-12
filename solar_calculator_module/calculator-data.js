/**
 * SunGrid Energy Nigeria - Solar Calculator Master Data & Constants
 * Engineered for Nigerian solar irradiation profiles and standard equipment tiers.
 */

const SOLAR_CONFIG = {
  // Peak Sun Hours (PSH) in Nigeria (Abuja average ~4.8 hours/day)
  PEAK_SUN_HOURS: 4.8,

  // Balance of System (BoS) loss factor (wiring, dust, heat, dust de-rating ~25%)
  SYSTEM_LOSS_FACTOR: 1.25,

  // Modern Tier-1 Monocrystalline Panel wattage
  DEFAULT_PANEL_WATTS: 550,

  // Lithium (LiFePO4) Battery Depth of Discharge & round-trip efficiency
  BATTERY_DOD: 0.8,
  BATTERY_EFFICIENCY: 0.9,

  // Inverter surge safety margin
  INVERTER_HEADROOM: 1.25,

  // Inverter sizes commonly available in Nigeria (kVA / kW)
  STANDARD_INVERTERS_KVA: [1.5, 2.5, 3.5, 5.0, 7.5, 10.0, 15.0, 20.0, 30.0],

  // Band A DisCo average tariff in Nigeria (~₦209/kWh reference)
  DEFAULT_TARIFF_PER_KWH: 209,

  // Approximate turnkey installation pricing brackets in Naira (₦) per kWp installed
  // Includes Tier-1 Tier panels, MPPT inverter, LiFePO4 batteries, mounting, protection gears & labor
  PRICE_PER_KWP_RANGE: {
    min: 850000,
    max: 1100000,
  },
};

// Preset catalog of common Nigerian household and business appliances
const DEFAULT_APPLIANCES = [
  {
    id: "led_bulb",
    name: "LED Bulbs / Lighting",
    watts: 15,
    defaultQty: 8,
    defaultHours: 6,
    icon: "icofont-light-bulb",
  },
  {
    id: "standing_fan",
    name: "Standing / Ceiling Fan",
    watts: 70,
    defaultQty: 3,
    defaultHours: 8,
    icon: "icofont-fan",
  },
  {
    id: "led_tv",
    name: 'LED Smart TV (43"–65")',
    watts: 120,
    defaultQty: 2,
    defaultHours: 6,
    icon: "icofont-monitor",
  },
  {
    id: "decoder",
    name: "Decoder / Wi-Fi Router",
    watts: 30,
    defaultQty: 2,
    defaultHours: 12,
    icon: "icofont-wifi-alt",
  },
  {
    id: "fridge_small",
    name: "Inverter Refrigerator",
    watts: 180,
    defaultQty: 1,
    defaultHours: 10,
    icon: "icofont-box",
  },
  {
    id: "freezer",
    name: "Deep Freezer (Chest)",
    watts: 250,
    defaultQty: 1,
    defaultHours: 8,
    icon: "icofont-box",
  },
  {
    id: "inverter_ac",
    name: "Inverter AC (1.0–1.5 HP)",
    watts: 1000,
    defaultQty: 0,
    defaultHours: 4,
    icon: "icofont-wind",
  },
  {
    id: "pumping_machine",
    name: "Water Pumping Machine (1 HP)",
    watts: 1100,
    defaultQty: 0,
    defaultHours: 1,
    icon: "icofont-water-drop",
  },
  {
    id: "laptop",
    name: "Laptops / Desktop PCs",
    watts: 80,
    defaultQty: 2,
    defaultHours: 6,
    icon: "icofont-laptop",
  },
  {
    id: "cctv",
    name: "CCTV Security System",
    watts: 60,
    defaultQty: 1,
    defaultHours: 24,
    icon: "icofont-video-cam",
  },
];

// Quick presets for users who prefer one-click defaults
const PRESET_PROFILES = {
  basic: {
    label: "Basic Household (Lights, Fans, TVs, Fridge)",
    items: [
      { id: "led_bulb", qty: 6, hours: 6 },
      { id: "standing_fan", qty: 2, hours: 8 },
      { id: "led_tv", qty: 1, hours: 5 },
      { id: "decoder", qty: 1, hours: 10 },
      { id: "fridge_small", qty: 1, hours: 10 },
    ],
  },
  medium: {
    label: "Standard 3-Bedroom Flat (+ Freezer & 1 Inverter AC)",
    items: [
      { id: "led_bulb", qty: 12, hours: 6 },
      { id: "standing_fan", qty: 4, hours: 8 },
      { id: "led_tv", qty: 2, hours: 6 },
      { id: "decoder", qty: 2, hours: 12 },
      { id: "freezer", qty: 1, hours: 8 },
      { id: "inverter_ac", qty: 1, hours: 4 },
      { id: "pumping_machine", qty: 1, hours: 1 },
    ],
  },
  commercial: {
    label: "Small Office / Business Hub",
    items: [
      { id: "led_bulb", qty: 16, hours: 9 },
      { id: "laptop", qty: 6, hours: 8 },
      { id: "decoder", qty: 2, hours: 10 },
      { id: "inverter_ac", qty: 2, hours: 6 },
      { id: "cctv", qty: 1, hours: 24 },
    ],
  },
};
