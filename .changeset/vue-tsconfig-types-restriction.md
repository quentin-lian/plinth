---
'@bitfe/typescript-config': patch
---

Remove the `types: ["vite/client"]` restriction from `vue.json` so consuming Vue projects automatically pick up `@types/node`, `@testing-library/jest-dom`, Vitest globals, and any other ambient type packages. Projects that previously relied on the implicit Vite client typing should add a project-level `vitest-env.d.ts` (or equivalent) with `/// <reference types="vite/client" />`.
