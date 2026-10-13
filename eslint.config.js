import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
            tailwind.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        settings: {
            // Tailwind v4 is configured in CSS: point at the entry stylesheet.
            tailwindcss: {
                cssConfigPath: './src/index.css',
            },
        },
        rules: {
            'tailwindcss/no-custom-classname': 'warn',
            // Class order is handled by prettier-plugin-tailwindcss.
            'tailwindcss/classnames-order': 'off',
        },
    },
    prettier,
]);
