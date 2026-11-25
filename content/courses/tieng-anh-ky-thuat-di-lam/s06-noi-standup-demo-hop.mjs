/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 6: Nói — standup, demo và họp (soạn 24/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-6-1 … tak-6-6).
 * Mọi kịch bản mẫu, biên bản và output là THẬT: kiem-noi.mjs (tự viết cho chương này, in nguyên văn ở bài 6.5) chạy 24/11/2026
 * trong node:22-alpine (Node 22.23.5), --network none; âm thanh mẫu bằng eSpeak NG 1.52.0, nghe lại bằng faster-whisper 1.2.1
 * (mô hình small.en, CPU, ngoại tuyến, Python 3.14.6) — nghe.py in nguyên văn ở bài 6.5.
 * Dự án LabFlow, khách Tanaka Yui, Priya Nair và các thành viên đội là hư cấu.
 * Nguồn: The Scrum Guide (Schwaber & Sutherland, 11/2020); OpenAI, "Introducing Whisper" (21/9/2022) và bài báo
 * "Robust Speech Recognition via Large-Scale Weak Supervision" (Radford et al., 2022); CNN 4/2/2024 + 16/5/2024 (Arup, cuộc gọi
 * video deepfake ở Hồng Kông); The Wall Street Journal 30/8/2019 (giọng giả CEO, 220.000 euro); BBC 31/3/2020 (ảnh chụp họp Zoom
 * nội các Anh lộ mã cuộc họp); COMDEX 20/4/1998 (Windows 98 màn hình xanh khi trình diễn); buổi ra mắt Tesla Cybertruck 21/11/2019.
 */
import { mau, saiDung, tuVung, Q, esc } from './_chung.mjs';
/* p0 — SINH TỰ ĐỘNG từ lab/ch6 bằng gen-p0.mjs (mẫu + output THẬT của kiem-noi.mjs, espeak-ng, nghe.py/faster-whisper). Đừng sửa tay. */
const EM = {"61-bt-dapan.txt":"Yesterday I finished LAB-318, the email template for approved reservations. I also reviewed Linh's pull request for LAB-319 and left two comments.\nToday I'm working on LAB-320, the calendar view. The weekly view works; the monthly view is next. I expect to open the PR on Monday.\nI'm blocked on the status colours. We're waiting for the client's design, Q-011. Minh, do you know when they'll answer? If not by Monday, I'll use the colours from the current UI.\nThat's it from me.\n","61-tot-nghe.txt":"Yesterday I finished LAB 312, the conflict check for reservations.\nThe pull request is merged, and Lynn tested it on staging this morning.\nToday I'm working on LAB 315, releasing a reservation when nobody picks up the item.\nI'm going to write the scheduled job first, then the tests.\nI expect to open the PR tomorrow afternoon.\nOne blocker. I'm waiting for Tanaka's answer to Q007, whether each lab can change the 30-minute limit.\nWithout it, I can't finish the settings screen.\nMin, could you raise it in today's client call? That's all from me.\n","61-tot.txt":"Yesterday I finished LAB-312, the conflict check for reservations. The pull request is merged, and Linh tested it on staging this morning.\nToday I'm working on LAB-315, releasing a reservation when nobody picks up the item. I'm going to write the scheduled job first, then the tests. I expect to open the PR tomorrow afternoon.\nOne blocker: I'm waiting for Tanaka-san's answer to Q-007, whether each lab can change the 30-minute limit. Without it, I can't finish the settings screen. Minh, could you raise it in today's client call?\nThat's all from me.\n","61-xau.txt":"Yesterday I fix the bug of reservation and do some task. Today I will continue to do the reservation, it is almost done, about 90%.\nI have some problems with the job but I will try to finish ASAP. I want to discuss about the time release with the customer because I am not sure what the customer want and the spec is not clear so maybe we need to ask again. No more.\n","62-bt-dapan.txt":"Thank you for joining. Today I'll show you the approval screen for lab managers. It takes about two minutes.\nThe data here is test data.\n\nFirst, I'll log in as a lab manager. As you can see, new requests are at the top, with the newest first.\nNow let's open one request. The manager sees the student, the item and the time slot. She can approve, or reject with a reason.\nI'll reject this one and type the reason: the oscilloscope is under repair. The student gets an email with that reason.\n\nYou also asked about exporting to Excel. That's not in this sprint. Let me check the effort with the team and get back to you by Friday.\nTo sum up, managers can now approve and reject with a reason. Next steps: we'll deploy this to your test server on Friday.\nAny questions?\n","62-tot.txt":"Good morning, everyone. Thank you for joining. Today I'll show you the reservation feature we finished in Sprint 6. By the end of this demo, you'll see a full reservation, from a student's request to the lab manager's approval.\nAll the data on the screen is test data. The names and student IDs are not real.\n\nFirst, let me log in as a student, Nguyen Van A. On the home page, there's a new button: Reserve equipment. I'll choose an oscilloscope in Lab 3, for Thursday, 9 to 11 a.m.\nAs you can see, the system checks the rules from the spec right away. A student can book at most 3 calendar days. If I choose Thursday to Monday, the Save button is disabled. The limit is shown here, in red.\nNow I'll pick a slot that another student already has. The calendar shows it in grey, and the message says who has priority. This is the rule we confirmed in Q-003: teachers win over students.\nI'll save a valid request. The status is Pending.\n\nNext, let's switch to the lab manager, Ms. Tran. She sees the new request at the top of her list, with the time it was created. She can approve or reject with a reason. I'll approve it.\nBack to the student: the status is now Approved, and an email has been sent. Here is the email in our test mailbox.\n\nFinally, the reminder. The system sends it 24 hours before the slot. To show it now, I'll run the job by hand. Here it is.\n\nTo sum up, the student can book, the rules from the spec are checked, and the lab manager can approve. Two things are not in this sprint: the no-show release, which is waiting for your answer to Q-007, and the monthly report.\nNext steps: we'll deploy this build to your test server on Friday, so your team can try it next week.\nThat's the end of the demo. Do you have any questions?\n","62-xau.txt":"OK so this is the reservation screen. You click here and choose the item. And then you choose the time. And it shows the list.\nHere is the approve screen. The manager can approve or reject. If you want export Excel, no problem, we will add it next sprint. OK that's all.\n","63-bien-ban-tot.md":"Subject: [LabFlow] Minutes: weekly client call, 25 Nov 2026\n\nDate: Wed 25 Nov 2026, 09:00-09:40 ICT (11:00-11:40 JST, 07:30-08:10 IST)\nAttendees: Tanaka Yui, Priya Nair (client); Minh, An (FPT Software)\n\n## Decisions\n1. Q-007: a reservation is released 30 minutes after the start of the slot if the item is not picked up. Each lab manager can change this from 15 to 120 minutes.\n2. UAT starts on 30 Nov 2026 on the client test server.\n3. Excel export is not in phase 1. Minh will send a change request with an estimate.\n\n## Action items\n- @An: update SRS 3.5.2 and LAB-315 with the Q-007 decision, by 26 Nov 2026\n- @Minh: send CR-004 (Excel export) with an estimate and two options, by 27 Nov 2026\n- @Priya: share the UAT test cases with the FPT team, by 27 Nov 2026 17:00 IST\n- @An: deploy build 6.2 to the client test server, by 27 Nov 2026 18:00 ICT\n\n## Open questions\n- Q-008 (reminders for teachers): Tanaka-san will answer by 1 Dec 2026.\n\nIf anything here is not correct, please reply by 26 Nov 2026.\n","63-bien-ban-xau.md":"Meeting 25/11\n\nTalked about Q-007 and the demo. Customer want export Excel, we will do.\n\nAction items\n- Update spec for Q-007\n- Priya send test case next week\n- An check the email thing\n- Deploy to test server Friday 6pm\n","63-hop.txt":"LabFlow weekly client call, Wed 25 Nov 2026, 09:00 ICT (transcript, shortened)\n\nMinh:   Good morning, Tanaka-san, good morning, Priya. Thank you for joining. We have three items today:\n        Q-007, feedback on the demo, and the UAT plan. We'll finish by 9:40 our time.\nTanaka: Good morning. About Q-007... we discussed it inside our team. Thirty minutes is OK. But some labs\n        want a longer time, so the lab manager should be able to change it.\nAn:     Sorry, Tanaka-san, could you say the range again? I didn't catch the numbers.\nTanaka: From fifteen to one hundred twenty minutes.\nAn:     Fifteen, one-five, to one hundred twenty. So the default is thirty, and each lab manager can\n        change it from 15 to 120 minutes. Is that correct?\nTanaka: Yes, that's correct.\nAn:     Thank you. I'll update SRS 3.5.2 and ticket LAB-315 by tomorrow.\nPriya:  One small thing from QA side. Kindly share the build before the UAT, na? My team needs two days\n        to prepare the test data.\nMinh:   Of course. When do you need it?\nPriya:  By Friday, our time, so we can start on Monday.\nAn:     Just to confirm, Priya: you mean Friday the 27th, before 6 p.m. Vietnam time, which is 4:30 p.m.\n        in India?\nPriya:  Yes, perfect. And I'll share our UAT test cases by Friday 5 p.m. IST.\nTanaka: Also... about the demo. It was very good. One request. Our managers would like to export the\n        reservation list to Excel. Can you add it in this phase?\nMinh:   Thank you for the feedback. I understand why the managers need it. My concern is the schedule:\n        UAT starts on Monday, and Excel export is not in the current scope. Could we handle it as a\n        change request? I'll send an estimate with two options by Friday.\nTanaka: Hmm... that may be a little difficult for this phase. We will consider it.\nMinh:   Understood. So for now, Excel export is not in phase 1, and you'll decide after you see the estimate.\n        Did I get that right?\nTanaka: Yes.\nMinh:   Let me sum up. Decisions: Q-007 is 30 minutes by default, 15 to 120 per lab. UAT starts on 30 November.\n        Excel export is out of phase 1 for now. Action items: An updates the SRS and LAB-315 by tomorrow.\n        I send CR-004 by Friday. Priya shares the UAT test cases by Friday 5 p.m. IST. An deploys build 6.2\n        by Friday 6 p.m. ICT. I'll send the minutes today. Anything I missed?\nTanaka: Q-008, the reminder for teachers. I will answer by December first.\nMinh:   Thank you. I'll add it. Thank you both, have a good day.\n","64-nghe-so.txt":"1. The fix is in LAB-315, not LAB-350.\n2. We need fifteen minutes, not fifty.\n3. UAT starts on the thirteenth, not the thirtieth.\n4. The call is at 9 a.m. Japan time, which is 7 a.m. in Hanoi.\n5. Priya will share the test cases by 4:30 p.m. India time.\n6. Please upgrade to version 2.10.3.\n7. The page returns a 404 for about 1,500 users.\n8. The average response time is 0.8 seconds.\n","65-a-dapan.txt":"On Friday I opened the pull request for LAB-315, the no-show release. Tuan left three comments, and I fixed two of them this morning.\nToday I'm going to fix the last comment, about the time zone of the job, and then start LAB-322, the settings screen. Q-007 is closed now, so I'm not blocked any more.\nOne risk: UAT starts today, so if Priya's team reports a bug, I'll fix that first and LAB-322 may move to Wednesday.\nNo blockers. That's all from me.\n"};
const OUT = {"61-bt-dapan":"61-bt-dapan.txt [standup]: 83 words, about 38 s at 130 words per minute\nno warnings\nexit=0\n","61-tot-nghe-kiem":"61-tot-nghe.txt [standup]: 95 words, 49 s = 116 words per minute\nno warnings\nexit=0\n","61-tot-nghe":"[   0.0s ->    6.9s] Yesterday I finished LAB 312, the conflict check for reservations.\n[   6.9s ->   12.4s] The pull request is merged, and Lynn tested it on staging this morning.\n[  12.4s ->   20.3s] Today I'm working on LAB 315, releasing a reservation when nobody picks up the item.\n[  20.3s ->   25.0s] I'm going to write the scheduled job first, then the tests.\n[  25.0s ->   29.0s] I expect to open the PR tomorrow afternoon.\n[  29.0s ->   38.8s] One blocker. I'm waiting for Tanaka's answer to Q007, whether each lab can change the 30-minute limit.\n[  38.8s ->   42.9s] Without it, I can't finish the settings screen.\n[  42.9s ->   48.6s] Min, could you raise it in today's client call? That's all from me.\n--- 95 words in 48.7 s = 117 words per minute\n","61-tot-sec":"49","61-tot":"61-tot.txt [standup]: 93 words, about 43 s at 130 words per minute\nno warnings\nexit=0\n","61-xau":"61-xau.txt [standup]: 74 words, about 34 s at 130 words per minute\noverall: no blocker part — say \"No blockers.\" if there are none\noverall: no ticket or PR number: name the work item\nline 1: \"almost done\": say what is done and what is left\nline 1: \"90%\": progress in percent means little; name the remaining step\nline 1: \"Yesterday I fix\": past simple after \"yesterday\" (fixed, finished, did…)\nline 2: \"I will try\": sounds like \"maybe not\"; say what you WILL do and when\nline 2: \"some problems\": vague; give a time or the exact issue\nline 2: \"ASAP\": vague; give a time or the exact issue\nline 2: \"discuss about\": drop the extra word\nline 2: sentence of 33 words: split it (one idea per breath)\nexit=1\n","62-bt-dapan":"62-bt-dapan.txt [demo]: 144 words, about 66 s at 130 words per minute\nno warnings\nexit=0\n","62-tot":"62-tot.txt [demo]: 333 words, about 154 s at 130 words per minute\nno warnings\nexit=0\n","62-xau":"62-xau.txt [demo]: 52 words, about 24 s at 130 words per minute\noverall: no opening that says what you will show\noverall: only 2 signpost word(s) (first, next, as you can see…): listeners get lost\noverall: no closing (next steps / questions)\nline 2: \"no problem\": a promise during a demo; say \"Let me check and get back to you\"\nline 2: \"we will add\": a promise during a demo; say \"Let me check and get back to you\"\nexit=1\n","63-bien-ban-tot":"63-bien-ban-tot.md [minutes]: 187 words\nno warnings\nexit=0\n","63-bien-ban-xau":"63-bien-ban-xau.md [minutes]: 39 words\noverall: no \"Decisions\" part\nline 6: action item without an owner (@name)\nline 6: action item without a date\nline 7: action item without an owner (@name)\nline 7: action item without a date\nline 8: action item without an owner (@name)\nline 8: action item without a date\nline 9: action item without an owner (@name)\nline 9: action item without a date\nline 9: time without a time zone\nexit=1\n","64-nghe-en-gb-x-rp":"[   0.0s ->    5.5s] 1. The fix is in LAB 315, not lab 350.\n[   5.5s ->    8.8s] 2. We need 15 minutes, not 50.\n[   8.8s ->   12.8s] 3. UAT starts on the 13th, not the 30th.\n[  12.8s ->   15.2s] 4. The call is at 9am.\n[  15.2s ->   18.3s] Japan time, which is 7am in Hanoi.\n[  18.3s ->   22.4s] 5. Priya will share the test cases by 4.30pm.\n[  22.4s ->   23.6s] India time.\n[  23.6s ->   28.0s] 6. Please upgrade to version 2.10.3.\n[  28.0s ->   33.8s] 7. The page returns a 404 for about 1,500 users.\n[  33.8s ->   37.8s] 8. The average response time is 0.8 seconds.\n--- 74 words in 37.9 s = 117 words per minute\n","64-nghe-en-us":"[   0.0s ->    9.5s] 1. The fix is in LAB 315, not lab 352. We need 15 minutes, not 53.\n[   9.5s ->   15.4s] UAT starts on the 13th, not the 30th. 4. The call is at 9am.\n[  15.4s ->   22.8s] Japan time, which is 7am in Hanoi. 5. Priya will share the test cases by 4.30pm.\n[  22.8s ->   28.5s] India time. 6. Please upgrade to version 2.10.3.\n[  28.5s ->   34.2s] 7. The page returns a 404 for about 1,500 users.\n[  34.2s ->   38.3s] 8. The average response time is 0.8 seconds.\n--- 72 words in 38.5 s = 112 words per minute\n","65-a-dapan":"65-a-dapan.txt [standup]: 84 words, about 39 s at 130 words per minute\nno warnings\nexit=0\n","am-version":"eSpeak NG text-to-speech: 1.52.0  Data at: /usr/share/espeak-ng-data\nPython 3.14.6 · faster-whisper 1.2.1\n","node-version":"v22.23.5\n","phat-am":"c1: I cleared the cache on the staging server.\nc2: I cleared the cache on the staging server.\nc3: The test suite takes 10 minutes.\nc4: The test suit takes 10 minutes.\nc5: Yesterday I fixed the bug and merged it.\nc6: Yesterday I pick the bug, and murr it.\nc7: We need 15 minutes.\nc8: We need 50 minutes.\nc9: The deadline is the 13th of November.\nc10: The deadline is the 30th of November.\nc11: Please check the width and height of the image.\nc12: Please check the width and height of the image.\n"};
const KIEMNOI = "#!/usr/bin/env node\n// kiem-noi.mjs — checks what you plan to SAY (a script) or what you DID say (a transcript).\n// Technical English at Work, chapter 6.\n// Usage: node kiem-noi.mjs <file.txt> [--mode=standup|demo|minutes] [--sec=N]\n//   --mode  standup (default): a 60-second update   demo: a 3-minute walkthrough\n//           minutes: meeting notes with a \"Decisions\" and an \"Action items\" part\n//   --sec   real length of your recording in seconds -> words per minute (without it: estimate at 130 wpm)\n// It only checks habits that are easy to detect. Passing it does NOT mean you spoke well: record and listen.\nimport { readFileSync } from 'node:fs';\nimport { basename } from 'node:path';\n\nconst args = process.argv.slice(2);\nconst file = args.find((a) => !a.startsWith('--'));\nconst opt = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];\nconst mode = opt('mode') || 'standup';\nconst sec = Number(opt('sec')) || 0;\nif (!file || !['standup', 'demo', 'minutes'].includes(mode)) {\n  console.error('usage: node kiem-noi.mjs <file.txt> [--mode=standup|demo|minutes] [--sec=N]'); process.exit(2);\n}\nconst text = readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\\r/g, '');\nconst lines = text.split('\\n');\nconst warn = [];\nconst w = (n, msg) => warn.push({ n, msg });\nconst lineOf = (i) => text.slice(0, i).split('\\n').length;\nconst find = (re, msg) => { for (const m of text.matchAll(re)) w(lineOf(m.index), msg(m[0])); };\n\n// 1. Length and speed\nconst words = (text.match(/[A-Za-z0-9][\\w'’.-]*/g) || []).length;\nconst LIMIT = { standup: [60, 'a stand-up turn'], demo: [210, 'a 3-minute demo'], minutes: [0, ''] }[mode];\nlet head = `${basename(file)} [${mode}]: ${words} words`;\nif (mode !== 'minutes') {\n  const s = sec || Math.round((words / 130) * 60);\n  head += sec ? `, ${sec} s = ${Math.round((words / sec) * 60)} words per minute` : `, about ${s} s at 130 words per minute`;\n  if (s > LIMIT[0]) w(0, `about ${s} s: too long for ${LIMIT[1]} (keep it under ${LIMIT[0]} s)`);\n  if (sec && (words / sec) * 60 > 160) w(0, 'faster than 160 words per minute: slow down for non-native listeners');\n  if (sec && (words / sec) * 60 < 90) w(0, 'slower than 90 words per minute: long pauses? practise the script until it flows');\n}\n\n// 2. Words that hide the real status (all modes)\nfind(/\\b(almost|nearly|basically) (done|finished|complete)\\b/gi, (s) => `\"${s}\": say what is done and what is left`);\nfind(/\\b\\d{1,3} ?(%|percent\\b)( done\\b| complete\\b)?/gi, (s) => `\"${s}\": progress in percent means little; name the remaining step`);\nfind(/\\bI(?:'ll| will) try\\b/gi, (s) => `\"${s}\": sounds like \"maybe not\"; say what you WILL do and when`);\nfind(/\\b(ASAP|as soon as possible|soon|some issues?|some problems?|a little bit)\\b/gi, (s) => `\"${s}\": vague; give a time or the exact issue`);\n\n// 3. Fillers (only in transcripts they matter; a script should not contain them)\nconst fillers = text.match(/\\b(u+h+|u+m+|e+r+m+|you know|I mean)\\b/gi) || [];\nif (fillers.length > 2) w(0, `${fillers.length} fillers (${[...new Set(fillers.map((f) => f.toLowerCase()))].join(', ')}): pause silently instead`);\n\n// 4. Vietnamese-English patterns that listeners notice\nfind(/\\byesterday,? I (fix|finish|do|make|write|test|check|review|deploy|update|add|create|work|merge|start)\\b/gi, (s) => `\"${s}\": past simple after \"yesterday\" (fixed, finished, did…)`);\nfind(/\\bI am (fix|finish|do|work|test|check|review|deploy|update|merge)\\b/gi, (s) => `\"${s}\": \"I'm fixing\" (now) or \"I fixed\" (done)`);\nfind(/\\b(discuss about|explain me|repeat again|return back|revert back)\\b/gi, (s) => `\"${s}\": drop the extra word`);\nfind(/\\bI don'?t understand what you (say|said|mean)\\b/gi, (s) => `\"${s}\": sounds like blame; try \"Sorry, I didn't catch that.\"`);\nfind(/\\bcan you speak (more )?slowly\\b/gi, (s) => `\"${s}\": add \"Could you…, please?\" — \"Could you speak a bit more slowly, please?\"`);\n\n// 5. Sentences too long to say in one breath (not for minutes: they are read, not spoken)\nif (mode !== 'minutes') text.split(/(?<=[.?!])\\s+/).forEach((s) => {\n  const n = (s.match(/[A-Za-z0-9][\\w'’.-]*/g) || []).length;\n  if (n > 25) w(lineOf(text.indexOf(s.slice(0, 30))), `sentence of ${n} words: split it (one idea per breath)`);\n});\n\n// 6. Structure of each mode\nconst has = (re) => re.test(text);\nif (mode === 'standup') {\n  if (!has(/\\b(finished|completed|merged|fixed|closed|shipped|yesterday|done with)\\b/i)) w(0, 'no \"done\" part (Yesterday I finished…)');\n  if (!has(/\\b(today|working on|I'?m going to|I'?ll|next)\\b/i)) w(0, 'no \"today\" part (Today I\\'m working on…)');\n  if (!has(/\\b(block(ed|er|ers|ing)?|waiting for|need help|stuck|no blockers|nothing blocking)\\b/i)) w(0, 'no blocker part — say \"No blockers.\" if there are none');\n  if (!has(/\\b[A-Z]{2,}[- ]?\\d+\\b/) && !has(/\\bticket\\b|\\bPR\\b|pull request/i)) w(0, 'no ticket or PR number: name the work item');\n}\nif (mode === 'demo') {\n  if (!has(/\\b(today I'?ll show|today I will show|goal of|by the end of|agenda|we'?ll look at)\\b/i)) w(0, 'no opening that says what you will show');\n  const sign = text.match(/\\b(first|next|now|then|as you can see|let me show|let's|finally)\\b/gi) || [];\n  if (sign.length < 3) w(0, `only ${sign.length} signpost word(s) (first, next, as you can see…): listeners get lost`);\n  if (!has(/\\b(next steps?|what'?s next|to sum up|to wrap up|questions\\??)\\b/i)) w(0, 'no closing (next steps / questions)');\n  find(/\\b(no problem|of course,? we can|we will add|we can do that|sure,? we will)\\b/gi, (s) => `\"${s}\": a promise during a demo; say \"Let me check and get back to you\"`);\n}\nif (mode === 'minutes') {\n  if (!has(/^#*\\s*decisions?\\b/im)) w(0, 'no \"Decisions\" part');\n  const i = lines.findIndex((l) => /^#*\\s*action items?\\b/i.test(l));\n  if (i < 0) w(0, 'no \"Action items\" part');\n  else {\n    let n = 0;\n    for (let k = i + 1; k < lines.length && !/^#/.test(lines[k]); k++) {\n      const l = lines[k];\n      if (!/^\\s*[-*]|\\d+\\./.test(l)) continue;\n      n++;\n      if (!/@\\w|owner:/i.test(l)) w(k + 1, 'action item without an owner (@name)');\n      if (!/\\b(\\d{4}-\\d{2}-\\d{2}|\\d{1,2} (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\\w*)\\b/i.test(l)) w(k + 1, 'action item without a date');\n      if (/\\b\\d{1,2}(:\\d{2})? ?(am|pm)\\b|\\b\\d{1,2}:\\d{2}\\b/i.test(l) && !/\\b(ICT|JST|IST|UTC|GMT|CET|CEST|EST|EDT|PST|PDT|AEST|AEDT)\\b/.test(l)) w(k + 1, 'time without a time zone');\n    }\n    if (!n) w(i + 1, '\"Action items\" part is empty');\n  }\n}\n\nwarn.sort((a, b) => a.n - b.n);\nconsole.log(head);\nif (!warn.length) console.log('no warnings');\nfor (const x of warn) console.log(`${x.n ? `line ${x.n}` : 'overall'}: ${x.msg}`);\nprocess.exit(warn.length ? 1 : 0);\n";
const NGHE = "#!/usr/bin/env python3\n# nghe.py — turns your recording into text with Whisper (faster-whisper), so you can SEE what a listener heard.\n# Technical English at Work, chapter 6.  Usage: python nghe.py <recording.wav|.m4a|.mp3> [model]\n#   model: small.en (default, ~470 MB, English only) | base.en (faster) | medium (better, slower)\n# Install once: pip install faster-whisper   (first run downloads the model, then works offline)\nimport sys\nfrom faster_whisper import WhisperModel\n\nif len(sys.argv) < 2:\n    sys.exit(\"usage: python nghe.py <recording> [model]\")\npath = sys.argv[1]\nname = sys.argv[2] if len(sys.argv) > 2 else \"small.en\"\nmodel = WhisperModel(name, device=\"cpu\", compute_type=\"int8\", cpu_threads=4)\n# temperature=0 + no previous text: the same file gives the same transcript every run\nsegments, info = model.transcribe(path, language=\"en\", beam_size=5, temperature=0,\n                                  condition_on_previous_text=False, vad_filter=False)\nwords = []\nfor s in segments:\n    print(f\"[{s.start:6.1f}s -> {s.end:6.1f}s] {s.text.strip()}\")\n    words += s.text.split()\nprint(f\"--- {len(words)} words in {info.duration:.1f} s = {len(words) / info.duration * 60:.0f} words per minute\")\n";

const lienKet = (href, ico, tieuDe, phu) => `
<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>
</a>`;
const E = (f, nhan) => mau(EM[f], nhan);
const RUN = (key, cmd, nhan) => mau(`$ ${cmd}\n` + OUT[key].replace(/exit=(\d+)\n?$/, '$ echo $?\n$1'), nhan);
const NOTE_RUN = (en) => en ? 'Real output — kiem-noi.mjs (lesson 6.5) inside node:22-alpine, Node 22.23.5, 24 Nov 2026.' : 'Output THẬT — kiem-noi.mjs (bài 6.5) chạy trong node:22-alpine, Node 22.23.5, 24/11/2026.';
const NOTE_AM = (en) => en ? 'Real output — eSpeak NG 1.52.0 reads the sentence, faster-whisper 1.2.1 (model small.en, CPU) writes what it heard. 24 Nov 2026.' : 'Output THẬT — eSpeak NG 1.52.0 đọc câu, faster-whisper 1.2.1 (mô hình small.en, CPU) ghi lại điều nó nghe được. 24/11/2026.';
/** Dòng cN của out/phat-am.txt (Whisper nghe câu thứ N). */
const PA = (n) => (OUT['phat-am'].split('\n').find((l) => l.startsWith(`c${n}:`)) || '').replace(/^c\d+: /, '');
/** Bảng: câu nói ra (đúng / kiểu người Việt) → Whisper nghe thành. */
const bangNghe = (hang, en) => `
<table>
<thead><tr><th>${en ? 'What the speaker meant' : 'Người nói định nói'}</th><th>${en ? 'How it was said' : 'Cách nói'}</th><th>${en ? 'What Whisper wrote' : 'Whisper ghi lại'}</th></tr></thead>
<tbody>
${hang.map(([y, cach, n]) => `<tr><td>${esc(y)}</td><td>${cach}</td><td><code>${esc(PA(n))}</code></td></tr>`).join('\n')}
</tbody>
</table>`;

/* ═════════════ 6.1 — Standup 60 giây ═════════════ */
const L61 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 6 · Speaking' : 'Chương 6 · Nói'}</span>
<h2>${en ? '6.1 — A 60-second stand-up: yesterday, today, blockers' : '6.1 — Standup 60 giây: hôm qua, hôm nay, vướng gì'}</h2>
<p class="lead">${en
    ? 'The stand-up is the meeting where you will speak English most often: every working day, in front of your team and sometimes the client. It is also the easiest one to get right, because it always has the same shape. In this lesson you build a 60-second update you can say without reading, learn how to say ticket numbers, dates and names so they survive a bad microphone, and check your script with a small tool and with speech recognition.'
    : 'Standup là buổi họp bạn nói tiếng Anh nhiều nhất: mỗi ngày làm việc, trước cả đội và đôi khi có cả khách. Nó cũng là buổi dễ làm tốt nhất, vì lúc nào cũng cùng một khuôn. Bài này giúp bạn dựng một lượt cập nhật 60 giây nói được mà không cần đọc, học cách nói mã ticket, ngày và tên sao cho qua được cả micro kém, rồi kiểm kịch bản bằng một công cụ nhỏ và bằng máy nhận dạng giọng nói.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Think of nurses handing over a ward at the end of a shift. Nobody tells the story of their day. Each patient gets three things in a fixed order — what was done, what is planned, what to watch — with exact numbers and names. The next nurse can act immediately. A good stand-up is a handover: short, same order every day, exact.'
    : 'Hãy nghĩ tới các y tá giao ca cuối ngày. Không ai kể lể cả ngày của mình. Mỗi bệnh nhân được nói ba ý theo thứ tự cố định — đã làm gì, sắp làm gì, cần để ý gì — với con số và tên chính xác. Người ca sau làm tiếp được ngay. Standup tốt là một lần giao ca: ngắn, mỗi ngày cùng thứ tự, chính xác.'}</p>

<h3>${en ? 'What a stand-up is (and is not)' : 'Standup là gì (và không phải là gì)'}</h3>
<ul>
<li>${en
    ? 'The Scrum Guide (2020 edition) calls it the <strong>Daily Scrum</strong>: a 15-minute event for the developers, held at the same time and place every day, to inspect progress toward the Sprint Goal and adapt the plan. With 6–8 people, that is about <strong>one minute each</strong>.'
    : 'Scrum Guide (bản 2020) gọi nó là <strong>Daily Scrum</strong>: sự kiện 15 phút của các developer, cùng giờ cùng chỗ mỗi ngày, để xem tiến độ so với Sprint Goal và chỉnh kế hoạch. Đội 6–8 người thì mỗi người khoảng <strong>một phút</strong>.'}</li>
<li>${en
    ? 'The famous three questions ("What did I do yesterday? What will I do today? Do I see any impediment?") were an <em>example</em> in the 2017 guide and were removed in 2020: teams may use any structure. In practice almost every team — including outsourcing projects at FPT Software — still uses them, because they are easy to follow in a second language.'
    : 'Ba câu hỏi nổi tiếng ("Hôm qua tôi làm gì? Hôm nay làm gì? Có gì cản trở?") chỉ là <em>ví dụ</em> trong bản 2017 và đã bị bỏ ở bản 2020: đội được chọn khuôn nào cũng được. Thực tế gần như đội nào — kể cả dự án outsourcing ở FPT Software — vẫn dùng ba câu này, vì nói bằng ngôn ngữ thứ hai rất dễ theo.'}</li>
<li>${en
    ? 'It is <strong>not</strong> a status report to the manager, and <strong>not</strong> the place to solve problems. If a topic needs discussion, you name it and move it after the meeting: "Can we take this offline?"'
    : 'Nó <strong>không phải</strong> buổi báo cáo cho quản lý, và <strong>không phải</strong> chỗ giải quyết vấn đề. Chủ đề cần bàn thì nêu tên rồi dời ra sau buổi họp: "Can we take this offline?"'}</li>
<li>${en
    ? 'On outsourcing projects the stand-up is often in English because the client’s team joins (or a BrSE — bridge system engineer — reports a summary to them). Sometimes the team writes it in Slack/Teams instead: the same three parts, as bullets (lesson 4.5).'
    : 'Ở dự án outsourcing, standup hay nói tiếng Anh vì đội của khách cùng tham gia (hoặc BrSE — kỹ sư cầu nối — tóm tắt lại cho khách). Có đội viết standup vào Slack/Teams thay vì nói: vẫn ba phần ấy, dạng gạch đầu dòng (bài 4.5).'}</li>
</ul>

<h3>${en ? 'Situation: An’s first stand-up in English' : 'Tình huống: standup tiếng Anh đầu tiên của An'}</h3>
<p>${en
    ? 'LabFlow 2.0, Sprint 6, equipment reservation (the spec from chapter 5). An worked on the conflict check yesterday and starts the no-show release today, but he does not know if each lab can change the 30-minute limit (question Q-007 is still open). He translated his thoughts from Vietnamese and said:'
    : 'LabFlow 2.0, Sprint 6, chức năng đặt trước thiết bị (spec ở chương 5). Hôm qua An làm phần kiểm tra trùng lịch, hôm nay bắt đầu phần tự huỷ khi sinh viên không đến lấy, nhưng chưa biết mỗi phòng lab có được đổi mốc 30 phút không (câu Q-007 còn mở). An dịch ý nghĩ từ tiếng Việt và nói:'}</p>
${E('61-xau.txt', en ? 'What An said (written down from the recording).' : 'Lời An nói (chép lại từ bản ghi âm).')}
<p>${en
    ? 'Nobody in the call could act on this. Which bug? What is the "time release"? Is he blocked or not? Here is the same text through the checker you will use in lesson 6.5:'
    : 'Không ai trong cuộc gọi làm gì được với lượt nói này. Lỗi nào? "time release" là gì? Anh ấy có bị chặn không? Đây là cùng đoạn đó qua công cụ kiểm bạn sẽ dùng ở bài 6.5:'}</p>
${RUN('61-xau', 'node kiem-noi.mjs 61-xau.txt', NOTE_RUN(en))}
<p>${en
    ? 'Ten warnings in 34 seconds. None is about advanced grammar: every one is a habit, and habits can be replaced by fixed phrases.'
    : 'Mười cảnh báo trong 34 giây. Không cảnh báo nào về ngữ pháp cao siêu: cái nào cũng là thói quen, và thói quen thay được bằng mẫu câu cố định.'}</p>

<h3>${en ? 'The three parts and their tenses' : 'Ba phần và thì của từng phần'}</h3>
<p>${en
    ? 'Vietnamese verbs do not change with time, so the tense is where most mistakes come from. In a stand-up you only need three tenses — one per part:'
    : 'Động từ tiếng Việt không đổi theo thời gian, nên lỗi thì là lỗi phổ biến nhất. Trong standup bạn chỉ cần ba thì — mỗi phần một thì:'}</p>
<table>
<thead><tr><th>${en ? 'Part' : 'Phần'}</th><th>${en ? 'Tense' : 'Thì'}</th><th>${en ? 'Phrases' : 'Mẫu câu'}</th></tr></thead>
<tbody>
<tr><td><strong>Done</strong><br>${en ? '(yesterday)' : '(hôm qua)'}</td><td>${en ? 'past simple: finished, fixed, merged, reviewed' : 'quá khứ đơn: finished, fixed, merged, reviewed'}</td><td><em>Yesterday I finished LAB-312.</em><br><em>I fixed the date bug in LAB-309; the PR is merged.</em><br><em>I reviewed Linh’s PR for LAB-319.</em></td></tr>
<tr><td><strong>Doing</strong><br>${en ? '(today)' : '(hôm nay)'}</td><td>${en ? 'present continuous + going to / expect to' : 'hiện tại tiếp diễn + going to / expect to'}</td><td><em>Today I’m working on LAB-315.</em><br><em>I’m going to write the tests first.</em><br><em>I expect to open the PR tomorrow afternoon.</em></td></tr>
<tr><td><strong>Blockers</strong></td><td>${en ? 'present: I’m blocked by / waiting for / I need' : 'hiện tại: I’m blocked by / waiting for / I need'}</td><td><em>I’m blocked by Q-007.</em><br><em>I’m waiting for the test server credentials from Minh.</em><br><em>No blockers.</em></td></tr>
</tbody>
</table>
<p>${en
    ? 'Two details make a big difference. Always say the <strong>ticket number</strong> plus a few words of what it is ("LAB-312, the conflict check"), because people remember features, not numbers. And a blocker always has a <strong>who</strong>: "I need X from Y" lets someone act; "I have some problems" does not.'
    : 'Hai chi tiết tạo khác biệt lớn. Luôn nói <strong>mã ticket</strong> kèm vài chữ nó là gì ("LAB-312, the conflict check"), vì người nghe nhớ tính năng, không nhớ số. Và vướng mắc luôn có <strong>ai</strong>: "I need X from Y" thì có người xử lý được; "I have some problems" thì không.'}</p>

<h3>${en ? 'The fixed version' : 'Bản đã sửa'}</h3>
${E('61-tot.txt', en ? 'The same update, rebuilt with the three parts (93 words).' : 'Cùng nội dung, dựng lại theo ba phần (93 từ).')}
${RUN('61-tot', 'node kiem-noi.mjs 61-tot.txt', NOTE_RUN(en))}
<p>${en
    ? 'Notice what changed: every sentence has one idea; the work items have numbers and names; the blocker names the question (Q-007), what it blocks (the settings screen) and who can help (Minh, who talks to the client). "That’s all from me" tells the next person it is their turn — much warmer than "No more."'
    : 'Để ý những gì đã đổi: mỗi câu một ý; việc nào cũng có số và tên; vướng mắc nêu đúng câu hỏi (Q-007), nó chặn gì (màn hình cài đặt) và ai giúp được (Minh, người làm việc với khách). "That’s all from me" báo cho người kế tiếp tới lượt — ấm hơn nhiều so với "No more."'}</p>

<h3>${en ? 'Saying numbers, dates and names so they survive a bad microphone' : 'Nói số, ngày và tên sao cho qua được cả micro kém'}</h3>
<p>${en
    ? 'Online calls cut the ends of words, and the ends of words are exactly where Vietnamese speakers are weakest (Vietnamese syllables do not end in clusters like <em>-xt</em>, <em>-nth</em>, <em>-ed</em>). To see what a listener hears, we let a machine read sentences — once correctly, once the way many Vietnamese speakers say them — and let Whisper, a speech recognition model, write down what it heard:'
    : 'Cuộc gọi trực tuyến hay cắt mất đuôi từ, mà đuôi từ lại chính là chỗ người Việt yếu nhất (âm tiết tiếng Việt không kết thúc bằng cụm phụ âm như <em>-xt</em>, <em>-nth</em>, <em>-ed</em>). Để thấy người nghe nghe được gì, ta cho máy đọc từng câu — một lần đúng, một lần theo cách nhiều người Việt hay nói — rồi để Whisper, một mô hình nhận dạng giọng nói, ghi lại điều nó nghe:'}</p>
<p class="note-ct">${NOTE_AM(en)}</p>
${bangNghe([
    ['Yesterday I fixed the bug and merged it.', en ? 'correct' : 'đúng', 5],
    ['Yesterday I fixed the bug and merged it.', en ? 'final consonants dropped: "fic", "mơ"' : 'nuốt phụ âm cuối: "fic", "mơ"', 6],
    ['We need fifteen minutes.', en ? 'correct: fif-TEEN, clear final n' : 'đúng: fif-TEEN, rõ âm n cuối', 7],
    ['We need fifteen minutes.', en ? 'stress on the first syllable, weak n' : 'nhấn âm đầu, n cuối yếu', 8],
    ['The deadline is the thirteenth of November.', en ? 'correct' : 'đúng', 9],
    ['The deadline is the thirteenth of November.', en ? '"-nth" dropped' : 'mất "-nth"', 10],
  ], en)}
<p>${en
    ? 'A merge became "murr", 15 minutes became 50, the 13th became the 30th. In a stand-up that is a wrong estimate or a wrong deadline. Three habits protect you:'
    : '"merged" thành "murr", 15 phút thành 50 phút, ngày 13 thành ngày 30. Trong standup đó là một ước lượng sai hoặc một hạn chót sai. Ba thói quen giúp bạn an toàn:'}</p>
<ol>
<li>${en
    ? '<strong>Ticket numbers digit by digit</strong>: LAB-312 = "lab three-one-two" (not "three hundred twelve"). Zero is "zero" or "oh". Q-007 = "Q zero-zero-seven".'
    : '<strong>Mã ticket đọc từng chữ số</strong>: LAB-312 = "lab three-one-two" (không nói "three hundred twelve"). Số 0 đọc "zero" hoặc "oh". Q-007 = "Q zero-zero-seven".'}</li>
<li>${en
    ? '<strong>Risky numbers twice</strong>: "fifteen — one-five — minutes", "the thirteenth, one-three". Teens are stressed on the second syllable (fif-TEEN), tens on the first (FIF-ty).'
    : '<strong>Số dễ nhầm nói hai lần</strong>: "fifteen — one-five — minutes", "the thirteenth, one-three". Các số -teen nhấn âm sau (fif-TEEN), các số -ty nhấn âm đầu (FIF-ty).'}</li>
<li>${en
    ? '<strong>Names with a role</strong>: Whisper wrote "Linh" as "Lynn" and "Minh" as "Min" (see lesson 6.5). Your foreign colleagues will too. Say "Linh, our tester" the first time, and type unusual names in the chat.'
    : '<strong>Tên kèm vai trò</strong>: Whisper ghi "Linh" thành "Lynn", "Minh" thành "Min" (xem bài 6.5). Đồng nghiệp nước ngoài của bạn cũng vậy. Lần đầu hãy nói "Linh, our tester", và gõ tên lạ vào khung chat.'}</li>
</ol>

<h3>${en ? 'Common mistakes' : 'Lỗi hay gặp'}</h3>
${saiDung([
    ['Yesterday I fix the login bug.', 'Yesterday I fixed the login bug (LAB-309).', en ? 'Past simple for finished work; plus the ticket.' : 'Việc đã xong dùng quá khứ đơn; kèm mã ticket.'],
    ['It is almost done, about 90%.', 'The API is done; the tests are left. I expect to open the PR tomorrow.', en ? 'The last 10% often takes 50% of the time. Name the remaining step and a time.' : '10% cuối thường ngốn 50% thời gian. Nêu bước còn lại và thời điểm.'],
    ['I will try to finish ASAP.', 'I’ll finish it by Thursday noon.', en ? '"Try" sounds like "maybe not"; "ASAP" is not a time.' : '"Try" nghe như "chắc không xong"; "ASAP" không phải thời điểm.'],
    ['Same as yesterday.', 'Still on LAB-315. The job works; today I’m writing the tests.', en ? 'Even with no new ticket, say what moved.' : 'Không có ticket mới cũng nói được phần đã nhích lên.'],
    ['I have some problems with the job.', 'I’m blocked: the scheduler doesn’t run on staging. Tuan, can you help me after the stand-up?', en ? 'A blocker has a cause and a who.' : 'Vướng mắc phải có nguyên nhân và có người.'],
    ['I want to discuss about the time release…', 'I have a question about Q-007. Can we take it offline after the stand-up?', en ? '"discuss" has no "about"; and discussions go after the meeting.' : '"discuss" không đi với "about"; và bàn luận để sau buổi họp.'],
    ['No more.', 'That’s all from me. / That’s it for me.', en ? '"No more" sounds like "stop it".' : '"No more" nghe như "thôi đừng nữa".'],
  ], en)}

<h3>${en ? 'When the news is bad' : 'Khi tin không vui'}</h3>
<p>${en
    ? 'The stand-up is the cheapest place to say you are late. Saying it on day 3 of a 10-day sprint is information; saying it on day 9 is a surprise. Use the same pattern as the delay email in lesson 4.3 — fact, reason, new plan, help needed — in four short sentences:'
    : 'Standup là chỗ rẻ nhất để nói mình trễ. Nói ở ngày 3 của sprint 10 ngày là thông tin; nói ở ngày 9 là bất ngờ. Dùng đúng khuôn của email báo trễ ở bài 4.3 — sự việc, lý do, kế hoạch mới, cần giúp gì — trong bốn câu ngắn:'}</p>
${mau(`
I didn't finish LAB-315 yesterday.          (fact)
The scheduler library doesn't support our   (reason)
time zone setting.
I'm going to try the cron option today      (new plan)
and I'll update you at 3 p.m.
If it doesn't work, I may need half a day   (help / risk)
from Tuan.
`, en ? 'Bad news in four sentences.' : 'Tin không vui trong bốn câu.')}
<p>${en
    ? 'And when someone starts a long technical discussion during the stand-up — even you — use one of these: "Can we take this offline?", "Let’s park this and talk after the stand-up.", "I’ll set up a quick call with Tuan after this."'
    : 'Khi có người mở một cuộc bàn kỹ thuật dài giữa standup — kể cả chính bạn — dùng một trong các câu: "Can we take this offline?", "Let’s park this and talk after the stand-up.", "I’ll set up a quick call with Tuan after this."'}</p>

<h3>${en ? 'Speaking it, not reading it' : 'Nói, không đọc'}</h3>
<ul>
<li>${en ? 'Write the script once in full, then reduce it to <strong>keywords</strong> on a sticky note: "312 conflict — merged / 315 no-show — job, tests, PR tmr / Q-007 Minh". Speak from the keywords.' : 'Viết kịch bản đầy đủ một lần, rồi rút lại thành <strong>từ khoá</strong> trên giấy nhớ: "312 conflict — merged / 315 no-show — job, tests, PR tmr / Q-007 Minh". Nói theo từ khoá.'}</li>
<li>${en ? 'Speed: about 110–140 words per minute is comfortable for non-native listeners. Faster is not more professional; clear is.' : 'Tốc độ: khoảng 110–140 từ mỗi phút là dễ nghe với người không bản ngữ. Nói nhanh hơn không chuyên nghiệp hơn; nói rõ mới chuyên nghiệp.'}</li>
<li>${en ? 'Pause silently instead of "uh… uhm". A one-second pause sounds confident; a filler sounds lost.' : 'Ngừng im lặng thay cho "ờ… ừm". Ngừng một giây nghe tự tin; tiếng đệm nghe như lạc ý.'}</li>
<li>${en ? 'Record yourself once a week (lesson 6.5 shows how to turn the recording into text and check it).' : 'Mỗi tuần ghi âm mình một lần (bài 6.5 hướng dẫn biến bản ghi thành chữ rồi kiểm).'}</li>
</ul>

<h3>${en ? 'At work: the client is in the call' : 'Khi đi làm: khách có mặt trong cuộc gọi'}</h3>
<p>${en
    ? 'Some clients join the daily call (common with US start-ups; Japanese clients more often receive a written daily report through the BrSE). With the client listening, three rules: no internal blame ("Tuan broke staging"), no Vietnamese side-talk on the open microphone, and no new promises — if the client asks "Can you also add…?", answer "Let me check with Minh and come back to you today." (lesson 5.3, scope creep).'
    : 'Có khách tham gia cuộc gọi hằng ngày (hay gặp ở start-up Mỹ; khách Nhật thường nhận báo cáo ngày bằng văn bản qua BrSE). Khi khách đang nghe, ba luật: không đổ lỗi nội bộ ("Tuan làm hỏng staging"), không nói chuyện riêng bằng tiếng Việt khi micro đang mở, và không hứa thêm — khách hỏi "Can you also add…?" thì trả lời "Let me check with Minh and come back to you today." (bài 5.3, phạm vi phình to).'}</p>

<h3>${en ? 'Practice: your stand-up for Friday' : 'Luyện tập: standup của bạn cho sáng thứ Sáu'}</h3>
<p>${en
    ? 'Your board on Friday morning: LAB-318 (email template for approved reservations) moved to Done yesterday. You reviewed Linh’s PR for LAB-319 and left two comments. LAB-320 (calendar view) is in progress: the weekly view works, the monthly view is not started. You cannot choose the status colours because the client has not sent the design (Q-011). Write the stand-up (under 100 words), check it with <code>kiem-noi.mjs</code>, then say it aloud from keywords and record it. Target: under 60 seconds.'
    : 'Bảng của bạn sáng thứ Sáu: LAB-318 (mẫu email khi đặt trước được duyệt) đã sang Done hôm qua. Bạn review PR của Linh cho LAB-319, để lại hai góp ý. LAB-320 (giao diện lịch) đang làm: lịch tuần chạy rồi, lịch tháng chưa bắt đầu. Bạn chưa chọn được màu trạng thái vì khách chưa gửi thiết kế (Q-011). Viết standup (dưới 100 từ), kiểm bằng <code>kiem-noi.mjs</code>, rồi nói thành tiếng theo từ khoá và ghi âm. Mục tiêu: dưới 60 giây.'}</p>
<details><summary>${en ? 'Model answer (real checker output)' : 'Đáp án gợi ý (kèm output thật của công cụ)'}</summary>
${E('61-bt-dapan.txt')}
${RUN('61-bt-dapan', 'node kiem-noi.mjs 61-bt-dapan.txt', NOTE_RUN(en))}
<p>${en
    ? 'Check yourself: (1) three parts in order; (2) LAB-318, LAB-319, LAB-320 and Q-011 named; (3) the blocker has a who (Minh) and a fallback (current UI colours on Monday); (4) "the weekly view works; the monthly view is next" instead of "60%".'
    : 'Tự kiểm: (1) đủ ba phần, đúng thứ tự; (2) có nêu LAB-318, LAB-319, LAB-320 và Q-011; (3) vướng mắc có người (Minh) và phương án dự phòng (thứ Hai dùng màu của giao diện hiện tại); (4) "the weekly view works; the monthly view is next" thay cho "60%".'}</p>
</details>

${tuVung([
    ['Yesterday I finished …', en ? 'done part' : 'phần đã xong', 'Yesterday I finished LAB-312, the conflict check.'],
    ['Today I’m working on …', en ? 'doing part' : 'phần đang làm', 'Today I’m working on LAB-315.'],
    ['I expect to … by …', en ? 'a forecast with a time' : 'dự báo có mốc giờ', 'I expect to open the PR by tomorrow noon.'],
    ['I’m blocked by / waiting for …', en ? 'blocker with a cause' : 'vướng mắc có nguyên nhân', 'I’m waiting for the test account from Minh.'],
    ['No blockers.', en ? 'nothing in your way' : 'không vướng gì', 'Today I’m on LAB-320. No blockers.'],
    ['Can we take this offline?', en ? 'discuss after the meeting' : 'bàn sau buổi họp', 'Good point. Can we take this offline?'],
    ['That’s all from me.', en ? 'end your turn' : 'kết thúc lượt', 'That’s all from me. Over to you, Linh.'],
  ], en)}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-6-1-standup', '⏱️', en ? 'Agile &amp; Teamwork 6.1 — Standups that take 10 minutes' : 'Agile &amp; Làm việc nhóm 6.1 — Standup 10 phút', en ? 'The same meeting from the process side (Vietnamese).' : 'Cùng buổi họp này nhìn từ phía quy trình (tiếng Việt).')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>Daily Scrum · stand-up · Sprint Goal · blocker / impediment · ${en ? 'take it offline' : 'take it offline (bàn riêng sau)'} · BrSE · ${en ? 'words per minute' : 'số từ mỗi phút (words per minute)'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'About one minute per person, three parts, same order every day.' : 'Khoảng một phút mỗi người, ba phần, mỗi ngày cùng thứ tự.'}</li>
<li>${en ? 'One tense per part: past simple (done), present continuous (doing), "blocked by / waiting for" (blockers).' : 'Mỗi phần một thì: quá khứ đơn (đã xong), hiện tại tiếp diễn (đang làm), "blocked by / waiting for" (vướng).'}</li>
<li>${en ? 'Ticket number + a few words; a blocker has a cause and a who; no percentages, no "try", no "ASAP".' : 'Mã ticket + vài chữ mô tả; vướng mắc có nguyên nhân và có người; không phần trăm, không "try", không "ASAP".'}</li>
<li>${en ? 'Say risky numbers twice (fifteen — one-five) and give names a role.' : 'Số dễ nhầm nói hai lần (fifteen — one-five), tên người kèm vai trò.'}</li>
<li>${en ? 'Bad news early, in four sentences; long discussions offline.' : 'Tin không vui nói sớm, gói trong bốn câu; bàn dài thì để sau.'}</li>
</ul>
</div>`;

/* ═════════════ 6.2 — Demo cho khách ═════════════ */
const L62 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 6 · Speaking' : 'Chương 6 · Nói'}</span>
<h2>${en ? '6.2 — Demoing to a client: script, narration, handling questions' : '6.2 — Demo cho khách: kịch bản, lời dẫn, xử lý câu hỏi'}</h2>
<p class="lead">${en
    ? 'At the end of each sprint someone shows the client what was built. As a junior you will be asked to demo "your" feature sooner than you think — often in your first month. A demo is not a tour of the screens: it is a short story that proves a requirement works. This lesson gives you the six-part structure, the narration phrases, a preparation checklist, what to say when the demo breaks, and how to answer questions without promising things you cannot deliver.'
    : 'Cuối mỗi sprint có người trình diễn cho khách xem những gì đã làm. Là người mới, bạn sẽ được giao demo tính năng "của mình" sớm hơn bạn nghĩ — thường ngay tháng đầu. Demo không phải dẫn khách đi một vòng các màn hình: nó là một câu chuyện ngắn chứng minh một yêu cầu đã chạy. Bài này cho bạn khuôn sáu phần, mẫu lời dẫn, danh sách chuẩn bị, câu cần nói khi demo hỏng, và cách trả lời câu hỏi mà không hứa điều mình không làm được.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'Watch a cooking show. Before the camera rolls, every ingredient is already measured in small bowls. The chef starts with "Today we’re making…", says each step while doing it ("now I add the garlic — see how it turns golden"), and when time is short, pulls a finished dish out of the oven. A demo works the same way: data prepared, goal said first, narration while acting, and a backup ready.'
    : 'Xem một chương trình dạy nấu ăn. Trước khi quay, mọi nguyên liệu đã cân sẵn trong bát nhỏ. Đầu bếp mở bằng "Hôm nay chúng ta làm món…", vừa làm vừa nói ("giờ cho tỏi vào — thấy nó vàng lên chưa"), và khi hết giờ thì lấy món đã làm sẵn trong lò ra. Demo cũng vậy: dữ liệu chuẩn bị trước, nói mục tiêu trước, vừa thao tác vừa dẫn, và có phương án dự phòng.'}</p>

<h3>${en ? 'Situation: the Sprint 6 review' : 'Tình huống: buổi review Sprint 6'}</h3>
<p>${en
    ? 'Sprint 6 delivered the reservation flow. Tanaka-san (client IT) and Priya (client QA lead, Bangalore) join a Teams call; Minh, the team leader, asks An to demo. An’s first plan was to "just click through it":'
    : 'Sprint 6 hoàn thành luồng đặt trước thiết bị. Tanaka-san (IT phía khách) và Priya (trưởng nhóm QA phía khách, ở Bangalore) vào cuộc gọi Teams; Minh, trưởng nhóm, giao An demo. Kế hoạch đầu của An là "cứ bấm qua một lượt":'}</p>
${E('62-xau.txt', en ? 'An’s first script.' : 'Kịch bản đầu của An.')}
${RUN('62-xau', 'node kiem-noi.mjs 62-xau.txt --mode=demo', NOTE_RUN(en))}
<p>${en
    ? 'The client hears a list of clicks. They do not know what to look for, which requirement this proves, or when it ends — and in the last line An has just promised a new feature for free (lesson 5.3).'
    : 'Khách chỉ nghe một loạt cú bấm. Họ không biết cần nhìn vào đâu, cái này chứng minh yêu cầu nào, khi nào thì xong — và ở dòng cuối An vừa hứa miễn phí một tính năng mới (bài 5.3).'}</p>

<h3>${en ? 'Six parts of a demo' : 'Sáu phần của một buổi demo'}</h3>
<table>
<thead><tr><th>${en ? 'Part' : 'Phần'}</th><th>${en ? 'Purpose' : 'Để làm gì'}</th><th>${en ? 'Say' : 'Câu mẫu'}</th></tr></thead>
<tbody>
<tr><td>1. ${en ? 'Opening' : 'Mở đầu'}</td><td>${en ? 'Goal and length, so they know what to watch' : 'Mục tiêu và thời lượng, để họ biết cần xem gì'}</td><td><em>Today I’ll show you the reservation feature from Sprint 6. It takes about five minutes.</em></td></tr>
<tr><td>2. ${en ? 'Context' : 'Bối cảnh'}</td><td>${en ? 'Link to the requirement; say the data is fake' : 'Nối với yêu cầu; nói rõ dữ liệu là giả'}</td><td><em>This covers stories LAB-310 to LAB-315. All the data here is test data.</em></td></tr>
<tr><td>3. ${en ? 'Story' : 'Câu chuyện'}</td><td>${en ? 'A real user doing a real task' : 'Một người dùng thật làm một việc thật'}</td><td><em>Let me log in as a student who needs an oscilloscope on Thursday.</em></td></tr>
<tr><td>4. ${en ? 'Walkthrough' : 'Dẫn từng bước'}</td><td>${en ? 'Do + say + point to the result' : 'Làm + nói + chỉ vào kết quả'}</td><td><em>I’ll click Save. As you can see, the status is Pending.</em></td></tr>
<tr><td>5. ${en ? 'Wrap-up' : 'Tổng kết'}</td><td>${en ? 'What is done, what is not, next steps' : 'Đã xong gì, chưa xong gì, bước tiếp'}</td><td><em>To sum up… Two things are not in this sprint… Next steps: we’ll deploy on Friday.</em></td></tr>
<tr><td>6. ${en ? 'Questions' : 'Hỏi đáp'}</td><td>${en ? 'Invite, clarify, answer or park' : 'Mời hỏi, làm rõ, trả lời hoặc ghi lại'}</td><td><em>Do you have any questions?</em></td></tr>
</tbody>
</table>
${E('62-tot.txt', en ? 'An’s second script (333 words, about 2.5 minutes of speaking + clicks ≈ 4 minutes).' : 'Kịch bản lần hai của An (333 từ, khoảng 2,5 phút nói + thao tác ≈ 4 phút).')}
${RUN('62-tot', 'node kiem-noi.mjs 62-tot.txt --mode=demo', NOTE_RUN(en))}
<p>${en
    ? 'Look at three choices in this script. It shows the <strong>rules</strong> (3-day limit, teacher priority), not only the happy path, because rules are what the client wrote in the spec. It names the Q&amp;A decision (Q-003), so the client sees their answer became software. And it says honestly what is <strong>not</strong> done, before anyone asks.'
    : 'Để ý ba lựa chọn trong kịch bản. Nó cho xem các <strong>luật</strong> (giới hạn 3 ngày, ưu tiên giảng viên), không chỉ luồng suôn sẻ, vì luật là thứ khách viết trong spec. Nó nêu quyết định trong Q&amp;A list (Q-003), để khách thấy câu trả lời của họ đã thành phần mềm. Và nó nói thật phần <strong>chưa</strong> làm, trước khi có ai hỏi.'}</p>

<h3>${en ? 'Narration: do, say, point' : 'Lời dẫn: làm, nói, chỉ'}</h3>
<p>${en
    ? 'Your listeners see your screen through a slow video stream, maybe in their second language. Narrate every action <em>before or while</em> you do it, then point at the result. Use "I’ll" (I will) for the action and present simple for what the system does:'
    : 'Người nghe nhìn màn hình của bạn qua luồng video chậm, có khi bằng ngôn ngữ thứ hai của họ. Hãy nói mỗi thao tác <em>trước hoặc trong khi</em> làm, rồi chỉ vào kết quả. Dùng "I’ll" (I will) cho thao tác của bạn và hiện tại đơn cho việc hệ thống làm:'}</p>
${saiDung([
    ['(clicks silently for 20 seconds)', 'I’ll choose Lab 3 and Thursday, 9 to 11.', en ? 'Silence + fast clicks = the client is lost.' : 'Im lặng + bấm nhanh = khách lạc.'],
    ['You click here and here.', 'I’ll click Reserve. Now the system checks the rules.', en ? '"You click" sounds like an instruction to them.' : '"You click" nghe như đang bảo khách bấm.'],
    ['It shows the list.', 'As you can see, the new request is at the top of the list.', en ? 'Point to where they should look.' : 'Chỉ đúng chỗ họ cần nhìn.'],
    ['This uses React Query and a cron job.', 'The reminder goes out 24 hours before the slot.', en ? 'Talk about user value, not your stack — unless they ask.' : 'Nói về giá trị cho người dùng, không kể công nghệ — trừ khi họ hỏi.'],
    ['Wait… wait… OK.', 'This takes a few seconds; it’s sending the email.', en ? 'Fill the waiting time with an explanation.' : 'Lấp khoảng chờ bằng một lời giải thích.'],
  ], en)}
<p>${en
    ? 'Useful signposts: <em>First… / Now… / Next, let’s switch to… / As you can see… / Notice that… / Let me zoom in. / Here is… / Finally…</em>. The checker counts them; three or more keeps the listener with you.'
    : 'Các từ chỉ đường hữu ích: <em>First… / Now… / Next, let’s switch to… / As you can see… / Notice that… / Let me zoom in. / Here is… / Finally…</em>. Công cụ kiểm có đếm; từ ba từ trở lên thì người nghe theo kịp bạn.'}</p>

<h3>${en ? 'Before the demo: checklist' : 'Trước buổi demo: danh sách kiểm'}</h3>
<ol>
<li>${en ? 'Rehearse aloud twice with a timer, once in front of a teammate.' : 'Tập nói thành tiếng hai lần có bấm giờ, một lần trước mặt đồng đội.'}</li>
<li>${en ? 'Prepare <strong>test data</strong> that tells the story (a student, a teacher, a conflicting slot). Never real names, emails or student IDs.' : 'Chuẩn bị <strong>dữ liệu thử</strong> kể được câu chuyện (một sinh viên, một giảng viên, một khung giờ trùng). Không bao giờ dùng tên, email hay mã sinh viên thật.'}</li>
<li>${en ? 'Log in to every account before the call; keep each role in its own browser profile.' : 'Đăng nhập sẵn mọi tài khoản trước cuộc gọi; mỗi vai một hồ sơ trình duyệt.'}</li>
<li>${en ? 'Record a <strong>backup video</strong> of the whole flow the morning of the demo.' : 'Quay sẵn một <strong>video dự phòng</strong> cả luồng vào sáng hôm demo.'}</li>
<li>${en ? 'Turn on Do Not Disturb; close Slack, email and other tabs; share <strong>one window</strong>, not the whole screen.' : 'Bật chế độ Không làm phiền; đóng Slack, email và các tab khác; chia sẻ <strong>một cửa sổ</strong>, không chia sẻ cả màn hình.'}</li>
<li>${en ? 'Zoom the browser to 125–150% so text is readable on a laptop at the other end.' : 'Phóng trình duyệt 125–150% để màn hình laptop đầu bên kia đọc được chữ.'}</li>
<li>${en ? 'Write down the questions you expect, with answers (or "let me check").' : 'Ghi trước các câu hỏi dự đoán, kèm câu trả lời (hoặc "let me check").'}</li>
</ol>

<h3>🛡️ ${en ? 'Hacker corner: what your screen leaks' : 'Góc hacker: màn hình của bạn để lộ gì'}</h3>
<p>${en
    ? 'On 31 March 2020 the UK Prime Minister posted a photo of the first "digital Cabinet" on Twitter. The screenshot showed the Zoom meeting ID and the usernames of the participants (BBC, 31 Mar 2020). Nothing bad was reported, but it became the classic example of a screen leaking more than intended — that same spring, "Zoombombing" by strangers who found meeting IDs was widespread. In a client demo the usual leaks are smaller and more embarrassing: a chat notification from a teammate, a <code>.env</code> file open in another tab, a terminal with a token, real customer data in the database you demo on, or another client’s name in the bookmarks bar. Use test data, share one window, and hide the bookmarks bar. If something leaks, say it at once — "I’m sorry, that was an internal message; I’ll stop sharing for a second" — and tell your team leader after the call: a leaked secret must be rotated.'
    : 'Ngày 31/3/2020 Thủ tướng Anh đăng lên Twitter ảnh "phiên họp nội các trực tuyến" đầu tiên. Ảnh chụp màn hình hiện mã cuộc họp Zoom và tên tài khoản của người tham gia (BBC, 31/3/2020). Không có hậu quả nào được ghi nhận, nhưng nó thành ví dụ kinh điển về màn hình lộ nhiều hơn dự định — đúng mùa xuân đó, nạn "Zoombombing" (người lạ tìm được mã họp rồi vào phá) lan rộng. Trong buổi demo cho khách, thứ hay lộ nhỏ hơn mà ngượng hơn: thông báo chat của đồng đội, tệp <code>.env</code> đang mở ở tab khác, terminal có token, dữ liệu khách thật trong cơ sở dữ liệu đang demo, hay tên khách hàng khác trên thanh dấu trang. Dùng dữ liệu thử, chia sẻ một cửa sổ, ẩn thanh dấu trang. Lỡ lộ thì nói ngay — "I’m sorry, that was an internal message; I’ll stop sharing for a second" — và báo trưởng nhóm sau cuộc gọi: bí mật đã lộ phải được thay mới.'}</p>

<h3>${en ? 'When the demo breaks' : 'Khi demo hỏng giữa chừng'}</h3>
<p>${en
    ? 'It happens to everyone. At COMDEX on 20 April 1998, a Windows 98 demo on stage crashed to a blue screen in front of Bill Gates; he answered, "That must be why we’re not shipping Windows 98 yet," and the audience laughed. At the Cybertruck launch on 21 November 2019, the "unbreakable" windows cracked when a metal ball was thrown at them; Elon Musk said "well, it didn’t go through" and continued. Both kept going. You do not need a joke — you need three calm sentences:'
    : 'Ai cũng gặp. Tại COMDEX ngày 20/4/1998, một buổi trình diễn Windows 98 trên sân khấu đổ màn hình xanh ngay trước mặt Bill Gates; ông đáp "That must be why we’re not shipping Windows 98 yet" (hẳn đó là lý do chúng tôi chưa phát hành Windows 98) và cả hội trường cười. Ở buổi ra mắt Cybertruck ngày 21/11/2019, cửa kính "không thể vỡ" bị nứt khi bị ném quả cầu kim loại; Elon Musk nói "well, it didn’t go through" (ít ra nó không xuyên qua) rồi làm tiếp. Cả hai đều không dừng. Bạn không cần đùa — bạn cần ba câu bình tĩnh:'}</p>
${mau(`
1. Name it:     "That's not what should happen."
2. Move on:     "Let me show you the recording from this morning instead."
                / "Let me try once more with another account."
3. Follow up:   "I'll find the cause and send you a short update by tomorrow, 5 p.m. your time."
`, en ? 'Three sentences when something fails on screen.' : 'Ba câu khi màn hình báo lỗi.')}
<p>${en
    ? 'Do not apologise five times, do not debug live for minutes, and do not blame ("the backend team changed the API"). After the call, the follow-up is an incident note in miniature (lesson 4.4).'
    : 'Đừng xin lỗi năm lần, đừng sửa lỗi trực tiếp hàng phút, đừng đổ lỗi ("đội backend đổi API"). Sau cuộc gọi, lời hẹn "follow up" chính là một bản báo cáo sự cố thu nhỏ (bài 4.4).'}</p>

<h3>${en ? 'Handling questions' : 'Xử lý câu hỏi'}</h3>
<table>
<thead><tr><th>${en ? 'Kind of question' : 'Loại câu hỏi'}</th><th>${en ? 'What to do' : 'Cách xử lý'}</th><th>${en ? 'Say' : 'Câu mẫu'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'You understand and know' : 'Hiểu và biết câu trả lời'}</td><td>${en ? 'Answer in one or two sentences; show it if you can' : 'Trả lời một hai câu; cho xem được thì cho xem'}</td><td><em>Yes — let me show you. Here is the limit for teachers: seven days.</em></td></tr>
<tr><td>${en ? 'You are not sure what they mean' : 'Chưa chắc họ hỏi gì'}</td><td>${en ? 'Paraphrase before answering' : 'Nhắc lại ý trước khi trả lời'}</td><td><em>Just to make sure I understand: you’re asking whether a teacher can cancel a student’s reservation?</em></td></tr>
<tr><td>${en ? 'You do not know' : 'Không biết'}</td><td>${en ? 'Say so; promise a time, not an answer' : 'Nói thật; hẹn thời điểm, không hứa đáp án'}</td><td><em>Good question. I’m not sure; let me check with the team and get back to you by Thursday.</em></td></tr>
<tr><td>${en ? 'A new request' : 'Một yêu cầu mới'}</td><td>${en ? 'Thank, note, route to a change request (5.3)' : 'Cảm ơn, ghi lại, đưa về change request (5.3)'}</td><td><em>Thank you, that makes sense. It’s not in the current scope, so Minh will send you an estimate.</em></td></tr>
<tr><td>${en ? 'Criticism' : 'Lời chê'}</td><td>${en ? 'Thank, acknowledge, do not defend at length' : 'Cảm ơn, ghi nhận, không cãi dài'}</td><td><em>Thanks for pointing that out. You’re right that the message is hard to see; we’ll make it clearer.</em></td></tr>
</tbody>
</table>
<p>${en
    ? 'Japanese clients often ask few questions during the call and send them in writing later; silence is not agreement. Ask concrete checking questions — "Is this behaviour what you expected for teachers?" — and say "If you think of anything later, please add it to the Q&amp;A list." American clients may interrupt in the middle; that is normal. Answer briefly, then "Let me continue, and we’ll come back to this at the end."'
    : 'Khách Nhật thường hỏi ít trong cuộc gọi rồi gửi câu hỏi bằng văn bản sau; im lặng không có nghĩa là đồng ý. Hãy hỏi câu kiểm cụ thể — "Is this behaviour what you expected for teachers?" — và nói "If you think of anything later, please add it to the Q&amp;A list." Khách Mỹ có thể ngắt lời giữa chừng; chuyện đó bình thường. Trả lời ngắn rồi "Let me continue, and we’ll come back to this at the end."'}</p>

<h3>${en ? 'Practice: rescue An’s first script' : 'Luyện tập: cứu kịch bản đầu của An'}</h3>
<p>${en
    ? 'Rewrite <code>62-xau.txt</code> as a two-minute demo of the <strong>approval screen</strong> only: opening, test-data note, at least three signposts, a rejection with a reason, a correct answer to the Excel export request (no promise), wrap-up and next steps. Run the checker, then rehearse it aloud with a timer while clicking through any web page.'
    : 'Viết lại <code>62-xau.txt</code> thành một buổi demo hai phút chỉ về <strong>màn hình duyệt</strong>: mở đầu, câu nói về dữ liệu thử, ít nhất ba từ chỉ đường, một lần từ chối kèm lý do, câu trả lời đúng cho yêu cầu xuất Excel (không hứa), tổng kết và bước tiếp. Chạy công cụ kiểm, rồi tập nói thành tiếng có bấm giờ trong lúc bấm qua một trang web bất kỳ.'}</p>
<details><summary>${en ? 'Model answer (real checker output)' : 'Đáp án gợi ý (kèm output thật của công cụ)'}</summary>
${E('62-bt-dapan.txt')}
${RUN('62-bt-dapan', 'node kiem-noi.mjs 62-bt-dapan.txt --mode=demo', NOTE_RUN(en))}
<p>${en
    ? '144 words ≈ 66 seconds of speaking; with clicks and waiting it fills two minutes. The Excel question is answered with "not in this sprint" + "let me check the effort" + a day — no "no problem".'
    : '144 từ ≈ 66 giây nói; cộng thời gian bấm và chờ là đủ hai phút. Câu hỏi xuất Excel được trả lời bằng "not in this sprint" + "let me check the effort" + một ngày cụ thể — không có "no problem".'}</p>
</details>

${tuVung([
    ['Today I’ll show you …', en ? 'opening a demo' : 'mở đầu demo', 'Today I’ll show you the approval screen.'],
    ['All the data here is test data.', en ? 'protect yourself and the client' : 'bảo vệ mình và khách', 'All the data here is test data; the names are not real.'],
    ['As you can see, …', en ? 'point to a result' : 'chỉ vào kết quả', 'As you can see, the status is now Approved.'],
    ['Let me switch to …', en ? 'change user or screen' : 'đổi vai hoặc màn hình', 'Let me switch to the lab manager’s account.'],
    ['That’s not in the current scope.', en ? 'decline without saying no' : 'từ chối mà không nói "không"', 'That’s not in the current scope, but we can estimate it.'],
    ['Let me check and get back to you by …', en ? 'when you don’t know' : 'khi không biết', 'Let me check and get back to you by Thursday.'],
    ['To sum up, …', en ? 'start the wrap-up' : 'bắt đầu tổng kết', 'To sum up, students can now book and managers can approve.'],
  ], en)}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-11-5-lab', '🎭', en ? 'Agile &amp; Teamwork 11.5 — Role-play a Japanese client review and a US client demo' : 'Agile &amp; Làm việc nhóm 11.5 — Đóng vai họp review với khách Nhật và demo cho khách Mỹ', en ? 'Process and culture behind the demo (Vietnamese).' : 'Quy trình và văn hoá phía sau buổi demo (tiếng Việt).')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>Sprint Review · demo · ${en ? 'test data' : 'dữ liệu thử (test data)'} · signposting · ${en ? 'backup recording' : 'video dự phòng'} · scope · ${en ? 'follow up' : 'follow up (phản hồi sau)'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'A demo is a story that proves a requirement: opening, context, story, walkthrough, wrap-up, questions.' : 'Demo là một câu chuyện chứng minh yêu cầu: mở đầu, bối cảnh, câu chuyện, dẫn từng bước, tổng kết, hỏi đáp.'}</li>
<li>${en ? 'Narrate every action, point at the result, show the rules — not only the happy path.' : 'Nói mỗi thao tác, chỉ vào kết quả, cho xem các luật — không chỉ luồng suôn sẻ.'}</li>
<li>${en ? 'Test data only, one window shared, notifications off, backup video ready.' : 'Chỉ dữ liệu thử, chia sẻ một cửa sổ, tắt thông báo, có sẵn video dự phòng.'}</li>
<li>${en ? 'When it breaks: name it, move on, follow up with a time.' : 'Khi hỏng: gọi tên, chuyển hướng, hẹn giờ phản hồi.'}</li>
<li>${en ? 'Questions: paraphrase, answer briefly, or "let me check and get back to you by…"; never promise scope.' : 'Câu hỏi: nhắc lại ý, trả lời ngắn, hoặc "let me check and get back to you by…"; không bao giờ hứa thêm phạm vi.'}</li>
</ul>
</div>`;

/* ═════════════ 6.3 — Họp ═════════════ */
const L63 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 6 · Speaking' : 'Chương 6 · Nói'}</span>
<h2>${en ? '6.3 — Meetings: asking to repeat, confirming, disagreeing politely, closing with action items' : '6.3 — Họp: xin nhắc lại, xác nhận, không đồng ý lịch sự, chốt việc'}</h2>
<p class="lead">${en
    ? 'In a client meeting you do not need to speak much. You need to do four things well: ask again when you did not catch something, confirm what you heard, disagree without damaging the relationship, and leave with clear action items. Silence is the expensive mistake — a nod in the meeting becomes a wrong feature two weeks later. This lesson walks through one real-style client call line by line, gives you the phrases for each move, and ends with meeting minutes that a checker can verify.'
    : 'Trong buổi họp với khách bạn không cần nói nhiều. Bạn cần làm tốt bốn việc: hỏi lại khi không nghe kịp, xác nhận điều mình nghe, không đồng ý mà không làm hỏng quan hệ, và ra về với danh sách việc rõ ràng. Im lặng là lỗi đắt nhất — một cái gật đầu trong họp thành một tính năng sai hai tuần sau. Bài này đi qua từng dòng một cuộc gọi với khách, cho bạn mẫu câu cho từng nước đi, và kết thúc bằng biên bản họp kiểm được bằng công cụ.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'In a noisy restaurant, a good waiter repeats your order before leaving: "So that’s two beef phở, one without onion, and an iced tea?" It takes five seconds and saves a wrong dish. Confirming in a meeting is the same move: you repeat the important part — numbers, dates, who does what — and let the other side say "yes, correct".'
    : 'Ở quán ăn ồn ào, người phục vụ giỏi nhắc lại món trước khi đi: "Vậy là hai phở bò, một bát không hành, một trà đá nhé?" Mất năm giây mà tránh được một món sai. Xác nhận trong họp là đúng nước đi đó: bạn nhắc lại phần quan trọng — con số, ngày, ai làm gì — để bên kia nói "đúng rồi".'}</p>

<h3>${en ? 'Situation: the weekly client call' : 'Tình huống: cuộc gọi hằng tuần với khách'}</h3>
<p>${en
    ? 'Wednesday 25 November, 9:00 in Hanoi = 11:00 in Tokyo = 7:30 in Bangalore. Tanaka-san (client IT, Tokyo), Priya (client QA, Bangalore), Minh (FPT team leader) and An. Three items: the answer to Q-007, feedback on the demo, the UAT plan (user acceptance testing — the client tests before go-live). Read the whole transcript once; then we take it apart.'
    : 'Thứ Tư 25/11, 9:00 giờ Hà Nội = 11:00 Tokyo = 7:30 Bangalore. Tanaka-san (IT phía khách, Tokyo), Priya (QA phía khách, Bangalore), Minh (trưởng nhóm FPT) và An. Ba nội dung: câu trả lời cho Q-007, nhận xét về buổi demo, kế hoạch UAT (user acceptance testing — khách tự kiểm thử trước khi đưa vào dùng). Đọc trọn bản ghi một lượt; sau đó ta mổ xẻ từng phần.'}</p>
${E('63-hop.txt', en ? 'Transcript, shortened. The people and company are fictional; the phrases are the ones you will hear.' : 'Bản ghi, đã rút gọn. Người và công ty là hư cấu; các câu nói là thứ bạn sẽ nghe thật.')}

<h3>${en ? 'Move 1 — Ask again (never pretend)' : 'Nước 1 — Hỏi lại (không bao giờ giả vờ hiểu)'}</h3>
<p>${en
    ? 'An did not catch the numbers and said so immediately: "Sorry, Tanaka-san, could you say the range again? I didn’t catch the numbers." That sentence is polite because it blames the hearing ("I didn’t catch"), not the speaker ("you speak unclearly"), and it says <em>what</em> to repeat. Choose by the problem:'
    : 'An không nghe kịp các con số và nói ngay: "Sorry, Tanaka-san, could you say the range again? I didn’t catch the numbers." Câu đó lịch sự vì nó đổ cho việc nghe ("I didn’t catch"), không đổ cho người nói ("you speak unclearly"), và nó nói rõ cần nhắc lại <em>phần nào</em>. Chọn câu theo vấn đề:'}</p>
<table>
<thead><tr><th>${en ? 'Problem' : 'Vấn đề'}</th><th>${en ? 'Say' : 'Câu mẫu'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Did not hear a part' : 'Không nghe được một phần'}</td><td><em>Sorry, I didn’t catch the last part. Could you say it again?</em></td></tr>
<tr><td>${en ? 'Too fast' : 'Quá nhanh'}</td><td><em>Could you speak a bit more slowly, please? My connection is a little unstable.</em></td></tr>
<tr><td>${en ? 'A word you do not know' : 'Một từ không biết'}</td><td><em>Sorry, what does "go-live freeze" mean here?</em></td></tr>
<tr><td>${en ? 'A name or term' : 'Tên riêng hay thuật ngữ'}</td><td><em>Could you spell that for me? / Could you type it in the chat?</em></td></tr>
<tr><td>${en ? 'Lost completely' : 'Mất hoàn toàn'}</td><td><em>I’m sorry, I’m not sure I followed. Could you explain the main point again?</em></td></tr>
</tbody>
</table>
${saiDung([
    ['What?', 'Sorry, could you say that again?', en ? '"What?" sounds rude in a meeting.' : '"What?" nghe cộc trong buổi họp.'],
    ['Can you repeat again?', 'Could you repeat that, please?', en ? '"repeat" already means "again".' : '"repeat" đã có nghĩa "lại".'],
    ['I don’t understand what you say.', 'Sorry, I didn’t catch that.', en ? 'Blames the speaker; and "say" should be "said/mean".' : 'Đổ cho người nói; và "say" phải là "said/mean".'],
    ['(nod and say "yes" to everything)', 'Just to confirm, you mean …?', en ? '"Yes" means "I agree" to the client, not "I hear you".' : 'Với khách, "yes" là "tôi đồng ý", không phải "tôi đang nghe".'],
  ], en)}

<h3>${en ? 'Move 2 — Confirm what you heard' : 'Nước 2 — Xác nhận điều đã nghe'}</h3>
<p>${en
    ? 'After the answer, An repeated it in his own words and ended with a yes/no question: "So the default is thirty, and each lab manager can change it from 15 to 120 minutes. Is that correct?" Later he did the same with a time: "you mean Friday the 27th, before 6 p.m. Vietnam time, which is 4:30 p.m. in India?" Three patterns cover almost everything:'
    : 'Nghe xong, An nhắc lại bằng lời của mình và kết bằng câu hỏi có/không: "So the default is thirty, and each lab manager can change it from 15 to 120 minutes. Is that correct?" Sau đó An làm y vậy với giờ hẹn: "you mean Friday the 27th, before 6 p.m. Vietnam time, which is 4:30 p.m. in India?" Ba khuôn dùng được cho gần như mọi trường hợp:'}</p>
<ul>
<li><em>So what you’re saying is … Is that right?</em> — ${en ? 'paraphrase an idea' : 'nhắc lại một ý'}</li>
<li><em>Just to confirm: … by … , … time?</em> — ${en ? 'a date, a time, an owner' : 'ngày, giờ, người làm'}</li>
<li><em>Fifteen — one-five — to one hundred twenty.</em> — ${en ? 'a risky number, said twice (lesson 6.1: Whisper heard a badly stressed "fifteen" as 50)' : 'số dễ nhầm, nói hai lần (bài 6.1: Whisper nghe "fifteen" nhấn sai thành 50)'}</li>
</ul>
<p>${en
    ? 'Times always carry a time zone (lesson 4.5). Converting the time for the other person, as An did, is a small kindness that clients notice.'
    : 'Giờ luôn đi kèm múi giờ (bài 4.5). Tự đổi giờ sang múi giờ của người kia như An làm là một cử chỉ nhỏ mà khách để ý.'}</p>

<h3>${en ? 'Move 3 — Get a turn, and disagree politely' : 'Nước 3 — Xin lượt nói, và không đồng ý một cách lịch sự'}</h3>
<p>${en
    ? 'Getting a turn: <em>"Sorry to interrupt — may I add something?"</em>, <em>"Could I come in here?"</em>, <em>"Going back to what Priya said…"</em>. In a video call, the "raise hand" button or a short line in the chat ("I have a question about Q-008 when you have a moment") works too.'
    : 'Xin lượt nói: <em>"Sorry to interrupt — may I add something?"</em>, <em>"Could I come in here?"</em>, <em>"Going back to what Priya said…"</em>. Trong cuộc gọi video, nút "giơ tay" hoặc một dòng ngắn trong chat ("I have a question about Q-008 when you have a moment") cũng được.'}</p>
<p>${en
    ? 'When Tanaka-san asked for Excel export in this phase, Minh did not say "No" and did not say "Yes". He used the four-step pattern that works with every culture:'
    : 'Khi Tanaka-san xin thêm xuất Excel trong giai đoạn này, Minh không nói "No" mà cũng không nói "Yes". Anh dùng khuôn bốn bước dùng được với mọi nền văn hoá:'}</p>
${mau(`
1. Acknowledge:  "Thank you for the feedback. I understand why the managers need it."
2. Concern:      "My concern is the schedule:"
3. Reason:       "UAT starts on Monday, and Excel export is not in the current scope."
4. Proposal:     "Could we handle it as a change request? I'll send an estimate with two options by Friday."
`, en ? 'Disagree = acknowledge + concern + reason + proposal.' : 'Không đồng ý = ghi nhận + mối lo + lý do + đề xuất.')}
${saiDung([
    ['No, it’s wrong.', 'I see it a bit differently. In the spec, 3.2.2 says three days.', en ? 'Disagree with the idea, with evidence, not with the person.' : 'Phản đối ý, có bằng chứng, không phản đối người.'],
    ['It’s impossible.', 'It’s possible, but not by Friday. We could do X by Friday and Y next sprint.', en ? '"Impossible" closes the door; a trade-off opens one.' : '"Impossible" đóng cửa; một phương án đánh đổi mở cửa.'],
    ['You are wrong.', 'I might be missing something, but my understanding is …', en ? 'Leaves room for both sides to be right.' : 'Chừa đường cho cả hai bên cùng đúng.'],
    ['OK, we will do it. (to avoid conflict)', 'Let me check the impact and come back to you tomorrow.', en ? 'A "yes" you cannot keep is worse than a delayed answer.' : 'Một chữ "yes" không giữ được còn tệ hơn trả lời chậm.'],
  ], en)}

<h3>${en ? 'Reading an indirect "no"' : 'Đọc ra lời "không" gián tiếp'}</h3>
<p>${en
    ? '"That may be a little difficult for this phase. We will consider it." In Japanese business culture, <em>muzukashii</em> ("difficult") and <em>kentō shimasu</em> ("we will consider it") are often a polite way to say no, or at least "not now". Minh did not push. He stated the result neutrally and asked for confirmation: "So for now, Excel export is not in phase 1, and you’ll decide after you see the estimate. Did I get that right?" Then it went into the minutes, where the client can correct it in writing. Agile &amp; Teamwork 11.1 explains the culture behind this; here, the rule is simply: <strong>never leave an indirect answer unconfirmed</strong>.'
    : '"That may be a little difficult for this phase. We will consider it." Trong văn hoá công sở Nhật, <em>muzukashii</em> ("khó") và <em>kentō shimasu</em> ("chúng tôi sẽ cân nhắc") thường là cách lịch sự để nói không, hoặc ít nhất là "chưa phải lúc này". Minh không ép. Anh nói lại kết quả một cách trung tính và xin xác nhận: "So for now, Excel export is not in phase 1, and you’ll decide after you see the estimate. Did I get that right?" Rồi điều đó vào biên bản, nơi khách có thể sửa bằng văn bản. Agile &amp; Làm việc nhóm 11.1 giải thích văn hoá phía sau; ở đây luật chỉ một: <strong>không để câu trả lời gián tiếp nào trôi qua mà chưa xác nhận</strong>.'}</p>

<h3>${en ? 'Move 4 — Close with decisions and action items' : 'Nước 4 — Chốt bằng quyết định và việc cần làm'}</h3>
<p>${en
    ? 'Five minutes before the end, someone must say "Let me sum up." It is usually the team leader — but if nobody does it, you can: "Before we finish, may I sum up the action items?" A summary has two lists: <strong>decisions</strong> (what is now true) and <strong>action items</strong> (who does what by when). Then: "Anything I missed?" and "I’ll send the minutes today."'
    : 'Năm phút trước khi hết giờ, phải có người nói "Let me sum up." Thường là trưởng nhóm — nhưng nếu không ai nói, bạn nói được: "Before we finish, may I sum up the action items?" Lời tổng kết có hai danh sách: <strong>quyết định</strong> (điều gì giờ đã chốt) và <strong>việc cần làm</strong> (ai làm gì, hạn nào). Rồi: "Anything I missed?" và "I’ll send the minutes today."'}</p>

<h3>${en ? 'Meeting minutes the same day' : 'Biên bản họp ngay trong ngày'}</h3>
<p>${en
    ? 'The spoken summary disappears; the minutes stay. A first attempt by a new member:'
    : 'Lời tổng kết bằng miệng sẽ trôi mất; biên bản thì ở lại. Bản đầu của một thành viên mới:'}</p>
${E('63-bien-ban-xau.md', en ? 'First minutes.' : 'Biên bản bản đầu.')}
${RUN('63-bien-ban-xau', 'node kiem-noi.mjs 63-bien-ban-xau.md --mode=minutes', NOTE_RUN(en))}
<p>${en
    ? 'Nobody owns anything, nothing has a date, "Friday 6pm" has no time zone, and "Customer want export Excel, we will do" turns a declined request into a promise — the opposite of what was agreed. Good minutes have five parts: a header (date, time with time zones, attendees), <strong>Decisions</strong>, <strong>Action items</strong> (@owner, what, by when, time zone), <strong>Open questions</strong>, and one line asking for corrections by a date. You will write them in the practice below.'
    : 'Không việc nào có người nhận, không việc nào có ngày, "Friday 6pm" không có múi giờ, còn "Customer want export Excel, we will do" biến một yêu cầu đã bị hoãn thành lời hứa — ngược hẳn điều đã thống nhất. Biên bản tốt có năm phần: phần đầu (ngày, giờ kèm múi giờ, người dự), <strong>Decisions</strong>, <strong>Action items</strong> (@người nhận, việc gì, hạn nào, múi giờ), <strong>Open questions</strong>, và một dòng đề nghị sửa trước một ngày cụ thể. Bạn sẽ tự viết ở phần luyện tập dưới đây.'}</p>

<h3>🛡️ ${en ? 'Hacker corner: the CFO on the video call was fake' : 'Góc hacker: vị giám đốc tài chính trong cuộc gọi video là giả'}</h3>
<p>${en
    ? 'In January 2024 an employee in the Hong Kong office of the engineering firm Arup joined a video call with people who looked and sounded like the company’s UK-based CFO and several colleagues. All of them were deepfakes. Following "instructions" from the call, the employee made 15 transfers totalling HK$200 million (about US$25.6 million). Hong Kong police described the case in February 2024; Arup confirmed it was the victim in May 2024 (CNN, 4 Feb and 16 May 2024). An earlier case: in 2019 the CEO of a UK energy company transferred €220,000 after a phone call with a voice that imitated his German boss (The Wall Street Journal, 30 Aug 2019). The lesson for meetings: <strong>a face and a voice are no longer proof</strong>. If anyone in a call — even "the client" or "the director" — asks for money, passwords, access tokens, a production database dump or an urgent exception to the process, say "Sure, I’ll confirm through our usual channel first," and check by calling back on a number or channel you already knew. Also: ask before recording ("Is it OK if I record this call for the minutes?") — voices and faces are personal data under data-protection law in Vietnam and in your client’s country.'
    : 'Tháng 1/2024 một nhân viên văn phòng Hồng Kông của công ty kỹ thuật Arup vào cuộc gọi video với những người trông và nghe giống hệt giám đốc tài chính (CFO) ở Anh và vài đồng nghiệp. Tất cả đều là deepfake. Làm theo "chỉ đạo" trong cuộc gọi, nhân viên đó chuyển 15 lần, tổng 200 triệu đô la Hồng Kông (khoảng 25,6 triệu USD). Cảnh sát Hồng Kông công bố vụ việc tháng 2/2024; Arup xác nhận là nạn nhân vào tháng 5/2024 (CNN, 4/2 và 16/5/2024). Một vụ sớm hơn: năm 2019, CEO một công ty năng lượng ở Anh chuyển 220.000 euro sau cuộc điện thoại với giọng nói giả giọng sếp người Đức của ông (The Wall Street Journal, 30/8/2019). Bài học cho các buổi họp: <strong>khuôn mặt và giọng nói không còn là bằng chứng</strong>. Nếu ai trong cuộc gọi — kể cả "khách hàng" hay "giám đốc" — đòi tiền, mật khẩu, token truy cập, bản sao cơ sở dữ liệu production hay một ngoại lệ gấp với quy trình, hãy nói "Sure, I’ll confirm through our usual channel first," rồi kiểm bằng cách gọi lại qua số điện thoại hoặc kênh bạn đã biết từ trước. Thêm nữa: hỏi trước khi ghi âm ("Is it OK if I record this call for the minutes?") — giọng nói và khuôn mặt là dữ liệu cá nhân theo luật bảo vệ dữ liệu ở Việt Nam và ở nước của khách.'}</p>

<h3>${en ? 'At work: your role as a junior in a client meeting' : 'Khi đi làm: vai của người mới trong buổi họp với khách'}</h3>
<ul>
<li>${en ? 'Read the agenda the day before and prepare three sentences: what you will report, one question, the numbers you may need.' : 'Đọc agenda từ hôm trước và chuẩn bị ba câu: phần mình sẽ báo cáo, một câu hỏi, các con số có thể cần.'}</li>
<li>${en ? 'Join two minutes early, test the microphone, camera on if the client’s is on.' : 'Vào sớm hai phút, thử micro, bật camera nếu khách bật.'}</li>
<li>${en ? 'On Japanese projects a BrSE or a comtor (communicator/interpreter) may lead the talk; you still confirm your own items.' : 'Ở dự án Nhật, BrSE hoặc comtor (phiên dịch) có thể dẫn cuộc nói chuyện; bạn vẫn tự xác nhận phần việc của mình.'}</li>
<li>${en ? 'Aim to speak at least once per meeting: one confirmation counts. Silence for a month means "the junior does not understand".' : 'Mỗi buổi họp cố nói ít nhất một lần: một câu xác nhận cũng tính. Im lặng cả tháng nghĩa là "bạn mới không hiểu".'}</li>
<li>${en ? 'Take notes in English during the call; it makes the minutes a 10-minute job.' : 'Ghi chép bằng tiếng Anh ngay trong cuộc gọi; viết biên bản sẽ chỉ mất 10 phút.'}</li>
</ul>

<h3>${en ? 'Practice: write the minutes of the call' : 'Luyện tập: viết biên bản của cuộc gọi'}</h3>
<p>${en
    ? 'From the transcript above, write the minutes Minh promised to send: header with three time zones, decisions, action items with @owner and dates, open questions and a reply-by line. Check them with <code>kiem-noi.mjs --mode=minutes</code>. Then, with a friend (or an AI speaking partner), role-play lines 5–12 of the transcript: they read Tanaka-san, you ask again and confirm without looking at An’s lines.'
    : 'Từ bản ghi ở trên, viết biên bản Minh đã hứa gửi: phần đầu có ba múi giờ, quyết định, việc cần làm có @người nhận và ngày, câu hỏi còn mở, dòng đề nghị phản hồi trước một ngày. Kiểm bằng <code>kiem-noi.mjs --mode=minutes</code>. Sau đó cùng một người bạn (hoặc bạn nói chuyện AI) đóng vai dòng 5–12 của bản ghi: họ đọc lời Tanaka-san, bạn hỏi lại và xác nhận mà không nhìn lời của An.'}</p>
<details><summary>${en ? 'Model answer (real checker output)' : 'Đáp án gợi ý (kèm output thật của công cụ)'}</summary>
${E('63-bien-ban-tot.md')}
${RUN('63-bien-ban-tot', 'node kiem-noi.mjs 63-bien-ban-tot.md --mode=minutes', NOTE_RUN(en))}
<p>${en
    ? 'Compare with yours: decision 3 says what was <em>not</em> decided (Excel export is out of phase 1 for now), Q-008 appears as an open question with Tanaka-san’s date, and the deadlines carry the time zone of the person who owns them.'
    : 'So với bản của bạn: quyết định 3 ghi cả điều <em>chưa</em> quyết (xuất Excel tạm ngoài giai đoạn 1), Q-008 nằm ở mục câu hỏi còn mở kèm ngày Tanaka-san hẹn, và mỗi hạn chót mang múi giờ của người nhận việc.'}</p>
</details>

${tuVung([
    ['Sorry, I didn’t catch …', en ? 'ask again politely' : 'hỏi lại lịch sự', 'Sorry, I didn’t catch the numbers. Could you say them again?'],
    ['Could you type it in the chat?', en ? 'names, URLs, numbers' : 'tên, URL, con số', 'Could you type the server name in the chat, please?'],
    ['Just to confirm, …?', en ? 'confirm a detail' : 'xác nhận một chi tiết', 'Just to confirm, the deadline is 27 November, 6 p.m. Vietnam time?'],
    ['So what you’re saying is …', en ? 'paraphrase an idea' : 'nhắc lại một ý', 'So what you’re saying is that teachers always win?'],
    ['My concern is …', en ? 'start a disagreement softly' : 'mở đầu lời phản đối nhẹ nhàng', 'My concern is the UAT schedule.'],
    ['Let me sum up.', en ? 'close the meeting' : 'chốt buổi họp', 'Let me sum up the decisions and action items.'],
    ['Anything I missed?', en ? 'check the summary' : 'kiểm lại lời tổng kết', 'That’s everything on my list. Anything I missed?'],
  ], en)}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-11-1-khach-nhat', '🇯🇵', en ? 'Agile &amp; Teamwork 11.1 — Japanese clients: indirect "no", hourensou, nemawashi' : 'Agile &amp; Làm việc nhóm 11.1 — Khách Nhật: lời từ chối gián tiếp, hourensou, nemawashi', en ? 'The culture behind "we will consider it" (Vietnamese).' : 'Văn hoá phía sau câu "we will consider it" (tiếng Việt).')}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-11-3-mui-gio-hop', '🕘', en ? 'Agile &amp; Teamwork 11.3 — Time zones, meeting minutes and confirming in writing' : 'Agile &amp; Làm việc nhóm 11.3 — Múi giờ, biên bản họp và xác nhận bằng văn bản', en ? 'The minutes from the process side.' : 'Biên bản họp nhìn từ phía quy trình.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>agenda · ${en ? 'paraphrase' : 'nhắc lại ý (paraphrase)'} · action item · decision · minutes · UAT · ${en ? 'indirect no' : 'lời "không" gián tiếp'} · deepfake · BrSE / comtor</p>
<p class="note-ct">📚 ${en ? 'Learn more — small talk on video calls and polite disagreement outside technical topics: Days 15–18 of' : 'Học thêm — mở đầu cuộc gọi video và không đồng ý lịch sự ngoài chủ đề kỹ thuật: Ngày 15–18 của khoá'} <a href="https://cuongthai.com/language/en/giao-tiep" target="_blank" rel="noopener">${en ? 'English for everyday communication (My Language)' : 'Tiếng Anh giao tiếp (My Language)'}</a></p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Ask again at once and say what to repeat: "I didn’t catch the numbers."' : 'Hỏi lại ngay và nói rõ cần nhắc phần nào: "I didn’t catch the numbers."'}</li>
<li>${en ? 'Confirm numbers, dates, times (with time zone) and owners with a yes/no question.' : 'Xác nhận con số, ngày, giờ (kèm múi giờ) và người làm bằng câu hỏi có/không.'}</li>
<li>${en ? 'Disagree = acknowledge + concern + reason + proposal.' : 'Không đồng ý = ghi nhận + mối lo + lý do + đề xuất.'}</li>
<li>${en ? '"Difficult" and "we will consider it" may mean no: restate neutrally and confirm in writing.' : '"Difficult" và "we will consider it" có thể là "không": nói lại trung tính và xác nhận bằng văn bản.'}</li>
<li>${en ? 'Close with decisions + action items; send minutes the same day; verify any money or access request through a second channel.' : 'Chốt bằng quyết định + việc cần làm; gửi biên bản trong ngày; mọi yêu cầu về tiền hay quyền truy cập phải kiểm qua kênh thứ hai.'}</li>
</ul>
</div>`;

/* ═════════════ 6.4 — Nghe nhiều giọng ═════════════ */
const L64 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 6 · Listening' : 'Chương 6 · Nghe'}</span>
<h2>${en ? '6.4 — Listening to many accents: Indian, Japanese, American, Australian' : '6.4 — Nghe nhiều giọng: Ấn, Nhật, Mỹ, Úc'}</h2>
<p class="lead">${en
    ? 'The English in your listening textbook was recorded by actors in a studio. The English at work comes from a QA lead in Bangalore at 7:30 in the morning, a Japanese manager choosing every word carefully, an American product owner who speaks fast and uses idioms, and an Australian DevOps engineer who says "no worries" to everything. Most conversations in international IT are between non-native speakers. Nobody has a "wrong" accent — including you — but each accent has patterns, and knowing them in advance turns "I can’t understand" into "I know what to listen for".'
    : 'Tiếng Anh trong sách luyện nghe do diễn viên thu ở phòng thu. Tiếng Anh khi đi làm đến từ chị trưởng nhóm QA ở Bangalore lúc 7:30 sáng, anh quản lý người Nhật cân nhắc từng chữ, chị product owner người Mỹ nói nhanh và dùng thành ngữ, anh kỹ sư DevOps người Úc cái gì cũng "no worries". Phần lớn các cuộc trò chuyện trong ngành IT quốc tế là giữa những người không nói tiếng Anh bản ngữ. Không ai có giọng "sai" — kể cả bạn — nhưng mỗi giọng có quy luật riêng, và biết trước quy luật sẽ biến "mình không hiểu nổi" thành "mình biết cần nghe vào đâu".'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'If you grew up in Hanoi, your first week with a roommate from Quảng Nam is hard: the vowels are different and some words are new ("mô, tê, răng"). After a week you understand nearly everything — not because they changed, but because your ear learned the pattern. Accents in English work the same way: a few regular sound changes, a few local words, a different rhythm.'
    : 'Nếu bạn lớn lên ở Hà Nội, tuần đầu ở chung phòng với bạn người Quảng Nam sẽ khá vất vả: nguyên âm khác, có từ mới ("mô, tê, răng"). Một tuần sau bạn hiểu gần hết — không phải vì bạn kia đổi giọng, mà vì tai bạn đã học được quy luật. Giọng tiếng Anh cũng thế: vài thay đổi âm có quy luật, vài từ địa phương, một nhịp nói khác.'}</p>

<h3>${en ? 'Three things that make an accent hard' : 'Ba thứ làm một giọng khó nghe'}</h3>
<ol>
<li>${en ? '<strong>Sounds</strong>: a vowel or consonant changes in a regular way (American "water" ≈ "wadder").' : '<strong>Âm</strong>: một nguyên âm hay phụ âm đổi theo quy luật (giọng Mỹ "water" ≈ "wadder").'}</li>
<li>${en ? '<strong>Words and usage</strong>: the same word means something else ("revert" in Indian English = reply; "claim" in Japanese English = complaint).' : '<strong>Từ và cách dùng</strong>: cùng một từ mà nghĩa khác ("revert" trong tiếng Anh Ấn = trả lời; "claim" trong tiếng Anh của người Nhật = phàn nàn).'}</li>
<li>${en ? '<strong>Rhythm and speed</strong>: where the stress falls, how fast, how many pauses.' : '<strong>Nhịp và tốc độ</strong>: nhấn vào đâu, nhanh cỡ nào, ngừng bao nhiêu.'}</li>
</ol>

<h3>${en ? 'Four accents you will meet first' : 'Bốn giọng bạn sẽ gặp trước tiên'}</h3>
<table>
<thead><tr><th>${en ? 'Accent' : 'Giọng'}</th><th>${en ? 'Sounds to expect' : 'Âm cần chờ đón'}</th><th>${en ? 'Words and habits' : 'Từ và thói quen'}</th></tr></thead>
<tbody>
<tr><td><strong>${en ? 'Indian' : 'Ấn Độ'}</strong></td><td>${en
    ? '<em>t</em> and <em>d</em> made with the tongue curled back; <em>v</em> and <em>w</em> often the same sound ("wersion"); <em>th</em> → t/d ("tank you"); every syllable about the same length, so speech sounds fast and even.'
    : '<em>t</em> và <em>d</em> uốn lưỡi; <em>v</em> và <em>w</em> thường nghe như nhau ("wersion"); <em>th</em> → t/d ("tank you"); các âm tiết dài gần bằng nhau nên nghe nhanh và đều.'}</td><td>${en
    ? '"Kindly share…" (please), "I’ll revert by EOD" (I’ll reply by end of day), "prepone" (move earlier — the opposite of postpone), "I have a doubt" (I have a question), "today itself" (today), "na?" at the end (right?), "do the needful" (please do what is necessary). Numbers: 1 lakh = 100,000; 1 crore = 10,000,000. Time zone IST = UTC+5:30 — half an hour!'
    : '"Kindly share…" (làm ơn), "I’ll revert by EOD" (tôi sẽ trả lời trước cuối ngày), "prepone" (dời sớm lên — ngược với postpone), "I have a doubt" (tôi có một câu hỏi), "today itself" (ngay hôm nay), "na?" ở cuối câu (đúng không?), "do the needful" (làm giúp việc cần làm). Số: 1 lakh = 100.000; 1 crore = 10.000.000. Múi giờ IST = UTC+5:30 — lệch nửa tiếng!'}</td></tr>
<tr><td><strong>${en ? 'Japanese' : 'Nhật'}</strong></td><td>${en
    ? 'A vowel added after consonants, from katakana ("desk" → "desuku", "test" → "tesuto"); <em>r</em> and <em>l</em> merged; <em>f</em> ≈ <em>h</em>; <em>v</em> → b ("berry" for "very"); <em>th</em> → s/z. Usually slower, with pauses while choosing words.'
    : 'Thêm nguyên âm sau phụ âm, do katakana ("desk" → "desuku", "test" → "tesuto"); <em>r</em> và <em>l</em> lẫn nhau; <em>f</em> ≈ <em>h</em>; <em>v</em> → b ("berry" thay cho "very"); <em>th</em> → s/z. Thường chậm hơn, có ngừng để chọn từ.'}</td><td>${en
    ? 'Japanese-made English (wasei-eigo): "claim" = complaint, "mansion" = apartment, "my number" = national ID number. Indirect answers: "it is a little difficult", "we will consider it" (lesson 6.3). A pause is thinking, not the end of the turn — wait. Written agendas and minutes are highly valued.'
    : 'Tiếng Anh "made in Japan" (wasei-eigo): "claim" = lời phàn nàn, "mansion" = căn hộ chung cư, "my number" = mã số định danh cá nhân. Câu trả lời gián tiếp: "it is a little difficult", "we will consider it" (bài 6.3). Ngừng là đang nghĩ, chưa phải hết lượt — hãy chờ. Agenda và biên bản bằng văn bản được đánh giá rất cao.'}</td></tr>
<tr><td><strong>${en ? 'American' : 'Mỹ'}</strong></td><td>${en
    ? '<em>t</em> between vowels becomes a quick d ("water" ≈ "wadder", "data" ≈ "day-da"); <em>t</em> after <em>n</em> disappears ("internet" ≈ "inner-net", "twenty" ≈ "twenny"); every <em>r</em> pronounced; reductions: gonna, wanna, lemme, kinda.'
    : '<em>t</em> giữa hai nguyên âm thành d nhanh ("water" ≈ "wadder", "data" ≈ "day-da"); <em>t</em> sau <em>n</em> biến mất ("internet" ≈ "inner-net", "twenty" ≈ "twenny"); mọi âm <em>r</em> đều đọc; nói nuốt: gonna, wanna, lemme, kinda.'}</td><td>${en
    ? 'Business idioms: "circle back" (return to it later), "touch base" (talk briefly), "a ballpark figure" (a rough estimate), "a heads-up" (early warning), "on my plate" (my current work), "let’s take it offline". Direct questions and interruptions are normal, not rude.'
    : 'Thành ngữ công sở: "circle back" (quay lại chuyện này sau), "touch base" (trao đổi nhanh), "a ballpark figure" (con số ước chừng), "a heads-up" (báo trước), "on my plate" (việc mình đang ôm), "let’s take it offline". Hỏi thẳng và ngắt lời là chuyện thường, không phải bất lịch sự.'}</td></tr>
<tr><td><strong>${en ? 'Australian' : 'Úc'}</strong></td><td>${en
    ? 'The vowel in "day" moves toward "die" ("today" can sound like "to die"); final <em>r</em> not pronounced ("server" ≈ "serva"); statements sometimes end with a rising tone, like a question.'
    : 'Nguyên âm trong "day" nghe gần "die" ("today" nghe như "to die"); không đọc <em>r</em> cuối ("server" ≈ "serva"); câu khẳng định đôi khi lên giọng ở cuối như câu hỏi.'}</td><td>${en
    ? 'Short forms: "arvo" (afternoon), "brekkie" (breakfast), "reckon" (think), "heaps" (a lot), "keen" (eager), "no worries" (no problem / you’re welcome), "How are you going?" (How are you?). Time zones AEST/AEDT = UTC+10/+11, so Sydney is 3–4 hours ahead of Hanoi.'
    : 'Từ rút gọn: "arvo" (buổi chiều), "brekkie" (bữa sáng), "reckon" (nghĩ là), "heaps" (rất nhiều), "keen" (háo hức), "no worries" (không sao / không có gì), "How are you going?" (Bạn khoẻ không?). Múi giờ AEST/AEDT = UTC+10/+11, nên Sydney sớm hơn Hà Nội 3–4 tiếng.'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'These are tendencies, not rules: many Indian, Japanese, American and Australian engineers sound nothing like this table. Never comment on someone’s accent or imitate it — it is as unwelcome as someone mocking your Vietnamese accent. If you do not understand, the problem is the signal, and you fix it with the strategies below.'
    : 'Đây là xu hướng, không phải quy tắc: nhiều kỹ sư Ấn, Nhật, Mỹ, Úc nói chẳng giống bảng này chút nào. Đừng bao giờ bình luận hay nhại giọng ai — khó chịu y như khi có người nhại giọng Việt của bạn. Không hiểu thì vấn đề là "tín hiệu", và bạn sửa bằng các chiến thuật dưới đây.'}</p>

<h3>${en ? 'Numbers are the dangerous part' : 'Con số là phần nguy hiểm'}</h3>
<p>${en
    ? 'You can miss a few words and still get the meaning. You cannot miss a number. We wrote eight sentences full of numbers, let two machine voices read them at 160 words per minute (an American one and a British one), and asked Whisper to write down what it heard:'
    : 'Lỡ vài từ vẫn hiểu được ý. Lỡ một con số thì không. Ta viết tám câu đầy con số, cho hai giọng máy đọc với tốc độ 160 từ mỗi phút (một giọng Mỹ, một giọng Anh), rồi để Whisper ghi lại điều nó nghe được:'}</p>
${E('64-nghe-so.txt', en ? 'The text that was read.' : 'Đoạn chữ được đọc.')}
${mau(`$ espeak-ng -v en-us -s 160 -w am/64-en-us.wav -f mau/64-nghe-so.txt
$ python nghe.py am/64-en-us.wav
` + OUT['64-nghe-en-us'], en ? 'Real output — American machine voice, Whisper small.en, 24 Nov 2026.' : 'Output THẬT — giọng máy Mỹ, Whisper small.en, 24/11/2026.')}
${mau(`$ espeak-ng -v en-gb-x-rp -s 160 -w am/64-en-gb-x-rp.wav -f mau/64-nghe-so.txt
$ python nghe.py am/64-en-gb-x-rp.wav
` + OUT['64-nghe-en-gb-x-rp'], en ? 'Real output — British machine voice, same text.' : 'Output THẬT — giọng máy Anh, cùng đoạn chữ.')}
<p>${en
    ? 'With the American voice, Whisper wrote "not lab 352" and "not 53": the American voice ran "three-fifty" straight into the next item number ("2.", "3."), and the listener glued them together. With the British voice, which left longer pauses, every number came through. This is exactly what happens in a call: numbers merge with the words around them. So when <em>you</em> speak, pause before and after a number and never read list numbers aloud; when you <em>listen</em>, confirm every number that matters ("three-five-zero?") or ask for it in the chat.'
    : 'Với giọng Mỹ, Whisper ghi "not lab 352" và "not 53": giọng Mỹ đọc liền "three-fifty" với số thứ tự của câu kế ("2.", "3."), nên người nghe dính chúng lại. Với giọng Anh, ngừng lâu hơn, mọi con số đều ra đúng. Trong cuộc gọi thật chuyện y như vậy: con số dính vào các từ xung quanh. Vì thế khi <em>bạn</em> nói, hãy ngừng trước và sau con số và đừng đọc số thứ tự danh sách; khi bạn <em>nghe</em>, hãy xác nhận mọi con số quan trọng ("three-five-zero?") hoặc xin gõ vào chat.'}</p>

<h3>${en ? 'Strategies: before, during, after' : 'Chiến thuật: trước, trong, sau'}</h3>
<table>
<thead><tr><th>${en ? 'When' : 'Khi nào'}</th><th>${en ? 'What to do' : 'Làm gì'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Before' : 'Trước'}</td><td>${en
    ? 'Read the agenda and the last minutes; list the names (with spelling), ticket numbers and terms that will come up. Ten minutes on YouTube with a speaker of the same accent the day before helps more than you think.'
    : 'Đọc agenda và biên bản lần trước; ghi ra tên người (kèm chính tả), mã ticket và thuật ngữ sẽ xuất hiện. Mười phút nghe trên YouTube một người cùng giọng vào hôm trước giúp nhiều hơn bạn nghĩ.'}</td></tr>
<tr><td>${en ? 'During' : 'Trong'}</td><td>${en
    ? 'Turn on live captions (Microsoft Teams, Zoom and Google Meet all have them). Ask again and confirm (lesson 6.3). Ask for numbers, names and URLs in the chat. Use a headset, not the laptop speaker.'
    : 'Bật phụ đề trực tiếp (Microsoft Teams, Zoom và Google Meet đều có). Hỏi lại và xác nhận (bài 6.3). Xin con số, tên và URL trong khung chat. Dùng tai nghe có micro, đừng dùng loa laptop.'}</td></tr>
<tr><td>${en ? 'After' : 'Sau'}</td><td>${en
    ? 'Send or read the minutes and check the numbers. If the meeting was recorded (with consent), re-listen to the part you missed, or read the transcript.'
    : 'Gửi hoặc đọc biên bản và soát lại con số. Nếu buổi họp được ghi lại (có đồng ý), nghe lại đoạn mình lỡ, hoặc đọc bản chép lời.'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'Captions and transcripts make mistakes with names and numbers too (you saw Whisper do it). Use them as a second ear, not as the truth.'
    : 'Phụ đề và bản chép lời cũng sai tên và số (bạn vừa thấy Whisper sai). Dùng chúng như cái tai thứ hai, không phải sự thật.'}</p>

<h3>${en ? 'Where to practise (free)' : 'Luyện ở đâu (miễn phí)'}</h3>
<ul>
<li>${en ? '<strong>YouGlish</strong> (youglish.com): type a word, hear it in hundreds of real YouTube clips; filter by US, UK or Australian English.' : '<strong>YouGlish</strong> (youglish.com): gõ một từ, nghe nó trong hàng trăm đoạn YouTube thật; lọc theo giọng Mỹ, Anh hoặc Úc.'}</li>
<li>${en ? '<strong>Conference talks</strong>: NDC Conferences (Oslo, London, Sydney…) and GOTO Conferences put hundreds of talks on YouTube, given by engineers from every country.' : '<strong>Bài nói hội nghị</strong>: NDC Conferences (Oslo, London, Sydney…) và GOTO Conferences đưa hàng trăm bài nói lên YouTube, diễn giả là kỹ sư khắp nơi.'}</li>
<li>${en ? '<strong>Speakers by accent</strong> — Indian: Gaurav Sen (system design), Abdul Bari (algorithms); Japanese: Yukihiro "Matz" Matsumoto, creator of Ruby (RubyConf keynotes); Australian: Troy Hunt, creator of Have I Been Pwned (security talks); American: almost any official Google, Microsoft or AWS channel.' : '<strong>Diễn giả theo giọng</strong> — Ấn: Gaurav Sen (thiết kế hệ thống), Abdul Bari (thuật toán); Nhật: Yukihiro "Matz" Matsumoto, cha đẻ Ruby (các bài keynote RubyConf); Úc: Troy Hunt, người làm Have I Been Pwned (các bài nói về bảo mật); Mỹ: gần như mọi kênh chính thức của Google, Microsoft, AWS.'}</li>
<li>${en ? '<strong>CT Language</strong> on this site: the speaking partner and the specialised vocabulary sets.' : '<strong>CT Language</strong> trên trang này: bạn luyện nói và các bộ từ chuyên ngành.'}</li>
</ul>

<h3>${en ? 'A 10-minute listening routine' : 'Thói quen nghe 10 phút'}</h3>
<ol>
<li>${en ? 'Pick one minute of a talk. Listen once without subtitles.' : 'Chọn một phút của một bài nói. Nghe một lượt không phụ đề.'}</li>
<li>${en ? 'Listen again and write down every word you can (dictation). Numbers first.' : 'Nghe lại và viết ra mọi từ nghe được (chép chính tả). Ưu tiên con số.'}</li>
<li>${en ? 'Turn on the subtitles or transcript and compare. Mark the words you missed: was it a sound, a word, or speed?' : 'Bật phụ đề hoặc bản chép lời rồi so. Đánh dấu chỗ lỡ: do âm, do từ, hay do tốc độ?'}</li>
<li>${en ? 'Shadow three sentences: play, pause, repeat with the same rhythm.' : 'Nói đuổi (shadowing) ba câu: phát, dừng, nhắc lại đúng nhịp.'}</li>
</ol>
<p>${en
    ? 'Rotate the accent every week: Indian, Japanese, American, Australian, then your client’s.'
    : 'Mỗi tuần đổi một giọng: Ấn, Nhật, Mỹ, Úc, rồi tới giọng của khách mình.'}</p>

<h3>${en ? 'At work: when you really cannot understand' : 'Khi đi làm: khi thật sự không nghe ra'}</h3>
<p>${en
    ? 'It will happen: a bad line, a strong accent, a fast speaker. After you have asked once and still did not get it, do not ask the same way three times. Change the channel: "I’m sorry, the audio is breaking up on my side. Could you type the key points in the chat?" or "Could we confirm this by email after the call?" Then summarise what you think you understood, so the other person can correct you. Asking twice is professional; pretending once is how projects fail (Start here 2/2).'
    : 'Chuyện này sẽ xảy ra: đường truyền kém, giọng nặng, người nói nhanh. Đã hỏi lại một lần mà vẫn không ra thì đừng hỏi y như cũ ba lần. Đổi kênh: "I’m sorry, the audio is breaking up on my side. Could you type the key points in the chat?" hoặc "Could we confirm this by email after the call?" Sau đó tóm lại điều bạn nghĩ mình đã hiểu, để người kia sửa. Hỏi lại hai lần là chuyên nghiệp; giả vờ hiểu một lần là cách dự án hỏng (bài Bắt đầu tại đây 2/2).'}</p>

<h3>${en ? 'Practice: number dictation' : 'Luyện tập: chép chính tả con số'}</h3>
<p>${en
    ? 'Install eSpeak NG (Windows: the installer from its GitHub releases page; Linux: package <code>espeak-ng</code>; on macOS the built-in <code>say</code> command does the same job: <code>say -r 150 -o nghe.aiff -f cau.txt</code>). Ask a friend to write eight sentences with numbers — ticket IDs, dates, times with time zones, versions — or write them yourself and wait a day. Generate the audio at speed 150, then 180, listen once each and write the numbers down:'
    : 'Cài eSpeak NG (Windows: bộ cài ở trang Releases trên GitHub của dự án; Linux: gói <code>espeak-ng</code>; trên macOS lệnh có sẵn <code>say</code> làm được việc tương tự: <code>say -r 150 -o nghe.aiff -f cau.txt</code>). Nhờ một người bạn viết tám câu có số — mã ticket, ngày, giờ kèm múi giờ, phiên bản — hoặc tự viết rồi để qua một ngày. Tạo âm thanh với tốc độ 150, rồi 180, mỗi lần nghe một lượt và viết lại các con số:'}</p>
${mau(`
espeak-ng -v en-us -s 150 -w nghe-150.wav -f cau.txt
espeak-ng -v en-gb-x-rp -s 180 -w nghe-180.wav -f cau.txt
`, en ? 'Two voices, two speeds. The machine voice is flat, which makes it good practice for numbers only.' : 'Hai giọng, hai tốc độ. Giọng máy đều đều, nên chỉ hợp để luyện con số.')}
<p>${en
    ? 'Then take one minute of a real talk from the list above in each of the four accents and do the 10-minute routine. Write down (1) the words you missed and why, (2) three local words or idioms you heard.'
    : 'Sau đó lấy một phút bài nói thật trong danh sách trên, mỗi giọng một bài, và làm thói quen 10 phút. Ghi lại (1) các từ bị lỡ và vì sao, (2) ba từ địa phương hoặc thành ngữ đã nghe.'}</p>
<details><summary>${en ? 'Self-check: eight words from this lesson — what do they mean?' : 'Tự kiểm: tám từ trong bài — nghĩa là gì?'}</summary>
<ol>
<li>${en ? '"I’ll revert by EOD." → I’ll reply before the end of the day (Indian English).' : '"I’ll revert by EOD." → Tôi sẽ trả lời trước cuối ngày (tiếng Anh Ấn).'}</li>
<li>${en ? '"Can we prepone the call?" → move it earlier.' : '"Can we prepone the call?" → dời cuộc gọi sớm lên.'}</li>
<li>${en ? '"I have a doubt about Q-008." → I have a question.' : '"I have a doubt about Q-008." → Tôi có một câu hỏi.'}</li>
<li>${en ? '"We received a claim from users." (Japanese client) → a complaint.' : '"We received a claim from users." (khách Nhật) → một lời phàn nàn.'}</li>
<li>${en ? '"We will consider it." (Japanese client) → possibly no / not now; confirm in writing.' : '"We will consider it." (khách Nhật) → có thể là không / chưa; xác nhận bằng văn bản.'}</li>
<li>${en ? '"Give me a ballpark figure." → a rough estimate.' : '"Give me a ballpark figure." → một con số ước chừng.'}</li>
<li>${en ? '"Let’s circle back on this." → discuss it again later.' : '"Let’s circle back on this." → bàn lại chuyện này sau.'}</li>
<li>${en ? '"Can we chat this arvo?" (Australian) → this afternoon.' : '"Can we chat this arvo?" (người Úc) → chiều nay.'}</li>
</ol>
</details>

${tuVung([
    ['The audio is breaking up.', en ? 'bad connection' : 'đường truyền kém', 'Sorry, the audio is breaking up. Could you type that?'],
    ['Could you type it in the chat?', en ? 'change the channel' : 'đổi kênh', 'Could you type the version number in the chat?'],
    ['Three-five-zero?', en ? 'confirm a number digit by digit' : 'xác nhận số từng chữ số', 'Sorry — LAB three-five-zero?'],
    ['revert (Indian English)', en ? 'reply' : 'trả lời', 'I’ll revert by EOD.'],
    ['prepone', en ? 'move earlier' : 'dời sớm lên', 'Can we prepone the demo to Thursday?'],
    ['a heads-up', en ? 'an early warning' : 'lời báo trước', 'Just a heads-up: the server restarts at 10 p.m. ICT.'],
    ['no worries', en ? 'no problem / you’re welcome' : 'không sao / không có gì', 'Thanks for the fix! — No worries.'],
  ], en)}
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-8-4-khi-khong-hieu', '🎧', en ? 'Interview prep 8.4 — When you don’t understand the question' : 'Chuẩn bị phỏng vấn 8.4 — Khi không hiểu câu hỏi', en ? 'The same strategies in an English interview.' : 'Cùng chiến thuật khi phỏng vấn bằng tiếng Anh.')}
${lienKet('/language', '🗣️', 'CT Language', en ? 'Speaking partner and specialised vocabulary sets.' : 'Bạn luyện nói và các bộ từ chuyên ngành.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>accent · ${en ? 'live captions' : 'phụ đề trực tiếp (live captions)'} · dictation · shadowing · wasei-eigo · IST / JST / AEST · ${en ? 'flap t' : 'flap t (t thành d nhanh)'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Most work English is between non-native speakers; accents have patterns you can learn.' : 'Phần lớn tiếng Anh công việc là giữa người không bản ngữ; mỗi giọng có quy luật học được.'}</li>
<li>${en ? 'An accent is hard because of sounds, words/usage and rhythm — learn a few of each per accent.' : 'Giọng khó nghe vì âm, từ/cách dùng và nhịp — mỗi giọng học vài điểm của từng loại.'}</li>
<li>${en ? 'Numbers merge with nearby words: pause around them when speaking, confirm them when listening.' : 'Con số dính vào từ xung quanh: khi nói thì ngừng quanh số, khi nghe thì xác nhận số.'}</li>
<li>${en ? 'Before: agenda, names, terms. During: captions, ask again, chat. After: minutes, recording.' : 'Trước: agenda, tên, thuật ngữ. Trong: phụ đề, hỏi lại, chat. Sau: biên bản, bản ghi.'}</li>
<li>${en ? 'Ten minutes a day, one accent a week; never comment on anyone’s accent.' : 'Mười phút mỗi ngày, mỗi tuần một giọng; không bao giờ bình luận giọng của ai.'}</li>
</ul>
</div>`;

/* ═════════════ 6.5 — Lab ghi âm ═════════════ */
const L65 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 6 · Lab' : 'Chương 6 · Lab'}</span>
<h2>${en ? '6.5 — Lab: record a stand-up, a 3-minute demo and a meeting role-play' : '6.5 — Lab: ghi âm một standup, một demo 3 phút và một buổi họp đóng vai'}</h2>
<p class="lead">${en
    ? 'Speaking only improves when you hear yourself. In this lab you record three things, turn each recording into text with Whisper (a free speech recognition model that runs on your own computer), check the text with <code>kiem-noi.mjs</code>, listen to yourself, and score the result with a 30-point rubric. The tools are short and printed in full below. You can redo the lab every month and compare.'
    : 'Kỹ năng nói chỉ tiến bộ khi bạn nghe lại chính mình. Trong lab này bạn ghi âm ba thứ, biến từng bản ghi thành chữ bằng Whisper (mô hình nhận dạng giọng nói miễn phí, chạy ngay trên máy bạn), kiểm phần chữ bằng <code>kiem-noi.mjs</code>, tự nghe lại, rồi chấm theo thang 30 điểm. Công cụ đều ngắn và in đủ bên dưới. Mỗi tháng làm lại một lần rồi so.'}</p>

<h3>${en ? 'What you need' : 'Cần chuẩn bị'}</h3>
<ul>
<li>${en ? 'A recorder: the voice recorder on your phone, or Audacity on a computer. Any format works (.m4a, .mp3, .wav). Sit in a quiet room, phone 20–30 cm from your mouth.' : 'Thứ để ghi âm: ứng dụng ghi âm trên điện thoại, hoặc Audacity trên máy tính. Định dạng nào cũng được (.m4a, .mp3, .wav). Ngồi phòng yên tĩnh, điện thoại cách miệng 20–30 cm.'}</li>
<li>${en ? 'Node.js 18+ (or Docker) for <code>kiem-noi.mjs</code> — no packages.' : 'Node.js 18+ (hoặc Docker) cho <code>kiem-noi.mjs</code> — không cần gói nào.'}</li>
<li>${en ? 'Python 3.9+ and <code>pip install faster-whisper</code> for <code>nghe.py</code>. The first run downloads the model (small.en, about 470 MB); after that it works offline on a normal laptop CPU.' : 'Python 3.9+ và <code>pip install faster-whisper</code> cho <code>nghe.py</code>. Lần chạy đầu tải mô hình (small.en, khoảng 470 MB); sau đó chạy ngoại tuyến bằng CPU laptop bình thường.'}</li>
<li>${en ? 'No Python? Windows voice typing (Win + H) or Google Docs voice typing also show what a machine heard — but they give no timing, and they correct more of your mistakes.' : 'Không có Python? Gõ bằng giọng nói của Windows (Win + H) hoặc Voice typing của Google Docs cũng cho thấy máy nghe ra gì — nhưng không có thời lượng, và chúng sửa giúp lỗi của bạn nhiều hơn.'}</li>
</ul>

<h3>${en ? 'The two tools' : 'Hai công cụ'}</h3>
<details><summary>${en ? 'nghe.py — full source (20 lines): recording → text with timestamps and words per minute' : 'nghe.py — mã nguồn đầy đủ (20 dòng): bản ghi → chữ, kèm mốc thời gian và số từ mỗi phút'}</summary>
${mau(NGHE)}
<p>${en
    ? '<code>temperature=0</code> and <code>condition_on_previous_text=False</code> make the result repeatable: the same file gives the same text every run, so you can compare month to month.'
    : '<code>temperature=0</code> và <code>condition_on_previous_text=False</code> làm kết quả lặp lại được: cùng một tệp chạy lần nào cũng ra cùng một đoạn chữ, nên so được giữa các tháng.'}</p>
</details>
<details><summary>${en ? 'kiem-noi.mjs — full source (about 100 lines, read it: every rule of lessons 6.1–6.3 is one line here)' : 'kiem-noi.mjs — mã nguồn đầy đủ (khoảng 100 dòng, nên đọc: mỗi luật của bài 6.1–6.3 là một dòng ở đây)'}</summary>
${mau(KIEMNOI)}
</details>
${mau(`
# Node
node kiem-noi.mjs standup.txt --sec=52
# or Docker, no Node installed, no network
docker run --rm --network none -v "$PWD":/w -w /w node:22-alpine node kiem-noi.mjs standup.txt --sec=52
`, en ? 'Running the checker. --sec is the length of your recording (nghe.py prints it).' : 'Chạy công cụ kiểm. --sec là độ dài bản ghi (nghe.py in ra con số này).')}

<h3>${en ? 'Walkthrough: one full loop with a machine voice' : 'Làm mẫu: một vòng trọn vẹn với giọng máy'}</h3>
<p>${en
    ? 'Before you record yourself, see the whole loop once. We let eSpeak NG read the stand-up from lesson 6.1 at 130 words per minute, gave the audio to Whisper, and checked Whisper’s text with the real length of the recording:'
    : 'Trước khi tự ghi âm, xem cả vòng một lượt. Ta cho eSpeak NG đọc bài standup ở bài 6.1 với tốc độ 130 từ mỗi phút, đưa âm thanh cho Whisper, rồi kiểm đoạn chữ Whisper ghi được với độ dài thật của bản ghi:'}</p>
${mau(`$ espeak-ng -v en-us -s 130 -w am/61-tot.wav -f mau/61-tot.txt
$ python nghe.py am/61-tot.wav | tee nghe-raw.txt
` + OUT['61-tot-nghe'] + `$ sed -n 's/^\\[[^]]*\\] //p' nghe-raw.txt > 61-tot-nghe.txt     # drop the timestamps`, NOTE_AM(en))}
${RUN('61-tot-nghe-kiem', `node kiem-noi.mjs 61-tot-nghe.txt --sec=${OUT['61-tot-sec']}`, NOTE_RUN(en) + (en ? ' The input is Whisper’s text without the timestamps; --sec is the 48.7 s that nghe.py printed, rounded.' : ' Đầu vào là đoạn chữ của Whisper đã bỏ mốc thời gian; --sec là 48,7 giây nghe.py in ra, làm tròn.'))}
<p>${en
    ? 'Read Whisper’s text like a listener would. The structure and the numbers came through; the checker finds nothing; the speed (about 116 words per minute) is comfortable. But look at the names: "Linh" became <strong>Lynn</strong>, "Minh" became <strong>Min</strong>, "Tanaka-san" lost its "-san", and "Q-007" became "Q007". A foreign listener makes the same guesses. This is why lesson 6.1 says: give names a role, and type unusual names in the chat.'
    : 'Đọc đoạn chữ của Whisper như một người nghe. Khuôn và con số đều qua được; công cụ không bắt lỗi nào; tốc độ (khoảng 116 từ mỗi phút) dễ nghe. Nhưng nhìn các cái tên: "Linh" thành <strong>Lynn</strong>, "Minh" thành <strong>Min</strong>, "Tanaka-san" mất chữ "-san", "Q-007" thành "Q007". Người nghe nước ngoài cũng đoán y như vậy. Đó là lý do bài 6.1 dặn: tên người kèm vai trò, tên lạ thì gõ vào chat.'}</p>

<h3>${en ? 'What Whisper can and cannot tell you' : 'Whisper nói được gì và không nói được gì'}</h3>
<p>${en
    ? 'Twelve sentences, each read twice by the machine voice — correctly, and the way many Vietnamese speakers say it:'
    : 'Mười hai câu, mỗi câu giọng máy đọc hai lần — đúng, và theo cách nhiều người Việt hay nói:'}</p>
${bangNghe([
    ['I cleared the cache on the staging server.', en ? 'correct: "cash"' : 'đúng: "cash"', 1],
    ['I cleared the cache on the staging server.', en ? '"ca-chê" (wrong)' : '"ca-chê" (sai)', 2],
    ['The test suite takes ten minutes.', en ? 'correct: "sweet"' : 'đúng: "sweet"', 3],
    ['The test suite takes ten minutes.', en ? '"suit" (wrong)' : '"suit" (sai)', 4],
    ['Yesterday I fixed the bug and merged it.', en ? 'correct' : 'đúng', 5],
    ['Yesterday I fixed the bug and merged it.', en ? 'final consonants dropped' : 'nuốt phụ âm cuối', 6],
    ['We need fifteen minutes.', en ? 'correct' : 'đúng', 7],
    ['We need fifteen minutes.', en ? 'stress on the first syllable' : 'nhấn âm đầu', 8],
    ['The deadline is the thirteenth of November.', en ? 'correct' : 'đúng', 9],
    ['The deadline is the thirteenth of November.', en ? '"-nth" dropped' : 'mất "-nth"', 10],
    ['Please check the width and height of the image.', en ? 'correct' : 'đúng', 11],
    ['Please check the width and height of the image.', en ? '"wit", "hate" (wrong)' : '"wit", "hate" (sai)', 12],
  ], en)}
<p class="note-ct">${NOTE_AM(en)}</p>
<p>${en
    ? 'Two lessons. <strong>When Whisper writes something else, a listener very likely heard something else</strong>: "suit", "pick… murr", 50 instead of 15, the 30th instead of the 13th. Those are real red flags. But <strong>when Whisper writes the right word, it does not prove you said it right</strong>: it guessed "cache", "width" and "height" from the context of the sentence, as a patient listener might — and an impatient one might not. So Whisper is the minimum bar. After it, listen to yourself, and once a month ask a person (a teammate, a lecturer, or the speaking partner in CT Language). Chapter 7 (lesson 7.2) goes through the terms people mispronounce most.'
    : 'Hai bài học. <strong>Khi Whisper ghi ra chữ khác, rất có thể người nghe cũng nghe ra chữ khác</strong>: "suit", "pick… murr", 50 thay vì 15, ngày 30 thay vì ngày 13. Đó là những cờ đỏ thật. Nhưng <strong>khi Whisper ghi đúng chữ, điều đó không chứng minh bạn đọc đúng</strong>: nó đoán ra "cache", "width", "height" từ ngữ cảnh của câu, như một người nghe kiên nhẫn — còn người thiếu kiên nhẫn thì có thể không. Vậy Whisper là ngưỡng tối thiểu. Qua được rồi thì tự nghe lại, và mỗi tháng nhờ một người thật (đồng đội, giảng viên, hoặc bạn luyện nói trong CT Language). Chương 7 (bài 7.2) đi qua các thuật ngữ hay bị đọc sai nhất.'}</p>

<h3>${en ? 'Task A — Stand-up (60 seconds)' : 'Bài A — Standup (60 giây)'}</h3>
<p>${en
    ? 'Monday 30 November, Sprint 6 day 8. On Friday you opened the PR for LAB-315 (no-show release); Tuan left three review comments and you fixed two this morning; the third is about the time zone of the job. Q-007 is now closed, so LAB-322 (settings screen) can start. UAT starts today: if Priya’s team reports a bug, it comes first. Write keywords only (no full script), record, run <code>nghe.py</code> and <code>kiem-noi.mjs --sec=…</code>.'
    : 'Thứ Hai 30/11, ngày 8 của Sprint 6. Thứ Sáu bạn đã mở PR cho LAB-315 (tự huỷ khi không đến lấy); Tuan để lại ba góp ý review, sáng nay bạn sửa xong hai; góp ý thứ ba về múi giờ của job. Q-007 đã đóng nên LAB-322 (màn hình cài đặt) bắt đầu được. Hôm nay UAT bắt đầu: đội của Priya báo lỗi thì lỗi được ưu tiên. Chỉ ghi từ khoá (không viết cả bài), ghi âm, chạy <code>nghe.py</code> và <code>kiem-noi.mjs --sec=…</code>.'}</p>
<details><summary>${en ? 'Model answer (real checker output)' : 'Đáp án gợi ý (kèm output thật của công cụ)'}</summary>
${E('65-a-dapan.txt')}
${RUN('65-a-dapan', 'node kiem-noi.mjs 65-a-dapan.txt', NOTE_RUN(en))}
<p>${en ? 'Notice the risk sentence: it is not a blocker yet, but saying it today means nobody is surprised on Wednesday.' : 'Để ý câu về rủi ro: nó chưa phải vướng mắc, nhưng nói ra hôm nay thì thứ Tư không ai bất ngờ.'}</p>
</details>

<h3>${en ? 'Task B — A 3-minute demo plus three questions' : 'Bài B — Demo 3 phút và ba câu hỏi'}</h3>
<p>${en
    ? 'Demo a feature of your own team project at university (best), or LabFlow’s reservation flow using the script in lesson 6.2 as a model — not as a text to read. Share your screen in a video call with a friend (or record your screen with sound), and follow the six parts. Then ask your friend to read these three questions; answer each without preparation:'
    : 'Demo một tính năng trong đồ án nhóm của chính bạn ở trường (tốt nhất), hoặc luồng đặt trước của LabFlow, lấy kịch bản bài 6.2 làm mẫu — không phải để đọc. Chia sẻ màn hình trong cuộc gọi video với một người bạn (hoặc quay màn hình có tiếng), theo đủ sáu phần. Rồi nhờ bạn đọc ba câu hỏi dưới đây; trả lời từng câu không chuẩn bị trước:'}</p>
<ol>
<li><em>Can a teacher book an item for a whole week?</em></li>
<li><em>What happens if the student doesn’t come to pick it up?</em></li>
<li><em>Could you add QR-code check-in at the lab door?</em></li>
</ol>
<details><summary>${en ? 'Model answers to the three questions' : 'Đáp án gợi ý cho ba câu hỏi'}</summary>
${mau(`
1. Yes. Teachers can book up to seven calendar days. Let me show you:
   I'll log in as a teacher and choose Monday to Sunday. As you can see,
   the Save button is enabled.
   (You know the answer: answer briefly and show it.)

2. That's the no-show release. It's planned, but not in this sprint.
   The rule is in Q-007: the reservation is released 30 minutes after the
   start of the slot. We'll demo it in Sprint 7.
   (Not done yet: say so, point to the decision, give the sprint.)

3. Thank you, that's an interesting idea. It's not in the current scope,
   so let me note it. Minh will send you an estimate as a change request.
   Just to make sure I understand: you mean students scan a code at the
   door, and the status changes to "Picked up"?
   (New request: thank, note, route to a CR, confirm the idea.)
`)}
</details>

<h3>${en ? 'Task C — Meeting role-play' : 'Bài C — Họp đóng vai'}</h3>
<p>${en
    ? 'A friend reads the client lines; you speak the YOU lines without preparing full sentences (the hints say what to do, not what to say). Record the whole conversation. Switch roles after one round.'
    : 'Một người bạn đọc lời của khách; bạn nói các lượt YOU mà không soạn sẵn câu (gợi ý chỉ nói cần làm gì, không nói cần nói gì). Ghi âm cả cuộc trò chuyện. Xong một lượt thì đổi vai.'}</p>
${mau(`
CLIENT (Tanaka): About the reminder emails... we discussed internally. For teachers also,
                 we want the reminder, but earlier, maybe forty-eight hours, or...
YOU:  (you did not catch the number — ask again)
CLIENT:          Forty-eight. Four-eight hours before.
YOU:  (confirm: teachers get the reminder 48 hours before, students 24 hours)
CLIENT:          Yes. And could you release it this sprint? It is a small change.
YOU:  (disagree politely: the sprint ends on Friday and UAT has started — propose an option)
CLIENT:          Hmm. That may be a little difficult for us... we will consider.
YOU:  (restate the result neutrally and ask for confirmation)
CLIENT:          Yes, please send the estimate.
YOU:  (sum up: decision + action item with owner and date, then close)
`, en ? 'Role-play script. Q-008 from the minutes in lesson 6.3 is being answered.' : 'Kịch bản đóng vai. Đây là lúc khách trả lời Q-008 trong biên bản bài 6.3.')}
<details><summary>${en ? 'Model lines' : 'Lời mẫu'}</summary>
${mau(`
YOU: Sorry, Tanaka-san, I didn't catch the number. How many hours before?
YOU: Thank you. So teachers get the reminder 48 hours before the slot,
     and students still get it 24 hours before. Is that correct?
YOU: I understand it looks small. My concern is the timing: this sprint ends
     on Friday, and UAT has already started, so a change now needs a new test
     round. Could we put it in Sprint 7? I can send you an estimate today.
YOU: Understood. So for now, the teacher reminder is not in this sprint, and
     you'll decide after you see the estimate. Did I get that right?
YOU: Thank you. Let me sum up. Decision: teachers get a reminder 48 hours
     before the slot. Action item: I'll send the estimate for Sprint 7 by
     today, 6 p.m. Vietnam time, 8 p.m. in Tokyo. I'll update Q-008 in the
     Q&A list. Anything I missed?
`)}
<p>${en
    ? 'The four moves of lesson 6.3, in order: ask again → confirm → disagree with a proposal → restate the indirect answer → sum up. "8 p.m. in Tokyo" is the time-zone kindness.'
    : 'Đủ các nước đi của bài 6.3, đúng thứ tự: hỏi lại → xác nhận → phản đối kèm đề xuất → nói lại câu trả lời gián tiếp → tổng kết. "8 p.m. in Tokyo" là cử chỉ đổi múi giờ giúp khách.'}</p>
</details>

<h3>${en ? 'Rubric — 30 points' : 'Thang chấm — 30 điểm'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Full marks (6)' : 'Điểm tối đa (6)'}</th><th>${en ? 'How to check' : 'Cách kiểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Structure' : 'Khuôn'}</td><td>${en ? 'Three parts (A), six parts (B), four moves (C), in order' : 'Đủ ba phần (A), sáu phần (B), bốn nước đi (C), đúng thứ tự'}</td><td>${en ? 'kiem-noi.mjs: no structure warnings' : 'kiem-noi.mjs: không có cảnh báo về khuôn'}</td></tr>
<tr><td>${en ? 'Precision' : 'Chính xác'}</td><td>${en ? 'Ticket numbers, dates, times with time zones, owners; no %, "try", "ASAP"' : 'Có mã ticket, ngày, giờ kèm múi giờ, người làm; không %, "try", "ASAP"'}</td><td>${en ? 'kiem-noi.mjs + read the transcript' : 'kiem-noi.mjs + đọc bản chép lời'}</td></tr>
<tr><td>${en ? 'Intelligibility' : 'Nghe hiểu được'}</td><td>${en ? 'Whisper writes every number and term correctly' : 'Whisper ghi đúng mọi con số và thuật ngữ'}</td><td>${en ? 'Compare nghe.py output with your keywords; −1 per wrong number or term' : 'So output nghe.py với từ khoá của bạn; −1 cho mỗi số hay thuật ngữ sai'}</td></tr>
<tr><td>${en ? 'Fluency' : 'Trôi chảy'}</td><td>${en ? '110–140 words per minute, at most 2 fillers, no reading voice' : '110–140 từ mỗi phút, tối đa 2 tiếng đệm, không giọng đọc bài'}</td><td>${en ? 'words per minute from nghe.py; listen once yourself' : 'số từ mỗi phút từ nghe.py; tự nghe lại một lượt'}</td></tr>
<tr><td>${en ? 'Interaction' : 'Tương tác'}</td><td>${en ? 'Asks again, confirms, disagrees with a proposal, makes no promise' : 'Có hỏi lại, xác nhận, phản đối kèm đề xuất, không hứa bừa'}</td><td>${en ? 'Tasks B (questions) and C; a friend scores it' : 'Bài B (câu hỏi) và C; nhờ bạn chấm'}</td></tr>
</tbody>
</table>
<p>${en
    ? '24+ ready for client calls; 18–23 ready for internal stand-ups in English — keep the weekly recording; under 18: redo lessons 6.1 and 6.3 and record again in a week. Keep the three files: the same lab in a month shows how far you came.'
    : 'Từ 24 điểm: sẵn sàng họp với khách; 18–23: sẵn sàng standup nội bộ bằng tiếng Anh — giữ thói quen ghi âm hằng tuần; dưới 18: làm lại bài 6.1 và 6.3, một tuần sau ghi lại. Giữ cả ba tệp: làm lại lab sau một tháng sẽ thấy mình tiến được bao xa.'}</p>
<p>${en
    ? 'No friend available? Use an AI speaking partner (for example the one in CT Language) with this instruction: "You are Tanaka-san, a Japanese client. Speak simple English with some pauses. Ask me about the reminder emails and request a change for this sprint. Do not correct me until the end; then list my three biggest mistakes."'
    : 'Không có bạn cùng tập? Dùng một bạn luyện nói AI (ví dụ trong CT Language) với lời dặn: "You are Tanaka-san, a Japanese client. Speak simple English with some pauses. Ask me about the reminder emails and request a change for this sprint. Do not correct me until the end; then list my three biggest mistakes."'}</p>

<h3>🎤 ${en ? 'Interviewers will ask (answer in English, 30–60 seconds each)' : 'Phỏng vấn viên sẽ hỏi (trả lời bằng tiếng Anh, mỗi câu 30–60 giây)'}</h3>
<p>${en ? 'Typical OJT/fresher questions about communication. Record your answer before opening the model, then run it through the same loop.' : 'Câu hỏi thường gặp khi phỏng vấn OJT/fresher về giao tiếp. Ghi âm câu trả lời trước khi mở đáp án mẫu, rồi cho chạy qua đúng vòng kiểm ở trên.'}</p>
<p><strong>1. Walk me through a daily stand-up in your team project.</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
In our team project at FPT University we had a 15-minute stand-up every
morning on Google Meet. Each of us answered three things: what we finished,
what we were working on, and what was blocking us, always with the task
number from our Jira board. If a problem needed discussion, we moved it to
a short call after the stand-up. For example, I once said I was blocked by
the payment API key, and our leader got it for me the same morning.
`)}</details>
<p><strong>2. Tell me about a time you presented your work. How did you prepare?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
At the end of our SWP project, I demoed the booking feature to our lecturer
and two other teams. I wrote a short script: the goal first, then one user
story with test data, then what was not finished. I rehearsed it twice with
a timer and recorded a backup video. During the demo the server was slow,
so I said what was happening and continued with the video. The lecturer
said it was the clearest demo of the class.
`)}</details>
<p><strong>3. What do you do when you don’t understand a client in a meeting?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I ask again immediately and say which part I missed, for example "Sorry,
I didn't catch the numbers." Then I repeat what I understood and ask
"Is that correct?" If the line is bad, I ask them to type the key points
in the chat. After the meeting I send the minutes, so the client can correct
anything in writing. I think pretending to understand is the most expensive
mistake in a project.
`)}</details>
<p><strong>4. Tell me about a time you disagreed with your leader or a teammate.</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
Two days before our deadline, our leader wanted to add a new report page.
I agreed it was useful, but my concern was testing: we had no time to test
it properly. I proposed a smaller version, a CSV export, and to build the
full page after the deadline. We showed both options to the lecturer, she
chose the smaller one, and we delivered on time with no new bugs.
`)}</details>
<p><strong>5. Your demo fails in front of the client. What do you do?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I stay calm and say what happened: "That's not what should happen." I don't
debug live. I switch to my backup, a recording from the same morning, or
another account, and finish the demo. At the end I promise a short update
with a time, for example "by tomorrow, 5 p.m. your time", and after the call
I find the cause and send it, with what we changed so it won't happen again.
`)}</details>
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-8-5-lab-noi-tieng-anh', '🎤', en ? 'Interview prep 8.5 — English speaking lab' : 'Chuẩn bị phỏng vấn 8.5 — Lab nói tiếng Anh', en ? 'Self-introduction and project story for the interview itself.' : 'Tự giới thiệu và kể dự án cho chính buổi phỏng vấn.')}
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-2-2-star', '⭐', en ? 'Interview prep 2.2 — STAR stories' : 'Chuẩn bị phỏng vấn 2.2 — Câu chuyện STAR', en ? 'Structure for questions 2 and 4.' : 'Khung cho câu 2 và câu 4.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>Whisper · ${en ? 'speech recognition' : 'nhận dạng giọng nói (speech recognition)'} · transcript · ${en ? 'words per minute' : 'số từ mỗi phút'} · filler · rubric · role-play</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Loop: record → nghe.py (text + time) → kiem-noi.mjs → listen yourself → rubric.' : 'Vòng kiểm: ghi âm → nghe.py (chữ + thời lượng) → kiem-noi.mjs → tự nghe lại → chấm điểm.'}</li>
<li>${en ? 'If Whisper writes a different word or number, a listener probably heard it too; if it writes the right one, that is only the minimum bar.' : 'Whisper ghi ra từ hay số khác thì người nghe có lẽ cũng nghe khác; ghi đúng thì mới chỉ là ngưỡng tối thiểu.'}</li>
<li>${en ? 'Speak from keywords, not a script; 110–140 words per minute; pauses instead of fillers.' : 'Nói theo từ khoá, không đọc bài; 110–140 từ mỗi phút; ngừng thay cho tiếng đệm.'}</li>
<li>${en ? 'Redo the lab every month with the same tasks and compare the three files.' : 'Mỗi tháng làm lại lab với đúng các bài này và so ba tệp.'}</li>
</ul>
</div>`;

/* ═════════════ 6.6 — Quiz ═════════════ */
const QUIZ6 = [
  Q('tak6-1', 'Which stand-up sentence is best?|||Câu standup nào tốt nhất?', [
    'Yesterday I fix the login bug, it is almost done.|||Yesterday I fix the login bug, it is almost done.',
    'Yesterday I finished LAB-309, the login bug; the PR is merged.|||Yesterday I finished LAB-309, the login bug; the PR is merged.',
    'I did many things yesterday, same as before.|||I did many things yesterday, same as before.',
    'Login is 90% now.|||Login is 90% now.',
  ], 1, 'Past simple for finished work, ticket number + a few words, a clear state. Lesson 6.1.|||Quá khứ đơn cho việc đã xong, mã ticket + vài chữ, trạng thái rõ ràng. Bài 6.1.'),
  Q('tak6-2', 'You are waiting for the client’s answer to Q-011. What is the best blocker sentence?|||Bạn đang chờ khách trả lời Q-011. Câu nào nói vướng mắc tốt nhất?', [
    'I have some problems.|||I have some problems.',
    'I will try to finish ASAP.|||I will try to finish ASAP.',
    'I’m blocked by Q-011, the status colours. Minh, could you ask the client today?|||I’m blocked by Q-011, the status colours. Minh, could you ask the client today?',
    'Maybe there is a blocker, I am not sure.|||Maybe there is a blocker, I am not sure.',
  ], 2, 'A blocker has a cause and a who. Lesson 6.1.|||Vướng mắc phải có nguyên nhân và có người. Bài 6.1.'),
  Q('tak6-3', 'How should you say the ticket LAB-315 in a call?|||Nên đọc mã ticket LAB-315 thế nào trong cuộc gọi?', [
    '"lab three hundred fifteen"|||"lab three hundred fifteen"',
    '"lab three-one-five", and add what it is: "the no-show release"|||"lab three-one-five", kèm nó là gì: "the no-show release"',
    'Just "the ticket" — numbers are confusing|||Chỉ nói "the ticket" — số dễ gây rối',
    '"lab thirty-one five"|||"lab thirty-one five"',
  ], 1, 'Digit by digit, plus a few words. In the real test Whisper heard a badly stressed "fifteen" as 50. Lessons 6.1, 6.4.|||Đọc từng chữ số, kèm vài chữ mô tả. Trong thử nghiệm thật Whisper nghe "fifteen" nhấn sai thành 50. Bài 6.1, 6.4.'),
  Q('tak6-4', 'A client asks during your demo: "Can you also add Excel export?" It is not in scope. What do you say?|||Đang demo, khách hỏi: "Can you also add Excel export?" Việc này ngoài phạm vi. Bạn nói gì?', [
    'No problem, we will add it next sprint.|||No problem, we will add it next sprint.',
    'No, it’s impossible.|||No, it’s impossible.',
    'Thank you, that makes sense. It’s not in the current scope, so let me check the effort and get back to you by Friday.|||Thank you, that makes sense. It’s not in the current scope, so let me check the effort and get back to you by Friday.',
    '(say nothing and continue the demo)|||(im lặng và demo tiếp)',
  ], 2, 'Thank, say it is out of scope, promise a time — not the feature. Lessons 6.2, 5.3.|||Cảm ơn, nói là ngoài phạm vi, hẹn thời điểm — không hứa tính năng. Bài 6.2, 5.3.'),
  Q('tak6-5', 'The demo shows an error on screen. Which reaction is best?|||Màn hình demo báo lỗi. Phản ứng nào tốt nhất?', [
    'Apologise many times and debug it live until it works.|||Xin lỗi nhiều lần và sửa trực tiếp tới khi chạy.',
    'Say "That’s not what should happen", switch to the backup recording, and promise an update with a time.|||Nói "That’s not what should happen", chuyển sang video dự phòng, và hẹn giờ gửi cập nhật.',
    'Say the backend team broke it.|||Nói đội backend làm hỏng.',
    'End the call.|||Kết thúc cuộc gọi.',
  ], 1, 'Name it, move on, follow up. Lesson 6.2.|||Gọi tên, chuyển hướng, phản hồi sau. Bài 6.2.'),
  Q('tak6-6', 'You did not hear the numbers the client said. What do you say?|||Bạn không nghe được các con số khách vừa nói. Bạn nói gì?', [
    'What?|||What?',
    'Can you repeat again?|||Can you repeat again?',
    'I don’t understand what you say.|||I don’t understand what you say.',
    'Sorry, I didn’t catch the numbers. Could you say them again?|||Sorry, I didn’t catch the numbers. Could you say them again?',
  ], 3, 'Blame the hearing, not the speaker, and say what to repeat. Lesson 6.3.|||Đổ cho việc nghe, không đổ cho người nói, và nói rõ cần nhắc phần nào. Bài 6.3.'),
  Q('tak6-7', 'Which sentence disagrees politely?|||Câu nào phản đối một cách lịch sự?', [
    'You are wrong, the spec says three days.|||You are wrong, the spec says three days.',
    'I see your point. My concern is the UAT schedule. Could we do it as a change request?|||I see your point. My concern is the UAT schedule. Could we do it as a change request?',
    'OK, we will do it.|||OK, we will do it.',
    'It’s impossible.|||It’s impossible.',
  ], 1, 'Acknowledge + concern + reason + proposal. Lesson 6.3.|||Ghi nhận + mối lo + lý do + đề xuất. Bài 6.3.'),
  Q('tak6-8', 'A Japanese client says: "That may be a little difficult. We will consider it." What should you do?|||Khách Nhật nói: "That may be a little difficult. We will consider it." Bạn nên làm gì?', [
    'Treat it as yes and start the work.|||Coi là đồng ý và bắt tay làm.',
    'Ask "Is that a yes or a no?" loudly.|||Hỏi to "Is that a yes or a no?"',
    'Restate it neutrally ("So for now it is not in phase 1…"), ask "Did I get that right?", and put it in the minutes.|||Nói lại trung tính ("So for now it is not in phase 1…"), hỏi "Did I get that right?", và ghi vào biên bản.',
    'Ignore it.|||Bỏ qua.',
  ], 2, 'It may be a polite no: confirm neutrally and in writing. Lessons 6.3, 6.4.|||Có thể là lời từ chối lịch sự: xác nhận trung tính và bằng văn bản. Bài 6.3, 6.4.'),
  Q('tak6-9', 'Which action item is written correctly?|||Action item nào viết đúng?', [
    '- Deploy to test server Friday 6pm|||- Deploy to test server Friday 6pm',
    '- An check the email thing|||- An check the email thing',
    '- @An: deploy build 6.2 to the client test server, by 27 Nov 2026 18:00 ICT|||- @An: deploy build 6.2 to the client test server, by 27 Nov 2026 18:00 ICT',
    '- Update spec|||- Update spec',
  ], 2, 'Owner, what, date, time with time zone. Lesson 6.3 (kiem-noi.mjs --mode=minutes).|||Người nhận, việc gì, ngày, giờ kèm múi giờ. Bài 6.3 (kiem-noi.mjs --mode=minutes).'),
  Q('tak6-10', 'Whisper wrote your sentence "The test suite takes ten minutes" correctly. What does it prove?|||Whisper ghi đúng câu "The test suite takes ten minutes" của bạn. Điều đó chứng minh gì?', [
    'That your pronunciation is perfect.|||Phát âm của bạn hoàn hảo.',
    'Only the minimum: Whisper also guesses from context. Listen yourself and ask a person.|||Chỉ là ngưỡng tối thiểu: Whisper cũng đoán theo ngữ cảnh. Tự nghe lại và nhờ người thật.',
    'Nothing; Whisper is always wrong.|||Không gì cả; Whisper luôn sai.',
    'That you can skip lesson 7.2.|||Bạn được bỏ qua bài 7.2.',
  ], 1, 'In the real test Whisper wrote "cache", "width" and "height" correctly even when they were mispronounced. Lesson 6.5.|||Trong thử nghiệm thật Whisper vẫn ghi đúng "cache", "width", "height" dù đọc sai. Bài 6.5.'),
];

export default {
  title: 'Chapter 6 — Speaking: stand-ups, demos and meetings|||Chương 6 — Nói: standup, demo và họp',
  description: 'Nói ngắn, rõ, có cấu trúc — kể cả khi chưa trôi chảy: standup 60 giây ba phần ba thì, demo sáu phần với lời dẫn và cách xử lý khi hỏng, họp với khách (hỏi lại, xác nhận, phản đối kèm đề xuất, đọc lời "không" gián tiếp, biên bản), nghe giọng Ấn/Nhật/Mỹ/Úc — kiểm bằng công cụ kiem-noi.mjs và Whisper chạy thật.',
  lessons: [
    { title: '6.1 — A 60-second stand-up: yesterday, today, blockers|||6.1 — Standup 60 giây: hôm qua, hôm nay, vướng gì', slug: 'tak-6-1-standup', type: 'LESSON', isFreePreview: true, description: 'Daily Scrum theo Scrum Guide 2020, ba phần với ba thì, bản standup kiểu dịch từ tiếng Việt bị công cụ báo 10 cảnh báo và bản sửa, đọc mã ticket/số/ngày/tên qua micro kém (Whisper nghe "fifteen" thành 50, "thirteenth" thành 30th), bảy lỗi hay gặp, báo tin xấu trong bốn câu, bài standup sáng thứ Sáu có đáp án.', content: L61(true) + L61(false) },
    { title: '6.2 — Demoing to a client: script, narration, handling questions|||6.2 — Demo cho khách: kịch bản, lời dẫn, xử lý câu hỏi', slug: 'tak-6-2-demo', type: 'LESSON', isFreePreview: true, description: 'Sáu phần của một buổi demo, kịch bản trước/sau (output thật), lời dẫn "làm – nói – chỉ", danh sách chuẩn bị, góc hacker màn hình lộ thông tin (ảnh họp Zoom nội các Anh 2020), khi demo hỏng (Windows 98 ở COMDEX 1998, Cybertruck 2019), năm loại câu hỏi và cách đáp, bài cứu kịch bản có đáp án.', content: L62(true) + L62(false) },
    { title: '6.3 — Meetings: asking to repeat, confirming, disagreeing politely, closing with action items|||6.3 — Họp: xin nhắc lại, xác nhận, không đồng ý lịch sự, chốt việc', slug: 'tak-6-3-hop', type: 'LESSON', isFreePreview: true, description: 'Bản ghi một cuộc gọi với khách Nhật và QA Ấn, bốn nước đi (hỏi lại, xác nhận, phản đối = ghi nhận + mối lo + lý do + đề xuất, chốt việc), đọc lời "không" gián tiếp, biên bản họp kiểm bằng công cụ, góc hacker cuộc gọi deepfake Arup 2024 và giọng giả CEO 2019, bài viết biên bản có đáp án.', content: L63(true) + L63(false) },
    { title: '6.4 — Listening to many accents: Indian, Japanese, American, Australian|||6.4 — Nghe nhiều giọng: Ấn, Nhật, Mỹ, Úc', slug: 'tak-6-4-nghe', type: 'LESSON', isFreePreview: true, description: 'Ba thứ làm giọng khó nghe, bảng âm và từ của bốn giọng (revert, prepone, wasei-eigo, flap t, arvo…), thử nghiệm thật con số bị dính chữ khi giọng máy đọc nhanh, chiến thuật trước/trong/sau, nguồn luyện miễn phí, thói quen nghe 10 phút, bài chép chính tả con số.', content: L64(true) + L64(false) },
    { title: '6.5 — Lab: record a stand-up, a 3-minute demo and a meeting role-play|||6.5 — Lab: ghi âm một standup, một demo 3 phút và một buổi họp đóng vai', slug: 'tak-6-5-lab', type: 'LESSON', isFreePreview: true, description: 'Vòng kiểm ghi âm → Whisper (nghe.py) → kiem-noi.mjs (mã nguồn in đủ), làm mẫu trọn vòng với giọng máy, 12 câu cho thấy Whisper bắt được và bỏ sót lỗi phát âm nào, ba bài ghi âm có đáp án, thang chấm 30 điểm, năm câu phỏng vấn tiếng Anh về giao tiếp có đáp án mẫu.', content: L65(true) + L65(false) },
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
      slug: 'tak-6-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: câu standup tốt, nói vướng mắc, đọc mã ticket, yêu cầu mới khi demo, demo hỏng, xin nhắc lại, phản đối lịch sự, lời "không" gián tiếp, action item, Whisper chứng minh được gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions built from the stand-ups, demos and meetings of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu dựng từ chính các bài standup, demo và buổi họp trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ6 },
    },
  ],
};
