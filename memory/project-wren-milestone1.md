---
name: project-wren-milestone1
description: Milestone 1 completion status and key implementation decisions
metadata:
  type: project
---

Milestone 1 (Project foundation & data layer) is complete as of 2026-06-17.

**DoD status (all confirmed):**
- tsc --noEmit: clean
- eslint --max-warnings 0: clean
- 12/12 unit tests passing
- Pre-commit hook blocks bad TypeScript (confirmed by smoke test)
- Seed count exactly 66 tags (46 milestones + 9 people + 11 places) verified by test
- Device ID: uuid v4, persisted in expo-secure-store + meta table
- Migration runner: idempotent, schema_version tracked in meta table
- App screen shows "Wren" in Fredoka SemiBold (placeholder — needs device confirm)

**Key implementation files:**
- `src/theme/tokens.ts` — full light + dark token sets from spec §3
- `src/theme/useTheme.ts` — useColorScheme() → Theme (uses Colors type with string values to avoid literal-type mismatch)
- `src/db/migrations.ts` — custom migration runner (not drizzle-kit push)
- `src/db/seed.ts` — seeds 66 preset tags in one transaction; exports EXPECTED_SEED_COUNT
- `src/db/index.ts` — openDatabaseSync + drizzle + WAL mode + foreign keys ON
- `src/utils/deviceId.ts` — expo-secure-store + meta table sync
- `src/app/_layout.tsx` — root layout: font load + DB init + splash screen gate

**One thing still needed:** Run `npx expo start` on a real Android device to confirm Milestone 1 DoD item 1 (app launches on device). Cannot be verified without a device.

**Why:** All checks that can be run without a device pass. Device test is on the user.

**How to apply:** Do NOT begin Milestone 2 until user confirms the app runs on device.
