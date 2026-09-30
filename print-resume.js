(() => {
  const settings = Object.fromEntries((window.resumePrintRaw || '').split(/\r?\n/).map(line => {
    const equal = line.indexOf('=');
    return equal < 0 || line.trimStart().startsWith('#') ? [] : [line.slice(0, equal).trim(), line.slice(equal + 1).trim()];
  }).filter(pair => pair.length === 2));
  const printLink = document.querySelector('[data-print-resume]');
  if (!printLink) return;

  const breaks = {
    pageBreakBeforeProjects: '#projects',
    pageBreakBeforeHowIWork: '#how-i-work',
    pageBreakBeforeTesting: '.work-story-reverse',
    pageBreakBeforeAI: '.work-view-b > .work-story:nth-child(3)',
    pageBreakBeforeExperience: '#experience',
    pageBreakBeforeCoreTools: '#core-tools',
    pageBreakBeforePlayStyle: '#play-style',
    pageBreakBeforeAbout: '#about',
    pageBreakBeforeContact: '#contact'
  };
  for (const [key, selector] of Object.entries(breaks)) {
    const element = document.querySelector(selector);
    if (element) element.classList.toggle('pdf-break-before', settings[key]?.toLowerCase() === 'yes');
  }

  const videos = {
    octoplug: {src: 'assets/octoplug-web.mp4', poster: 'assets/intro-octoplug.jpg'},
    dolleye: {src: 'assets/dolleye-web.mp4', poster: 'assets/intro-dolleye.jpg'},
    kimbaps: {src: 'assets/kimbaps-web.mp4', poster: 'assets/intro-kimbaps.jpg'}
  };
  const captureFrame = (src, seconds, fallback) => new Promise(resolve => {
    const video = document.createElement('video');
    let finished = false;
    const finish = image => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      video.removeAttribute('src');
      video.load();
      resolve(image);
    };
    const timeout = setTimeout(() => finish(fallback), 12000);
    video.muted = true;
    video.preload = 'auto';
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(Math.max(0, seconds), Math.max(0, video.duration - 0.05));
    }, {once: true});
    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        finish(canvas.toDataURL('image/jpeg', 0.88));
      } catch { finish(fallback); }
    }, {once: true});
    video.addEventListener('error', () => finish(fallback), {once: true});
    video.src = src;
  });

  const addPrintImage = (container, source) => {
    if (!container) return;
    let image = container.querySelector(':scope > .pdf-video-frame');
    if (!image) {
      image = document.createElement('img');
      image.className = 'pdf-video-frame';
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      container.append(image);
    }
    image.src = source;
  };
  let framesReady;
  const prepare = () => (framesReady ||= Promise.all(Object.entries(videos).map(async ([id, video]) => {
    const seconds = Number(settings[`${id}Frame`]);
    const source = await captureFrame(video.src, Number.isFinite(seconds) ? seconds : 0, video.poster);
    return [id, source];
  }))).then(frames => {
    const byId = Object.fromEntries(frames);
    const featured = document.querySelector('#featuredProject');
    const chosen = featured?.dataset.project;
    const featuredSource = byId[chosen] || (chosen === 'namer' ? 'assets/namer-still.jpg' : null);
    if (featuredSource) addPrintImage(featured.querySelector('.featured-media'), featuredSource);
    for (const card of document.querySelectorAll('.compact-project[data-project]')) {
      const source = byId[card.dataset.project] || (card.dataset.project === 'namer' ? 'assets/namer-still.jpg' : null);
      if (source) addPrintImage(card.querySelector('.compact-media'), source);
    }
    const poster = document.querySelector('.work-youtube-poster');
    if (poster && settings.interviewPoster) poster.src = settings.interviewPoster;
    document.documentElement.classList.add('pdf-ready');
    return frames;
  });

  printLink.addEventListener('click', async event => {
    event.preventDefault();
    printLink.setAttribute('aria-busy', 'true');
    await prepare();
    printLink.removeAttribute('aria-busy');
    window.print();
  });
  window.resumePreparePrint = prepare;
  if (new URLSearchParams(location.search).has('pdf-preview')) prepare();
})();
