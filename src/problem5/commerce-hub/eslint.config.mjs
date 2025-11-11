import nx from '@nx/eslint-plugin'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import jsoncParser from 'jsonc-eslint-parser'
import { sheriff } from 'eslint-config-sheriff'

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  ...sheriff({}),
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
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
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: 'next' },
      ],
      '@typescript-eslint/restrict-template-expressions': 'warn',
      'fsecond/prefer-destructured-optionals': 'off',
      'no-param-reassign': 'off',
      'no-restricted-syntax/noClasses': 'off',
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
