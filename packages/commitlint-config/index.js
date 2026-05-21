/**
 * 公司统一的 commit message 规范，基于 conventional commits。
 *
 * type 列表：
 *   feat     新增功能
 *   fix      Bug 修复
 *   docs     仅文档变更
 *   style    不影响逻辑的格式调整（空格、分号等）
 *   refactor 既不是新功能也不是修 bug 的代码改动
 *   perf     性能优化
 *   test     增加/修改测试
 *   build    构建系统或外部依赖变更（pnpm、turbo、tsup 等）
 *   ci       CI 配置变更（GitHub Actions、changesets workflow 等）
 *   chore    其他不修改 src 或 test 的杂项
 *   revert   回滚某次提交
 *
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'subject-case': [0],
    'header-max-length': [2, 'always', 100],
  },
};
