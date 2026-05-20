import nextPlugin from '@next/eslint-plugin-next';

import react from './react.js';

/**
 * Next.js 项目配置：react + Next + core-web-vitals
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...react,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'next-env.d.ts'],
  },
];
