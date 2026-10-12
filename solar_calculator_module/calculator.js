/**
 * SunGrid Energy Nigeria - Solar Calculator Controller
 * Production-ready, resilient vanilla JavaScript implementation.
 */

(function () {
  "use strict";

  // 1. Universal DOM helper at top of scope
  function getEl(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`[SunGrid Calculator] Element #${id} not found in DOM.`);
    }
    return el;
  }

  // 2. State container
  const state = {
    currentStep: 1,
    calculationMode: "appliances",
    results: {
      dailyKwh: "0.00",
      monthlyKwh: "0.0",
      arrayKwp: "0.00",
      panelCount: 0,
      inverterKva: 0,
      batteryKwh: "0.0",
      minPrice: 0,
      maxPrice: 0,
    },
  };

  // 3. Render Appliance Rows
  function renderAppliances() {
    const list = getEl("sc-appliances-list");
    if (!list) return;

    if (
      typeof DEFAULT_APPLIANCES === "undefined" ||
      !Array.isArray(DEFAULT_APPLIANCES)
    ) {
      console.error(
        "[SunGrid Calculator] DEFAULT_APPLIANCES is not loaded. Ensure calculator-data.js is linked first.",
      );
      return;
    }

    list.innerHTML = DEFAULT_APPLIANCES.map(
      (app) => `
      <div class="sc-appliance-item" data-id="${app.id}">
        <div class="d-flex align-items-center">
          <i class="${app.icon || "icofont-flash"} fs-4 me-3" style="color: var(--sc-primary, #718447);"></i>
          <div>
            <div class="fw-bold" style="color: var(--sc-text-title, #263517); font-size: 1.02rem;">${app.name}</div>
            <small style="color: var(--sc-text-muted, #667052); font-weight: 500;">${app.watts}W each</small>
          </div>
        </div>
        <div>
          <label class="d-block d-md-none text-muted small mb-1">Quantity</label>
          <input 
            type="number" 
            class="sc-input sc-app-qty" 
            value="${app.defaultQty}" 
            min="0" 
            max="100" 
            data-id="${app.id}" 
            data-watts="${app.watts}"
          />
        </div>
        <div>
          <label class="d-block d-md-none text-muted small mb-1">Watts</label>
          <input 
            type="number" 
            class="sc-input sc-app-watts" 
            value="${app.watts}" 
            min="1" 
            data-id="${app.id}"
          />
        </div>
        <div>
          <label class="d-block d-md-none text-muted small mb-1">Hours / Day</label>
          <input 
            type="number" 
            class="sc-input sc-app-hours" 
            value="${app.defaultHours}" 
            min="0.5" 
            max="24" 
            step="0.5" 
            data-id="${app.id}"
          />
        </div>
      </div>
    `,
    ).join("");
  }

  // 4. Preset Population
  function applyPreset(presetKey) {
    if (typeof PRESET_PROFILES === "undefined" || !PRESET_PROFILES[presetKey])
      return;
    const preset = PRESET_PROFILES[presetKey];

    document
      .querySelectorAll("#sc-appliances-list .sc-app-qty")
      .forEach((input) => (input.value = 0));

    preset.items.forEach((item) => {
      const qtyInput = document.querySelector(
        `#sc-appliances-list .sc-app-qty[data-id="${item.id}"]`,
      );
      const hoursInput = document.querySelector(
        `#sc-appliances-list .sc-app-hours[data-id="${item.id}"]`,
      );
      if (qtyInput) qtyInput.value = item.qty;
      if (hoursInput) hoursInput.value = item.hours;
    });
  }

  // 5. Tab Switching
  function setMode(mode) {
    state.calculationMode = mode;
    const tabAppliances = getEl("sc-tab-btn-appliances");
    const tabBill = getEl("sc-tab-btn-bill");
    const modeAppliances = getEl("sc-mode-appliances");
    const modeBill = getEl("sc-mode-bill");

    if (mode === "appliances") {
      if (tabAppliances) tabAppliances.classList.add("active");
      if (tabBill) tabBill.classList.remove("active");
      if (modeAppliances) modeAppliances.classList.remove("d-none");
      if (modeBill) modeBill.classList.add("d-none");
    } else {
      if (tabBill) tabBill.classList.add("active");
      if (tabAppliances) tabAppliances.classList.remove("active");
      if (modeBill) modeBill.classList.remove("d-none");
      if (modeAppliances) modeAppliances.classList.add("d-none");
    }
  }

  // 6. Navigation Wizard
  function goToStep(stepNumber) {
    state.currentStep = stepNumber;

    const s1 = getEl("sc-step-1");
    const s2 = getEl("sc-step-2");
    const s3 = getEl("sc-step-3");

    if (s1) s1.classList.toggle("d-none", stepNumber !== 1);
    if (s2) s2.classList.toggle("d-none", stepNumber !== 2);
    if (s3) s3.classList.toggle("d-none", stepNumber !== 3);

    const dots = [
      getEl("sc-step-dot-1"),
      getEl("sc-step-dot-2"),
      getEl("sc-step-dot-3"),
    ];
    dots.forEach((dot, index) => {
      if (!dot) return;
      const stepIdx = index + 1;
      dot.classList.remove("active", "completed");
      if (stepIdx === stepNumber) {
        dot.classList.add("active");
      } else if (stepIdx < stepNumber) {
        dot.classList.add("completed");
      }
    });

    const card = document.querySelector(".sc-card");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // 7. Calculations Engine
  function performCalculations() {
    let dailyWattHours = 0;
    let peakRunningWatts = 0;

    if (state.calculationMode === "appliances") {
      const items = document.querySelectorAll(
        "#sc-appliances-list .sc-appliance-item",
      );
      if (!items || items.length === 0) {
        alert("Appliance catalog is not loaded. Please refresh the page.");
        return false;
      }

      items.forEach((item) => {
        const qtyEl = item.querySelector(".sc-app-qty");
        const wattsEl = item.querySelector(".sc-app-watts");
        const hoursEl = item.querySelector(".sc-app-hours");

        const qty = qtyEl ? parseFloat(qtyEl.value) || 0 : 0;
        const watts = wattsEl ? parseFloat(wattsEl.value) || 0 : 0;
        const hours = hoursEl ? parseFloat(hoursEl.value) || 0 : 0;

        if (qty > 0 && watts > 0 && hours > 0) {
          const totalLoad = qty * watts;
          dailyWattHours += totalLoad * hours;
          peakRunningWatts += totalLoad * 0.7;
        }
      });

      if (dailyWattHours <= 0) {
        alert(
          "Please enter a quantity greater than 0 for at least one appliance.",
        );
        return false;
      }
    } else {
      const billInput = getEl("sc-monthly-bill");
      const monthlyBill = parseFloat(billInput ? billInput.value : 0) || 0;
      if (monthlyBill < 5000) {
        alert("Please enter an average monthly bill of at least ₦5,000.");
        return false;
      }
      const tariff =
        (window.SOLAR_CONFIG && window.SOLAR_CONFIG.DEFAULT_TARIFF_PER_KWH) ||
        209;
      const monthlyKwh = monthlyBill / tariff;
      dailyWattHours = (monthlyKwh / 30) * 1000;
      peakRunningWatts = (dailyWattHours / 12) * 1.5;
    }

    const cfg = window.SOLAR_CONFIG || {
      PEAK_SUN_HOURS: 4.8,
      SYSTEM_LOSS_FACTOR: 1.25,
      DEFAULT_PANEL_WATTS: 550,
      BATTERY_DOD: 0.8,
      BATTERY_EFFICIENCY: 0.9,
      INVERTER_HEADROOM: 1.25,
      STANDARD_INVERTERS_KVA: [1.5, 2.5, 3.5, 5.0, 7.5, 10.0, 15.0, 20.0],
      PRICE_PER_KWP_RANGE: { min: 850000, max: 1100000 },
    };

    const dailyKwh = dailyWattHours / 1000;
    const monthlyKwh = dailyKwh * 30;

    // Solar PV Array
    const requiredDailyGenKwh = dailyKwh * cfg.SYSTEM_LOSS_FACTOR;
    const arrayKwp = requiredDailyGenKwh / cfg.PEAK_SUN_HOURS;
    const panelCount = Math.max(
      Math.ceil((arrayKwp * 1000) / cfg.DEFAULT_PANEL_WATTS),
      2,
    );

    // Inverter Sizing
    const reqInverterVa = peakRunningWatts * cfg.INVERTER_HEADROOM;
    const inverterKvaFloat = reqInverterVa / 1000;
    let inverterKva =
      cfg.STANDARD_INVERTERS_KVA[cfg.STANDARD_INVERTERS_KVA.length - 1];
    for (let i = 0; i < cfg.STANDARD_INVERTERS_KVA.length; i++) {
      if (cfg.STANDARD_INVERTERS_KVA[i] >= inverterKvaFloat) {
        inverterKva = cfg.STANDARD_INVERTERS_KVA[i];
        break;
      }
    }

    // Battery Capacity
    const backupHoursInput = getEl("sc-backup-hours");
    const backupHours =
      parseFloat(backupHoursInput ? backupHoursInput.value : 8) || 8;
    const neededBackupKwh = (dailyKwh / 24) * backupHours;
    const batteryKwh =
      neededBackupKwh / (cfg.BATTERY_EFFICIENCY * cfg.BATTERY_DOD);

    // Price brackets in Naira
    const minPrice = Math.round(arrayKwp * cfg.PRICE_PER_KWP_RANGE.min);
    const maxPrice = Math.round(arrayKwp * cfg.PRICE_PER_KWP_RANGE.max);

    state.results = {
      dailyKwh: dailyKwh.toFixed(2),
      monthlyKwh: monthlyKwh.toFixed(1),
      arrayKwp: arrayKwp.toFixed(2),
      panelCount: panelCount,
      inverterKva: inverterKva,
      batteryKwh: batteryKwh.toFixed(1),
      minPrice: minPrice,
      maxPrice: maxPrice,
    };

    updateResultsUI();
    return true;
  }

  function formatNaira(amt) {
    return "₦" + Number(amt).toLocaleString("en-NG");
  }

  // 8. Update UI Elements
  function updateResultsUI() {
    const res = state.results;
    const cfg = window.SOLAR_CONFIG || { DEFAULT_PANEL_WATTS: 550 };

    const elDaily = getEl("sc-res-daily-kwh");
    const elMonthly = getEl("sc-res-monthly-kwh");
    const elArray = getEl("sc-res-array-kwp");
    const elPanels = getEl("sc-res-panels-count");
    const elInverter = getEl("sc-res-inverter-kva");
    const elBattery = getEl("sc-res-battery-kwh");
    const elPrice = getEl("sc-res-price-range");
    const elSnippet = getEl("sc-summary-snippet");

    if (elDaily)
      elDaily.innerHTML = `${res.dailyKwh} <span style="font-size: 1rem;">kWh/day</span>`;
    if (elMonthly)
      elMonthly.textContent = `Approx. ${res.monthlyKwh} kWh / month`;
    if (elArray)
      elArray.innerHTML = `${res.arrayKwp} <span style="font-size: 1rem;">kWp</span>`;
    if (elPanels)
      elPanels.textContent = `${res.panelCount} × ${cfg.DEFAULT_PANEL_WATTS}W Mono Panels`;
    if (elInverter)
      elInverter.innerHTML = `${res.inverterKva} <span style="font-size: 1rem;">kVA</span>`;
    if (elBattery)
      elBattery.textContent = `Storage: ${res.batteryKwh} kWh (LiFePO4)`;
    if (elPrice)
      elPrice.textContent = `${formatNaira(res.minPrice)} – ${formatNaira(res.maxPrice)}`;
    if (elSnippet) {
      elSnippet.textContent = `${res.arrayKwp} kWp Solar Array (${res.panelCount} panels) | ${res.inverterKva} kVA Inverter | ${res.batteryKwh} kWh Battery`;
    }
  }

  // 9. Bind Events
  function bindEvents() {
    const tabAppliances = getEl("sc-tab-btn-appliances");
    const tabBill = getEl("sc-tab-btn-bill");
    const quickPreset = getEl("sc-quick-preset");
    const btnCalc = getEl("sc-btn-calculate");
    const btnBack1 = getEl("sc-btn-back-1");
    const btnProceedQuote = getEl("sc-btn-proceed-quote");
    const btnBack2 = getEl("sc-btn-back-2");

    if (tabAppliances)
      tabAppliances.addEventListener("click", () => setMode("appliances"));
    if (tabBill) tabBill.addEventListener("click", () => setMode("bill"));

    if (quickPreset) {
      quickPreset.addEventListener("change", (e) => {
        if (e.target.value) applyPreset(e.target.value);
      });
    }

    if (btnCalc) {
      btnCalc.addEventListener("click", function (e) {
        e.preventDefault();
        const success = performCalculations();
        if (success) {
          goToStep(2);
        }
      });
    }

    if (btnBack1) btnBack1.addEventListener("click", () => goToStep(1));
    if (btnProceedQuote)
      btnProceedQuote.addEventListener("click", () => goToStep(3));
    if (btnBack2) btnBack2.addEventListener("click", () => goToStep(2));
  }

  function init() {
    renderAppliances();
    bindEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose global accessor for quote form submission
  window.SunGridCalculator = {
    getState: () => state,
    goToStep: goToStep,
  };
})();
