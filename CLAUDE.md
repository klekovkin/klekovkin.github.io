# CLAUDE.md

## Project overview

Personal website for Iurii Klekovkin hosted on GitHub Pages at `cv.klekovkin.com.ua`. Two pages:

- `index.html` — CV page (self-contained HTML + embedded CSS, zero JS)
- `donate.html` — Donation page for 159 ОМБР pickup truck fundraiser ($10,000 USD goal)

## Architecture

- **Pure static site** — no build system, no frameworks, no dependencies except Google Fonts (Roboto)
- **Single-file pages** — each HTML file contains its own embedded `<style>` block
- **GitHub Pages** — push to `master` branch, served from root automatically
- **Custom domain** — `cv.klekovkin.com.ua` (CNAME file)

## Design system

### CV page (`index.html`)
- CSS Grid two-column layout (main + sidebar)
- Color palette: teal/cyan (`--color-primary: #42A8C0`)
- Gold donate banner in sidebar (full-width clickable `<a>` block)
- Donate link in footer
- Mobile breakpoint: 767px

### Donate page (`donate.html`)
- Single-column centered layout (max-width: 720px)
- Color palette derived from 159 ОМБР emblem: navy blue (`#000080`) + gold (`#FBB03B`)
- Official 159 ОМБР emblem in header
- Payment methods: Monobank jar, PayPal (USD + EUR), Crypto (USDT TRC20, BTC, ETH)
- Soldier photo placeholder in story section
- Minimal JS: clipboard copy + dynamic progress bar (USDT via TronGrid API)
- Bilingual: Ukrainian first, English below

## Key files

| File | Purpose |
|------|---------|
| `index.html` | CV page |
| `donate.html` | Donation/fundraiser page (4 payment methods: Monobank, PayPal USD/EUR, Crypto) |
| `profile.png` | CV profile photo |
| `159ombr-emblem.png` | Official 159 ОМБР emblem (from Wikimedia Commons) |
| `soldier.jpg` | **TODO** — soldier photo for donate page |
| `CNAME` | GitHub Pages domain: cv.klekovkin.com.ua |

## Donate page — placeholders to replace

These values in `donate.html` need real data:

| Placeholder | Location | What to replace with |
|-------------|----------|---------------------|
| `MONOBANK_JAR_URL` in href | Monobank section | `https://send.monobank.ua/jar/XXXXX` |
| `PAYPAL_USD_PLACEHOLDER` in href | PayPal section | PayPal.me or payment link (USD) |
| `PAYPAL_EUR_PLACEHOLDER` in href | PayPal section | PayPal.me or payment link (EUR) |
| `USDT_TRC20_ADDRESS` | Crypto section + script | USDT TRC20 wallet address |
| `BTC_ADDRESS` | Crypto section | Bitcoin wallet address |
| `ETH_ADDRESS` | Crypto section | Ethereum wallet address |
| `MONO_JAR_ID` in script | Progress bar script | Monobank jar sendId |
| `MANUAL_USD` in script | Progress bar script | Sum of PayPal+BTC+ETH in USD |
| Photo placeholder div | Story section | Replace with `<img class="soldier-photo" src="soldier.jpg">` |
| QR placeholder divs | Crypto cards | Generate SVG QR codes for each address |

## Donate page — progress bar

The progress bar auto-updates from:
- **USDT (TRC20)** — live via TronGrid API (CORS-friendly, no auth)
- **Monobank** — blocked by CORS, returns 0 until a proxy is set up

Manually tracked via `MANUAL_USD` variable:
- PayPal, BTC, ETH donations

Config in the `<script>` block at bottom of `donate.html`:
- `UAH_USD_RATE` — approximate exchange rate (update periodically)
- `MANUAL_USD` — manually tracked total in USD

## Conventions

- No build tools — edit HTML directly
- No external JS/CSS libraries
- Inline SVG icons (Font Awesome paths)
- Both pages are self-contained — no shared CSS files
- Ukrainian language primary on donate page, English secondary
