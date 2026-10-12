import nextPlugin from 'eslint-config-next';

const config = [
  ...nextPlugin,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        node: { paths: ['.'], extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['error', 'warn'] }],
      'import/no-unresolved': 'error',
    },
  },
  {
    files: ['pages/api/**/*.js', 'src/lib/**/*.js'],
    languageOptions: {
      globals: { process: 'readonly' },
    },
  },
];

export default config;