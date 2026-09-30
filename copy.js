// 각 구역의 content/*.js에서 문구를 읽어 화면에 표시합니다.
(() => {
  const copy = {};
  for (const [area, raw] of Object.entries(window.resumeCopyRaw || {})) {
    const values = {};
    for (const line of raw.split(/\r?\n/)) {
      const separator = line.indexOf('=');
      if (separator < 0 || line.trimStart().startsWith('#')) continue;
      const key = line.slice(0, separator).trim();
      if (key) values[key] = line.slice(separator + 1).trim();
    }
    copy[area] = values;
  }
  window.resumeCopy = copy;
  const formatText = value => String(value).replaceAll('|', '\n');
  window.resumeText = (area, key, fallback = '') => formatText(copy[area]?.[key] ?? fallback);
  window.resumeStyle = (area, key, element, reset = false) => {
    if (!element) return;
    if (reset) for (const property of ['color', 'fontSize', 'fontFamily', 'fontWeight', 'textAlign', 'whiteSpace']) element.style[property] = '';
    const values = copy[area] || {};
    const color = values[`${key}.color`];
    const size = values[`${key}.size`];
    const font = values[`${key}.font`];
    const weight = values[`${key}.weight`];
    const align = values[`${key}.align`];
    if (color) element.style.color = color;
    if (size) element.style.fontSize = size;
    if (font) element.style.fontFamily = font;
    if (weight) element.style.fontWeight = weight;
    if (align) element.style.textAlign = align;
    if (window.resumeText(area, key).includes('\n')) element.style.whiteSpace = 'pre-line';
  };

  const root = document;
  const originalTextNodes = new WeakMap();
  const set = (selector, area, key) => {
    const element = root.querySelector(selector);
    if (element && key in (copy[area] || {})) {
      element.textContent = window.resumeText(area, key);
      window.resumeStyle(area, key, element);
    }
  };
  const direct = (selector, area, key, index = 0) => {
    const element = root.querySelector(selector);
    if (element && !originalTextNodes.has(element)) originalTextNodes.set(element, [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()));
    const nodes = element && originalTextNodes.get(element);
    if (nodes?.[index] && key in (copy[area] || {})) {
      nodes[index].nodeValue = window.resumeText(area, key);
      window.resumeStyle(area, key, element);
    }
  };
  const pairs = (area, items) => items.forEach(([selector, key]) => set(selector, area, key));
  pairs('intro', [
    ['.site-links a:nth-child(1)', 'navProjects'], ['.site-links a:nth-child(2)', 'navExperience'],
    ['.site-links a:nth-child(3)', 'navAbout'], ['.hero-name-kr', 'name'],
    ['.hero-copy h2 small', 'englishName'], ['.hero-description', 'description']
  ]);
  direct('.site-logo', 'intro', 'siteName');
  direct('.site-links a:nth-child(4)', 'intro', 'navContact');
  direct('.hero-kicker', 'intro', 'jobTitle');
  direct('.hero-kicker', 'intro', 'location', 1);
  direct('.hero-link', 'intro', 'projectButton');
  direct('.hero-footer > span:first-child', 'intro', 'footerLabel');
  direct('.hero-footer > span:first-child', 'intro', 'footerYears', 1);
  direct('.scroll-cue', 'intro', 'scrollCue');

  pairs('projects', [
    ['.projects-intro .eyebrow', 'eyebrow'], ['#projectsTitle', 'heading'],
    ['.projects-intro p', 'introduction'], ['.project-meta > div:nth-child(1) dt', 'genreLabel'],
    ['.project-meta > div:nth-child(2) dt', 'teamLabel'], ['.project-meta > div:nth-child(3) dt', 'roleLabel'],
    ['.project-more > span', 'coreLabel'], ['.project-actions a:nth-child(1)', 'playLabel'],
    ['.project-actions a:nth-child(2)', 'githubLabel'], ['.project-actions a:nth-child(3)', 'videoLabel'],
    ['#projects .about-footer span:nth-child(1)', 'footerName'], ['#projects .about-footer span:nth-child(2)', 'footerYear']
  ]);
  direct('.projects-guide', 'projects', 'guide');
  direct('.featured-label', 'projects', 'selectedLabel');
  direct('.view-project-link', 'projects', 'detailLabel');

  pairs('work', [['.work-intro .eyebrow', 'eyebrow'], ['.work-intro p', 'introduction']]);
  set('#workTitle', 'work', 'heading');
  const workCases = [
    ['.work-story-collaborate', 'collaboration', ['Role', 'Evidence']],
    ['.work-story-reverse', 'testing', ['Process', 'Evidence']],
    ['.work-view-b > .work-story:nth-child(3)', 'ai', ['Role', 'Evidence']]
  ];
  for (const [base, prefix, labels] of workCases) {
    pairs('work', [
      [`${base} .work-media-tag`, `${prefix}Tag`],
      [`${base} .work-media-caption span`, `${prefix}MediaLabel`],
      [`${base} .work-media-caption strong`, `${prefix}MediaTitle`],
      [`${base} .work-number`, `${prefix}Number`],
      [`${base} .work-story-copy > p`, `${prefix}Description`],
      [`${base} .work-evidence > div:nth-child(1) dt`, `${prefix}${labels[0]}Label`],
      [`${base} .work-evidence > div:nth-child(1) dd`, `${prefix}${labels[0]}`],
      [`${base} .work-evidence > div:nth-child(2) dt`, `${prefix}${labels[1]}Label`],
      [`${base} .work-evidence > div:nth-child(2) dd`, `${prefix}${labels[1]}`]
    ]);
    set(`${base} .work-story-copy h3`, 'work', `${prefix}Heading`);
    direct(`${base} .work-link`, 'work', `${prefix}LinkLabel`);
  }
  const collaborationLink = root.querySelector('.work-story-collaborate .work-link');
  if (copy.work?.collaborationUrl) {
    collaborationLink.href = copy.work.collaborationUrl;
    collaborationLink.classList.remove('is-placeholder');
  }
  for (const [base, key] of [['.work-story-reverse', 'testingUrl'], ['.work-view-b > .work-story:nth-child(3)', 'aiUrl']]) {
    const placeholder = root.querySelector(`${base} .work-link`);
    if (!placeholder || !copy.work?.[key]) continue;
    const link = root.createElement('a');
    link.className = 'work-link';
    link.href = copy.work[key];
    link.replaceChildren(...placeholder.childNodes);
    placeholder.replaceWith(link);
  }

  pairs('experience', [
    ['.experience-section .eyebrow', 'eyebrow'], ['#experienceTitle', 'heading'],
    ['.experience-company h3', 'company'], ['.experience-company p', 'position'],
    ['.experience-strip time', 'period'], ['.experience-detail strong', 'summary'],
    ['.experience-detail li:nth-child(1)', 'point1'], ['.experience-detail li:nth-child(2)', 'point2'],
    ['.experience-detail li:nth-child(3)', 'point3']
  ]);

  pairs('tools', [['.core-tools-heading .eyebrow', 'eyebrow'], ['#coreToolsTitle', 'heading'], ['.core-tools-heading > p', 'introduction']]);
  const toolGroups = [
    ['.tool-group-build', 'buildHeading', [['unityName', 'unityDescription'], ['csharpName', 'csharpDescription']]],
    ['.tool-group:nth-child(2)', 'designHeading', [['figmaName', 'figmaDescription'], ['excelName', 'excelDescription']]],
    ['.tool-group:nth-child(3)', 'collaborationHeading', [['jiraName', 'jiraDescription'], ['confluenceName', 'confluenceDescription'], ['gitName', 'gitDescription']]],
    ['.tool-group:nth-child(4)', 'aiHeading', [['chatgptName', 'chatgptDescription'], ['claudeName', 'claudeDescription'], ['geminiName', 'geminiDescription']]]
  ];
  for (const [base, heading, tools] of toolGroups) {
    direct(`${base} h3`, 'tools', heading);
    tools.forEach(([name, description], index) => {
      set(`${base} .tool-slot:nth-child(${index + 1}) strong`, 'tools', name);
      set(`${base} .tool-slot:nth-child(${index + 1}) small`, 'tools', description);
    });
  }

  pairs('play', [
    ['.play-panel .eyebrow', 'playEyebrow'], ['#playStyleTitle', 'playHeading'],
    ['.play-panel .play-build-heading p', 'playSubtitle'], ['.radar-figure figcaption', 'radarCaption'],
    ['.play-style-stats > div:nth-child(1) strong', 'gamesCount'], ['.play-style-stats > div:nth-child(1) span', 'gamesLabel'],
    ['.play-style-stats > div:nth-child(2) strong', 'genresCount'], ['.play-style-stats > div:nth-child(2) span', 'genresLabel'],
    ['.built-panel .eyebrow', 'builtEyebrow'], ['#builtTitle', 'builtHeading'],
    ['.built-panel .play-build-heading p', 'builtSubtitle'],
    ['.built-stats > div:nth-child(1) strong', 'projectsCount'], ['.built-stats > div:nth-child(1) span', 'projectsLabel'],
    ['.built-stats > div:nth-child(2) strong', 'soloCount'], ['.built-stats > div:nth-child(2) span', 'soloLabel'],
    ['.built-stats > div:nth-child(3) strong', 'teamCount'], ['.built-stats > div:nth-child(3) span', 'teamLabel'],
    ['.distribution-label', 'distributionLabel'],
    ['.tool-experience > span', 'toolsLabel'], ['.release-experience > span', 'distributionHeading']
  ]);
  const playGenres = [['rpgLabel','rpgCount'], ['platformLabel','platformCount'], ['roguelikeLabel','roguelikeCount'], ['adventureLabel','adventureCount'], ['simulationLabel','simulationCount'], ['survivalLabel','survivalCount'], ['otherLabel','otherCount']];
  playGenres.forEach(([label, count], index) => {
    set(`.play-genre-list li:nth-child(${index + 1}) span`, 'play', label);
    set(`.play-genre-list li:nth-child(${index + 1}) strong`, 'play', count);
    if (index < 6) {
      set(`.radar-labels text:nth-child(${index + 1}) tspan:nth-child(1)`, 'play', label);
      set(`.radar-labels text:nth-child(${index + 1}) tspan:nth-child(2)`, 'play', count);
    }
  });
  const radarValues = playGenres.slice(0, 6).map(([, count]) => Number(copy.play?.[count]));
  if (radarValues.every(value => Number.isFinite(value) && value >= 0)) {
    const maximum = Math.max(15, ...radarValues);
    const points = radarValues.map((value, index) => {
      const angle = (-90 + index * 60) * Math.PI / 180;
      const radius = value / maximum * 200;
      return [310 + Math.cos(angle) * radius, 300 + Math.sin(angle) * radius];
    });
    root.querySelector('.radar-area').setAttribute('points', points.map(point => point.join(',')).join(' '));
    root.querySelector('.radar-line').setAttribute('points', [...points, points[0]].map(point => point.join(',')).join(' '));
    root.querySelectorAll('.radar-points circle').forEach((circle, index) => {
      circle.setAttribute('cx', points[index][0]);
      circle.setAttribute('cy', points[index][1]);
    });
    root.querySelector('#radarDescription').textContent = playGenres.slice(0, 6).map(([label, count]) => `${copy.play[label]} ${copy.play[count]}`).join(', ');
  }
  const builtGenres = [['casualLabel','casualCount'], ['puzzleLabel','puzzleCount'], ['runnerLabel','runnerCount'], ['rogueliteLabel','rogueliteCount'], ['multiplayerLabel','multiplayerCount'], ['pinballLabel','pinballCount']];
  builtGenres.forEach(([label, count], index) => {
    set(`.build-genre-list li:nth-child(${index + 1}) span`, 'play', label);
    set(`.build-genre-list li:nth-child(${index + 1}) strong`, 'play', count);
    const dots = root.querySelector(`.build-genre-list li:nth-child(${index + 1}) .genre-dots`);
    const number = Number(copy.play?.[count]);
    if (dots && Number.isInteger(number) && number >= 0 && number <= 20) {
      dots.replaceChildren(...Array.from({length:number}, () => root.createElement('b')));
      dots.setAttribute('aria-label', `${number} projects`);
    }
  });
  root.querySelector('.play-style-stats').setAttribute('aria-label', `${copy.play.gamesCount} games, ${copy.play.genresCount} genres`);
  root.querySelector('.built-stats').setAttribute('aria-label', `${copy.play.projectsCount} projects, ${copy.play.soloCount} solo, ${copy.play.teamCount} team`);
  const inlineStats = [
    ['.tool-experience p', [['unityLabel','unityCount'], ['godotLabel','godotCount'], ['webLabel','webCount']]],
    ['.release-experience p', [['releasedLabel','releasedCount'], ['webBuildLabel','webBuildCount']]]
  ];
  for (const [base, stats] of inlineStats) {
    stats.forEach(([label, count], index) => {
      direct(base, 'play', label, index);
      set(`${base} b:nth-of-type(${index + 1})`, 'play', count);
    });
  }
  direct('.release-experience p', 'play', 'remainingLabel', 2);

  pairs('about', [
    ['.about-heading .eyebrow', 'eyebrow'], ['#aboutTitle', 'heading'], ['.about-heading > p', 'introduction']
  ]);
  for (let index = 1; index <= 3; index++) {
    set(`.about-question:nth-child(${index}) h3`, 'about', `question${index}`);
    direct(`.about-question:nth-child(${index}) p`, 'about', `answer${index}`);
  }

  pairs('contact', [
    ['.contact-identity .eyebrow', 'eyebrow'], ['.contact-name span', 'jobTitle'],
    ['.contact-signoff', 'signoff'], ['.contact-bottom > span', 'footerName']
  ]);
  const contactTitle = root.querySelector('.contact-identity h2');
  if (contactTitle && 'heading' in (copy.contact || {})) {
    const heading = window.resumeText('contact', 'heading');
    const hasAccent = heading.endsWith('.');
    contactTitle.textContent = hasAccent ? heading.slice(0, -1) : heading;
    if (hasAccent) {
      const accent = root.createElement('span');
      accent.textContent = '.';
      contactTitle.append(accent);
    }
    window.resumeStyle('contact', 'heading', contactTitle);
  }
  direct('.contact-name', 'contact', 'name');
  direct('.contact-links a:nth-child(1)', 'contact', 'emailLabel');
  direct('.contact-links a:nth-child(2)', 'contact', 'githubLabel');
  direct('.contact-links a:nth-child(3)', 'contact', 'pdfLabel');
  direct('.contact-bottom a', 'contact', 'backToTop');
  for (const [selector, label, value, placeholder] of [
    ['.contact-email', 'emailLabel', 'emailAddress', '이메일 입력 예정'],
    ['.contact-phone', 'phoneLabel', 'phoneNumber', '전화번호 입력 예정'],
    ['.contact-github', 'githubLabel', 'githubUrl', 'GitHub 주소 입력 예정']
  ]) {
    const row = root.querySelector(selector);
    row.previousElementSibling.textContent = window.resumeText('contact', label);
    row.textContent = copy.contact?.[value] || placeholder;
    row.classList.toggle('is-pending', !copy.contact?.[value]);
    window.resumeStyle('contact', value, row);
  }
  const contactLinks = [
    ['.contact-links a:nth-child(1)', copy.contact?.emailAddress ? `mailto:${copy.contact.emailAddress}` : ''],
    ['.contact-links a:nth-child(2)', copy.contact?.githubUrl],
    ['.contact-links a:nth-child(3)', copy.contact?.pdfUrl]
  ];
  for (const [selector, href] of contactLinks) {
    if (href) {
      const link = root.querySelector(selector);
      link.href = selector.includes('nth-child(3)') ? `${href}?v=${Date.now()}` : href;
      link.classList.remove('contact-placeholder');
      link.removeAttribute('aria-disabled');
      link.removeAttribute('aria-label');
    }
  }
})();
