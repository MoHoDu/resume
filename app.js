(() => {
  // 각 이미지는 SELECTED PROJECTS 영상의 같은 시작 시점에서 추출했습니다.
  const projects = [
    {copyId:'octoplug', title:window.resumeText('intro','octoplugTitle'), category:window.resumeText('intro','octoplugCategory'), descriptor:window.resumeText('intro','octoplugDescription'), src:'assets/intro-octoplug.jpg', frameAt:108},
    {copyId:'dolleye', title:window.resumeText('intro','dolleyeTitle'), category:window.resumeText('intro','dolleyeCategory'), descriptor:window.resumeText('intro','dolleyeDescription'), src:'assets/intro-dolleye.jpg', frameAt:215},
    {copyId:'kimbaps', title:window.resumeText('intro','kimbapsTitle'), category:window.resumeText('intro','kimbapsCategory'), descriptor:window.resumeText('intro','kimbapsDescription'), src:'assets/intro-kimbaps.jpg', frameAt:26},
    {copyId:'namer', title:window.resumeText('intro','namerTitle'), category:window.resumeText('intro','namerCategory'), descriptor:window.resumeText('intro','namerDescription'), src:'assets/intro-namer.jpg', frameAt:0}
  ];
  const frame=document.getElementById('gameFrame');
  const title=document.getElementById('projectTitle'), category=document.getElementById('projectCategory'), descriptor=document.getElementById('projectDescriptor'), number=document.getElementById('projectNumber'), fill=document.getElementById('progressFill');
  const pauseButton=document.getElementById('pause');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration=2600; let current=0, paused=reduced.matches, timer=0, started=0, remaining=duration;
  function show(i){
    current=(i+projects.length)%projects.length;
    const p=projects[current];
    frame.src=p.src;
    frame.alt=`${p.title} 게임 장면`;
    frame.dataset.frameAt=String(p.frameAt);
    title.textContent=p.title;category.textContent=p.category;descriptor.textContent=p.descriptor;
    window.resumeStyle('intro',`${p.copyId}Title`,title,true);
    window.resumeStyle('intro',`${p.copyId}Category`,category,true);
    window.resumeStyle('intro',`${p.copyId}Description`,descriptor,true);
    number.textContent=`0${current+1} / 04`;
    fill.style.width=`${(current+1)*25}%`;
    remaining=duration;started=Date.now();if(!paused)arm();
  }
  function arm(){clearTimeout(timer);if(paused)return;started=Date.now();timer=setTimeout(()=>show(current+1),remaining)}
  function togglePause(){
    paused=!paused;
    pauseButton.textContent=paused?'▶':'Ⅱ';
    pauseButton.setAttribute('aria-label',paused?'자동 재생 시작':'자동 재생 일시 정지');
    if(paused){clearTimeout(timer);remaining=Math.max(0,remaining-(Date.now()-started))}
    else arm();
  }
  document.getElementById('previous').addEventListener('click',()=>show(current-1));
  document.getElementById('next').addEventListener('click',()=>show(current+1));
  pauseButton.addEventListener('click',togglePause);
  reduced.addEventListener?.('change',event=>{if(event.matches&&!paused)togglePause()});
  show(0);
  if(paused){pauseButton.textContent='▶';pauseButton.setAttribute('aria-label','자동 재생 시작')}
})();
