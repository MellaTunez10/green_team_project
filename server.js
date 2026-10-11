/**
 * SunGrid Energy Nigeria - Application Server
 * Serves static assets and provides production email dispatch for quotes.
 */

require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || "");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, ".")));

// Currency Formatter Helper
function formatNaira(num) {
  return "₦" + Number(num).toLocaleString("en-NG");
}

// POST /api/quote Endpoint
app.post("/api/quote", async (req, res) => {
  try {
    const { customer, system } = req.body;

    // Server-side validation
    if (!customer || !customer.fullName || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required customer details (Name, Email, or Phone).",
      });
    }

    if (!system || !system.arrayKwp) {
      return res.status(400).json({
        success: false,
        message: "Invalid solar system configuration.",
      });
    }

    console.log(
      `[Quote Request] Received from ${customer.fullName} (${customer.email})`,
    );

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn(
        "[Warning] RESEND_API_KEY is not set. Simulating email dispatch for development mode.",
      );
      return res.status(200).json({
        success: true,
        message:
          "Quote received successfully (Development Mode: API key not configured yet).",
      });
    }

    const businessEmail =
      process.env.BUSINESS_EMAIL || "hello@sungridenergy.ng";

    // 1. Send Email to Solar Company Engineers
    await resend.emails.send({
      from: "SunGrid Quotes <onboarding@resend.dev>", // Resend sandbox test sender
      to: [businessEmail],
      subject: `New Solar Quote Request - ${customer.fullName} (${system.arrayKwp} kWp)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #83b735;">New Solar Engineering Quote Lead</h2>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <h3>Customer Information:</h3>
          <p><strong>Name:</strong> ${customer.fullName}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>Phone:</strong> ${customer.phone}</p>
          <p><strong>Location:</strong> ${system.location} (${customer.address})</p>
          <p><strong>Property Type:</strong> ${system.propertyType}</p>
          <p><strong>Notes:</strong> ${customer.notes}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <h3>Calculated System Specifications:</h3>
          <ul>
            <li><strong>Daily Consumption:</strong> ${system.dailyKwh} kWh/day (${system.monthlyKwh} kWh/month)</li>
            <li><strong>Recommended Solar Array:</strong> ${system.arrayKwp} kWp (${system.panelCount} × 550W Panels)</li>
            <li><strong>Inverter Sizing:</strong> ${system.inverterKva} kVA</li>
            <li><strong>Battery Storage:</strong> ${system.batteryKwh} kWh (LiFePO4)</li>
            <li><strong>Backup Target:</strong> ${system.backupHours} Hours</li>
            <li><strong>Estimated Turnkey Range:</strong> ${formatNaira(system.estPriceMin)} – ${formatNaira(system.estPriceMax)}</li>
          </ul>
        </div>
      `,
    });

    // 2. Send Confirmation Email to Customer
    await resend.emails.send({
      from: "SunGrid Energy <onboarding@resend.dev>",
      to: [customer.email],
      subject: `Your SunGrid Solar Estimate & System Sizing (${system.arrayKwp} kWp)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #83b735;">Thank you for consulting SunGrid Energy Nigeria!</h2>
          <p>Hello ${customer.fullName},</p>
          <p>We have received your solar energy assessment. Here is an overview of your recommended configuration:</p>
          <div style="background-color: #f7f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p><strong>Solar Panel Capacity:</strong> ${system.arrayKwp} kWp (${system.panelCount} panels)</p>
            <p><strong>Recommended Inverter:</strong> ${system.inverterKva} kVA</p>
            <p><strong>Battery Storage:</strong> ${system.batteryKwh} kWh Lithium (LiFePO4)</p>
            <p><strong>Estimated Investment Range:</strong> ${formatNaira(system.estPriceMin)} – ${formatNaira(system.estPriceMax)}</p>
          </div>
          <p>An engineer from our Abuja office will contact you shortly via phone or WhatsApp at <strong>${customer.phone}</strong> to schedule a physical or drone roof assessment.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">SunGrid Energy Nigeria &bull; Abuja, FCT &bull; +234 800 000 0000</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Quote request submitted and confirmation email sent.",
    });
  } catch (error) {
    console.error("[Server Error / Resend Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while dispatching email.",
    });
  }
});

// Fallback middleware for unhandled routes
app.use((req, res) => {
  const requestedFile =
    req.path === "/" ? "index.html" : req.path.replace(/^\//, "");
  const filePath = path.join(__dirname, requestedFile);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, "index.html"));
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[SunGrid Server] Running at http://localhost:${PORT}`);
});
