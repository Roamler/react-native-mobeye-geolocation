module.exports = {
    root: true,
    env: {
      node: true
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'react',
        'react-native',
        'react-hooks'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier',
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        // note you must disable the base rule as it can report incorrect errors
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['off'],

        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
    },
};
