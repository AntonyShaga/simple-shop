import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),

    {
        files: ['**/*.{ts,tsx}'],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
        },

        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },

        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            prettier,
        ],

        rules: {
            'no-console': ['error', {allow: ['warn', 'error']}],
            'no-debugger': 'error',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {argsIgnorePattern: '^_'},
            ],
            '@typescript-eslint/consistent-type-imports': 'error',
        },
    },
]);
