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
    const main = app.querySelector('main');
    // The original app replaces main on navigation. Ignore meter/cart updates.
    if (!main || main === lastMain) return;
    lastMain = main;

    app.querySelectorAll([
      '.ticker', '.hero__meta', '.hero__credit', '.soon-sec', '.aibub',
      '.foot__mega', '.foot__brand',
      '.page-hero > .eyebrow', '.page-hero > .sub',
      '.sec__head .eyebrow', '.news > .eyebrow',
      '.card__meta', '.card__spec', '.foot__brand p',
      '.nav__links .hot', '.shop-season__head',
      '.filters [data-action="filter"]', '.rider__pro', '.faq-nav a[href^="#faq-"]'
    ].join(',')).forEach(element => element.remove());

    const headline = main.querySelector('.hero__mega');
    if (headline) {
      headline.innerHTML = 'W27 <span class="yell">Skis</span>';
      main.querySelector('.hero__content > .eyebrow').textContent = 'Surface Skis';
      main.querySelector('.hero__cta .btn--accent').textContent = 'View skis';
      document.title = 'Surface Skis · W27';
    }
    const filmTitle = main.querySelector('.filmstrip__overlay h2');
    if (filmTitle) {
      filmTitle.textContent = 'Woodward';
      filmTitle.dataset.t = 'Woodward';
    }

    main.querySelectorAll('.grid').forEach(grid => {
      if (!grid.children.length) grid.closest('section')?.remove();
    });
    main.querySelector('.ambass')?.closest('section')?.remove();
    app.querySelectorAll('.foot a').forEach(link => {
      if (/\/shop\/W2[56]$/.test(link.getAttribute('href') || '')) link.remove();
    });
    const footerNote = app.querySelector('.foot__base > span:last-child');
    if (footerNote) footerNote.textContent = 'Unofficial concept';

    // The selected riders' pro models are outside this small catalog.
    main.querySelectorAll('.rider[href*="/product/"]').forEach(link => {
      link.href = data.IG;
      link.target = '_blank';
      link.rel = 'noopener';
    });
    main.querySelectorAll('.specsheet h4 span').forEach(span => {
      if (span.textContent === 'where it wants to be' || /in the range$/.test(span.textContent)) span.remove();
    });
    main.querySelectorAll('.faq-sec details').forEach(details => { details.open = false; });
  }
  new MutationObserver(trimPage).observe(app, { childList: true, subtree: true });
})();
