<!-- Modified for cross-platform Windows support in 2026; see MODIFICATIONS.md. -->

# AGENTS.md — running & modifying Blockout with an AI agent

This file is the single source of truth for AI coding agents (Claude Code, Codex, Hermes, OpenClaw, …) working on this repo. `CLAUDE.md` points here.

## What this app is

Electron + TypeScript + React + Three.js desktop previs tool. Filmmakers stage grey-box scenes, choreograph camera/actor **marks** on a timeline, and export deterministic motion-reference packages (MP4 + depth pass + stills + prompt) for AI video generators. Full product spec: `docs/DESIGN.md`.

## Commands

```bash
npm install            # once; Node 22+; ffmpeg needed for exports (brew install ffmpeg)
npm run dev            # run the app with hot reload
npm run build          # production build into out/
npm start              # run the production build
npm run typecheck      # strict TS, two projects (renderer+engine, main+e2e)
npm run lint           # ESLint (zero warnings allowed on main)
npm test               # Vitest engine unit tests (fast, no GPU)
npm run smoke          # build + Playwright end-to-end: real export, ffprobe-verified
npm run package:mac    # download+audit pinned FFmpeg pair, then current-architecture macOS DMG
                       # (add: npm run prepare:ffmpeg:mac -- --build-from-source to rebuild from source)
npm run package:win    # Windows x64 NSIS installer (run after npm ci on Windows)
```

**Definition of done for any change: `npm run typecheck && npm run lint && npm test` green, and `npm run smoke` green if you touched engine/, export/, main/, or SceneManager.**

## Repo map

```
src/engine/     PURE TypeScript. No DOM, no three.js, no Electron imports — ever.
                The deterministic core: state(t) evaluator, camera math, paths,
                easing, rig noise, gaits, schema, prompts, generator profiles.
                All logic changes here need unit tests in tests/unit/.
src/main/       Electron main process: window, IPC, ffmpeg spawning, file I/O.
src/preload/    Typed IPC bridge (window.blockout). Keep in sync with main.
src/renderer/   React UI. store.ts (zustand; ALL doc mutations go through
                store.mutate for undo), panels/, viewport/ (SceneManager owns
                three.js), export/ (frame loop → ffmpeg, glTF, ComfyUI).
tests/unit/     Vitest (engine only). tests/e2e/ Playwright (smoke + screenshots).
assets/         (profiles as code in engine/profiles.ts; 3D assets are procedural)
```

## Hard rules

1. **Engine purity**: `src/engine/` must never import DOM/three/Electron. It runs in Vitest under Node.
2. **Determinism**: nothing on the `state(t)` path may use `Math.random()` (unseeded), `Date.now()`, or accumulate state frame-to-frame. Rig shake uses the seed stored on the shot. The smoke suite has a byte-determinism test that will catch violations.
3. **All document mutations go through `store.mutate(label, fn)`** or an existing store action — never assign into `store.doc` directly (breaks undo and dirty tracking).
4. **Conventions**: meters, seconds, radians. Heading 0 faces −Z and `object.rotation.y = heading` (see `headingOf` in `src/engine/path.ts`). Models are built facing −Z with origin at ground.
5. Exports must contain zero editor chrome (grid, gizmos, selection boxes, marks). `SceneManager.renderFrameAt` handles this — preserve that behavior.

## Automation surface (driving the running app)

The renderer exposes `window.__blockout` (not a public API — for tests/agents):

- `__blockout.store` — the zustand store. `getState()` gives you every action: `addEntity(assetId, pos)`, `dropActorMark(entityId, pos)`, `dropCameraMark(pos, pan, tilt, focal)`, `setTime(t)`, `setMode(...)`, `mutate(label, fn)`, `scene()`, `shot()`; round-3 additions: `marryEntities(childIds, parentId)` / `unmarryEntities(ids)`, `switchCamera(name)` / `addCameraToShot()` / `clearCameraMarks()`, `saveDraftOfShot()` / `promoteDraft(id)` / `deleteDraft(id)`, `toggleEntitySelected(id)` / `toggleMarkSelected(entityId, markId)`, `setRecording(bool)` (records the selected performer, or the camera — playback-synced when other motion exists).
- `__blockout.exportShot({profileId, passes, labels})` — run a real export; resolves `{ok, packagePath}`.
- `__blockout.renderStillPngForTest(t, w, h)` / `renderRawForTest(t, w, h)` — deterministic frame renders.
- `window.__blockout_scene` — the live SceneManager (transform gizmo, freeCam, shotCam) for interaction tests; see `tests/e2e/interaction.spec.ts` for real-mouse gizmo-drag and camera-recording patterns.

Headless/dialog-free driving: launch with env `BLOCKOUT_SMOKE_DIR=/some/dir` — the New/Open Project dialogs are bypassed and use `$BLOCKOUT_SMOKE_DIR/Smoke.blockout`. See `tests/e2e/smoke.spec.ts` for a complete scripted session (Playwright `_electron`).

## Common tasks

- **Add a generator profile**: edit `BUILTIN_PROFILES` in `src/engine/profiles.ts` (see `docs/generator-profiles.md`). Add a prompt test in `tests/unit/schema.test.ts`.
- **Add a library asset**: add a catalog entry in `src/engine/assets.ts` (id, height, speedScale, motion), a builder case in `src/renderer/viewport/builders.ts` (grey-box, deterministic, forward −Z), and an emoji thumb in `src/renderer/panels/Library.tsx`.
- **Add an export pass**: extend `RenderPass` in `SceneManager.renderFrameAt`, wire a toggle in `DeliverPanel.tsx` and the pass loop in `export/exporter.ts`.
- **Change the document schema**: bump nothing lightly — update types in `engine/types.ts`, factories/validation in `engine/schema.ts`, and the round-trip test. Never break `parseProject` on existing files; migrate instead.

## Agent control (MCP)

Blockout ships an MCP server so you can drive a **running** app from Claude Code, Codex, Hermes, or any MCP client — stage entities, drop marks, reframe, scrub, and grab a viewport screenshot without touching the UI.

**How it works.** On launch the main process starts a localhost-only HTTP control server (`src/main/control.ts`) on a random port with a bearer token, and writes a protocol-v1 discovery descriptor (`{ protocolVersion, app, appVersion, port, token, pid, startedAt, capabilities }`) under `~/.config/blockout` on macOS/Linux or `%APPDATA%\blockout` on Windows (mode 0600 where supported, deleted on quit). The MCP bridge `mcp/blockout-mcp.mjs` (zero-dependency Node ≥18 stdio server) reads both v1 and legacy descriptors and forwards each tool call to the control server, which relays it to the renderer over the `control:invoke` / `control:result` IPC pair. Discovery and auth are automatic — nothing to configure, and if the app isn't running the tools return "Blockout isn't running — launch the app first."

**Register with Claude Code** (one line — use this repo's absolute path):

```bash
claude mcp add blockout -- node /ABSOLUTE/PATH/TO/blockout/mcp/blockout-mcp.mjs
```

**Generic stdio config** (Codex, Hermes, or any MCP client that takes a JSON server list):

```json
{
  "mcpServers": {
    "blockout": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/blockout/mcp/blockout-mcp.mjs"]
    }
  }
}
```

**Tools** (each maps to a control action of the same name; coordinates in meters, +X right, −Z forward/away, heading 0 faces −Z, `rotationDeg` clockwise from above):

| Tool | Params | Does |
|---|---|---|
| `get_state` | — | Project/scene/shot summary incl. entity + mark listings (call first) |
| `list_assets` | `category?` | The placeable asset catalog |
| `add_entity` | `assetId, x, z, label?, rotationDeg?` | Place something |
| `move_entity` | `entityId, x, z, y?, rotationDeg?` | Reposition an entity |
| `delete_entity` | `entityId` | Remove an entity |
| `add_actor_mark` | `entityId, x, z, time, gait?` | Drop an actor timeline mark |
| `add_camera_mark` | `x, y, z, panDeg, tiltDeg, time, focalLength?` | Drop a camera mark |
| `clear_camera_marks` | — | Clear the active shot's camera marks |
| `set_shot` | `name?, duration?, aspect?, fps?` | Update shot settings |
| `new_shot` | `name?` | New shot, same blocking |
| `apply_framing` | `kind: 2S\|OTS\|REV\|TOP\|LOW\|DUTCH` | Auto-frame the camera |
| `snap_to_ground` | `entityId` | Rest an entity on the ground |
| `set_time` / `play` / `stop` | `t` / — / — | Scrub, play, stop |
| `screenshot` | — | Current viewport as a PNG (image result) |
| `list_presets` / `save_preset` / `apply_preset` | — / `name` / `id` | Global stage presets |
| `set_reference` | `videoPath, handoffVersion?, mode?, opacity?` | Attach a reference clip (copied into `refs/`) as a ghost/PIP underlay. Motion sends handoff v1; missing stays legacy-compatible. |

**Example (Claude Code):**

1. Launch the app (`npm run dev`) so the control server comes up.
2. `get_state` — see the current scene, entities, and marks.
3. `add_entity` with `{ "assetId": "person.man", "x": 0, "z": -3, "label": "HERO" }`.
4. `screenshot` — confirm the placement in the viewport.

## Internationalization (i18n)

- **Locales:** `en` and `zh-CN` (default). UI strings live in `src/shared/i18n/locales/`; engine display names are built from engine catalogs plus `zh-engine-overrides.ts` (engine source stays English).
- **Persistence:** `~/.config/blockout/preferences.json` (Windows: `%APPDATA%\blockout\preferences.json`) stores `locale`. Title-bar **中文 | EN** toggles it.
- **Override:** `BLOCKOUT_LOCALE=en|zh-CN` env wins over preferences (use `BLOCKOUT_LOCALE=en` in Playwright e2e so selectors match English copy).
- **Verification:** `npm run verify:i18n` checks en/zh key symmetry, engine label coverage, and code-referenced keys. It runs before `vitest` via `npm test`.
- **Export prompts:** AI export prompts stay English regardless of UI locale.

## Gotchas

- `ffmpeg` resolution order: `BLOCKOUT_FFMPEG` env → packaged BtbN executable on Windows → platform candidates → `ffmpeg`/`ffmpeg.exe` on PATH. The rejected nonfree static package is not a dependency.
- Frames are piped to ffmpeg as **raw RGBA** (`-f rawvideo`, vflipped because WebGL reads bottom-up). Width/height must stay even (h264 yuv420p).
- `renderFrameAt` intentionally renders twice (GL warm-up determinism) — don't "optimize" that away; the smoke test will fail.
- The live viewport loop suspends during exports (`SceneManager.suspendLive`).
- Playwright e2e runs against the **built** app (`out/`) — run `npm run build` first (the `smoke` script does).
