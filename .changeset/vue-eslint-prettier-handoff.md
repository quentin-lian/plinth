---
'@bitfe/eslint-config': minor
---

Vue preset 接入 `eslint-config-prettier` 并明确关闭与 Prettier 冲突的 Vue 模板格式规则（`vue/max-attributes-per-line`、`vue/singleline-html-element-content-newline`、`vue/multiline-html-element-content-newline`、`vue/html-self-closing`、`vue/html-indent`、`vue/html-closing-bracket-newline`、`vue/html-closing-bracket-spacing`、`vue/first-attribute-linebreak`）。Prettier 成为格式化的唯一事实来源，避免与 vue-eslint 之间的死循环。
