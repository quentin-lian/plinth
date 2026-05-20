import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

import base from './base.js';

/**
 * Vue 3 项目配置：base + Vue flat/recommended + type-aware 规则
 *
 * 注意：开启了 type-aware 检查（parserOptions.project: true），
 * 会自动寻找最近的 tsconfig.json。lint 速度会显著慢于普通配置，
 * 但能启用 no-floating-promises、no-misused-promises 等强力规则。
 *
 * 消费方需保证 tsconfig.json 的 include 覆盖了所有要 lint 的 .ts / .vue 文件。
 *
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  ...base,
  ...tseslint.configs.recommendedTypeChecked,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    // 配置/脚本类 JS 文件不参与 type-aware 检查，避免 tsconfig 没覆盖时报错
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
  },
];
