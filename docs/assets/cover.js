/* The film and its native controls work before the atlas or leaderboard loads. */
(() => {
  const panel = document.getElementById('film');
  const video = panel.querySelector('video');
  const play = panel.querySelector('.film-play');
  const close = document.getElementById('close-film');
  const error = document.getElementById('film-error');
  const reader = document.getElementById('cover-exposures');
  const check = document.getElementById('check-exposure');
  const feedback = document.getElementById('exposure-answer');
  const strip = reader.querySelector('img');
  function drawThumbnails() {
    const width=strip.naturalWidth/3, height=strip.naturalHeight;
    if (!width || !height) return;
    reader.querySelectorAll('canvas').forEach((canvas,index)=>{
      const context=canvas.getContext('2d');
      if (context) context.drawImage(strip,index*width,0,width,height,0,0,canvas.width,canvas.height);
    });
  }
  strip.addEventListener('load',drawThumbnails);
  if (strip.complete) drawThumbnails();
  const observations = [
    ['The leaves are nearly closed.', 'F1 shows full insertion. Bringing the leaves closest together corresponds to the greatest overlap with the mica.'],
    ['The leaves are widely separated.', 'F2 shows withdrawal. The leaves spread farthest when the mica is outside the capacitor.'],
    ['The opening is between those in F1 and F2.', 'Correct. F3 shows half insertion. The leaves open farther than in F1 and less than in F2.']
  ];
  let selection = 2;
  reader.addEventListener('click', event => {
    const target = event.target.closest('button[data-frame]');
    if (!target) return;
    selection = Number(target.dataset.frame);
    for (const button of reader.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button === target));
    reader.style.setProperty('--frame-shift', -(selection - 1) * 100 + '%');
    const label = 'F' + selection;
    reader.querySelector('.exposure-number').textContent = label;
    reader.querySelector('img').alt = label + '. ' + observations[selection - 1][0];
    check.textContent = 'Check ' + label;
    feedback.hidden = true;
    feedback.textContent = '';
  });
  check.addEventListener('click', () => {
    feedback.hidden = false;
    feedback.textContent = observations[selection - 1][1];
  });
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
    css.href = 'assets/field-guide.css?v=exposure1';
    const app = document.createElement('script');
    app.src = 'assets/site.js?v=exposure1';
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
