(() => {
  const content = (id, field) => window.resumeText('projects', `${id}${field}`);
  const projects = [
    {id:'octoplug',index:'01',kind:'video',src:'assets/octoplug-web.mp4',poster:'assets/intro-octoplug.jpg',start:108},
    {id:'dolleye',index:'02',kind:'video',src:'assets/dolleye-web.mp4',poster:'assets/intro-dolleye.jpg',start:215},
    {id:'kimbaps',index:'03',kind:'video',src:'assets/kimbaps-web.mp4',poster:'assets/intro-kimbaps.jpg',start:26},
    // 웹 영상의 0초는 원본 영상의 7분 59초입니다.
    {id:'namer',index:'04',kind:'video',src:'assets/namer-web.mp4',poster:'assets/namer-still.jpg',start:0,sourceStart:479}
  ].map(project => ({
    ...project,
    title:content(project.id,'Title'),type:content(project.id,'Type'),period:content(project.id,'Period'),
    genre:content(project.id,'Genre'),team:content(project.id,'Team'),role:content(project.id,'Role'),
    summary:content(project.id,'Summary'),core:content(project.id,'Core'),
    playUrl:content(project.id,'PlayUrl'),githubUrl:content(project.id,'GithubUrl'),
    videoUrl:content(project.id,'VideoUrl'),detailUrl:content(project.id,'DetailUrl')
  }));
  const featured=document.getElementById('featuredProject'),video=document.getElementById('featuredVideo'),image=document.getElementById('featuredImage'),grid=document.getElementById('projectCardGrid');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fields={index:document.getElementById('featuredIndex'),type:document.getElementById('featuredType'),title:document.getElementById('featuredTitle'),period:document.getElementById('featuredPeriod'),summary:document.getElementById('featuredSummary'),genre:document.getElementById('featuredGenre'),team:document.getElementById('featuredTeam'),role:document.getElementById('featuredRole'),core:document.getElementById('featuredCore')};
  const escapeHtml=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let currentId='octoplug',swapTimer;
  const seekAndPlay=(project)=>{const seek=()=>{if(Number.isFinite(video.duration)&&video.duration>project.start)video.currentTime=project.start;if(!reducedMotion.matches)video.play().catch(()=>{})};if(video.readyState>=1)seek();else video.addEventListener('loadedmetadata',seek,{once:true})};
  const syncLinks=project=>{
    for(const [kind,url] of Object.entries({play:project.playUrl,github:project.githubUrl,video:project.videoUrl,detail:project.detailUrl})){
      const link=featured.querySelector(`[data-project-link="${kind}"]`);
      link.href=url||'#';
      link.hidden=kind!=='detail'&&!url;
      link.classList.toggle('is-placeholder',!url);
    }
    featured.querySelector('.project-actions').hidden=!project.playUrl&&!project.githubUrl&&!project.videoUrl;
  };
  const renderCards=()=>{grid.replaceChildren(...projects.filter(project=>project.id!==currentId).map(project=>{const card=document.createElement('button');card.className='compact-project';card.type='button';card.dataset.project=project.id;card.setAttribute('aria-label',`${project.title} 프로젝트 선택`);const preview=project.kind==='video'?`<video muted playsinline preload="metadata" src="${project.src}" poster="${project.poster}" aria-hidden="true"></video>`:`<img src="${project.still}" alt="" aria-hidden="true">`;card.innerHTML=`<span class="compact-media">${preview}<span class="media-index">${project.index}</span></span><span class="compact-copy"><span class="compact-type">${escapeHtml(project.type)}</span><strong>${escapeHtml(project.title)}</strong><span class="compact-summary">${escapeHtml(project.summary)}</span><span class="compact-select">${escapeHtml(window.resumeText('projects','cardSelectLabel'))} <i aria-hidden="true">↗</i></span></span>`;for(const [field,selector] of [['Type','.compact-type'],['Title','strong'],['Summary','.compact-summary']])window.resumeStyle('projects',`${project.id}${field}`,card.querySelector(selector));window.resumeStyle('projects','cardSelectLabel',card.querySelector('.compact-select'));if(project.kind==='video'){const previewVideo=card.querySelector('video');previewVideo.addEventListener('loadedmetadata',()=>{if(previewVideo.duration>project.start)previewVideo.currentTime=project.start},{once:true})}return card}))};
  const showProject=(id,immediate=false)=>{const project=projects.find(item=>item.id===id);if(!project||(!immediate&&project.id===currentId))return;clearTimeout(swapTimer);featured.classList.add('is-switching');const update=()=>{currentId=project.id;featured.dataset.project=project.id;Object.entries(fields).forEach(([key,element])=>{element.textContent=project[key];if(key!=='index')window.resumeStyle('projects',`${project.id}${key[0].toUpperCase()+key.slice(1)}`,element,true);if(key==='period')element.hidden=!project.period});syncLinks(project);video.pause();if(project.kind==='video'){image.hidden=true;video.hidden=false;video.poster=project.poster;if(!video.getAttribute('src').endsWith(project.src)){video.src=project.src;video.load()}video.setAttribute('aria-label',`${project.title} 플레이 영상`);seekAndPlay(project)}else{video.hidden=true;image.hidden=false;image.src=reducedMotion.matches?project.still:project.src;image.alt=`${project.title} 플레이 장면`}renderCards();requestAnimationFrame(()=>featured.classList.remove('is-switching'))};if(immediate||reducedMotion.matches)update();else swapTimer=window.setTimeout(update,180)};
  grid.addEventListener('click',event=>{const card=event.target.closest('.compact-project');if(card)showProject(card.dataset.project)});
  document.querySelectorAll('[data-project-link]').forEach(link=>link.addEventListener('click',event=>{if(link.getAttribute('href')==='#')event.preventDefault()}));
  reducedMotion.addEventListener?.('change',()=>showProject(currentId,true));
  showProject('octoplug',true);
})();
