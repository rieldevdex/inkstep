/** Organisms: page sections composed from atoms and molecules. */
import { html } from '../lib/html.js';
import { Button, Dot, Icon, InkStroke, Label, Wordmark } from './atoms.js';
import { EventRow, FilterBar, PathItem, StatTile, StepItem, TeamCard } from './molecules.js';
import { countByGroup, selectVisibleTeams } from '../state/selectors.js';

export function SiteHeader({ site, state }) {
  return html`<header class="header" data-menu-open="${state.menuOpen ? 'true' : 'false'}">
  <div class="header__inner">
    <a class="header__mark" href="#top" aria-label="Inkstep, back to top">${Wordmark({ size: 'sm' })}</a>
    <nav class="header__nav" id="site-nav" aria-label="Main">
      <ul>${site.nav.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
    </nav>
    <div class="header__actions">
      <button type="button" class="iconbtn" data-action="theme" aria-label="Switch light or dark theme">${Icon('sun')}${Icon('moon')}</button>
      <a class="btn btn--solid btn--sm header__join" href="#join">Join</a>
      <button type="button" class="iconbtn header__menu" data-action="menu" aria-controls="site-nav" aria-expanded="${state.menuOpen ? 'true' : 'false'}" aria-label="Menu">${Icon(state.menuOpen ? 'close' : 'menu')}</button>
    </div>
  </div>
</header>`;
}

export function Hero({ site }) {
  const { hero, featured } = site;
  const last = hero.lines.length - 1;
  return html`<section class="hero" id="top" aria-labelledby="hero-title">
  <canvas class="hero__ink" aria-hidden="true"></canvas>
  <div class="container hero__inner">
    ${Label({ text: hero.eyebrow })}
    <h1 class="hero__title" id="hero-title">${hero.lines.map((line, i) => html`<span class="hero__line" style="--i:${i}"><span>${line}${i === last ? Dot({ className: 'hero__dot' }) : ''}</span></span>`)}</h1>
    ${InkStroke({ className: 'hero__stroke' })}
    <div class="hero__grid">
      <p class="hero__lede">${hero.lede}</p>
      <p class="hero__slogan"><span lang="vi">${site.slogan.vi}</span><span class="hero__slogan-en">${site.slogan.en}</span></p>
      <div class="hero__ctas">
        ${Button({ href: featured.url, text: `Try ${featured.name}`, external: true, cursor: 'Visit' })}
        ${Button({ href: '#join', text: 'Join the club', variant: 'ghost' })}
      </div>
    </div>
    <dl class="hero__meta">${hero.meta.map((m) => html`<div><dt>${m.k}</dt><dd>${m.v}</dd></div>`)}</dl>
  </div>
  <a class="ribbon" href="${featured.url}" target="_blank" rel="noopener" data-cursor="Visit">Now building — ${featured.name}</a>
</section>`;
}

export function Ticker({ items }) {
  const row = (hidden) => html`<ul class="ticker__row"${hidden ? html` aria-hidden="true"` : ''}>${items.map((t) => html`<li>${t}</li>`)}</ul>`;
  return html`<div class="ticker" aria-label="What we stand for"><div class="ticker__track">${row(false)}${row(true)}</div></div>`;
}

export function FeaturedProject({ featured }) {
  return html`<section class="band band--inverse featured" id="work" aria-labelledby="work-title">
  <div class="container">
    <div class="featured__head">
      ${Label({ text: featured.label })}
      <span class="status"><span class="status__pulse" aria-hidden="true"></span>${featured.status}</span>
    </div>
    <h2 class="featured__name" id="work-title">${featured.name}</h2>
    <div class="featured__grid">
      <a class="preview" href="${featured.url}" target="_blank" rel="noopener" data-cursor="Visit" title="Open ${featured.host}">
        <span class="preview__bar" aria-hidden="true"><span></span><span></span><span></span><span class="preview__url">${featured.host}</span></span>
        <img class="preview__shot" src="${featured.screenshot.src}" srcset="${featured.screenshot.src} 1000w, ${featured.screenshot.src2x} 2000w" sizes="(max-width: 1024px) 92vw, 46vw" width="${featured.screenshot.width}" height="${featured.screenshot.height}" alt="${featured.screenshot.alt}" loading="lazy" decoding="async">
      </a>
      <div class="featured__body">
        <p class="featured__summary">${featured.summary}</p>
        <div class="stats">${featured.stats.map(StatTile)}</div>
        <p class="featured__plan">${featured.plan}</p>
        ${Button({ href: featured.url, text: featured.host, variant: 'inverse', external: true, cursor: 'Visit' })}
      </div>
    </div>
  </div>
</section>`;
}

export function TeamsList({ site, state }) {
  return html`${selectVisibleTeams(state, site.teams).map((team) => TeamCard({ team, index: site.teams.indexOf(team) }))}`;
}

export function TeamsGrid({ site, state }) {
  const visible = selectVisibleTeams(state, site.teams).length;
  return html`<section class="band teams" id="teams" aria-labelledby="teams-title">
  <div class="container">
    <div class="section-head">
      ${Label({ text: 'Six teams' })}
      <h2 class="section-title" id="teams-title">One product, built like a small startup</h2>
    </div>
    <div class="teams__bar">
      ${FilterBar({ filters: site.teamFilters, active: state.teamFilter, counts: countByGroup(site.teams) })}
      <p class="teams__count" role="status" aria-live="polite" data-slot="team-count">Showing ${visible} of ${site.teams.length}</p>
    </div>
    <div class="teams__grid" data-slot="teams">${TeamsList({ site, state })}</div>
  </div>
</section>`;
}

export function ProcessTrack({ process }) {
  return html`<section class="band process" id="process" aria-labelledby="process-title">
  <div class="container">
    <div class="section-head">
      ${Label({ text: 'How we work' })}
      <h2 class="section-title" id="process-title">${process.title}</h2>
    </div>
    <ol class="steps" data-slot="steps">${process.steps.map((step, i) => StepItem({ step, index: i, total: process.steps.length }))}<li class="steps__end" aria-hidden="true">${Dot()}</li></ol>
    <p class="process__note">${process.note}</p>
  </div>
</section>`;
}

export function EventsList({ events }) {
  return html`<section class="band events" id="events" aria-labelledby="events-title">
  <div class="container">
    <div class="section-head">
      ${Label({ text: 'Every school year' })}
      <h2 class="section-title" id="events-title">Four events, two open to the whole school</h2>
    </div>
    <ol class="events__list">${events.map((event, index) => EventRow({ event, index }))}</ol>
  </div>
</section>`;
}

export function JoinBand({ site }) {
  const { join } = site;
  return html`<section class="band band--inverse join" id="join" aria-labelledby="join-title">
  <div class="container join__grid">
    <div class="join__intro">
      ${Label({ text: 'Join Inkstep' })}
      <h2 class="join__title" id="join-title">${join.title}</h2>
      <p class="join__who">${join.who}</p>
      ${site.applyUrl
        ? Button({ href: site.applyUrl, text: 'Apply now', variant: 'inverse', external: true, cursor: 'Apply' })
        : html`<p class="join__soon">${join.soon}</p>`}
    </div>
    <ol class="path">${join.path.map((step) => PathItem({ step }))}</ol>
  </div>
</section>`;
}

export function SiteFooter({ site }) {
  return html`<footer class="footer">
  <div class="container">
    <p class="footer__mark">${Wordmark({ size: 'xl' })}</p>
    <div class="footer__row">
      <p lang="vi">${site.nameVi}</p>
      <ul class="footer__links">
        <li><a href="${site.featured.url}" target="_blank" rel="noopener">${site.featured.host}</a></li>
        <li><a href="#top">Back to top</a></li>
      </ul>
    </div>
  </div>
</footer>`;
}
