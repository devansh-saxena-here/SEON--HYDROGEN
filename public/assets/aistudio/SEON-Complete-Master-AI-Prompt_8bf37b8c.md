# SEON — Complete Master AI Prompt & Final-State Specification

**Prepared for:** Devansh Saxena  
**Product:** SEON — Smart Energy Optimization Network  
**Purpose:** A copy-paste master prompt for an AI builder, developer, designer, evaluator, or documentation assistant.  
**Evidence:** Original project brief, subsequent user requests and corrections, and inspection of the current application source.  
**Current primary website:** https://seon-ai-devansh.lovable.app

> This document distinguishes the user's desired final product from the implementation currently visible in source. It is not a certification that every hosted feature has passed live testing. Original requests, implemented features, deliberate removals, and remaining limitations are all retained. No private keys, credentials, or private backend identifiers are included.

---

# COPY-PASTE MASTER PROMPT STARTS HERE

## 1. Your role and the exact assignment

You are an expert team of Senior UI/UX Designers, Product Designers, AI Engineers, Full-Stack Developers, SaaS Architects, QA Engineers, and Technical Writers.

Understand, preserve, document, or reproduce the complete project **SEON — Smart Energy Optimization Network**, developed for **Devansh Saxena**.

Do not produce a generic energy dashboard. Follow this complete specification, including every later correction. The latest user instruction takes priority over an earlier version of the same requirement.

SEON is a **premium, high-fidelity, working MVP prototype**, not a production-ready enterprise utility platform. Its purpose is to demonstrate how an AI-powered smart energy-management platform could help organizations:

1. Monitor electricity consumption across buildings, rooms, and devices.
2. Compare trends and energy categories.
3. Identify waste, abnormal usage, and peak consumption.
4. Receive energy-saving recommendations.
5. Explore environmental, social, and governance performance.
6. Chat with a Gemini-powered AI assistant.
7. Preview and download professional reports.
8. Demonstrate device power control and timed auto-off.
9. Sign in using real accounts and see their own actual identity.

The intended presentation standard is a real early-stage SaaS startup MVP suitable for investor demonstrations, internship evaluations, hackathons, and product pitches—not an unfinished college assignment.

**Critical truthfulness rule:** Authentication, AI requests, and file downloads can be real while energy readings, ESG figures, alerts, equipment control, and recommendations remain simulated. Do not confuse an interactive demo with actual IoT hardware operation.

No real meters, smart plugs, BMS installation, building hardware, or sensor network is required for this prototype.

## 2. Priority rules: final decisions override earlier versions

Preserve these decisions without reinterpretation:

- The product name is **SEON**, expanded as **Smart Energy Optimization Network**.
- Developer credit must read **Developer - Devansh Saxena** in the website footer.
- Use the user's final uploaded **circular SEON logo**, not a generic thunderbolt, for brand identity.
- Clicking the SEON brand in the app sidebar must open the website home page `/`.
- Real sign-in supports **email + password and Google**, not Google-only.
- Show the current signed-in user's real name, email, avatar when available, initials, and sign-in provider.
- Do not hardcode Sana, Devansh, or another person as the identity of every user.
- The old requests to replace Sana with Devansh were later superseded by dynamic signed-in-user personalization.
- AI replies must be clear, professionally rendered, and limited to the user's requested scope.
- A table should be an actual well-styled table when the user asks for tabular information—not raw Markdown delimiters.
- Export PDF must download a real PDF file; it must not merely show an export toast.
- Export CSV must download a real CSV file.
- Each of the three buildings needs its own device-control entry point.
- Building C must have devices; a high-load building must not open an empty device list because its fixtures were forgotten.
- Dashboard alerts retain **Resolve** and **Auto-Optimize** actions.
- The four AI preset prompts remain available.
- **Remove and do not restore the Energy Simulator and Solar Mode controls.** They were added temporarily and explicitly removed later.
- Controls, especially alert buttons, must stay inside their available width on different screen sizes.
- Do not describe placeholder controls, marketing claims, or cosmetic toggles as fully implemented backend functionality.

## 3. Product audience and operating model

Primary audiences:

- Facility managers.
- Sustainability leads.
- Building operations teams.
- Energy analysts.
- Organization administrators evaluating the concept.
- Judges, investors, and evaluators exploring a working demonstration.

The demonstration portfolio contains three buildings, illustrative rooms, a representative sample of devices, daily/weekly/monthly energy figures, simulated alerts, and ESG indicators.

A typical workflow is:

1. Visit the public SEON website.
2. Open the app or sign-in page.
3. Create an account or sign in using email/password or Google.
4. Reach the dashboard.
5. Read consumption KPIs and charts.
6. Inspect buildings, rooms, and devices in Monitoring.
7. Open a building's device-control dialog.
8. Toggle a sample device or select an auto-off timer.
9. Resolve or simulate optimization of a dashboard alert.
10. Ask the AI assistant an energy or ESG question.
11. View sustainability scores.
12. Preview and download a PDF or CSV report.
13. Inspect the real signed-in profile or switch theme.
14. Sign out.

There is no subscription billing, payment flow, actual electricity purchase, utility integration, or verified savings accounting in the current prototype.

## 4. Visual identity and design philosophy

### 4.1 Original design direction

The original user requested a premium SaaS aesthetic inspired by Apple, Microsoft Fluent Design, Linear, Vercel, Notion, and Stripe Dashboard.

Desired qualities:

- Elegant, calm, classical, minimal, modern, polished.
- Professional spacing and readable hierarchy.
- Soft borders, restrained shadows, light glass effects.
- Consistent iconography and coordinated charts.
- No flashy gaming interface, neon overload, moving particles, or heavy distracting gradients.
- Section-wise background tonal variation.

Original requested typography, which the current project uses:

- **Poppins:** headings/display text.
- **Inter:** body text.

Original light-mode references:

- Backgrounds: `#F8FAFC`, `#F6F8FC`, `#F4F8F5`, `#EEF5FF`.
- Cards: white and soft glass.
- Border reference: `#E5E7EB`.
- Accents: emerald, sky blue, soft indigo.

Original dark-mode references:

- Backgrounds: `#0B1220`, `#111827`, `#101827`.
- Cards: dark glass.
- Border reference: `#2A3444`.
- Accents: emerald, cyan, blue.

The implementation expresses theme roles as semantic CSS tokens using OKLCH, not necessarily those exact hex values. Preserve the existing token-based system rather than scattering hardcoded colors throughout page code.

### 4.2 Current visual implementation

The current site uses:

- Poppins/Inter fonts.
- Emerald primary actions.
- Sky and indigo supporting accents.
- Light/dark semantic colors for background, foreground, cards, muted content, borders, popovers, sidebar, charts, and destructive states.
- Soft glass panels and restrained shadows.
- Subtle radial backgrounds and section treatments.
- Rounded cards and controls.
- Motion transitions, animated chart fills, hover lift, and count-up numbers.

Some original animation ideas—ripple effects everywhere, parallax, icon floating, expandable search, elaborate glass reflections—were aspirational. Do not claim each exists unless verified individually.

### 4.3 Logo and credit requirements

Final identity asset: the uploaded circular SEON logo.

The source currently uses it in:

- Landing navigation.
- Landing footer.
- Desktop app sidebar.
- Mobile app sidebar through the shared sidebar content.

Its presentation includes:

- Rounded-full treatment.
- A subtle border.
- Small internal spacing and background.
- Light shadow.
- Adjacent SEON text where appropriate.

Historical sequence:

1. Generic thunderbolt brand icon.
2. First uploaded SEON logo.
3. Footer logo updated with roughly 20% corner curvature.
4. Final circular uploaded logo superseded the previous asset and rounded treatment.
5. Favicon was updated historically to match the newer identity.

**Known remaining identity gaps:** The sign-in page still renders a Zap/thunderbolt as its SEON brand icon; the CTA contains a decorative Zap; the PDF header uses a colored circle and text rather than embedding the uploaded logo. These are not evidence that the all-brand-positions replacement is completely finished.

Distinguish ordinary energy icons from brand logos: a lightning icon representing electricity consumption does not necessarily need replacement.

## 5. Site map and navigation

Current application structure:

| URL | Page | Access/behavior |
|---|---|---|
| `/` | Public landing website | Public |
| `/login` | Sign in and sign up | Existing session redirects to `/app` |
| `/app` | Main dashboard | Client-side signed-in-user gate |
| `/app/monitoring` | Buildings, rooms, devices | Under the app layout |
| `/app/assistant` | SEON AI Assistant | Under the app layout |
| `/app/esg` | ESG Dashboard | Under the app layout |
| `/app/reports` | Reports, preview, PDF/CSV | Under the app layout |
| `/app/settings` | Profile, appearance, notifications, AI preferences | Under the app layout |
| `/api/chat` | Current AI message POST endpoint | Returns streamed AI messages; see security limitations |

### Public navigation

- SEON logo links home.
- Features scrolls to `#features`.
- How it works scrolls to `#how`.
- AI Assistant navigates to `/app/assistant`.
- ESG navigates to `/app/esg`.
- Theme toggle.
- Sign in.
- Launch app.
- Mobile menu with open/close transition.

Important prior correction: AI Assistant and ESG formerly used non-existent landing hash targets. They were changed to real application URLs.

### App layout

- Fixed desktop sidebar approximately 256px wide.
- Mobile sidebar drawer with an overlay.
- Sidebar entries: Dashboard, Monitoring, AI Assistant, ESG, Reports, Settings.
- Active navigation state and animated indicator.
- Clicking sidebar SEON opens `/`.
- Sticky top bar.
- Search field placeholder: “Search buildings, devices, reports…”
- Theme switch.
- Bell icon.
- Real current-user avatar/initials and first name.
- Profile dropdown with full name, email, provider, Profile, Settings, Sign out.
- Shared constrained main content area.
- Page transitions.
- Sidebar note: “Prototype workspace” / “All data is simulated for demonstration.”

**Current limitations:** Top-bar search is not wired to a cross-app search engine. The bell button has no functional notification panel. Do not list either as a completed feature.

The app's visual auth gate is client-side. It hides workspace content and redirects after user loading; it is not proof that every server endpoint independently checks identity.

## 6. Public landing page: content and experience

The existing landing page contains:

1. Sticky glass navigation.
2. Hero introduction and animated dashboard-like preview.
3. Feature grid.
4. How-it-works sequence.
5. Technology stack band.
6. Demo testimonials.
7. Call to action.
8. Footer.

### Hero

Current headline:

“The operating system for smart energy.”

Supporting description explains that SEON unifies monitoring, AI recommendations, and ESG reporting.

Eyebrow: “Gemini-powered energy intelligence.”

Actions:

- Open dashboard → `/app`.
- Explore features → `#features`.

Preview details:

- “Live overview.”
- “Today's consumption.”
- Streaming indicator.
- Total kWh: 4,218 with −6.4% change.
- CO₂ avoided: 1.82 t with +12.1% change.
- AI optimizations: 14 active.
- Seven illustrative animated bars with heights `[42, 58, 76, 61, 88, 96, 54]` percent.

The preview is a simulated visual demonstration, not streaming telemetry.

### Feature grid

Current six feature labels:

1. Real-time monitoring.
2. AI recommendations.
3. ESG intelligence.
4. Predictive analytics.
5. Enterprise-grade.
6. Device intelligence.

**Truthfulness:** Forecasting, equipment-fatigue prediction, real second-by-second telemetry, role-based enterprise access, audit trails, and SOC-related readiness are landing copy/concept claims—not all implemented product capabilities. Document them as conceptual positioning, not verified functionality.

### How it works

- **01 Connect:** conceptually ingest meters, BMS, or CSV.
- **02 Understand:** dashboard and AI explanations.
- **03 Optimize:** approve suggestions and automate schedules.

No actual meter ingestion, BMS integration, or CSV import flow is implemented.

### Technology band

React 19, TypeScript, TanStack Start, Tailwind v4, Recharts, Framer Motion, Google Gemini, shadcn/ui.

### Demo testimonials

- Aisha Rahman — Head of Sustainability, Northwind.
- Marco Silva — Operations Director, Kestrel Group.
- Priya Menon — CFO, Orbital Labs.

Treat names, organizations, claimed reductions, and endorsements as fictional demonstration content, not real customer proof.

### CTA and footer

CTA headline: “Every kilowatt, accounted for.”

CTA actions:

- Open the dashboard.
- Try demo login.

The “Try demo login” wording is stale: `/login` now uses real email/Google accounts, not a built-in demo credential shortcut.

Footer includes:

- Final circular SEON logo and SEON name.
- Short product description.
- Product links: Dashboard, Monitoring, AI Assistant, ESG.
- Company labels: About, Careers, Press, Contact.
- Legal labels: Privacy, Terms, Security, DPA.
- Current-year copyright.
- **Developer - Devansh Saxena** credit.

Current footer columns use placeholder `#` links. Dedicated company/legal pages are not implemented. The developer-name link points to `/app`, not a developer portfolio.

Original landing ambitions also included About, Benefits, standalone AI preview, and ESG preview. The current page does not implement each as a dedicated named section; some concepts appear in existing copy.

## 7. Real authentication, account profiles, and identity

### 7.1 Required sign-in methods

Final user-selected methods:

- Email + password.
- Google sign-in.

Both sign-in and sign-up modes are in `/login`.

Sign-up adds a display-name input.

### 7.2 Current validation rules

- Email: trim, valid email, maximum 255 characters.
- Password: minimum 6 characters, maximum 72 characters.
- Sign-up display name: trimmed, required, minimum 1, maximum 80 characters.
- Input/loading states and toast feedback.

The current implementation uses Zod schemas and React state; the presence of React Hook Form in dependencies does not mean the login form uses it.

### 7.3 Authentication behavior

- Existing session at `/login` sends the user to `/app`.
- SIGNED_IN events send the user to `/app`.
- Email sign-in calls the managed password authentication service.
- Sign-up sends `display_name` as account metadata.
- Google uses the managed Lovable OAuth helper.
- Google redirect is a full same-origin public URL: `${window.location.origin}/login`.
- This redirect was the latest fix for a reported Chrome login/access problem.
- App layout loads the actual user before displaying the workspace.
- Missing user redirects to `/login`.
- Sign out calls the authentication service, shows a toast, then navigates to `/login`.

**Do not overclaim the Chrome fix:** The source now contains the corrected Google redirect, but the conversation ended with a request for the user to test it. A fresh hosted Google OAuth end-to-end result is not established by source inspection.

### 7.4 Real user identity normalization

The current user hook returns:

- ID.
- Email.
- Full display name.
- First name.
- Avatar URL or null.
- Initials.
- Provider.

Name fallback order:

1. `display_name` metadata.
2. `full_name` metadata.
3. `name` metadata.
4. Email local part.
5. “User.”

Avatar fallback order:

1. `avatar_url`.
2. `picture`.
3. Initials if no image.

Initials use up to the first two name words.

Dashboard greeting currently reads:

“Good afternoon, {current user's first name}”

Fallback is “there.” The name is dynamic, but “Good afternoon” is fixed; time-of-day greeting logic is not implemented.

### 7.5 Profiles and privacy

Application profile storage includes:

- `id` UUID primary key linked to account ID with deletion cascade.
- `email`.
- `display_name`.
- `avatar_url`.
- `created_at`.
- `updated_at`.

Signup trigger creates a profile from account data, with display-name fallbacks and conflict handling.

Update trigger updates the modification timestamp.

Row-level security is enabled.

Final profile rules:

- Signed-in users can SELECT only their own profile row.
- Users can INSERT only their own profile ID.
- Users can UPDATE only their own profile ID.
- Trigger-function execution permissions were restricted.

Historical security correction: an initial broad authenticated SELECT policy exposed other users' profile emails. It was replaced with an owner-only SELECT policy.

An authenticated DELETE grant exists in historical SQL, but no corresponding owner DELETE policy is shown. Do not infer a working account/profile deletion UI.

Current identity display primarily reads authenticated account metadata through the user hook. It does not fetch the profile table for every display or save edits from Settings.

### 7.6 Authentication limitations to preserve honestly

- Original brief requested Remember Me, Forgot Password, and demo login. Dedicated controls/flows for these are not currently present.
- No password-reset flow is implemented.
- No Google-only restriction was finalized.
- Historical messages say automatic email confirmation was enabled. Current hosted signup/confirmation settings were not reread for this document; treat that as historical configuration, not current verification.
- Signup currently reports “Account created — you're in!” without branching on whether confirmation is required or whether a session was returned. This may be misleading if hosted confirmation settings differ.
- Signup `emailRedirectTo` still references `/app`; Google redirect is the corrected `/login`.
- No fresh live verification of redirect allowlists, provider configuration, or email-confirmation behavior is claimed.

## 8. Dashboard: exact structure, data, actions

### Header

- Dynamic current-user first-name greeting.
- Heading: “Here's your energy overview.”
- Generate report → Reports page.
- Ask SEON → AI Assistant page.

### KPI tiles

| Metric | Current demo value | Change/status |
|---|---:|---|
| Today | 4,218 kWh | −6.4% |
| This week | 30,021 kWh | −3.1% |
| This month | 128,420 kWh | +1.8% |
| Buildings · Devices | 3 · 129 | Live |

The values count up on display. “Live” is a demonstration label, not hardware verification.

### Charts

1. Hourly consumption: 24-point area chart.
2. Category distribution: donut chart with legend and tooltip.
3. Weekly usage versus target: paired bar chart.

Use responsive Recharts containers, theme-aware axes/grid/tooltips, and units.

### Category distribution

- HVAC: 42%.
- Lighting: 18%.
- Computing: 24%.
- Appliances: 10%.
- Other: 6%.

### Weekly fixtures

| Day | kWh | Target kWh |
|---|---:|---:|
| Mon | 612 | 700 |
| Tue | 588 | 700 |
| Wed | 704 | 700 |
| Thu | 649 | 700 |
| Fri | 731 | 700 |
| Sat | 402 | 500 |
| Sun | 318 | 500 |

Hourly data is deterministic:

`hour = h padded to two digits + ':00'`

`kwh = round(30 + sin((h - 6) / 24 × 2π) × 22 + ((h × 37) mod 8))`

This replaced render-time randomness to avoid server/client hydration mismatches.

### Alerts and action panel

Four initial alerts:

1. **High:** Peak consumption detected — Building C exceeded 95% of daily quota at 14:20; “2m ago.”
2. **Medium:** AC running after office hours — R&D Lab AC Unit 07 active past 21:00 for three nights; “1h ago.”
3. **Low:** Lights left ON — Reception lighting active in an unoccupied period; “3h ago.”
4. **Medium:** High usage spike — Server Room load 18% above baseline; “6h ago.”

Each alert starts as `open`.

- Resolve → local state `resolved`, confirmation toast, Resolved badge.
- Auto-Optimize → local state `optimized`, confirmation toast, Optimized by AI badge.
- Open-alert count decreases accordingly.
- Completed alerts replace action buttons with status badges.

The action does not call an AI optimization engine, modify actual equipment, or persist a backend resolution record. It demonstrates the interaction locally.

Prior responsive correction used wrapping and flexible button sizing to prevent action overflow. Any recreation must confirm the result at narrow widths, not merely copy classes.

### Buildings overview

Three building summaries with status, usage, room/device counts, and progress toward a displayed 300 kWh reference.

“View all” opens Monitoring.

### AI insights

Four predefined recommendations:

1. Shift HVAC pre-cooling to off-peak — ~8.2% saving — HVAC.
2. Auto-dim corridor lights after 20:00 — ~3.1% saving — Lighting.
3. Consolidate idle workstations — ~2.4% saving — Computing.
4. Schedule server backup at 03:00 — ~1.6% saving — Computing.

Current Apply buttons have no action handler. Do not claim actual adoption, device scheduling, or changes in consumption from them.

### Recent activity

Static examples:

- Monthly ESG report generated — Today, 09:12 — Report.
- AI optimization plan accepted — Yesterday, 17:44 — AI.
- Building C threshold updated to 300 kWh — Mon, 11:20 — Config.
- Three devices auto-scheduled to standby — Sun, 22:05 — Automation.

These are demo narrative rows, not a backend audit log.

### Explicitly removed controls

There must be no visible Energy Simulator, peak-load slider, or Solar Mode switch.

Historical behavior was a 50–150% load slider and a solar multiplier of 0.72. The current source retains unused load/solar state with defaults 100/false and chart-scaling plumbing, so effective multiplier is 1. This leftover code is not a visible active feature and must not be documented as one.

## 9. Monitoring: buildings, rooms, devices, control dialogs

### Main layout

- Heading: Energy Monitoring.
- Search input.
- Building selector: All, A, B, C.
- Tabs: Buildings, Rooms, Devices.

### Building fixtures

| ID | Name | Usage kWh | Portfolio devices | Portfolio rooms | Status |
|---|---|---:|---:|---:|---|
| a | Building A — HQ | 245 | 42 | 12 | Optimal |
| b | Building B — R&D | 198 | 36 | 9 | Optimal |
| c | Building C — Ops | 276 | 51 | 15 | High Load |

Each card shows name, status, usage today, room/device counts, progress, and **Control devices**.

Portfolio totals: 129 devices and 36 rooms. The individually listed fixtures are only representative samples, not all 129 equipment records or all 36 rooms.

### Room fixtures

| ID | Room | Building | Devices | Usage kWh | Status |
|---|---|---|---:|---:|---|
| 1 | Conference Room 3F | Building A | 6 | 32.4 | Active |
| 2 | R&D Lab | Building B | 14 | 68.1 | Active |
| 3 | Executive Office | Building A | 4 | 12.9 | Idle |
| 4 | Reception | Building A | 3 | 4.2 | Active |
| 5 | Library | Building C | 8 | 18.7 | Active |
| 6 | Server Room | Building B | 12 | 92.3 | Critical |

Room table columns: Room, Building, Devices, Usage, Status.

Critical gets destructive emphasis; Idle uses an outline style; other states use secondary styling.

### Device fixtures

| ID | Device | Type | Room | kWh | Initial power |
|---|---|---|---|---:|---|
| 1 | AC Unit 01 | AC | Conference Room 3F | 14.2 | ON |
| 2 | Ceiling Lights | Lights | Conference Room 3F | 3.1 | ON |
| 3 | Projector | Projector | Conference Room 3F | 1.4 | OFF |
| 4 | Server Rack A | Computer | Server Room | 42.6 | ON |
| 5 | Workstation 12 | Computer | R&D Lab | 2.8 | ON |
| 6 | Office Printer | Printer | Executive Office | 0.6 | OFF |
| 7 | Ceiling Fan | Fan | Reception | 0.4 | ON |
| 8 | AC Unit 07 | AC | R&D Lab | 16.9 | ON |
| 9 | Library Lights | Lights | Library | 4.8 | ON |
| 10 | Library AC | AC | Library | 12.3 | ON |
| 11 | Reading Desk Lamps | Lights | Library | 1.6 | ON |
| 12 | Ops Workstation 03 | Computer | Library | 2.1 | OFF |

Building C's final four representative devices were added after the user reported the empty control list.

### Per-building control behavior

- Building A opens its five listed sample devices: AC Unit 01, Ceiling Lights, Projector, Office Printer, Ceiling Fan.
- Building B opens its three listed sample devices: Server Rack A, Workstation 12, AC Unit 07.
- Building C opens its four listed sample devices: Library Lights, Library AC, Reading Desk Lamps, Ops Workstation 03.

Grouping is derived from each building's room names and each device's room. The dialog must not indiscriminately show all buildings' devices.

Dialog includes:

- Selected building name and Device Control heading.
- Device name.
- Device type badge.
- Room and sample consumption.
- Per-device ON/OFF switch.
- Per-device timer selector.
- Countdown for an active timer.
- Empty state when no representative fixtures exist.
- Scrollable dialog at limited viewport height.

### Timer rules

Available selections:

- No timer.
- 5 minutes.
- 15 minutes.
- 30 minutes.
- 1 hour.
- 2 hours.
- 8 hours.

State per device:

`{ on: boolean, timerMin: number | null, timerEndsAt: number | null }`

Behavior:

1. Choosing a duration turns the device ON and sets `timerEndsAt = now + minutes × 60,000`.
2. Countdown updates through a one-second interval.
3. At expiry, device becomes OFF and timer values clear.
4. A toast indicates timed shutdown.
5. Manually turning a device OFF cancels its timer.
6. Choosing No timer clears the timer while preserving current ON/OFF state.
7. Building dialog and Devices-tab switches share the same local state while Monitoring is mounted.

Limitations:

- State is in component memory, not persistent storage.
- Navigating away or refreshing resets it.
- No background timer service runs after the page is unmounted.
- No physical device is controlled.
- Device usage values and aggregate charts do not recalculate when a switch changes.
- No recurring schedule/calendar, custom duration field, or bulk control is implemented.

### Search/filter limitations found in current source

- Search applies to Rooms by name/building.
- Search applies to Devices by name/room/type.
- Buildings cards are not filtered by the search or selected building.
- The building selector only affects the Rooms filtering path, not Devices.
- The current room filter uses string containment of a one-letter building ID; because all labels include “Building,” selecting `b` can wrongly match every room. Do not describe this as fully correct per-building filtering.
- No sorting or pagination controls are implemented here.
- Tables do not have a consistently implemented horizontal-scroll wrapper for small screens.

A future completion must correct those gaps without changing the required device-control behavior.

## 10. AI Assistant: interface, streaming, prompts, answer policy

### Interface

- Page title: SEON Assistant.
- Chat panel approximately 70vh tall.
- Scrollable conversation region.
- Assistant and user avatars.
- User messages aligned to the opposite side.
- Animated message appearance.
- User text preserves whitespace and wraps words.
- Assistant replies rendered with Markdown + GFM support.
- Bot empty state: “How can I help?”
- “SEON is thinking…” pulse while submitted/streaming.
- Composer with textarea and send icon.
- Enter sends; Shift+Enter keeps a new line.
- Send disabled while busy or input is empty.
- Input focus on mount and after sending.
- Auto-scroll toward newest content.

The current page contains some explanatory text and duplicated suggestions: one group in the empty state and one persistent row above the composer.

### Four final quick presets

1. “Summarize Building A usage”
2. “How to reduce HVAC load by 10%?”
3. “Generate ESG summary”
4. “Top 3 cost-saving actions this week”

Clicking a preset submits its text to the AI chat. The persistent row disables presets during a busy response; the empty-state buttons currently do not share the same disabled guard.

### AI topics

The assistant should handle:

- Energy-saving questions.
- Dashboard explanation.
- Building consumption summaries.
- HVAC reduction ideas.
- ESG definitions and summaries.
- Weekly/monthly analysis when requested.
- Reasons for increasing usage.
- Recommendations and report-style narratives.

Do not claim the assistant can physically control devices or generate downloadable reports from chat: no tools for those actions are implemented.

### Final response-length policy

The assistant must:

- Answer only what the user asks.
- Skip preambles, recaps, generic offers, and unrequested next steps.
- Match requested scope.
- Use one concise line for a simple one-line factual question.
- Use yes/no plus at most a short clause for a yes/no question.
- Return just the relevant number/fact when that is all requested.
- Expand into lists, tables, reports, comparisons, or detailed paragraphs only when the user asks for them.
- Never pad a short answer with definitions, generic disclaimers, or unrelated context.

A request for “super detailed” output explicitly permits a long response; brevity must not override requested completeness.

### Final formatting policy

- Clean GitHub-Flavored Markdown.
- Bold only key terms—not complete sentences.
- No decorative standalone asterisks.
- No single-asterisk emphasis requirement.
- No headings for short replies.
- Requested tabular data must use a valid header-row GFM table, preferably at most five columns.
- Fenced blocks only for actual code or formulas.
- Render bold, lists, links, code, and tables; do not display Markdown as raw `<pre>` text.
- Tables use shaded headers, spacing, borders, smaller readable type, and good light/dark contrast.
- Narrow-width tables and long words must remain readable without pushing the page outside the viewport.

### Actual current AI connection

- Browser chat uses `useChat` and `DefaultChatTransport`.
- POST target is `/api/chat`.
- Request contains `messages`.
- Handler rejects missing/non-array messages with HTTP 400.
- Server reads `LOVABLE_API_KEY`.
- Missing key currently returns HTTP 500.
- Current provider is an OpenAI-compatible wrapper targeting Lovable AI Gateway.
- Current model string is `google/gemini-3.5-flash`.
- It converts UI messages into model messages and uses `streamText`.
- Response is a streamed UI-message response.

Original request named direct Google Gemini API; the implementation instead uses Gemini through Lovable AI Gateway. No direct user-owned Google API key integration was finalized.

### Important AI limitations

- Assistant prompt contains a few plausible demo figures; it does not load the full live portfolio, actual device state, user-specific analytics, or backend reports.
- Current system mentions Building A ~245 kWh/day, HVAC ~42%, and ~12.4 t CO₂ saved YTD.
- The chat history exists during the mounted chat session; persistent conversation storage is not implemented.
- No floating assistant widget is implemented despite the original request.
- No file upload, voice, report attachment, citations, retrieval, or actionable device tools exist.
- Error handler logs to the console rather than showing a complete retry/error experience.
- There is no explicit authentication check inside the current chat handler.
- No rate-limiting or robust message-size validation is shown.
- A protected page does not substitute for verifying callers server-side.
- No fresh real streamed request was executed for this document, so current model availability and hosted credentials are not certified.

For future implementation on Lovable, use the platform's supported AI Gateway SDK patterns and server runtime guidance rather than assuming the historical wrapper is the recommended integration forever.

## 11. ESG Dashboard

Heading: ESG Dashboard.

Four score indicators with radial progress visuals:

| Category | Score |
|---|---:|
| Environmental | 82 / 100 |
| Energy Efficiency | 76 / 100 |
| Social Impact | 71 / 100 |
| Governance | 88 / 100 |

Main visuals:

- Monthly carbon-estimation line chart.
- Month-over-month improvement badge: −14%.
- Green-footprint impact panel.
- Annual-target progress bar.
- Recommendations.

Impact metrics:

- CO₂ saved YTD: 12.4 t.
- Equivalent trees: 512.
- Green improvement: +14%.
- Displayed annual target: 20 t CO₂.
- Displayed target progress: 68%.

**Consistency warning:** 12.4 / 20 is 62%, not 68%. These are independent demo values in current source; do not represent them as a validated calculation.

### Monthly fixtures

| Month | Energy kWh | CO₂ demo value |
|---|---:|---:|
| Jan | 18,420 | 8.6 |
| Feb | 17,210 | 8.0 |
| Mar | 19,110 | 8.9 |
| Apr | 20,340 | 9.5 |
| May | 21,980 | 10.3 |
| Jun | 23,120 | 10.8 |
| Jul | 24,500 | 11.4 |
| Aug | 23,860 | 11.1 |
| Sep | 20,940 | 9.7 |
| Oct | 19,430 | 9.1 |
| Nov | 18,120 | 8.4 |
| Dec | 17,640 | 8.2 |

Monthly energy values exist in fixtures; this ESG chart displays the CO₂ series, not a separate monthly electricity chart.

Recommendations:

1. Off-peak HVAC pre-cooling to reduce peak-load CO₂ by approximately 8%.
2. Occupancy-based corridor-light dimming.
3. Power-saving consolidation for idle workstations.
4. Solar shading for Building C's south-facing facade.

Solar shading as an ESG recommendation is distinct from the removed Solar Mode dashboard switch.

Scores and carbon figures are simulated. No formal ESG methodology, emissions-factor engine, accounting framework, certification, or regulatory compliance calculation is implemented.

## 12. Reports: list, generation, preview, PDF, CSV

### Report catalog

| ID | Title | Period | Date | Displayed size |
|---|---|---|---|---|
| r-2026-11 | November 2026 — Monthly Report | Monthly | 2026-11-30 | 2.3 MB |
| r-2026-w46 | Week 46 — Weekly Summary | Weekly | 2026-11-15 | 1.1 MB |
| r-2026-q3 | Q3 2026 — Sustainability Report | Quarterly | 2026-09-30 | 4.8 MB |
| r-2025 | Annual Energy Review 2025 | Annual | 2025-12-31 | 8.2 MB |

These are fixed demo catalog entries. Displayed sizes are not measured sizes of exported files. Future-dated entries can appear because fixtures are static; they are not evidence those periods have already completed.

Each report card has:

- Period badge.
- Title.
- Date and sample size.
- Preview.
- Export PDF.
- Export CSV.

### Generate report dialog

Type selector options:

- Weekly.
- Monthly.
- Quarterly.
- Annual.

Current Generate action simulates approximately 900ms of loading and shows a “report ready” toast.

**Important limitation:** It does not create a new stored report, add a card, compute period-specific analytics, or automatically download a report. Do not describe generation as complete backend report creation.

### Preview

Dialog displays the selected title and “SEON Energy Report.”

It explicitly labels the content as sample data.

Preview summary mentions:

- 6.4% decrease versus the previous period.
- HVAC optimization in Buildings A and B.
- 14 accepted AI recommendations.
- Total consumption: 30,021 kWh.
- Estimated CO₂ avoided: 1.82 t.
- Peak alerts resolved: 7.
- ESG improvement: +3.1 points.
- Suggested pre-cooling and idle-workstation consolidation.

Preview footer offers Export CSV and Export PDF.

### Real PDF download

Uses jsPDF and jsPDF-autotable.

Format:

- A4 portrait.
- Point-based layout.
- Approximately 40pt side margins.
- Dark header band.
- Emerald, sky, and indigo accent stripes.
- SEON title and full expansion.
- Report ID, generated date, and period.
- Report title and metadata.
- Four colored KPI blocks.
- Executive summary.
- Building-consumption table.
- AI-recommendation table.
- ESG breakdown with colored progress bars.
- Footer on each page with SEON branding, developer credit, and page numbers.
- Page breaks where needed.
- Sanitized lowercase filename derived from title with `.pdf` extension.
- Actual `doc.save()` download.

Current PDF KPI figures:

- Total consumption: 30,021 kWh.
- CO₂ avoided: 1.82 tons.
- ESG improvement: +3.1 points.
- Peak alerts resolved: 7 events.

Building-report rows:

- Building A — HQ: 9,845 kWh, 42 devices, 12 rooms, Optimal.
- Building B — R&D: 8,120 kWh, 36 devices, 9 rooms, Optimal.
- Building C — Ops: 12,056 kWh, 51 devices, 15 rooms, High Load.

These rows sum to 30,021 kWh.

PDF recommendations include the four dashboard suggestions plus Building C solar shading (~4.0%).

PDF ESG scores: Environmental 82, Energy Efficiency 76, Social Impact 71, Governance 88.

Current PDF retains “Prepared for Devansh Saxena.” This is a hardcoded recipient, not dynamic current-user personalization. Developer credit is a separate correct fixed branding value.

The downloaded report data is illustrative and repeated across report periods; only selected report metadata differs. It is not a live monthly/annual aggregation.

Current PDFs use standard Helvetica and Unicode symbols in strings. Verify actual exported typography for CO₂, arrows, and long dashes before claiming perfect glyph support.

### Real CSV download

- CSV generated in the browser.
- Quoted cells.
- Embedded quotes escaped by doubling them.
- UTF-8 text/csv Blob.
- Object URL and download link.
- Sanitized lowercase filename derived from report title with `.csv` extension.
- Object URL released afterward.

CSV includes:

1. Report title.
2. Report ID.
3. Period.
4. Date.
5. Metric/value/unit rows.
6. Total Consumption 30,021 kWh.
7. CO₂ Avoided 1.82 tons.
8. ESG Improvement +3.1 points.
9. Peak Alerts Resolved 7 events.
10. Building rows matching the PDF totals.

This is exported report summary data, not all raw hourly readings or device-level telemetry. “Download raw data” was the user's upgrade intent, but the current CSV contains a compact summary dataset.

## 13. Settings: existing controls and actual effects

Tabs:

- Profile.
- Appearance.
- Notifications.
- AI.

### Profile

Displays current account:

- Avatar or initials.
- Full name.
- Email.
- Provider.

Editable-looking fields:

- Full name initialized from signed-in account.
- Email initialized from signed-in account.
- Role defaults to “Sustainability Lead.”
- Language selector: English, Français, Deutsch, Español.
- Save changes button.

**Current reality:** Save changes only shows “Profile saved.” It does not update account metadata or the profile table. Role is a display field, not an authorization role. Language selection does not translate the application.

### Appearance

- Light theme.
- Dark theme.
- Theme preference is genuinely stored locally.
- Reduce motion switch.
- Compact density switch.

Only theme changes have a real shared application effect. Reduce motion and compact density currently produce switch state/toasts without implementing the corresponding global behavior.

### Notifications

- Peak alerts: describes email at >90% of daily quota; initially ON.
- Weekly digest: each Monday; initially ON.
- ESG milestones: score changes by ±5; initially OFF.
- Product updates: initially OFF.

These are prototype preference controls, not functioning email subscriptions or notification jobs. They are not persisted to a backend.

### AI preferences

- Enable AI recommendations: initially ON.
- Auto-apply low-risk actions: initially OFF; wording references estimated savings below 3%.
- Assistant tone: Professional, Concise, Friendly.

These controls do not currently alter the AI handler's system prompt, execute automatic equipment actions, or persist preferences. The strict concise-response policy is implemented separately in the chat system prompt.

## 14. Theme behavior and interaction polish

Actual theme behavior:

- Default theme: dark.
- Light and dark modes.
- Shared theme state.
- Local storage key: `seon-theme`.
- Initial stored preference loaded after mount.
- Root pre-hydration script applies the saved dark class early.
- Navigation and app top bar offer toggles.
- Settings can select light/dark.
- Preference survives refresh.

Other actual interactions:

- Animated page/message entrance.
- Navbar entrance animation.
- Section reveal on scroll.
- Card hover lift.
- Animated initial hero bars.
- KPI count-up.
- Responsive chart resizing.
- Dialogs, selects, tabs, dropdown menus.
- Toast feedback.
- Mobile navigation drawer.

Original ambitions included skeletons, sorting, pagination, accordions, persistent conversations, universal keyboard polish, and broader accessibility/performance work. These are not all evidenced as complete in the current pages.

No Lighthouse measurement, comprehensive accessibility audit, or cross-browser certification is included in this document.

## 15. Technical architecture and source map

### Actual stack—not the original proposed stack

The original user brief mentioned Next.js 15, but the final project uses:

- TanStack Start v1.
- TanStack Router.
- React 19.
- TypeScript.
- Vite.
- Tailwind CSS v4.
- shadcn/ui and Radix primitives.
- Motion via `motion/react`.
- Recharts.
- Zod.
- Sonner.
- Lovable Cloud for account/backend services.
- AI SDK and Gemini through Lovable AI Gateway.
- ReactMarkdown and remark-gfm.
- Tailwind Typography.
- jsPDF and jsPDF-autotable.
- Lucide icons.

Keep the existing framework. Do not rewrite the app to Next.js merely because it appeared in the initial brief.

### Source responsibilities

- `src/routes/__root.tsx`: document shell, fonts, shared providers, toast host, global error/not-found handling, root metadata.
- `src/router.tsx`: router setup.
- `src/start.ts`: Start middleware/bootstrap.
- `src/styles.css`: semantic theme tokens and shared styles.
- `src/routes/index.tsx`: landing composition.
- `src/components/landing/navbar.tsx`: public navigation and theme.
- `src/components/landing/hero.tsx`: introduction and illustrative dashboard preview.
- `src/components/landing/sections.tsx`: features, steps, tech, testimonials, CTA.
- `src/components/landing/footer.tsx`: logo, footer columns, developer credit.
- `src/routes/login.tsx`: real signup/sign-in form and Google OAuth return handling.
- `src/routes/app.tsx`: app shell, client auth gate, sidebar, top bar, real user menu, sign out.
- `src/routes/app.index.tsx`: KPIs, charts, alerts, insights, building overview, activity.
- `src/routes/app.monitoring.tsx`: representative building/room/device data and local control/timers.
- `src/routes/app.assistant.tsx`: streamed chat interface and Markdown rendering.
- `src/routes/api/chat.ts`: current AI POST handler and system policy.
- `src/routes/app.esg.tsx`: ESG scores and carbon visuals.
- `src/routes/app.reports.tsx`: report catalog, preview, PDF/CSV buttons.
- `src/routes/app.settings.tsx`: profile display and prototype preferences.
- `src/hooks/use-user.ts`: account-to-display identity normalization.
- `src/hooks/use-count-up.ts`: numeric animation.
- `src/components/theme-provider.tsx`: local theme memory.
- `src/lib/demo-data.ts`: deterministic sample data.
- `src/lib/pdf-report.ts`: browser PDF generation.
- `src/lib/ai-gateway.server.ts`: historical gateway provider wrapper.
- `src/assets/seon-logo-new.png.asset.json`: pointer to uploaded brand asset.
- `supabase/migrations/`: profile schema, signup/update triggers, and profile privacy-policy history.

Never expose secret values in prompts, screenshots, code comments, generated documentation, or frontend code.

### Runtime and future implementation boundaries

For continued implementation inside Lovable:

- Respect the actual TanStack Start routing setup.
- Never edit generated route trees or generated backend clients by hand.
- Keep private keys server-side.
- Follow Cloudflare/workerd-compatible server patterns; do not assume Node APIs are available after publishing.
- Use supported server functions for application-internal logic.
- Verify callers inside public server routes.
- Enforce data privacy with actual backend policies, not only hidden UI.
- Use semantic design tokens and existing design-system controls.
- Preserve hydration-safe rendering.
- Create route-specific titles/descriptions and social metadata if completing SEO.

Current metadata is mostly global, with a basic login title/description. Most content pages do not have unique leaf metadata. Root social-image tags exist but are not evidence that each page has a page-matched cover. Treat route-level SEO completeness as a remaining gap.

## 16. Data consistency, persistence, and claim boundaries

### Real service-backed behavior in source

- Account creation and password sign-in calls.
- Google OAuth initiation and return handling.
- Current-user retrieval and session-change subscription.
- Actual sign out.
- Backend profile schema and privacy rules.
- AI streaming request path.

### Real browser functionality in source

- Theme persistence.
- Navigation.
- Tabs/dialogs/selects/dropdowns.
- Local device toggles.
- Mounted-page timer countdown and auto-off.
- Alert status updates and open count.
- Markdown table rendering.
- PDF download.
- CSV download.

### Simulated or static content

- Energy readings.
- “Live” indicators.
- Portfolio counts and illustrative equipment lists.
- ESG scores and carbon values.
- Alerts and relative timestamps.
- AI insight fixtures.
- Recent activity.
- Savings claims.
- Testimonials.
- Report summaries and catalog metadata.

### Cosmetic or incomplete controls

- Global search.
- Bell notification button.
- Dashboard insight Apply.
- New report generation beyond a toast.
- Profile Save changes.
- Language translation.
- Reduce motion and compact density settings.
- Email notification settings.
- AI preference wiring.
- Footer placeholder links.

### Aggregation warning

The dashboard Today value 4,218 kWh, building daily total 719 kWh, weekly chart sum 4,004 kWh, and weekly KPI/report total 30,021 kWh are separate demo fixtures. The 12 representative devices and six room records are not the 129-device/36-room inventory.

Do not invent an explanation that these values are automatically reconciled. A future completed model should label their scopes or calculate from a single consistent dataset.

## 17. Complete chronological request-and-edit record

Use this record to avoid undoing deliberate decisions.

1. **Initial complete premium MVP request:** Build SEON with landing, dashboard, monitoring, AI, ESG, reports, settings, demo energy data, responsive design, themes, and animation.
2. **Sidebar home navigation:** Clicking SEON inside the app should go home. Brand was wrapped in a home link.
3. **Developer credit:** Replace “Built with SEON platform.” with “Developer - Devansh Saxena.”
4. **DOM removeChild crash:** Investigated hydration mismatch; replaced module-level random hourly data with a deterministic formula.
5. **Real signup/login request:** User explicitly chose profile storage and email/password plus Google; backend account/profile setup added.
6. **Profile privacy security finding:** Owner-only read policy replaced broad authenticated profile/email access.
7. **Greeting rename:** “Good afternoon, Sana” changed to Devansh.
8. **Remove Sana elsewhere:** Default names replaced in app/settings at that stage.
9. **Broken AI Assistant and ESG navigation:** Incorrect hash links changed to actual app paths.
10. **AI chat HTTP 500:** Historical diagnosis was that the running server had not picked up the newly provisioned AI secret; restarting it was the reported fix.
11. **Unclear AI formatting:** Added Markdown rendering, GFM tables, typography, and cleaner formatting policy.
12. **Too-long AI replies:** Added strict answer-only-what-is-asked policy; removed compulsory extra tips and next steps.
13. **Downloaded code/API key discussion:** User asked about using Google AI when exporting to GitHub/Vercel. Direct external-hosting integration was discussed but not implemented.
14. **Hosting badge discussion:** User disliked the hosting badge. Historical later assistant report said the published badge setting was hidden. Current badge visibility/plan entitlement was not verified for this document; no CSS badge-hiding hack is part of SEON.
15. **Actual downloadable colored PDF:** Replaced fake export behavior with jsPDF generation, structured header, KPI blocks, tables, ESG bars, and page footer.
16. **Building-specific controls:** Added Control devices to A, B, C, with device switches and per-device auto-off timers.
17. **Building C empty despite high load:** Added Library Lights, Library AC, Reading Desk Lamps, Ops Workstation 03.
18. **First uploaded brand logo:** Replaced generic brand lightning in navbar and sidebar.
19. **Footer logo and curve:** Added uploaded logo and roughly 20% curve treatment in footer.
20. **Final circular logo everywhere:** Replaced prior asset in navbar/footer/sidebar and updated favicon historically; final circular identity supersedes old shape treatment.
21. **Four feature upgrades:** Persistent AI presets; Resolve/Auto-Optimize alert actions; CSV export; interactive load/solar simulator.
22. **Responsive overflow correction:** Alert action buttons changed to wrap and flex within available width.
23. **Simulator deletion:** User explicitly removed the entire Energy Simulator and Solar Mode section. Other three upgrades remain.
24. **Real signed-in identity:** Added user hook; top bar, dropdown, Settings, and dashboard name now use the current account; sign out is real.
25. **Chrome login/access problem:** Google return changed from home to `/login`, where session handling redirects to `/app`. Fresh end-to-end confirmation remains unverified.
26. **Current request:** Produce this complete, deeply detailed master prompt covering all original instructions, later changes, final decisions, actual behavior, and remaining gaps.

Casual greetings and devotional conversation did not request SEON feature changes and must not be turned into product copy or functionality.

## 18. Deployment and external-hosting context

Current primary published address:

https://seon-ai-devansh.lovable.app

The app's present service configuration is managed through Lovable Cloud and Lovable AI.

The user previously considered downloading the code and hosting it using GitHub/Vercel with a personal Google API key.

Important distinctions:

- Exporting source does not make all managed service settings, secrets, or OAuth configuration portable automatically.
- Do not claim all external hosting is impossible; evaluate the actual service connection, allowed origins, secret provisioning, adapter, and provider configuration.
- Do not claim that merely pasting a Google key into the current code will switch providers. The current integration uses Lovable AI Gateway, not direct Gemini SDK requests.
- A direct personal Gemini-key adaptation was discussed but never finalized in code.
- Do not include a service-role key or backend password in an export prompt. They are not available to the user on Lovable Cloud.
- Managed keys, external origin handling, OAuth return URLs, and server runtime configuration need explicit validation for any future host.
- Use public same-origin callback URLs for social sign-in and navigate to the protected workspace only after the session is established.
- Current badge settings and custom-domain status require an actual settings read; historical chat alone is not a fresh verification.

## 19. QA acceptance checklist for the desired completed experience

This section defines what to verify if completing or rebuilding the product. It is not a statement that each item already passed.

### Identity/navigation

- Final circular uploaded logo appears in every true brand position.
- Sidebar SEON click returns home.
- Footer developer credit exactly names Devansh Saxena.
- AI Assistant and ESG public links reach the correct app pages.
- Mobile menu and sidebar open/close correctly.
- No placeholder navigation is described as a completed content page.

### Authentication

- Create an account with valid data.
- Invalid email rejected.
- Password shorter than six characters rejected.
- Blank signup display name rejected.
- Password sign-in succeeds for a real test account.
- Wrong password produces useful feedback.
- Real Google OAuth returns to a public callback and establishes a session.
- Chrome can reach the workspace afterward.
- Signed-out app navigation returns to login without leaking workspace data.
- Existing-session login navigation returns to app.
- Current-user name/email/avatar match the actual account.
- Sign out clears access.
- Hosted signup-confirmation settings are checked before claiming immediate login.
- Profile privacy prevents cross-user email reads.

### Dashboard

- KPIs render without hydration errors.
- Charts are nonblank and resize correctly.
- Resolve updates a concrete alert's status and open count.
- Auto-Optimize updates a concrete alert's simulated status.
- Buttons stay within each alert at desktop/tablet/mobile sizes.
- Removed simulator and Solar Mode are absent.
- Demo activity and savings are labeled honestly.

### Monitoring

- Exactly three building summary cards.
- A opens only A's five representative devices.
- B opens only B's three representative devices.
- C opens its four representative devices, not an empty list.
- Toggle state reads back in the dialog and Devices tab.
- A 5-minute timer selects ON and displays countdown.
- Expiry turns that device OFF and clears timer.
- Turning OFF manually cancels its timer.
- No timer clears a schedule without unexpectedly changing power.
- Timer limitations after navigation/reload are disclosed.
- Building filtering works correctly on every intended tab if completed.
- Long tables fit or scroll on narrow screens.

### AI

- Real user question submits once.
- Streamed response becomes visible.
- Presets submit their exact text.
- Simple question gets a scoped concise answer.
- Explicitly detailed question can receive detail.
- Requested table renders as a table.
- No raw decorative asterisk clutter.
- Busy state prevents duplicate sends.
- Visible error and retry behavior if completing the current gap.
- Chat cannot claim access to current device state unless that context is actually supplied.
- Verify server caller identity and abuse protections if hardening the API.

### Reports

- Preview opens selected report metadata.
- PDF button causes an actual `.pdf` download.
- PDF opens and includes header, KPIs, executive summary, building table, recommendations, ESG bars, footer, and pages.
- Long titles and symbols render cleanly.
- CSV button causes an actual `.csv` download.
- CSV contains report metadata, metrics, and three building rows.
- Selected report metadata survives into both export formats.
- Simulated Generate does not falsely imply a persisted report unless implemented.
- Hardcoded recipient and displayed sizes are not mistaken for real personalized values.

### Settings/theme

- Logged-in identity is displayed correctly.
- Theme changes across app and survives refresh.
- Other switches are clearly prototype controls unless connected and persisted.
- Profile-save confirmation is not claimed as a real update unless tested by saving and reading back.
- Language, reduced motion, compact density, email alerts, and AI tone only count as implemented if they actually affect the corresponding experience.

### Accessibility/performance/reliability

- Test representative widths such as 360, 390, 768, 950, 1280, and 1440 pixels.
- No page-level horizontal overflow from buttons, names, tables, or chat.
- Keyboard navigation and focus visibility.
- Meaningful labels for icon-only controls.
- Contrast in both themes.
- Motion respects reduced-motion preference if implemented.
- No console/runtime/build errors.
- SSR and browser data are deterministic.
- Unique content-page metadata if completing SEO.
- Test service-backed flows with a real signed-in session—not only a signed-out screenshot.

## 20. Final implementation/documentation instruction

When using this prompt:

1. Preserve SEON's existing identity and final user decisions.
2. Keep the premium working-MVP scope.
3. Do not re-add removed features.
4. Do not force a different framework.
5. Use the sample data exactly when reproducing this demonstration, or clearly explain changed fixture scopes.
6. Separate real integrations, working local interactions, simulated data, and unfinished controls.
7. Do not fabricate completed features, user testing, measured savings, enterprise certifications, or production readiness.
8. If asked to improve the app, implement only that requested improvement and test its real flow.
9. If asked to summarize it, include the completed features and limitations rather than repeating unsupported landing claims.
10. If asked to rebuild the desired final experience, treat incomplete original requirements as a backlog requiring implementation and verification—not as features that already exist.

### Compact canonical product description

**SEON is a premium AI-powered Smart Energy Optimization Network MVP with a public website, real email/Google account sign-in, personalized user identity, a demo energy dashboard, building/room/device monitoring, local per-device power controls and auto-off timers, concise Gemini-based streamed chat with properly rendered Markdown and requested tables, ESG visualizations, and real downloadable styled PDF/CSV reports. It supports persistent light/dark themes and responsive navigation. Hardware telemetry, ESG accounting, savings, alert automation, and many settings are simulated or incomplete; the removed Energy Simulator and Solar Mode are not part of the final interface.**

# COPY-PASTE MASTER PROMPT ENDS HERE
