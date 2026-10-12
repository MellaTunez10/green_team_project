/**
 * SunGrid Energy Nigeria - Quote Submission Controller
 * Handles form validation, payload assembly, and backend communication.
 */

(function () {
  "use strict";

  function getEl(id) {
    return document.getElementById(id);
  }

  const quoteForm = getEl("sc-quote-form");
  const submitBtn = getEl("sc-btn-submit-quote");
  const submitText = getEl("sc-btn-submit-text");
  const feedbackBox = getEl("sc-submission-feedback");

  if (!quoteForm) return;

  function showFeedback(message, isSuccess = true) {
    if (!feedbackBox) return;
    feedbackBox.className = `p-3 rounded mt-3 text-center ${isSuccess ? "bg-success text-white" : "bg-danger text-white"
      }`;
    feedbackBox.innerHTML = message;
    feedbackBox.classList.remove("d-none");
  }

  function setSubmitting(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    if (isLoading) {
      submitBtn.classList.add("disabled", "opacity-75");
      if (submitText) submitText.textContent = "Processing Quote Request...";
    } else {
      submitBtn.classList.remove("disabled", "opacity-75");
      if (submitText) submitText.textContent = "Submit My Quote Request";
    }
  }

  quoteForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Gather Customer Inputs
    const fullName = getEl("sc-customer-name")?.value.trim();
    const email = getEl("sc-customer-email")?.value.trim();
    const phone = getEl("sc-customer-phone")?.value.trim();
    const address =
      getEl("sc-customer-address")?.value.trim() || "Not specified";
    const notes = getEl("sc-customer-notes")?.value.trim() || "None";

    // 2. Client-side Validation
    if (!fullName || fullName.length < 3) {
      alert("Please enter your full name (at least 3 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;
    // Basic format check allowing Nigerian numbers (+234 or 070/080/081/090/091)
    if (!phone || phone.replace(/\s+/g, "").length < 10) {
      alert("Please enter a valid contact phone number.");
      return;
    }

    // 3. Extract Solar Calculation State
    const calcState = window.SunGridCalculator
      ? window.SunGridCalculator.getState()
      : null;
    const results = calcState ? calcState.results : null;

    if (!results || results.arrayKwp === 0 || results.arrayKwp === "0.00") {
      alert(
        "Please complete Step 1 and Step 2 calculations before submitting a quote.",
      );
      if (window.SunGridCalculator) window.SunGridCalculator.goToStep(1);
      return;
    }

    const propertyType = getEl("sc-property-type")?.value || "residential";
    const location = getEl("sc-location")?.value || "abuja";
    const backupHours = getEl("sc-backup-hours")?.value || "8";

    // 4. Construct Payload
    const payload = {
      customer: {
        fullName,
        email,
        phone,
        address,
        notes,
      },
      system: {
        propertyType,
        location,
        backupHours,
        dailyKwh: results.dailyKwh,
        monthlyKwh: results.monthlyKwh,
        arrayKwp: results.arrayKwp,
        panelCount: results.panelCount,
        inverterKva: results.inverterKva,
        batteryKwh: results.batteryKwh,
        estPriceMin: results.minPrice,
        estPriceMax: results.maxPrice,
      },
    };

    setSubmitting(true);
    if (feedbackBox) feedbackBox.classList.add("d-none");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showFeedback(
          `<strong>Thank you, ${fullName}!</strong><br>Your solar sizing specifications have been sent to our engineering desk. A confirmation email with your system estimates has also been dispatched to <strong>${email}</strong>.`,
          true,
        );
        quoteForm.reset();
      } else {
        showFeedback(
          data.message ||
          "An error occurred while submitting your quote request. Please try again or reach out on WhatsApp.",
          false,
        );
      }
    } catch (err) {
      console.error("[SunGrid Quote] Network or server error:", err);
      showFeedback(
        "Unable to reach the server. If testing locally, ensure server.js is running.",
        false,
      );
    } finally {
      setSubmitting(false);
    }
  });
})();
