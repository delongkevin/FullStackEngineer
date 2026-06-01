module.exports = {
  root: true,
  env: {
    es2021: true,
    jest: true,
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/jsx-uses-vars': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off'
  }
};
