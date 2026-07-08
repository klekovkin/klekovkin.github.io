# cv.klekovkin.com.ua

Personal CV and fundraiser page for Iurii Klekovkin, hosted on GitHub Pages.

## Structure

**Landing + CV:**

- `index.html` — landing stub
- `index-prev.html` — Middle CV (UA), kept for reference
- `en.html` — Middle CV (EN)
- `sre-ua.html`, `sre-en.html` — SRE/DevOps CV
- `manager-ua.html`, `manager-en.html` — PM/Manager CV

**Donate family** (159 ОМБР pickup truck fundraiser):

- `donate.html` — canonical donate page (v7 editorial design)
- `donate/index.html` — pretty URL redirect to `/donate.html`
- `donate-v7.html`, `donate-v7/index.html` — byte-identical copy for legacy shared links
- `appreciation.html` — generic thank-you
- `a.html` — Monobank-specific thank-you
- `appreciationofcancel.html` — cancel/abandon page

**Backend:**

- `jar-proxy/` — Cloudflare Worker that reads the Monobank jar via the personal API and exposes a public CORS endpoint for the progress bar. See `jar-proxy/README.md`.

**Assets:**

- `profile.png`, `159ombr-emblem.png`, `mono-pickup-qr.png`, `photo.jpg`
- Favicon set: `favicon.ico`, `favicon.png`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, `android-chrome-192.png`
- `CNAME` — `cv.klekovkin.com.ua`

## Deployment

Push to `master` — GitHub Pages serves from root. No build step.

Active working branch: `wip-landing`.

## Editing

Edit HTML files directly. All CV pages are self-contained with embedded styles.
`donate.html` and `donate-v7.html` are byte-identical — keep them in sync.
