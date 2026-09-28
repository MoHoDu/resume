(() => {
  const media = document.querySelector('.work-youtube-media');
  if (!media) return;

  const frame = media.querySelector('.work-youtube-frame');
  const playButton = media.querySelector('.work-youtube-play');
  const closeButton = media.querySelector('.work-youtube-close');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videoUrl = 'https://www.youtube.com/embed/1XGQy6NHdd8?start=142&end=162&autoplay=1&mute=1&controls=1&playsinline=1&rel=0';

  const start = () => {
    if (!frame.hidden) return;
    frame.src = videoUrl;
    frame.hidden = false;
    closeButton.hidden = false;
    media.classList.add('is-playing');
  };

  const stop = () => {
    if (frame.hidden) return;
    frame.hidden = true;
    frame.removeAttribute('src');
    closeButton.hidden = true;
    media.classList.remove('is-playing');
  };

  media.addEventListener('pointerenter', event => {
    if ((event.pointerType === 'mouse' || event.pointerType === 'pen') && !reducedMotion.matches) start();
  });
  media.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') stop();
  });
  playButton.addEventListener('click', start);
  closeButton.addEventListener('click', () => {
    stop();
    playButton.focus();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) stop();
    }, {threshold: 0.1}).observe(media);
  }
})();
