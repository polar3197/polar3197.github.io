# polar3197.github.io

Personal site, built by GitHub Pages (Jekyll). Pushing to `main` publishes it.

- **Content:** `_data/projects.yml` and `_data/paintings.yml` (painting images live in `assets/img/paintings/`). Nav links + their keyboard shortcuts: `_data/nav.yml`.
- **Styles:** all colors, widths, spacing and motion are tokens at the top of `assets/style.css`.
- **Components** (`_includes/`): `nav.html`, `carousel.html` (used by projects and paintings, with `project-slide.html` / `painting-slide.html`), `slot.html` (wireframe placeholder).
- **Behaviour:** `assets/shortcuts.js` (j/k/l page shortcuts, loaded early), `assets/site.js` (carousel: h / ; keys, position bar, remembered position).
- **Preview locally:** `jekyll serve`, then open http://localhost:4000
