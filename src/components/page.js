/** Template: assembles organisms into the page body. */
import { html } from '../lib/html.js';
import { EventsList, FeaturedProject, Hero, JoinBand, ProcessTrack, SiteFooter, SiteHeader, Ticker, TeamsGrid } from './organisms.js';

export function Page({ site, state }) {
  return html`<a class="skip" href="#main">Skip to content</a>
${SiteHeader({ site, state })}
<main id="main">
${Hero({ site })}
${Ticker({ items: site.ticker })}
${FeaturedProject({ featured: site.featured, state })}
${TeamsGrid({ site, state })}
${ProcessTrack({ process: site.process })}
${EventsList({ events: site.events })}
${JoinBand({ site })}
</main>
${SiteFooter({ site })}
<div class="cursor" aria-hidden="true"><span class="cursor__label"></span></div>`;
}
