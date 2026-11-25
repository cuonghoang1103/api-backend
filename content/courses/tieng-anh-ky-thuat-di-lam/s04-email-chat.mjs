/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 4: Email và chat với khách hàng và trưởng nhóm (soạn 24/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-4-1 … tak-4-7).
 * Mọi email/tin nhắn mẫu và output là THẬT: kiem-email.mjs + mui-gio.mjs (tự viết cho chương này, in nguyên văn ở bài 4.6)
 * chạy 24/11/2026 trong node:22-alpine (Node 22.23.5), --network none. Dự án LabFlow, khách Tanaka Yui là hư cấu.
 * Nguồn: Army Regulation 25-50 (BLUF); nohello.net; Atlassian Statuspage (Investigating/Identified/Monitoring/Resolved);
 * Toyota Boshoku press release 6/9/2019; FBI IC3 Internet Crime Report 2023 (BEC); GitLab.com database incident postmortem
 * (10/2/2017); Atlassian Post-Incident Review, April 2022 outage; Motherboard/Vice (EA, 6/2021); Uber security update (16/9/2022).
 */
import { mau, saiDung, tuVung, Q } from './_chung.mjs';
/* p0 — SINH TỰ ĐỘNG từ lab/ch4 (mẫu email + output THẬT của kiem-email.mjs / mui-gio.mjs). Đừng sửa tay. */
const EM = {
"mau/41-tot.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: LAB-240: where is the department master data?\n\nHi Tanaka-san,\n\nCould you tell us where the department master data for LAB-240 is stored?\nWe need it to build the department dropdown in the loan form.\n\nSpec section 3.2 says \"Departments are loaded from master data\", but we\ncould not find a master data API or file in the shared folder.\n\nIf it is not ready yet, we will use the 12 departments from the current\nsystem (attached) and switch later. Is that OK for you?\n\nA reply by Thu 26 Nov, 12:00 JST would keep LAB-240 on schedule.\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n",
"mau/41-xau.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: Question\n\nDear Sir/Madam,\n\nI am An, I am a new member of the LabFlow team from FPT Software. Sorry for disturbing you. I am working on the task LAB-240 about the department dropdown in the loan form. I have read the spec but I am not sure about some point. Sorry if my question is stupid.\n\nThe spec says the department list come from master data. I don't know where is the master data. Please send me ASAP.\n\nThank you very much and best regards,\nAn\n",
"mau/42-tot.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: LabFlow spec v1.3: 3 questions on overdue loans (LAB-245)\n\nHi Tanaka-san,\n\nWe have three questions on spec v1.3, section 4 (overdue loans).\nCould you answer them by Fri 27 Nov, 17:00 JST? Our proposal is in brackets.\n\n1. \"A loan is overdue after the due date.\" Does \"after\" mean from the exact\n   due time, or from the next day? (Our proposal: from 00:00 JST the next day.)\n2. \"The home page shows recent loans.\" How many loans, and how recent?\n   (Our proposal: the 10 newest loans of the logged-in user.)\n3. Who can extend a loan: the student, the lab manager, or both?\n   (Our proposal: only the lab manager.)\n\nJust to confirm: email reminders are out of scope for this sprint,\nas agreed on 20 Nov. Please correct us if that has changed.\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n",
"mau/42-xau.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: Re: LabFlow spec v1.3\n\nHi Tanaka-san,\n\nAbout the overdue rule, what do you mean? Please explain more detail.\nAlso what is \"recent loans\"? And who can extend a loan?\n\nThanks\n",
"mau/43-tot.txt": "To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: LAB-252 CSV export: new date Mon 30 Nov (was Thu 26 Nov)\n\nHi Tanaka-san,\n\nUnfortunately, the CSV export (LAB-252) will be ready on Mon 30 Nov,\nnot on Thu 26 Nov as planned. I'm sorry for the late change.\nCould you check whether the new UAT date (1 Dec) works for you?\nDetails are below.\n\nReason: exports over 10,000 rows run out of memory on the test server,\nso we need to stream the file instead of building it in memory.\n\nImpact: the UAT for the report screens moves from 27 Nov to 1 Dec.\nOther features in sprint 6 are not affected.\n\nNew plan:\n- Thu 26 Nov: streaming export done, tested with 50,000 rows\n- Fri 27 Nov: code review and deploy to the test server\n- Mon 30 Nov: ready for UAT\n\nPlease reply by Wed 25 Nov, 17:00 JST. If 27 Nov cannot move, we can\ndeliver exports up to 10,000 rows on time and the rest on 30 Nov.\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n",
"mau/43-xau.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: URGENT!!!\n\nDear Tanaka-san,\n\nI am very sorry. I am so sorry to inform that the CSV export task is delay because the library is very difficult and the old code is very bad. We will try our best to finish it ASAP, maybe tomorrow or next week.\n\nSorry again for the inconvenience.\nAn\n",
"mau/44-baocao.txt": "To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: Incident report: LabFlow login failure on 24 Nov (32 minutes)\n\nHi Tanaka-san,\n\nPlease find the summary below. No action is needed; questions are welcome.\n\nSummary: on Tue 24 Nov, logins failed for 32 minutes (09:10-09:42 ICT,\n11:10-11:42 JST). About 40 students could not log in. No data was lost.\n\nTimeline (ICT):\n- 09:00 release 2.4.0 deployed to production\n- 09:10 first login errors; a lab manager reported it in Teams at 09:14\n- 09:20 incident opened, first email to you at 09:25\n- 09:38 rollback to 2.3.2 started\n- 09:42 logins working again\n\nRoot cause: 2.4.0 reads the session secret from a new setting,\nSESSION_SECRET. We added it on the test server but not on production,\nand the deployment checklist did not include it.\n\nWhat we will change:\n1. The server now refuses to start if a required setting is missing\n   (LAB-270, done 25 Nov).\n2. The deployment checklist lists every new setting (LAB-271, by 27 Nov).\n3. A smoke test logs in right after each deploy (LAB-272, by 2 Dec).\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n",
"mau/44-capnhat.txt": "To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: [Resolved] LabFlow login failing 09:10-09:42 ICT\n\nHi Tanaka-san,\n\nFYI, the login problem is fixed. No action is needed from you.\n\nLogins work again since 09:42 ICT (11:42 JST). We rolled back to\nrelease 2.3.2. No loan data was lost or changed.\n\nCause (first finding): release 2.4.0 expected a new setting for the login\nsession secret, and the setting was missing on the production server.\n\nWe will send a short incident report by Thu 26 Nov, 17:00 JST with the\nroot cause and how we will prevent it.\n\nBest regards,\nAn Nguyen (on behalf of the LabFlow team)\n",
"mau/44-dau.txt": "To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: [Incident] LabFlow login failing since 09:10 ICT - investigating\n\nHi Tanaka-san,\n\nFYI, no action is needed from you yet.\n\nWhat: since 09:10 ICT (11:10 JST), logins to LabFlow fail with\n\"500 Internal Server Error\". Users who are already logged in can still\nwork.\nImpact: about 40 students could not log in during the morning lab session.\nWhat we are doing: we deployed release 2.4.0 at 09:00 ICT and suspect it.\nWe are rolling it back now.\nNext update: by 10:00 ICT (12:00 JST), or earlier if it is fixed.\n\nBest regards,\nAn Nguyen (on behalf of the LabFlow team)\n",
"mau/44-xau.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: Problem\n\nDear Tanaka-san,\n\nWe are so sorry, the system have some problem. Users cannot login. Our team is checking. It will be fixed soon. Sorry for the inconvenience.\n\nAn\n",
"mau/45-tot-1.txt": "Hi Minh, quick question on LAB-252 (CSV export): should the file use the\nuser's time zone or UTC for the \"borrowed at\" column? I'm going with UTC\nfor now and will switch if you say so. Not urgent - today is fine.\n",
"mau/45-tot-2.txt": "Hi team, the deploy of 2.4.1 to the test server failed at 14:05 ICT\n(log: \"SESSION_SECRET is not set\"). Did anyone change the env settings\ntoday? I'm checking the pipeline history and will post what I find\nin this thread by 14:30 ICT.\n",
"mau/45-xau-1.txt": "Hi Minh\n",
"mau/45-xau-2.txt": "are you there?\n",
"mau/45-xau-3.txt": "anh ơi the api not work, help me\n",
"mau/45-xau-4.txt": "@channel DEPLOY FAILED!!! WHO CHANGED THE CONFIG???\n",
"lab46/1-hoi-lai.txt": "To: Tanaka Yui <tanaka@client.example>\nSubject: LAB-262 due-date reminder: 3 questions before we start\n\nHi Tanaka-san,\n\nBefore we start LAB-262, could you answer three questions about the\nreminder in spec v1.4, section 5.1? Our proposals are in brackets.\n\n1. How long before the due date should we send it?\n   (Our proposal: 24 hours before.)\n2. Email only, or also a notification inside LabFlow?\n   (Our proposal: email only in this sprint.)\n3. Should lab managers get a copy?\n   (Our proposal: no, only the student.)\n\nIf we hear from you by Mon 30 Nov, 12:00 JST, we can finish it in sprint 7.\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n",
"lab46/2-bao-tre.txt": "To: Minh Tran <minh.tran@fpt.example>\nSubject: LAB-260 search by student ID: need 1 more day (now Fri 27 Nov)\n\nHi Minh,\n\nLAB-260 needs one more day: I now expect to open the PR on Fri 27 Nov\ninstead of today. Could you review it on Friday afternoon?\n\nWhat happened: I estimated 2 days, but the student IDs in the old data\nhave three formats (SE123456, se123456, 123456), so search missed about\n15% of the records in my test.\n\nDone: search works for the clean format, with unit tests.\nLeft: normalise the old IDs (migration script) and test with the full\ncopy of the data.\n\nIf one more day is a problem for the sprint, I can open a PR today for\nthe clean format only and do the migration in a new ticket.\n\nThanks,\nAn\n",
"lab46/3-su-co.txt": "To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: [Incident] UAT server down since 13:20 ICT - next update 14:30 ICT\n\nHi Tanaka-san,\n\nFYI, your testers cannot open the UAT server at the moment. You do not\nneed to do anything, but please pause today's UAT session.\n\nWhat: since 13:20 ICT (15:20 JST) the UAT server returns\n\"502 Bad Gateway\". Production is not affected.\nWhat we are doing: the disk of the UAT server is full; we are cleaning\nold log files and adding more space.\nNext update: by 14:30 ICT (16:30 JST).\n\nBest regards,\nAn Nguyen (on behalf of the LabFlow team)\n",
"lab46/4-xin-nghi.txt": "To: Minh Tran <minh.tran@fpt.example>\nSubject: Leave request: Fri 4 Dec (university exam)\n\nHi Minh,\n\nCould I take a day off on Fri 4 Dec? I have a final exam at the\nuniversity that day.\n\nHandover:\n- LAB-265 (report filters) will be in review by Thu 3 Dec.\n- If the review needs changes, Huy has agreed to handle them.\n- I will check Teams once in the evening, around 20:00 ICT.\n\nI will be back on Mon 7 Dec.\n\nThanks,\nAn\n",
"lab46/5-cam-on.txt": "To: Sarah Miller <sarah.miller@client.example>\nSubject: Thank you for the test data for LAB-252\n\nHi Sarah,\n\nThank you for the anonymised loan data you sent on Tuesday. FYI, no\nreply is needed.\n\nWith the 50,000 real-looking rows, we found that the CSV export ran out\nof memory above 10,000 rows. We fixed it before UAT, so your testers\nwill not hit the problem.\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n",
"lab46/6-tu-choi.txt": "To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: Re: PDF export for the monthly report (change request?)\n\nHi Tanaka-san,\n\nThank you for the idea. PDF export is not part of the sprint 7 scope,\nso we would like to handle it as a change request. Could you tell us\nwhich option you prefer?\n\nOur first estimate is 3 days (layout, Japanese fonts, tests).\n\nOption A: add it to sprint 8 (starts 7 Dec) as a new item.\nOption B: add it to sprint 7 and move LAB-262 (due-date reminder)\nto sprint 8.\n\nUntil then, users can export to CSV and print from Excel.\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n"
};
const OUT = {"41": "41-xau.txt (email, 86 words): 5 warning(s)\n    2  SUBJ-VAGUE   subject \"Question\" says nothing specific; name the thing and the action\n    3  SORRY×2      apologise once, then move to the plan\n    4  PHRASE       \"Dear Sir\": only for strangers whose name you do not know\n    8  ASK-LATE     the request is in paragraph 2; move it to the first paragraph\n    8  PHRASE       \"ASAP\": \"ASAP\" is not a deadline; give a date and a reason\n41-tot.txt (email, 95 words): OK\nexit=1\n", "42": "42-xau.txt (email, 27 words): OK\n42-tot.txt (email, 125 words): OK\nexit=0\n", "43": "43-xau.txt (email, 53 words): 7 warning(s)\n    2  SUBJ-VAGUE   subject \"URGENT!!!\" says nothing specific; name the thing and the action\n    2  SUBJ-URGENT  \"urgent\" without a deadline; write what is needed by when\n    3  ASK-NONE     no question or request found; what should the reader do?\n    3  SORRY×3      apologise once, then move to the plan\n    6  PHRASE       \"ASAP\": \"ASAP\" is not a deadline; give a date and a reason\n    6  PHRASE       \"We will try our best\": a promise without content; say what you will do and by when\n    6  DATE-REL     \"tomorrow\" without a date; it is already tomorrow for someone\n43-tot.txt (email, 142 words): OK\nexit=1\n", "44": "44-xau.txt (email, 29 words): 3 warning(s)\n    2  SUBJ-VAGUE   subject \"Problem\" says nothing specific; name the thing and the action\n    3  ASK-NONE     no question or request found; what should the reader do?\n    3  SORRY×2      apologise once, then move to the plan\n44-dau.txt (email, 83 words): OK\nexit=1\n", "44b": "44-capnhat.txt (email, 86 words): OK\n44-baocao.txt (email, 145 words): OK\nexit=0\n", "45": "45-xau-1.txt (chat, 2 words): 1 warning(s)\n    1  CHAT-HELLO   a greeting alone makes the reader wait; put the question in the same message (nohello.net)\n45-xau-2.txt (chat, 3 words): 1 warning(s)\n    1  CHAT-THERE   asks for attention without the topic; say what it is about and how long it takes\n45-xau-3.txt (chat, 8 words): 1 warning(s)\n    1  VIETNAMESE   Vietnamese text in a message for an English reader\n45-xau-4.txt (chat, 7 words): 1 warning(s)\n    1  CAPS         DEPLOY FAILED CHANGED CONFIG: capitals read as shouting\n45-tot-1.txt (chat, 41 words): OK\n45-tot-2.txt (chat, 41 words): OK\nexit=1\n", "lab46": "1-hoi-lai.txt (email, 88 words): OK\n2-bao-tre.txt (email, 112 words): OK\n3-su-co.txt (email, 78 words): OK\n4-xin-nghi.txt (email, 62 words): OK\n5-cam-on.txt (email, 56 words): OK\n6-tu-choi.txt (email, 90 words): OK\nexit=0\n", "tz1": "Hanoi (ICT)      Thu 26 Nov, 15:00 GMT+7\nTokyo (JST)      Thu 26 Nov, 17:00 GMT+9\nBengaluru (IST)  Thu 26 Nov, 13:30 GMT+5:30\nBerlin           Thu 26 Nov, 09:00 GMT+1\nLondon           Thu 26 Nov, 08:00 GMT+0\nNew York         Thu 26 Nov, 03:00 GMT-5\nSan Francisco    Thu 26 Nov, 00:00 GMT-8\n", "tz2": "Hanoi (ICT)      Tue 30 Mar, 14:00 GMT+7\nTokyo (JST)      Tue 30 Mar, 16:00 GMT+9\nBengaluru (IST)  Tue 30 Mar, 12:30 GMT+5:30\nBerlin           Tue 30 Mar, 09:00 GMT+2\nLondon           Tue 30 Mar, 08:00 GMT+1\nNew York         Tue 30 Mar, 03:00 GMT-4\nSan Francisco    Tue 30 Mar, 00:00 GMT-7\n"};
const TOOL = "#!/usr/bin/env node\n// kiem-email.mjs — a tiny \"linter\" for work emails and chat messages (Technical English at Work, chapter 4).\n// Usage: node kiem-email.mjs <file>...   (a file that starts with \"Subject:\" is an email, otherwise a chat message)\n// It only checks habits that are easy to detect by pattern. Passing it does NOT mean the email is good.\nimport { readFileSync } from 'node:fs';\nimport { basename } from 'node:path';\n\nconst TZ = /\\b(ICT|JST|KST|SGT|IST|UTC|GMT|CET|CEST|BST|EST|EDT|CST|CDT|PST|PDT|AEST|AEDT)\\b|\\b(UTC|GMT)\\s?[+-]\\s?\\d{1,2}\\b|\\b(Hanoi|Tokyo|Vietnam|Japan) time\\b/i;\nconst TIME = /\\b(\\d{1,2}(:\\d{2})?\\s?(am|pm)|\\d{1,2}:\\d{2}|\\d{1,2}h\\d{0,2})\\b/i;\nconst VAGUE_SUBJECT = new Set(['hi', 'hello', 'question', 'questions', 'help', 'urgent', 'issue', 'problem', 'update', 'request', 'fyi', 'info', 'information', 're', 'fw', 'fwd', 'important', 'please', 'check', 'about', 'the', 'a', 'my', 'project', 'task', 'email']);\nconst PHRASES = [\n  [/\\bdo the needful\\b/i, '\"do the needful\" is regional English; say exactly what you need'],\n  [/\\brevert(ed|ing)? (back )?(to )?(me|us)\\b/i, '\"revert to me\" means \"reply\" only in some regions; write \"reply\" or \"get back to me\"'],\n  [/\\bplease find (the )?attached( herewith)?\\b|\\bPFA\\b/, 'fine but stiff; \"I\\'ve attached …\" or \"Attached is …\" is clearer'],\n  [/\\bas per my (last|previous) email\\b/i, 'sounds annoyed to most readers; link or quote the earlier email instead'],\n  [/\\bASAP\\b|\\bas soon as possible\\b/i, '\"ASAP\" is not a deadline; give a date and a reason'],\n  [/\\bEOD\\b|\\bend of (the )?day\\b/i, '\"EOD\" — whose day? add a time and a time zone'],\n  [/\\bDear (Sir|Madam|Sir\\/Madam|Sir or Madam)\\b/i, 'only for strangers whose name you do not know'],\n  [/\\b(I|we) (will )?try (my|our) best\\b/i, 'a promise without content; say what you will do and by when'],\n];\n\nfunction check(file) {\n  const raw = readFileSync(file, 'utf8').replace(/\\r/g, '');\n  const lines = raw.split('\\n');\n  const out = [];\n  const warn = (line, code, msg) => out.push(`  ${String(line).padStart(3)}  ${code}  ${msg}`);\n  const isEmail = /^Subject:/i.test(lines[0]) || /^To:/i.test(lines[0]);\n  let bodyStart = 0;\n  const headers = {};\n  if (isEmail) {\n    while (bodyStart < lines.length && lines[bodyStart].trim() !== '') {\n      const m = lines[bodyStart].match(/^([A-Za-z-]+):\\s*(.*)$/);\n      if (m) headers[m[1].toLowerCase()] = { v: m[2], n: bodyStart + 1 };\n      bodyStart++;\n    }\n    const s = headers.subject;\n    if (!s || !s.v.trim()) warn(s ? s.n : 1, 'SUBJ-EMPTY ', 'no subject: the reader cannot tell what this is about');\n    else {\n      const words = s.v.toLowerCase().replace(/^(re|fw|fwd):\\s*/g, '').match(/[a-z0-9#-]+/g) || [];\n      const real = words.filter((w) => !VAGUE_SUBJECT.has(w));\n      if (real.length < 2) warn(s.n, 'SUBJ-VAGUE ', `subject \"${s.v}\" says nothing specific; name the thing and the action`);\n      if (s.v.length > 70) warn(s.n, 'SUBJ-LONG  ', `subject is ${s.v.length} characters; mobile clients cut it at about 40–70`);\n      if (/\\burgent\\b/i.test(s.v) && !/\\b(by|before|until)\\b/i.test(s.v)) warn(s.n, 'SUBJ-URGENT', '\"urgent\" without a deadline; write what is needed by when');\n    }\n  }\n  const body = lines.slice(bodyStart);\n  const at = (i) => bodyStart + i + 1;\n  const text = body.join('\\n');\n  const greetOnly = /^\\s*(hi|hello|hey|chào anh|chào chị|good (morning|afternoon))\\b[^\\n]{0,25}[.!?]?\\s*$/i;\n  if (!isEmail) {\n    const content = body.filter((l) => l.trim());\n    if (content.length === 1 && greetOnly.test(content[0])) warn(at(body.indexOf(content[0])), 'CHAT-HELLO ', 'a greeting alone makes the reader wait; put the question in the same message (nohello.net)');\n    if (/\\b(are you there|r u there|u there|are you free|do you have a (minute|sec))\\??\\s*$/im.test(text)) warn(at(body.findIndex((l) => /there|free|minute|sec/i.test(l))), 'CHAT-THERE ', 'asks for attention without the topic; say what it is about and how long it takes');\n  }\n  // Where is the ask? Look for a request in the first paragraph after the greeting.\n  const paras = text.split(/\\n\\s*\\n/).map((p) => p.trim()).filter(Boolean);\n  const content = paras.filter((p) => !greetOnly.test(p) && !/^(hi|hello|dear|hey)\\b[^\\n]*,\\s*$/i.test(p));\n  const ASK = /\\?|\\b(please|could you|can you|would you|let me know|I need|we need|I'd like you to|could we|can we|FYI|no action)\\b/i;\n  if (isEmail && content.length && !ASK.test(content[0]) && content.some((p) => ASK.test(p))) {\n    const i = content.findIndex((p) => ASK.test(p));\n    warn(at(body.findIndex((l) => l.includes(content[i].split('\\n')[0]))), 'ASK-LATE   ', `the request is in paragraph ${i + 1}; move it to the first paragraph`);\n  }\n  if (isEmail && content.length && !content.some((p) => ASK.test(p))) warn(at(0), 'ASK-NONE   ', 'no question or request found; what should the reader do?');\n  let tzBlock = false; // a heading such as \"Timeline (ICT):\" gives a time zone to the lines below it\n  body.forEach((l, i) => {\n    if (!l.trim()) tzBlock = false;\n    else if (/:\\s*$/.test(l) && TZ.test(l)) tzBlock = true;\n    for (const [re, msg] of PHRASES) if (re.test(l)) warn(at(i), 'PHRASE     ', `\"${l.match(re)[0]}\": ${msg}`);\n    if (TIME.test(l) && !TZ.test(l) && !tzBlock) warn(at(i), 'TIME-NO-TZ ', `\"${l.match(TIME)[0]}\" has no time zone; the reader may be 2–14 hours away`);\n    if (/\\b(tomorrow|tonight|next (week|monday|tuesday|wednesday|thursday|friday))\\b/i.test(l) && !/\\b\\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|\\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \\d{1,2}\\b|\\d{4}-\\d{2}-\\d{2}/.test(l))\n      warn(at(i), 'DATE-REL   ', `\"${l.match(/\\b(tomorrow|tonight|next \\w+)\\b/i)[0]}\" without a date; it is already tomorrow for someone`);\n    if (/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(l)) warn(at(i), 'VIETNAMESE ', 'Vietnamese text in a message for an English reader');\n    const caps = (l.match(/\\b[A-Z]{4,}\\b/g) || []).filter((w) => !/^(HTTP|HTTPS|JSON|ASAP|TODO|NOTE|UTC|GMT|CEST|AEST|AEDT|LGTM|PTAL|CORS|REST|YAML|HTML|JIRA|EOD)$/.test(w));\n    if (caps.length >= 2) warn(at(i), 'CAPS       ', `${caps.join(' ')}: capitals read as shouting`);\n  });\n  const sorry = (text.match(/\\b(sorry|apologi[sz]e|apologies)\\b/gi) || []).length;\n  if (sorry >= 2) warn(at(0), 'SORRY×' + sorry + '    ', 'apologise once, then move to the plan');\n  const words = (text.match(/[A-Za-z']+/g) || []).length;\n  if (words > (isEmail ? 220 : 90)) warn(at(0), 'LONG       ', `${words} words; use bullets or split into two ${isEmail ? 'emails' : 'messages'}`);\n  console.log(`${basename(file)} (${isEmail ? 'email' : 'chat'}, ${words} words): ${out.length ? out.length + ' warning(s)' : 'OK'}`);\n  out.sort((a, b) => parseInt(a) - parseInt(b)).forEach((o) => console.log(o));\n  return out.length;\n}\n\nconst files = process.argv.slice(2);\nif (!files.length) { console.error('usage: node kiem-email.mjs <file>...'); process.exit(2); }\nlet total = 0;\nfor (const f of files) total += check(f);\nprocess.exitCode = total ? 1 : 0;\n";
const TZTOOL = "#!/usr/bin/env node\n// mui-gio.mjs — show one meeting/deadline time in the time zones of a typical outsourcing project.\n// Usage: node mui-gio.mjs 2026-11-26T15:00 [Asia/Ho_Chi_Minh]\nconst [, , when, from = 'Asia/Ho_Chi_Minh'] = process.argv;\nif (!when) { console.error('usage: node mui-gio.mjs YYYY-MM-DDTHH:MM [IANA zone of that time]'); process.exit(2); }\nconst zones = [['Hanoi (ICT)', 'Asia/Ho_Chi_Minh'], ['Tokyo (JST)', 'Asia/Tokyo'], ['Bengaluru (IST)', 'Asia/Kolkata'],\n  ['Berlin', 'Europe/Berlin'], ['London', 'Europe/London'], ['New York', 'America/New_York'], ['San Francisco', 'America/Los_Angeles']];\n// Find the UTC instant whose wall-clock time in `from` equals `when` (two passes handle DST).\nconst offset = (d, tz) => {\n  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(d).map((x) => [x.type, x.value]));\n  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - d.getTime();\n};\nconst naive = Date.parse(when + ':00Z');\nlet t = naive - offset(new Date(naive), from);\nt = naive - offset(new Date(t), from);\nconst fmt = (tz) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZoneName: 'shortOffset' }).format(new Date(t));\nfor (const [name, tz] of zones) console.log(name.padEnd(16), fmt(tz));\n";

const lienKet = (href, ico, tieuDe, phu) => `
<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>
</a>`;
const E = (f, nhan) => mau(EM[f], nhan);
const RUN = (key, files, nhan) => mau(`$ node kiem-email.mjs ${files}\n` + OUT[key].replace(/exit=(\d+)\n?$/, '$ echo $?\n$1'), nhan);
const NOTE_TZ = (en) => en ? 'Real output — mui-gio.mjs (lab files of lesson 4.6) inside node:22-alpine, Node 22.23.5, 24 Nov 2026.' : 'Output THẬT — mui-gio.mjs (tệp lab bài 4.6) chạy trong node:22-alpine, Node 22.23.5, 24/11/2026.';
const NOTE_RUN = (en) => en ? 'Real output — kiem-email.mjs (lesson 4.6) inside node:22-alpine, Node 22.23.5, 24 Nov 2026.' : 'Output THẬT — kiem-email.mjs (bài 4.6) chạy trong node:22-alpine, Node 22.23.5, 24/11/2026.';

/* ═════════════ 4.1 — Cấu trúc email ═════════════ */
const L41 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 4 · Writing' : 'Chương 4 · Viết'}</span>
<h2>${en ? '4.1 — The structure of a work email: subject, opening, point, ask, closing' : '4.1 — Cấu trúc email công việc: tiêu đề, mở đầu, ý chính, đề nghị, kết'}</h2>
<p class="lead">${en
    ? 'A client reads your email on a phone, between two meetings, in their second or third language. They decide from the subject whether to open it, and from the first two lines whether to act now. So a work email has one job: let a busy reader know <strong>what you need, by when</strong>, in ten seconds. Everything else is support.'
    : 'Khách đọc email của bạn trên điện thoại, giữa hai cuộc họp, bằng ngôn ngữ thứ hai hoặc thứ ba của họ. Nhìn tiêu đề họ quyết định có mở không; đọc hai dòng đầu họ quyết định có làm ngay không. Nên email công việc chỉ có một nhiệm vụ: cho người bận rộn biết <strong>bạn cần gì, trước khi nào</strong> trong mười giây. Phần còn lại chỉ để đỡ cho ý đó.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Think of a parcel. The subject is the label on the box (who, what). The first paragraph is the note on top when you open it ("Please sign and return the blue form"). The rest is the bubble wrap and the manual. Nobody wants to dig through bubble wrap to find out what the parcel is for.'
    : 'Hãy nghĩ tới một bưu kiện. Tiêu đề là nhãn ngoài hộp (gửi ai, cái gì). Đoạn đầu là tờ ghi chú nằm trên cùng khi mở hộp ("Ký và gửi lại tờ đơn màu xanh"). Phần còn lại là xốp chống sốc và sách hướng dẫn. Không ai muốn bới hết lớp xốp mới biết bưu kiện gửi để làm gì.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Week one of OJT on the LabFlow project (the fictional equipment-loan system from Chapters 2–3). Your ticket LAB-240 needs the list of departments, and the spec says it comes from "master data" that you cannot find. The client’s project manager is <strong>Tanaka Yui</strong> in Tokyo (family name Tanaka). Your first draft:'
    : 'Tuần đầu OJT ở dự án LabFlow (hệ thống mượn thiết bị hư cấu của Chương 2–3). Ticket LAB-240 cần danh sách khoa, spec ghi lấy từ "master data" mà bạn tìm không thấy. Quản lý dự án phía khách là <strong>Tanaka Yui</strong> ở Tokyo (họ là Tanaka). Bản nháp đầu tiên của bạn:'}</p>
${E('mau/41-xau.txt', en ? 'Draft 1 — what many students send.' : 'Bản nháp 1 — kiểu sinh viên hay gửi.')}
<p>${en
    ? 'Count the problems: the subject "Question" could be any of 200 emails; "Dear Sir/Madam" to a person whose name you know; two apologies before the point; the actual request is in the last paragraph; "ASAP" is not a date; and grammar slips (<em>some point</em> → <em>some points</em>, <em>the list come</em> → <em>comes</em>, <em>where is the master data</em> → <em>where the master data is</em>). Now the rewrite:'
    : 'Đếm lỗi: tiêu đề "Question" có thể là bất kỳ email nào trong 200 email; "Dear Sir/Madam" với người đã biết tên; xin lỗi hai lần trước khi vào việc; đề nghị thật nằm ở đoạn cuối; "ASAP" không phải là một ngày; và lỗi ngữ pháp (<em>some point</em> → <em>some points</em>, <em>the list come</em> → <em>comes</em>, <em>where is the master data</em> → <em>where the master data is</em>). Giờ là bản viết lại:'}</p>
${E('mau/41-tot.txt', en ? 'Draft 2 — the same need, structured.' : 'Bản nháp 2 — cùng nhu cầu, có cấu trúc.')}

<h3>${en ? 'The five parts' : 'Năm phần'}</h3>
<table>
<thead><tr><th>${en ? 'Part' : 'Phần'}</th><th>${en ? 'Job' : 'Nhiệm vụ'}</th><th>${en ? 'Useful English' : 'Tiếng Anh dùng được ngay'}</th></tr></thead>
<tbody>
<tr><td><strong>Subject</strong></td><td>${en ? 'Ticket/feature + what you need. Readable on a phone (≤ ~60 characters).' : 'Ticket/tính năng + bạn cần gì. Đọc được trên điện thoại (≤ ~60 ký tự).'}</td><td><em>LAB-240: where is the department master data?</em> · <em>[Action required] Approve the UAT plan by 27 Nov</em> · <em>[FYI] Test server restart on Sat 28 Nov</em></td></tr>
<tr><td><strong>${en ? 'Greeting' : 'Lời chào'}</strong></td><td>${en ? 'Name + the level of formality your client uses.' : 'Tên + mức trang trọng mà chính khách đang dùng.'}</td><td><em>Hi Tanaka-san,</em> · <em>Hi Sarah,</em> · <em>Dear Mr Schmidt,</em> ${en ? '(first email, formal client)' : '(email đầu, khách trang trọng)'} · <em>Hi all,</em> / <em>Hi team,</em></td></tr>
<tr><td><strong>${en ? 'Point / ask' : 'Ý chính / đề nghị'}</strong></td><td>${en ? 'The first sentence after the greeting. Question or request + deadline.' : 'Câu đầu tiên sau lời chào. Câu hỏi hoặc đề nghị + hạn.'}</td><td><em>Could you tell us …?</em> · <em>Could you review … by …?</em> · <em>FYI, no action is needed.</em> · <em>I’m writing to confirm …</em></td></tr>
<tr><td><strong>${en ? 'Support' : 'Phần đỡ'}</strong></td><td>${en ? 'Context, evidence, options — short paragraphs or bullets.' : 'Bối cảnh, bằng chứng, phương án — đoạn ngắn hoặc gạch đầu dòng.'}</td><td><em>Spec section 3.2 says … but …</em> · <em>If it is not ready yet, we will …</em> · <em>I’ve attached …</em></td></tr>
<tr><td><strong>${en ? 'Closing' : 'Kết'}</strong></td><td>${en ? 'Repeat the deadline if it matters; sign with name + team.' : 'Nhắc lại hạn nếu quan trọng; ký tên + nhóm.'}</td><td><em>A reply by Thu 26 Nov, 12:00 JST would keep LAB-240 on schedule.</em> · <em>Best regards,</em> · <em>Thanks,</em></td></tr>
</tbody>
</table>
<p>${en
    ? 'The US Army calls this <strong>BLUF — Bottom Line Up Front</strong> (Army Regulation 25-50, <em>Preparing and Managing Correspondence</em>: put the main point at the beginning). It is the same rule you used for ticket titles in 2.1 and commit subjects in 3.1.'
    : 'Quân đội Mỹ gọi kiểu này là <strong>BLUF — Bottom Line Up Front</strong> (Army Regulation 25-50, <em>Preparing and Managing Correspondence</em>: ý chính đặt ở đầu). Đây chính là luật bạn đã dùng cho tiêu đề ticket ở bài 2.1 và tiêu đề commit ở bài 3.1.'}</p>

<h3>${en ? 'One email, one purpose' : 'Một email, một mục đích'}</h3>
<p>${en
    ? 'If you need a decision on the department list AND want to report a delay on another ticket, send two emails with two subjects. The client can forward one to the person who knows the master data and reply to the other. Mixed emails get half-answered: the reader replies to the first question and the second is lost.'
    : 'Nếu bạn cần khách quyết danh sách khoa VÀ muốn báo trễ một ticket khác, hãy gửi hai email với hai tiêu đề. Khách chuyển được một email cho người nắm master data và trả lời email kia. Email gộp hay bị trả lời một nửa: người đọc trả lời câu đầu, câu thứ hai bị lãng quên.'}</p>

<h3>${en ? 'Formality: match the client, not a textbook' : 'Mức trang trọng: theo khách, không theo sách'}</h3>
<table>
<thead><tr><th></th><th>${en ? 'Formal (first contact, legal, complaint)' : 'Trang trọng (lần đầu, pháp lý, khiếu nại)'}</th><th>${en ? 'Neutral (most client emails)' : 'Trung tính (đa số email cho khách)'}</th><th>${en ? 'Informal (your team)' : 'Thân mật (trong nhóm)'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Greeting' : 'Chào'}</td><td>Dear Ms Tanaka, / Dear Tanaka-san,</td><td>Hi Tanaka-san, / Hello Sarah,</td><td>Hi Minh, / Hey team,</td></tr>
<tr><td>${en ? 'Ask' : 'Đề nghị'}</td><td>Would you be able to …?</td><td>Could you …?</td><td>Can you …?</td></tr>
<tr><td>${en ? 'Closing' : 'Kết'}</td><td>Kind regards, / Yours sincerely,</td><td>Best regards, / Best,</td><td>Thanks, / Cheers,</td></tr>
</tbody>
</table>
<p>${en
    ? 'Rule of thumb: answer one level as formal as the email you received, never two levels less. Japanese clients often write formally and use "-san" with the family name; it is safe to reply "Tanaka-san" once they sign that way. Do not write "Mr Yui": in "Tanaka Yui" the family name is Tanaka. When unsure, copy the name exactly as it appears in their signature.'
    : 'Luật dễ nhớ: trả lời trang trọng ngang email bạn nhận, không bao giờ thấp hơn hai bậc. Khách Nhật hay viết trang trọng và dùng "-san" sau họ; khi họ ký như vậy thì trả lời "Tanaka-san" là an toàn. Đừng viết "Mr Yui": trong "Tanaka Yui" họ là Tanaka. Khi không chắc, chép đúng tên như trong chữ ký của họ.'}</p>

<h3>${en ? 'To, Cc, Bcc, Reply all' : 'To, Cc, Bcc, Reply all'}</h3>
<ul>
<li><strong>To</strong>: ${en ? 'the people who must act or answer.' : 'người phải làm hoặc trả lời.'}</li>
<li><strong>Cc</strong>: ${en ? 'people who should know (your lead on every client email in OJT — ask your team what the rule is).' : 'người nên biết (trưởng nhóm trong mọi email gửi khách khi OJT — hỏi nhóm quy ước cụ thể).'}</li>
<li><strong>Bcc</strong>: ${en ? 'rarely at work. Hidden copies of client emails look like gossip when discovered.' : 'hiếm khi dùng ở chỗ làm. Bản sao ẩn email của khách mà bị phát hiện thì trông như nói sau lưng.'}</li>
<li><strong>Reply all</strong>: ${en ? 'when everyone on the thread needs your answer; otherwise reply to one person. Never remove the client from a thread to complain about them — threads get forwarded.' : 'khi mọi người trong chuỗi cần câu trả lời của bạn; còn lại thì trả lời một người. Đừng bao giờ bỏ khách ra khỏi chuỗi để than phiền về họ — chuỗi email hay bị chuyển tiếp.'}</li>
</ul>

<h3>${en ? 'See it run: a checker for email habits' : 'Xem chạy thật: công cụ soát thói quen viết email'}</h3>
<p>${en
    ? 'Lesson 4.6 gives you <code>kiem-email.mjs</code>, a 100-line Node script (no packages) that catches patterns such as a vague subject, the ask buried at the end, "ASAP", times without a time zone and repeated apologies. Here it is on the two drafts:'
    : 'Bài 4.6 cho bạn <code>kiem-email.mjs</code>, một script Node khoảng 100 dòng (không cần gói) bắt các mẫu như tiêu đề mơ hồ, đề nghị bị chôn ở cuối, "ASAP", giờ không có múi giờ, xin lỗi lặp lại. Chạy trên hai bản nháp:'}</p>
${RUN('41', 'mau/41-xau.txt mau/41-tot.txt', NOTE_RUN(en))}
<p>${en
    ? 'A pattern checker cannot judge grammar or tone — it did not see "the list come". Use it as a seatbelt, then reread as the client.'
    : 'Công cụ bắt mẫu không chấm được ngữ pháp hay giọng văn — nó không thấy "the list come". Dùng nó như dây an toàn, rồi đọc lại bằng mắt của khách.'}</p>

<h3>🕵️ ${en ? 'Hacker corner — when "urgent" email is the attack (BEC)' : 'Góc hacker — khi email "khẩn" chính là đòn tấn công (BEC)'}</h3>
<div class="callout warn"><p>${en
    ? 'Business Email Compromise (BEC) attacks use exactly the language of this chapter: a known name, a short urgent request, a deadline. In August 2019 a European subsidiary of Toyota Boshoku was tricked into transferring about ¥4 billion (≈ US$37 million) after attackers sent payment instructions that looked like they came from a business partner (Toyota Boshoku press release, 6 Sep 2019). The FBI’s IC3 <em>Internet Crime Report 2023</em> lists 21,489 BEC complaints with about US$2.9 billion in losses in one year. Signs to check in any email that asks for money, credentials or a change of bank details: the sender domain (<code>client-example.com</code> vs <code>client.example</code>), a Reply-To that differs from From, pressure plus secrecy ("urgent, do not tell anyone"). Verify through a second channel you already know — a phone number from the contract, not from the email.'
    : 'Tấn công Business Email Compromise (BEC — chiếm/giả email doanh nghiệp) dùng đúng thứ ngôn ngữ của chương này: tên quen, đề nghị ngắn và khẩn, có hạn chót. Tháng 8/2019 một công ty con ở châu Âu của Toyota Boshoku bị lừa chuyển khoảng 4 tỷ yên (≈ 37 triệu USD) sau khi kẻ gian gửi chỉ dẫn thanh toán trông như từ đối tác (thông cáo báo chí Toyota Boshoku, 6/9/2019). Báo cáo <em>Internet Crime Report 2023</em> của IC3 (FBI) ghi 21.489 đơn tố giác BEC, thiệt hại khoảng 2,9 tỷ USD trong một năm. Dấu hiệu phải kiểm trong mọi email đòi tiền, mật khẩu hay đổi tài khoản ngân hàng: tên miền người gửi (<code>client-example.com</code> khác <code>client.example</code>), Reply-To khác From, vừa ép gấp vừa đòi giữ bí mật ("urgent, do not tell anyone"). Xác minh qua kênh thứ hai bạn đã biết sẵn — số điện thoại trong hợp đồng, không phải số ghi trong email.'}</p></div>
${lienKet('/courses/email-infrastructure/learn?lessonSlug=mail-10-2-bec', '📧', en ? 'Email infrastructure 10.2 — Business email compromise' : 'Hạ tầng email 10.2 — Business email compromise', en ? 'Case studies, SPF/DKIM/DMARC and payment-change procedures.' : 'Vụ thật, SPF/DKIM/DMARC và quy trình đổi thông tin thanh toán.')}

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    ['Subject: Question', 'Subject: LAB-240: where is the department master data?', en ? 'The subject must survive in a list of 200 emails.' : 'Tiêu đề phải nổi bật giữa 200 email.'],
    ['Dear Sir/Madam, (to Tanaka-san)', 'Hi Tanaka-san,', en ? 'You know the name — use it.' : 'Đã biết tên — dùng tên.'],
    ['Sorry for disturbing you.', en ? '(delete it)' : '(xoá)', en ? 'Asking work questions is your job, not a disturbance.' : 'Hỏi việc là nhiệm vụ, không phải làm phiền.'],
    ['I am not sure about some point.', 'I have a question about section 3.2.', en ? 'Plural "points"; better: name the exact place.' : 'Số nhiều "points"; tốt hơn: chỉ đúng chỗ.'],
    ['I don’t know where is the master data.', 'We could not find where the master data is stored.', en ? 'Embedded questions use statement word order.' : 'Câu hỏi lồng dùng trật tự câu khẳng định.'],
    ['Please send me ASAP.', 'Could you send it by Thu 26 Nov, 12:00 JST?', en ? '"Send me" needs an object; ASAP is not a deadline.' : '"Send me" thiếu tân ngữ; ASAP không phải hạn.'],
    ['Thank you very much and best regards', 'Best regards,', en ? 'One closing is enough.' : 'Một lời kết là đủ.'],
  ], en)}

${tuVung(en ? [
    ['subject line', 'the title of the email', 'Put the ticket number in the subject line.'],
    ['to cc someone', 'to send a copy so they know', 'I cc’d Minh so he knows about the change.'],
    ['FYI (for your information)', 'no action needed', 'FYI, the test server restarts on Saturday.'],
    ['[Action required]', 'subject prefix: the reader must do something', '[Action required] Approve the UAT plan by 27 Nov'],
    ['to follow up', 'to write again about the same topic', 'I’m following up on my email from Monday.'],
    ['attached / attachment', 'file sent with the email', 'I’ve attached the current department list.'],
    ['to keep … on schedule', 'to avoid a delay', 'A reply by Thursday would keep LAB-240 on schedule.'],
  ] : [
    ['subject line', 'tiêu đề email', 'Put the ticket number in the subject line.'],
    ['to cc someone', 'gửi bản sao cho ai đó biết', 'I cc’d Minh so he knows about the change.'],
    ['FYI (for your information)', 'để biết, không cần làm gì', 'FYI, the test server restarts on Saturday.'],
    ['[Action required]', 'tiền tố tiêu đề: người đọc phải làm gì đó', '[Action required] Approve the UAT plan by 27 Nov'],
    ['to follow up', 'viết tiếp về cùng chủ đề', 'I’m following up on my email from Monday.'],
    ['attached / attachment', 'tệp gửi kèm', 'I’ve attached the current department list.'],
    ['to keep … on schedule', 'giữ đúng tiến độ', 'A reply by Thursday would keep LAB-240 on schedule.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — fix three emails (15 minutes)' : 'Thực hành — sửa ba email (15 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'Rewrite each one with a specific subject, the ask in the first sentence and a real deadline. Invent missing details.' : 'Viết lại mỗi email với tiêu đề cụ thể, đề nghị nằm ở câu đầu và hạn thật. Tự bịa chi tiết còn thiếu.'}</p>
<ol>
<li><em>Subject: Help — Dear Sir, I am Huy. Sorry to disturb. I can not access to the test server, my account maybe wrong. Please check for me.</em> ${en ? '(to the client’s IT admin, Mark)' : '(gửi admin IT phía khách, Mark)'}</li>
<li><em>Subject: Meeting — Hi Sarah, about the meeting, can we change it? Thanks.</em> ${en ? '(you want to move tomorrow’s demo)' : '(bạn muốn dời buổi demo ngày mai)'}</li>
<li><em>Subject: Report — Hi Tanaka-san, I send you the weekly report. Please check it.</em> ${en ? '(she does not need to reply unless she sees a problem)' : '(chị ấy không cần trả lời trừ khi thấy vấn đề)'}</li>
</ol>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1) Subject: Cannot log in to the test server (account huy.le)

Hi Mark,

Could you check my test server account, huy.le? Since this morning I get
"Invalid credentials" at https://test.labflow.example, while other team
members can log in. I reset my password at 09:15 ICT and it did not help.

I need access to test LAB-258 today. Thank you!

Best regards,
Huy Le
LabFlow team, FPT Software

2) Subject: Move the LAB-252 demo from Wed 25 Nov to Thu 26 Nov?

Hi Sarah,

Could we move the CSV export demo from Wed 25 Nov to Thu 26 Nov, same time
(10:00 CET)? We found a memory problem with large exports and want to show
you the fixed version. If Thursday does not work, Friday morning is also fine.

Best regards,
An

3) Subject: [FYI] LabFlow weekly report, week 48

Hi Tanaka-san,

FYI, the weekly report for week 48 is attached. No action is needed unless
something looks wrong.

Highlights: 9 of 11 tickets done; LAB-252 moved to 30 Nov (see my email of
24 Nov).

Best regards,
An Nguyen
`)}
</details>
</div>
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-7-4-khach-hang', '🤝', en ? 'Agile &amp; Teamwork 7.4 — Talking to clients and stakeholders' : 'Agile &amp; Làm việc nhóm 7.4 — Làm việc với khách và các bên liên quan', en ? 'The same situations from the process side, in Vietnamese.' : 'Cùng tình huống nhìn từ phía quy trình, bằng tiếng Việt.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>${en ? 'BLUF · subject line · FYI / [Action required] · To / Cc / Bcc · reply all · formality level · BEC' : 'BLUF · subject line · FYI / [Action required] · To / Cc / Bcc · reply all · mức trang trọng · BEC'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Subject = ticket/feature + what you need; readable on a phone.' : 'Tiêu đề = ticket/tính năng + cần gì; đọc được trên điện thoại.'}</li>
<li>${en ? 'The ask and the deadline go in the first sentence after the greeting (BLUF).' : 'Đề nghị và hạn nằm ở câu đầu tiên sau lời chào (BLUF).'}</li>
<li>${en ? 'One email, one purpose; match the client’s formality; use their name as they sign it.' : 'Một email một mục đích; trang trọng theo khách; gọi tên như họ ký.'}</li>
<li>${en ? 'Emails that ask for money or credentials with urgency: verify through a second channel.' : 'Email đòi tiền hay mật khẩu một cách gấp gáp: xác minh qua kênh thứ hai.'}</li>
</ul>
</div>`;

/* ═════════════ 4.2 — Hỏi lại cho rõ yêu cầu ═════════════ */
const L42 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 4 · Writing' : 'Chương 4 · Viết'}</span>
<h2>${en ? '4.2 — Asking for clarification on requirements' : '4.2 — Hỏi lại cho rõ yêu cầu'}</h2>
<p class="lead">${en
    ? 'An unclear requirement costs one email today or one sprint of rework later. The difference between a question the client answers in two minutes and one that sits in their inbox for a week is the shape of the question: <strong>where</strong> in the spec, <strong>what exactly</strong> is unclear, and <strong>what you propose</strong>.'
    : 'Một yêu cầu mơ hồ tốn một email hôm nay, hoặc một sprint làm lại sau này. Câu hỏi được khách trả lời trong hai phút khác câu hỏi nằm trong hộp thư cả tuần ở hình dạng của nó: <strong>chỗ nào</strong> trong spec, <strong>chính xác cái gì</strong> chưa rõ, và <strong>bạn đề xuất gì</strong>.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A waiter who asks "How do you want your steak?" gets a pause. A waiter who asks "Medium or well done?" gets an answer in one second. The second waiter did the thinking for you — your clarification email should do the same.'
    : 'Người phục vụ hỏi "Anh muốn bít tết thế nào?" thì khách ngập ngừng. Người hỏi "Chín vừa hay chín kỹ ạ?" thì khách trả lời ngay trong một giây. Người thứ hai đã nghĩ hộ khách — email hỏi lại của bạn cũng nên làm vậy.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Spec v1.3, section 4 says: "A loan is overdue after the due date. The home page shows recent loans. Loans can be extended." You found three ambiguities (lesson 1.3 showed how to spot them). First draft:'
    : 'Spec v1.3, mục 4 ghi: "A loan is overdue after the due date. The home page shows recent loans. Loans can be extended." Bạn tìm ra ba chỗ mơ hồ (bài 1.3 đã dạy cách nhận ra). Bản nháp đầu:'}</p>
${E('mau/42-xau.txt', en ? 'Draft 1.' : 'Bản nháp 1.')}
${E('mau/42-tot.txt', en ? 'Draft 2 — numbered, located, with proposals.' : 'Bản nháp 2 — đánh số, chỉ chỗ, có đề xuất.')}
${RUN('42', 'mau/42-xau.txt mau/42-tot.txt', NOTE_RUN(en))}
<p>${en
    ? 'Look carefully: the checker says <strong>OK</strong> for draft 1. It has a question mark, no "ASAP", no time — every pattern passes, yet the email is bad: "what do you mean?" forces Tanaka-san to guess what you did not understand, and "Please explain more detail" is both ungrammatical and impossible to answer quickly. On the first run of draft 2 the checker caught "from 00:00 the next day" without JST; the fixed line now says "00:00 JST". Tools catch forms; only you can catch meaning.'
    : 'Nhìn kỹ: công cụ báo <strong>OK</strong> cho bản nháp 1. Có dấu hỏi, không "ASAP", không có giờ — mẫu nào cũng qua, nhưng email vẫn tệ: "what do you mean?" bắt Tanaka-san tự đoán bạn không hiểu chỗ nào, còn "Please explain more detail" vừa sai ngữ pháp vừa không thể trả lời nhanh. Lần chạy đầu của bản nháp 2, công cụ bắt được "from 00:00 the next day" thiếu JST; dòng đã sửa giờ ghi "00:00 JST". Công cụ bắt được hình thức; ý nghĩa thì chỉ bạn bắt được.'}</p>

<h3>${en ? 'The four moves of a clarification question' : 'Bốn bước của một câu hỏi làm rõ'}</h3>
<ol>
<li><strong>${en ? 'Locate' : 'Chỉ chỗ'}</strong>: <em>In spec v1.3, section 4 …</em> · <em>On screen S-05, the "Extend" button …</em> · <em>In your email of 20 Nov, you wrote "…".</em></li>
<li><strong>${en ? 'Quote' : 'Trích'}</strong>: ${en ? 'copy the exact words, in quotes, so nobody argues about what was written.' : 'chép đúng chữ, trong ngoặc kép, để không ai cãi nhau về câu đã viết.'}</li>
<li><strong>${en ? 'Offer options' : 'Đưa phương án'}</strong>: <em>Does "after" mean A or B?</em> · <em>Should it be X, Y, or both?</em></li>
<li><strong>${en ? 'Propose a default' : 'Đề xuất mặc định'}</strong>: <em>(Our proposal: …)</em> · <em>If we don’t hear from you by …, we will go with A.</em> ${en ? '— use the second sentence only when the team lead agrees; some clients dislike silent defaults.' : '— câu thứ hai chỉ dùng khi trưởng nhóm đồng ý; có khách không thích "im lặng là đồng ý".'}</li>
</ol>

<h3>${en ? 'Confirming what you understood' : 'Xác nhận lại điều mình hiểu'}</h3>
<p>${en
    ? 'Clarification also goes the other way: after a call, write down what you heard and ask the client to correct it. This is the cheapest insurance in outsourcing.'
    : 'Làm rõ còn theo chiều ngược lại: sau một cuộc gọi, viết lại điều bạn nghe và nhờ khách sửa. Đây là "bảo hiểm" rẻ nhất trong outsourcing.'}</p>
${mau(`
Just to confirm my understanding: …
To make sure we are on the same page: …
If I understood correctly, you would like … . Is that right?
Please correct me if I'm wrong, but … .
As agreed on 20 Nov, … . Please let us know if that has changed.
`, en ? 'Sentence frames for confirming.' : 'Khung câu để xác nhận.')}

<h3>${en ? 'Reading the answer — indirect "no"' : 'Đọc câu trả lời — chữ "không" gián tiếp'}</h3>
<p>${en
    ? 'Clients from cultures that avoid a direct "no" (often Japanese, sometimes British) may answer "That might be difficult", "We will consider it" or "Let us check internally". These can mean "no" or "not now". Do not mark the question as answered: reply with a closed question — "Thank you. So for this sprint we will keep the current behaviour. Is that correct?" — and wait for a yes.'
    : 'Khách đến từ văn hoá tránh nói "không" thẳng (hay gặp ở Nhật, đôi khi ở Anh) có thể trả lời "That might be difficult", "We will consider it" hay "Let us check internally". Những câu này có thể nghĩa là "không" hoặc "chưa phải lúc này". Đừng đánh dấu câu hỏi là đã trả lời: hồi đáp bằng một câu hỏi đóng — "Thank you. So for this sprint we will keep the current behaviour. Is that correct?" — và chờ chữ yes.'}</p>

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    ['What do you mean?', 'Does "after the due date" mean from the due time or from the next day?', en ? 'Show what you understood; offer options.' : 'Cho thấy bạn đã hiểu tới đâu; đưa phương án.'],
    ['Please explain more detail.', 'Could you explain this in more detail? / Could you give an example?', en ? '"in more detail"; better: ask a specific question.' : '"in more detail"; tốt hơn: hỏi cụ thể.'],
    ['I don’t understand the spec.', 'Section 4.2 does not say who can extend a loan.', en ? 'Blame the gap, not your English.' : 'Chỉ ra chỗ hổng, đừng tự nhận "tôi không hiểu".'],
    ['Can you answer soon?', 'Could you answer by Fri 27 Nov, 17:00 JST?', en ? 'A date + time zone.' : 'Ngày + múi giờ.'],
    ['How about the recent loans?', 'How many loans should "recent loans" show?', en ? '"How about" suggests, it does not ask for a fact.' : '"How about" là gợi ý, không phải hỏi thông tin.'],
  ], en)}

${tuVung(en ? [
    ['to clarify', 'to make clear', 'Could you clarify whether managers can extend loans?'],
    ['whether … or …', 'which of two options', 'Could you confirm whether we use JST or UTC?'],
    ['out of scope', 'not part of the agreed work', 'Email reminders are out of scope for this sprint.'],
    ['to be on the same page', 'to understand the same thing', 'To make sure we are on the same page, …'],
    ['our proposal', 'what we suggest if you agree', '(Our proposal: only the lab manager.)'],
    ['edge case', 'an unusual input or situation', 'What happens in the edge case of a loan returned at 23:59?'],
  ] : [
    ['to clarify', 'làm rõ', 'Could you clarify whether managers can extend loans?'],
    ['whether … or …', 'cái này hay cái kia', 'Could you confirm whether we use JST or UTC?'],
    ['out of scope', 'ngoài phạm vi đã thoả thuận', 'Email reminders are out of scope for this sprint.'],
    ['to be on the same page', 'hiểu giống nhau', 'To make sure we are on the same page, …'],
    ['our proposal', 'đề xuất của chúng tôi nếu anh/chị đồng ý', '(Our proposal: only the lab manager.)'],
    ['edge case', 'trường hợp biên, hiếm', 'What happens in the edge case of a loan returned at 23:59?'],
  ], en)}

<h3>🧪 ${en ? 'Practice — three clarification emails from one vague spec (20 minutes)' : 'Thực hành — ba email hỏi lại từ một spec mơ hồ (20 phút)'}</h3>
<div class="callout ok">
${mau(`
Spec v1.4, section 6 — Reports
6.1 Lab managers should be able to export reports monthly.
6.2 The report shows equipment usage.
6.3 Old reports are deleted after some time.
`, en ? 'The spec.' : 'Spec.')}
<p>${en ? 'Write one short email per item (6.1, 6.2, 6.3) to Tanaka-san: locate, quote, options, proposal, deadline. Then ask yourself: should these be three emails or one numbered email? (Hint: lesson 4.1, and Chapter 5 on Q&amp;A lists.)' : 'Viết cho Tanaka-san mỗi mục (6.1, 6.2, 6.3) một email ngắn: chỉ chỗ, trích, phương án, đề xuất, hạn. Rồi tự hỏi: nên là ba email hay một email đánh số? (Gợi ý: bài 4.1, và Chương 5 về Q&amp;A list.)'}</p>
<details><summary>${en ? 'Model answer' : 'Đáp án gợi ý'}</summary>
${mau(`
Subject: Spec v1.4 section 6 (reports): 3 questions

Hi Tanaka-san,

We have three questions on spec v1.4, section 6 (reports). Could you answer
them by Wed 2 Dec, 17:00 JST? Our proposals are in brackets.

1. 6.1 "export reports monthly": should the system create the report
   automatically on the 1st of each month, or should managers export any
   month on demand? Is "should" a requirement or a nice-to-have?
   (Our proposal: on demand, any month; required.)
2. 6.2 "equipment usage": which numbers? For example: number of loans,
   total days borrowed, number of overdue loans per item.
   (Our proposal: all three, per item and per department.)
3. 6.3 "after some time": how long, and does it mean generated report
   files or the loan data itself?
   (Our proposal: delete generated files after 12 months; never delete
   loan data automatically.)

Best regards,
An Nguyen
LabFlow team, FPT Software
`)}
<p>${en ? 'One email is right here: the three questions are on the same section and the same person answers. When questions go to different people, or one blocks work today, split them. Note question 1 also asks whether "should" is a requirement — the RFC 2119 trap from lesson 1.3.' : 'Ở đây một email là đúng: ba câu cùng một mục và cùng một người trả lời. Khi câu hỏi gửi cho người khác nhau, hoặc một câu chặn việc ngay hôm nay, hãy tách ra. Để ý câu 1 còn hỏi "should" là bắt buộc hay không — cái bẫy RFC 2119 của bài 1.3.'}</p>
</details>
</div>
${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-1-3-spec', '📄', en ? 'Lesson 1.3 — Specs, RFC 2119 words and ambiguity' : 'Bài 1.3 — Spec, từ RFC 2119 và chỗ mơ hồ', en ? 'How to find the ambiguities before you ask.' : 'Cách tìm chỗ mơ hồ trước khi hỏi.')}
${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-5-1-qa-list', '📋', en ? 'Chapter 5 — Q&amp;A lists' : 'Chương 5 — Q&amp;A list', en ? 'When questions grow past five, move them into a tracked list.' : 'Khi câu hỏi nhiều hơn năm, chuyển sang danh sách có theo dõi.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>to clarify · whether … or … · our proposal · just to confirm · out of scope · edge case · ${en ? 'indirect no' : '"không" gián tiếp'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Locate, quote, offer options, propose a default, give a deadline.' : 'Chỉ chỗ, trích, đưa phương án, đề xuất mặc định, cho hạn.'}</li>
<li>${en ? 'After every call, confirm in writing what you understood.' : 'Sau mỗi cuộc gọi, xác nhận bằng văn bản điều mình hiểu.'}</li>
<li>${en ? '"We will consider it" is not a yes — close it with a yes/no question.' : '"We will consider it" chưa phải là có — chốt bằng câu hỏi có/không.'}</li>
</ul>
</div>`;

/* ═════════════ 4.3 — Báo trễ ═════════════ */
const L43 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 4 · Writing' : 'Chương 4 · Viết'}</span>
<h2>${en ? '4.3 — Reporting a delay: reason, impact, new plan, what you need' : '4.3 — Báo trễ hạn: lý do, ảnh hưởng, kế hoạch mới, cần hỗ trợ gì'}</h2>
<p class="lead">${en
    ? 'Every developer is late sometimes. What the client and your lead remember is not the delay — it is <strong>when</strong> they heard about it and whether you came with a plan. Bad news early is a gift; bad news on the deadline day is a surprise, and nobody likes surprises in a project.'
    : 'Lập trình viên nào cũng có lúc trễ. Điều khách và trưởng nhóm nhớ không phải việc trễ — mà là <strong>khi nào</strong> họ được biết và bạn có mang theo kế hoạch hay không. Tin xấu báo sớm là món quà; tin xấu vào đúng ngày hạn là cú sốc, mà dự án thì không ai thích bất ngờ.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A friend who texts at 18:30 "Stuck in traffic on Nguyen Trai, I’ll be 20 minutes late — order without me" is fine. A friend who arrives at 19:20 saying "sorry, traffic" is not. Same delay, different message.'
    : 'Bạn nhắn lúc 18:30 "Kẹt xe ở Nguyễn Trãi, tớ trễ 20 phút — cứ gọi món trước đi" thì không sao. Bạn tới lúc 19:20 rồi mới nói "sorry, tắc đường" thì khác hẳn. Cùng một lần trễ, khác nhau ở tin nhắn.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'LAB-252 (CSV export) is due Thu 26 Nov. On Tuesday you discover that exports over 10,000 rows run out of memory on the test server. You need until Monday. First draft:'
    : 'LAB-252 (xuất CSV) hạn thứ Năm 26/11. Thứ Ba bạn phát hiện xuất quá 10.000 dòng thì hết bộ nhớ trên máy test. Bạn cần tới thứ Hai. Bản nháp đầu:'}</p>
${E('mau/43-xau.txt', en ? 'Draft 1.' : 'Bản nháp 1.')}
${E('mau/43-tot.txt', en ? 'Draft 2 — news, reason, impact, plan, ask.' : 'Bản nháp 2 — tin, lý do, ảnh hưởng, kế hoạch, đề nghị.')}
${RUN('43', 'mau/43-xau.txt mau/43-tot.txt', NOTE_RUN(en))}
<p>${en
    ? 'Draft 1 blames the library and "the old code" (written by someone who may be on the cc list), apologises three times, and gives no date. Draft 2 apologises once, gives a technical reason without blame, separates what is and is not affected, shows a plan with dates, and offers an option B so the client keeps control.'
    : 'Bản 1 đổ lỗi cho thư viện và "mã cũ" (do một người có khi đang trong danh sách cc viết), xin lỗi ba lần, không có ngày. Bản 2 xin lỗi một lần, nêu lý do kỹ thuật không đổ lỗi, tách rõ cái bị ảnh hưởng và cái không, có kế hoạch kèm ngày, và đưa phương án B để khách vẫn nắm quyền quyết định.'}</p>

<h3>${en ? 'The five-part delay message' : 'Thông báo trễ năm phần'}</h3>
<table>
<thead><tr><th>${en ? 'Part' : 'Phần'}</th><th>${en ? 'Sentence frames' : 'Khung câu'}</th></tr></thead>
<tbody>
<tr><td>${en ? '1. The news (subject + first line)' : '1. Tin (tiêu đề + dòng đầu)'}</td><td><em>LAB-252: new date Mon 30 Nov (was Thu 26 Nov)</em> · <em>Unfortunately, … will be ready on …, not on … as planned.</em></td></tr>
<tr><td>${en ? '2. Reason — facts, no blame' : '2. Lý do — sự thật, không đổ lỗi'}</td><td><em>Reason: … , so we need to …</em> · <em>We found that …</em> · <em>It took longer than expected because …</em></td></tr>
<tr><td>${en ? '3. Impact' : '3. Ảnh hưởng'}</td><td><em>As a result, …</em> · <em>Impact: … moves from … to … . … is not affected.</em></td></tr>
<tr><td>${en ? '4. New plan' : '4. Kế hoạch mới'}</td><td><em>New plan: …</em> ${en ? '(dated steps)' : '(các bước có ngày)'} · <em>We propose …</em></td></tr>
<tr><td>${en ? '5. What you need' : '5. Cần gì'}</td><td><em>Could you confirm …?</em> · <em>If … cannot move, we can …</em> ${en ? '(option B)' : '(phương án B)'}</td></tr>
</tbody>
</table>

<h3>${en ? 'When to send it' : 'Gửi khi nào'}</h3>
<p>${en
    ? 'As soon as you believe the date is at risk — not when you are sure it is missed. A useful internal rule: if a task estimated at 2 days is not clearly finishing on day 2, tell your lead at the next stand-up (Chapter 6). In OJT, a task "estimated 2 days, now on day 4" with no message is the most common complaint mentors have about interns. Projects that look green in reports and are red inside are called "watermelon projects"; one honest delay email is how you avoid being the watermelon.'
    : 'Ngay khi bạn thấy ngày hạn có nguy cơ trễ — không phải khi đã chắc chắn trễ. Luật nội bộ hữu ích: việc ước 2 ngày mà tới ngày thứ 2 chưa rõ là xong, hãy báo trưởng nhóm ở buổi standup gần nhất (Chương 6). Khi OJT, task "ước 2 ngày, nay đã sang ngày 4" mà im lặng là điều người hướng dẫn phàn nàn về thực tập sinh nhiều nhất. Dự án báo cáo màu xanh mà bên trong đỏ gọi là "dự án dưa hấu"; một email báo trễ trung thực là cách để bạn không thành quả dưa hấu.'}</p>
<p>${en
    ? 'Internal vs client: to your lead, be shorter and more technical, and say what you tried (see the lab, email 2). To the client, the lead usually decides who sends it — ask "Should I email Tanaka-san, or will you?"'
    : 'Nội bộ và khách: với trưởng nhóm thì ngắn hơn, kỹ thuật hơn, nói rõ đã thử gì (xem lab, email 2). Với khách, thường trưởng nhóm quyết ai gửi — hãy hỏi "Should I email Tanaka-san, or will you?"'}</p>

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    ['the task is delay', 'the task is delayed / will be late', en ? '"delay" is a noun or a verb; here you need the passive.' : '"delay" là danh từ hoặc động từ; ở đây cần bị động.'],
    ['I am so sorry to inform that …', 'Unfortunately, …', en ? '"inform" needs an object (inform you that); one apology is enough.' : '"inform" cần tân ngữ (inform you that); một lời xin lỗi là đủ.'],
    ['because the old code is very bad', 'because the export builds the whole file in memory', en ? 'Technical fact, not a judgement of a person.' : 'Sự thật kỹ thuật, không phán xét người.'],
    ['We will try our best', 'We will deliver it on Mon 30 Nov', en ? 'A date is a commitment; "best" is not.' : 'Ngày là cam kết; "cố gắng hết sức" thì không.'],
    ['maybe tomorrow or next week', 'Mon 30 Nov', en ? 'Two options = no date.' : 'Hai khả năng = không có ngày.'],
    ['Subject: URGENT!!!', 'Subject: LAB-252 CSV export: new date Mon 30 Nov (was Thu 26 Nov)', en ? 'The subject is the news.' : 'Tiêu đề chính là tin.'],
  ], en)}

${tuVung(en ? [
    ['unfortunately', 'opens bad news politely', 'Unfortunately, the export will be ready on Monday.'],
    ['as a result', 'introduces the impact', 'As a result, UAT moves to 1 Dec.'],
    ['to be on track / at risk', 'on time / may be late', 'LAB-260 is at risk; the rest is on track.'],
    ['to push back / to move', 'to make later', 'Can we move the UAT to 1 Dec?'],
    ['workaround', 'a temporary way around a problem', 'As a workaround, exports up to 10,000 rows work today.'],
    ['to deliver', 'to hand over finished work', 'We can deliver it on 30 Nov.'],
  ] : [
    ['unfortunately', 'mở đầu tin xấu một cách lịch sự', 'Unfortunately, the export will be ready on Monday.'],
    ['as a result', 'dẫn vào phần ảnh hưởng', 'As a result, UAT moves to 1 Dec.'],
    ['to be on track / at risk', 'đúng tiến độ / có nguy cơ trễ', 'LAB-260 is at risk; the rest is on track.'],
    ['to push back / to move', 'lùi lại', 'Can we move the UAT to 1 Dec?'],
    ['workaround', 'cách tạm để vượt qua vấn đề', 'As a workaround, exports up to 10,000 rows work today.'],
    ['to deliver', 'bàn giao việc đã xong', 'We can deliver it on 30 Nov.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — two delay messages (15 minutes)' : 'Thực hành — hai thông báo trễ (15 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'LAB-258 (login with the university account) was due Fri 27 Nov. The university’s identity server sends a different user ID format than documented, and you are waiting for their IT team. (a) A Teams message to your lead Minh. (b) An email to Tanaka-san (Minh asked you to send it).' : 'LAB-258 (đăng nhập bằng tài khoản trường) hạn thứ Sáu 27/11. Máy chủ định danh của trường trả mã người dùng khác định dạng tài liệu ghi, và bạn đang chờ phòng IT của trường. (a) Tin Teams gửi trưởng nhóm Minh. (b) Email gửi Tanaka-san (Minh nhờ bạn gửi).'}</p>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
(a) Teams, to Minh:
Hi Minh, LAB-258 (university login) is at risk for Fri 27 Nov. The identity
server returns IDs like "u-48213" instead of the student number in the docs,
so we can't match accounts. I emailed their IT at 10:30 ICT, no reply yet.
Meanwhile I'm finishing the logout flow and tests. Should I tell Tanaka-san
today, or wait until tomorrow noon for IT's answer?

(b) Email, to Tanaka-san:
Subject: LAB-258 university login: at risk for 27 Nov, waiting for IT

Hi Tanaka-san,

LAB-258 may not be ready on Fri 27 Nov. Could you help us get an answer
from the university IT team about the user ID format?

Reason: the identity server returns IDs such as "u-48213", not the
student number described in the integration guide (page 4), so we cannot
link the login to the LabFlow account. We asked IT on 24 Nov.

Impact: only the university login is affected; login with a LabFlow
password still works for UAT.

Plan: once we know the mapping, we need 1.5 days to finish and test.
If we hear by Wed 25 Nov, 17:00 JST, 27 Nov is still possible.

Best regards,
An Nguyen
LabFlow team, FPT Software
`)}
</details>
</div>
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-0-9-bat-dau-khi-khong-co', '🤝', en ? 'Agile &amp; Teamwork — Team failures: missed deadlines, silence' : 'Agile &amp; Làm việc nhóm — Thất bại của nhóm: trễ hạn, im lặng', en ? 'Why silence hurts more than the delay.' : 'Vì sao im lặng gây hại hơn chính việc trễ.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>unfortunately · as a result · on track / at risk · workaround · to deliver · ${en ? 'watermelon project' : 'dự án dưa hấu'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Tell early: when the date is at risk, not when it is missed.' : 'Báo sớm: khi hạn có nguy cơ, không đợi tới khi đã trễ.'}</li>
<li>${en ? 'News → reason (no blame) → impact → dated plan → what you need, with an option B.' : 'Tin → lý do (không đổ lỗi) → ảnh hưởng → kế hoạch có ngày → cần gì, kèm phương án B.'}</li>
<li>${en ? 'Apologise once; replace "try our best" and "ASAP" with dates.' : 'Xin lỗi một lần; thay "try our best" và "ASAP" bằng ngày cụ thể.'}</li>
</ul>
</div>`;

/* ═════════════ 4.4 — Báo sự cố ═════════════ */
const L44 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 4 · Writing' : 'Chương 4 · Viết'}</span>
<h2>${en ? '4.4 — Reporting an incident and following up' : '4.4 — Báo sự cố và cập nhật tiếp theo'}</h2>
<p class="lead">${en
    ? 'When production breaks, the client has two problems: the outage, and not knowing what is going on. You may need an hour to fix the first; you can fix the second in five minutes with a short message that answers four questions — <strong>what is broken, who is affected, what we are doing, when you will hear from us next</strong> — and then keeping that promise.'
    : 'Khi hệ thống thật hỏng, khách có hai vấn đề: sự cố, và việc không biết chuyện gì đang xảy ra. Vấn đề thứ nhất có thể mất một giờ để sửa; vấn đề thứ hai bạn sửa được trong năm phút bằng một tin ngắn trả lời bốn câu — <strong>cái gì hỏng, ai bị ảnh hưởng, ta đang làm gì, khi nào khách nghe tin tiếp</strong> — rồi giữ đúng lời hẹn đó.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A delayed flight. Passengers are angrier at a gate with no announcements than at a gate that says "Technical check, next update at 14:30" — even if the second delay is longer. The announcement does not fix the plane; it gives people back control of their time.'
    : 'Chuyến bay bị hoãn. Hành khách bực ở cửa ra máy bay im lìm hơn nhiều so với cửa có thông báo "Kiểm tra kỹ thuật, cập nhật tiếp lúc 14:30" — kể cả khi chuyến thứ hai trễ lâu hơn. Thông báo không sửa được máy bay; nó trả lại cho mọi người quyền sắp xếp thời gian của mình.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Tue 24 Nov, 09:00 ICT: your team deploys LabFlow 2.4.0. At 09:10 logins start failing with 500 errors; a lab manager reports it in Teams at 09:14. Your lead Minh is rolling back and asks you to inform the client. Compare:'
    : 'Thứ Ba 24/11, 09:00 ICT: nhóm bạn triển khai LabFlow 2.4.0. 09:10 đăng nhập bắt đầu lỗi 500; 09:14 một quản lý phòng lab báo trong Teams. Trưởng nhóm Minh đang rollback và nhờ bạn báo khách. So sánh:'}</p>
${E('mau/44-xau.txt', en ? 'Draft 1.' : 'Bản nháp 1.')}
${E('mau/44-dau.txt', en ? 'Draft 2 — the first notice (sent 09:25 ICT).' : 'Bản nháp 2 — thông báo đầu tiên (gửi 09:25 ICT).')}
${RUN('44', 'mau/44-xau.txt mau/44-dau.txt', NOTE_RUN(en))}
<p>${en
    ? '"It will be fixed soon" is a promise you cannot keep — you do not know the cause yet. Draft 2 promises only what you control: the time of the next update. Note the status word in the subject: <code>[Incident]</code> now, <code>[Resolved]</code> later — the client can follow the story from the inbox list alone.'
    : '"It will be fixed soon" là lời hứa bạn không giữ được — bạn còn chưa biết nguyên nhân. Bản 2 chỉ hứa điều bạn kiểm soát: giờ cập nhật tiếp. Để ý chữ trạng thái trong tiêu đề: <code>[Incident]</code> lúc này, <code>[Resolved]</code> lúc sau — khách nhìn danh sách hộp thư là theo dõi được cả câu chuyện.'}</p>

<h3>${en ? 'Three messages, one incident' : 'Ba thông điệp, một sự cố'}</h3>
<table>
<thead><tr><th>${en ? 'Message' : 'Thông điệp'}</th><th>${en ? 'When' : 'Khi nào'}</th><th>${en ? 'Contains' : 'Gồm'}</th></tr></thead>
<tbody>
<tr><td>${en ? '1. First notice' : '1. Thông báo đầu'}</td><td>${en ? 'Within ~15–30 minutes, before you know the cause' : 'Trong khoảng 15–30 phút, trước khi biết nguyên nhân'}</td><td>What · Impact · What we are doing · Next update</td></tr>
<tr><td>${en ? '2. Updates' : '2. Cập nhật'}</td><td>${en ? 'At the promised time, even if nothing changed' : 'Đúng giờ đã hẹn, kể cả khi chưa có gì mới'}</td><td><em>Still investigating; we have ruled out … ; next update at …</em></td></tr>
<tr><td>${en ? '3. Resolved + report' : '3. Đã xử lý + báo cáo'}</td><td>${en ? 'When fixed; full report within days' : 'Khi xong; báo cáo đầy đủ trong vài ngày'}</td><td>${en ? 'Duration, impact, data affected or not, root cause, actions with ticket numbers and dates' : 'Thời lượng, ảnh hưởng, dữ liệu có bị gì không, nguyên nhân gốc, hành động kèm số ticket và ngày'}</td></tr>
</tbody>
</table>
${E('mau/44-capnhat.txt', en ? 'Message 3a — resolved (09:50 ICT).' : 'Thông điệp 3a — đã xử lý (09:50 ICT).')}
${E('mau/44-baocao.txt', en ? 'Message 3b — the incident report (two days later).' : 'Thông điệp 3b — báo cáo sự cố (hai ngày sau).')}
${RUN('44b', 'mau/44-capnhat.txt mau/44-baocao.txt', NOTE_RUN(en))}
<p>${en
    ? 'The timeline in the report has times without "ICT" on each line; the checker accepts them because the heading "Timeline (ICT):" sets the zone — the first version of the checker flagged all five lines, so it was improved to understand headings. The report is <strong>blameless</strong>: it says "we added it on the test server but not on production, and the checklist did not include it", not "Huy forgot the setting". Blame makes people hide the next incident.'
    : 'Dòng thời gian trong báo cáo có giờ không ghi "ICT" ở từng dòng; công cụ chấp nhận vì tiêu đề "Timeline (ICT):" đã nêu múi giờ — bản đầu của công cụ báo cả năm dòng, nên đã được sửa để hiểu tiêu đề. Báo cáo theo kiểu <strong>blameless</strong> (không quy lỗi cá nhân): ghi "we added it on the test server but not on production, and the checklist did not include it", chứ không "Huy forgot the setting". Đổ lỗi làm mọi người giấu sự cố lần sau.'}</p>

<h3>${en ? 'Status words (the same as on status pages)' : 'Từ trạng thái (giống trên trang trạng thái)'}</h3>
<p>${en
    ? 'Atlassian Statuspage, used by thousands of companies, labels incidents <strong>Investigating → Identified → Monitoring → Resolved</strong>. Use the same words in your subject lines and chat updates; clients already know them.'
    : 'Atlassian Statuspage, được hàng nghìn công ty dùng, gắn nhãn sự cố <strong>Investigating → Identified → Monitoring → Resolved</strong> (đang điều tra → đã xác định → đang theo dõi → đã xử lý). Dùng đúng các từ này trong tiêu đề và tin cập nhật; khách vốn đã quen.'}</p>

<h3>🕵️ ${en ? 'Real incidents — communication done well and badly' : 'Sự cố thật — truyền thông làm tốt và làm hỏng'}</h3>
<div class="callout warn"><p>${en
    ? '<strong>GitLab.com, 31 January 2017.</strong> An engineer deleted the primary database directory by mistake during an emergency; five backup methods turned out not to work, and about six hours of data (issues, merge requests, comments) were lost. GitLab’s communication became a model: a public Google Doc with live notes, updates on Twitter, even a live stream of the recovery, and a detailed postmortem on 10 February 2017. Customers were angry about the data loss — but nobody could say GitLab hid anything.'
    : '<strong>GitLab.com, 31/1/2017.</strong> Trong lúc xử lý khẩn cấp, một kỹ sư xoá nhầm thư mục cơ sở dữ liệu chính; năm cách sao lưu hoá ra không hoạt động, và khoảng sáu giờ dữ liệu (issue, merge request, bình luận) bị mất. Cách GitLab truyền thông trở thành hình mẫu: một Google Doc công khai ghi trực tiếp, cập nhật trên Twitter, thậm chí phát trực tiếp quá trình khôi phục, và bản postmortem chi tiết ngày 10/2/2017. Khách giận vì mất dữ liệu — nhưng không ai nói được là GitLab giấu giếm.'}</p>
<p>${en
    ? '<strong>Atlassian, April 2022.</strong> A maintenance script deleted 883 cloud sites belonging to 775 customers; some were down for up to 14 days. Atlassian’s own Post-Incident Review admits the communication failed: the deleted data included the customers’ contact details, so Atlassian could not reach them, and for days customers learned more from social media than from Atlassian. The lesson for you: know <em>before</em> an incident who to contact and how — keep the client’s contacts outside the system that can fail.'
    : '<strong>Atlassian, tháng 4/2022.</strong> Một script bảo trì xoá 883 site cloud của 775 khách hàng; có khách mất dịch vụ tới 14 ngày. Chính bản Post-Incident Review của Atlassian thừa nhận truyền thông thất bại: dữ liệu bị xoá gồm cả thông tin liên hệ của khách, nên Atlassian không liên lạc được với họ, và nhiều ngày liền khách biết tin qua mạng xã hội nhiều hơn từ Atlassian. Bài học cho bạn: biết <em>trước</em> khi có sự cố là phải báo ai và bằng kênh nào — lưu liên hệ của khách ở ngoài hệ thống có thể hỏng.'}</p></div>
${lienKet('/courses/incident-response/learn?lessonSlug=ir-5-3-trang-trang-thai', '🚨', en ? 'Incident response 5.3 — Status pages' : 'Ứng phó sự cố 5.3 — Trang trạng thái', en ? 'What to publish, when, and how often.' : 'Công bố gì, khi nào, bao lâu một lần.')}
${lienKet('/courses/incident-response/learn?lessonSlug=ir-10-2-mau', '🚨', en ? 'Incident response 10.2 — The postmortem template' : 'Ứng phó sự cố 10.2 — Mẫu postmortem', en ? 'Section by section, blameless.' : 'Từng phần, không quy lỗi cá nhân.')}

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    ['the system have some problem', 'Logins to LabFlow fail with a 500 error.', en ? '"has"; and say which function, which error.' : '"has"; và nói chức năng nào, lỗi gì.'],
    ['It will be fixed soon.', 'Next update: by 10:00 ICT (12:00 JST).', en ? 'Promise the update, not the fix.' : 'Hứa giờ cập nhật, không hứa giờ sửa xong.'],
    ['Users cannot login.', 'Users cannot log in.', en ? '"log in" is the verb; "login" is the noun.' : '"log in" là động từ; "login" là danh từ.'],
    ['Huy forgot to add the setting.', 'The setting was missing on production, and the checklist did not include it.', en ? 'Blameless: the process failed.' : 'Không quy lỗi: quy trình thiếu.'],
    ['The root cause is maybe the deploy.', 'We suspect release 2.4.0 and are rolling it back.', en ? '"suspect" for unconfirmed causes.' : 'Dùng "suspect" cho nguyên nhân chưa xác nhận.'],
    ['No data lost.', 'No loan data was lost or changed.', en ? 'Full sentence; say which data.' : 'Câu đủ; nói rõ dữ liệu nào.'],
  ], en)}

${tuVung(en ? [
    ['outage / downtime', 'time when a service does not work', 'The outage lasted 32 minutes.'],
    ['to roll back', 'to return to the previous version', 'We rolled back to release 2.3.2.'],
    ['root cause', 'the deepest reason', 'Root cause: a missing setting on production.'],
    ['to mitigate', 'to reduce the impact before the real fix', 'We mitigated it by rolling back.'],
    ['blameless postmortem', 'incident report about processes, not people', 'We will share a blameless postmortem by Thursday.'],
    ['to be affected', 'to be hit by the problem', 'Production is not affected.'],
  ] : [
    ['outage / downtime', 'thời gian dịch vụ ngừng', 'The outage lasted 32 minutes.'],
    ['to roll back', 'quay về phiên bản trước', 'We rolled back to release 2.3.2.'],
    ['root cause', 'nguyên nhân gốc', 'Root cause: a missing setting on production.'],
    ['to mitigate', 'giảm ảnh hưởng trước khi sửa tận gốc', 'We mitigated it by rolling back.'],
    ['blameless postmortem', 'báo cáo sự cố nói về quy trình, không quy lỗi người', 'We will share a blameless postmortem by Thursday.'],
    ['to be affected', 'bị ảnh hưởng', 'Production is not affected.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — an update with no news (10 minutes)' : 'Thực hành — bản cập nhật khi chưa có tin mới (10 phút)'}</h3>
<div class="callout ok">
<p>${en ? 'It is 10:00 ICT, the time you promised. The rollback did not fix logins; you have ruled out the database. Write update #2 to Tanaka-san.' : 'Đã 10:00 ICT, đúng giờ đã hẹn. Rollback không làm đăng nhập chạy lại; bạn đã loại trừ cơ sở dữ liệu. Viết bản cập nhật số 2 cho Tanaka-san.'}</p>
<details><summary>${en ? 'Model answer' : 'Đáp án gợi ý'}</summary>
${mau(`
Subject: [Incident] LabFlow login failing - update 2, still investigating

Hi Tanaka-san,

Logins still fail. FYI, no action is needed from you yet.

Since the last update: rolling back to 2.3.2 did not fix the problem, so
the release is probably not the cause. The database is healthy. We are now
checking the connection to the university login service.

Workaround: lab managers can record loans on paper and we will enter them
later; existing sessions still work.

Next update: by 10:30 ICT (12:30 JST).

Best regards,
An Nguyen (on behalf of the LabFlow team)
`)}
</details>
</div>

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>outage · Investigating / Identified / Monitoring / Resolved · to roll back · to mitigate · root cause · blameless postmortem</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'First notice fast: what, impact, what we are doing, next update time.' : 'Thông báo đầu thật nhanh: cái gì, ảnh hưởng, đang làm gì, giờ cập nhật tiếp.'}</li>
<li>${en ? 'Keep every promised update time, even with "no news".' : 'Giữ đúng mọi giờ cập nhật đã hẹn, kể cả khi "chưa có gì mới".'}</li>
<li>${en ? 'Resolved message + blameless report with dated actions.' : 'Thư báo đã xử lý + báo cáo không quy lỗi, có hành động kèm ngày.'}</li>
</ul>
</div>`;

/* ═════════════ 4.5 — Chat ═════════════ */
const L45 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 4 · Writing' : 'Chương 4 · Viết'}</span>
<h2>${en ? '4.5 — Slack/Teams messages that stand alone, and async etiquette' : '4.5 — Tin nhắn Slack/Teams tự đủ ý, và phép lịch sự khi làm bất đồng bộ'}</h2>
<p class="lead">${en
    ? 'Chat feels like talking, so people write it like talking: "hi", wait, "are you there?", wait, the question. With a colleague in Tokyo or Berlin, every "wait" can be hours. A good work message <strong>stands alone</strong>: someone who opens it tomorrow morning can act on it without asking anything back.'
    : 'Chat có cảm giác như nói chuyện, nên người ta viết như nói: "hi", chờ, "are you there?", chờ, rồi mới tới câu hỏi. Với đồng nghiệp ở Tokyo hay Berlin, mỗi lần "chờ" có thể là vài giờ. Tin nhắn công việc tốt phải <strong>tự đủ ý</strong>: người mở ra sáng mai làm được ngay mà không cần hỏi lại gì.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Leaving a voicemail that says only "Hi, it’s me, call me back" versus "Hi, it’s An — can you pick up the printer cartridge on your way? Black, model 85A." The second one gets the cartridge even if they never call back.'
    : 'Để lại tin nhắn thoại chỉ "Alo, tớ đây, gọi lại nhé" so với "Alo, An đây — trên đường về cậu mua giúp hộp mực máy in nhé? Màu đen, loại 85A." Tin thứ hai thì kể cả người kia không gọi lại, bạn vẫn có mực.'}</p>

<h3>${en ? 'Situation — four messages that cost a morning' : 'Tình huống — bốn tin nhắn tốn cả buổi sáng'}</h3>
${E('mau/45-xau-1.txt', en ? 'Message 1 (sent 08:02 ICT; Minh replies "Hi" at 08:40).' : 'Tin 1 (gửi 08:02 ICT; Minh trả lời "Hi" lúc 08:40).')}
${E('mau/45-xau-2.txt', en ? 'Message 2 (to a colleague in Berlin, 15:00 ICT = 09:00 there).' : 'Tin 2 (gửi đồng nghiệp ở Berlin, 15:00 ICT = 09:00 bên đó).')}
${E('mau/45-xau-3.txt', en ? 'Message 3 (in the client channel).' : 'Tin 3 (trong kênh có khách).')}
${E('mau/45-xau-4.txt', en ? 'Message 4 (in a 60-person channel).' : 'Tin 4 (trong kênh 60 người).')}
${E('mau/45-tot-1.txt', en ? 'Better 1 — question, context, your default, urgency.' : 'Tốt hơn 1 — câu hỏi, bối cảnh, mặc định của bạn, mức gấp.')}
${E('mau/45-tot-2.txt', en ? 'Better 2 — fact, evidence, question, what you do next, when.' : 'Tốt hơn 2 — sự thật, bằng chứng, câu hỏi, việc bạn làm tiếp, khi nào.')}
${RUN('45', 'mau/45-xau-*.txt mau/45-tot-*.txt', NOTE_RUN(en))}

<h3>${en ? 'Seven habits of async chat' : 'Bảy thói quen chat bất đồng bộ'}</h3>
<ol>
<li><strong>${en ? 'No naked "hi"' : 'Không "hi" trơ trọi'}</strong> — ${en ? 'greeting and question in one message (nohello.net explains why in one page).' : 'lời chào và câu hỏi trong một tin (nohello.net giải thích trong một trang).'}</li>
<li><strong>${en ? 'Context first' : 'Bối cảnh trước'}</strong> — ${en ? 'ticket number, environment, the exact error text (a code block, not a screenshot of text).' : 'số ticket, môi trường, nguyên văn thông báo lỗi (khối mã, không chụp ảnh chữ).'}</li>
<li><strong>${en ? 'Say your default' : 'Nói mặc định của bạn'}</strong> — <em>I’m going with UTC for now and will switch if you say so.</em> ${en ? 'Work does not stop while you wait.' : 'Việc không dừng trong lúc chờ.'}</li>
<li><strong>${en ? 'Say the urgency honestly' : 'Nói đúng mức gấp'}</strong> — <em>Not urgent, today is fine</em> / <em>Blocking me now</em>.</li>
<li><strong>${en ? 'Use threads' : 'Dùng thread'}</strong> — ${en ? 'reply in the thread, not in the channel; one topic per thread.' : 'trả lời trong thread, không trả lời ra kênh; mỗi thread một chủ đề.'}</li>
<li><strong>@channel / @here ${en ? 'rarely' : 'thật hiếm'}</strong> — ${en ? 'they notify everyone, including people asleep in other time zones. Use them for real incidents, and still without capitals.' : 'chúng báo cho tất cả, kể cả người đang ngủ ở múi giờ khác. Chỉ dùng khi có sự cố thật, và vẫn không viết hoa toàn bộ.'}</li>
<li><strong>${en ? 'Close the loop' : 'Khép vòng'}</strong> — ${en ? 'a ✅ reaction or "Done, thanks!" when solved; post the solution in the thread so the next person finds it by search.' : 'thả ✅ hoặc "Done, thanks!" khi xong; ghi cách giải trong thread để người sau tìm được.'}</li>
</ol>

<h3>${en ? 'Time zones: compute, do not guess' : 'Múi giờ: tính, đừng đoán'}</h3>
<p>${en
    ? 'A 100-line script is overkill for one meeting, but a small converter shows two traps at once. Here is <code>mui-gio.mjs</code> (in the lab files) on a meeting at 15:00 Hanoi time on Thu 26 Nov 2026:'
    : 'Script trăm dòng thì thừa cho một cuộc họp, nhưng một bộ đổi giờ nhỏ cho thấy hai cái bẫy cùng lúc. Đây là <code>mui-gio.mjs</code> (trong tệp lab) với cuộc họp 15:00 giờ Hà Nội, thứ Năm 26/11/2026:'}</p>
${mau('$ node mui-gio.mjs 2026-11-26T15:00\n' + OUT.tz1, NOTE_TZ(en))}
<p>${en
    ? 'Trap 1: 00:00 in San Francisco and 03:00 in New York — and 26 Nov 2026 is the US Thanksgiving holiday. Trap 2: daylight saving time. Berlin is UTC+1 in winter but UTC+2 after the last Sunday of March, so a "fixed" 09:00 Berlin meeting moves in Hanoi time:'
    : 'Bẫy 1: 00:00 ở San Francisco và 03:00 ở New York — mà 26/11/2026 lại là ngày lễ Tạ ơn ở Mỹ. Bẫy 2: giờ mùa hè. Berlin là UTC+1 mùa đông nhưng UTC+2 sau Chủ nhật cuối tháng Ba, nên cuộc họp "cố định" 09:00 giờ Berlin bị xê dịch theo giờ Hà Nội:'}</p>
${mau('$ node mui-gio.mjs 2027-03-30T09:00 Europe/Berlin\n' + OUT.tz2, NOTE_TZ(en))}
<p>${en
    ? 'Vietnam has no daylight saving time, so you are the one who must notice: the weekly meeting is 15:00 ICT in winter and 14:00 ICT from 28 March 2027. Always write times with the zone, and for important ones both zones: <em>15:00 ICT (17:00 JST)</em>. Use "schedule send" (Slack and Teams both have it) so a non-urgent message arrives in the reader’s morning, not at 2 a.m.'
    : 'Việt Nam không đổi giờ mùa hè, nên chính bạn phải tự để ý: họp hằng tuần là 15:00 ICT mùa đông và 14:00 ICT từ 28/3/2027. Luôn viết giờ kèm múi giờ, giờ quan trọng thì ghi cả hai: <em>15:00 ICT (17:00 JST)</em>. Dùng "schedule send" (hẹn giờ gửi — Slack và Teams đều có) để tin không gấp tới vào buổi sáng của người đọc, không phải lúc 2 giờ đêm.'}</p>

<h3>🕵️ ${en ? 'Hacker corner — "Hi, this is IT" in chat (EA 2021, Uber 2022)' : 'Góc hacker — "Chào, mình bên IT đây" trong chat (EA 2021, Uber 2022)'}</h3>
<div class="callout warn"><p>${en
    ? 'In 2021 attackers bought a stolen browser cookie that logged them into Electronic Arts’ Slack, then messaged EA’s IT support pretending to be an employee who had lost their phone, and received a multi-factor authentication token; they later claimed to have taken about 780 GB of data including game source code (reported by Motherboard/Vice, June 2021). In September 2022 an attacker flooded an Uber contractor with MFA push requests, then contacted them on WhatsApp claiming to be Uber IT and asking them to accept; once inside, the attacker announced the breach in Uber’s own Slack (Uber security update, 16 Sep 2022). Chat feels informal and urgent — exactly what social engineers need. Verify identity through a known channel before you share codes, accept prompts or change access, and say so politely: <em>"Sure — could you open a ticket in the IT portal? I can’t share codes over chat."</em>'
    : 'Năm 2021 kẻ tấn công mua một cookie trình duyệt bị đánh cắp để vào được Slack của Electronic Arts, rồi nhắn cho bộ phận IT của EA giả làm nhân viên bị mất điện thoại, và nhận được mã xác thực nhiều lớp (MFA); sau đó chúng tuyên bố đã lấy khoảng 780 GB dữ liệu gồm cả mã nguồn game (Motherboard/Vice đưa tin, 6/2021). Tháng 9/2022 một kẻ tấn công dội liên tục yêu cầu MFA vào điện thoại một nhân viên hợp đồng của Uber, rồi nhắn WhatsApp tự xưng là IT của Uber, bảo bấm chấp nhận; vào được rồi, hắn công bố vụ xâm nhập ngay trong Slack của Uber (Uber security update, 16/9/2022). Chat có cảm giác thân mật và gấp — đúng thứ kẻ lừa đảo cần. Xác minh danh tính qua kênh đã biết trước khi đưa mã, bấm chấp nhận hay đổi quyền truy cập, và nói lịch sự: <em>"Sure — could you open a ticket in the IT portal? I can’t share codes over chat."</em>'}</p></div>

<h3>${en ? 'Mistakes Vietnamese developers make' : 'Lỗi dev Việt hay mắc'}</h3>
${saiDung([
    ['anh ơi', 'Hi Minh,', en ? 'Vietnamese in a channel the client can read.' : 'Tiếng Việt trong kênh khách đọc được.'],
    ['the api not work', 'GET /api/loans returns 500 on the test server since 14:05 ICT.', en ? 'Verb + which API + which error + since when.' : 'Có động từ + API nào + lỗi gì + từ khi nào.'],
    ['help me', 'Could you take a look when you have 10 minutes?', en ? 'Say what help and how long.' : 'Nói giúp gì và mất bao lâu.'],
    ['ok', 'OK, I’ll update the PR by 16:00 ICT.', en ? '"ok" alone: understood? agreed? done?' : '"ok" trơ trọi: đã hiểu? đồng ý? đã làm?'],
    ['(screenshot of an error text)', en ? 'the error text in a code block: <code>SESSION_SECRET is not set</code>' : 'chữ lỗi trong khối mã: <code>SESSION_SECRET is not set</code>', en ? 'Text can be searched and copied.' : 'Chữ thì tìm và chép được.'],
    ['Sorry to bother you, are you free?', 'Do you have 10 minutes today for a quick call about LAB-258?', en ? 'Topic + time cost.' : 'Chủ đề + tốn bao lâu.'],
  ], en)}

${tuVung(en ? [
    ['quick question', 'signals a short question', 'Quick question on LAB-252: UTC or local time?'],
    ['when you have a moment', 'not urgent', 'Could you review my PR when you have a moment?'],
    ['blocking', 'stops my work now', 'This is blocking me — could you check today?'],
    ['heads-up', 'early warning', 'Heads-up: the test server restarts at 18:00 ICT.'],
    ['thread', 'replies under one message', 'Let’s keep it in this thread.'],
    ['to ping someone', 'to send a short message to get attention', 'I’ll ping you when the PR is ready.'],
  ] : [
    ['quick question', 'báo trước là câu hỏi ngắn', 'Quick question on LAB-252: UTC or local time?'],
    ['when you have a moment', 'không gấp', 'Could you review my PR when you have a moment?'],
    ['blocking', 'đang chặn việc của tôi', 'This is blocking me — could you check today?'],
    ['heads-up', 'báo trước', 'Heads-up: the test server restarts at 18:00 ICT.'],
    ['thread', 'các trả lời dưới một tin', 'Let’s keep it in this thread.'],
    ['to ping someone', 'nhắn ngắn để gây chú ý', 'I’ll ping you when the PR is ready.'],
  ], en)}

<h3>🧪 ${en ? 'Practice — rewrite five messages (10 minutes)' : 'Thực hành — viết lại năm tin nhắn (10 phút)'}</h3>
<div class="callout ok">
<ol>
<li><em>hello sarah</em> ${en ? '(you want the test account password reset)' : '(bạn cần đặt lại mật khẩu tài khoản test)'}</li>
<li><em>build fail</em> ${en ? '(CI failed on your PR #61 because of a lint error you do not understand)' : '(CI lỗi trên PR #61 của bạn vì một lỗi lint bạn không hiểu)'}</li>
<li><em>ok</em> ${en ? '(reply to "Can you add tests for the edge cases?")' : '(trả lời "Can you add tests for the edge cases?")'}</li>
<li><em>@channel anyone know docker???</em></li>
<li><em>are you free now</em> ${en ? '(to Mark in Berlin; you want 15 minutes to discuss the API format)' : '(gửi Mark ở Berlin; bạn cần 15 phút bàn định dạng API)'}</li>
</ol>
<details><summary>${en ? 'Model answers' : 'Đáp án gợi ý'}</summary>
${mau(`
1. Hi Sarah, could you reset the password of the test account "manager01"
   on https://test.labflow.example? It says "account locked" since this
   morning. Not urgent - before 16:00 ICT (10:00 CET) would be great. Thanks!
2. Hi Minh, CI fails on my PR #61 with this lint error:
       no-floating-promises: Promises must be awaited (src/export.ts:42)
   I'm not sure whether I should await the call or mark it with void.
   Could you take a look when you have 5 minutes?
3. Sure, I'll add tests for page=0 and page=-1 and push them by 15:00 ICT.
4. (in #dev-help, no @channel) Has anyone run the LabFlow docker compose
   on Windows? "docker compose up" stops with "port 5432 is already
   allocated". Any tips appreciated.
5. Hi Mark, do you have 15 minutes today or tomorrow (Wed 25 Nov) for a
   call about the date format in the loans API (ISO 8601 vs epoch)?
   I'm free 14:00-17:00 ICT (08:00-11:00 CET) both days.
   If it's easier, I can write the options here.
`)}
</details>
</div>
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-6-4-tu-xa', '🤝', en ? 'Agile &amp; Teamwork 6.4 — Remote and async communication' : 'Agile &amp; Làm việc nhóm 6.4 — Giao tiếp từ xa và bất đồng bộ', en ? 'Team agreements, response times, meeting-free hours.' : 'Thoả thuận nhóm, thời gian phản hồi, giờ không họp.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>async · thread · @channel / @here · heads-up · blocking · schedule send · ${en ? 'daylight saving time' : 'giờ mùa hè (DST)'} · social engineering</p>
<p class="note-ct">📚 ${en ? 'Learn more — asking a colleague for a favour and disagreeing politely in everyday (non-technical) English: Days 15–18 of' : 'Học thêm — nhờ đồng nghiệp giúp việc và không đồng ý lịch sự bằng tiếng Anh giao tiếp thường ngày (không kỹ thuật): Ngày 15–18 của khoá'} <a href="https://cuongthai.com/language/en/giao-tiep" target="_blank" rel="noopener">${en ? 'English for everyday communication (My Language)' : 'Tiếng Anh giao tiếp (My Language)'}</a></p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'One message = greeting + question + context + your default + urgency.' : 'Một tin = chào + câu hỏi + bối cảnh + mặc định của bạn + mức gấp.'}</li>
<li>${en ? 'Threads, rare @channel, close the loop.' : 'Dùng thread, hạn chế @channel, khép vòng khi xong.'}</li>
<li>${en ? 'Write times with zones; watch DST and foreign holidays.' : 'Ghi giờ kèm múi giờ; để ý giờ mùa hè và ngày lễ nước khách.'}</li>
<li>${en ? 'Never share codes or approve access because of a chat message alone.' : 'Không bao giờ đưa mã hay cấp quyền chỉ vì một tin chat.'}</li>
</ul>
</div>`;

/* ═════════════ 4.6 — Lab sáu email ═════════════ */
const LAB_FILES = ['1-hoi-lai', '2-bao-tre', '3-su-co', '4-xin-nghi', '5-cam-on', '6-tu-choi'];
const L46 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 4 · Lab' : 'Chương 4 · Lab'}</span>
<h2>${en ? '4.6 — Lab: six emails for six real situations' : '4.6 — Lab: sáu email cho sáu tình huống thật'}</h2>
<p class="lead">${en
    ? 'Ninety minutes, six emails you will really send in your first months: a clarification, a delay, an incident notice, a leave request, a thank-you and a polite "no" to extra scope. You check each one with a small script that runs on your own machine, then grade yourself with a rubric — the script for form, the rubric for meaning.'
    : 'Chín mươi phút, sáu email bạn sẽ thật sự gửi trong mấy tháng đầu: hỏi lại, báo trễ, báo sự cố, xin nghỉ, cảm ơn, và một lời từ chối lịch sự với việc ngoài phạm vi. Bạn kiểm từng email bằng một script nhỏ chạy trên máy mình, rồi tự chấm theo rubric — script cho hình thức, rubric cho nội dung.'}</p>

<h3>${en ? 'Step 0 — the checker (10 minutes)' : 'Bước 0 — công cụ kiểm (10 phút)'}</h3>
<p>${en
    ? 'Create a folder <code>emails/</code>, save the script below as <code>kiem-email.mjs</code>, and write each email as a plain text file: header lines (<code>To:</code>, <code>Subject:</code>), one blank line, then the body. A file without <code>Subject:</code> is treated as a chat message. Node 18+ is enough; no packages.'
    : 'Tạo thư mục <code>emails/</code>, lưu script dưới đây thành <code>kiem-email.mjs</code>, và viết mỗi email thành một tệp văn bản: các dòng đầu (<code>To:</code>, <code>Subject:</code>), một dòng trống, rồi thân thư. Tệp không có <code>Subject:</code> được coi là tin chat. Cần Node 18 trở lên; không cần gói nào.'}</p>
${mau(TOOL, 'kiem-email.mjs')}
${mau(`
# Run with Node on your machine:
node kiem-email.mjs emails/*.txt

# Or without installing Node (Docker), no network needed:
docker run --rm --network none -v "$PWD":/w -w /w node:22-alpine node kiem-email.mjs emails/*.txt
`, en ? 'Two ways to run it. Exit code 0 = no warnings, 1 = warnings.' : 'Hai cách chạy. Mã thoát 0 = không cảnh báo, 1 = có cảnh báo.')}
<div class="callout"><p>${en
    ? 'What each warning means: <code>SUBJ-*</code> subject; <code>ASK-LATE</code>/<code>ASK-NONE</code> the request is buried or missing; <code>TIME-NO-TZ</code> a time without a zone (a heading like "Timeline (ICT):" covers the lines below it); <code>DATE-REL</code> "tomorrow" without a date; <code>PHRASE</code> ASAP, EOD, "do the needful", "Dear Sir/Madam"…; <code>SORRY×n</code>; <code>CAPS</code>; <code>VIETNAMESE</code>; <code>CHAT-HELLO</code>/<code>CHAT-THERE</code>. It is a pattern checker: an email can pass and still be bad (lesson 4.2 shows one).'
    : 'Ý nghĩa cảnh báo: <code>SUBJ-*</code> tiêu đề; <code>ASK-LATE</code>/<code>ASK-NONE</code> đề nghị bị chôn hoặc không có; <code>TIME-NO-TZ</code> giờ thiếu múi giờ (tiêu đề kiểu "Timeline (ICT):" phủ cho các dòng bên dưới); <code>DATE-REL</code> "tomorrow" không kèm ngày; <code>PHRASE</code> ASAP, EOD, "do the needful", "Dear Sir/Madam"…; <code>SORRY×n</code>; <code>CAPS</code>; <code>VIETNAMESE</code>; <code>CHAT-HELLO</code>/<code>CHAT-THERE</code>. Đây là công cụ bắt mẫu: email qua được vẫn có thể tệ (bài 4.2 có ví dụ).'}</p></div>

<h3>${en ? 'Step 1 — the six situations (60 minutes, about 10 each)' : 'Bước 1 — sáu tình huống (60 phút, mỗi cái khoảng 10)'}</h3>
<p>${en ? 'Project LabFlow, today is Tue 24 Nov 2026. Client PM: Tanaka Yui (Tokyo, JST). Client QA: Sarah Miller. Your lead: Minh Tran. Invent any missing detail, but keep it concrete.' : 'Dự án LabFlow, hôm nay thứ Ba 24/11/2026. PM phía khách: Tanaka Yui (Tokyo, JST). QA phía khách: Sarah Miller. Trưởng nhóm: Minh Tran. Tự bịa chi tiết còn thiếu, nhưng phải cụ thể.'}</p>
<ol>
<li><strong>${en ? 'Clarify' : 'Hỏi lại'}</strong> — ${en ? 'spec v1.4, 5.1 says "The system must send a reminder before the due date." You start LAB-262 next week. → <code>1-hoi-lai.txt</code> to Tanaka-san.' : 'spec v1.4, mục 5.1 ghi "The system must send a reminder before the due date." Tuần sau bạn bắt đầu LAB-262. → <code>1-hoi-lai.txt</code> gửi Tanaka-san.'}</li>
<li><strong>${en ? 'Delay (internal)' : 'Báo trễ (nội bộ)'}</strong> — ${en ? 'LAB-260 (search by student ID), estimated 2 days, today is day 4: old IDs come in three formats. → <code>2-bao-tre.txt</code> to Minh.' : 'LAB-260 (tìm theo mã sinh viên), ước 2 ngày, hôm nay là ngày 4: mã cũ có ba định dạng. → <code>2-bao-tre.txt</code> gửi Minh.'}</li>
<li><strong>${en ? 'Incident' : 'Sự cố'}</strong> — ${en ? 'the UAT server returns 502 since 13:20 ICT; the client’s testers are using it this afternoon; production is fine. → <code>3-su-co.txt</code> to Tanaka-san, cc Minh.' : 'máy UAT trả 502 từ 13:20 ICT; chiều nay tester phía khách đang dùng; production vẫn ổn. → <code>3-su-co.txt</code> gửi Tanaka-san, cc Minh.'}</li>
<li><strong>${en ? 'Leave request' : 'Xin nghỉ'}</strong> — ${en ? 'you have a university exam on Fri 4 Dec. → <code>4-xin-nghi.txt</code> to Minh, with a handover.' : 'bạn thi ở trường thứ Sáu 4/12. → <code>4-xin-nghi.txt</code> gửi Minh, có bàn giao.'}</li>
<li><strong>${en ? 'Thank-you' : 'Cảm ơn'}</strong> — ${en ? 'Sarah sent 50,000 rows of anonymised test data that exposed the export memory bug. → <code>5-cam-on.txt</code>.' : 'Sarah gửi 50.000 dòng dữ liệu test đã ẩn danh, nhờ đó lộ ra lỗi bộ nhớ khi xuất. → <code>5-cam-on.txt</code>.'}</li>
<li><strong>${en ? 'Say no to extra scope' : 'Từ chối việc ngoài phạm vi'}</strong> — ${en ? 'Tanaka-san writes: "Could you also add PDF export to the monthly report? It should be small." It is not in sprint 7. → <code>6-tu-choi.txt</code>.' : 'Tanaka-san viết: "Could you also add PDF export to the monthly report? It should be small." Việc này không có trong sprint 7. → <code>6-tu-choi.txt</code>.'}</li>
</ol>

<h3>${en ? 'Step 2 — check, fix, check again (10 minutes)' : 'Bước 2 — kiểm, sửa, kiểm lại (10 phút)'}</h3>
<p>${en ? 'Run the checker on all six. Fix every warning or write one line explaining why you keep it. Then read each email aloud as if you were the receiver, on a phone.' : 'Chạy công cụ trên cả sáu. Sửa mọi cảnh báo hoặc ghi một dòng giải thích vì sao giữ. Rồi đọc to từng email như thể bạn là người nhận, trên điện thoại.'}</p>

<h3>${en ? 'Self-grading rubric (per email, 5 points)' : 'Rubric tự chấm (mỗi email 5 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Point' : 'Điểm'}</th><th>${en ? 'Criterion' : 'Tiêu chí'}</th></tr></thead>
<tbody>
<tr><td>1</td><td>${en ? 'The subject alone tells the reader the topic and the action/status.' : 'Chỉ đọc tiêu đề là biết chủ đề và hành động/trạng thái.'}</td></tr>
<tr><td>1</td><td>${en ? 'The ask (or "FYI, no action needed") is in the first sentence after the greeting.' : 'Đề nghị (hoặc "FYI, no action needed") nằm ở câu đầu sau lời chào.'}</td></tr>
<tr><td>1</td><td>${en ? 'Every date has a day and month; every time has a zone; deadlines are real.' : 'Ngày nào cũng có thứ/ngày tháng; giờ nào cũng có múi giờ; hạn là hạn thật.'}</td></tr>
<tr><td>1</td><td>${en ? 'Tone: no blame, at most one apology, formality matches the reader.' : 'Giọng: không đổ lỗi, xin lỗi tối đa một lần, trang trọng hợp người đọc.'}</td></tr>
<tr><td>1</td><td>${en ? 'The reader can act without asking anything back (options, proposal, handover, workaround).' : 'Người đọc làm được ngay mà không phải hỏi lại (phương án, đề xuất, bàn giao, cách tạm).'}</td></tr>
</tbody>
</table>
<p>${en ? 'Pass: ≥ 25/30 and zero checker warnings (or each one justified).' : 'Đạt: ≥ 25/30 và không còn cảnh báo (hoặc cảnh báo nào cũng có lý do).'}</p>

<details><summary>${en ? 'Model answers for the six emails (real checker output)' : 'Sáu email mẫu (kèm output thật của công cụ)'}</summary>
${LAB_FILES.map((f) => mau(EM[`lab46/${f}.txt`], `${f}.txt`)).join('\n')}
${mau('$ node kiem-email.mjs lab46/*.txt\n' + OUT.lab46.replace(/exit=(\d+)\n?$/, '$ echo $?\n$1'), NOTE_RUN(en))}
<p>${en
    ? 'Notes: email 2 is internal, so it is shorter and says what was tried; it still offers an option B (split the ticket). Email 3 tells the client to pause UAT — the one action they need — in the first lines. Email 6 never says "no": it names the scope, gives an estimate and lets the client choose between two trade-offs. That is how a team says no without saying no.'
    : 'Ghi chú: email 2 là nội bộ nên ngắn hơn và nói đã thử gì; vẫn có phương án B (tách ticket). Email 3 bảo khách tạm dừng UAT — việc duy nhất họ cần làm — ngay mấy dòng đầu. Email 6 không hề nói "no": nó gọi đúng phạm vi, đưa ước lượng, và để khách chọn giữa hai phương án đánh đổi. Đó là cách một nhóm từ chối mà không cần nói chữ "không".'}</p>
</details>

<h3>🎤 ${en ? 'Interviewers will ask (answer in English, 30–60 seconds each)' : 'Phỏng vấn viên sẽ hỏi (trả lời bằng tiếng Anh, mỗi câu 30–60 giây)'}</h3>
<p>${en ? 'Behavioural questions like these are common in OJT and fresher interviews at outsourcing companies such as FPT Software, often in English. Use STAR (Situation, Task, Action, Result) and a real story from your student projects. Record yourself, then compare.' : 'Câu hỏi hành vi kiểu này hay gặp khi phỏng vấn OJT và fresher ở công ty outsourcing như FPT Software, thường bằng tiếng Anh. Dùng STAR (Situation, Task, Action, Result) và một câu chuyện thật từ đồ án của bạn. Tự ghi âm, rồi so.'}</p>
<ol>
<li><em>Tell me about a time you could not finish a task on time. What did you do?</em>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
In my SWP391 project I owned the booking module. Two days before the sprint
review I realised the payment callback would not be ready, because the
sandbox returned a different signature format than the docs. I told my team
lead the same day, explained the cause, and proposed to demo booking with a
mocked payment and finish the callback in the next sprint. He agreed, we
demoed on time, and the real callback was done three days later. What I
learned is to report a risk as soon as I see it, together with a plan B.
`)}</details></li>
<li><em>What do you do when a requirement is unclear?</em>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
First I check the spec, the ticket history and the existing code, so I don't
ask something already answered. Then I write a short question that points to
the exact line, offers two options and says which one I propose. For example,
"Does 'recent loans' mean the last 10 loans or the last 7 days? We propose
the last 10." After a call I confirm what we agreed in writing, so the whole
team has the same understanding.
`)}</details></li>
<li><em>How would you work with a client in a different time zone?</em>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I'd make every message self-contained, so the client can answer it in their
morning without asking me anything back. I write times with both zones, like
"15:00 ICT, 17:00 JST", and I check daylight saving time and their public
holidays before proposing a meeting. I also use the overlap hours for calls
and keep everything else asynchronous, in the ticket or the thread.
`)}</details></li>
<li><em>A client asks you directly for a "small" feature that is not in the scope. What do you do?</em>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I wouldn't say yes or no on my own. I'd thank the client, tell my team lead,
and we'd reply that it is outside the current scope, with a rough estimate
and options: add it to the next sprint, or swap it with a planned item of
similar size. That way the client decides with full information, and the
team does not take on hidden work that delays everything else.
`)}</details></li>
<li><em>Tell me about a time something went wrong in your project. How did you communicate it?</em>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
During our PRJ301 demo week, I pushed a change that broke the login page on
the shared test server one hour before another team's demo. I posted in the
class group right away: what was broken, that I was rolling it back, and
that I'd confirm in 15 minutes. The rollback took 8 minutes and I confirmed.
Afterwards we added a rule that every push to the test server needs a quick
login check. I learned that a fast, honest message matters as much as the fix.
`)}</details></li>
</ol>
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-3-4-ngan-hang', '🎤', en ? 'Interview prep 3.4 — 30 behavioural questions' : 'Chuẩn bị phỏng vấn 3.4 — 30 câu hỏi hành vi', en ? 'Answer frames for the whole bank.' : 'Khung trả lời cho cả ngân hàng câu hỏi.')}
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-2-2-star', '🎤', en ? 'Interview prep 2.2 — STAR stories' : 'Chuẩn bị phỏng vấn 2.2 — Câu chuyện STAR', en ? '"I" not "we", and numbers.' : 'Nói "I" chứ không "we", và có con số.')}

<h3>${en ? 'At work — what your mentor will check' : 'Khi đi làm — người hướng dẫn sẽ soát gì'}</h3>
<p>${en
    ? 'In many outsourcing teams, an intern’s first client emails are reviewed by the lead before sending, or the intern drafts and the lead sends. Ask on day one: "Should I send client emails directly, or share a draft with you first?" — and keep a personal folder of your best emails as templates. After three months you will have your own version of this lab.'
    : 'Ở nhiều nhóm outsourcing, vài email đầu tiên thực tập sinh gửi khách được trưởng nhóm duyệt trước, hoặc thực tập sinh soạn nháp còn trưởng nhóm gửi. Hỏi ngay ngày đầu: "Should I send client emails directly, or share a draft with you first?" — và giữ một thư mục riêng chứa các email tốt nhất của bạn làm mẫu. Ba tháng sau, bạn có phiên bản lab này của riêng mình.'}</p>

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>rubric · STAR · scope · change request · trade-off · handover</p>
<p class="note-ct">📚 ${en ? 'Learn more — asking for leave, asking favours and saying no politely in everyday (non-technical) English: Days 15–18 of' : 'Học thêm — xin nghỉ, nhờ việc và từ chối lịch sự bằng tiếng Anh giao tiếp thường ngày (không kỹ thuật): Ngày 15–18 của khoá'} <a href="https://cuongthai.com/language/en/giao-tiep" target="_blank" rel="noopener">${en ? 'English for everyday communication (My Language)' : 'Tiếng Anh giao tiếp (My Language)'}</a></p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Six situations cover most of the emails you write in OJT.' : 'Sáu tình huống bao gần hết email bạn viết khi OJT.'}</li>
<li>${en ? 'Script for form, rubric for meaning, reading aloud for tone.' : 'Script cho hình thức, rubric cho nội dung, đọc to cho giọng văn.'}</li>
<li>${en ? 'Interview answers reuse the same structure: situation, what you did, result, lesson.' : 'Trả lời phỏng vấn dùng lại cùng cấu trúc: tình huống, bạn làm gì, kết quả, bài học.'}</li>
</ul>
</div>`;

/* ═════════════ 4.7 — Quiz chương 4 ═════════════ */
const QUIZ4 = [
  Q('tak4-1', 'Which subject line is best for asking the client where the department master data is?|||Tiêu đề nào tốt nhất khi hỏi khách master data khoa nằm ở đâu?', [
    'Question|||Question',
    'URGENT!!! Please help|||URGENT!!! Please help',
    'LAB-240: where is the department master data?|||LAB-240: where is the department master data?',
    'Hello from the FPT Software team|||Hello from the FPT Software team',
  ], 2, 'Ticket + what you need, readable on a phone. Lesson 4.1.|||Ticket + cần gì, đọc được trên điện thoại. Bài 4.1.'),
  Q('tak4-2', 'Where should the request go in a work email?|||Đề nghị nên nằm ở đâu trong email công việc?', [
    'In the last paragraph, after the context|||Ở đoạn cuối, sau bối cảnh',
    'In the first sentence after the greeting (BLUF)|||Ở câu đầu tiên sau lời chào (BLUF)',
    'In the subject only|||Chỉ ở tiêu đề',
    'In an attachment|||Trong tệp đính kèm',
  ], 1, 'Bottom Line Up Front. Lesson 4.1.|||Bottom Line Up Front — ý chính lên đầu. Bài 4.1.'),
  Q('tak4-3', 'The client signs "Tanaka Yui". How do you greet her in a reply?|||Khách ký "Tanaka Yui". Bạn chào thế nào khi trả lời?', [
    'Dear Sir/Madam,|||Dear Sir/Madam,',
    'Hi Mr Yui,|||Hi Mr Yui,',
    'Hi Tanaka-san,|||Hi Tanaka-san,',
    'Hey Yui!|||Hey Yui!',
  ], 2, 'Family name first; "-san" after the family name; copy the signature. Lesson 4.1.|||Họ đứng trước; "-san" sau họ; chép theo chữ ký. Bài 4.1.'),
  Q('tak4-4', 'Which clarification question will get the fastest useful answer?|||Câu hỏi làm rõ nào nhận được câu trả lời hữu ích nhanh nhất?', [
    'What do you mean by recent loans?|||What do you mean by recent loans?',
    'Please explain more detail about recent loans.|||Please explain more detail about recent loans.',
    'Section 4: how many "recent loans" should the home page show? (Our proposal: the 10 newest.)|||Section 4: how many "recent loans" should the home page show? (Our proposal: the 10 newest.)',
    'I don’t understand the spec.|||I don’t understand the spec.',
  ], 2, 'Locate, quote, options, proposal. Lesson 4.2.|||Chỉ chỗ, trích, phương án, đề xuất. Bài 4.2.'),
  Q('tak4-5', 'The client replies "We will consider it." What should you do?|||Khách trả lời "We will consider it." Bạn nên làm gì?', [
    'Treat it as a yes and start the work|||Coi là đồng ý và bắt đầu làm',
    'Confirm with a closed question, e.g. "So for this sprint we keep the current behaviour. Is that correct?"|||Xác nhận bằng câu hỏi đóng, ví dụ "So for this sprint we keep the current behaviour. Is that correct?"',
    'Ignore the topic|||Bỏ qua chủ đề',
    'Ask again in capital letters|||Hỏi lại bằng chữ in hoa',
  ], 1, 'It may be an indirect "no" or "not now". Lesson 4.2.|||Có thể là "không" hoặc "chưa" nói gián tiếp. Bài 4.2.'),
  Q('tak4-6', 'What is the right order in a delay email?|||Thứ tự đúng trong email báo trễ là gì?', [
    'Apologies → reason → maybe a date|||Xin lỗi → lý do → có thể có ngày',
    'Reason → blame → apology|||Lý do → đổ lỗi → xin lỗi',
    'News (new date) → reason without blame → impact → dated plan → what you need|||Tin (ngày mới) → lý do không đổ lỗi → ảnh hưởng → kế hoạch có ngày → cần gì',
    'Plan → news → nothing else|||Kế hoạch → tin → không gì thêm',
  ], 2, 'Unfortunately… / As a result… / New plan… / Could you confirm…? Lesson 4.3.|||Unfortunately… / As a result… / New plan… / Could you confirm…? Bài 4.3.'),
  Q('tak4-7', 'Your first incident notice must NOT contain which of these?|||Thông báo sự cố đầu tiên KHÔNG nên có điều nào?', [
    'What is broken and since when|||Cái gì hỏng và từ khi nào',
    'Who is affected|||Ai bị ảnh hưởng',
    'A promise that "it will be fixed soon" before you know the cause|||Lời hứa "it will be fixed soon" khi chưa biết nguyên nhân',
    'The time of the next update|||Giờ cập nhật tiếp theo',
  ], 2, 'Promise the update time, not the fix time. Lesson 4.4.|||Hứa giờ cập nhật, không hứa giờ sửa xong. Bài 4.4.'),
  Q('tak4-8', 'What made Atlassian’s April 2022 outage communication fail, according to its own review?|||Theo chính bản review của Atlassian, vì sao truyền thông trong sự cố tháng 4/2022 thất bại?', [
    'They had no status page product|||Họ không có sản phẩm trang trạng thái',
    'The deleted data included customer contact details, so they could not reach customers|||Dữ liệu bị xoá gồm cả thông tin liên hệ của khách, nên họ không liên lạc được',
    'Customers did not speak English|||Khách không nói tiếng Anh',
    'The outage lasted only five minutes|||Sự cố chỉ kéo dài năm phút',
  ], 1, 'Know before an incident how to reach the client. Lesson 4.4.|||Phải biết trước khi có sự cố cách liên lạc với khách. Bài 4.4.'),
  Q('tak4-9', 'Which chat message follows async etiquette?|||Tin chat nào đúng phép lịch sự bất đồng bộ?', [
    'Hi Minh|||Hi Minh',
    'are you there?|||are you there?',
    'Hi Minh, quick question on LAB-252: UTC or the user’s time zone for "borrowed at"? I’m going with UTC for now. Not urgent.|||Hi Minh, quick question on LAB-252: UTC or the user’s time zone for "borrowed at"? I’m going with UTC for now. Not urgent.',
    '@channel HELP!!!|||@channel HELP!!!',
  ], 2, 'Greeting + question + context + default + urgency in one message. Lesson 4.5.|||Chào + câu hỏi + bối cảnh + mặc định + mức gấp trong một tin. Bài 4.5.'),
  Q('tak4-10', 'A weekly call is fixed at 09:00 Berlin time. What happens to it in Hanoi time after the last Sunday of March?|||Cuộc gọi hằng tuần cố định 09:00 giờ Berlin. Sau Chủ nhật cuối tháng Ba, giờ Hà Nội của nó thế nào?', [
    'Stays at 15:00 ICT|||Vẫn 15:00 ICT',
    'Moves to 14:00 ICT, because Berlin switches to UTC+2 and Vietnam has no DST|||Thành 14:00 ICT, vì Berlin chuyển sang UTC+2 còn Việt Nam không đổi giờ',
    'Moves to 16:00 ICT|||Thành 16:00 ICT',
    'Is cancelled automatically|||Tự động bị huỷ',
  ], 1, 'Real output of mui-gio.mjs for 30 Mar 2027. Lesson 4.5.|||Output thật của mui-gio.mjs cho 30/3/2027. Bài 4.5.'),
];

export default {
  title: 'Chapter 4 — Email and chat with clients and leads|||Chương 4 — Email và chat với khách hàng và trưởng nhóm',
  description: 'Lịch sự, rõ ràng, có hành động cụ thể: cấu trúc email (BLUF), hỏi lại yêu cầu có đề xuất, báo trễ năm phần, báo sự cố ba thông điệp, chat tự đủ ý và múi giờ — mọi mẫu kiểm bằng công cụ kiem-email.mjs chạy thật; lab sáu email + năm câu phỏng vấn tiếng Anh.',
  lessons: [
    { title: '4.1 — The structure of a work email: subject, opening, point, ask, closing|||4.1 — Cấu trúc email công việc: tiêu đề, mở đầu, ý chính, đề nghị, kết', slug: 'tak-4-1-cau-truc', type: 'LESSON', isFreePreview: true, description: 'Email hỏi master data viết lại từ bản nháp sinh viên, năm phần + BLUF, một email một mục đích, mức trang trọng và tên người Nhật, To/Cc/Bcc/Reply all, công cụ kiểm email chạy thật, góc hacker BEC (Toyota Boshoku 2019, IC3 2023), bài sửa ba email.', content: L41(true) + L41(false) },
    { title: '4.2 — Asking for clarification on requirements|||4.2 — Hỏi lại cho rõ yêu cầu', slug: 'tak-4-2-hoi-lai', type: 'LESSON', isFreePreview: true, description: 'Bốn bước hỏi làm rõ (chỉ chỗ, trích, phương án, đề xuất), khung câu xác nhận "Just to confirm", đọc chữ "không" gián tiếp, ví dụ công cụ báo OK mà email vẫn tệ, bài ba câu hỏi từ một spec mơ hồ.', content: L42(true) + L42(false) },
    { title: '4.3 — Reporting a delay: reason, impact, new plan, what you need|||4.3 — Báo trễ hạn: lý do, ảnh hưởng, kế hoạch mới, cần hỗ trợ gì', slug: 'tak-4-3-bao-tre', type: 'LESSON', isFreePreview: true, description: 'Email báo trễ năm phần (tin, lý do không đổ lỗi, ảnh hưởng, kế hoạch có ngày, cần gì + phương án B), báo sớm khi có nguy cơ, nội bộ và khách, dự án dưa hấu, bài viết tin Teams + email cho LAB-258.', content: L43(true) + L43(false) },
    { title: '4.4 — Reporting an incident and following up|||4.4 — Báo sự cố và cập nhật tiếp theo', slug: 'tak-4-4-bao-su-co', type: 'LESSON', isFreePreview: true, description: 'Ba thông điệp cho một sự cố (thông báo đầu, cập nhật, đã xử lý + báo cáo không quy lỗi), từ trạng thái Statuspage, sự cố thật GitLab 2017 và Atlassian 2022, bài viết bản cập nhật khi chưa có tin mới.', content: L44(true) + L44(false) },
    { title: '4.5 — Slack/Teams messages that stand alone, and async etiquette|||4.5 — Tin nhắn Slack/Teams tự đủ ý, và phép lịch sự khi làm bất đồng bộ', slug: 'tak-4-5-chat', type: 'LESSON', isFreePreview: true, description: 'Bốn tin nhắn tốn cả buổi sáng và bản viết lại, bảy thói quen chat bất đồng bộ (nohello, thread, @channel), đổi múi giờ chạy thật (lễ Tạ ơn, giờ mùa hè Berlin), góc hacker EA 2021 và Uber 2022, bài viết lại năm tin.', content: L45(true) + L45(false) },
    { title: '4.6 — Lab: six emails for six real situations|||4.6 — Lab: sáu email cho sáu tình huống thật', slug: 'tak-4-6-lab', type: 'LESSON', isFreePreview: true, description: 'Công cụ kiem-email.mjs in nguyên văn (Node hoặc Docker), sáu tình huống (hỏi lại, báo trễ, sự cố, xin nghỉ, cảm ơn, từ chối ngoài phạm vi), rubric 30 điểm, sáu email mẫu kèm output thật, năm câu phỏng vấn hành vi tiếng Anh có đáp án mẫu STAR.', content: L46(true) + L46(false) },
    {
      title: '4.7 — Chapter 4 quiz|||4.7 — Kiểm tra Chương 4',
      slug: 'tak-4-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: tiêu đề, BLUF, cách gọi tên khách Nhật, câu hỏi làm rõ, "We will consider it", thứ tự email báo trễ, thông báo sự cố, bài học Atlassian 2022, tin chat tự đủ ý, giờ mùa hè.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions built from the emails and messages of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu dựng từ chính các email và tin nhắn trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ4 },
    },
  ],
};
