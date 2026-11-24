# Element.dev — Personal Portfolio

Personal portfolio website for **Ahmad Firdaus Bin Ahmad Sarip (Element)** — IT Student and Mobile & Desktop App Developer.

- **Live site:** https://theelement45.github.io/portfolio/
- **Stack:** Semantic HTML5, Tailwind CSS v4 (CLI build), vanilla ES6+ JavaScript, inline SVG icons, and Formspree contact form.

## Local Development

Install dependencies and build the minified stylesheet:

```bash
npm install
npm run build
```

For live CSS rebuilds while editing `index.html`, `404.html`, or `src/input.css`:

```bash
npm run watch:css
```

> **Note for GitHub Pages:** The compiled `css/styles.css` is committed so GitHub Pages serves the site directly as static files without requiring a CI build step.

## Adding Project Screenshots

Each project card in `index.html` includes a commented `<picture>` slot ready for screenshots. Add WebP (and optional PNG fallback) images at `1200×750` (16:10) into `asset/projects/`:

- `asset/projects/isolat.webp`
- `asset/projects/crystalcable.webp`
- `asset/projects/slatehud.webp`
- `asset/projects/attendin.webp`
- `asset/projects/convergent.webp`

Then uncomment the `<picture>` block inside the matching card in `index.html`.
