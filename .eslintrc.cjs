module.exports = {
  root: true,
  extends: ['airbnb-base', 'eslint:recommended'],
  plugins: ['svelte3'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    // Exception for `update` method on Svelte writable stores, see https://svelte.dev/docs#run-time-svelte-store-writable
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ['\\S+Store\\b'] }],
    // Exception for Svelte store import statement `...from 'svelte/store'`in src/store.js
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['src/store.js'] }],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
