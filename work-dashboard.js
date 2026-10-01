(() => {
  const media = document.querySelector('.work-dashboard-media');
  if (!media || new URLSearchParams(location.search).has('pdf-export')) return;
  const slides = [...media.querySelectorAll('.work-dashboard-slide')];
  slides.forEach(slide => slide.querySelector('img').loading = 'eager');
  const count = media.querySelector('.work-dashboard-count');
  const pause = media.querySelector('[data-dashboard-pause]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, paused = reduced.matches, visible = false, timer;
  const arm = () => {
    clearTimeout(timer);
    if (!paused && visible && !document.hidden) timer = setTimeout(() => show(current + 1), 2600);
  };
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.hidden = i !== current);
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    arm();
  };
  const updatePause = () => {
    pause.textContent = paused ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-label', paused ? '자동 재생 시작' : '자동 재생 일시 정지');
    arm();
  };
  media.querySelector('[data-dashboard-previous]').addEventListener('click', () => show(current - 1));
  media.querySelector('[data-dashboard-next]').addEventListener('click', () => show(current + 1));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  media.addEventListener('focusin', event => { if (event.target !== pause) { paused = true; updatePause(); } });
  reduced.addEventListener('change', event => { if (event.matches) { paused = true; updatePause(); } });
  document.addEventListener('visibilitychange', arm);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; arm(); }, {threshold:0.2}).observe(media);
  } else { visible = true; }
  show(0);
  updatePause();
})();
