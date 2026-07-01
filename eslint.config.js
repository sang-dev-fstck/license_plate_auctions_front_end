import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      prettier,
    },

    extends: [
      js.configs.recommended, // Rule mặc định ESLint cho JS
      ...tseslint.configs.recommended, // Rule mặc định cho TypeScript
      react.configs.recommended, // Rule mặc định cho React
      'plugin:import/recommended', // Rule mặc định cho import
      'plugin:import/typescript', // Import cho TS
      'plugin:prettier/recommended', // Kết hợp Prettier với ESLint
    ],

    settings: {
      react: {
        version: 'detect', // Tự phát hiện version React
      },
    },

    rules: {
      // React Hooks
      ...reactHooks.configs.recommended.rules,

      // HMR (React Refresh)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import order: lib trước, local sau
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      // Prettier formatting
      'prettier/prettier': [
        'warn',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'es5',
          endOfLine: 'auto',
        },
      ],
    },
  }
)
