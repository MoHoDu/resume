import {createServer} from 'node:http';
import {createReadStream, existsSync} from 'node:fs';
import {access, copyFile, mkdir, readFile, stat} from 'node:fs/promises';
import {spawn, spawnSync} from 'node:child_process';
import {resolve, dirname, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'output/pdf/mo-ho-seong-resume.pdf');
const temporary = resolve(root, `tmp/pdfs/resume-build-${process.pid}.pdf`);
const profile = resolve(root, `tmp/pdfs/chrome-build-${process.pid}`);
const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.mp4':'video/mp4', '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg', '.png':'image/png', '.gif':'image/gif', '.svg':'image/svg+xml'
};

const browserCandidates = [
  process.env.PDF_CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'google-chrome', 'chromium', 'chromium-browser'
].filter(Boolean);
const chrome = browserCandidates.find(candidate => existsSync(candidate) || spawnSync(candidate, ['--version'], {stdio:'ignore'}).status === 0);
if (!chrome) throw new Error('Chrome을 찾지 못했습니다. PDF_CHROME에 Chrome 실행 파일 경로를 지정하세요.');

await mkdir(dirname(output), {recursive:true});
await mkdir(dirname(temporary), {recursive:true});
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const info = await stat(file);
    if (!info.isFile()) { response.writeHead(404).end(); return; }
    const range = /^bytes=(\d+)-(\d*)$/.exec(request.headers.range || '');
    const start = range ? Number(range[1]) : 0;
    const end = range && range[2] ? Math.min(Number(range[2]), info.size - 1) : info.size - 1;
    if (start > end || start >= info.size) { response.writeHead(416).end(); return; }
    response.writeHead(range ? 206 : 200, {
      'Content-Type':mime[extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length':end - start + 1,
      'Accept-Ranges':'bytes',
      'Cache-Control':'no-store',
      ...(range ? {'Content-Range':`bytes ${start}-${end}/${info.size}`} : {})
    });
    createReadStream(file, {start,end}).pipe(response);
  } catch { response.writeHead(404).end(); }
});

await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const port = server.address().port;
try {
  const args = [
    '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    '--virtual-time-budget=30000', `--user-data-dir=${profile}`,
    `--print-to-pdf=${temporary}`, `http://127.0.0.1:${port}/?pdf-export=1`
  ];
  const exitCode = await new Promise((resolveExit, reject) => {
    const child = spawn(chrome, args, {stdio:'ignore'});
    child.on('error', reject);
    child.on('exit', code => resolveExit(code));
  });
  if (exitCode !== 0) throw new Error(`Chrome PDF 출력 실패: ${exitCode}`);
  await access(temporary);
  const info = await stat(temporary);
  if (info.size < 100_000) throw new Error('PDF 파일이 비어 있거나 너무 작습니다.');
  const pdfInfo = spawnSync('pdfinfo', [temporary], {encoding:'utf8'});
  if (pdfInfo.status === 0 && !/^Pages:\s+8\s*$/m.test(pdfInfo.stdout)) {
    throw new Error(`PDF가 8페이지가 아닙니다: ${/^Pages:.+$/m.exec(pdfInfo.stdout)?.[0] || '페이지 수 확인 실패'}`);
  }
  const header = (await readFile(temporary)).subarray(0, 5).toString();
  if (header !== '%PDF-') throw new Error('PDF 형식이 아닙니다.');
  await copyFile(temporary, output);
  process.stdout.write(`PDF 작성 완료: ${output} (${(info.size / 1048576).toFixed(1)} MB)\n`);
} finally {
  await new Promise(resolveClose => server.close(resolveClose));
}
