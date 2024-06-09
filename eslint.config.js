import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly' // Define URL as a global variable
      },
      ecmaVersion: 2021,
      sourceType: 'module'
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always']
    }
  },
  {
    files: ['**/__test__/**/*.js'], // Adjust the pattern to match your test files
    languageOptions: {
      globals: {
        beforeEach: 'readonly',
        test: 'readonly',
        expect: 'readonly'
      }
    }
  }
];
