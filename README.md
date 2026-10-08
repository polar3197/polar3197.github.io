# polar3197.github.io

Personal site (Jekyll). Pushing to `main` publishes it to https://charlie-cooper.vercel.app (Vercel builds it per `vercel.json` + `Gemfile`); GitHub Pages still mirrors it at polar3197.github.io.

- **Content:** bio in `index.md`; `_data/projects.yml` and `_data/paintings.yml` (painting images live in `assets/img/paintings/`). Nav links + their keyboard shortcuts: `_data/nav.yml`.
- **Styles:** all colors, widths, spacing and motion are tokens at the top of `assets/style.css`.
- **Components** (`_includes/`): `nav.html`, `carousel.html` (used by projects and paintings, with `project-slide.html` / `painting-slide.html`), `slot.html` (wireframe placeholder).
- **Behaviour:** `assets/shortcuts.js` (j/k/l page shortcuts, loaded early), `assets/site.js` (carousel: h / ; keys, position bar, remembered position).
- **Preview locally:** `jekyll serve`, then open http://localhost:4000
