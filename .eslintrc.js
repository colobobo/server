module.exports =  {
	parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
	parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    semi: [2, "always"],
    '@typescript-eslint/no-var-requires': 0,
  },
};
