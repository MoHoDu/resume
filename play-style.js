(() => {
  const section = document.querySelector('.play-style-section');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    section.classList.add('is-visible');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.classList.add('is-visible');
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
})();
