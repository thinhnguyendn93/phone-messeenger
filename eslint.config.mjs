import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'

export default createConfigForNuxt(
  {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'standard-with-typescript',
      'plugin:nadal/all',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      project: ['./tsconfig.json'],
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: {
        ts: '@typescript-eslint/parser',
        '<template>': 'espree',
      },
      extraFileExtensions: ['.vue'],
    },
    plugins: ['vue'],
    rules: {
      'no-console': 2,
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 0,
      '@typescript-eslint/no-explicit-any': 'error',
      'max-len': ['error', { code: 120, ignorePattern: 'd="([\\s\\S]*?)"' }],
      'nadal/explicit-function-return-type-extend': [
        'error',
        {
          allowedNames: [],
          allowedRegexNames: [/use*/],
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      'import/order': [
        2,
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
          pathGroups: [
            {
              pattern: 'common',
              group: 'internal',
            },
            {
              pattern: 'configs/**',
              group: 'internal',
            },
            {
              pattern: 'utils/**',
              group: 'internal',
            },
            {
              pattern: 'resources/**',
              group: 'internal',
            },
            {
              pattern: 'components',
              group: 'internal',
            },
            {
              pattern: 'composables/**',
              group: 'internal',
            },
          ],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any',
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'],
        parserOptions: {
          parser: '@typescript-eslint/parser',
        },
      },
    ],
  },
  [
    eslintConfigPrettier,
    {
      rules: {
        'vue/no-v-html': 'off',
        'vue/attribute-hyphenation': 'error',
        'vue/attributes-order': 'error',
        'vue/no-deprecated-slot-attribute': 'off',
        '@typescript-eslint/no-invalid-void-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
)
