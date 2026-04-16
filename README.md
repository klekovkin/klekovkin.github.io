# cv.klekovkin.com.ua

Personal CV website for **Iurii Klekovkin** -- SRE / DevOps / Project Manager -- hosted on [GitHub Pages](https://pages.github.com/).

Live at: **[cv.klekovkin.com.ua](https://cv.klekovkin.com.ua)**

## What's here

The site contains **six CV pages** -- three career directions, each in Ukrainian and English:

| Direction | Ukrainian | English |
|-----------|-----------|---------|
| **Blended** (SRE + PM) | [index.html](https://cv.klekovkin.com.ua/) | [en.html](https://cv.klekovkin.com.ua/en.html) |
| **SRE / DevOps** | [sre-ua.html](https://cv.klekovkin.com.ua/sre-ua.html) | [sre-en.html](https://cv.klekovkin.com.ua/sre-en.html) |
| **PM / Manager** | [manager-ua.html](https://cv.klekovkin.com.ua/manager-ua.html) | [manager-en.html](https://cv.klekovkin.com.ua/manager-en.html) |

Plus a **[donation page](https://cv.klekovkin.com.ua/donate.html)** supporting a fundraiser for the 159th Separate Mechanized Brigade of the Ukrainian Armed Forces.

## Tech stack

- Pure HTML + CSS -- no build tools, no frameworks, no bundlers
- Each page is fully self-contained (embedded `<style>` blocks)
- [Google Fonts](https://fonts.google.com/) (Roboto family)
- Inline SVG icons
- Responsive design with CSS Grid (mobile breakpoint at 767px)
- Hosted via GitHub Pages with custom domain

## Project structure

```
.
├── index.html          # Blended CV (Ukrainian)
├── en.html             # Blended CV (English)
├── sre-ua.html         # SRE/DevOps CV (Ukrainian)
├── sre-en.html         # SRE/DevOps CV (English)
├── manager-ua.html     # PM/Manager CV (Ukrainian)
├── manager-en.html     # PM/Manager CV (English)
├── donate.html         # Donation/fundraiser page
├── profile.png         # Profile photo
├── 159ombr-emblem.png  # 159th Brigade emblem
├── favicon.ico / .png  # Site icons
├── CNAME               # GitHub Pages custom domain config
└── concepts/           # Design concept explorations
```

## Local development

No build step is needed. Open any HTML file directly in a browser, or use a local server:

```bash
# Python
python3 -m http.server 8000

# Node.js (if npx is available)
npx serve .
```

Then visit `http://localhost:8000`.

## Deployment

Push to the `master` branch. GitHub Pages serves the site automatically from the repository root -- no CI/CD configuration required.

## Contributing

This is a personal CV site, but if you spot a bug or have a suggestion, feel free to open an issue.

## Support Ukraine

The donation page raises funds for a pickup truck for the **159th Separate Mechanized Brigade** of the Ukrainian Armed Forces. If you'd like to help, visit the [donate page](https://cv.klekovkin.com.ua/donate.html).
