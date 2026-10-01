# PDF RESUME 사용법

CONTACT의 **PDF RESUME** 버튼은 PDF 파일을 새 창에서 바로 엽니다. 브라우저의 PDF 보기 화면에서 읽거나 내려받을 수 있습니다.

PDF는 현재 웹 이력서의 문구와 디자인을 바탕으로 다음 8페이지로 만듭니다.

1. INTRO - 가운데
2. PROJECTS - Octoplug, Doll·Eye Pinball
3. PROJECTS - Rolling Kimbaps, Namer
4. HOW I WORK - 현재 켜진 항목만 표시. 내용 파일의 `aiEnabled = true`로 AI 활용 항목을 다시 켤 수 있습니다.
5. EXPERIENCE + CORE TOOLS
6. PLAY STYLE + WHAT I'VE BUILT
7. ABOUT ME
8. CONTACT - 제목은 위, 사진과 연락처는 가운데

HOW I WORK의 대시보드는 웹에서 한 장씩 넘어갑니다. PDF에는 방 도식과 도넛 그래프가 보이는 정지 이미지 두 장을 함께 넣습니다.

게임 영상의 정지 장면은 [content/pdf.js](content/pdf.js)에서 초 단위로 지정합니다. `215`는 3분 35초입니다. Namer 영상은 원본의 14분 23초부터 15분 45초까지 재생하고, 정지 이미지는 기존 7분 59초 장면을 사용합니다. 유튜브 인터뷰는 준비한 2분 25초 장면 이미지(`interviewPoster`)를 사용합니다. 다른 시점을 원하면 말씀해 주세요.

내용을 고쳐 GitHub에 올리면 PDF를 다시 만드는 작업이 자동으로 실행됩니다. 갱신이 끝난 뒤 공개 이력서의 버튼을 눌러 새 창에서 확인하세요. PDF는 페이지 제목을 같은 위쪽 위치에 놓고, 프로젝트와 작업 사례의 카드 높이를 남은 공간에 맞춥니다. ABOUT ME의 세 답변은 글 길이를 고려해 각 행의 높이를 나눕니다. 내용이 한 페이지에 들어가지 않으면 글을 자르지 않고 PDF 만들기를 실패로 표시합니다. 이 경우 해당 글을 줄이거나 페이지 구성을 다시 조정해야 합니다. 이 프로젝트에서 직접 만들 때는 먼저 `npm install --prefix tmp/tools/playwright --no-save playwright-core@1.62.1`을 한 번 실행하고, 그다음 `node scripts/build-pdf.mjs`를 실행하면 됩니다.
