/** dm5 G4 (27/11/2026): code health, releases (freeze/tag/SHA), hours by role, CR/RAID, present timer, defence PREP, template library. */
export const g4 = {
  // CI (A2)
  ciSuccess: 'CI passed', ciFailure: 'CI failed', ciPending: 'CI running', ciNeutral: 'CI neutral', ciNone: 'No CI yet', ciOpen: 'Open CI run',
  // D12
  largePr: 'Large PR · {n} lines (over {max})', staleBranch: 'Open {n} days (over {max})',
  staleCount: '{count} branches open longer than {max} days — merge or close them', largeCount: '{count} open pull requests over {max} changed lines — split them',
  // D13
  healthTitle: 'Repository health', healthHint: 'Checked on the default branch {b}. A team repository should pass all five.',
  h_gitignore: '.gitignore', h_envExample: '.env.example', h_prTemplate: 'Pull request template', h_ci: 'CI workflow', h_branchProtection: 'Branch protection',
  stOk: 'OK', stMissing: 'Missing', stUnknown: 'Unknown', healthNotConnected: 'Connect GitHub or GitLab to check the repository.',
  // D11
  modeCritic: 'Critic only', modeFull: 'Full review', modeHint: 'Critic only = mentor mode: no code is written for you, every suggestion is a guiding question.',
  // D14
  freeze: 'Freeze', fz_NONE: 'No freeze', fz_FEATURE: 'Feature freeze', fz_CODE: 'Code freeze', fz_HARD: 'Hard freeze',
  fzHint_NONE: 'Anything can be added.', fzHint_FEATURE: 'No new requirements or stories — raise a change request.', fzHint_CODE: 'Only P0–P1 bugs (priority Highest/High).', fzHint_HARD: 'Locked — nothing can be added (admins can override, it is audited).',
  gitTag: 'Git tag', commitSha: 'Commit SHA', releaseCi: 'CI at release', tagShaHint: 'The tag and commit go into the release notes; CI at that commit is recorded when you release.',
  releaseNeedsCi: 'Release needs green CI at the commit',
  // C5
  from: 'From', to: 'To',
  tabRoles: 'Hours by role', rolesIntro: 'Your hours split by the five hats C1 PM · C2 BA · C3 Dev BE · C4 Dev FE · C5 QA, per week. The hats are a split of your real hours — they never add hours.',
  week: 'Week of', total: 'Total', alerts: 'Alerts', guessed: '{h} h were guessed from the activity or card labels — pick the role when logging time to be exact.',
  noLogs: 'No time logged in this range yet.', hatLabel: 'Role (hat)', hatAuto: 'Auto (from activity / labels)', person: 'Person', everyone: 'Everyone',
  thresholds: 'Alerts: QA below {qa}% of a week · more than {max} h in a week',
  // C8
  impactTitle: 'Impact analysis (6 dimensions)', dim_scope: 'Scope', dim_schedule: 'Schedule', dim_cost: 'Cost / effort', dim_quality: 'Quality / tests', dim_risk: 'Risk', dim_docs: 'Documents (SRS/SDS/RTM)',
  lvl_NONE: 'None', lvl_LOW: 'Low', lvl_MEDIUM: 'Medium', lvl_HIGH: 'High', notePh: 'What changes?',
  optionsTitle: 'Options', optTitlePh: 'Option {k}', effortDays: 'Effort (days)', pros: 'Pros', cons: 'Cons', chosen: 'Chosen', saveImpact: 'Save analysis', savedImpact: 'Analysis saved',
  split: 'Split', splitTitle: 'Split into sub-requests', splitPart: 'Part {n}', addPart: 'Add part', splitDone: 'Created {keys}', children: 'Sub-requests',
  syncTitle: 'Sync checklist after approval', syncHint: 'Tick each document once you updated it for this change.', syncLocked: 'Opens once the change request is approved.',
  sync_srsRoc: 'SRS/SDS Record of Changes (A/M/D row)', sync_trackingQna: 'Project Tracking › Q&A', sync_trackingIssues: 'Project Tracking › Issues', sync_trackingWbs: 'Project Tracking › WBS', sync_rtm: 'RTM (UC/BR ↔ tests)',
  syncProgress: '{done}/{total} updated',
  // C10
  contingency: 'Plan B (contingency)', contingencyPh: 'What you will do WHEN it happens (e.g. play the recorded demo clip)',
  toIssue: 'Create issue', toIssuePlanB: 'Issue for Plan B', toIssueDone: '{key} created and linked',
  // D15
  timer: 'Timer', duration: 'Duration (min)', marks: 'Minute marks', addMark: 'Add mark', markLabelPh: 'Section', planB: 'Plan B', planBUrl: 'Plan B link (backup demo clip)', planBLabel: 'Button label',
  save: 'Save', saved: 'Saved', overtime: 'Over time', start: 'Start', pause: 'Pause', reset: 'Reset', openPlanB: 'Open Plan B', settingsTitle: 'Defence timing',
  // D16
  timer40: '{s} s', prepTitle: 'PREP — answer in about 40 seconds', prepP1: 'Point — the answer in one sentence', prepR: 'Reason — why', prepE: 'Example — a screen, table, test or commit of yours', prepP2: 'Point — say it again',
  timeUp: 'Time is up — finish with your Point', restartTimer: 'Restart timer',
  // A25
  library: 'Template library', libraryIntro: 'Ready-made setups: workflow, fields, gates, meetings, stages and Docs templates. You choose what to include.',
  copyFrom: 'Copy configuration from a project', copyPick: 'Pick a project in this workspace', copyHint: 'Copies workflow, rules, issue types, labels, fields, settings, issue templates and the Docs tree (titles). Never issues, work logs or members.',
  copyBodies: 'Also copy the Docs page contents', groups: 'What to set up', preview: 'Preview', previewLoading: 'Loading preview…', notCopied: 'Not copied: {n} issues, work logs, sprints, members.',
  setupSkipped: 'Some parts were skipped: {list}', usingBlueprint: 'Template set: {name}', clearBlueprint: 'Use a basic template instead',
  // C7
  decision: 'Decision', dec_ACCEPTED: 'Accepted', dec_REJECTED: 'Rejected', dec_PARTIAL: 'Partly accepted', decNone: 'Not decided',
};
