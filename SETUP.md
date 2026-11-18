# Business Valuation Lead Magnet — Advisor Setup

Each licensed advisor gets their own copy of this folder. You change **one file
(`config.js`)** and connect **one Google Sheet**. Nothing else needs editing.

```
index.html            the tool (same for every advisor)
config.js             the advisor's branding, contact info, lead destination, tracking
apps-script/Code.gs   paste into the advisor's Google Sheet to receive leads
```

---

## 1. Create the lead sheet (about 5 minutes)

1. Create a new Google Sheet (in your account or the advisor's), e.g. "Valuation Leads – Dana Reyes".
2. **Extensions → Apps Script**. Delete the starter code and paste in all of `apps-script/Code.gs`.
3. At the top of the script, set `NOTIFY_EMAIL` to the advisor's email (several addresses can be comma-separated).
   Set `NOTIFY_ON_START = true` if they also want an email when someone gives contact info but doesn't finish.
4. Click **Save**, choose `testLead` in the function dropdown and click **Run**. Approve the permissions prompt.
   A `Leads` tab should appear with a test row, and the notification email should arrive.
5. **Deploy → New deployment →** type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the **Web app URL** (ends in `/exec`).

> If you edit the script later, use **Deploy → Manage deployments → Edit → New version**, so the
> `/exec` URL stays the same.

## 2. Fill in `config.js`

| Setting | What it does |
|---|---|
| `firmName`, `advisorName`, `phone`, `email` | Shown in the header, report, and call-to-action |
| `logoUrl` | Put the logo file in the folder and enter its name (e.g. `logo.png`). The header is dark, so use a white/light logo. Leave blank to show the firm name as text. |
| `primaryColor` | Brand accent color (hex) |
| `bookingUrl` | Calendly or other scheduling link for the "Schedule My Review" button. If blank, the button opens a pre-filled email to `email`. |
| `leadWebhookUrl` | The `/exec` URL from step 1. **If blank, no leads are saved.** |
| `privacyUrl`, `termsUrl` | The firm's policies, linked in the consent line and footer |
| `consentText` | Replace with the firm's compliance-approved contact-consent wording |
| `disclosure` | The firm's required disclosure, shown in the footer and on the report |
| `ga4Id`, `metaPixelId` | Optional ad tracking (see below) |
| `industryMultiples` | Optional: override the valuation multiples per industry |

## 3. Publish

The folder is a static website with no server. Any static host works:

- **Netlify / Cloudflare Pages**: drag the folder in, then attach the advisor's domain (e.g. `value.summitridge.com`).
- **GitHub Pages**: one repo per advisor, or one repo with a folder per advisor.
- **Embedding on an existing site**: host the folder, then add it in an iframe, or link a
  "What's my business worth?" button to it.

Test it once yourself and confirm the row appears in the sheet.

## How leads arrive

- **After step 1** (name, phone, email, consent), a row is created with `stage = started`.
  You keep people who drop off partway, which matters when you're paying for ads.
- **On the results page**, the same row is updated to `stage = completed` with the business,
  estimated value, owner's proceeds, risk scores, exit timing, and goal gap.
- Every row records `utm_source`, `utm_campaign`, and so on from the link, so you can see which ad produced it.
  Use links like `https://value.firm.com/?utm_source=facebook&utm_campaign=owners-55plus`.

## Ad tracking (optional)

With `metaPixelId` or `ga4Id` set, the tool sends:

| Moment | Meta event | GA4 event |
|---|---|---|
| Page load | `PageView` | page_view |
| Clicks "Start" | `begin_valuation` (custom) | `begin_valuation` |
| Each step | `valuation_step` (custom) | `valuation_step` |
| Finishes step 1 (contact info) | **`Lead`** | `generate_lead` |
| Sees results | **`CompleteRegistration`** | `valuation_complete` |
| Clicks "Schedule" | `Schedule` | `schedule_click` |

Optimize Meta campaigns for **Lead** at first, then switch to **CompleteRegistration** once there's enough volume.

## Before going live with a client: checklist

- [ ] Firm's compliance has approved the copy, `consentText`, and `disclosure`
- [ ] `privacyUrl` is set (you're collecting contact info and financial data)
- [ ] `industryMultiples` reviewed. **The built-in multiples are illustrative placeholders.** Replace them
      with figures from a source the firm is comfortable citing.
- [ ] Test submission shows up in the sheet, and the notification email arrives
- [ ] Sheet is shared only with the people who should see client financial data
