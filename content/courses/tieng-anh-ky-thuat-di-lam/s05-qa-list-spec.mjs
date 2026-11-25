/**
 * Tiếng Anh kỹ thuật khi đi làm — Chương 5: Q&A list và spec với khách hàng (soạn 24/11/2026).
 * Slug + title chương khớp khung trong ../tieng-anh-ky-thuat-di-lam.mjs (tak-5-1 … tak-5-5).
 * Mọi Q&A list, email mẫu và output là THẬT: kiem-qa.mjs (tự viết cho chương này, in nguyên văn ở bài 5.4) + kiem-email.mjs (bài 4.6)
 * chạy 24/11/2026 trong node:22-alpine (Node 22.23.5), --network none; so sánh spec bằng git 2.55 (git diff --no-index).
 * Dự án LabFlow, spec "Equipment Reservation" và khách Tanaka Yui là hư cấu.
 * Nguồn: RFC 2119/8174; Queensland Health Payroll System Commission of Inquiry Report (31/7/2013);
 * The Register 23/4/2019 (Hertz kiện Accenture); Bloomberg 2/5/2023 (Samsung cấm ChatGPT sau sự cố tải mã nội bộ);
 */
import { mau, saiDung, tuVung, Q, esc } from './_chung.mjs';
/* p0 — SINH TỰ ĐỘNG từ lab/ch5 bằng gen-p0.mjs (mẫu + output THẬT của kiem-qa.mjs / kiem-email.mjs / git diff). Đừng sửa tay. */
const EM = {"51-tot.csv":"No,Spec ref,Category,Question,Our proposal,Priority,Need by,Asked on,Answered by,Answer,Status\nQ-001,\"SRS 3.2.2, 4.1\",Business rule,Is the maximum length of one reservation 3 calendar days for students and 7 calendar days for teachers?,\"Yes. RS-02 blocks a longer slot and shows the limit. We remove \"\"reasonable period\"\" from 3.2.2.\",High,2026-11-25,2026-11-19,Tanaka Yui,Correct.,Closed\nQ-002,SRS 3.2.3,Business rule,Can a student have at most 3 active reservations at the same time?,\"3. \"\"Active\"\" = Pending or Approved and not yet returned.\",High,2026-11-25,2026-11-19,Tanaka Yui,\"Yes, at most 3.\",Closed\nQ-003,\"SRS 3.2.5, 4.3\",Business rule,\"When a teacher and a student request the same item for the same slot, should the teacher win even if the student requested first?\",\"Option A (our proposal): first come, first served; RS-02 shows the conflict to the teacher. Option B: the teacher wins and the student's Pending reservation is rejected with a reason.\",High,2026-11-25,2026-11-19,Tanaka Yui,Option B. Teachers must win. Please show the reason to the student.,Answered\nQ-004,SRS 3.3.1,Approval,Is approval by the lab manager mandatory for every reservation?,\"Yes, for every reservation. We read \"\"should\"\" in 3.3.1 as \"\"must\"\".\",High,2026-11-25,2026-11-19,Tanaka Yui,Mandatory. We will update the SRS.,Answered\nQ-005,SRS 3.3.2,Approval,\"Are the statuses of a reservation exactly Pending, Approved, Rejected, Cancelled, Picked up, Returned and No-show?\",\"Yes, these seven. The list in 3.3.2 is replaced by them; state diagram in attachment A1.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-006,SRS 3.4.1,Notification,Should the reminder be sent 24 hours before the start of the reservation?,\"24 hours before, by email and in-app (3.4.2). No reminder when the reservation starts less than 24 hours after it is approved.\",Medium,2026-11-27,2026-11-19,Tanaka Yui,\"Yes, 24 hours.\",Closed\nQ-007,SRS 3.5.2,No-show,Is a reservation released 30 minutes after the start of the slot when the item is not picked up?,30 minutes by default; each lab manager can set 15 to 120 minutes for their lab.,High,2026-11-25,2026-11-19,,,Open\nQ-008,SRS 3.5.3,No-show,\"After 3 no-shows in one semester, is the user blocked from new reservations for 14 days?\",\"3 no-shows per semester, blocked for 14 days; the lab manager can unblock a user.\",Medium,2026-11-27,2026-11-19,,,Open\n","51-xau.csv":"No,Spec ref,Category,Question,Our proposal,Priority,Need by,Asked on,Answered by,Answer,Status\nQ-001,,Rule,What is reasonable period? And how many reservations student can have?,,High,,2026-11-19,,,Open\nQ-002,3.3.1,Approval,Please explain the approval flow.,,Medium,,2026-11-19,,,Open\nQ-003,3.4.1,Notification,When send reminder?,,urgent,,2026-11-19,,,Open\nQ-004,3.5.2,No-show,Release after some time is how many minutes,,Medium,,2026-11-19,,,Open\nQ-005,4.2,Rule,Peak hours là giờ nào?,,Medium,,2026-11-19,,,Open\nQ-005,3.3.2,Status,Could you tell us all statuses of reservation?,,Low,,2026-11-19,Tanaka,\"Pending, Approved, Rejected, Cancelled\",Open\nQ7,5.1,Performance,\"The calendar must load fast, what is fast?\",,Medium,,2026-11-19,,,Done\nQ-008,3.2.3,Rule,How many reservations can a student have at the same time?,,Medium,,2026-11-19,,,Open\n","52-dong.csv":"No,Spec ref,Category,Question,Our proposal,Priority,Need by,Asked on,Answered by,Answer,Status\nQ-021,SRS 2.1,Data,\"Is the student ID always 2 capital letters followed by 6 digits, for example SE123456?\",\"We validate with the pattern ^[A-Z]{2}[0-9]{6}$ and show \"\"Invalid student ID\"\" otherwise.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-022,SRS 3.8,Equipment,Should the system block deleting equipment that still has active loans?,\"Block the delete and show the list of active loans. The admin can mark the item \"\"Retired\"\" instead.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-023,SRS 5.4,Security,\"When the session expires while a user is filling in a form, should we keep the input and ask them to log in again?\",\"Keep the input in the browser, show the login dialog, then submit. Session length stays 30 minutes.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-024,SRS 5.3,Usability,\"Is it enough to support the latest two versions of Chrome, Edge and Safari?\",\"Latest two versions of Chrome, Edge and Safari; Firefox best effort; no Internet Explorer.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-025,SRS 3.1,Equipment,Is 5 MB per photo (JPEG or PNG) an acceptable limit?,\"5 MB, JPEG or PNG; we resize to 1600 px wide on upload.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-026,SRS 5.4,Security,Is 30 minutes a correct lifetime for the password reset link?,\"30 minutes, single use; a new request cancels the old link.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-027,SRS 3.4,Notification,\"Can we use the overdue email draft in attachment A2 (subject, item, due date, link to return)?\",\"Draft A2: plain text, English and Japanese. Please mark any wording you want to change.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-028,SRS 2.3,Privacy,\"Can only the student, their teachers and the lab managers of that lab see the loan history of a student?\",Only those three roles. Administrators see it only in the audit log.,Medium,2026-11-27,2026-11-19,,,Open\n","52-mo.csv":"No,Spec ref,Category,Question,Our proposal,Priority,Need by,Asked on,Answered by,Answer,Status\nQ-021,SRS 2.1,Data,What is the format of the student ID?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-022,SRS 3.8,Equipment,How should the system handle deleted equipment that still has active loans?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-023,SRS 5.4,Security,What happens when the session expires while the user is filling in a form?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-024,SRS 5.3,Usability,Which browsers do we need to support?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-025,SRS 3.1,Equipment,What is the maximum file size for an equipment photo?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-026,SRS 5.4,Security,How long should the password reset link be valid?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-027,SRS 3.4,Notification,What should the overdue email say?,,Medium,2026-11-27,2026-11-19,,,Open\nQ-028,SRS 2.3,Privacy,Who can see the loan history of a student?,,Medium,2026-11-27,2026-11-19,,,Open\n","53-bt-dapan.txt":"Hi Tanaka-san, thanks for the three points about the Reservation screens. Quick summary:\n1. RS-02 title typo: we will fix it this sprint, no impact.\n2. Show who reserved an item: this shows a student's name to other students, so could you confirm it is allowed (privacy)? If yes, it is about 1 person-day; I'll add it to CR-003.\n3. Google Calendar export: new integration, about 4 person-days. Should we add it to CR-003 for 2.1?\nI'll update the Q&A list as Q-019 and Q-020 today.\n","53-cr.txt":"To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: SRS v0.4: 4 new items need a decision (CR-003) by 3 Dec\n\nHi Tanaka-san,\n\nThank you for SRS v0.4. Could you choose option A or B below for the four\nnew items by Thu 3 Dec? They are outside the scope we estimated for 2.0.\n\nWe compared v0.4 with v0.3 and found two kinds of change:\n\nClarifications (no impact, already in our plan):\n- 3.2.3 at most 3 active reservations (Q-002)\n- 3.4.1 reminder 24 hours before the start (Q-006)\n\nNew items, not in the estimate of 20 Nov (change request CR-003):\n- 3.7 room booking (screen RS-06): 8 person-days\n- 3.4.2 LINE notifications: 5 person-days, plus a LINE Official Account\n  on your side\n- 3.5.1 pick-up by QR code: 3 person-days\n- 3.6.2 PDF report: 2 person-days\nTotal: 18 person-days.\n\nOption A: add them to 2.0. The release moves from 18 Dec to 15 Jan.\nOption B (our proposal): keep 2.0 on 18 Dec and plan the four items\nfor 2.1 in January.\n\nOne more point: Q-004 (approval is mandatory) is not in v0.4 yet;\n3.3.1 still says \"should\". Could you change it to \"must\" in v0.5?\n\nThe detailed estimate is attached (CR-003.xlsx).\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n","53-xac-nhan.txt":"To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: Reservation SRS: 4 decisions from 26 Nov, please confirm by 27 Nov\n\nHi Tanaka-san,\n\nThank you for your time today. Please check the four decisions below and\nreply by Fri 27 Nov, 17:00 JST (15:00 ICT) if anything is wrong. If we do\nnot hear from you, we will start development on this basis on 30 Nov.\n\nAs discussed in today's meeting:\n1. Q-003: when a teacher and a student want the same slot, the teacher\n   wins. The student's reservation is rejected with the reason\n   \"Reserved by a teacher\" (SRS 3.2.5).\n2. Q-004: approval is mandatory for every reservation. You will change\n   \"should\" to \"must\" in SRS 3.3.1.\n3. Q-007: a reservation is released 30 minutes after the start of the\n   slot. Each lab can change this from 15 to 120 minutes.\n4. Q-010: reservations are possible 08:00-17:00 ICT, Monday to Friday,\n   except Vietnamese public holidays.\n\nStill open: Q-005 and Q-008 (you will reply by 1 Dec).\n\nI have updated the Q&A list (rows Q-003, Q-004, Q-007, Q-010).\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n","53-xau.txt":"To: Tanaka Yui <tanaka@client.example>\nSubject: Re: SRS v0.4\n\nDear Tanaka-san,\n\nThank you for the new version. No problem, we will follow SRS v0.4.\n\nBest regards,\nAn Nguyen\n","54-email.txt":"To: Tanaka Yui <tanaka@client.example>\nCc: Minh Tran <minh.tran@fpt.example>\nSubject: Reservation SRS v0.3: 18 questions, 7 needed by 25 Nov\n\nHi Tanaka-san,\n\nCould you answer the 18 questions in the attached Q&A list? The 7 marked\nHigh block the database design, so we need them by Wed 25 Nov,\n17:00 JST. The others are needed by 27 Nov or 2 Dec (see \"Need by\").\n\nEach question has our proposal. If you agree, \"Yes\" in the Answer column\nis enough.\n\nThe High questions are:\n- Q-001, Q-002, Q-003: length, number and priority of reservations\n- Q-004, Q-007: approval and no-show release time\n- Q-010: opening hours\n- Q-016: how long we keep reservation history\n\nBest regards,\nAn Nguyen\nLabFlow team, FPT Software\n","qa-list-dap-an.csv":"No,Spec ref,Category,Question,Our proposal,Priority,Need by,Asked on,Answered by,Answer,Status\nQ-001,\"SRS 3.2.2, 4.1\",Business rule,Is the maximum length of one reservation 3 calendar days for students and 7 calendar days for teachers?,\"Yes. RS-02 blocks a longer slot and shows the limit. We remove \"\"reasonable period\"\" from 3.2.2.\",High,2026-11-25,2026-11-19,,,Open\nQ-002,SRS 3.2.3,Business rule,Can a student have at most 3 active reservations at the same time?,\"3. \"\"Active\"\" = Pending or Approved and not yet returned.\",High,2026-11-25,2026-11-19,,,Open\nQ-003,\"SRS 3.2.5, 4.3\",Business rule,\"When a teacher and a student request the same item for the same slot, should the teacher win even if the student requested first?\",\"Option A (our proposal): first come, first served; RS-02 shows the conflict to the teacher. Option B: the teacher wins and the student's Pending reservation is rejected with a reason.\",High,2026-11-25,2026-11-19,,,Open\nQ-004,SRS 3.3.1,Approval,Is approval by the lab manager mandatory for every reservation?,\"Yes, for every reservation. We read \"\"should\"\" in 3.3.1 as \"\"must\"\".\",High,2026-11-25,2026-11-19,,,Open\nQ-005,SRS 3.3.2,Approval,\"Are the statuses of a reservation exactly Pending, Approved, Rejected, Cancelled, Picked up, Returned and No-show?\",\"Yes, these seven. The list in 3.3.2 is replaced by them; state diagram in attachment A1.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-006,SRS 3.4.1,Notification,Should the reminder be sent 24 hours before the start of the reservation?,\"24 hours before, by email and in-app (3.4.2). No reminder when the reservation starts less than 24 hours after it is approved.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-007,SRS 3.5.2,No-show,Is a reservation released 30 minutes after the start of the slot when the item is not picked up?,30 minutes by default; each lab manager can set 15 to 120 minutes for their lab.,High,2026-11-25,2026-11-19,,,Open\nQ-008,SRS 3.5.3,No-show,\"After 3 no-shows in one semester, is the user blocked from new reservations for 14 days?\",\"3 no-shows per semester, blocked for 14 days; the lab manager can unblock a user.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-009,SRS 3.5.4,Cancellation,May a user cancel a Pending or Approved reservation until the start of the slot without any penalty?,\"Yes. We read \"\"as same as before\"\" as the cancel rule of LabFlow 1.x loans (no penalty). After the start of the slot the no-show rule applies.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-010,SRS 4.2,Business rule,\"Does 4.2 mean that reservations are possible from 08:00 to 17:00 ICT, Monday to Friday, except Vietnamese public holidays?\",\"Yes. We replace \"\"peak hours\"\" with \"\"opening hours of the laboratory\"\", set per lab by the lab manager.\",High,2026-11-25,2026-11-19,,,Open\nQ-011,\"SRS 5.6, 3.6.1\",Time,\"Is \"\"local time\"\" in 5.6 Vietnam time (ICT, UTC+7) for every user and for the monthly report?\",\"Yes. We store times in UTC, show them in ICT, and cut the monthly report at midnight ICT.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-012,SRS 4.4,Approval,\"Is a \"\"class reservation\"\" one request of more than 5 items made by a teacher?\",\"Yes. It needs two approvals in this order: lab manager, then head of department. RS-03 shows both.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-013,SRS 3.1.3,Search,\"Should equipment under maintenance be shown as \"\"Under maintenance\"\" and not selectable, instead of hidden from the search?\",Shown but not selectable. Existing reservations in the maintenance period are cancelled with a notification.,Medium,2026-11-27,2026-11-19,,,Open\nQ-014,SRS 5.1,Performance,\"Is \"\"load fast\"\" in 5.1 met when the calendar of one laboratory loads in under 2 seconds for 95% of requests with 200 users at the same time?\",\"p95 under 2 s with 200 concurrent users, measured on the staging server before each release.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-015,SRS 5.3,Usability,\"Does \"\"work on mobile\"\" in 5.3 mean responsive web pages for RS-01, RS-02 and RS-04 only, with no native app?\",\"Responsive web from 360 px wide, latest Chrome and Safari. RS-03 and RS-05 stay desktop only.\",Medium,2026-11-27,2026-11-19,,,Open\nQ-016,SRS 5.5,Data,Is reservation history kept for 2 years and then anonymised (student name and student ID removed)?,\"2 years, then anonymised by a nightly job. The monthly report keeps only counts. Please check this with your data protection officer.\",High,2026-11-25,2026-11-19,,,Open\nQ-017,SRS 3.6.2,Report,Is the monthly report downloaded as an Excel file (.xlsx) only?,\".xlsx only. Any other format (PDF, CSV) would be a change request.\",Low,2026-12-02,2026-11-19,,,Open\nQ-018,SRS 7.2,Scope,Is the migration of the old Excel booking sheet out of scope for this phase?,\"Out of scope. If you need it, we will send a separate estimate.\",Low,2026-12-02,2026-11-19,,,Open\n"};
const OUT = {"51-open":"51-tot.csv: 8 questions — 3 open (1 high), 2 answered, 3 closed, 0 on hold\nno warnings\n\nOpen questions as of 2026-11-24 (oldest \"Need by\" first):\n- Q-007 [High, need by 2026-11-25] Is a reservation released 30 minutes after the start of the slot when the item is not p...\n- Q-005 [Medium, need by 2026-11-27] Are the statuses of a reservation exactly Pending, Approved, Rejected, Cancelled, Picke...\n- Q-008 [Medium, need by 2026-11-27] After 3 no-shows in one semester, is the user blocked from new reservations for 14 days?\nexit=0\n","51-tot":"51-tot.csv: 8 questions — 3 open (1 high), 2 answered, 3 closed, 0 on hold\nno warnings\nexit=0\n","51-xau":"51-xau.csv: 8 questions — 7 open (1 high), 0 answered, 0 closed, 0 on hold\n27 warning(s):\n  Q-001  NO-REF       no spec reference; write the section, e.g. \"SRS 3.2 / screen RS-02\"\n  Q-001  MULTI-Q      2 questions in one row; split them so each can be answered and closed alone\n  Q-001  OPEN-Q       starts with \"What\": turn it into a closed question (we assume X — correct?) or give options\n  Q-001  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-001  NO-DEADLINE  High priority without \"Need by\": the client cannot plan\n  Q-002  NO-QMARK     no question mark: is this a question, a request or a note?\n  Q-002  OPEN-Q       starts with \"Please explain\": turn it into a closed question (we assume X — correct?) or give options\n  Q-002  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-003  OPEN-Q       starts with \"When\": turn it into a closed question (we assume X — correct?) or give options\n  Q-003  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-003  PRIORITY     \"urgent\" is not High / Medium / Low\n  Q-004  NO-QMARK     no question mark: is this a question, a request or a note?\n  Q-004  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-004  VAGUE        \"some\" means different things to different people; use a number, a name or a list\n  Q-005  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-005  VIETNAMESE   Vietnamese text in a list the client reads\n  Q-005  ID-DUP       same number as another row; never reuse a number\n  Q-005  OPEN-Q       starts with \"Could you tell\": turn it into a closed question (we assume X — correct?) or give options\n  Q-005  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-005  STATUS       has an answer but is still Open; mark it Answered\n  Q7     ID           use Q-001, Q-002 … so people can say \"see Q-007\"\n  Q7     NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q7     VAGUE        \"fast\" means different things to different people; use a number, a name or a list\n  Q7     STATUS       \"Done\" is not one of Open / Answered / Closed / On hold\n  Q-008  OPEN-Q       starts with \"How\": turn it into a closed question (we assume X — correct?) or give options\n  Q-008  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-008  DUPLICATE    very similar to Q-001; merge them or explain the difference\nexit=1\n","52-dong":"52-dong.csv: 8 questions — 8 open (0 high), 0 answered, 0 closed, 0 on hold\nno warnings\nexit=0\n","52-mo":"52-mo.csv: 8 questions — 8 open (0 high), 0 answered, 0 closed, 0 on hold\n16 warning(s):\n  Q-021  OPEN-Q       starts with \"What\": turn it into a closed question (we assume X — correct?) or give options\n  Q-021  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-022  OPEN-Q       starts with \"How\": turn it into a closed question (we assume X — correct?) or give options\n  Q-022  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-023  OPEN-Q       starts with \"What\": turn it into a closed question (we assume X — correct?) or give options\n  Q-023  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-024  OPEN-Q       starts with \"Which\": turn it into a closed question (we assume X — correct?) or give options\n  Q-024  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-025  OPEN-Q       starts with \"What\": turn it into a closed question (we assume X — correct?) or give options\n  Q-025  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-026  OPEN-Q       starts with \"How\": turn it into a closed question (we assume X — correct?) or give options\n  Q-026  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-027  OPEN-Q       starts with \"What\": turn it into a closed question (we assume X — correct?) or give options\n  Q-027  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\n  Q-028  OPEN-Q       starts with \"Who\": turn it into a closed question (we assume X — correct?) or give options\n  Q-028  NO-PROPOSAL  no proposal: the client answers faster when they only need to say yes or no\nexit=1\n","53-diff":"diff --git a/srs-reservation-v0.3.txt b/srs-reservation-v0.4.txt\nindex fcfb9b7..6a2cbc5 100644\n--- a/srs-reservation-v0.3.txt\n+++ b/srs-reservation-v0.4.txt\n@@ -2,2 +2,2 @@ LabFlow 2.0 — Equipment Reservation\n-Software Requirements Specification (SRS), version 0.3 (draft)\n-Prepared by: Client IT Department          Date: 18 Nov 2026\n+Software Requirements Specification (SRS), version 0.4 (draft)\n+Prepared by: Client IT Department          Date: 30 Nov 2026\n@@ -14,2 +14 @@ reminders, no-show handling, and a monthly report.\n-Out of scope: payment, room booking, integration with the university\n-timetable system.\n+Out of scope: payment, integration with the university timetable system.\n@@ -36 +35 @@ timetable system.\n-3.2.3 A student can have a few active reservations at the same time.\n+3.2.3 A student can have at most 3 active reservations at the same time.\n@@ -48,2 +47,2 @@ timetable system.\n-3.4.1 The system sends a reminder before the reservation starts.\n-3.4.2 Notifications are sent by email and in-app.\n+3.4.1 The system sends a reminder 24 hours before the reservation starts.\n+3.4.2 Notifications are sent by email, in-app and LINE.\n@@ -52,2 +51,2 @@ timetable system.\n-3.5.1 The user picks up the item at the lab counter; the lab manager\n-      confirms the pick-up in LabFlow.\n+3.5.1 The user picks up the item at the lab counter by scanning the QR\n+      code of the reservation; the lab manager confirms the pick-up.\n@@ -63 +62,4 @@ timetable system.\n-3.6.2 The report can be downloaded in Excel or a similar format.\n+3.6.2 The report can be downloaded in Excel (.xlsx) and PDF.\n+\n+3.7 Room booking (screen RS-06)\n+3.7.1 Teachers can also book a laboratory room with the same screens.\n@@ -83 +85 @@ RS-03 Approval list          RS-04 My reservations\n-RS-05 Monthly report\n+RS-05 Monthly report         RS-06 Room booking\n","53-email":"53-xau.txt (email, 20 words): 1 warning(s)\n    3  ASK-NONE     no question or request found; what should the reader do?\n53-xac-nhan.txt (email, 151 words): OK\n53-cr.txt (email, 169 words): 1 warning(s)\n   18  CAPS         LINE LINE: capitals read as shouting\nexit=1\n","53-stale":"51-tot.csv: 8 questions — 3 open (1 high), 2 answered, 3 closed, 0 on hold\n6 warning(s):\n  Q-005  STALE        open for 11 days; follow up or raise it in the next meeting\n  Q-005  OVERDUE      \"Need by\" 2026-11-27 has passed; tell the PM what is blocked\n  Q-007  STALE        open for 11 days; follow up or raise it in the next meeting\n  Q-007  OVERDUE      \"Need by\" 2026-11-25 has passed; tell the PM what is blocked\n  Q-008  STALE        open for 11 days; follow up or raise it in the next meeting\n  Q-008  OVERDUE      \"Need by\" 2026-11-27 has passed; tell the PM what is blocked\n\nOpen questions as of 2026-11-30 (oldest \"Need by\" first):\n- Q-007 [High, need by 2026-11-25] Is a reservation released 30 minutes after the start of the slot when the item is not p...\n- Q-005 [Medium, need by 2026-11-27] Are the statuses of a reservation exactly Pending, Approved, Rejected, Cancelled, Picke...\n- Q-008 [Medium, need by 2026-11-27] After 3 no-shows in one semester, is the user blocked from new reservations for 14 days?\nexit=1\n","5x-email2":"53-bt-dapan.txt (chat, 84 words): OK\n54-email.txt (email, 94 words): OK\nexit=0\n","lab54":"qa-list-dap-an.csv: 18 questions — 18 open (7 high), 0 answered, 0 closed, 0 on hold\nno warnings\nexit=0\n","node-version":"v22.23.5\n"};
const KIEMQA = "#!/usr/bin/env node\n// kiem-qa.mjs — checks a Q&A list saved as CSV (Technical English at Work, chapter 5).\n// Usage: node kiem-qa.mjs <file.csv> [--today=YYYY-MM-DD] [--open]\n//   --today  date used to find questions that waited too long (default: today)\n//   --open   also print the open questions, oldest \"Need by\" first (paste into your weekly email)\n// Columns (header row, any order): No, Spec ref, Category, Question, Our proposal, Priority,\n//                                  Need by, Asked on, Answered by, Answer, Status\n// It only checks habits that are easy to detect. Passing it does NOT mean the questions are good.\nimport { readFileSync } from 'node:fs';\nimport { basename } from 'node:path';\n\nconst args = process.argv.slice(2);\nconst file = args.find((a) => !a.startsWith('--'));\nif (!file) { console.error('usage: node kiem-qa.mjs <file.csv> [--today=YYYY-MM-DD] [--open]'); process.exit(2); }\nconst today = (args.find((a) => a.startsWith('--today=')) || '').slice(8) || new Date().toISOString().slice(0, 10);\n\n// Minimal CSV reader (RFC 4180): commas, \"quoted, fields\", \"\" inside quotes, line breaks inside quotes.\nfunction parseCsv(text) {\n  const rows = []; let row = []; let f = ''; let q = false;\n  for (let i = 0; i < text.length; i++) {\n    const c = text[i];\n    if (q) { if (c === '\"' && text[i + 1] === '\"') { f += '\"'; i++; } else if (c === '\"') q = false; else f += c; }\n    else if (c === '\"') q = true;\n    else if (c === ',') { row.push(f); f = ''; }\n    else if (c === '\\n') { row.push(f); rows.push(row); row = []; f = ''; }\n    else if (c !== '\\r') f += c;\n  }\n  if (f || row.length) { row.push(f); rows.push(row); }\n  return rows.filter((r) => r.some((x) => x.trim()));\n}\n\nconst [head, ...data] = parseCsv(readFileSync(file, 'utf8').replace(/^﻿/, ''));\nconst col = Object.fromEntries(head.map((h, i) => [h.trim().toLowerCase(), i]));\nconst need = ['no', 'spec ref', 'question', 'our proposal', 'priority', 'need by', 'asked on', 'answer', 'status'];\nconst missing = need.filter((c) => !(c in col));\nif (missing.length) { console.error(`${basename(file)}: missing column(s): ${missing.join(', ')}`); process.exit(2); }\nconst get = (r, c) => (c in col ? (r[col[c]] || '').trim() : '');\n\nconst STATUS = ['Open', 'Answered', 'Closed', 'On hold'];\nconst PRIORITY = ['High', 'Medium', 'Low'];\nconst OPEN_START = /^(what|how|why|which|when|where|who|please (explain|clarify|advise|tell|describe)|could you (please )?(explain|clarify|tell|describe|advise)|can you (please )?(explain|clarify|tell|describe)|any (comment|idea|feedback)|is there any (rule|spec|requirement))\\b/i;\nconst VAGUE = /\\b(etc\\.?|and so on|appropriate(ly)?|as usual|normal(ly)?|some|TBD|ASAP|properly|user-friendly|fast|soon)\\b/i;\nconst STOP = new Set('a an the is are was be to of in on for and or if we our you your it this that with by as at from can should will do does not no yes what how when which who there please correct assume proposal'.split(' '));\nconst words = (s) => new Set((s.toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => w.length > 2 && !STOP.has(w)));\nconst days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);\n\nconst out = [];\nconst warn = (no, code, msg) => out.push(`  ${no.padEnd(6)} ${code.padEnd(12)} ${msg}`);\nconst seen = new Map(); let lastNum = 0;\nconst rows = data.map((r) => ({ no: get(r, 'no'), ref: get(r, 'spec ref'), q: get(r, 'question'), p: get(r, 'our proposal'), pri: get(r, 'priority'),\n  by: get(r, 'need by'), on: get(r, 'asked on'), who: get(r, 'answered by'), a: get(r, 'answer'), st: get(r, 'status') }));\n\nfor (const x of rows) {\n  const no = x.no || '?';\n  if (!/^Q-\\d{3}$/.test(x.no)) warn(no, 'ID', 'use Q-001, Q-002 … so people can say \"see Q-007\"');\n  else {\n    const n = Number(x.no.slice(2));\n    if (seen.has(x.no)) warn(no, 'ID-DUP', `same number as another row; never reuse a number`);\n    else if (n < lastNum) warn(no, 'ID-ORDER', `comes after Q-${String(lastNum).padStart(3, '0')}; keep rows in the order they were asked`);\n    seen.set(x.no, true); lastNum = Math.max(lastNum, n);\n  }\n  if (!x.ref) warn(no, 'NO-REF', 'no spec reference; write the section, e.g. \"SRS 3.2 / screen RS-02\"');\n  const qmarks = (x.q.match(/\\?/g) || []).length;\n  if (qmarks > 1) warn(no, 'MULTI-Q', `${qmarks} questions in one row; split them so each can be answered and closed alone`);\n  if (qmarks === 0 && !/^(we assume|please confirm)/i.test(x.q)) warn(no, 'NO-QMARK', 'no question mark: is this a question, a request or a note?');\n  // \"When X happens, should we …?\" is closed: look at the main clause after the last comma.\n  const main = /,\\s*(should|is|are|can|could|do|does|will|may|must|shall)\\b/i.test(x.q) ? x.q.slice(x.q.search(/,\\s*(should|is|are|can|could|do|does|will|may|must|shall)\\b/i) + 1).trim() : x.q;\n  if (OPEN_START.test(main) && !/\\b(A\\)|\\(a\\)|option|or)\\b/i.test(x.q)) warn(no, 'OPEN-Q', `starts with \"${main.match(OPEN_START)[0]}\": turn it into a closed question (we assume X — correct?) or give options`);\n  if (!x.p && x.st !== 'Closed') warn(no, 'NO-PROPOSAL', 'no proposal: the client answers faster when they only need to say yes or no');\n  const vq = (x.q + ' ' + x.p).replace(/\"[^\"]*\"/g, '').match(VAGUE); // words \"in quotes\" are quoted from the spec: fine\n  if (vq) warn(no, 'VAGUE', `\"${vq[0]}\" means different things to different people; use a number, a name or a list`);\n  if (/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(x.q + x.p)) warn(no, 'VIETNAMESE', 'Vietnamese text in a list the client reads');\n  const n = (x.q.match(/\\S+/g) || []).length;\n  if (n > 60) warn(no, 'LONG', `${n} words; move the background to \"Our proposal\" or a screenshot`);\n  if (!PRIORITY.includes(x.pri)) warn(no, 'PRIORITY', `\"${x.pri}\" is not High / Medium / Low`);\n  if (x.pri === 'High' && !x.by) warn(no, 'NO-DEADLINE', 'High priority without \"Need by\": the client cannot plan');\n  if (!STATUS.includes(x.st)) warn(no, 'STATUS', `\"${x.st}\" is not one of ${STATUS.join(' / ')}`);\n  if (x.st === 'Open' && x.a) warn(no, 'STATUS', 'has an answer but is still Open; mark it Answered');\n  if ((x.st === 'Answered' || x.st === 'Closed') && !x.a) warn(no, 'NO-ANSWER', `${x.st} without an answer; copy the answer (or link the email) into the row`);\n  if ((x.st === 'Answered' || x.st === 'Closed') && !x.who) warn(no, 'NO-WHO', 'who answered? write the name — it is your evidence later');\n  if (x.st === 'Open' && x.on && days(x.on, today) > 7) warn(no, 'STALE', `open for ${days(x.on, today)} days; follow up or raise it in the next meeting`);\n  if (x.st === 'Open' && x.by && x.by < today) warn(no, 'OVERDUE', `\"Need by\" ${x.by} has passed; tell the PM what is blocked`);\n}\n// Near-duplicate questions: more than half of the content words are shared.\nfor (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {\n  const a = words(rows[i].q), b = words(rows[j].q);\n  const common = [...a].filter((w) => b.has(w)).length;\n  if (a.size && b.size && common / Math.min(a.size, b.size) > 0.6) warn(rows[j].no || '?', 'DUPLICATE', `very similar to ${rows[i].no}; merge them or explain the difference`);\n}\n\nconst count = (s) => rows.filter((x) => x.st === s).length;\nconst highOpen = rows.filter((x) => x.st === 'Open' && x.pri === 'High').length;\nconsole.log(`${basename(file)}: ${rows.length} questions — ${count('Open')} open (${highOpen} high), ${count('Answered')} answered, ${count('Closed')} closed, ${count('On hold')} on hold`);\nconsole.log(out.length ? `${out.length} warning(s):` : 'no warnings');\nout.forEach((o) => console.log(o));\nif (args.includes('--open')) {\n  const open = rows.filter((x) => x.st === 'Open').sort((a, b) => (a.by || '9999').localeCompare(b.by || '9999'));\n  console.log(`\\nOpen questions as of ${today} (oldest \"Need by\" first):`);\n  for (const x of open) console.log(`- ${x.no} [${x.pri}${x.by ? ', need by ' + x.by : ''}] ${x.q.length > 90 ? x.q.slice(0, 87) + '...' : x.q}`);\n}\nprocess.exitCode = out.length ? 1 : 0;\n";
const SPEC3 = "LabFlow 2.0 — Equipment Reservation\nSoftware Requirements Specification (SRS), version 0.3 (draft)\nPrepared by: Client IT Department          Date: 18 Nov 2026\nStatus: Draft for vendor review\n\n1. Introduction\n1.1 Purpose\nThis document describes the requirements of the Equipment Reservation\nfunction of LabFlow 2.0. Today a student can only borrow equipment that is\non the shelf. In 2.0, a student can reserve equipment for a future time slot.\n1.2 Scope\nIn scope: reservation by students and teachers, approval by lab managers,\nreminders, no-show handling, and a monthly report.\nOut of scope: payment, room booking, integration with the university\ntimetable system.\n1.3 Definitions\n- Lab manager: staff member responsible for one laboratory.\n- Slot: a period of time between a start time and an end time.\n- No-show: the user does not pick up reserved equipment.\n\n2. Users and roles\n2.1 Students can reserve equipment of the labs of their department.\n2.2 Teachers can reserve equipment for themselves or on behalf of students.\n2.3 Lab managers approve or reject reservations of their laboratory.\n2.4 Administrators manage equipment and users, as same as LabFlow 1.x.\n\n3. Functional requirements\n3.1 Search (screen RS-01)\n3.1.1 The user searches equipment by name, category and laboratory.\n3.1.2 The result shows the availability of each item for the next days.\n3.1.3 Equipment under maintenance should not be reserved.\n\n3.2 Create a reservation (screen RS-02)\n3.2.1 The user selects an item and a slot, then submits the reservation.\n3.2.2 A student can reserve one item for a reasonable period, maximum 3 days.\n3.2.3 A student can have a few active reservations at the same time.\n3.2.4 Reservations must be made at least 1 day in advance.\n3.2.5 If two users request the same item for the same slot, the system\n      decides according to the priority rule.\n\n3.3 Approval (screen RS-03)\n3.3.1 Reservations should be approved by the lab manager.\n3.3.2 The lab manager sees the list of pending reservations with their\n      status (Pending, Approved, Rejected, etc.).\n3.3.3 When a reservation is rejected, the user is notified with the reason.\n\n3.4 Reminders and notifications\n3.4.1 The system sends a reminder before the reservation starts.\n3.4.2 Notifications are sent by email and in-app.\n\n3.5 Pick-up, return and no-show\n3.5.1 The user picks up the item at the lab counter; the lab manager\n      confirms the pick-up in LabFlow.\n3.5.2 If the user does not pick up the item, the reservation is released\n      after some time and the user is counted as a no-show.\n3.5.3 A user with too many no-shows cannot reserve for some days.\n3.5.4 A cancelled reservation is handled as same as before.\n\n3.6 Monthly report (screen RS-05)\n3.6.1 On the first business day of each month, the system creates a report\n      of the previous month: number of reservations, approval rate,\n      no-show rate, and the top 10 items.\n3.6.2 The report can be downloaded in Excel or a similar format.\n\n4. Business rules\n4.1 Teachers can reserve an item for up to one week.\n4.2 Reservations are possible only during peak hours and business days.\n4.3 Priority rule: teachers have priority over students.\n4.4 A reservation for a class (more than 5 items) needs the approval of the\n    head of department.\n\n5. Non-functional requirements\n5.1 Performance: the availability calendar must load fast.\n5.2 Availability: the system is available 24/7 except planned maintenance.\n5.3 Usability: the screens should also work on mobile.\n5.4 Security: login with the university single sign-on (SSO), as LabFlow 1.x.\n5.5 Data: reservation history is kept for analysis.\n5.6 Time: all times are shown in local time.\n\n6. Screens\nRS-01 Search equipment       RS-02 Create reservation\nRS-03 Approval list          RS-04 My reservations\nRS-05 Monthly report\n\n7. Open points\n7.1 The design of the e-mail templates will be decided later.\n7.2 The data migration from the Excel booking sheet is to be discussed.\n";

const lienKet = (href, ico, tieuDe, phu) => `
<a class="link-card lien-ket-cheo" href="${href}">
  <span class="lc-ico">${ico}</span>
  <span class="lc-body"><span class="lc-title">${tieuDe}</span><span class="lc-sub">${phu}</span></span>
</a>`;
const E = (f, nhan) => mau(EM[f], nhan);
const RUN = (key, cmd, nhan) => mau(`$ ${cmd}\n` + OUT[key].replace(/exit=(\d+)\n?$/, '$ echo $?\n$1'), nhan);
const NOTE_RUN = (en) => en ? 'Real output — kiem-qa.mjs (lesson 5.4) inside node:22-alpine, Node 22.23.5, 24 Nov 2026.' : 'Output THẬT — kiem-qa.mjs (bài 5.4) chạy trong node:22-alpine, Node 22.23.5, 24/11/2026.';
const NOTE_EMAIL = (en) => en ? 'Real output — kiem-email.mjs from lesson 4.6, same container, 24 Nov 2026.' : 'Output THẬT — kiem-email.mjs của bài 4.6, cùng container, 24/11/2026.';

/* Đọc CSV (RFC 4180, giống kiem-qa.mjs) để vẽ bảng Q&A list ngay trong bài. */
function csv(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else if (c !== '\r') f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}
/** Bảng HTML từ một tệp CSV mẫu; cot = danh sách tên cột cần hiện (mặc định: tất cả). */
const bangQA = (f, cot, nhan = '') => {
  const [h, ...d] = csv(EM[f]);
  const idx = (cot || h).map((c) => h.indexOf(c));
  return (nhan ? `<p class="note-ct">${nhan}</p>` : '') + `<table>
<thead><tr>${idx.map((i) => `<th>${esc(h[i])}</th>`).join('')}</tr></thead>
<tbody>
${d.map((r) => `<tr>${idx.map((i) => `<td>${esc(r[i] || '')}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table>`;
};
const COT_NGAN = ['No', 'Spec ref', 'Question', 'Our proposal', 'Priority', 'Status'];

/* ═════════════ 5.1 — Q&A list ═════════════ */
const L51 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 5 · Writing' : 'Chương 5 · Viết'}</span>
<h2>${en ? '5.1 — The Q&amp;A list: columns, numbering, status, who answers' : '5.1 — Q&amp;A list: các cột, đánh số, trạng thái, ai trả lời'}</h2>
<p class="lead">${en
    ? 'Two or three questions fit in an email. Twenty do not: answers come back in different threads, one question gets two answers, another gets none, and three weeks later nobody can say what was agreed. Outsourcing teams solve this with one shared table — the <strong>Q&amp;A list</strong> (Japanese clients often call it the QA表, "QA sheet"). It is where questions live until they are closed, and it is the evidence you show when someone asks "who decided this?".'
    : 'Hai, ba câu hỏi thì gửi email được. Hai mươi câu thì không: câu trả lời về ở nhiều luồng khác nhau, câu được hai câu trả lời, câu không ai trả lời, ba tuần sau không ai nói được đã chốt gì. Đội outsourcing giải quyết bằng một bảng dùng chung — <strong>Q&amp;A list</strong> (khách Nhật hay gọi là QA表, "bảng QA"). Câu hỏi sống ở đó tới khi được đóng, và bảng đó là bằng chứng khi có người hỏi "ai quyết định cái này?".'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A family that shouts "we need milk!" from the kitchen buys milk twice or not at all. A family with a shopping list on the fridge — one line per item, crossed out when bought — does not. The Q&amp;A list is the list on the fridge: one line per question, and a question is only crossed out when it is really done.'
    : 'Nhà nào hét từ bếp "hết sữa rồi!" thì hoặc mua sữa hai lần, hoặc chẳng ai mua. Nhà dán danh sách đi chợ trên tủ lạnh — mỗi món một dòng, mua rồi mới gạch — thì không. Q&amp;A list chính là tờ danh sách trên tủ lạnh: mỗi câu hỏi một dòng, và chỉ gạch khi thật sự xong.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'LabFlow 2.0 adds <strong>equipment reservation</strong>: students book an item for a future slot. The client (Tanaka-san, IT department) sent SRS v0.3 on 18 Nov (you will read all three pages in lesson 5.4). An, a new member of the FPT Software team, read it and wrote his first Q&amp;A list in Excel. The team uses CSV so the list can live in Git and be checked by a small tool. Here is An’s first version:'
    : 'LabFlow 2.0 thêm chức năng <strong>đặt trước thiết bị</strong>: sinh viên giữ chỗ một thiết bị cho khung giờ sau này. Khách (Tanaka-san, phòng IT) gửi SRS v0.3 ngày 18/11 (bài 5.4 có đủ ba trang). An, thành viên mới của đội FPT Software, đọc xong và lập Q&amp;A list đầu tiên bằng Excel. Đội lưu bảng dạng CSV để đặt trong Git và kiểm bằng một công cụ nhỏ. Đây là bản đầu của An:'}</p>
${bangQA('51-xau.csv', ['No', 'Spec ref', 'Category', 'Question', 'Our proposal', 'Priority', 'Answer', 'Status'], en ? 'mau/51-xau.csv — first version (Need by, Asked on, Answered by columns hidden here).' : 'mau/51-xau.csv — bản đầu (ẩn bớt các cột Need by, Asked on, Answered by cho gọn).')}
<p>${en
    ? 'Looks fine at a glance? Run the checker from lesson 5.4 on it:'
    : 'Nhìn qua có vẻ ổn? Chạy công cụ kiểm của bài 5.4:'}</p>
${RUN('51-xau', 'node kiem-qa.mjs mau/51-xau.csv --today=2026-11-24', NOTE_RUN(en))}
<p>${en
    ? 'Twenty-seven warnings for eight rows. Group them and you get the six habits that make a Q&amp;A list fail:'
    : 'Hai mươi bảy cảnh báo cho tám dòng. Gom lại thành sáu thói quen làm hỏng một Q&amp;A list:'}</p>
<ol>
<li>${en ? '<strong>Two questions in one row</strong> (Q-001). The client answers the first and forgets the second; the row can never be closed.' : '<strong>Hai câu hỏi trong một dòng</strong> (Q-001). Khách trả lời câu đầu, quên câu sau; dòng đó không bao giờ đóng được.'}</li>
<li>${en ? '<strong>Open questions with no proposal</strong> ("Please explain the approval flow.") — the client must write an essay. Lesson 5.2 fixes this.' : '<strong>Câu hỏi mở, không có đề xuất</strong> ("Please explain the approval flow.") — khách phải viết cả bài văn. Bài 5.2 chữa đúng lỗi này.'}</li>
<li>${en ? '<strong>No location</strong>: no spec section, so the client must search for what you mean.' : '<strong>Không chỉ chỗ</strong>: không ghi mục spec, khách phải tự đi tìm bạn đang nói tới đâu.'}</li>
<li>${en ? '<strong>Broken numbering</strong>: two Q-005, a "Q7". People will say "see Q-005" and mean different rows.' : '<strong>Đánh số hỏng</strong>: hai dòng Q-005, một dòng "Q7". Người ta nói "xem Q-005" mà mỗi người hiểu một dòng.'}</li>
<li>${en ? '<strong>Status that lies</strong>: Q-005 has an answer but is still Open; Q7 is "Done", a word the team never defined.' : '<strong>Trạng thái nói dối</strong>: Q-005 đã có câu trả lời mà vẫn Open; Q7 ghi "Done", một chữ cả đội chưa từng định nghĩa.'}</li>
<li>${en ? '<strong>Language</strong>: Vietnamese in a client document, and Vietnamese word order in English ("Release after some time is how many minutes").' : '<strong>Ngôn ngữ</strong>: tiếng Việt lọt vào tài liệu gửi khách, và câu tiếng Anh theo trật tự tiếng Việt ("Release after some time is how many minutes").'}</li>
</ol>

<h3>${en ? 'The columns and what goes in them' : 'Các cột và nội dung từng cột'}</h3>
<table>
<thead><tr><th>${en ? 'Column' : 'Cột'}</th><th>${en ? 'What to write' : 'Ghi gì'}</th><th>${en ? 'Example' : 'Ví dụ'}</th></tr></thead>
<tbody>
<tr><td><strong>No</strong></td><td>${en ? 'Fixed ID, never reused or renumbered, even if a row is cancelled.' : 'Mã cố định, không dùng lại, không đánh số lại, kể cả khi huỷ một dòng.'}</td><td>Q-007</td></tr>
<tr><td><strong>Spec ref</strong></td><td>${en ? 'Document + section, screen ID or line. Enough to find it in 10 seconds.' : 'Tài liệu + mục, mã màn hình hoặc dòng. Đủ để tìm ra trong 10 giây.'}</td><td>SRS 3.5.2</td></tr>
<tr><td><strong>Category</strong></td><td>${en ? 'Lets the client forward a group of rows to the right person.' : 'Giúp khách chuyển cả nhóm dòng cho đúng người.'}</td><td>No-show</td></tr>
<tr><td><strong>Question</strong></td><td>${en ? 'One question, closed if possible, one or two sentences.' : 'Một câu hỏi, nên là câu đóng, một hai câu.'}</td><td><em>Is a reservation released 30 minutes after the start of the slot…?</em></td></tr>
<tr><td><strong>Our proposal</strong></td><td>${en ? 'What you would do if nobody answered. Background goes here, not in the question.' : 'Bạn sẽ làm gì nếu không ai trả lời. Bối cảnh để ở đây, không nhồi vào câu hỏi.'}</td><td><em>30 minutes by default; each lab manager can set 15 to 120.</em></td></tr>
<tr><td><strong>Priority</strong></td><td>${en ? 'High = blocks work now. Medium = needed this sprint. Low = can wait.' : 'High = đang chặn việc. Medium = cần trong sprint này. Low = chờ được.'}</td><td>High</td></tr>
<tr><td><strong>Need by</strong></td><td>${en ? 'Date (YYYY-MM-DD). Without it, "High" is just an emotion.' : 'Ngày (YYYY-MM-DD). Không có ngày thì "High" chỉ là cảm xúc.'}</td><td>2026-11-25</td></tr>
<tr><td><strong>Asked on</strong></td><td>${en ? 'When you sent it — shows how long it has waited.' : 'Ngày gửi — cho biết câu hỏi đã chờ bao lâu.'}</td><td>2026-11-19</td></tr>
<tr><td><strong>Answered by</strong></td><td>${en ? 'Name of the person who answered: your evidence later.' : 'Tên người trả lời: bằng chứng về sau.'}</td><td>Tanaka Yui</td></tr>
<tr><td><strong>Answer</strong></td><td>${en ? 'Their words, copied exactly (or a link to the email).' : 'Nguyên văn lời khách (hoặc liên kết tới email).'}</td><td><em>Option B. Teachers must win.</em></td></tr>
<tr><td><strong>Status</strong></td><td>${en ? 'Open / Answered / Closed / On hold — see below.' : 'Open / Answered / Closed / On hold — xem dưới.'}</td><td>Answered</td></tr>
</tbody>
</table>
<p>${en
    ? 'Many teams add <strong>Asked by</strong>, <strong>Answer date</strong> and <strong>Reflected in</strong> ("SRS v0.5", "LAB-312") — the last one proves the answer reached the spec or the ticket. Use the client’s template if they have one; the columns above are what every good template contains.'
    : 'Nhiều đội thêm cột <strong>Asked by</strong>, <strong>Answer date</strong> và <strong>Reflected in</strong> ("SRS v0.5", "LAB-312") — cột cuối chứng minh câu trả lời đã vào spec hoặc ticket. Khách có mẫu riêng thì dùng mẫu của khách; các cột trên là thứ mẫu tốt nào cũng có.'}</p>

<h3>${en ? 'The life of one question' : 'Vòng đời một câu hỏi'}</h3>
${mau(`
  Open ──(client answers)──► Answered ──(team agrees + updates spec/ticket)──► Closed
    │                            │
    │                            └─(answer is unclear)──► Open  (+ follow-up in the same row)
    └─(client: "decide later")──► On hold ──(date to revisit)──► Open
`, en ? 'Status flow used in this course (agree it with your team on day one).' : 'Luồng trạng thái dùng trong khoá (thống nhất với đội ngay ngày đầu).')}
<ul>
<li>${en ? '<strong>Answered ≠ Closed.</strong> "Answered" means the client replied. "Closed" means your team accepted the answer <em>and</em> it is now in the spec or a ticket. Most lost requirements are rows that stayed "Answered" forever.' : '<strong>Answered ≠ Closed.</strong> "Answered" là khách đã trả lời. "Closed" là đội đã chấp nhận câu trả lời <em>và</em> nó đã nằm trong spec hoặc ticket. Phần lớn yêu cầu bị rơi mất là những dòng nằm mãi ở "Answered".'}</li>
<li>${en ? 'If the answer raises a new question, write the follow-up in the same row ("Follow-up 26 Nov: …") or open a new row that says "see Q-003". Never edit the client’s answer.' : 'Câu trả lời sinh ra câu hỏi mới: ghi tiếp trong cùng dòng ("Follow-up 26 Nov: …") hoặc mở dòng mới ghi "see Q-003". Không bao giờ sửa câu trả lời của khách.'}</li>
<li>${en ? 'Never delete a row. A question that became irrelevant is "Closed" with the answer "Not needed: screen RS-04 removed (SRS v0.5)".' : 'Không bao giờ xoá dòng. Câu không còn cần thì "Closed" với câu trả lời "Not needed: screen RS-04 removed (SRS v0.5)".'}</li>
</ul>

<h3>${en ? 'The fixed list' : 'Bản đã sửa'}</h3>
<p>${en
    ? 'An rewrote the list (one question per row, closed questions with a proposal, references, dates). Five days later Tanaka-san had answered five rows; An moved three of them to Closed after updating the tickets:'
    : 'An viết lại bảng (mỗi dòng một câu, câu hỏi đóng kèm đề xuất, có tham chiếu, có ngày). Năm ngày sau Tanaka-san đã trả lời năm dòng; An chuyển ba dòng sang Closed sau khi cập nhật ticket:'}</p>
${bangQA('51-tot.csv', ['No', 'Spec ref', 'Question', 'Our proposal', 'Priority', 'Need by', 'Answer', 'Status'], en ? 'mau/51-tot.csv — state on 24 Nov.' : 'mau/51-tot.csv — trạng thái ngày 24/11.')}
${RUN('51-open', 'node kiem-qa.mjs mau/51-tot.csv --today=2026-11-24 --open', NOTE_RUN(en))}
<p>${en
    ? 'The <code>--open</code> part is ready to paste into the weekly status email or the meeting agenda: open questions, the most urgent first. Q-003 and Q-004 are "Answered", not "Closed": Q-004’s answer says "We will update the SRS" — An keeps it Answered until the new SRS really contains it (lesson 5.3 shows that it did not).'
    : 'Phần <code>--open</code> dán thẳng vào email tình hình hằng tuần hoặc chương trình họp: các câu còn mở, gấp nhất lên đầu. Q-003 và Q-004 là "Answered" chứ chưa "Closed": câu trả lời Q-004 ghi "We will update the SRS" — An để Answered tới khi SRS mới thật sự có nội dung đó (bài 5.3 cho thấy nó đã không có).'}</p>

<h3>${en ? 'Rules that keep a Q&amp;A list useful' : 'Luật giữ cho Q&amp;A list dùng được'}</h3>
<ol>
<li>${en ? '<strong>One list per project</strong> (or per document), in one place both sides can open: the client’s SharePoint/Backlog/Jira, or a sheet they approve. Not five Excel files called <code>QA_final_v3_new.xlsx</code>.' : '<strong>Mỗi dự án một bảng</strong> (hoặc mỗi tài liệu một bảng), đặt ở nơi cả hai bên mở được: SharePoint/Backlog/Jira của khách, hoặc bảng tính khách đồng ý. Không phải năm tệp Excel tên <code>QA_final_v3_new.xlsx</code>.'}</li>
<li>${en ? '<strong>Check before you add</strong>: search the list (Ctrl+F) for the same spec section. A duplicate makes the client answer twice — and maybe differently.' : '<strong>Tìm trước khi thêm</strong>: tìm trong bảng (Ctrl+F) theo mục spec. Câu trùng bắt khách trả lời hai lần — có khi hai kiểu khác nhau.'}</li>
<li>${en ? '<strong>Send in batches</strong>, not one email per question: "We added Q-011 to Q-018 (2 High, need by 25 Nov)."' : '<strong>Gửi theo đợt</strong>, không mỗi câu một email: "We added Q-011 to Q-018 (2 High, need by 25 Nov)."'}</li>
<li>${en ? '<strong>Review the open rows</strong> in every client meeting. A row open for more than a week is a risk for the PM, not just a question.' : '<strong>Rà các dòng Open</strong> trong mỗi buổi họp với khách. Dòng mở quá một tuần là rủi ro của PM, không chỉ là câu hỏi.'}</li>
<li>${en ? '<strong>Internal questions stay internal.</strong> "Should we use Redis?" is for your team lead, not the client’s list.' : '<strong>Câu hỏi nội bộ để nội bộ.</strong> "Có nên dùng Redis không?" là câu hỏi trưởng nhóm, không đưa vào bảng của khách.'}</li>
</ol>

<h3>${en ? 'Mistakes Vietnamese writers often make' : 'Lỗi người Việt hay mắc'}</h3>
${saiDung([
    ['When send reminder?', 'Should the reminder be sent 24 hours before the start?', en ? 'English questions need an auxiliary (do/does/is/should/can) before the subject.' : 'Câu hỏi tiếng Anh cần trợ động từ (do/does/is/should/can) đứng trước chủ ngữ.'],
    ['Release after some time is how many minutes', 'Is a reservation released 30 minutes after the start of the slot?', en ? 'Vietnamese order ("… là bao nhiêu phút") does not work in English; put the number in the question.' : 'Trật tự tiếng Việt ("… là bao nhiêu phút") không dùng được trong tiếng Anh; đưa con số vào câu hỏi.'],
    ['Please explain the approval flow.', 'Is approval by the lab manager mandatory for every reservation?', en ? 'Ask about the one point you do not know, not the whole topic.' : 'Hỏi đúng điểm mình chưa biết, đừng hỏi cả chủ đề.'],
    ['Status: Done / OK / Finish', 'Status: Closed', en ? 'Use only the agreed words, so a filter works.' : 'Chỉ dùng chữ đã thống nhất, để lọc bảng được.'],
    ['How many reservations student can have?', 'How many reservations can a student have?', en ? 'Inversion (can a student) + article (a student).' : 'Đảo trợ động từ (can a student) + mạo từ (a student).'],
  ], en)}

<h3>🕵️ ${en ? 'Hacker corner: a Q&amp;A list is a confidential document' : 'Góc hacker: Q&amp;A list là tài liệu mật'}</h3>
<p>${en
    ? 'A Q&amp;A list quotes the client’s spec, business rules, sometimes screenshots with real data. In early 2023 Samsung engineers were reported to have pasted internal source code and meeting notes into ChatGPT to fix and summarise them; on 2 May 2023 Bloomberg reported that Samsung had banned generative AI tools on company devices. Nobody "hacked" anything — the data left through a helpful website.'
    : 'Q&amp;A list trích spec, luật nghiệp vụ của khách, có khi kèm ảnh chụp dữ liệu thật. Đầu năm 2023, báo chí đưa tin kỹ sư Samsung dán mã nguồn nội bộ và biên bản họp vào ChatGPT để sửa lỗi, tóm tắt; ngày 2/5/2023 Bloomberg đưa tin Samsung cấm công cụ AI tạo sinh trên thiết bị công ty. Không ai "hack" gì cả — dữ liệu ra ngoài qua một trang web rất hữu ích.'}</p>
<ul>
<li>${en ? 'Keep the list where the client’s NDA allows: their tool or your company’s. Never a personal Google Drive with "Anyone with the link".' : 'Để bảng ở nơi NDA với khách cho phép: công cụ của khách hoặc của công ty. Không bao giờ để Google Drive cá nhân chế độ "Bất kỳ ai có đường liên kết".'}</li>
<li>${en ? 'Before pasting spec text into a translator or an AI chatbot, check your project’s rules. Many FPT Software projects forbid it or allow only an approved tool.' : 'Trước khi dán đoạn spec vào trang dịch hay chatbot AI, xem luật của dự án. Nhiều dự án ở FPT Software cấm, hoặc chỉ cho dùng công cụ đã được duyệt.'}</li>
<li>${en ? 'Screenshots: blur names, student IDs, emails before they go into a row.' : 'Ảnh chụp: làm mờ tên, mã sinh viên, email trước khi đưa vào dòng nào.'}</li>
</ul>
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-10-3-du-lieu-khach', '🔒', en ? 'Agile &amp; Teamwork 10.3 — Client data and code' : 'Agile &amp; Làm việc nhóm 10.3 — Dữ liệu và mã của khách', en ? 'What may and may not leave the project.' : 'Thứ gì được và không được mang ra khỏi dự án.')}

<h3>✍️ ${en ? 'Practice' : 'Bài luyện'}</h3>
<p>${en
    ? 'Rewrite rows Q-001, Q-003, Q-004 and Q-005 (the Vietnamese one) of <code>51-xau.csv</code> as good rows: spec ref, one closed question, a proposal, priority, need-by. Q-001 must become two rows. Use the SRS excerpts: <em>3.2.2 "a reasonable period, maximum 3 days"</em>, <em>3.2.3 "a few active reservations"</em>, <em>3.4.1 "sends a reminder before the reservation starts"</em>, <em>3.5.2 "released after some time"</em>, <em>4.2 "only during peak hours and business days"</em>.'
    : 'Viết lại các dòng Q-001, Q-003, Q-004 và Q-005 (dòng tiếng Việt) của <code>51-xau.csv</code> thành dòng tốt: tham chiếu spec, một câu hỏi đóng, đề xuất, ưu tiên, hạn. Q-001 phải tách thành hai dòng. Dùng các đoạn SRS: <em>3.2.2 "a reasonable period, maximum 3 days"</em>, <em>3.2.3 "a few active reservations"</em>, <em>3.4.1 "sends a reminder before the reservation starts"</em>, <em>3.5.2 "released after some time"</em>, <em>4.2 "only during peak hours and business days"</em>.'}</p>
<details><summary>${en ? 'Model answer (the same rows are Q-001, Q-002, Q-006, Q-007 and Q-010 of the lab answer in 5.4, which passes kiem-qa.mjs with no warnings)' : 'Đáp án gợi ý (chính các dòng này là Q-001, Q-002, Q-006, Q-007, Q-010 trong đáp án lab 5.4 — bảng đó qua kiem-qa.mjs không cảnh báo)'}</summary>
${mau(`
Q-001 | SRS 3.2.2, 4.1 | Is the maximum length of one reservation 3 calendar days
      |                | for students and 7 calendar days for teachers?
      | Proposal: Yes. RS-02 blocks a longer slot and shows the limit.
      | High, need by 2026-11-25
Q-002 | SRS 3.2.3 | Can a student have at most 3 active reservations at the same time?
      | Proposal: 3. "Active" = Pending or Approved and not yet returned.
      | High, need by 2026-11-25
Q-003 | SRS 3.4.1 | Should the reminder be sent 24 hours before the start of the reservation?
      | Proposal: 24 hours before, by email and in-app (3.4.2).
      | Medium, need by 2026-11-27
Q-004 | SRS 3.5.2 | Is a reservation released 30 minutes after the start of the slot
      |           | when the item is not picked up?
      | Proposal: 30 minutes by default; each lab manager can set 15 to 120 minutes.
      | High, need by 2026-11-25
Q-005 | SRS 4.2   | Does 4.2 mean that reservations are possible from 08:00 to 17:00 ICT,
      |           | Monday to Friday, except Vietnamese public holidays?
      | Proposal: Yes. We replace "peak hours" with "opening hours of the laboratory".
      | High, need by 2026-11-25
`)}
<p>${en ? 'Why Q-005 is High: if "peak hours" means something else, the availability calendar (the core screen) is built on the wrong rule.' : 'Vì sao Q-005 là High: nếu "peak hours" nghĩa khác, lịch trống (màn hình lõi) được dựng trên luật sai.'}</p>
</details>

${tuVung([
    ['We have added Q-011 to Q-018.', en ? 'announcing a new batch' : 'báo một đợt câu hỏi mới', 'We have added Q-011 to Q-018 to the Q&amp;A list; two are High.'],
    ['need by …', en ? 'the date you must have the answer' : 'ngày cần có câu trả lời', 'Q-007 is needed by 25 Nov because it blocks the database design.'],
    ['as answered in Q-003', en ? 'pointing to an earlier decision' : 'dẫn về một quyết định trước', 'As answered in Q-003, teachers have priority.'],
    ['This is still open.', en ? 'polite reminder in a meeting' : 'nhắc nhẹ trong buổi họp', 'Q-008 is still open. Could we decide it today?'],
    ['reflected in', en ? 'the answer is now in a document' : 'câu trả lời đã vào tài liệu', 'The answer to Q-002 is reflected in SRS v0.4, section 3.2.3.'],
    ['on hold', en ? 'paused on purpose, with a date' : 'tạm dừng có chủ ý, có ngày xem lại', 'Q-018 is on hold until the budget for phase 2 is decided.'],
  ], en)}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-9-5-qa-cr', '📋', en ? 'Agile &amp; Teamwork 9.5 — Q&amp;A list and change requests' : 'Agile &amp; Làm việc nhóm 9.5 — Q&amp;A list với khách và change request', en ? 'The same document from the process side (Vietnamese).' : 'Cùng tài liệu này nhìn từ phía quy trình (tiếng Việt).')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>Q&amp;A list (QA表) · spec reference · ${en ? 'closed question' : 'câu hỏi đóng (closed question)'} · proposal · priority · need-by date · Open / Answered / Closed / On hold · ${en ? 'reflected in' : 'reflected in (đã đưa vào)'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'More than about five questions ⇒ one shared, numbered list instead of email threads.' : 'Hơn khoảng năm câu hỏi ⇒ một bảng dùng chung, đánh số, thay cho các luồng email.'}</li>
<li>${en ? 'One question per row, with a spec reference, a proposal, a priority and a need-by date.' : 'Mỗi dòng một câu, có tham chiếu spec, đề xuất, ưu tiên và hạn cần.'}</li>
<li>${en ? 'Answered ≠ Closed: close a row only when the answer is in the spec or a ticket.' : 'Answered ≠ Closed: chỉ đóng dòng khi câu trả lời đã vào spec hoặc ticket.'}</li>
<li>${en ? 'Never reuse numbers, never delete rows, never edit the client’s answer.' : 'Không dùng lại số, không xoá dòng, không sửa câu trả lời của khách.'}</li>
<li>${en ? 'The list is confidential: keep it in approved tools only.' : 'Bảng là tài liệu mật: chỉ để trong công cụ được phép.'}</li>
</ul>
</div>`;

/* ═════════════ 5.2 — Câu hỏi đóng có đề xuất ═════════════ */
const L52 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 5 · Writing' : 'Chương 5 · Viết'}</span>
<h2>${en ? '5.2 — Closed questions with a proposal: "We assume X. Is that correct?"' : '5.2 — Câu hỏi đóng có đề xuất: "Chúng tôi giả định X. Như vậy có đúng không?"'}</h2>
<p class="lead">${en
    ? 'An open question ("How should the system handle deleted equipment?") gives the client homework: think, design, write. A closed question with a proposal ("Should the system block deleting equipment that still has active loans?") gives them a decision: yes or no. Busy clients answer decisions first. They also answer them more precisely, because you have already shown what "yes" means.'
    : 'Câu hỏi mở ("How should the system handle deleted equipment?") giao bài tập về nhà cho khách: nghĩ, thiết kế, viết. Câu hỏi đóng kèm đề xuất ("Should the system block deleting equipment that still has active loans?") chỉ xin khách một quyết định: có hay không. Khách bận sẽ trả lời quyết định trước. Họ cũng trả lời chính xác hơn, vì bạn đã cho thấy "có" nghĩa là gì.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'A hairdresser who asks "How do you want it?" gets a vague answer and an unhappy customer. One who asks "Same style, two centimetres shorter, OK?" gets a clear yes — or a precise correction ("three centimetres"). Either way, the haircut is right. A proposal is not you deciding for the client; it is you giving them something concrete to correct.'
    : 'Thợ cắt tóc hỏi "Anh muốn cắt thế nào?" thì nhận câu trả lời mơ hồ và một vị khách không vui. Thợ hỏi "Giữ kiểu cũ, ngắn bớt hai phân nhé?" thì nhận một chữ "ừ" rõ ràng — hoặc một lời sửa chính xác ("ba phân"). Đằng nào tóc cũng cắt đúng. Đề xuất không phải là bạn quyết thay khách; đó là đưa cho khách một thứ cụ thể để sửa.'}</p>

<h3>${en ? 'Situation' : 'Tình huống'}</h3>
<p>${en
    ? 'Before the reservation work, the team had eight questions about the LabFlow 1.x loan module. The first draft was all open questions. Here are the eight rows, then the checker:'
    : 'Trước phần đặt trước thiết bị, đội có tám câu hỏi về mô-đun mượn trả của LabFlow 1.x. Bản nháp đầu toàn câu hỏi mở. Đây là tám dòng, rồi tới công cụ kiểm:'}</p>
${bangQA('52-mo.csv', ['No', 'Spec ref', 'Category', 'Question'], en ? 'mau/52-mo.csv — open questions.' : 'mau/52-mo.csv — câu hỏi mở.')}
${RUN('52-mo', 'node kiem-qa.mjs mau/52-mo.csv --today=2026-11-24', NOTE_RUN(en))}

<h3>${en ? 'Five shapes of a closed question' : 'Năm dạng câu hỏi đóng'}</h3>
<table>
<thead><tr><th>${en ? 'Shape' : 'Dạng'}</th><th>${en ? 'Example' : 'Ví dụ'}</th><th>${en ? 'Use when' : 'Dùng khi'}</th></tr></thead>
<tbody>
<tr><td>1. <strong>We assume X. Is that correct?</strong></td><td><em>We assume a student ID is 2 capital letters and 6 digits (SE123456). Is that correct?</em></td><td>${en ? 'You have a reasonable guess.' : 'Bạn đã có một phỏng đoán hợp lý.'}</td></tr>
<tr><td>2. <strong>Is / Should / Can … ?</strong></td><td><em>Is 30 minutes a correct lifetime for the password reset link?</em></td><td>${en ? 'Short, one value to confirm.' : 'Ngắn, xác nhận một giá trị.'}</td></tr>
<tr><td>3. <strong>A or B?</strong></td><td><em>Should equipment under maintenance be hidden, or shown as "Under maintenance"?</em></td><td>${en ? 'Two real options and you do not know which one they want.' : 'Có hai phương án thật và bạn không biết khách muốn cái nào.'}</td></tr>
<tr><td>4. <strong>Is it OK if … / Is X acceptable?</strong></td><td><em>Is 5 MB per photo an acceptable limit?</em></td><td>${en ? 'You propose a limit or a simplification.' : 'Bạn đề xuất một giới hạn hoặc một cách làm đơn giản hơn.'}</td></tr>
<tr><td>5. <strong>Can we use … (attachment)?</strong></td><td><em>Can we use the overdue email draft in attachment A2?</em></td><td>${en ? 'The answer is a text, a layout or a picture: draft it yourself.' : 'Câu trả lời là một đoạn chữ, bố cục hay hình: tự soạn nháp trước.'}</td></tr>
</tbody>
</table>
<p>${en
    ? 'Always put the <strong>number, the name or the example</strong> into the question: "30 minutes", "Chrome, Edge and Safari", "SE123456". A question with a value can be answered with one word; a question without one cannot.'
    : 'Luôn đưa <strong>con số, cái tên hoặc ví dụ</strong> vào câu hỏi: "30 minutes", "Chrome, Edge and Safari", "SE123456". Câu hỏi có giá trị cụ thể trả lời được bằng một chữ; câu không có thì không.'}</p>

<h3>${en ? 'Where do proposals come from?' : 'Đề xuất lấy từ đâu?'}</h3>
<ul>
<li>${en ? '<strong>The current system</strong>: "LabFlow 1.x keeps sessions for 30 minutes."' : '<strong>Hệ thống hiện tại</strong>: "LabFlow 1.x giữ phiên 30 phút."'}</li>
<li>${en ? '<strong>Another part of the same spec</strong>: section 4.1 gives 7 days for teachers ⇒ propose 3 for students as written in 3.2.2.' : '<strong>Chỗ khác trong chính spec</strong>: mục 4.1 cho giáo viên 7 ngày ⇒ đề xuất sinh viên 3 ngày như 3.2.2.'}</li>
<li>${en ? '<strong>Common practice or a standard</strong>: OWASP suggests short-lived, single-use reset tokens; browser support = "latest two versions" is the usual web contract.' : '<strong>Thông lệ hoặc tiêu chuẩn</strong>: OWASP khuyên token đặt lại mật khẩu sống ngắn, dùng một lần; hỗ trợ trình duyệt = "hai phiên bản mới nhất" là thoả thuận web thường gặp.'}</li>
<li>${en ? '<strong>The cheapest option that meets the need</strong> — and say what the expensive option would cost, so the client can choose with open eyes.' : '<strong>Phương án rẻ nhất vẫn đáp ứng nhu cầu</strong> — kèm chi phí của phương án đắt, để khách chọn khi đã biết rõ.'}</li>
<li>${en ? 'Your team lead or BrSE. A proposal that the team has not agreed on is worse than none.' : 'Trưởng nhóm hoặc BrSE. Đề xuất mà đội chưa thống nhất còn tệ hơn không có.'}</li>
</ul>

<h3>${en ? 'The rewritten list' : 'Bảng đã viết lại'}</h3>
${bangQA('52-dong.csv', ['No', 'Question', 'Our proposal'], en ? 'mau/52-dong.csv — the same eight questions, closed, with proposals.' : 'mau/52-dong.csv — cùng tám câu, đã thành câu đóng, có đề xuất.')}
${RUN('52-dong', 'node kiem-qa.mjs mau/52-dong.csv --today=2026-11-24', NOTE_RUN(en))}
<p>${en
    ? 'Look at Q-023: it starts with "When…", which is usually an open word, but the main clause after the comma is "should we keep the input…?" — a yes/no question. The checker handles this case; a human reader too. "No warnings" does not prove the proposals are good: only your team and the client can judge that.'
    : 'Xem Q-023: câu bắt đầu bằng "When…", thường là từ để hỏi mở, nhưng mệnh đề chính sau dấu phẩy là "should we keep the input…?" — câu hỏi có/không. Công cụ xử lý được trường hợp này; người đọc cũng vậy. "No warnings" không chứng minh đề xuất tốt: chỉ đội bạn và khách đánh giá được điều đó.'}</p>

<h3>${en ? 'Grammar: how to build a yes/no question' : 'Ngữ pháp: dựng câu hỏi có/không'}</h3>
<p>${en
    ? 'Vietnamese asks with a word at the end ("… không?", "… phải không?"). English moves an auxiliary <strong>before the subject</strong>:'
    : 'Tiếng Việt hỏi bằng một từ ở cuối ("… không?", "… phải không?"). Tiếng Anh đưa trợ động từ lên <strong>trước chủ ngữ</strong>:'}</p>
${mau(`
Statement                                   Question
The link is valid for 30 minutes.       →   Is the link valid for 30 minutes?
A student can have 3 reservations.      →   Can a student have 3 reservations?
The report includes cancelled items.    →   Does the report include cancelled items?
We should keep the input.               →   Should we keep the input?
Teachers have priority.                 →   Do teachers have priority?
`, en ? 'be / can / should move; for other verbs add do / does.' : 'be / can / should tự đảo lên; động từ thường thì thêm do / does.')}

<h3>${en ? 'Avoid negative questions with Japanese (and Vietnamese) readers' : 'Tránh câu hỏi phủ định với người đọc Nhật (và Việt)'}</h3>
<p>${en
    ? '"Is approval not required for teachers?" — In English, "Yes" means "it IS required". In Japanese (and in Vietnamese: "Không cần duyệt à?" — "Vâng" = "đúng, không cần"), "Yes" agrees with the sentence, so it means "it is NOT required". The same reply means opposite things. Ask the positive form and offer both answers:'
    : '"Is approval not required for teachers?" — Trong tiếng Anh, "Yes" nghĩa là "CÓ cần duyệt". Trong tiếng Nhật (và tiếng Việt: "Không cần duyệt à?" — "Vâng" = "đúng, không cần"), "Yes" đồng ý với câu hỏi, tức là "KHÔNG cần". Cùng một câu trả lời mà hai nghĩa ngược nhau. Hãy hỏi dạng khẳng định và cho sẵn hai đáp án:'}</p>
${mau(`
❌ Is approval not required for teachers?
✅ Do teachers' reservations also need approval?  (Yes = need approval / No = no approval)
`)}

<h3>${en ? 'When an open question is right' : 'Khi nào câu hỏi mở là đúng'}</h3>
<p>${en
    ? 'At the very beginning of a project, when you have no basis for a guess, or when you would otherwise propose something absurd. Even then, make it narrow and ask for an example, not an explanation: <em>"Could you share one example of a monthly report you use today (with names removed)?"</em> — one attachment answers twenty questions.'
    : 'Lúc dự án mới bắt đầu, khi bạn chưa có cơ sở để đoán, hoặc khi đề xuất bất kỳ nào cũng thành vô lý. Kể cả khi đó, hãy hỏi hẹp và xin ví dụ, đừng xin giải thích: <em>"Could you share one example of a monthly report you use today (with names removed)?"</em> — một tệp đính kèm trả lời được hai mươi câu hỏi.'}</p>

<h3>${en ? 'Add evidence: where, what, what it looks like' : 'Kèm bằng chứng: chỗ nào, cái gì, trông ra sao'}</h3>
<ul>
<li>${en ? '<strong>Spec reference</strong> in its own column (lesson 5.1).' : '<strong>Tham chiếu spec</strong> ở cột riêng (bài 5.1).'}</li>
<li>${en ? '<strong>Screenshot or mock-up</strong> with an arrow and a number: "see A1, arrow ①". Clients read pictures faster than English.' : '<strong>Ảnh chụp hoặc bản phác</strong> có mũi tên và số: "see A1, arrow ①". Khách đọc hình nhanh hơn đọc tiếng Anh.'}</li>
<li>${en ? '<strong>Example values</strong>: "e.g. SE123456", "e.g. 2026-11-30 08:00 ICT".' : '<strong>Giá trị ví dụ</strong>: "e.g. SE123456", "e.g. 2026-11-30 08:00 ICT".'}</li>
<li>${en ? '<strong>What happens if they say no</strong>, when it matters: "If not, RS-02 needs a second approval step (+2 days)."' : '<strong>Nếu khách nói không thì sao</strong>, khi việc đó quan trọng: "If not, RS-02 needs a second approval step (+2 days)."'}</li>
</ul>

<h3>${en ? 'Mistakes Vietnamese writers often make' : 'Lỗi người Việt hay mắc'}</h3>
${saiDung([
    ['It is correct?', 'Is that correct?', en ? 'No inversion = a statement with a question mark.' : 'Không đảo trợ động từ = câu kể gắn dấu hỏi.'],
    ['We think maybe can use 5MB?', 'Is 5 MB per photo an acceptable limit?', en ? 'One clear subject + verb; numbers with a space and unit (5 MB).' : 'Một chủ ngữ + động từ rõ; số có dấu cách và đơn vị (5 MB).'],
    ['Please let us know your opinion about browser.', 'Is it enough to support the latest two versions of Chrome, Edge and Safari?', en ? '"Your opinion" asks for an essay.' : '"Your opinion" là xin một bài văn.'],
    ['If no answer, we will do our way.', 'To keep the schedule, we will start with our proposal on 27 Nov unless you prefer otherwise.', en ? 'Polite default with a date; agree with your PM before using it.' : 'Mặc định lịch sự, có ngày; thống nhất với PM trước khi dùng.'],
    ['Is approval not needed?', 'Does this need approval?', en ? 'Negative questions get ambiguous "yes" answers.' : 'Câu hỏi phủ định nhận câu "yes" mơ hồ.'],
  ], en)}

<h3>✍️ ${en ? 'Practice' : 'Bài luyện'}</h3>
<p>${en
    ? 'Cover the rewritten table above. Rewrite the eight open questions of <code>52-mo.csv</code> as closed questions, each with a proposal. Then compare. Your proposals may differ — that is fine, as long as each question can be answered with "yes", "no" or one choice.'
    : 'Che bảng đã viết lại phía trên. Viết lại tám câu hỏi mở của <code>52-mo.csv</code> thành câu đóng, mỗi câu kèm đề xuất. Rồi so sánh. Đề xuất của bạn có thể khác — không sao, miễn mỗi câu trả lời được bằng "yes", "no" hoặc một lựa chọn.'}</p>
<details><summary>${en ? 'Model answer and checklist' : 'Đáp án gợi ý và bảng tự kiểm'}</summary>
<p>${en ? 'The model answer is <code>52-dong.csv</code> above (no warnings from the checker). Check yours:' : 'Đáp án gợi ý là <code>52-dong.csv</code> phía trên (công cụ không cảnh báo). Tự kiểm bài mình:'}</p>
<ul>
<li>${en ? 'Starts with Is / Are / Do / Does / Can / Should / May (or "When …, should …?").' : 'Bắt đầu bằng Is / Are / Do / Does / Can / Should / May (hoặc "When …, should …?").'}</li>
<li>${en ? 'Contains a value: a number, a list of names, an example.' : 'Có giá trị cụ thể: con số, danh sách tên, ví dụ.'}</li>
<li>${en ? 'Not negative. One question mark.' : 'Không phủ định. Một dấu hỏi.'}</li>
<li>${en ? 'The proposal says what you will build if the answer is yes.' : 'Đề xuất nói rõ bạn sẽ làm gì nếu câu trả lời là có.'}</li>
</ul>
</details>

${tuVung([
    ['We assume … Is that correct?', en ? 'the safest closed question' : 'dạng câu hỏi đóng an toàn nhất', 'We assume times are shown in ICT. Is that correct?'],
    ['Is it OK if …?', en ? 'asking to simplify' : 'xin làm đơn giản hơn', 'Is it OK if the report is .xlsx only?'],
    ['Option A … Option B … We recommend A because …', en ? 'two choices + your view' : 'hai lựa chọn + ý của bạn', 'We recommend A because it needs no change to the approval screen.'],
    ['unless you prefer otherwise', en ? 'polite default' : 'mặc định lịch sự', 'We will use 30 minutes unless you prefer otherwise.'],
    ['Could you share an example of …?', en ? 'a narrow open question' : 'câu hỏi mở nhưng hẹp', 'Could you share an example of the current booking sheet?'],
    ['e.g. / for example', en ? 'add a concrete value' : 'thêm giá trị cụ thể', 'Student IDs, e.g. SE123456, are 8 characters.'],
  ], en)}
${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-4-2-hoi-lai', '✉️', en ? '4.2 — Asking for clarification' : '4.2 — Hỏi lại cho rõ yêu cầu', en ? 'The same four steps in one email, when there are only a few questions.' : 'Cùng bốn bước trong một email, khi chỉ có vài câu hỏi.')}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-11-1-khach-nhat', '🇯🇵', en ? 'Agile &amp; Teamwork 11.1 — Japanese clients' : 'Agile &amp; Làm việc nhóm 11.1 — Khách Nhật', en ? 'Indirect "no", detail and quality expectations.' : 'Lời từ chối gián tiếp, độ chi tiết, kỳ vọng chất lượng.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>${en ? 'closed question · open question · proposal · assumption · option A/B · default · negative question · auxiliary verb' : 'closed question (câu hỏi đóng) · open question (câu hỏi mở) · proposal · assumption (giả định) · option A/B · mặc định · câu hỏi phủ định · trợ động từ'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Turn every question into a decision: "We assume X. Is that correct?", "A or B?", "Is X acceptable?".' : 'Biến mỗi câu hỏi thành một quyết định: "We assume X. Is that correct?", "A or B?", "Is X acceptable?".'}</li>
<li>${en ? 'Put a value in the question; put the background and your proposal in the next column.' : 'Đưa giá trị cụ thể vào câu hỏi; bối cảnh và đề xuất để ở cột kế bên.'}</li>
<li>${en ? 'Yes/no questions need an auxiliary before the subject; avoid negative questions.' : 'Câu hỏi có/không cần trợ động từ trước chủ ngữ; tránh câu hỏi phủ định.'}</li>
<li>${en ? 'Open questions only when you truly have no basis — and then ask for an example.' : 'Chỉ hỏi mở khi thật sự không có cơ sở — và khi đó xin một ví dụ.'}</li>
</ul>
</div>`;

/* ═════════════ 5.3 — Xác nhận bằng văn bản + phạm vi phình to ═════════════ */
const L53 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 5 · Writing' : 'Chương 5 · Viết'}</span>
<h2>${en ? '5.3 — Confirming changes in writing and spotting scope creep' : '5.3 — Xác nhận thay đổi bằng văn bản và nhận ra phạm vi phình to'}</h2>
<p class="lead">${en
    ? 'What is said in a meeting disappears when the call ends. Two weeks later the client remembers "teachers always win", you remember "first come, first served", and both of you are sure. A short confirmation email after every decision turns memory into a record. The same habit protects you from <strong>scope creep</strong>: small additions — "can you also…", "just one more screen" — that nobody estimated, and that the team pays for with overtime or a late release.'
    : 'Lời nói trong buổi họp biến mất khi cuộc gọi kết thúc. Hai tuần sau khách nhớ "giáo viên luôn được ưu tiên", bạn nhớ "ai đặt trước được trước", và cả hai đều chắc chắn. Một email xác nhận ngắn sau mỗi quyết định biến trí nhớ thành hồ sơ. Cùng thói quen đó bảo vệ bạn khỏi <strong>phạm vi phình to (scope creep)</strong>: những thứ thêm nhỏ — "làm thêm giúp…", "thêm một màn hình thôi" — không ai ước lượng, và đội trả giá bằng tăng ca hoặc trễ phát hành.'}</p>

<h3>${en ? 'Everyday comparison' : 'Liên tưởng đời thường'}</h3>
<p>${en
    ? 'You hire a painter for two rooms at a fixed price. On day two: "While you are here, could you also do the gate? It’s small." Then the kitchen ceiling. A good painter says: "Happy to. The gate is half a day, 400,000 dong — shall I add it?" A bad one says "No problem" and either works for free or argues with you at the end. Both problems start with the words "no problem".'
    : 'Bạn thuê thợ sơn hai phòng với giá trọn gói. Ngày thứ hai: "Tiện đây anh sơn giúp cái cổng nhé, nhỏ thôi." Rồi tới trần bếp. Thợ giỏi nói: "Được ạ. Cái cổng mất nửa ngày, 400 nghìn — em làm thêm nhé?" Thợ dở nói "Không sao" rồi hoặc làm không công, hoặc cãi nhau với bạn lúc tính tiền. Cả hai rắc rối đều bắt đầu từ câu "không sao".'}</p>

<h3>${en ? 'Part 1 — Confirming a decision in writing' : 'Phần 1 — Xác nhận quyết định bằng văn bản'}</h3>
<p>${en
    ? 'On 26 Nov the team had a call with Tanaka-san and decided four Q&amp;A rows by voice. The same afternoon An sent this:'
    : 'Ngày 26/11 đội gọi với Tanaka-san và chốt bằng lời bốn dòng trong Q&amp;A list. Chiều hôm đó An gửi email này:'}</p>
${E('53-xac-nhan.txt', en ? 'mau/53-xac-nhan.txt — confirmation after a meeting.' : 'mau/53-xac-nhan.txt — xác nhận sau buổi họp.')}
<ol>
<li>${en ? '<strong>The subject says it needs action, and by when</strong> ("please confirm by 27 Nov").' : '<strong>Tiêu đề nói cần làm gì, trước khi nào</strong> ("please confirm by 27 Nov").'}</li>
<li>${en ? '<strong>The first paragraph sets a deadline for corrections and what happens after it</strong>: "If we do not hear from you, we will start development on this basis on 30 Nov." It is not a trick: it gives the client a clear, fair chance to object. Agree on this sentence with your PM; with some clients the PM sends it.' : '<strong>Đoạn đầu đặt hạn để sửa và nói điều gì xảy ra sau hạn</strong>: "If we do not hear from you, we will start development on this basis on 30 Nov." Đây không phải mẹo: nó cho khách một cơ hội phản đối rõ ràng, công bằng. Thống nhất câu này với PM; với vài khách, PM là người gửi.'}</li>
<li>${en ? '<strong>"As discussed in today’s meeting:"</strong> then numbered decisions, each tied to a Q&amp;A number and a spec section, with exact values (30 minutes, 15 to 120, 08:00–17:00 ICT).' : '<strong>"As discussed in today’s meeting:"</strong> rồi các quyết định đánh số, mỗi dòng gắn với mã Q&amp;A và mục spec, có giá trị chính xác (30 phút, 15 tới 120, 08:00–17:00 ICT).'}</li>
<li>${en ? '<strong>Who does what</strong>: "You will change "should" to "must" in SRS 3.3.1."' : '<strong>Ai làm gì</strong>: "You will change "should" to "must" in SRS 3.3.1."'}</li>
<li>${en ? '<strong>What is still open</strong>, so nobody thinks everything was decided.' : '<strong>Cái gì còn mở</strong>, để không ai tưởng mọi thứ đã chốt.'}</li>
<li>${en ? '<strong>The Q&amp;A list is updated</strong> — the email and the list say the same thing.' : '<strong>Q&amp;A list đã cập nhật</strong> — email và bảng nói cùng một điều.'}</li>
</ol>
${RUN('53-email', 'cd mau && node ../kiem-email.mjs 53-xau.txt 53-xac-nhan.txt 53-cr.txt', NOTE_EMAIL(en))}
<p>${en
    ? 'The confirmation passes. The other two emails are below.'
    : 'Email xác nhận qua kiểm. Hai email còn lại ở phần dưới.'}</p>

<h3>${en ? 'Part 2 — "A small update": spotting scope creep' : 'Phần 2 — "Cập nhật nhỏ": nhận ra phạm vi phình to'}</h3>
<p>${en
    ? 'On 30 Nov Tanaka-san sends SRS v0.4: "A small update reflecting the Q&amp;A. Please continue." Never trust "small": compare the two versions line by line. If you have the text files, Git compares any two files, even outside a repository:'
    : 'Ngày 30/11 Tanaka-san gửi SRS v0.4: "A small update reflecting the Q&amp;A. Please continue." Đừng bao giờ tin chữ "small": so hai bản từng dòng. Có tệp văn bản thì Git so được hai tệp bất kỳ, kể cả ngoài kho:'}</p>
${mau('$ git diff --no-index -U0 srs-reservation-v0.3.txt srs-reservation-v0.4.txt\n' + OUT['53-diff'], en ? 'Real output, git 2.55, 24 Nov 2026. Lines with "-" were removed, "+" were added. (For Word files: Review → Compare; for PDF: any PDF compare tool.)' : 'Output THẬT, git 2.55, 24/11/2026. Dòng "-" bị bỏ, "+" được thêm. (Tệp Word: Review → Compare; PDF: công cụ so PDF bất kỳ.)')}
<p>${en ? 'Now classify every change:' : 'Giờ phân loại từng thay đổi:'}</p>
<table>
<thead><tr><th>${en ? 'Change' : 'Thay đổi'}</th><th>${en ? 'Type' : 'Loại'}</th><th>${en ? 'Why' : 'Vì sao'}</th></tr></thead>
<tbody>
<tr><td>3.2.3 "a few" → "at most 3"</td><td>✅ ${en ? 'Clarification' : 'Làm rõ'}</td><td>${en ? 'Answer to Q-002, already in our plan.' : 'Trả lời Q-002, đã có trong kế hoạch.'}</td></tr>
<tr><td>3.4.1 "24 hours before"</td><td>✅ ${en ? 'Clarification' : 'Làm rõ'}</td><td>${en ? 'Answer to Q-006.' : 'Trả lời Q-006.'}</td></tr>
<tr><td>1.2 ${en ? 'room booking removed from "Out of scope"' : 'bỏ room booking khỏi "Out of scope"'} + 3.7 + RS-06</td><td>🔴 ${en ? 'New scope' : 'Phạm vi mới'}</td><td>${en ? 'A new screen and a new kind of resource. Note how it appears in three places — and the first one is a deleted line.' : 'Một màn hình mới và một loại tài nguyên mới. Để ý nó xuất hiện ở ba chỗ — và chỗ đầu tiên là một dòng bị xoá.'}</td></tr>
<tr><td>3.4.2 "+ LINE"</td><td>🔴 ${en ? 'New scope' : 'Phạm vi mới'}</td><td>${en ? 'New external integration; also needs an account on the client side.' : 'Tích hợp ngoài mới; còn cần tài khoản phía khách.'}</td></tr>
<tr><td>3.5.1 "scanning the QR code"</td><td>🔴 ${en ? 'New scope' : 'Phạm vi mới'}</td><td>${en ? 'New feature in the pick-up flow (generate, scan, verify).' : 'Tính năng mới trong luồng nhận đồ (sinh, quét, kiểm mã).'}</td></tr>
<tr><td>3.6.2 "Excel or a similar format" → "Excel (.xlsx) and PDF"</td><td>🔴 ${en ? 'New scope' : 'Phạm vi mới'}</td><td>${en ? '"or" became "and": two exports instead of one. One small word, two person-days.' : '"or" thành "and": hai kiểu xuất thay vì một. Một chữ nhỏ, hai ngày công.'}</td></tr>
<tr><td>3.3.1 ${en ? '(no change)' : '(không đổi)'}</td><td>⚠️ ${en ? 'Missing' : 'Thiếu'}</td><td>${en ? 'Q-004 was answered "We will update the SRS", but "should" is still there. The diff also shows what did <em>not</em> change.' : 'Q-004 được trả lời "We will update the SRS", nhưng "should" vẫn còn. Diff còn cho thấy cả thứ <em>không</em> đổi.'}</td></tr>
</tbody>
</table>

<h3>${en ? 'Clarification or change request? Six questions' : 'Làm rõ hay change request? Sáu câu tự hỏi'}</h3>
<p>${en ? 'If the answer to any of these is yes, it is probably a <strong>change request (CR)</strong> and needs an estimate and the client’s approval before you build it:' : 'Chỉ cần một câu trả lời "có", nhiều khả năng đó là <strong>change request (CR)</strong> — cần ước lượng và khách duyệt trước khi làm:'}</p>
<ol>
<li>${en ? 'Does it add a screen, a report, an export format or an API?' : 'Có thêm màn hình, báo cáo, kiểu xuất hay API không?'}</li>
<li>${en ? 'Does it add an external system (LINE, Google Calendar, SSO of another company)?' : 'Có thêm hệ thống ngoài (LINE, Google Calendar, SSO của công ty khác) không?'}</li>
<li>${en ? 'Does it add a role or a new kind of data?' : 'Có thêm vai trò hoặc loại dữ liệu mới không?'}</li>
<li>${en ? 'Does it change something already agreed or already built?' : 'Có đổi thứ đã chốt hoặc đã làm xong không?'}</li>
<li>${en ? 'Does it raise a non-functional target (users, speed, devices)?' : 'Có nâng mục tiêu phi chức năng (số người dùng, tốc độ, thiết bị) không?'}</li>
<li>${en ? 'Was it outside the document version your estimate was based on?' : 'Có nằm ngoài phiên bản tài liệu mà bản ước lượng dựa vào không?'}</li>
</ol>
<p>${en
    ? 'Deciding "CR or not" is your PM’s call, not yours. Your job as a developer: <strong>notice it, say it early, in writing</strong>. A CR is not a fight: the client is allowed to want more; they just need to see the cost and choose.'
    : 'Quyết định "có phải CR không" là việc của PM, không phải của bạn. Việc của bạn với tư cách lập trình viên: <strong>nhận ra, nói sớm, bằng văn bản</strong>. CR không phải cãi nhau: khách được quyền muốn thêm; họ chỉ cần thấy chi phí rồi chọn.'}</p>

<h3>${en ? 'The two replies' : 'Hai cách trả lời'}</h3>
${E('53-xau.txt', en ? 'mau/53-xau.txt — the reply that costs 18 person-days.' : 'mau/53-xau.txt — câu trả lời tốn 18 ngày công.')}
<p>${en
    ? 'The checker only says "ASK-NONE". It cannot see the real problem: "we will follow SRS v0.4" accepts four unestimated features in writing. In a fixed-price project those 18 person-days are now free work, a late release, or an argument in January — about an email you wrote.'
    : 'Công cụ chỉ báo "ASK-NONE". Nó không thấy vấn đề thật: "we will follow SRS v0.4" là chấp nhận bằng văn bản bốn tính năng chưa ước lượng. Ở dự án trọn gói, 18 ngày công đó thành làm không công, trễ phát hành, hoặc một cuộc cãi nhau hồi tháng Một — về chính email bạn viết.'}</p>
${E('53-cr.txt', en ? 'mau/53-cr.txt — the reply An’s PM sent (An drafted it).' : 'mau/53-cr.txt — email PM của An gửi (An soạn nháp).')}
<ul>
<li>${en ? '<strong>Thanks first, no blame</strong>: the client did nothing wrong by wanting more.' : '<strong>Cảm ơn trước, không trách</strong>: khách muốn thêm không có gì sai.'}</li>
<li>${en ? '<strong>Separates clarifications (accepted) from new items</strong>, so the client sees you read carefully and are not refusing everything.' : '<strong>Tách phần làm rõ (chấp nhận) khỏi phần mới</strong>, để khách thấy bạn đọc kỹ và không từ chối mọi thứ.'}</li>
<li>${en ? '<strong>Every new item has a section number and a cost</strong> in person-days; the total is a number.' : '<strong>Mỗi mục mới có số mục và chi phí</strong> theo ngày công; tổng là một con số.'}</li>
<li>${en ? '<strong>Two options with dates</strong>, and the team’s recommendation. The client decides.' : '<strong>Hai phương án có ngày</strong>, kèm đề xuất của đội. Khách quyết.'}</li>
<li>${en ? '<strong>Points out the missing Q-004 change</strong> — politely, as a question.' : '<strong>Chỉ ra Q-004 chưa vào spec</strong> — lịch sự, bằng câu hỏi.'}</li>
</ul>
<p>${en
    ? 'The checker warns "CAPS LINE LINE" — a false alarm: LINE is a product name. A tool is a helper; you decide.'
    : 'Công cụ cảnh báo "CAPS LINE LINE" — báo nhầm: LINE là tên sản phẩm. Công cụ chỉ là trợ thủ; bạn là người quyết.'}</p>

<h3>${en ? 'Saying "not now" politely but clearly' : 'Nói "chưa phải lúc" lịch sự mà rõ'}</h3>
${saiDung([
    ['No problem, we will do it.', 'Good idea. It is outside the current scope, so we will send a change request with the effort.', en ? '"No problem" = free work.' : '"No problem" = làm không công.'],
    ['We cannot do it.', 'We can do it in 2.1, or in 2.0 if we move the release to 15 Jan. Which do you prefer?', en ? 'Give options, not a wall.' : 'Đưa lựa chọn, đừng dựng tường.'],
    ['It is difficult.', 'It needs about 5 person-days and a LINE Official Account on your side.', en ? '"Difficult" sounds like a soft "no" to Japanese readers — or like an excuse. Give facts.' : '"Difficult" với người Nhật nghe như lời từ chối nhẹ — hoặc như viện cớ. Đưa dữ kiện.'],
    ['OK, I will add it quickly.', 'Let me check the impact with my team lead and come back to you by tomorrow 12:00 JST.', en ? 'Developers do not accept scope alone; buy time with a date.' : 'Lập trình viên không tự nhận thêm phạm vi; xin thời gian kèm hạn trả lời.'],
    ['You changed the spec again!', 'We compared v0.4 with v0.3 and found four new items.', en ? 'Facts, not feelings.' : 'Dữ kiện, không cảm xúc.'],
  ], en)}

<h3>🔎 ${en ? 'Real incidents: when scope is never pinned down' : 'Sự cố thật: khi phạm vi không bao giờ được chốt'}</h3>
<ul>
<li>${en
    ? '<strong>Queensland Health payroll, Australia (go-live March 2010).</strong> Thousands of health workers were paid wrongly for months. At the Commission of Inquiry (report of 31 July 2013), witnesses described a scope that was never agreed: the vendor testified that each wave of change requests forced it to redesign, rebuild and retest, and a former state official said a common view of scope was never achieved. The fix was later estimated at about AU$1.25 billion (iTnews, 2013).'
    : '<strong>Hệ thống lương Queensland Health, Úc (chạy thật 3/2010).</strong> Hàng nghìn nhân viên y tế bị trả lương sai suốt nhiều tháng. Tại Uỷ ban điều tra (báo cáo ngày 31/7/2013), nhân chứng mô tả một phạm vi không bao giờ thống nhất: phía nhà thầu khai mỗi đợt change request buộc họ thiết kế lại, làm lại, kiểm lại; một cựu quan chức bang nói hai bên chưa bao giờ có cùng cách hiểu về phạm vi. Chi phí khắc phục về sau ước khoảng 1,25 tỉ đô Úc (iTnews, 2013).'}</li>
<li>${en
    ? '<strong>Hertz v. Accenture (lawsuit filed April 2019, New York).</strong> Hertz asked for the US$32 million it had paid for a new website and app, saying they were never delivered in working form — for example, that the site did not adapt to tablet screens, and that Accenture asked for about US$10 million more to finish. Accenture called the claims without merit (The Register, 23 Apr 2019). Whoever is right, notice what such disputes are argued with: versions of the requirements, emails and meeting notes.'
    : '<strong>Hertz kiện Accenture (nộp đơn 4/2019, New York).</strong> Hertz đòi 32 triệu đô đã trả cho website và ứng dụng mới, nói chúng không bao giờ được bàn giao ở trạng thái dùng được — ví dụ trang không co giãn trên màn hình máy tính bảng, và Accenture đòi thêm khoảng 10 triệu đô để làm xong. Accenture nói cáo buộc vô căn cứ (The Register, 23/4/2019). Ai đúng chưa bàn, hãy để ý tranh chấp kiểu này được cãi bằng gì: các phiên bản yêu cầu, email và biên bản họp.'}</li>
</ul>
<p>${en
    ? 'You will not run a billion-dollar project in your OJT. But the same pattern — "just one more thing", agreed by voice, never estimated — happens in every sprint, at a smaller size.'
    : 'Bạn sẽ không phụ trách dự án tỉ đô trong kỳ OJT. Nhưng cùng một kiểu — "thêm một chút thôi", chốt bằng miệng, không ai ước lượng — xảy ra ở sprint nào cũng có, chỉ nhỏ hơn.'}</p>

<h3>✍️ ${en ? 'Practice' : 'Bài luyện'}</h3>
<p>${en
    ? 'Tanaka-san writes in Teams: <em>"Three small things for RS-02: the title has a typo ("Reservaton"); students should see who reserved an item; and an export to Google Calendar would be nice."</em> Classify each item (fix / needs confirmation / CR) and write one Teams reply that stands alone (lesson 4.5). Do not accept anything that needs an estimate.'
    : 'Tanaka-san nhắn trên Teams: <em>"Three small things for RS-02: the title has a typo ("Reservaton"); students should see who reserved an item; and an export to Google Calendar would be nice."</em> Phân loại từng mục (sửa luôn / cần xác nhận / CR) và viết một tin trả lời Teams tự đủ ý (bài 4.5). Không nhận việc gì cần ước lượng.'}</p>
<details><summary>${en ? 'Model answer (real checker output)' : 'Đáp án gợi ý (kèm output thật của công cụ)'}</summary>
<p>${en
    ? '1 = fix (no impact). 2 = needs confirmation first: it shows a student’s name to other students — a privacy question, then a small CR. 3 = new integration ⇒ CR.'
    : '1 = sửa luôn (không ảnh hưởng). 2 = cần xác nhận trước: hiện tên sinh viên cho sinh viên khác — câu hỏi quyền riêng tư, sau đó là CR nhỏ. 3 = tích hợp mới ⇒ CR.'}</p>
${E('53-bt-dapan.txt', en ? 'mau/53-bt-dapan.txt' : 'mau/53-bt-dapan.txt')}
${RUN('5x-email2', 'cd mau && node ../kiem-email.mjs 53-bt-dapan.txt 54-email.txt', NOTE_EMAIL(en) + (en ? ' (54-email.txt is the cover email of lab 5.4.)' : ' (54-email.txt là email kèm bảng của lab 5.4.)'))}
</details>

${tuVung([
    ['As discussed in today’s meeting, …', en ? 'opening of a confirmation' : 'mở đầu email xác nhận', 'As discussed in today’s meeting, the reservation is released after 30 minutes.'],
    ['Please reply by … if anything is wrong.', en ? 'deadline for corrections' : 'hạn để sửa', 'Please reply by 27 Nov, 17:00 JST, if anything is wrong.'],
    ['outside the current scope', en ? 'not in what was estimated' : 'ngoài phạm vi đã ước lượng', 'Room booking is outside the current scope of 2.0.'],
    ['change request (CR)', en ? 'formal request to change scope, cost or date' : 'yêu cầu chính thức đổi phạm vi, chi phí, ngày', 'We will raise CR-003 for the four new items.'],
    ['person-day', en ? 'work of one person for one day' : 'công một người làm một ngày', 'QR pick-up is about 3 person-days.'],
    ['Let me check the impact and come back to you by …', en ? 'buying time without saying yes' : 'xin thời gian, chưa nhận lời', 'Let me check the impact and come back to you by Thursday.'],
  ], en)}
${lienKet('/courses/agile-teamwork/learn?lessonSlug=agl-11-4-tinh-huong-kho', '🧯', en ? 'Agile &amp; Teamwork 11.4 — Hard situations' : 'Agile &amp; Làm việc nhóm 11.4 — Tình huống khó', en ? 'Late requirement changes, complaints, unreasonable asks.' : 'Đổi yêu cầu sát hạn, khách phàn nàn, đòi hỏi vô lý.')}
${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-4-6-lab', '✉️', en ? '4.6 — Lab: six emails (refusing out-of-scope work)' : '4.6 — Lab: sáu email (có email từ chối việc ngoài phạm vi)', en ? 'The internal side of saying no.' : 'Phía nội bộ của việc nói không.')}

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>${en ? 'confirmation email · minutes · scope creep · clarification · change request (CR) · person-day · fixed-price contract · diff' : 'email xác nhận · minutes (biên bản) · scope creep (phạm vi phình to) · clarification (làm rõ) · change request (CR) · person-day (ngày công) · hợp đồng trọn gói · diff'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Every decision made by voice gets a confirmation email the same day: numbered, with Q&amp;A numbers, values and a deadline for corrections.' : 'Mỗi quyết định chốt bằng lời có một email xác nhận ngay trong ngày: đánh số, có mã Q&amp;A, giá trị cụ thể và hạn để sửa.'}</li>
<li>${en ? 'Every new spec version gets a diff. Classify: clarification, new scope, missing answer.' : 'Mỗi bản spec mới phải so diff. Phân loại: làm rõ, phạm vi mới, câu trả lời bị thiếu.'}</li>
<li>${en ? 'Never write "No problem, we will follow v0.4" — name the new items, their cost, and two options.' : 'Không bao giờ viết "No problem, we will follow v0.4" — gọi tên mục mới, chi phí, và hai phương án.'}</li>
<li>${en ? 'Developers notice and report scope changes; the PM decides and negotiates.' : 'Lập trình viên nhận ra và báo thay đổi phạm vi; PM quyết và thương lượng.'}</li>
</ul>
</div>`;

/* ═════════════ 5.4 — Lab Q&A list từ spec 3 trang ═════════════ */
const L54 = (en) => `
<div class="${en ? 'ml-en' : 'ml-vi'}">
<span class="eyebrow">${en ? 'Chapter 5 · Lab' : 'Chương 5 · Lab'}</span>
<h2>${en ? '5.4 — Lab: build a Q&amp;A list from a 3-page English spec' : '5.4 — Lab: lập Q&amp;A list từ một spec tiếng Anh 3 trang'}</h2>
<p class="lead">${en
    ? 'This is the first real task of many OJT developers: "Read the spec and prepare questions for the client by Wednesday." You get the full SRS v0.3 of the reservation module, a CSV template, and the checker <code>kiem-qa.mjs</code>. Goal: a Q&amp;A list the client can answer in one sitting, plus the short email that goes with it.'
    : 'Đây là việc thật đầu tiên của rất nhiều bạn OJT: "Đọc spec và chuẩn bị câu hỏi cho khách trước thứ Tư." Bạn có trọn SRS v0.3 của mô-đun đặt trước, một mẫu CSV, và công cụ <code>kiem-qa.mjs</code>. Mục tiêu: một Q&amp;A list khách trả lời được trong một lần ngồi, kèm email ngắn gửi đi.'}</p>

<h3>${en ? 'Pass criteria' : 'Tiêu chí đạt'}</h3>
<ul>
<li>${en ? 'At least <strong>10 questions</strong>, all closed, each with a proposal, a spec reference, a priority and a need-by date.' : 'Ít nhất <strong>10 câu</strong>, đều là câu đóng, mỗi câu có đề xuất, tham chiếu spec, ưu tiên và hạn cần.'}</li>
<li>${en ? 'No duplicates; one question per row; the checker prints <code>no warnings</code>.' : 'Không trùng; mỗi dòng một câu; công cụ in <code>no warnings</code>.'}</li>
<li>${en ? 'High priority only for what blocks design or the core screens, and you can say why in one sentence.' : 'High chỉ dành cho thứ chặn thiết kế hoặc màn hình lõi, và bạn giải thích được bằng một câu.'}</li>
<li>${en ? 'A cover email (lesson 4.1 structure) that passes <code>kiem-email.mjs</code>.' : 'Một email kèm theo (cấu trúc bài 4.1) qua được <code>kiem-email.mjs</code>.'}</li>
</ul>

<h3>${en ? 'Step 1 — Read the spec (about 15 minutes)' : 'Bước 1 — Đọc spec (khoảng 15 phút)'}</h3>
<p>${en
    ? 'Use the three passes of lesson 1.1: skim the headings; read and mark; then hunt. While reading, mark four kinds of trouble: <strong>vague words</strong> (reasonable, a few, some, fast, etc., similar), <strong>missing numbers</strong> (how long, how many, when), <strong>contradictions</strong> between two sections, and <strong>RFC 2119 words used loosely</strong> (should vs must — lesson 1.3).'
    : 'Dùng ba lượt đọc của bài 1.1: lướt tiêu đề; đọc và đánh dấu; rồi săn lỗi. Khi đọc, đánh dấu bốn loại vấn đề: <strong>từ mơ hồ</strong> (reasonable, a few, some, fast, etc., similar), <strong>thiếu con số</strong> (bao lâu, bao nhiêu, khi nào), <strong>mâu thuẫn</strong> giữa hai mục, và <strong>từ RFC 2119 dùng lỏng</strong> (should hay must — bài 1.3).'}</p>
${mau(SPEC3, en ? 'srs-reservation-v0.3.txt — the full spec (about 3 printed pages). LabFlow and the client are fictional; the writing style is typical of real client drafts.' : 'srs-reservation-v0.3.txt — trọn spec (khoảng 3 trang in). LabFlow và khách là hư cấu; văn phong giống bản nháp khách gửi thật.')}

<h3>${en ? 'Step 2 — Fill in the template' : 'Bước 2 — Điền vào mẫu'}</h3>
<p>${en
    ? 'Open Excel, LibreOffice Calc or Google Sheets, paste this header into row 1, and save as <strong>CSV UTF-8</strong> (<code>qa-list.csv</code>). Asked on = 2026-11-19. Today you are on 2026-11-20.'
    : 'Mở Excel, LibreOffice Calc hoặc Google Sheets, dán dòng tiêu đề này vào hàng 1, lưu dạng <strong>CSV UTF-8</strong> (<code>qa-list.csv</code>). Asked on = 2026-11-19. Hôm nay là 2026-11-20.'}</p>
${mau('No,Spec ref,Category,Question,Our proposal,Priority,Need by,Asked on,Answered by,Answer,Status')}

<h3>${en ? 'Step 3 — Run the checker' : 'Bước 3 — Chạy công cụ kiểm'}</h3>
<p>${en
    ? 'Save the tool below as <code>kiem-qa.mjs</code> next to your CSV. It uses only Node.js (18 or newer), no packages. No Node? Use Docker.'
    : 'Lưu công cụ dưới đây thành <code>kiem-qa.mjs</code> cạnh tệp CSV. Chỉ cần Node.js (18 trở lên), không cần gói nào. Không có Node thì dùng Docker.'}</p>
${mau(`
$ node kiem-qa.mjs qa-list.csv --today=2026-11-20
# or, without Node installed:
$ docker run --rm --network none -v "$PWD":/w -w /w node:22-alpine node kiem-qa.mjs qa-list.csv --today=2026-11-20
`)}
<details><summary>${en ? 'kiem-qa.mjs — full source (about 100 lines, read it: every rule of lessons 5.1–5.2 is one line here)' : 'kiem-qa.mjs — mã nguồn đầy đủ (khoảng 100 dòng, nên đọc: mỗi luật của bài 5.1–5.2 là một dòng ở đây)'}</summary>
${mau(KIEMQA)}
</details>
<p>${en
    ? 'Fix every warning — or decide consciously that it is a false alarm and be able to say why (like "LINE" in lesson 5.3).'
    : 'Sửa mọi cảnh báo — hoặc quyết định có ý thức rằng đó là báo nhầm và nói được vì sao (như chữ "LINE" ở bài 5.3).'}</p>

<h3>${en ? 'Step 4 — Write the cover email' : 'Bước 4 — Viết email kèm bảng'}</h3>
<p>${en
    ? 'Five to ten lines: how many questions, how many are High, the need-by date with a time zone, and how the client can answer quickly. Check it with <code>kiem-email.mjs</code> from lesson 4.6.'
    : 'Năm tới mười dòng: bao nhiêu câu, bao nhiêu câu High, hạn cần có múi giờ, và cách khách trả lời nhanh. Kiểm bằng <code>kiem-email.mjs</code> của bài 4.6.'}</p>

<details><summary>${en ? 'Hints: 18 places in the spec worth a question' : 'Gợi ý: 18 chỗ trong spec đáng hỏi'}</summary>
<p>3.1.3 should not · 3.2.2 reasonable / 3 days vs 4.1 one week · 3.2.3 a few · 3.2.5 + 4.3 priority rule · 3.3.1 should · 3.3.2 etc. · 3.4.1 before · 3.5.2 some time · 3.5.3 too many / some days · 3.5.4 as same as before · 3.6.2 or a similar format · 4.2 peak hours · 4.4 class · 5.1 fast · 5.3 mobile · 5.5 kept · 5.6 local time · 7.2 migration</p>
</details>

<h3>${en ? 'Rubric (30 points)' : 'Thang chấm (30 điểm)'}</h3>
<table>
<thead><tr><th>${en ? 'Criterion' : 'Tiêu chí'}</th><th>${en ? 'Points' : 'Điểm'}</th></tr></thead>
<tbody>
<tr><td>${en ? 'Coverage: found ≥ 13 of the 18 hint areas' : 'Độ phủ: tìm được ≥ 13 trong 18 vùng gợi ý'}</td><td>6</td></tr>
<tr><td>${en ? 'Every question closed, one per row, with a value in it' : 'Mọi câu đều đóng, mỗi dòng một câu, có giá trị cụ thể'}</td><td>6</td></tr>
<tr><td>${en ? 'Proposals realistic and consistent with each other (no 3 days in one row and 5 in another)' : 'Đề xuất thực tế và không mâu thuẫn nhau (không dòng này 3 ngày dòng kia 5)'}</td><td>5</td></tr>
<tr><td>${en ? 'Spec references precise; contradictions cite both sections' : 'Tham chiếu chính xác; câu về mâu thuẫn ghi cả hai mục'}</td><td>3</td></tr>
<tr><td>${en ? 'Priority + need-by sensible (High = blocks design)' : 'Ưu tiên + hạn hợp lý (High = chặn thiết kế)'}</td><td>3</td></tr>
<tr><td>${en ? 'English: inversion, articles, no negative questions, no Vietnamese' : 'Tiếng Anh: đảo trợ động từ, mạo từ, không hỏi phủ định, không lẫn tiếng Việt'}</td><td>4</td></tr>
<tr><td>${en ? 'Cover email: BLUF, number of High items, deadline with time zone' : 'Email kèm: BLUF, số câu High, hạn có múi giờ'}</td><td>3</td></tr>
</tbody>
</table>
<p>${en ? '24+ = ready to send to a real client after your lead’s review. 18–23 = fix the weakest criterion and run again.' : '24+ = sẵn sàng gửi khách thật sau khi trưởng nhóm xem. 18–23 = sửa tiêu chí yếu nhất rồi chạy lại.'}</p>

<details><summary>${en ? 'Model answer: 18 questions + cover email (real checker output)' : 'Đáp án gợi ý: 18 câu + email kèm (output thật của công cụ)'}</summary>
${bangQA('qa-list-dap-an.csv', ['No', 'Spec ref', 'Category', 'Question', 'Our proposal', 'Priority', 'Need by'])}
${RUN('lab54', 'node kiem-qa.mjs lab54/qa-list-dap-an.csv --today=2026-11-20', NOTE_RUN(en))}
<p>${en
    ? 'Notes on the choices: Q-003 offers two options because both are reasonable and the team cannot guess. Q-009 states how the team reads "as same as before" — so a wrong reading is caught now. Q-016 is High because it is personal data (how long a student’s history is kept) and changes the database design. Q-017 and Q-018 are Low but useful: they put a fence around the scope in writing — exactly what lesson 5.3 needed later.'
    : 'Ghi chú về lựa chọn: Q-003 đưa hai phương án vì cả hai đều hợp lý và đội không đoán được. Q-009 nói rõ đội hiểu "as same as before" thế nào — hiểu sai sẽ lộ ngay bây giờ. Q-016 là High vì là dữ liệu cá nhân (giữ lịch sử sinh viên bao lâu) và đổi thiết kế CSDL. Q-017, Q-018 là Low nhưng có ích: chúng rào phạm vi bằng văn bản — đúng thứ bài 5.3 cần về sau.'}</p>
${E('54-email.txt', en ? 'mau/54-email.txt — the cover email (checked in lesson 5.3’s practice run: OK).' : 'mau/54-email.txt — email kèm bảng (đã chạy kiểm ở bài luyện 5.3: OK).')}
</details>

<h3>🎤 ${en ? 'Interviewers will ask (answer in English, 30–60 seconds each)' : 'Phỏng vấn viên sẽ hỏi (trả lời bằng tiếng Anh, mỗi câu 30–60 giây)'}</h3>
<p>${en ? 'Typical OJT/fresher questions about requirements. Say your answer aloud and record it before opening the model.' : 'Câu hỏi thường gặp khi phỏng vấn OJT/fresher về yêu cầu. Nói thành tiếng và ghi âm trước khi mở đáp án mẫu.'}</p>
<p><strong>1. Tell me about a time the requirements were unclear. What did you do?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
In my team project at FPT University, the spec said a loan could be
"extended", but not how many times or for how long. Instead of guessing,
I listed it with four other unclear points in a shared Q&A sheet. For each
one I wrote our assumption, for example "one extension of 7 days", and
asked the lecturer to confirm. She answered all five in one day, and we
did not have to rework the extension screen. Since then I always ask with
a proposal, not an open question.
`)}</details>
<p><strong>2. The client asks for a "small" change two days before the release. How do you respond?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
First I thank them and make sure I understand the change exactly. Then I
check the impact with my team lead: effort, risk, and what must be tested
again. I don't say yes or no on my own. We usually give the client two
options, for example: release on time without the change and add it in
the next version, or include it and move the date. And we confirm their
choice in writing.
`)}</details>
<p><strong>3. How do you make sure nothing gets lost when you ask a client many questions?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
I keep one Q&A list for the project: every question has a number, the
spec section, our proposal, a priority and a "need by" date. I only close
a question when the answer is in the spec or a ticket, not just when the
client replies. And I review the open questions in every client meeting.
`)}</details>
<p><strong>4. What is the difference between a clarification and a change request?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
A clarification makes an existing requirement precise - for example,
"a few reservations" becomes "at most three". It doesn't add work we
haven't estimated. A change request adds or changes scope: a new screen,
a new integration, a new export format. That needs an estimate and the
client's approval before we build it.
`)}</details>
<p><strong>5. You asked the client a question a week ago and got no answer. What do you do?</strong></p>
<details><summary>${en ? 'Model answer' : 'Đáp án mẫu'}</summary>${mau(`
First I check if it's really blocking. If it is, I tell my PM what is
blocked and since when, so it becomes a project risk, not just my
problem. Then I follow up politely with the question number and the
date we need the answer by, and I raise it in the next meeting. If we
have a reasonable proposal, I suggest continuing with it so the team
isn't idle.
`)}</details>
${lienKet('/courses/interview-prep/learn?lessonSlug=pv-2-2-star', '🎤', en ? 'Interview prep 2.2 — STAR stories' : 'Chuẩn bị phỏng vấn 2.2 — Câu chuyện STAR', en ? 'Structure for question 1.' : 'Khung cho câu 1.')}
${lienKet('/courses/tieng-anh-ky-thuat-di-lam/learn?lessonSlug=tak-1-3-spec', '📄', en ? '1.3 — Specs: RFC 2119 words and ambiguity' : '1.3 — Spec: từ RFC 2119 và chỗ mơ hồ', en ? 'Reread before step 1 if "should" vs "must" is not clear yet.' : 'Đọc lại trước bước 1 nếu chưa rõ "should" và "must".')}

<h3>${en ? 'At work' : 'Khi đi làm'}</h3>
<p>${en
    ? 'In many Japanese-client projects at FPT Software, the BrSE (bridge system engineer) sends the Q&amp;A list and translates when needed — but the questions come from developers. A developer whose rows need no rewriting is noticed quickly. Ask your BrSE on day one: which template, which tool, which language, and who sends it.'
    : 'Ở nhiều dự án khách Nhật tại FPT Software, BrSE (kỹ sư cầu nối) là người gửi Q&amp;A list và dịch khi cần — nhưng câu hỏi đến từ lập trình viên. Bạn nào viết dòng không phải sửa lại sẽ được để ý rất nhanh. Ngày đầu hãy hỏi BrSE: mẫu nào, công cụ nào, ngôn ngữ nào, ai gửi.'}</p>

<h3>${en ? 'Key terms' : 'Thuật ngữ chính'}</h3>
<p>${en ? 'SRS · Q&amp;A list · closed question · proposal · need-by · cover email · BrSE' : 'SRS · Q&amp;A list · câu hỏi đóng · đề xuất · need-by · email kèm · BrSE'}</p>
<h3>${en ? 'Summary' : 'Tóm tắt'}</h3>
<ul>
<li>${en ? 'Read in three passes; mark vague words, missing numbers, contradictions, loose should/must.' : 'Đọc ba lượt; đánh dấu từ mơ hồ, thiếu số, mâu thuẫn, should/must lỏng.'}</li>
<li>${en ? 'One closed question per row with a proposal; run the checker; fix or justify every warning.' : 'Mỗi dòng một câu đóng kèm đề xuất; chạy công cụ; sửa hoặc giải thích từng cảnh báo.'}</li>
<li>${en ? 'Send the list with a short email: how many, how many High, by when (with time zone).' : 'Gửi bảng kèm email ngắn: bao nhiêu câu, bao nhiêu High, trước khi nào (có múi giờ).'}</li>
</ul>
</div>`;

/* ═════════════ 5.5 — Quiz chương 5 ═════════════ */
const QUIZ5 = [
  Q('tak5-1', 'Which question is best for a Q&A list?|||Câu nào tốt nhất cho Q&A list?', [
    'Please explain the no-show rule.|||Please explain the no-show rule.',
    'Is a reservation released 30 minutes after the start of the slot when the item is not picked up?|||Is a reservation released 30 minutes after the start of the slot when the item is not picked up?',
    'What about no-show and cancel? And how many days blocked?|||What about no-show and cancel? And how many days blocked?',
    'No-show rule is how many minutes|||No-show rule is how many minutes',
  ], 1, 'Closed, one question, contains the value. Lessons 5.1–5.2.|||Câu đóng, một câu hỏi, có giá trị cụ thể. Bài 5.1–5.2.'),
  Q('tak5-2', 'The client replied to Q-004: "Mandatory. We will update the SRS." What status should Q-004 have now?|||Khách trả lời Q-004: "Mandatory. We will update the SRS." Q-004 nên ở trạng thái nào?', [
    'Closed|||Closed',
    'Answered, until the SRS really contains it|||Answered, tới khi SRS thật sự có nội dung đó',
    'Delete the row|||Xoá dòng',
    'Done|||Done',
  ], 1, 'Answered ≠ Closed; close only when the answer is reflected in the spec or a ticket. Lesson 5.1.|||Answered ≠ Closed; chỉ đóng khi câu trả lời đã vào spec hoặc ticket. Bài 5.1.'),
  Q('tak5-3', 'Q-012 is no longer needed because screen RS-04 was removed. What do you do?|||Q-012 không còn cần vì màn hình RS-04 bị bỏ. Bạn làm gì?', [
    'Delete the row and renumber the rest|||Xoá dòng và đánh số lại',
    'Reuse Q-012 for the next new question|||Dùng lại Q-012 cho câu hỏi mới kế tiếp',
    'Close it with the answer "Not needed: RS-04 removed (SRS v0.5)"|||Đóng nó với câu trả lời "Not needed: RS-04 removed (SRS v0.5)"',
    'Leave it Open|||Để Open',
  ], 2, 'Never delete or reuse numbers: people refer to "Q-012" in emails. Lesson 5.1.|||Không xoá, không dùng lại số: email đã nhắc tới "Q-012". Bài 5.1.'),
  Q('tak5-4', 'Which is the correct English yes/no question?|||Câu hỏi có/không nào đúng?', [
    'The report includes cancelled items?|||The report includes cancelled items?',
    'Does the report include cancelled items?|||Does the report include cancelled items?',
    'Is the report include cancelled items?|||Is the report include cancelled items?',
    'Report include cancelled items or not?|||Report include cancelled items or not?',
  ], 1, 'Ordinary verb ⇒ add do/does before the subject; the main verb goes back to its base form. Lesson 5.2.|||Động từ thường ⇒ thêm do/does trước chủ ngữ; động từ chính về dạng nguyên mẫu. Bài 5.2.'),
  Q('tak5-5', 'Why avoid "Is approval not required for teachers?" with a Japanese client?|||Vì sao tránh hỏi khách Nhật "Is approval not required for teachers?"?', [
    'It is too long|||Vì quá dài',
    '"Yes" can mean "required" in English but "not required" in Japanese-style answers|||"Yes" có thể nghĩa "cần" theo kiểu Anh nhưng "không cần" theo kiểu trả lời Nhật',
    'Japanese clients do not answer questions|||Khách Nhật không trả lời câu hỏi',
    'The word "approval" is rude|||Từ "approval" là bất lịch sự',
  ], 1, 'Ask the positive form: "Do teachers’ reservations also need approval?" Lesson 5.2.|||Hỏi dạng khẳng định: "Do teachers’ reservations also need approval?" Bài 5.2.'),
  Q('tak5-6', 'When is an open question acceptable?|||Khi nào câu hỏi mở chấp nhận được?', [
    'Never|||Không bao giờ',
    'When you have no basis for a guess — and then ask narrowly, e.g. for an example|||Khi bạn không có cơ sở để đoán — và khi đó hỏi hẹp, ví dụ xin một mẫu',
    'When the client is senior|||Khi khách là cấp cao',
    'When you are in a hurry|||Khi bạn đang vội',
  ], 1, '"Could you share one example of the monthly report you use today?" Lesson 5.2.|||"Could you share one example of the monthly report you use today?" Bài 5.2.'),
  Q('tak5-7', 'SRS v0.4 changes "Excel or a similar format" to "Excel (.xlsx) and PDF". This is…|||SRS v0.4 đổi "Excel or a similar format" thành "Excel (.xlsx) and PDF". Đây là…', [
    'a typo fix|||sửa lỗi chính tả',
    'a clarification, no impact|||làm rõ, không ảnh hưởng',
    'new scope: a second export format ⇒ change request|||phạm vi mới: thêm một kiểu xuất ⇒ change request',
    'none of our business|||không liên quan tới đội',
  ], 2, '"or" became "and": two exports instead of one. Lesson 5.3.|||"or" thành "and": hai kiểu xuất thay vì một. Bài 5.3.'),
  Q('tak5-8', 'The client sends v0.4: "A small update reflecting the Q&A. Please continue." Best first step?|||Khách gửi v0.4: "A small update reflecting the Q&A. Please continue." Bước đầu tốt nhất?', [
    'Reply "No problem, we will follow SRS v0.4."|||Trả lời "No problem, we will follow SRS v0.4."',
    'Compare v0.4 with v0.3 line by line and classify every change|||So v0.4 với v0.3 từng dòng và phân loại mọi thay đổi',
    'Start coding the new sections|||Bắt tay code các mục mới',
    'Ask the client what changed|||Hỏi khách đã đổi gì',
  ], 1, 'A diff shows additions, removals — and answers that are missing. Lesson 5.3.|||Diff cho thấy phần thêm, phần bỏ — và câu trả lời bị thiếu. Bài 5.3.'),
  Q('tak5-9', 'A client asks you directly in Teams to "quickly add" Google Calendar export. You are a developer. Best reply?|||Khách nhắn thẳng bạn trên Teams "thêm nhanh" xuất ra Google Calendar. Bạn là lập trình viên. Trả lời nào tốt nhất?', [
    'Sure, I will add it tonight.|||Sure, I will add it tonight.',
    'We cannot do it.|||We cannot do it.',
    'It is difficult.|||It is difficult.',
    'Let me check the impact with my team lead and come back to you by tomorrow 12:00 JST.|||Let me check the impact with my team lead and come back to you by tomorrow 12:00 JST.',
  ], 3, 'Developers notice and report; the PM decides scope. Buy time with a date. Lesson 5.3.|||Lập trình viên nhận ra và báo; PM quyết phạm vi. Xin thời gian kèm hạn. Bài 5.3.'),
  Q('tak5-10', 'What does a good confirmation email after a meeting contain?|||Email xác nhận sau họp tốt có gì?', [
    '"Thanks for the meeting, see you next week."|||"Thanks for the meeting, see you next week."',
    'Numbered decisions with Q&A numbers and values, what is still open, and a deadline for corrections|||Các quyết định đánh số kèm mã Q&A và giá trị, việc còn mở, và hạn để sửa',
    'The full transcript of the call|||Toàn văn cuộc gọi',
    'Only the action items for the client|||Chỉ việc của khách',
  ], 1, '"As discussed in today’s meeting: 1. Q-003 … Please reply by 27 Nov if anything is wrong." Lesson 5.3.|||"As discussed in today’s meeting: 1. Q-003 … Please reply by 27 Nov if anything is wrong." Bài 5.3.'),
];

export default {
  title: 'Chapter 5 — Q&A lists and specs with clients|||Chương 5 — Q&A list và spec với khách hàng',
  description: 'Hỏi đúng cách để khách trả lời được ngay: Q&A list (cột, số, trạng thái Answered ≠ Closed), câu hỏi đóng có đề xuất, xác nhận bằng văn bản và nhận ra scope creep bằng diff spec — mọi bảng kiểm bằng công cụ kiem-qa.mjs chạy thật; lab lập Q&A list từ spec 3 trang + năm câu phỏng vấn tiếng Anh.',
  lessons: [
    { title: '5.1 — The Q&A list: columns, numbering, status, who answers|||5.1 — Q&A list: các cột, đánh số, trạng thái, ai trả lời', slug: 'tak-5-1-qa-list', type: 'LESSON', isFreePreview: true, description: 'Bản Q&A list đầu của sinh viên bị công cụ báo 27 cảnh báo, sáu thói quen làm hỏng bảng, ý nghĩa từng cột, vòng đời Open/Answered/Closed/On hold, bản sửa + danh sách câu mở dán vào email, góc hacker Samsung 2023 (dữ liệu dự án dán vào chatbot), bài sửa bốn dòng.', content: L51(true) + L51(false) },
    { title: '5.2 — Closed questions with a proposal: "We assume X. Is that correct?"|||5.2 — Câu hỏi đóng có đề xuất: "Chúng tôi giả định X. Như vậy có đúng không?"', slug: 'tak-5-2-cau-hoi-dong', type: 'LESSON', isFreePreview: true, description: 'Năm dạng câu hỏi đóng, đề xuất lấy từ đâu, tám câu hỏi mở viết lại (output thật), ngữ pháp đảo trợ động từ, tránh câu hỏi phủ định với khách Nhật, khi nào được hỏi mở, kèm bằng chứng, bài viết lại tám câu.', content: L52(true) + L52(false) },
    { title: '5.3 — Confirming changes in writing and spotting scope creep|||5.3 — Xác nhận thay đổi bằng văn bản và nhận ra phạm vi phình to', slug: 'tak-5-3-xac-nhan', type: 'LESSON', isFreePreview: true, description: 'Email xác nhận sau họp ("As discussed in today’s meeting"), so hai bản spec bằng git diff thật và phân loại làm rõ/phạm vi mới/thiếu, sáu câu nhận ra change request, email CR có chi phí và hai phương án, câu từ chối lịch sự, sự cố thật Queensland Health 2010 và Hertz–Accenture 2019.', content: L53(true) + L53(false) },
    { title: '5.4 — Lab: build a Q&A list from a 3-page English spec|||5.4 — Lab: lập Q&A list từ một spec tiếng Anh 3 trang', slug: 'tak-5-4-lab', type: 'LESSON', isFreePreview: true, description: 'Trọn SRS v0.3 mô-đun đặt trước thiết bị, mẫu CSV, công cụ kiem-qa.mjs in nguyên văn (Node hoặc Docker), rubric 30 điểm, đáp án 18 câu hỏi đóng + email kèm (output thật), năm câu phỏng vấn tiếng Anh về yêu cầu có đáp án mẫu.', content: L54(true) + L54(false) },
    {
      title: '5.5 — Chapter 5 quiz|||5.5 — Kiểm tra Chương 5',
      slug: 'tak-5-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu: câu hỏi tốt cho Q&A list, Answered và Closed, không xoá dòng, câu hỏi có/không, câu hỏi phủ định, khi nào hỏi mở, "or" thành "and", so diff spec, trả lời yêu cầu thêm việc, email xác nhận.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions built from the Q&amp;A lists and emails of this chapter. Every explanation names the lesson to reread.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu dựng từ chính các Q&amp;A list và email trong chương. Lời giải câu nào cũng chỉ ra bài cần đọc lại.</p>
</div>
`,
      quiz: { timeLimitSeconds: 900, questions: QUIZ5 },
    },
  ],
};
