'use strict';

(() => {
  const rail = document.getElementById('motion-rail');
  if (!rail) return;
  const atlas = rail.closest('#atlas');
  const cards = Array.from(rail.querySelectorAll('.motion-card'));
  const media = cards.map(card => card.querySelector('video'));
  const domains = Array.from(atlas.querySelectorAll('[data-domain-start]'));
  const groups = domains.map((button, i) => ({
    start: Number(button.dataset.domainStart),
    end: i + 1 === domains.length ? cards.length : Number(domains[i + 1].dataset.domainStart),
    button
  }));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const fullMotion = new URLSearchParams(location.search).get('motion') === 'full';
  const allowMotion = () => fullMotion || !reducedMotion.matches;
  const millisecondsPerScene = 5800;
  const radius = 2.25;
  let position = 0, selected = -1, nearby = false, visible = false, hovered = false;
  let width = 0, cardPitch = 0;
  let firstSlot = NaN, lastSlot = NaN, onscreen = new Set();
  let frame = 0, lastTime = null, glide = null, touch = null, drifting = false;
  const fill = document.createElement('span');
  fill.className = 'motion-tick-fill';
  fill.setAttribute('aria-hidden', 'true');
  const wrap = index => ((index % cards.length) + cards.length) % cards.length;

  // Keep the shorter paired clips running while someone studies a scene. The
  // full recording can take their place on the featured internal-camera view.
  const detail = document.createElement('video');
  detail.className = 'lens-detail';
  detail.loop = detail.muted = detail.defaultMuted = detail.playsInline = true;
  detail.setAttribute('aria-hidden', 'true');
  let detailTimer = 0, detailCard;
  function clearDetail() {
    clearTimeout(detailTimer);
    detailTimer = 0;
    detailCard = null;
    if (!detail.hasAttribute('src')) return;
    detail.pause();
    detail.classList.remove('is-visible');
    detail.remove();
    detail.removeAttribute('src');
    detail.load();
  }
  detail.addEventListener('playing', () => {
    if (detailCard) detail.classList.add('is-visible');
  });
  detail.addEventListener('waiting', () => detail.classList.remove('is-visible'));
  detail.addEventListener('error', clearDetail);
  for (const [index, card] of cards.entries()) {
    const lens = document.createElement('span');
    lens.className = 'motion-lens-hit';
    lens.setAttribute('aria-hidden', 'true');
    media[index].parentElement.append(lens);
    lens.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse' || !hovered || index !== selected ||
          !allowMotion() || detailTimer || detailCard === card) return;
      detailTimer = setTimeout(() => {
        detailTimer = 0;
        if (!hovered || !visible || document.hidden || index !== selected || !lens.matches(':hover')) return;
        detailCard = card;
        media[index].after(detail);
        detail.src = 'examples/' + card.dataset.scene + '/dual_view.mp4';
        detail.play().catch(() => {});
      }, 550);
    });
    lens.addEventListener('pointerleave', clearDetail);
  }

  const retries = new Map();
  const attempts = new Map();
  let warm = new Set();
  function cancelRetry(video) {
    clearTimeout(retries.get(video));
    retries.delete(video);
  }
  function retry(video) {
    if (!warm.has(video) || document.hidden || !navigator.onLine || retries.has(video)) return;
    const attempt = attempts.get(video) || 0;
    if (attempt >= 2) return;
    const playhead = video.currentTime;
    retries.set(video, setTimeout(() => {
      retries.delete(video);
      if (!warm.has(video) || document.hidden || !navigator.onLine) return;
      if (!video.error && (video.readyState >= 3 || video.currentTime !== playhead)) return;
      const url = new URL(video.dataset.src, document.baseURI);
      url.searchParams.set('retry', String(attempt + 1));
      attempts.set(video, attempt + 1);
      video.classList.remove('is-ready');
      video.src = url.href;
      refreshMedia();
    }, (video.error ? 800 : 8500) * (attempt + 1)));
  }
  function refreshMedia() {
    const play = visible && !document.hidden && allowMotion();
    warm = new Set();
    if ((nearby || visible) && !document.hidden && selected >= 0) {
      warm.add(media[selected]);
      if (allowMotion()) {
        onscreen.forEach(i => warm.add(media[i]));
        // Once the current plates have decoded, fetch the incoming clip before its edge appears.
        if (play && !navigator.connection?.saveData && [...warm].every(v => v.readyState >= 2 || v.error)) {
          warm.add(media[wrap(lastSlot + 1)]);
        }
      }
    }
    if (!play) clearDetail();
    for (const video of warm) {
      if (!video.hasAttribute('src')) {
        video.preload = allowMotion() ? 'auto' : 'metadata';
        video.muted = true;
        video.src = video.dataset.src;
      }
    }
    for (const [i, video] of media.entries()) {
      const playing = play && onscreen.has(i);
      video.autoplay = playing;
      if (!playing && !video.paused) video.pause();
      if (!warm.has(video)) {
        cancelRetry(video);
        attempts.delete(video);
        if (video.hasAttribute('src')) {
          video.classList.remove('is-ready');
          video.removeAttribute('src');
          video.load();
        }
      } else if (video.error) {
        retry(video);
      } else if (playing && video.paused) {
        video.play().catch(() => {});
      }
    }
  }
  for (const video of media) {
    video.addEventListener('loadeddata', () => {
      if (!video.hasAttribute('src')) return;
      video.classList.add('is-ready');
      cancelRetry(video);
      refreshMedia();
    });
    video.addEventListener('error', () => {
      video.classList.remove('is-ready');
      retry(video);
    });
    video.addEventListener('stalled', () => retry(video));
    video.addEventListener('waiting', () => retry(video));
    video.addEventListener('playing', () => cancelRetry(video));
  }
  window.addEventListener('online', () => { attempts.clear(); refreshMedia(); });

  function updateSlots(from, to, focusIndex) {
    const active = wrap(focusIndex);
    const next = new Set();
    for (let slot = from; slot <= to; slot++) next.add(wrap(slot));
    for (const i of onscreen) {
      if (!next.has(i)) {
        cards[i].hidden = true;
        delete cards[i].dataset.atlasSlot;
      }
    }
    for (const i of next) {
      const card = cards[i], feature = i === active;
      card.hidden = false;
      const role = feature ? 'feature' : 'preview';
      if (card.dataset.atlasSlot === role) continue;
      card.dataset.atlasSlot = role;
      if (feature) {
        card.href = '#' + card.dataset.scene;
        card.removeAttribute('role');
        card.removeAttribute('tabindex');
        card.removeAttribute('aria-label');
      } else {
        card.removeAttribute('href');
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.setAttribute('aria-label', 'Show ' + card.querySelector('.motion-name').textContent);
      }
    }
    if (selected !== active) {
      clearDetail();
      selected = active;
      atlas.dataset.activeDomain = cards[selected].dataset.domain;
      const group = groups.find(item => selected >= item.start && selected < item.end);
      for (const item of groups) {
        item.button.setAttribute('aria-pressed', String(item === group));
        item.button.querySelectorAll('i').forEach((tick, i) =>
          tick.classList.toggle('is-current', selected === item.start + i));
      }
      group.button.querySelector('.is-current').append(fill);
    }
    firstSlot = from;
    lastSlot = to;
    onscreen = next;
    refreshMedia();
  }

  function draw() {
    const from = Math.ceil(position - radius), to = Math.floor(position + radius);
    const focusIndex = Math.round(position);
    if (from !== firstSlot || to !== lastSlot || selected !== wrap(focusIndex)) {
      updateSlots(from, to, focusIndex);
    }
    if (!width) return;
    for (let slot = from; slot <= to; slot++) {
      const x = (slot - position) * cardPitch;
      cards[wrap(slot)].style.transform = 'translate3d(calc(-50% + ' + x.toFixed(3) + 'px),0,0)';
    }
    fill.style.transform = 'scaleX(' + (position - focusIndex + .5).toFixed(4) + ')';
  }

  function measure(nextWidth) {
    if (!nextWidth || nextWidth === width) return;
    width = nextWidth;
    const gap = Math.min(14, Math.max(10, width * .009));
    const cardWidth = Math.min(width * .86, Math.max(430, (width - 2 * gap) / 3));
    cardPitch = cardWidth + gap;
    rail.style.setProperty('--atlas-card-width', cardWidth + 'px');
    draw();
  }

  function mayDrift() {
    const focus = document.activeElement;
    return !hovered && !touch && !(atlas.contains(focus) && focus.matches(':focus-visible'));
  }
  function tick(now) {
    frame = 0;
    if (lastTime !== null) {
      const elapsed = Math.min(100, now - lastTime);
      if (glide) {
        glide.elapsed += elapsed;
        const fraction = Math.min(1, glide.elapsed / glide.duration);
        position = glide.start + (glide.end - glide.start) * (1 - (1 - fraction) ** 3);
        if (fraction === 1) { position = glide.end; glide = null; }
      } else {
        position += elapsed / millisecondsPerScene;
      }
      draw();
    }
    lastTime = now;
    if (glide || drifting) frame = requestAnimationFrame(tick);
    else lastTime = null;
  }
  function schedule() {
    const active = visible && !document.hidden && allowMotion();
    drifting = active && mayDrift();
    if (active && (glide || drifting)) {
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = null;
    }
  }
  function select(index, instant = false) {
    const current = Math.round(position);
    let delta = wrap(index - current);
    if (delta > cards.length / 2) delta -= cards.length;
    const target = current + delta;
    if (!instant && visible && !document.hidden && allowMotion() && Math.abs(target - position) > .025) {
      glide = {start:position, end:target, elapsed:0, duration:Math.min(440, 280 + 65 * Math.abs(target - position))};
    } else {
      glide = null;
      position = target;
      draw();
    }
    schedule();
  }
  function step(direction) {
    const target = (glide ? glide.end : Math.round(position)) + direction;
    select(target);
    return wrap(target);
  }

  for (const [i, card] of cards.entries()) {
    card.addEventListener('click', event => {
      if (card.dataset.atlasSlot !== 'preview') return;
      event.preventDefault();
      select(i);
    });
  }
  groups.forEach(({button, start}) => button.addEventListener('click', () => select(start, true)));
  rail.querySelector('.motion-previous').addEventListener('click', () => step(-1));
  rail.querySelector('.motion-next').addEventListener('click', () => step(1));
  rail.addEventListener('keydown', event => {
    if (event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const target = step(event.key === 'ArrowLeft' ? -1 : 1);
      cards[target].focus({preventScroll: true});
    } else if ((event.key === 'Enter' || event.key === ' ') &&
               event.target.dataset.atlasSlot === 'preview') {
      event.preventDefault();
      if (!event.repeat) event.target.click();
    }
  });
  // Scrolling can dispatch pointerenter even if the mouse has not moved. Only
  // a change in viewport coordinates (or a deliberate press) means "hold here".
  let pointerX, pointerY;
  function hold(inside) {
    if (inside === hovered) return;
    hovered = inside;
    rail.toggleAttribute('data-hover-hold', inside);
    if (!inside) clearDetail();
    schedule();
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || !event.isPrimary) return;
    const moved = pointerX === undefined
      ? Boolean(event.movementX || event.movementY)
      : event.clientX !== pointerX || event.clientY !== pointerY;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (moved) hold(rail.contains(event.target));
  }, {capture:true, passive:true});
  rail.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch') return;
    hold(false);
  });
  // Touch has no hover target. Only a deliberate horizontal swipe changes the
  // scene, leaving taps to select or open it and vertical gestures to the page.
  let suppressTapUntil = 0;
  rail.addEventListener('pointerdown', event => {
    if (!event.isPrimary) return;
    if (event.pointerType !== 'touch') { hold(true); return; }
    hold(false);
    touch = {id:event.pointerId, x:event.clientX, y:event.clientY};
    schedule();
  });
  function releaseTouch(event) {
    if (!touch || touch.id !== event.pointerId) return;
    const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
    touch = null;
    if (event.type === 'pointerup' && Math.abs(dx) > Math.max(48, 1.5 * Math.abs(dy))) {
      suppressTapUntil = performance.now() + 450;
      step(dx < 0 ? 1 : -1);
    } else schedule();
  }
  window.addEventListener('pointerup', releaseTouch);
  window.addEventListener('pointercancel', releaseTouch);
  window.addEventListener('click', event => {
    if (event.detail && performance.now() < suppressTapUntil && rail.contains(event.target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressTapUntil = 0;
    }
  }, true);
  atlas.addEventListener('focusin', schedule);
  atlas.addEventListener('focusout', () => queueMicrotask(schedule));

  function sceneFromURL() {
    const index = cards.findIndex(card => '#' + card.dataset.scene === location.hash);
    if (index !== -1 && index !== selected) select(index, true);
  }
  window.addEventListener('hashchange', sceneFromURL);
  cards.forEach(card => { card.hidden = true; });
  draw();
  sceneFromURL();
  new ResizeObserver(([entry]) => measure(entry.contentRect.width)).observe(rail);
  new IntersectionObserver(([entry]) => {
    nearby = entry.isIntersecting;
    refreshMedia();
  }, {rootMargin: '450px 0px'}).observe(rail);
  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .12;
    if (!visible) hold(false);
    refreshMedia();
    schedule();
  }, {threshold: [0, .12]}).observe(rail);
  document.addEventListener('visibilitychange', () => { refreshMedia(); schedule(); });
  reducedMotion.addEventListener('change', () => {
    if (!allowMotion()) select(glide ? glide.end : Math.round(position), true);
    refreshMedia(); schedule();
  });
})();
