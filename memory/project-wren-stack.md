---
name: project-wren-stack
description: Wren app stack decisions, deviations from spec, and key package versions
metadata:
  type: project
---

Wren is a childhood memory organizer (Expo managed workflow, TypeScript strict, expo-router, no backend).

**Stack as built (deviates from spec §4 notes):**
- Expo SDK 56 (spec says 51+, 56 is the current stable — accepted upgrade)
- react-native-reanimated 4.3.1 (spec says v3 — v4 is current, @gorhom/bottom-sheet v5 required)
- @gorhom/bottom-sheet 5.1.5 (spec says v4, but v5 is required for reanimated v4)
- react 19.2.3 / react-native 0.85.3 (requires Node 20+)
- drizzle-orm 0.41.0 + expo-sqlite 56.0.5
- uuid 11.1.0 (ESM package, requires `uuid` in jest transformIgnorePatterns)
- Node version pinned to 20.19.4 in `.nvmrc`
- `.npmrc` has `legacy-peer-deps=true` to resolve react-test-renderer peer conflict

**Why:** SDK 56 was what create-expo-app v4 scaffolded; spec says 51+ so this is valid. Reanimated v4 is the current release and incompatible with bottom-sheet v4.

**How to apply:** When adding new packages, check Expo SDK 56 compatibility. When setting up on a new machine, `nvm use` picks Node 20.19.4. Always `npm install --legacy-peer-deps`.
