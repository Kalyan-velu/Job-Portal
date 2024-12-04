module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './client/tsconfig.json', './server/tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    extraFileExtensions: ['.json']
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier'
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // TypeScript-specific rules
      }
    },
    {
      files: ['*.js', '*.jsx'],
      rules: {
        // JavaScript-specific rules
      }
    },
    {
      files: ['*.json'],
      rules: {
        // JSON-specific rules
      }
    }
  ]
}