import globals from 'globals';

import base from './base.js';

/**
 * Node.js 服务/工具配置：仅 node globals、允许 console
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...base,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'off',
    },
  },
];
