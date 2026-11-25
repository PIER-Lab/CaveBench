(() => {
  'use strict';
  if (new URLSearchParams(location.search).get('motion') === 'full') {
    document.documentElement.setAttribute('data-full-motion', '');
  }
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.dataset.entrance = 'shown';
      observer.unobserve(entry.target);
    }
  }, {threshold: 0.1, rootMargin: '0px'});

  // The heading and its introduction share an entrance; the results below have their own.
  const blocks = document.querySelectorAll([
    '.film-screen', '#dataset #viewer', '.evidence-title', '.score-sheet', '.method-heading',
    '.task-plates article', '.study-fold', '.build-block > h3', '.construction-spread',
    '.domain-sheet', '.evaluation-comparison > section', '.research-finding',
    '.error-plate', '.citation-head', '#bibtex'
  ].join(','));
  for (const block of blocks) {
    block.dataset.entrance = 'waiting';
    observer.observe(block);
  }
})();
