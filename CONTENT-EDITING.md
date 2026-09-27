# 이력서 문구 작성 안내

`content` 폴더의 파일 한 개가 웹 화면의 구역 한 개에 대응합니다.

| 파일 | 웹 화면 구역 |
| --- | --- |
| `content/intro.js` | INTRO |
| `content/projects.js` | SELECTED PROJECTS |
| `content/how-i-work.js` | HOW I WORK |
| `content/experience.js` | EXPERIENCE |
| `content/core-tools.js` | CORE TOOLS |
| `content/play-style.js` | PLAY STYLE + WHAT I'VE BUILT |
| `content/about-me.js` | ABOUT ME |
| `content/contact.js` | CONTACT |

각 줄에서 **`=` 오른쪽 문구만** 고치세요. 제목과 안내 문구도 모두 들어 있습니다. 예: `heading = 선택한 게임을 한눈에.`를 `heading = 내가 만든 게임`으로 바꾸면 해당 제목이 바뀝니다. 문구를 지우려면 `=` 오른쪽을 비워 두세요. `#`으로 시작하는 줄은 구분을 돕는 메모입니다.

## 줄바꿈과 글자 모양

같은 문구 안에서 줄을 바꾸려면 `|`를 넣으세요.

```text
heading = 선택한 게임을|한눈에.
```

색상·크기·글꼴도 **같은 구역 파일**에서 바꿀 수 있습니다. 바꾸려는 줄 바로 아래에 다음처럼 적으세요. 필요 없는 항목은 생략하면 현재 디자인이 유지됩니다.

```text
heading = 선택한 게임을|한눈에.
heading.color = #C7FF5E
heading.size = 42px
heading.font = Arial
heading.weight = 700
heading.align = center
```

`heading` 대신 바꾸려는 줄의 `=` 왼쪽 이름을 쓰면 됩니다. 색상은 `#`으로 시작하는 색상 코드, 크기는 `px` 단위를 권장합니다. 글꼴은 `Arial`, `Georgia`, `Courier New`처럼 컴퓨터와 브라우저에 있는 이름을 쓰세요. 없는 글꼴을 적으면 기본 글꼴로 보일 수 있습니다. 크기를 크게 바꾼 뒤에는 휴대전화 화면에서도 확인해 주세요.

HOW I WORK의 사례 제목은 `collaborationHeading`, `testingHeading`, `aiHeading` 한 줄씩 작성합니다. 예를 들어 `collaborationHeading = 같은 방향을 보도록|팀의 기준을 맞춥니다.`처럼 `|`를 넣으면 원하는 위치에서 줄이 바뀝니다. CONTACT 제목도 `heading = LET'S|CONNECT.`처럼 작성할 수 있습니다. 끝에 `.`을 쓰면 기존처럼 점에 강조색이 적용되고, 빼면 점도 사라집니다. INTRO 소개 문구는 `description` 한 줄에 작성합니다. 줄바꿈이 필요 없으면 `|`를 넣지 마세요.

CONTACT 오른쪽에는 `emailAddress`, `phoneNumber`, `githubUrl`에 적은 값이 그대로 표시됩니다. 예를 들어 `phoneNumber = 010-1234-5678`처럼 입력하세요. 이메일·GitHub·PDF 버튼도 아래에 남습니다. `emailAddress`와 `githubUrl`을 입력하면 해당 버튼에 주소가 연결되고, `pdfUrl`을 입력하면 PDF 버튼이 연결됩니다. 값이 비어 있으면 화면에는 입력 예정 안내가 표시됩니다.

파일 맨 위와 맨 아래의 JavaScript 문장, `=` 왼쪽 이름, 영상 파일 이름과 재생 시작 시간은 그대로 두세요. 저장한 다음 브라우저를 새로고침하면 바뀐 문구가 보입니다. 주소가 없는 링크의 `Url` 또는 `emailAddress`는 비워 두세요.

지금 들어 있는 프로젝트 소개와 Q&A 답변은 기존 화면의 임시 문구입니다. 새 내용을 제가 대신 작성하지 않았습니다. 초안을 작성해 보내주시면 문장을 첨삭해 보여드리고, 확인하신 문구를 해당 파일에 반영하겠습니다.
