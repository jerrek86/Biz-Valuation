/*
 * ─────────────────────────────────────────────────────────────
 *  PER-ADVISOR SETTINGS
 *  This is the only file you edit for each licensed advisor.
 *  See SETUP.md for the full walkthrough.
 * ─────────────────────────────────────────────────────────────
 */
window.BIZVAL_CONFIG = {
  // ── Branding ──
  firmName: "Your Firm Name",
  advisorName: "Your Advisor",          // shown in header, report, and call-to-action
  // advisorFirst: "Sam",               // optional; defaults to the first word of advisorName
  phone: "(555) 555-0100",
  email: "advisor@example.com",         // used for the "Schedule" button if no bookingUrl
  logoUrl: "",                          // e.g. "logo.png" (light/white logo on dark header). Blank = firm name as text
  primaryColor: "#5b5bd6",              // accent color (hex) — pick something distinct per advisor

  // ── Lead handling ──
  bookingUrl: "",                       // Calendly / scheduling link for the "Schedule My Review" button
  leadWebhookUrl: "",                   // Google Apps Script web app URL (see SETUP.md). Blank = leads are NOT saved

  // ── Compliance ──
  privacyUrl: "",                       // link to the firm's privacy policy (strongly recommended)
  termsUrl: "",
  consentText: "",                      // blank = default contact-consent wording; replace with compliance-approved text
  disclosure: "This tool provides an estimate for educational purposes only and is not a formal business appraisal, " +
              "tax, or legal advice. Securities and advisory services are offered through [firm/broker-dealer disclosure].",

  // ── Ad tracking (optional) ──
  ga4Id: "",                            // e.g. "G-XXXXXXXXXX"
  metaPixelId: "",                      // e.g. "123456789012345"

  // ── Valuation multiples (optional) ──
  // Override any industry's [low, mid, high] multiple of adjusted EBITDA.
  // The built-in defaults are illustrative — replace with sourced figures before going live.
  // industryMultiples: { dental: [5, 6.5, 8.5], hvac: [3.5, 4.5, 6] },
  industryMultiples: null
};
