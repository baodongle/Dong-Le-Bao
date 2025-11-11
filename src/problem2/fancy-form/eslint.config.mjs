import nx from '@nx/eslint-plugin'
import { sheriff } from 'eslint-config-sheriff'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...pluginQuery.configs['flat/recommended'],
  ...sheriff({
    react: true,
    vitest: true,
  }),
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    // Override or add rules here
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      'fsecond/no-inline-interfaces': 'off',
      'fsecond/prefer-destructured-optionals': 'off',
      'func-style': 'off',
      'import/no-named-as-default': 'off',
      'no-void': 'off',
      'tsdoc/syntax': 'off',
      'unicorn/prefer-string-replace-all': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      '@eslint-react/no-leaked-conditional-rendering': 'warn',
      'react/function-component-definition': 'off',
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'off',
      'react/no-multi-comp': 'off',
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.test.jsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.spec.jsx',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  ...eslintPluginJsonc.configs['flat/recommended-with-json'],
  {
    files: ['*.json', '*.json5'],
    languageOptions: {
      parser: jsoncParser,
    },
  },
]
