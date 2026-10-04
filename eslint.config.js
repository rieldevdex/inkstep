import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'preview/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['src/client/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/components/**/*.js', 'src/state/**/*.js', 'src/lib/**/*.js', 'src/content/**/*.js'],
    rules: {
      // presentational and state layers must stay pure: no DOM or browser globals
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'navigator', 'fetch'],
    },
  },
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
  },
];
