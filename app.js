// A small selection for the prototype, using the original W27 product data.
const skis = [
  { id: 'pinner', name: 'The Pinner', waist: 90, flex: 5, lengths: [150, 160, 170, 180] },
  { id: 'goner', name: 'The Goner', waist: 95, flex: 2, lengths: [165, 175, 185] },
  { id: 'reaper', name: 'The Reaper', waist: 100, flex: 5, lengths: [160, 170, 180] },
  { id: 'radler', name: 'The Radler', waist: 105, flex: 7, lengths: [165, 175, 185] }
];
const image = (ski, reverse = false) => `assets/img/products/the-${ski.id}-w27${reverse ? '-2' : ''}.png`;

document.querySelector('#ski-grid').innerHTML = skis.map((ski, i) => `
  <article class="ski ski--${ski.id}">
    <button class="ski__art" type="button" data-ski="${ski.id}" aria-label="View ${ski.name}">
      <span class="ski__number" aria-hidden="true">0${i + 1}</span>
      <img class="ski__front" src="${image(ski)}" alt="${ski.name} topsheet artwork" width="300" height="530" loading="lazy">
      <img class="ski__back" src="${image(ski, true)}" alt="" width="300" height="530" loading="lazy" aria-hidden="true">
      <span class="ski__open" aria-hidden="true">↗</span>
    </button>
    <h3><button type="button" data-ski="${ski.id}">${ski.name}</button></h3>
    <span class="ski__waist">${ski.waist} mm</span>
  </article>`).join('');

document.querySelector('#comparison').innerHTML = `
  <caption class="sr-only">Four W27 skis. Flex is shown on a scale of one to ten.</caption>
  <thead><tr><th scope="col"><span class="sr-only">Specification</span>W27</th>${skis.map(ski => `<th scope="col"><img src="${image(ski)}" alt="" width="100" height="180">${ski.name}</th>`).join('')}</tr></thead>
  <tbody>
    <tr><th scope="row">Waist</th>${skis.map(ski => `<td>${ski.waist} mm</td>`).join('')}</tr>
    <tr><th scope="row">Flex / 10</th>${skis.map(ski => `<td><span class="flex-mark" style="--flex:${ski.flex}" aria-hidden="true"></span>${ski.flex}</td>`).join('')}</tr>
    <tr><th scope="row">Lengths / cm</th>${skis.map(ski => `<td>${ski.lengths.join(' / ')}</td>`).join('')}</tr>
  </tbody>`;

document.querySelectorAll('[data-compare]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#compare-dialog').showModal();
}));
document.querySelectorAll('[data-ski]').forEach(button => button.addEventListener('click', () => {
  const ski = skis.find(item => item.id === button.dataset.ski);
  document.querySelector('#ski-detail').innerHTML = `
    <div class="detail-art"><img id="detail-image" src="${image(ski)}" alt="${ski.name} topsheet artwork" width="300" height="530"></div>
    <div class="detail-copy"><span class="detail-season">W27</span><h2 id="ski-title">${ski.name}</h2>
      <dl><div><dt>Waist</dt><dd>${ski.waist} mm</dd></div><div><dt>Flex / 10</dt><dd>${ski.flex}</dd></div><div><dt>Lengths / cm</dt><dd>${ski.lengths.join(' / ')}</dd></div></dl>
      <button class="text-link" id="flip-ski" type="button">View base ↻</button>
    </div>`;
  let reverse = false;
  document.querySelector('#flip-ski').addEventListener('click', event => {
    reverse = !reverse;
    const img = document.querySelector('#detail-image');
    img.src = image(ski, reverse);
    img.alt = `${ski.name} ${reverse ? 'base' : 'topsheet'} artwork`;
    event.currentTarget.textContent = reverse ? 'View topsheet ↻' : 'View base ↻';
  });
  document.querySelector('#ski-dialog').showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});

// Keep older prototype bookmarks useful after removing the full storefront.
const legacyRoutes = { '/shop': 'skis', '/compare': 'compare', '/team': 'team', '/videos': 'film', '/faq': 'info' };
function resolveLegacyRoute() {
  const route = location.hash.slice(1);
  if (!route.startsWith('/')) return;
  const target = legacyRoutes['/' + route.split('/')[1]] || (route.startsWith('/product/') ? 'skis' : 'top');
  history.replaceState(null, '', target === 'compare' ? '#skis' : `#${target}`);
  if (target === 'compare') document.querySelector('#compare-dialog').showModal();
  else document.getElementById(target)?.scrollIntoView();
}
window.addEventListener('hashchange', resolveLegacyRoute);
resolveLegacyRoute();
