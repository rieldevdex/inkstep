# inkstep.site

Static site for the Inkstep student club. Design rules: see `DESIGN.md`.

## Upload only `dist/`
`dist/` is the finished website (index.html, assets/, favicon.svg). Upload that folder to Cloudflare Pages
(or any static host). Nothing else is needed on the server.
If Cloudflare deploys from this GitHub repository instead, `wrangler.jsonc` tells it to publish `dist/`
as it is, so run `npm run build` and commit `dist/` with every change.

## Editing
- Text and links: `src/content/site.js` (set `applyUrl` to the form link to show an "Apply now" button).
- Eighthundred's numbers: `featured.stats` in `src/content/site.js`. Change `featured.statsNote`
  (the date they were counted) at the same time.
- The Eighthundred preview: `featured.preview` in `src/content/site.js`. See DESIGN.md §9.
- Colors, fonts, spacing: `src/styles/tokens.css` only.

## Commands (Node 20+)
    npm install
    npm run check    # eslint + token lint + unit tests + build
    npm run build    # rebuild dist/ after any change

## Structure
    src/content/     copy (data only)
    src/state/       store, reducer, selectors (pure logic, unit tested)
    src/components/  atoms → molecules → organisms → page (pure functions → HTML)
    src/client/      browser wiring: events, ink canvas, cursor
    src/styles/      tokens, base, atoms, molecules, organisms
    scripts/         build + token lint
    tests/           node:test suites
