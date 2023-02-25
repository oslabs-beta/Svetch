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
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsForRegex: ['\\S+Store$'] }],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
