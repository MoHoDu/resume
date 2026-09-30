// PDF RESUME 버튼의 설정입니다. = 오른쪽 숫자는 영상의 초 단위 시점입니다.
// 예: 2분 35초는 155. 원하는 장면을 알려주시면 해당 시점으로 바꿔드립니다.
// yes는 해당 영역 앞에서 새 PDF 페이지를 시작합니다. 화면에는 보이지 않습니다.
window.resumePrintRaw = `
octoplugFrame = 108
dolleyeFrame = 215
kimbapsFrame = 26
interviewPoster = assets/work-interview-155.png

pageBreakBeforeProjects = yes
pageBreakBeforeHowIWork = yes
pageBreakBeforeTesting = yes
pageBreakBeforeAI = yes
pageBreakBeforeExperience = yes
pageBreakBeforeCoreTools = no
pageBreakBeforePlayStyle = yes
pageBreakBeforeAbout = yes
pageBreakBeforeContact = no
`;
