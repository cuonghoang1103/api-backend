# Data Dictionary
## for the Campus Academic and Registration System (CARS)

Version 1.0 approved
Prepared by **<Member 4 name>**, Business Analysis Team — Group <N>
Northern Regional University (NRU)
Last updated 17 September 2026

---

### Revision History

| Name | Date | Reason For Changes | Version |
|---|---|---|---|
| Member 4, Group <N> | 2026-09-17 | Elements harvested while use cases UC-01…UC-14 were written | 0.9 |
| Member 4, Group <N> | 2026-09-17 | Structures completed, cross-checked against business rules | 1.0 |

---

## 1. Notation

Per *Guidance for Data Dictionaries* (Wiegers & Beatty, Chapter 13):

| Symbol | Meaning |
|---|---|
| `+` | composed of / and |
| `( )` | optional element |
| `{ }` | repeating group |
| `min:max` | allowed number of repeats; `n` means unlimited |
| `[ a \| b ]` | either–or |
| `" "` | literal text |

Entries are ordered **alphabetically**. Structures leave *Length* and *Values* blank.
Every element named inside a structure has **its own entry**. Where a value is governed
by a business rule, the *Values* column cites the rule ID rather than repeating it.

---

## 2. Data Dictionary

| Data Element | Description | Composition or Data Type | Length | Values |
|---|---|---|---|---|
| Advice Notes | What an advisor recorded during an advising meeting | alphanumeric | 4000 | Visible to the advisor and the student's other advisors; **not** visible to the student (UC-13 flow 13.4) |
| Advising Hold | A block placed on a student that prevents enrollment until an advisor lifts it | Hold Identifier + Student Identifier + Hold Reason + Placed By + Placed At + (Expires At) + (Lifted By) + (Lifted At) | | |
| Advising Record | The record of one advising meeting | Record Identifier + Student Identifier + Advisor Identifier + Meeting Date + Advice Notes | | |
| Advisor Identifier | Unique identifier of an academic advisor | alphanumeric | 12 | Must exist as a staff record |
| Catalog Year | The academic year whose regulations a student is assessed against | numeric, YYYY | 4 | Set at matriculation and never changed; governs BR-02, BR-04 and BR-13 (UC-09 exception 9.0.E2) |
| Completion Percentage | Proportion of a programme a student has completed | decimal | 5 | 0.00–100.00; computed per BR-13 |
| Corequisite Course Code | A course that must be taken in the same semester as another | alphanumeric | 12 | Must exist as a Course Code; see BR-20 |
| Course | A unit of study offered by a faculty | Course Code + Course Title + Credits + Faculty Code + 0:n{Prerequisite Rule} + 0:n{Corequisite Course Code} | | |
| Course Code | Unique identifier of a course | alphanumeric | 12 | Format: three to four letters then three digits, e.g. SWR302 |
| Course Title | Human-readable name of a course | alphanumeric | 200 | Not blank |
| Credits | Credit value of a course | integer | 2 | 1–6 |
| Credits Applied | Credits counted toward one requirement group | integer | 3 | ≥ 0 |
| Credits Earned | Credits a student obtained from a completed course | integer | 2 | 0 if the course was failed |
| Credits Required | Credits a requirement group demands | integer | 3 | > 0 |
| Day Of Week | Day on which a section meets | alphabetic | 10 | [ Monday \| Tuesday \| Wednesday \| Thursday \| Friday \| Saturday ] |
| Decided At | Time an override decision was recorded | datetime, ISO 8601 with offset | 25 | Blank while the request is pending; drives the 48-hour measurement in BR-12 |
| Decided By | The Department Head or delegate who decided an override | alphanumeric | 12 | Must hold the Department Head role for the section's department (BR-11) |
| Decision Reason | Free text explaining an override decision | alphanumeric | 1000 | Mandatory for both approval and decline (UC-06 POST-3) |
| Degree Audit Result | The evaluated state of a student's progress toward their programme | Student Identifier + Programme Code + Catalog Year + Completion Percentage + 1:n{Requirement Group Result} | | |
| Eligibility Rule | The expression that determines which students belong to a priority wave | alphanumeric | 500 | Evaluated against Year Of Study and Programme Code; waves must not overlap (UC-12 exception 12.0.E2) |
| Email Address | University email address used for notifications | alphanumeric | 254 | Must contain exactly one "@"; assumption A6 |
| End Time | Time a section's meeting ends | time, HH:MM | 5 | Later than Start Time |
| Enrolled At | Time an enrollment was recorded | datetime, ISO 8601 with offset | 25 | System-generated |
| Enrollment | A student's registration in one section | Enrollment Identifier + Student Identifier + Section Identifier + Enrollment Status + Enrolled At + (Override Request Identifier) | | |
| Enrollment Identifier | Unique identifier of an enrollment | alphanumeric | 20 | System-generated |
| Enrollment Status | Current state of an enrollment | alphabetic | 14 | [ Enrolled \| Dropped \| Withdrawn \| Cancelled \| Invalidated ]; Invalidated results from UC-04 exception 4.0.E3 |
| Expires At | Time a hold or an offer ceases to apply | datetime, ISO 8601 with offset | 25 | For a waitlist offer, 24 hours after issue (BR-09) |
| Faculty Code | Identifier of the faculty owning a course or programme | alphanumeric | 8 | One of the six NRU faculties |
| Final Grade | Grade awarded for a completed course | alphanumeric | 4 | [ A \| B+ \| B \| C+ \| C \| D+ \| D \| F \| P \| W ]; compared against Minimum Grade for BR-02 |
| Financial Standing | A student's financial position as reported by the finance system | Student Identifier + Outstanding Balance + Finance Hold Flag + Retrieved At | | |
| Finance Hold Flag | Whether the finance system has placed an explicit registration block | alphabetic | 3 | [ Yes \| No ]; blocks enrollment regardless of balance (BR-05) |
| Full Name | Student's name as recorded at matriculation | alphabetic | 100 | Not blank; stores Vietnamese diacritics |
| Group Name | Name of a requirement group within a programme | alphanumeric | 100 | e.g. "Core", "Major electives", "General education" |
| Group Status | Evaluated state of one requirement group | alphabetic | 14 | [ Satisfied \| InProgress \| Outstanding \| NeedsReview ]; NeedsReview per UC-09 POST-3 |
| Group Type | Kind of requirement group | alphabetic | 14 | [ Core \| Major \| Elective \| General \| CreditTotal ] |
| Hold Identifier | Unique identifier of an advising hold | alphanumeric | 20 | System-generated |
| Hold Reason | Category and explanation of an advising hold | alphanumeric | 500 | Category visible to the student; explanation is not (UC-13 flow 13.4) |
| Joined At | Time a student joined a waitlist | datetime, ISO 8601 with offset | 25 | Determines queue position within a priority wave |
| Justification | The student's stated reason for requesting a capacity override | alphanumeric | 1000 | Mandatory; shown to the Department Head at UC-06 step 4 |
| Lecturer Name | Name of the lecturer teaching a section | alphabetic | 100 | Supplied by the timetable system |
| Lifted At | Time an advising hold was lifted | datetime, ISO 8601 with offset | 25 | Blank while the hold is active |
| Lifted By | Advisor who lifted an advising hold | alphanumeric | 12 | Must be an advisor assigned to the student |
| Meeting Date | Date of an advising meeting | date, YYYY-MM-DD | 10 | Not in the future |
| Meeting Pattern | One scheduled meeting of a section | Day Of Week + Start Time + End Time + Room Code | | |
| Minimum Grade | Lowest grade that satisfies a prerequisite | alphanumeric | 4 | A Final Grade value; default "D" |
| Minimum Viable Enrollment | Enrollment below which a section is under-enrolled | integer | 3 | Default 15, configurable per faculty and per section (BR-15) |
| Outstanding Balance | Amount a student currently owes | decimal, VND | 12 | ≥ 0; compared against the registration threshold in BR-05 |
| Override Request | A student's request for a place in a section they cannot otherwise take | Override Request Identifier + Student Identifier + Section Identifier + Request Ground + Justification + Submitted At + Request Status + (Decided By) + (Decided At) + (Decision Reason) | | |
| Override Request Identifier | Unique identifier of an override request | alphanumeric | 20 | System-generated |
| Placed At | Time an advising hold was placed | datetime, ISO 8601 with offset | 25 | System-generated |
| Placed By | Advisor or registrar who placed an advising hold | alphanumeric | 12 | Must hold an authorised role |
| Prerequisite Course Code | A course that must be completed before another | alphanumeric | 12 | Must exist as a Course Code |
| Prerequisite Rule | One prerequisite condition attached to a course | Prerequisite Course Code + Minimum Grade | | |
| Priority Wave | One cohort's registration opening period | Wave Name + Wave Start + Wave End + Eligibility Rule | | |
| Programme | A degree programme a student is enrolled in | Programme Code + Programme Name + Faculty Code + Total Credits Required + 1:n{Requirement Group} | | |
| Programme Code | Unique identifier of a degree programme | alphanumeric | 12 | Versioned by Catalog Year |
| Programme Name | Human-readable name of a programme | alphanumeric | 200 | Not blank |
| Published Capacity | Number of seats a section offers | integer | 4 | > 0; used by BR-03 |
| Queue Position | A student's place in a waitlist | integer | 4 | ≥ 1; assigned by Joined At within priority wave; never altered except per UC-07 |
| Record Identifier | Unique identifier of an advising record | alphanumeric | 20 | System-generated |
| Request Ground | The basis on which an override is requested | alphabetic | 20 | [ SectionFull \| PrerequisiteUnmet \| TimetableNecessity ] |
| Request Status | Current state of an override request | alphabetic | 12 | [ Pending \| Approved \| Declined \| Expired \| Withdrawn \| Void ]; a request never leaves Pending silently (UC-06 POST-1) |
| Requirement Group | One set of programme requirements | Group Name + Group Type + Credits Required + 1:n{Course Code} | | |
| Requirement Group Result | The evaluated state of one requirement group for one student | Group Name + Group Status + Credits Applied + 1:n{Course Code} | | |
| Retrieved At | Time financial data was read from the finance system | datetime, ISO 8601 with offset | 25 | Displayed with the figures (UC-10 POST-3) |
| Room Code | Identifier of the room a section meets in | alphanumeric | 12 | Supplied by the timetable system; CARS never edits it (EX-3) |
| Section | One scheduled offering of a course in one semester | Section Identifier + Course Code + Semester Code + Lecturer Name + Published Capacity + Minimum Viable Enrollment + Section Status + 1:n{Meeting Pattern} | | |
| Section Identifier | Unique identifier of a section | alphanumeric | 20 | System-generated |
| Section Status | Current state of a section | alphabetic | 14 | [ Planned \| Open \| Full \| Cancelled \| Closed ] |
| Semester Code | Identifier of an academic semester | alphanumeric | 10 | Format YYYY-S, e.g. 2026-1 |
| Start Time | Time a section's meeting begins | time, HH:MM | 5 | Earlier than End Time |
| Student | A person enrolled in a programme at the university | Student Identifier + Full Name + Email Address + Programme Code + Catalog Year + Year Of Study + Advisor Identifier + Student Status | | |
| Student Identifier | Unique identifier of a student | alphanumeric | 12 | Assigned at matriculation; the join key across CARS, the finance system and the learning management system |
| Student Status | Current enrolment standing of a student | alphabetic | 14 | [ Active \| Suspended \| Graduated \| Withdrawn \| OnLeave ]; only Active students may register |
| Submitted At | Time an override request was submitted | datetime, ISO 8601 with offset | 25 | Starts the 48-hour clock in BR-12 |
| Total Credits Required | Credits needed to complete a programme | integer | 3 | > 0; the denominator in BR-13 |
| Transcript Entry | One completed course on a student's academic record | Student Identifier + Course Code + Semester Code + Final Grade + Credits Earned + (Transfer Institution) | | |
| Transfer Institution | Institution from which a credit was transferred | alphanumeric | 200 | Present only for approved transfer credit (UC-04 flow 4.3) |
| Waitlist Entry | A student's position in a section's waitlist | Waitlist Entry Identifier + Student Identifier + Section Identifier + Queue Position + Joined At + Waitlist Status + (Expires At) | | |
| Waitlist Entry Identifier | Unique identifier of a waitlist entry | alphanumeric | 20 | System-generated |
| Waitlist Status | Current state of a waitlist entry | alphabetic | 12 | [ Queued \| Offered \| Accepted \| Declined \| Expired \| Removed ] |
| Wave End | Time a priority wave closes | datetime, ISO 8601 with offset | 25 | Later than Wave Start |
| Wave Name | Name of a priority wave | alphanumeric | 40 | e.g. "Wave 1 — final year" |
| Wave Start | Time a priority wave opens | datetime, ISO 8601 with offset | 25 | Waves must not overlap (BR-06) |
| Window End | Time the registration window closes | datetime, ISO 8601 with offset | 25 | Later than Window Start |
| Window Start | Time the registration window opens | datetime, ISO 8601 with offset | 25 | Fixed by the academic calendar |
| Year Of Study | The student's year within their programme | integer | 1 | 1–6; determines priority wave (BR-06) and credit limit (BR-04) |

---

## 3. Notes on selected entries

**Catalog Year** is the most consequential entry in this dictionary and the easiest to
omit. A student is assessed against the regulations in force when they matriculated,
not the current ones. Without this element, every annual curriculum revision silently
re-assesses every existing student — which is wrong, and is not permitted under
Academic Regulations §9.1. Three dynamic rules (BR-02, BR-04, BR-13) must be versioned
by it.

**Group Status includes NeedsReview** rather than only Satisfied, InProgress and
Outstanding. The three obvious values force the engine to guess when it cannot
evaluate a requirement — and a degree audit that guesses is the exact failure that
produced the complaint described in Vision & Scope §1.1.

**Queue Position exists as stored data, not as a computed rank.** Computing position
from Joined At on every read would be equivalent, until a student is skipped for
ineligibility (UC-07 flow 7.4) and must keep their place. Storing the position makes
the fairness rule expressible.

**Financial Standing carries Retrieved At** because CARS does not own this data. When
the finance system is unreachable (UC-10 exception 10.0.E1) the figures are shown with
their age rather than hidden or replaced with zero.
