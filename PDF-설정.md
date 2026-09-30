# PDF RESUME 사용법

CONTACT의 **PDF RESUME** 버튼은 PDF 파일을 새 창에서 바로 엽니다. 브라우저의 PDF 보기 화면에서 읽거나 내려받을 수 있습니다.

PDF는 현재 웹 이력서의 문구와 디자인을 바탕으로 다음 8페이지로 만듭니다.

1. INTRO - 가운데
2. PROJECTS - Octoplug, Doll·Eye Pinball
3. PROJECTS - Rolling Kimbaps, Namer
4. HOW I WORK - 협업, 검증, AI 활용
5. EXPERIENCE + CORE TOOLS
6. PLAY STYLE + WHAT I'VE BUILT
7. ABOUT ME
8. CONTACT - 가운데

게임 영상의 정지 장면은 [content/pdf.js](content/pdf.js)에서 초 단위로 지정합니다. `215`는 3분 35초입니다. Namer는 원본의 7분 59초부터 만든 짧은 영상과 그 시점의 이미지를 사용합니다. 유튜브 인터뷰는 준비한 2분 25초 장면 이미지(`interviewPoster`)를 사용합니다. 다른 시점을 원하면 말씀해 주세요.

내용을 고쳐 GitHub에 올리면 PDF를 다시 만드는 작업이 자동으로 실행됩니다. 갱신이 끝난 뒤 공개 이력서의 버튼을 눌러 새 창에서 확인하세요. 한 페이지의 내용이 길어지면 글이나 카드가 잘리는지 확인해야 합니다. 이 프로젝트에서 직접 만들 때는 먼저 `npm install --prefix tmp/tools/playwright --no-save playwright-core@1.62.1`을 한 번 실행하고, 그다음 `node scripts/build-pdf.mjs`를 실행하면 됩니다.
