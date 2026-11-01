// Lesson 8.2: Stryker on booking.js, judged by the weak suite only.
export default {
  testRunner: 'vitest',
  vitest: { configFile: 'demo8/vitest.yeu.config.js' },
  mutate: ['src/rules/booking.js'],
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress'],
  clearTextReporter: { allowEmojis: false, logTests: false },
  thresholds: { high: 80, low: 60, break: 60 },
  tempDirName: '.stryker-tmp',
};
