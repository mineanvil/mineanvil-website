# MineAnvil Static Site — Deploy Guide

This folder contains a **static, one-page** site (no frameworks, no build step).

## What’s included

- `index.html` — single page
- `styles.css` — responsive styles with light/dark via `prefers-color-scheme`
- `script.js` — minimal JS (mobile nav, smooth scrolling, mailto form)
- `robots.txt` — allow all
- `sitemap.xml` — homepage only
- `assets/` — placeholder logo + OG image

## Deploy to cPanel (`public_html`)

1. In cPanel, open **File Manager**.
2. Go to `public_html/` (or a subfolder if you’re deploying to a subdomain/addon domain).
3. Upload **the contents of the `site/` folder**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `robots.txt`
   - `sitemap.xml`
   - `assets/` (folder)
4. Ensure the `assets/` folder is at:
   - `public_html/assets/logo-placeholder.svg`
   - `public_html/assets/og-image-placeholder.svg`
5. Visit your domain and hard-refresh (Ctrl+F5) if you don’t see changes.

## Deploy to S3 / Nginx / Netlify

- **S3**: upload the same files and set `index.html` as the index document.
- **Nginx**: serve the `site/` directory as the web root.
- **Netlify**: set the publish directory to `site/` (no build command).

## Test locally (no build)

From the project root, run:

```bash
cd site
python -m http.server 8080
```

Then open: `http://localhost:8080`

### Windows-friendly version

```powershell
cd site
py -m http.server 8080
```

## Where to edit the email address

- **Contact form mailto target**: edit `to = "hello@mineanvil.example"` in `script.js`
- **Visible email links**: search for `hello@mineanvil.example` in `index.html`

## Where to edit the canonical domain / OG URL

In `index.html`, update these placeholders:

- `<link rel="canonical" href="https://mineanvil.example/">`
- `og:url`
- `og:image` (point to your real domain)
- Twitter image URL
- JSON-LD `url` and `logo` URLs

In `sitemap.xml`, update:

- `<loc>https://mineanvil.example/</loc>`

## Checklist before going live

- [ ] Replace `https://mineanvil.example/` with your real domain (canonical + OG + JSON-LD + sitemap)
- [ ] Replace `hello@mineanvil.example` with your real email address (HTML + JS)
- [ ] Replace `assets/logo-placeholder.svg` with your logo
- [ ] Replace `assets/og-image-placeholder.svg` with a real Open Graph image
- [ ] Confirm the mobile nav opens/closes and links scroll correctly
- [ ] Confirm the contact form opens your mail app with prefilled subject/body


