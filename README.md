# The Raspberry Collective — website

A static, multi-page site for The Raspberry Collective, built to the brand guide
(raspberry magenta `#A91458`, cream `#F6F5F3`, Fraunces + Lora type). Ready to
deploy on GitHub Pages with no build step.

## Pages
- `index.html` — Home
- `about.html` — About (Mission, Vision, Testimony)
- `our-work.html` — Our Work
- `get-involved.html` — Get Involved
- `donate.html` — Donate (generic placeholder for now)
- `writing.html` — Writing / News (live feed from the Substack)

## Structure
```
the-raspberry-collective/
├── index.html, about.html, ...      (the six pages)
├── css/styles.css                   (shared styles)
├── js/main.js                       (nav, footer year, Substack feed)
├── imgs/                            (all logo + pattern assets)
├── .nojekyll
└── README.md
```
All images live in `imgs/`, exactly as requested.

## Deploy on GitHub Pages
1. Create a repository and add these files at the repo root (keep the folder
   structure — `css/`, `js/`, `imgs/`).
2. Push to GitHub.
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   choose your branch (e.g. `main`) and folder `/ (root)`. Save.
4. Your site publishes at `https://YOUR-USERNAME.github.io/your-repo/`.

## Two things to customize before publishing
1. **Site URL for link previews.** Open `generate.py`'s output is already written,
   so edit each HTML file's `og:image` / `og:url` / `canonical`, OR simpler: do a
   find-and-replace across all `.html` files, replacing
   `https://YOUR-USERNAME.github.io/the-raspberry-collective`
   with your real published URL. This makes the `WideLogo_FullColor.png` preview
   image show correctly when the link is shared via text or social media.
2. **Contact + donation links.**
   - `get-involved.html`: replace the placeholder `hello@theraspberrycollective.org`.
   - `donate.html`: replace the disabled "Donate (coming soon)" button's `href="#"`
     with your giving link when ready.

## Assets used
- Favicon: `imgs/Berries_FullColor_BrowserTransparent.png`
- Social preview image: `imgs/WideLogo_FullColor.png`
- Header/footer logo: `imgs/WideLogo_FullColor_Transparent.png`
- Home hero: `imgs/Logo1_FullColor_Transparent.png`
- CTA band texture: `imgs/PatternDark_FullColor.png`

## The Substack feed
`writing.html` pulls posts live from `https://theraspberrycollective.substack.com/feed`
in the browser. Because GitHub Pages is static, it reads the RSS through public
read-only proxies (allorigins, rss2json) with automatic fallback. If all are
unreachable, it shows a friendly message and a button straight to the Substack —
the page never breaks.

## Notes
- Fonts load from Google Fonts (Fraunces for display, Lora as the Athelas
  substitute named in the brand guide).
- No build tools, no dependencies, fully responsive, keyboard-accessible, and
  respects reduced-motion preferences.
