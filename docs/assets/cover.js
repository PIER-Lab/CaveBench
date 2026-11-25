/* Load media only in response to playback; native controls handle playback and captions. */
(() => {
  const screen = document.querySelector('.film-screen');
  const video = screen.querySelector('video');
  const start = screen.querySelector('.film-start');
  const error = document.getElementById('film-error');
  // The still is the only surface shown before playback, including in browsers
  // that paint a native buffering indicator over a deferred video.
  start.style.backgroundImage = 'url("' + video.poster + '")';
  video.controls = false;
  start.hidden = false;

  function showError() {
    video.controls = false;
    error.hidden = false;
    start.hidden = false;
  }
  start.addEventListener('click', () => {
    video.controls = true;
    start.hidden = true;
    error.hidden = true;
    video.play().then(() => video.focus({preventScroll:true})).catch(showError);
  });
  video.addEventListener('play', () => { start.hidden = true; });
  video.addEventListener('ended', () => {
    video.controls = false;
    video.load();
    start.hidden = false;
  });
  video.addEventListener('error', showError);

  const copy = document.querySelector('.copy-citation');
  const citation = document.getElementById('bibtex');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent);
      copy.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copy.textContent = 'Citation selected';
    }
    setTimeout(() => { copy.textContent = 'Copy BibTeX'; }, 2000);
  });

  const links = [...document.querySelectorAll('.nav nav > div a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.hash));
  let scheduled = false;
  function updateNav() {
    let active = -1;
    sections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= 120) active = i;
    });
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = sections.length - 1;
    }
    links.forEach((link, i) => {
      if (i === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateNav);
    }
  }, {passive:true});
  updateNav();
})();
