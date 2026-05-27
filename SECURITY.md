# 安全策略

## 报告安全漏洞

如果你在 `bitfe-infra` 仓库或任何 `@bitfe/*` 包中发现安全漏洞，**请不要在公开 issue 里披露**。

请通过以下任一方式私下报告：

- **首选**：在 GitHub 仓库使用 [Private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability)
- **备选**：发邮件到 `security@bitfe.example.com`（待确认真实邮箱后替换）

请在报告中包含：

- 受影响的包名与版本
- 漏洞类型（如 RCE、原型链污染、依赖中的已知 CVE 等）
- 复现步骤或 PoC
- 你建议的修复方向（可选）

## 我们的承诺

- **48 小时内**确认收到报告
- **7 天内**给出初步评估（是否成立、影响范围）
- **30 天内**发布修复版本（高危漏洞会更快）

## 披露流程

1. 私下沟通，确认漏洞和修复方案
2. 发布带修复的新版本到 GitHub Packages
3. 通知所有已知的内部消费方升级
4. **修复版本上线 14 天后**，发布 GitHub Security Advisory，公开漏洞详情和升级路径

## 支持的版本

只有最新 **major.minor** 版本会持续接收安全修复。老版本请尽快升级。

| 包         | 当前支持版本 |
| ---------- | ------------ |
| `@bitfe/*` | 最新 minor   |

## 适用范围

本策略仅适用于 `bitfe-infra` 仓库本身和它发布的 `@bitfe/*` 包。

第三方依赖（ESLint、Prettier、TypeScript、Vite、Next.js 等）的漏洞请直接向其上游报告，我们会通过 Renovate 跟进升级。

## 致谢

我们会在 Security Advisory 中署名感谢漏洞报告者，除非你要求匿名。
