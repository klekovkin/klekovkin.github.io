# CLAUDE.md

## Project overview

Personal website for Iurii Klekovkin hosted on GitHub Pages at `cv.klekovkin.com.ua`.

Two concerns live in this repo:

1. **CV pages** — six variants (3 career directions × 2 languages). `index.html` is a separate landing stub; the old CV root was moved to `index-prev.html`.
2. **Donate family** — live fundraiser for a pickup truck for 159 ОМБР, with a Cloudflare Worker backing the progress bar.

## Architecture

- **Pure static site** — no build system, no bundler, no framework. Each HTML file embeds its own `<style>`.
- **GitHub Pages** — push to `master`; served from root. The `wip-landing` branch is the active working branch for donate-family and landing work.
- **Custom domain** — `cv.klekovkin.com.ua` (`CNAME`).
- **One backend piece** — `jar-proxy/` is a Cloudflare Worker that reads the Monobank jar balance and transaction count via the personal API and exposes a public CORS endpoint. Deployed at `https://jar-proxy.klekovkin.workers.dev/`.

## Top-level URLs

| URL | Serves | Notes |
|---|---|---|
| `/` | `index.html` | Landing stub ("Сайт в розробці"). Not the CV. |
| `/en.html`, `/sre-ua.html`, `/sre-en.html`, `/manager-ua.html`, `/manager-en.html` | CV variants | See below. |
| `/donate` | `donate/index.html` → redirects to `/donate.html` | Pretty URL. |
| `/donate.html` | Canonical donate page (v7 editorial design) | Live. |
| `/donate-v7`, `/donate-v7.html` | Byte-identical copy of canonical | Kept alive because external links were already shared. |
| `/appreciation.html` | Generic thank-you page | Lands here after any successful payment rail. |
| `/a.html` | Monobank-specific thank-you variant | Links back to `/donate`. |
| `/appreciationofcancel.html` | Cancel/abandon page with interactive "other rails" chips | Chips link to `/donate#tab-mono|paypal|crypto`. |

## CV pages

### Variants

- **Middle (blended, ATS-broad):** `index-prev.html` (UA — historical root), `en.html` (EN)
- **SRE/DevOps:** `sre-ua.html`, `sre-en.html` — infrastructure emphasis
- **PM/Manager:** `manager-ua.html`, `manager-en.html` — leadership emphasis

### Navigation rules

- Language toggle on each CV: UA ↔ EN, same direction
- No cross-direction links
- Military service (159 ОМБР) block appears only on Ukrainian variants, hidden by default

### Shared sidebar

- Contact: iurii@klekovkin.com.ua, +380 93 779 1847, in/klekovkin, depomytymoped
- Education: Bachelor CS, KPI, 2001–2019
- Languages: UA (Native), EN (Professional), RU (Beginner — intentional political positioning)
- Donate banner + footer link to `donate.html`

### CV design

- CSS Grid two-column (main + sidebar)
- Teal/cyan palette (`--color-primary: #42A8C0`)
- Gold donate banner in sidebar, full-width `<a>`
- Mobile breakpoint 767px

## Donate family — v7 editorial design

Canonical page is `donate.html` (same bytes as `donate-v7.html`). Design language extends across `a.html`, `appreciation.html`, `appreciationofcancel.html`.

### Design tokens

```
--navy #1b2a6b    --gold #e3a42a         --paper #fbfaf5
--navy-deep #0e1847   --gold-deep #8a5f10    --paper-tint #f2efe4
--navy-ink #0a1235    --gold-soft #fbf1d9    --rule #d9d4bf
                                             --rule-strong #a69e7d
```

### Typography

- **Display:** Unbounded
- **Body:** Manrope
- **Mono:** JetBrains Mono

### Layout language

- Editorial, heraldic, bilingual UA-dominant (UA first, EN secondary).
- Tabbed rails section (Monobank / PayPal / Crypto) with hash-based deep-linking: `/donate#tab-mono`, `/donate#tab-paypal`, `/donate#tab-crypto`. The tab IIFE listens for `hashchange` and calls `scrollIntoView({behavior:'smooth'})` on the rails container.
- `about-head` and `rails-head` both use the same pattern: **title on the left, eyebrow tag on the right.**
- Progress panel uses a true soft radial watermark (520×520, blurred) — **do not** shrink it back to a small inset radial; edge-clipping produced a visible yellow square before.
- Primary CTA hover: `background: var(--gold); color: #fff; border-color: var(--gold-deep)` + small `translateY(-2px)` and layered gold shadow. Secondary rails use `gold-soft` background on hover. Never swap text to navy on hover — that was explicitly rejected.

### Progress bar — data flow

```
donate.html  ──fetch──▶  jar-proxy Worker  ──X-Token──▶  Monobank /personal/client-info
                                            ──X-Token──▶  Monobank /personal/statement/{jarId}/{from}
```

Response shape from the worker:

```json
{
  "balance_uah": 12345.67,
  "goal_uah": 400000,
  "title": "159 ОМБР pickup",
  "donors_count": 42,
  "truncated": false,
  "updated_at": 1713530000000
}
```

- `donors_count` = count of positive-amount transactions since `START_UNIX` (fundraiser start).
- Edge-cached 60s (`caches.default`); Monobank's own rate limit is 1 req / 60s per endpoint per token.
- `MANUAL_USD` env var on the worker adds off-Monobank rails (PayPal, BTC, ETH) to the USD total. Bump manually when a PayPal/crypto donation email lands — PayPal automation is blocked by needing a Business account + Transaction Search API.

### Payment rails

- **Monobank** — jar `send.monobank.ua/jar/4NK9pJCJw3`, UAH, automated via jar-proxy
- **PayPal** — USD + EUR, manual tracking
- **Crypto** — USDT TRC20, BTC, ETH, manual tracking

## jar-proxy/ — Cloudflare Worker

```
jar-proxy/
├── src/index.js         # fetch handler: client-info → statement → CORS JSON
├── wrangler.toml        # name, vars, JAR_SEND_ID, START_UNIX, ALLOWED_ORIGINS
├── package.json
└── README.md
```

Secrets (set via `wrangler secret put`, never committed):
- `MONO_TOKEN` — Monobank personal API token

Vars in `wrangler.toml`:
- `JAR_SEND_ID` — e.g. `jar/4NK9pJCJw3`
- `START_UNIX` — Unix seconds of fundraiser start
- `ALLOWED_ORIGINS` — CSV of allowed CORS origins

**Autonomous deploy is authorized** for this worker — run `wrangler deploy` from `jar-proxy/` after edits without asking (see memory `feedback_worker_deploy.md`). Scope: `jar-proxy/src/**` and `wrangler.toml` only. Still confirm before rotating secrets, changing routes, or touching anything else.

## Favicon set

Generated from `profile.png` (Lanczos-resampled for the larger sizes, since source is 150×150):

- `favicon.ico` (16/32/48 bundle)
- `favicon.png` (32×32), `favicon-16.png`, `favicon-32.png`
- `apple-touch-icon.png` (180×180)
- `android-chrome-192.png` (192×192)

Wired across all donate-family pages via a standard `<link rel="icon">` block.

## Key files

| File | Purpose |
|---|---|
| `index.html` | Landing stub — not a CV |
| `index-prev.html` | Old Middle CV (UA), retained for reference |
| `en.html` | CV — Middle, EN |
| `sre-ua.html`, `sre-en.html` | CV — SRE direction |
| `manager-ua.html`, `manager-en.html` | CV — PM direction |
| `donate.html` | Canonical donate page (v7 design) |
| `donate-v7.html`, `donate-v7/index.html` | Byte-identical copy for legacy shared links |
| `donate/index.html` | Pretty-URL redirect to `/donate.html` |
| `appreciation.html` | Thank-you (any rail) |
| `a.html` | Thank-you (Monobank-specific) |
| `appreciationofcancel.html` | Cancel/abandon page |
| `concepts/` | Three exploratory concept HTMLs (editorial / terminal / swiss) |
| `jar-proxy/` | Cloudflare Worker (see above) |
| `profile.png` | CV + favicon source (150×150) |
| `159ombr-emblem.png` | 159 ОМБР emblem (Wikimedia Commons) |
| `mono-pickup-qr.png`, `photo.jpg` | Donate-page assets |
| `CNAME` | GitHub Pages domain |
| `Klekovkin_Yuriy_CV_SRE_UA.pdf` | SRE CV source PDF (gitignored actually — *.pdf) |

## Branches

- `master` — what GitHub Pages serves
- `wip-landing` — active working branch for donate-family and landing changes

Ship cycle: work on `wip-landing`, PR/merge to `master` when ready.

## Conventions

- No build tools — edit HTML directly.
- No external JS/CSS libraries. Inline SVG icons.
- All pages are self-contained — no shared CSS files.
- Ukrainian is primary; English is secondary (UA first on bilingual strings).
- Commit prefixes follow `feat(donate-v7): …`, `style(donate): …`, `chore(assets): …`, `refactor(…)`. Keep the subject imperative and scoped.
- When editing `donate.html` or `donate-v7.html`: they are byte-identical copies. Edit both in lockstep, or `cp donate-v7.html donate.html` after a v7 edit.
- For bundler-template rewrites (HTML stored as JSON string inside `<script type="__bundler/template">`), round-trip with Python: `json.loads` → modify → `json.dumps(..., ensure_ascii=False).replace("</", "<\\u002F")` to keep the outer `</script>` intact.
