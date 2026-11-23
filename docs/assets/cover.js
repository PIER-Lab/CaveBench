/* The film and its native controls work before the atlas or leaderboard loads. */
(() => {
  const panel = document.getElementById('film');
  const frame = panel.querySelector('.film-frame');
  const video = panel.querySelector('video');
  const play = panel.querySelector('.film-play');
  const close = document.getElementById('close-film');
  const error = document.getElementById('film-error');
  function showPoster() {
    video.controls = false;
    panel.classList.remove('is-playing');
    play.hidden = false;
  }
  function failed() {
    showPoster();
    error.hidden = false;
  }
  showPoster();
  play.addEventListener('click', () => {
    video.controls = true;
    error.hidden = true;
    video.play().catch(failed);
  });
  frame.addEventListener('click', event => {
    if (event.target === frame && !play.hidden) play.click();
  });
  video.addEventListener('play', () => {
    panel.classList.add('is-playing');
    play.hidden = true;
    video.focus({preventScroll:true});
  });
  video.addEventListener('ended', showPoster);
  video.addEventListener('error', failed);
  close.addEventListener('click', () => {
    video.pause();
    showPoster();
    play.focus({preventScroll:true});
  });
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('is-playing') && !document.fullscreenElement) close.click();
  });

  const guide = document.querySelector('.domain-ribbon');
  function loadGuide() {
    if (document.getElementById('guide-style')) return;
    const css = document.createElement('link');
    css.id = 'guide-style';
    css.rel = 'stylesheet';
    css.href = 'assets/field-guide.css?v=leaves1';
    const app = document.createElement('script');
    app.src = 'assets/site.js?v=leaves1';
    document.head.append(css, app);
  }
  const direct = () => location.hash && !['#top','#film','#release','#resources','#main'].includes(location.hash);
  if (direct() || !('IntersectionObserver' in window)) loadGuide();
  else {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadGuide(); }
    }, {rootMargin:'40px'});
    observer.observe(guide);
  }
  window.addEventListener('hashchange', () => { if (direct()) loadGuide(); });
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (['#top','#main','#film'].includes(link.hash)) return;
    link.addEventListener('focus', loadGuide, {once:true});
    link.addEventListener('pointerdown', loadGuide, {once:true});
  });
})();
