#!/usr/bin/env node
/**
 * 生产依赖 license 白名单巡检。
 *
 * 用 `pnpm licenses list --prod --json` 拉取所有传递依赖的 license，按白名单核对。
 * 出现白名单外的 license 直接 exit 1，CI 阻断合并。
 *
 * 维护说明：
 * - 默认白名单覆盖前端生态最常见的宽松 license
 * - 新增 copyleft 或受限 license 需要先评审，再加入 ALLOWED 或申请豁免
 *
 * 用法：
 *   node scripts/check-licenses.mjs
 */
import { spawnSync } from 'node:child_process';

/** 允许的 SPDX 标识符 / 表达式（精确匹配）。 */
const ALLOWED = new Set([
  'MIT',
  'ISC',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  '0BSD',
  'CC0-1.0',
  'CC-BY-4.0',
  'MPL-2.0',
  '(MIT OR CC0-1.0)',
  'Python-2.0',
  // LGPL-3.0-or-later: 仅 jsdom 等开发依赖；prod 树出现需要单独评审
]);

/**
 * 以包名前缀豁免的少数 case（必须写明原因，并附评审记录）。
 *
 * 匹配规则：包名 === 名 或 包名以 (名 + '/') 开头。前缀法可以一次覆盖一组同源平台二进制。
 */
const PACKAGE_EXEMPT = new Map([
  [
    '@img/sharp-libvips',
    'LGPL-3.0-or-later — sharp 通过动态链接调用 libvips 原生二进制，' +
      'Next.js 图片优化的传递依赖。LGPL 允许动态链接的闭源调用方，无传染问题。',
  ],
]);

function isExempt(name) {
  for (const key of PACKAGE_EXEMPT.keys()) {
    if (name === key || name.startsWith(`${key}-`) || name.startsWith(`${key}/`)) {
      return true;
    }
  }
  return false;
}

const result = spawnSync('pnpm', ['licenses', 'list', '--prod', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

if (result.status !== 0) {
  console.error('pnpm licenses list 执行失败:\n' + result.stderr);
  process.exit(2);
}

let parsed;
try {
  parsed = JSON.parse(result.stdout);
} catch (e) {
  console.error('解析 pnpm licenses 输出失败:', e);
  process.exit(2);
}

const violations = [];
for (const [license, packages] of Object.entries(parsed)) {
  if (ALLOWED.has(license)) continue;
  for (const pkg of packages) {
    if (isExempt(pkg.name)) continue;
    violations.push({ name: pkg.name, versions: pkg.versions, license });
  }
}

if (violations.length === 0) {
  const total = Object.values(parsed).reduce((sum, list) => sum + list.length, 0);
  console.log(`✅ ${total} 个生产依赖 license 全部在白名单内`);
  process.exit(0);
}

console.error('❌ 发现 license 白名单外的依赖：\n');
for (const v of violations) {
  console.error(`  - ${v.name}@${v.versions.join(',')}: ${v.license}`);
}
console.error(
  '\n如确认安全，可在 scripts/check-licenses.mjs 的 ALLOWED 或 PACKAGE_EXEMPT 中加入对应条目并写明评审原因。',
);
process.exit(1);
