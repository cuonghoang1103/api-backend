/** dm5 G2 (27/11/2026): System Messages, Report 2/3/4/6/7 fills, RTM coverage, Q&A target, RACI by role, ADR, submission check. */
export const g2 = {
  // B9 System Messages
  tabMessages: 'System messages',
  smIntro: 'One message per case (SM-xx) — table "5.2 System Messages" of Report 3. Reference the code in use case flows ("LabFlow shows SM-03").',
  smAdd: 'Add message', smEdit: 'Edit {key}', smType: 'Message type', smContext: 'Context (screen / action)', smText: 'Content', smTextEn: 'Content in English (optional)',
  smHttp: 'HTTP status (optional)', smUseCases: 'Used by use cases', smUseCasesHint: 'Codes separated by commas: UC-01, UC-03', smNone: 'No system messages yet',
  smNoneBody: 'Add the error, warning, confirmation and success messages the screens show — one message per case.',
  smUnknown: 'Mentioned in use cases but not in the register: {list}', smMentioned: 'Mentioned in {list}', smSaveFailed: 'Could not save the message', smDeleted: 'Message deleted',
  smDeleteConfirm: 'Delete {key}?', smApprove: 'Approve', smUnused: 'Not used by any use case',
  t_ERROR: 'Error', t_WARNING: 'Warning', t_INFO: 'Information', t_CONFIRMATION: 'Confirmation', t_SUCCESS: 'Success',
  // B8 lint codes (six links)
  gSystemSubject: 'uses the word "System" {n} time(s) — write the system\'s name instead', gStepRef: 'alternative/exception flow points to step {list} that the Normal Flow does not have',
  gCodeInPost: 'Postconditions mention {list} — keep business rules and messages out, describe the stored data state', gSmUnknown: 'mentions {list} — no such system message',
  // B13 RTM
  covTitle: 'Coverage indicators', covCodedNoSds: 'UC coded without SDS', covTestedNoSt: 'UC tested without System Test', covBr: 'Business rules with a test', covOrphans: 'Untraced tests',
  nfrTitle: 'NFR → measurement → test', nfrCol: 'NFR', nfrMeter: 'Meter', nfrMust: 'Must', nfrPlan: 'Plan', nfrTests: 'Tests / measurements', nfrResult: 'Result', nfrNone: 'No measurable NFR yet.',
  // Docs menu
  fillReport4: 'Fill Report 4 (database tables, diagrams, classes)', fillReport4Repo: 'Fill Report 4 from the repository (Flyway + Java)', fillReport6: 'Fill the user manual from SRS screens',
  filledR4: 'Filled: {what}', skippedR4: 'Skipped: {what}', r6Added: 'Added {n} section(s)', r6Nothing: 'The user manual already has every SRS screen',
  r6Warn: 'Headings that do not match an SRS screen: {list}', fillRaciHonest: 'Fill RACI — honest (student + supervisor)', fillRaciRoles: 'Fill RACI — internal, by hat (C1–C5)',
  checkFinal: 'Check before assembling', checksTitle: 'Cross-checks of Reports 1–6', checksClean: 'No problems found — the reports agree with the project data.',
  checksErrors: '{n} error(s) · {w} warning(s) — the final report was still assembled; fix these before submitting.', reportN: 'Report {n}',
  adrSupersede: 'Mark as superseded by…', adrSupersedeTitle: 'Superseded by which ADR?', adrPick: 'New ADR', adrDone: '{old} is now superseded by {by}',
  // B14 submission check
  recheck: 'Check again',
  tabSubmit: 'Submission check', submitIntro: 'The ten red-pen errors lecturers circle most — checked against the project data before you submit.',
  submitPassed: '{p} passed · {f} to fix · {n} not applicable', submitNa: 'Not applicable yet', submitUcNames: 'Use case ↔ issue ↔ WBS',
  // B6 / B5 Q&A
  qaProposal: 'Proposal', qaOptionA: 'Option A', qaOptionB: 'Option B', qaTarget: 'Target code', qaTargetHint: 'BR-03 / UC-05 / SM-02 / FE-1 / issue key — what the answer changes',
  qaNoTarget: 'Closed without a target code', qaNoTargetCount: '{n} closed question(s) without a target code', qaBlockHint: 'This project requires a target code before closing a question.',
  toQna: 'Push to Q&A', toQnaDone: 'Logged as {key}', inQna: 'In Q&A: {key}',
  // B2 RACI
  seedHats: 'Add the 5 hats (C1–C5)', seedHatsDone: '{n} hat(s) added', presetReport2: 'Add Report 2 work packages', presetDone: '{n} activity(ies) added',
  kRole: 'Role / hat', raciOneRole: '{stakeholder} holds {count}% of all A — one hat owns most decisions',
  // B16 diagrams
  pumlFailed: 'Could not draw the PlantUML diagram',
  dbTables: 'Database design tables', dbTablesTitle: 'Database design — {n} table(s)', dbToReport4: 'Put into Report 4 §1.3', dbPut: 'Report 4 §1.3 filled ({n} tables)',
  dbConstraints: 'Constraints', dbProblems: 'Parser problems: {list}',
};
