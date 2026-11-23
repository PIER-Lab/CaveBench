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
    ['The leaves are nearly closed.', 'F1 shows full insertion. The gap between the gold leaves is smallest here.'],
    ['The leaves are widely separated.', 'F2 shows withdrawal. With the mica outside the capacitor, the gap between the leaves is widest.'],
    ['The opening is between those in F1 and F2.', 'Correct. F3 shows half insertion. Compare the opening with the narrower gap in F1 and the wider gap in F2.']
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
})();
