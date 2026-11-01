// ESLint "flat config": which files, which rules. The VS Code ESLint extension reads this same file.
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,                       // the rules almost everyone agrees on
  {
    files: ['src/**/*.js'],
    languageOptions: { globals: globals.browser },  // window, document… exist; anything else is a typo
    rules: { eqeqeq: 'error' },                  // one extra rule: always === instead of ==
  },
];
