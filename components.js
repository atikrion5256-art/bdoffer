const { icons, logo } = require('./icons');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const themeVars = (t) =>
  `--op-main:${t.main};--op-end:${t.end};--op-rgb:${t.rgb};--op-tint:${t.tint};--op-tint-2:${t.tint2};--op-ink:${t.ink};--op-amt-a:${t.amountA};--op-amt-b:${t.amountB};--op-glow:${t.glow}`;

/* ---------- Hero ---------- */
const Hero3DText = (lines) =>
  lines.map((t, i) => `<span class="d3 ${i ? 'd3--gold' : 'd3--white'}" data-text="${esc(t)}">${esc(t)}</span>`).join('');

const UrgencyBadge = ({ accent, rest }) => `
<div class="urgency">
  <svg class="urgency__clock" viewBox="0 0 64 64" aria-hidden="true">
    <g stroke="#ffc21a" stroke-width="4.5" stroke-linecap="round"><path d="M6 24l9 3"/><path d="M9 11l9 8"/><path d="M22 3l4 10"/></g>
    <circle cx="38" cy="38" r="22" fill="#fff" stroke="#e5141f" stroke-width="5"/>
    <path d="M38 24v15l9 5" fill="none" stroke="#e5141f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="38" cy="38" r="3.2" fill="#e5141f"/>
  </svg>
  <p class="urgency__text"><b>${esc(accent)}</b><span>${esc(rest)}</span></p>
</div>`;

const PhoneMockup = (p, operators) => `
<div class="phone-wrap" aria-hidden="true">
  <div class="phone">
    <i class="phone__btn phone__btn--l1"></i><i class="phone__btn phone__btn--l2"></i><i class="phone__btn phone__btn--r"></i>
    <div class="phone__screen">
      <div class="phone__status"><span>9:41</span><i class="phone__island"></i><span class="phone__sig">${icons.wifi}</span></div>
      <div class="phone__head"><strong>${esc(p.title)}</strong><small>${esc(p.sub)}</small></div>
      <div class="phone__tabs"><b>${p.tabs[0]}</b><span>${p.tabs[1]}</span></div>
      <div class="phone__grid">
        ${operators.map((o) => `
        <div class="phone__tile" style="${themeVars(o.theme)}">
          <span class="phone__logo">${logo(o.id)}</span>
          <strong>${esc(o.name)}</strong><em>${esc(p.tile)}</em>
        </div>`).join('')}
      </div>
      <div class="phone__nav">
        ${p.nav.map((n, i) => `<span class="${i ? '' : 'is-on'}">${icons[n.icon]}<small>${esc(n.label)}</small></span>`).join('')}
      </div>
    </div>
  </div>
  <div class="phone-wrap__reflection"></div>
</div>`;

const OperatorQuickButton = (o) => `
<a class="op-quick op-quick--${o.quick.tone}" href="#${o.id}-data" style="--q-from:${o.quick.from};--q-to:${o.quick.to};--q-text:${o.quick.text}">
  <span class="op-quick__logo">${logo(o.id, o.quick.tone)}</span>
  <span class="op-quick__name">${esc(o.name)}</span>
</a>`;

const HeroBanner = (d) => {
  const h = d.hero;
  const byId = Object.fromEntries(d.operators.map((o) => [o.id, o]));
  const rail = d.railOrder.map((id) => byId[id]);
  return `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__clouds"></div>
    <div class="hero__trees hero__trees--l"></div><div class="hero__trees hero__trees--r"></div>
    <svg class="hero__monument" viewBox="0 0 300 200" preserveAspectRatio="xMidYMax meet">
      <path d="M150 6c10 40 30 110 46 158H104C120 116 140 46 150 6z" fill="#dcecf9"/>
      <path d="M150 6c-3 60-14 118-46 158h20c14-40 22-96 26-158z" fill="#c4dcf1" opacity=".7"/>
      <path d="M96 164c10-40 26-84 36-118-2 44-16 96-30 118zM204 164c-10-40-26-84-36-118 2 44 16 96 30 118z" fill="#d3e6f6" opacity=".9"/>
      <rect x="60" y="164" width="180" height="14" rx="4" fill="#cfe3f4"/>
    </svg>
    <div class="hero__veil"></div><div class="hero__water"></div>
  </div>

  <div class="hero__inner">
    <div class="hero__copy">
      <div class="hero__top">
        <p class="hero__kicker">${esc(h.kicker)}</p>
        ${UrgencyBadge(h.urgency)}
      </div>
      <h1 id="hero-title" class="hero__title">${Hero3DText(h.title)}</h1>
      <p class="hero__lead">${esc(h.lead)}</p>
      <ul class="hero__features">
        ${h.features.map((f) => `<li><span class="hero__ficon hero__ficon--${f.icon}">${icons[f.icon]}</span><span>${esc(f.label)}</span></li>`).join('')}
      </ul>
      <a class="btn-cta" href="${esc(h.cta.href)}"><span>${esc(h.cta.label)}</span>${icons.arrow}</a>
      <ul class="hero__trust">${h.trust.map((t) => `<li>${icons.check}<span>${esc(t)}</span></li>`).join('')}</ul>
    </div>

    <div class="hero__stage">
      ${PhoneMockup(h.phone, d.operators)}
      <div class="hero__rail">
        <p class="hero__rail-title">${esc(h.railTitle)}</p>
        <nav class="hero__quick" aria-label="অপারেটর দ্রুত লিংক">${rail.map(OperatorQuickButton).join('')}</nav>
      </div>
      <p class="hero__pledge"><span class="hero__pledge-ic">${icons.checkPlain}</span><span>${esc(h.pledge[0])}<br>${esc(h.pledge[1])}</span></p>
    </div>
  </div>
</section>`;
};

/* ---------- Offers ---------- */
const SectionHeader = (o) => `
<header class="sec-head" data-reveal>
  <span class="sec-head__badge">${esc(o.badge)}</span>
  <h2 class="sec-head__title">${o.title.map((w) => `<span class="w-${w.c}">${esc(w.t)}</span>`).join(' ')}</h2>
  <p class="sec-head__sub">${esc(o.sub)}</p>
</header>`;

const OfferSubsectionHeader = (c) => {
  const title = esc(c.title).replace(esc(c.accent), `<span class="accent">${esc(c.accent)}</span>`);
  return `
<div class="sub-head">
  <span class="sub-head__icon">${icons[c.icon]}</span>
  <div class="sub-head__text">
    <h3 class="sub-head__title" id="${c.id}-title">${title}</h3>
    <p class="sub-head__sub">${esc(c.sub)}</p>
    <a class="pill-btn" href="#${c.id}-cards"><span>${esc(c.cta)}</span>${icons.arrow}</a>
  </div>
  <p class="sub-head__script" aria-hidden="true"><em>${esc(c.script.top)}</em><span>${esc(c.script.bottom)}</span></p>
  <span class="sub-head__badge" aria-hidden="true">${icons[c.badge.icon]}<b>${c.badge.label}</b></span>
</div>`;
};

const OfferCard = (o, c, i, detailsLabel, href) => {
  const of = c.offer;
  return `
<article class="offer-card" id="${o.id}-${c.id}" style="${themeVars(o.theme)};--i:${i}" data-reveal>
  <span class="offer-card__net">4G</span>
  <span class="offer-card__logo">${logo(o.id)}</span>
  <h4 class="offer-card__op">${esc(o.name)}</h4>
  <p class="offer-card__amt"><span>${esc(of.value)}</span> <small>${esc(of.tag)}</small></p>
  ${of.label ? `<p class="offer-card__label">${esc(of.label)}</p>` : '<p class="offer-card__label" aria-hidden="true">&nbsp;</p>'}
  <a class="offer-card__cta" href="${esc(href)}">
    <span class="offer-card__thumb">${icons.thumb}</span>
    <span class="offer-card__cta-text">${esc(detailsLabel)}<span class="sr-only"> — ${esc(o.name)} ${esc(of.value)} ${esc(of.tag)} ${esc(of.label)}</span></span>
    <span class="offer-card__go">${icons.arrow}</span>
  </a>
</article>`;
};

const OfferSection = (d) => `
<section class="offers" id="offers" aria-labelledby="offers-title">
  ${SectionHeader(d.offers).replace('<h2 class="sec-head__title"', '<h2 id="offers-title" class="sec-head__title"')}
  ${d.offers.categories.map((c) => `
  <div class="sub sub--${c.theme}" role="group" aria-labelledby="${c.id}-title">
    ${OfferSubsectionHeader(c)}
    <div class="offer-grid" id="${c.id}-cards">
      ${d.operators.map((o, i) => OfferCard(o, c, i, d.offers.detailsLabel, d.site.defaultHref)).join('')}
    </div>
  </div>`).join('')}
</section>`;

/* ---------- Supporting ---------- */
const QuickNavCard = (q) => `<li><a class="qnav" href="${esc(q.href)}"><span class="qnav__icon">${icons[q.icon]}</span><span>${esc(q.label)}</span></a></li>`;
const QuickNav = (d) => `<nav class="quicknav" aria-label="দ্রুত লিংক" data-reveal><ul>${d.quickNav.map(QuickNavCard).join('')}</ul></nav>`;

const CountdownBar = (d) => {
  const c = d.countdown;
  return `
<section class="countdown" aria-labelledby="cd-title">
  <span class="countdown__gift">${icons.gift}</span>
  <div class="countdown__text">
    <h2 id="cd-title">${esc(c.title)}</h2>
    <p>${esc(c.sub)}</p>
  </div>
  <div class="countdown__timer" id="countdown" role="timer" data-deadline="${esc(d.site.offerEndsAt)}">
    <span class="countdown__label">${icons.clock}<span>${esc(c.label)}</span></span>
    <div class="countdown__digits">
      <div><b data-u="h">০০</b><small>${c.units[0]}</small></div><i>:</i>
      <div><b data-u="m">০০</b><small>${c.units[1]}</small></div><i>:</i>
      <div><b data-u="s" class="tick">০০</b><small>${c.units[2]}</small></div>
    </div>
  </div>
</section>`;
};

const Footer = (d) => `
<footer class="footer">
  <nav aria-label="ফুটার লিংক"><ul>${d.footer.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul></nav>
  <p>© ${d.site.year} ${esc(d.site.domain)} — All rights reserved.</p>
</footer>`;

const Page = (d) => `
<a class="skip" href="#offers">মূল কনটেন্টে যান</a>
<div class="page">
  <main>
    ${HeroBanner(d)}
    ${OfferSection(d)}
    ${QuickNav(d)}
  </main>
  ${CountdownBar(d)}
</div>
${Footer(d)}`;

module.exports = { Page };
