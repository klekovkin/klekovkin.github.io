# CLAUDE.md

## Project overview

Personal website for Iurii Klekovkin hosted on GitHub Pages at `cv.klekovkin.com.ua`.

Six CV page variants (3 career directions x 2 languages) plus a donation page:

- **Middle (blended):** `index.html` (UA), `en.html` (EN) — ATS-optimized for both SRE and PM
- **SRE/DevOps:** `sre-ua.html` (UA), `sre-en.html` (EN) — technical emphasis
- **PM/Manager:** `manager-ua.html` (UA), `manager-en.html` (EN) — leadership emphasis
- **Donate:** `donate.html` — fundraiser page for 159 ОМБР pickup truck ($10,000 USD goal)

## Architecture

- **Pure static site** — no build system, no frameworks, no dependencies except Google Fonts (Roboto)
- **Single-file pages** — each HTML file contains its own embedded `<style>` block
- **GitHub Pages** — push to `master` branch, served from root automatically
- **Custom domain** — `cv.klekovkin.com.ua` (CNAME file)

## CV pages — structure

### Navigation rules
- **Language toggle** on all CV pages: UA <-> EN (same direction)
- **No direction cross-links** — pages do not link to other career directions

### Content per direction
- All 6 pages share the same experience timeline — difference is emphasis/keywords
- **Middle:** broad ATS keywords, balanced descriptions, soft skills bars + technical skills list
- **SRE:** infrastructure/DevOps/K8s-heavy descriptions, technical skills list prominent, soft skills minimal
- **Manager:** leadership/process-heavy descriptions, soft skills bars prominent, technical skills compact
- **Military service (159 ОМБР):** appears only on Ukrainian versions, hidden by default (visible on click)

### Shared sidebar content (all 6 pages)
- Contact: iurii@klekovkin.com.ua, +380 93 779 1847, in/klekovkin, depomytymoped
- Education: Bachelor CS, KPI, 2001-2019
- Languages: Ukrainian (Native), English (Professional), Russian (Beginner)
- Interests: Continuous growth, AI revolution, Psychology and Therapy, Drones of any kind
- Donate banner + footer link to donate.html

## Design system

### CV pages (all 6)
- CSS Grid two-column layout (main + sidebar)
- Color palette: teal/cyan (`--color-primary: #42A8C0`)
- Gold donate banner in sidebar (full-width clickable `<a>` block)
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
| `index.html` | CV — Middle direction, Ukrainian |
| `en.html` | CV — Middle direction, English |
| `sre-ua.html` | CV — SRE/DevOps direction, Ukrainian |
| `sre-en.html` | CV — SRE/DevOps direction, English |
| `manager-ua.html` | CV — PM/Manager direction, Ukrainian |
| `manager-en.html` | CV — PM/Manager direction, English |
| `donate.html` | Donation/fundraiser page |
| `profile.png` | CV profile photo |
| `159ombr-emblem.png` | Official 159 ОМБР emblem (from Wikimedia Commons) |
| `soldier.jpg` | **TODO** — soldier photo for donate page |
| `CNAME` | GitHub Pages domain: cv.klekovkin.com.ua |
| `Klekovkin_Yuriy_CV_SRE_UA.pdf` | Source PDF for SRE/DevOps content (Ukrainian) |
| `docs/superpowers/specs/2026-04-03-multi-cv-design.md` | Design spec for multi-CV structure |

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
- All pages are self-contained — no shared CSS files
- Ukrainian is the primary language (index.html is UA)
