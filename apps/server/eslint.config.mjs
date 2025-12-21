import path from 'path'
import { fileURLToPath } from 'url'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        // extraFileExtensions: ['.json'] // Add this line
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  // {
  //   files: ['**/*.json'], // Add this block to handle JSON files
  //   languageOptions: {
  //     parserOptions: {
  //       extraFileExtensions: ['.json']
  //     }
  //   }
  // },
  {
    ...prettier,
  },
]
