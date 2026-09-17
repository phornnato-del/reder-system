# AssetLine

Front-end prototype for a rental & asset booking marketplace (vehicles, equipment,
property, event spaces). Built as a static HTML/CSS/JS app — no build step, no
backend. All data lives in memory in `js/app.js` and resets on page reload.

## Running it

Just open `index.html` in a browser. No server needed, but if you want one anyway:

```
npx serve .
```

## Structure

```
index.html      page shell + layout markup
css/style.css   design tokens, components, responsive rules
js/app.js       app state, mock data, view renderers, event handlers
```

## What's in here

- Marketplace browsing with type filters and a booking-request flow
- Owner listing management (create/edit/delete, submit-for-approval)
- Availability calendar (block/unblock dates) + tiered pricing
- Booking lifecycle: requested → accepted → active → completed/cancelled
- Damage deposit ledger: hold, release, partial deduction
- Pre/post-rental condition reports with severity flags and sign-off
- Late return tracking + penalty calculation + dispute handling
- Reviews and a composite trust score gauge
- Revenue/utilization analytics + owner payout report
- Role & permission matrix (Admin / Owner / Renter / Inspector / Finance)
- Activity log with category filters

Switch roles from the top-right pill — it actually changes which nav items and
actions you can see, as a stand-in for the real backend's access control.

## Notes / next steps

- Wire up a real API instead of the in-memory `assets`/`bookings`/etc. arrays
- Replace the emoji thumbnails with real asset photos
- Hook file inputs (insurance docs, photo evidence) up to actual storage
- Add auth instead of the role-switcher shortcut
