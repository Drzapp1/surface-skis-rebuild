// Small content edits on top of the original prototype and its original routes.
(() => {
  const data = window.SS;
  const descriptions = {
    'the-pinner-w27': 'A park ski with a poplar core and low-profile camber.',
    'the-goner-w27': 'A soft, symmetrical ski for rails and jibbing.',
    'the-reaper-w27': 'A 100 mm park and all-mountain ski.',
    'the-radler-w27': 'A park ski with a poplar core and early-rise tip and tail.'
  };
  data.CATALOG = data.CATALOG.filter(ski => Object.hasOwn(descriptions, ski.id));
  data.CATALOG.forEach(ski => { ski.desc = descriptions[ski.id]; });
  data.TEAM = data.TEAM.slice(0, 3);
  data.AMBASSADORS = [];
  data.FAQ = [{
    section: 'Questions',
    items: [
      { q: 'Product questions?', a: '<a class="inlink" href="mailto:surface@surfaceskis.com">surface@surfaceskis.com</a>' },
      { q: 'Warranty & returns?', a: 'See the current policies at <a class="inlink" href="https://www.surfaceskis.com/" target="_blank" rel="noopener">surfaceskis.com ↗</a>.' }
    ]
  }];

  const app = document.getElementById('app');
  let lastMain;
  function trimPage() {
    const emptyCart = app.querySelector('.drawer__empty');
    if (emptyCart && emptyCart.textContent !== 'Your cart is empty.') {
      emptyCart.textContent = 'Your cart is empty.';
    }
    const main = app.querySelector('main');
    // The original app replaces main on navigation. Ignore meter/cart updates.
    if (!main || main === lastMain) return;
    lastMain = main;

    const logo = app.querySelector('.nav .logo');
    if (logo) {
      logo.innerHTML = '<span>surface</span><em>skis</em>';
      logo.setAttribute('aria-label', 'Surface Skis home');
    }

    app.querySelectorAll([
      '.ticker', '.hero__meta', '.hero__credit', '.soon-sec', '.aibub',
      '.foot__mega', '.foot__brand',
      '.page-hero > .eyebrow', '.page-hero > .sub',
      '.sec__head .eyebrow', '.news > .eyebrow', '.pd__ship',
      '.card__meta', '.card__spec', '.foot__brand p',
      '.nav__links .hot', '.shop-season__head',
      '.filters [data-action="filter"]', '.filters .spacer', '.rider__pro',
      '.faq-nav', '.faq-sec > h2', '.drawer__note'
    ].join(',')).forEach(element => element.remove());

    const headline = main.querySelector('.hero__mega');
    if (headline) {
      headline.innerHTML = 'W27 <span class="yell">Skis</span>';
      main.querySelector('.hero__content > .eyebrow').textContent = 'Surface Skis';
      main.querySelector('.hero__cta .btn--accent').textContent = 'View skis';
      document.title = 'Surface Skis · W27';
      main.querySelector('.grid')?.closest('section')?.classList.add('home-skis');
      main.querySelector('.strip')?.closest('section')?.classList.add('home-team');
    }
    main.querySelector('.filmstrip__overlay')?.remove();
    main.querySelector('.news')?.closest('section')?.remove();

    main.querySelectorAll('.grid').forEach(grid => {
      if (!grid.children.length) grid.closest('section')?.remove();
      grid.classList.toggle('grid--three', grid.children.length === 3);
    });
    main.querySelector('.ambass')?.closest('section')?.remove();
    const footer = app.querySelector('.foot');
    if (footer) footer.innerHTML = `
      <nav class="wrap foot__compact" aria-label="Contact and social links">
        <a href="mailto:surface@surfaceskis.com">Contact ↗</a>
        <a href="https://www.instagram.com/surfaceskis" target="_blank" rel="noopener">Instagram ↗</a>
        <a href="https://www.youtube.com/c/SURFACESKIS1" target="_blank" rel="noopener">YouTube ↗</a>
      </nav>`;

    // The selected riders' pro models are outside this small catalog.
    main.querySelectorAll('.rider[href*="/product/"]').forEach(link => {
      link.href = data.IG;
      link.target = '_blank';
      link.rel = 'noopener';
    });
    main.querySelectorAll('.specsheet h4 span').forEach(span => {
      if (span.textContent === 'where it wants to be' || /in the range$/.test(span.textContent)) span.remove();
    });
    const specTable = main.querySelector('.spec-table');
    if (specTable) {
      const tableWrap = document.createElement('div');
      tableWrap.className = 'spec-table-wrap';
      tableWrap.tabIndex = 0;
      tableWrap.setAttribute('role', 'region');
      tableWrap.setAttribute('aria-label', 'Ski specifications by length');
      specTable.before(tableWrap);
      tableWrap.append(specTable);
      const specLabel = main.querySelector('.rowlabel');
      if (specLabel) specLabel.innerHTML = '<span>Specifications</span>';
    }
    const teamLink = main.querySelector('.home-team .sec__head .more');
    if (teamLink) teamLink.textContent = 'Team →';
    main.querySelectorAll('.faq-sec details').forEach(details => { details.open = false; });
  }
  new MutationObserver(trimPage).observe(app, { childList: true, subtree: true });
})();
