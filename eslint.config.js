import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import fs from 'fs'

// Read and parse the globals.json file
const customGlobals = JSON.parse(fs.readFileSync('./.eslintrc-auto-import.json', 'utf8')).globals

export default defineConfig([
  {
    files: ['./src/**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...customGlobals,
      },
    },
  },
  globalIgnores(['dist']),
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 0,
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-undef': ['error', { allowGlobals: true }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          prefix: ['E'],
        },
      ],
    },
  },
])
