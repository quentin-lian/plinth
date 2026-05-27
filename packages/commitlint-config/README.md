# `@plinth/commitlint-config`

Monorepo 共享的 commitlint 配置。基于 [Conventional Commits](https://www.conventionalcommits.org/)，与 changesets 联动。

## type 列表

| type     | 含义                                 |
| -------- | ------------------------------------ |
| feat     | 新增功能                             |
| fix      | Bug 修复                             |
| docs     | 仅文档变更                           |
| style    | 不影响逻辑的格式调整（空格、分号等） |
| refactor | 既不是新功能也不是修 bug 的代码改动  |
| perf     | 性能优化                             |
| test     | 增加/修改测试                        |
| build    | 构建系统或外部依赖变更               |
| ci       | CI 配置变更                          |
| chore    | 其他不修改 src 或 test 的杂项        |
| revert   | 回滚某次提交                         |

## 使用

`commitlint.config.mjs`：

```js
export default { extends: ['@plinth/commitlint-config'] };
```

挂上 husky `commit-msg` 钩子：

```bash
echo 'pnpm exec commitlint --edit "$1"' > .husky/commit-msg
chmod +x .husky/commit-msg
```

## 安装

```bash
pnpm add -D @commitlint/cli @plinth/commitlint-config husky
```

## 规则要点

- `type-enum`：上表 11 个 type，其它一律 reject
- `subject-case`：关闭（中文 commit 不参与英文大小写检查）
- `header-max-length`：100
