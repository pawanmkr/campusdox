module.exports = {
    extends: ['@adonisjs/eslint-config/app'],
    rules: {
        'unicorn/no-await-expression-member': 0,
        'indent': ['error', 4],
        'semi': ['error', 'always'],
        'prettier/prettier': ['error', { semi: true }],
    },
};
