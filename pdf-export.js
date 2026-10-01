(() => {
  if (!new URLSearchParams(location.search).has('pdf-export')) return;

  const settings = Object.fromEntries((window.resumePrintRaw || '').split(/\r?\n/).map(line => {
    const equal = line.indexOf('=');
    return equal < 0 || line.trimStart().startsWith('#') ? [] : [line.slice(0, equal).trim(), line.slice(equal + 1).trim()];
  }).filter(pair => pair.length === 2));
  const documentRoot = document.getElementById('pdfDocument');
  const text = (id, field) => window.resumeText('projects', `${id}${field}`) || '';
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  const captureFrame = (src, seconds, fallback) => new Promise(resolve => {
    const video = document.createElement('video');
    let done = false;
    const finish = image => {
      if (done) return;
      done = true;
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

  const clone = selector => document.querySelector(selector).cloneNode(true);
  const page = (number, className, children) => {
    const section = document.createElement('section');
    section.className = `pdf-page ${className}`;
    section.dataset.page = number;
    section.append(...children);
    documentRoot.append(section);
    return section;
  };
  const projectCard = (id, number, image) => {
    const card = document.createElement('article');
    card.className = 'pdf-project-card';
    const links = [
      ['PlayUrl', 'playLabel'], ['GithubUrl', 'githubLabel'],
      ['VideoUrl', 'videoLabel'], ['DetailUrl', 'detailLabel']
    ].filter(([url]) => text(id, url)).map(([url, label]) =>
      `<a href="${escapeHtml(text(id, url))}">${escapeHtml(window.resumeText('projects', label))} ↗</a>`).join('');
    const period = text(id, 'Period');
    card.innerHTML = `
      <div class="pdf-project-media"><img src="${image}" alt="${escapeHtml(text(id, 'Title'))} 게임 장면"><span class="featured-label">SELECTED / ${number}</span></div>
      <div class="pdf-project-info">
        <span class="pdf-project-type">${escapeHtml(text(id, 'Type'))}</span>
        <h3>${escapeHtml(text(id, 'Title'))}</h3>
        ${period ? `<p class="pdf-project-period">${escapeHtml(period)}</p>` : ''}
        <p class="pdf-project-summary">${escapeHtml(text(id, 'Summary'))}</p>
        <dl class="pdf-project-meta">
          <div><dt>${escapeHtml(window.resumeText('projects', 'genreLabel'))}</dt><dd>${escapeHtml(text(id, 'Genre'))}</dd></div>
          <div><dt>${escapeHtml(window.resumeText('projects', 'teamLabel'))}</dt><dd>${escapeHtml(text(id, 'Team'))}</dd></div>
          <div><dt>${escapeHtml(window.resumeText('projects', 'roleLabel'))}</dt><dd>${escapeHtml(text(id, 'Role'))}</dd></div>
        </dl>
        <div class="pdf-project-result"><span>${escapeHtml(window.resumeText('projects', 'coreLabel'))}</span><p>${escapeHtml(text(id, 'Core'))}</p></div>
        ${links ? `<nav class="pdf-project-links">${links}</nav>` : ''}
      </div>`;
    return card;
  };

  async function build() {
    try {
      const intro = clone('#resumeFrame');
      const videos = [
        ['octoplug', 'assets/octoplug-web.mp4', 'assets/intro-octoplug.jpg'],
        ['dolleye', 'assets/dolleye-web.mp4', 'assets/intro-dolleye.jpg'],
        ['kimbaps', 'assets/kimbaps-web.mp4', 'assets/intro-kimbaps.jpg']
      ];
      const frames = Object.fromEntries(await Promise.all(videos.map(async ([id, src, fallback]) => {
        const seconds = Number(settings[`${id}Frame`]);
        return [id, await captureFrame(src, Number.isFinite(seconds) ? seconds : 0, fallback)];
      })));
      frames.namer = 'assets/namer-still.jpg';

      page(1, 'pdf-intro-page', [intro]);
      const projects = [
        projectCard('octoplug', '01', frames.octoplug),
        projectCard('dolleye', '02', frames.dolleye),
        projectCard('kimbaps', '03', frames.kimbaps),
        projectCard('namer', '04', frames.namer)
      ];
      for (let group = 0; group < 2; group++) {
        const header = clone('.projects-intro');
        header.querySelector('.projects-guide')?.remove();
        const grid = document.createElement('div');
        grid.className = 'pdf-project-list';
        grid.append(...projects.slice(group * 2, group * 2 + 2));
        page(group + 2, 'pdf-projects-page', [header, grid]);
      }

      const workHeader = clone('.work-intro');
      const workList = document.createElement('div');
      workList.className = 'pdf-work-list';
      const visibleWork = [...document.querySelectorAll('#workViewB > .work-story')].filter(story => !story.hidden);
      workList.append(...visibleWork.map(story => story.cloneNode(true)));
      workList.style.gridTemplateRows = `repeat(${visibleWork.length}, minmax(0, 1fr))`;
      workList.querySelectorAll('button,iframe').forEach(element => element.remove());
      workList.querySelectorAll('.work-dashboard-controls').forEach(element => element.remove());
      workList.querySelectorAll('.work-dashboard-slide').forEach(element => element.hidden = false);
      const poster = workList.querySelector('.work-youtube-poster');
      if (poster && settings.interviewPoster) poster.src = settings.interviewPoster;
      page(4, 'pdf-work-page', [workHeader, workList]);

      page(5, 'pdf-experience-page', [clone('#experience'), clone('#core-tools')]);
      page(6, 'pdf-play-page', [clone('#play-style')]);
      page(7, 'pdf-about-page', [clone('#about')]);
      const contact = clone('#contact');
      const contactHeading = contact.querySelector('.contact-identity');
      contact.prepend(contactHeading);
      page(8, 'pdf-contact-page', [contact]);

      await document.fonts.ready;
      await Promise.all([...documentRoot.querySelectorAll('img')].map(image => {
        image.loading = 'eager';
        return Promise.race([
          image.decode().catch(() => {}),
          new Promise(resolve => setTimeout(resolve, 6000))
        ]);
      }));
      document.documentElement.classList.add('pdf-ready');
      window.pdfReady = true;
    } catch (error) {
      window.pdfError = String(error);
      console.error(error);
    }
  }
  // Called after print styles are active. Text can change without hand-tuning page heights.
  window.balanceResumePdf = () => {
    const innerHeight = element => {
      const style = getComputedStyle(element);
      return element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    };
    documentRoot.querySelectorAll('.pdf-projects-page, .pdf-work-page').forEach(sheet => {
      const header = sheet.firstElementChild;
      const list = sheet.lastElementChild;
      const headerStyle = getComputedStyle(header);
      const room = innerHeight(sheet) - header.getBoundingClientRect().height - parseFloat(headerStyle.marginBottom);
      list.style.height = `${Math.floor(room)}px`;
    });
    const playPage = documentRoot.querySelector('.pdf-play-page');
    const playSection = playPage.querySelector('.play-style-section');
    const playGrid = playSection.querySelector('.play-build-grid');
    playGrid.style.height = `${Math.floor(innerHeight(playPage))}px`;

    const aboutPage = documentRoot.querySelector('.pdf-about-page');
    const about = aboutPage.querySelector('.about-section');
    const header = about.querySelector('.about-heading');
    const questions = [...about.querySelectorAll('.about-question')];
    const qa = about.querySelector('.about-qa');
    const headerStyle = getComputedStyle(header);
    const available = innerHeight(aboutPage) - header.getBoundingClientRect().height - parseFloat(headerStyle.marginBottom);
    qa.style.height = 'auto';
    qa.style.gridTemplateRows = 'auto';
    const minimums = questions.map(question => question.getBoundingClientRect().height);
    const spare = Math.max(0, available - minimums.reduce((a, b) => a + b, 0));
    const weights = questions.map(question => Math.max(1, question.textContent.trim().length / 90));
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    qa.style.height = `${Math.floor(available)}px`;
    qa.style.gridTemplateRows = minimums.map((minimum, index) => `${Math.floor(minimum + spare * weights[index] / totalWeight)}px`).join(' ');

    const errors = [];
    documentRoot.querySelectorAll('.pdf-page').forEach(sheet => {
      if (sheet.scrollHeight > sheet.clientHeight + 2) errors.push(`page ${sheet.dataset.page} overflows`);
    });
    documentRoot.querySelectorAll('.pdf-project-info, .pdf-work-page .work-story-copy, .pdf-play-page .play-build-panel, .pdf-about-page .about-question').forEach(element => {
      if (element.scrollHeight > element.clientHeight + 3) errors.push(`${element.closest('.pdf-page').dataset.page}: ${element.className} is clipped`);
    });
    return errors;
  };
  build();
})();
