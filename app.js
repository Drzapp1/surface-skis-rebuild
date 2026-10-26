// Deliberately limited content; the original page routes remain shareable.
const skis = [
  { id: 'pinner', name: 'The Pinner', waist: 90, flex: 5, lengths: [150, 160, 170, 180] },
  { id: 'goner', name: 'The Goner', waist: 95, flex: 2, lengths: [165, 175, 185] },
  { id: 'reaper', name: 'The Reaper', waist: 100, flex: 5, lengths: [160, 170, 180] },
  { id: 'radler', name: 'The Radler', waist: 105, flex: 7, lengths: [165, 175, 185] }
];
const image = (ski, reverse = false) => `assets/img/products/the-${ski.id}-w27${reverse ? '-2' : ''}.png`;
const productLink = ski => `#/product/the-${ski.id}-w27`;
const content = document.querySelector('#content');

function shopPage() {
  return `<section class="skis section route-page" aria-labelledby="page-title">
    <div class="section-head"><h1 id="page-title">SKIS</h1><a class="text-link" href="#/compare">Compare ↗</a></div>
    <div class="ski-grid">${skis.map(ski => `
      <article class="ski ski--${ski.id}">
        <a class="ski__art" href="${productLink(ski)}" aria-label="View ${ski.name}">
          <img class="ski__front" src="${image(ski)}" alt="${ski.name} topsheet artwork" width="300" height="530">
          <img class="ski__back" src="${image(ski, true)}" alt="" width="300" height="530" aria-hidden="true">
          <span class="ski__open" aria-hidden="true">↗</span>
        </a>
        <h2><a href="${productLink(ski)}">${ski.name}</a></h2>
      </article>`).join('')}</div>
  </section>`;
}

function comparePage() {
  return `<section class="compare-page section route-page" aria-labelledby="page-title">
    <div class="section-head"><h1 id="page-title">COMPARE</h1></div>
    <div class="compare-scroll" tabindex="0" role="region" aria-label="Ski comparison, scroll horizontally for all four skis">
      <table>
        <caption class="sr-only">W27 skis. Flex is shown on a scale of one to ten.</caption>
        <thead><tr><th scope="col"><span class="sr-only">Specification</span></th>${skis.map(ski => `
          <th scope="col"><a href="${productLink(ski)}"><img src="${image(ski)}" alt="" width="100" height="180">${ski.name}</a></th>`).join('')}</tr></thead>
        <tbody>
          <tr><th scope="row">Waist</th>${skis.map(ski => `<td>${ski.waist} mm</td>`).join('')}</tr>
          <tr><th scope="row">Flex / 10</th>${skis.map(ski => `<td><span class="flex-mark" style="--flex:${ski.flex}" aria-hidden="true"></span>${ski.flex}</td>`).join('')}</tr>
          <tr><th scope="row">Lengths / cm</th>${skis.map(ski => `<td>${ski.lengths.join(' / ')}</td>`).join('')}</tr>
        </tbody>
      </table>
    </div>
  </section>`;
}

function productPage(ski) {
  return `<section class="product-page route-page" aria-labelledby="page-title">
    <a class="product-back text-link" href="#/shop">← Skis</a>
    <div id="ski-detail">
      <div class="detail-art"><img id="detail-image" src="${image(ski)}" alt="${ski.name} topsheet artwork" width="300" height="530"></div>
      <div class="detail-copy"><h1 id="page-title">${ski.name}</h1>
        <dl><div><dt>Waist</dt><dd>${ski.waist} mm</dd></div><div><dt>Flex / 10</dt><dd>${ski.flex}</dd></div><div><dt>Lengths / cm</dt><dd>${ski.lengths.join(' / ')}</dd></div></dl>
        <button class="text-link" id="flip-ski" data-ski="${ski.id}" type="button">View base ↻</button>
      </div>
    </div>
  </section>`;
}

const titles = { home: 'W27', shop: 'Skis', compare: 'Compare', team: 'Team', videos: 'Videos', faq: 'Info' };
const aliases = { '': '/', top: '/', skis: '/shop', team: '/team', film: '/videos', info: '/faq', compare: '/compare', '/skis': '/shop', '/info': '/faq' };

function renderPage({ initial = false } = {}) {
  const fragment = location.hash.slice(1);
  if (fragment === 'content') return;
  const path = aliases[fragment] ?? fragment;
  const segments = path.split('/').filter(Boolean);
  let page = segments[0] || 'home';
  let ski;
  if (page === 'product') {
    ski = skis.find(item => `the-${item.id}-w27` === segments[1]);
    if (!ski) page = 'shop';
  } else if (!Object.hasOwn(titles, page)) {
    page = 'home';
  }
  const canonical = ski ? productLink(ski) : page === 'home' ? '#/' : `#/${page}`;
  if (location.hash !== canonical) history.replaceState(null, '', canonical);

  if (page === 'shop') content.innerHTML = shopPage();
  else if (page === 'compare') content.innerHTML = comparePage();
  else if (page === 'product') content.innerHTML = productPage(ski);
  else content.replaceChildren(document.querySelector(`#${page}-template`).content.cloneNode(true));

  document.title = `${ski ? ski.name : titles[page]} / Surface Skis`;
  document.body.dataset.page = page;
  document.querySelectorAll('nav [data-page]').forEach(link => {
    if (link.dataset.page === (page === 'product' ? 'shop' : page)) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (!initial) content.focus({ preventScroll: true });
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

content.addEventListener('click', event => {
  const button = event.target.closest('#flip-ski');
  if (!button) return;
  const ski = skis.find(item => item.id === button.dataset.ski);
  const reverse = button.dataset.reverse !== 'true';
  const img = document.querySelector('#detail-image');
  img.src = image(ski, reverse);
  img.alt = `${ski.name} ${reverse ? 'base' : 'topsheet'} artwork`;
  button.dataset.reverse = String(reverse);
  button.textContent = reverse ? 'View topsheet ↻' : 'View base ↻';
});

window.addEventListener('hashchange', () => renderPage());
renderPage({ initial: true });
