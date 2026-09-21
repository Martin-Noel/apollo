module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    // react-three-fiber renders three.js objects as JSX intrinsics (pointLight, primitive, Clone, ...)
    // whose props aren't real DOM attributes, so this rule doesn't know about them by default.
    'react/no-unknown-property': ['error', { ignore: ['position', 'intensity', 'castShadow', 'object'] }],
  },
}
