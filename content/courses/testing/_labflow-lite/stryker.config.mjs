// Mutation testing with StrykerJS (lesson 8.2): npm run test:mutation  (= npx stryker run)
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'vitest.config.js', dir: 'src' },   // the unit suite only: demo*/ holds tests that are red on purpose
  mutate: ['src/rules/**/*.js', '!src/**/*.test.js'],
  coverageAnalysis: 'perTest',                              // each mutant runs only the tests that reach its code
  reporters: ['clear-text', 'progress', 'html'],
  clearTextReporter: { allowEmojis: false, logTests: false },
  htmlReporter: { fileName: 'reports/mutation/index.html' },
  thresholds: { high: 90, low: 80, break: 80 },            // below 80% the command fails
  tempDirName: '.stryker-tmp',                              // excluded in vitest.config.js (a crashed run leaves a copy of src/ here)
};
