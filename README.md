# inkstep.site

Static site for the Inkstep student club. Design rules: see `DESIGN.md`.

## Upload only `dist/`
`dist/` is the finished website (index.html, assets/, favicon.svg). Upload that folder to Cloudflare Pages
(or any static host). Nothing else is needed on the server.

## Editing
- Text and links: `src/content/site.js` (set `applyUrl` to the form link to show an "Apply now" button).
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
