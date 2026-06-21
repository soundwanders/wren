import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import tseslint from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  ...expoConfig,
  {
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.expo/', 'scripts/', '__mocks__/', 'App.jsx'],
  },
]);
