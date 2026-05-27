---
'@bitfe/env': minor
---

新增 `@bitfe/env`：基于 zod 的运行时环境变量校验工具。

- `createEnv({ server, client, clientPrefix, source, isServer })` 校验启动时的 env 配置
- 服务端 schema 中的字段在浏览器侧自动置 undefined，避免误用泄露密钥
- client 字段强制带 prefix（默认 `NEXT_PUBLIC_`，Vite 项目改为 `VITE_`）
- 校验失败抛 `EnvValidationError`，聚合所有字段问题，便于一次性定位

业务项目接入示例参见 [packages/env/README.md](../packages/env/README.md)，CONSUMING.md 也已加上接入指引。
