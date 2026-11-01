// Mutation testing with StrykerJS (lesson 8.2): npm run test:mutation  (= npx stryker run)
// Lesson 11.2: run the mutants in UTC — the time zone of CI and of the servers. On a laptop in Viet Nam a mutant that drops
// "+07:00" from a date string changes nothing (local time IS +07:00) and survives; in UTC it is a real bug and the tests kill it.
process.env.TZ ??= 'UTC';
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.js', dir: 'src' },   // the unit suite only: demo*/ holds tests that are red on purpose
  mutate: ['src/rules/**/*.js', '!src/**/*.test.js'],
  coverageAnalysis: 'perTest',                              // each mutant runs only the tests that reach its code
  reporters: ['clear-text', 'progress', 'html', 'json'],     // json: read by the CI quality report (lesson 11.4)
  jsonReporter: { fileName: 'reports/mutation/mutation.json' },
  clearTextReporter: { allowEmojis: false, logTests: false },
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 98, low: 95, break: 95 },            // lesson 11.4: the ratchet — 80 in Ch8, 95 now (measured 99.08%); below 95% the command fails
  tempDirName: '.stryker-tmp',                              // excluded in vitest.config.js (a crashed run leaves a copy of src/ here)
};
