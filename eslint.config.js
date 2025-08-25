import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
    {
        ignores: ['node_modules/**/*', 'artifacts/**/*', '.env', '.gitignore'],
    },

    js.configs.recommended,

    {
        files: ['source/**/*.ts'],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
            }
        },

        plugins: {
            '@typescript-eslint': tsPlugin,
            import: importPlugin,
            'unused-imports': unusedImports,
        },

        rules: {
            indent: ['error', 4, {SwitchCase: 1}],
            quotes: ['error', 'single', {avoidEscape: true}],
            semi: ['error', 'always'],
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'never'],
            'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 1}],
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'never'],
            

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                    destructuredArrayIgnorePattern: '^_',
                }
            ],

            'unused-imports/no-unused-imports': 'error',
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                        'type',
                    ],
                    'newlines-between': 'never',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                }
            ],

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
            '@typescript-eslint/explicit-function-return-type': 'off',

            '@typescript-eslint/explicit-member-accessibility': [
                'error',
                {
                    accessibility: 'explicit',
                    overrides: {
                        constructors: 'no-public'
                    }
                }
            ],
        }
    },
];