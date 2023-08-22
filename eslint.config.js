const { defineFlatConfig } = require('eslint-define-config')
const { baseConfig, reactConfig } = require('@karasushin/eslint-config')

module.exports = defineFlatConfig([
  ...baseConfig,
  ...reactConfig,
  {
    rules: {
      'import/default': 'off',
    },
  },
])
