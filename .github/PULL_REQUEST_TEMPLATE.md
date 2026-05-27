# Pull Request

## 变更类型

<!-- 勾选适用项 -->

- [ ] feat: 新功能
- [ ] fix: bug 修复
- [ ] refactor: 重构（不改变行为）
- [ ] perf: 性能优化
- [ ] test: 测试
- [ ] docs: 文档
- [ ] chore: 工程化 / 依赖
- [ ] ci: CI 流程
- [ ] BREAKING CHANGE: 不向后兼容的变更

## 变更说明

<!-- 简述本 PR 做了什么、为什么这样做。一句话即可，详细背景写在下面 -->

## 背景与动机

<!-- 解决什么问题？关联 issue：Fixes #123 / Closes #123 -->

## 对消费方的影响

<!-- 如果改的是 packages/* 中可发布的包，请说明：
     - 哪些 @plinth/* 受影响
     - 是否需要消费方迁移
     - 是否已添加 changeset（运行 `pnpm changeset`）
-->

- [ ] 已添加 changeset（修改 `packages/*` 必备）
- [ ] 不涉及可发布包，无需 changeset

## 验证清单

- [ ] `pnpm format:check` 通过
- [ ] `pnpm lint` 通过
- [ ] `pnpm check-types` 通过
- [ ] `pnpm test` 通过
- [ ] `pnpm build` 通过（如有构建产物）
- [ ] 本地手动验证（必要时）

## 截图 / 录屏

<!-- UI 改动请附图。命令行/CI 改动可贴关键日志 -->

## 备注

<!-- 评审者需要重点关注的点、已知遗留问题、follow-up 计划 -->
