# Game Library ("Playground")

DB-driven game portal. The catalogue lives in Postgres and is managed from
`/admin/games`; this folder holds the playable components and the shell they
run inside.

```
components/games/
  registry.ts          componentKey → lazy component + metadata
  shared/
    GameShell.tsx      start / playing / paused / ended state machine
    useGameLoop.ts     rAF loop, auto-pauses + resets its clock on tab blur
    useKeyboard.ts     held-keys Set (in a ref, not state)
    ScorePanel.tsx     end-of-run score + replay
  SnakeGame.tsx  MemoryCardGame.tsx  TicTacToeGame.tsx
  MathBlitzGame.tsx  ProjectileGame.tsx
  admin/GameForm.tsx   shared create/edit form
```

## The GameProps contract

Every registered game receives exactly this:

```ts
interface GameProps {
  onScore: (score: number, durationSec?: number) => void; // call ONCE per run
  onExit?: () => void;
  locale: 'vi' | 'en';
}
```

Responsibilities are split on purpose — respect the split and games stay tiny:

| Layer | Owns |
|---|---|
| **Game** | Playing. Calls `onScore` once when the run ends. Knows nothing about the network, the DB or leaderboards. |
| **GameShell** | Start screen, Escape/tab-blur pause, end screen, fullscreen, and remounting the game on replay (via `runKey` — so your game needs no reset logic). |
| **Page** (`/games/[slug]`) | Counting plays, submitting scores, rendering the leaderboard. |

Props are declared `Partial<GameProps>` in the existing games so they also run
standalone; when `onScore` is present the game is "in shell mode" and must
suppress any start/end chrome of its own.

## Adding a new game

1. **Build the component** in this folder, honouring `GameProps`:
   - report the score exactly once (guard with a `reportedRef`);
   - be responsive, `devicePixelRatio`-aware if you use canvas;
   - support touch **and** keyboard/mouse;
   - clean up every listener/rAF on unmount — no global state leaks;
   - draw your own art (canvas shapes / inline SVG). No sprites, no
     third-party characters or names.
2. **Register it** in `registry.ts`:
   ```ts
   'my-game': {
     name: 'My Game',
     load: () => loader(() => import('./MyGame')),
     scoreCap: 5_000,   // mirror of the server cap, display only
     scored: true,      // false if the game has no score ladder
   },
   ```
3. **Add the server-side score cap** in
   `src/services/games/game.service.ts` → `SCORE_CAPS['my-game']`.
   **This is the enforcement point** — `registry.ts` only mirrors it for
   display. A client can send any number; the server clamps it.
4. **Create the game** in `/admin/games` and set its `componentKey` to
   `my-game`. The form's componentKey field reads this registry, so it will be
   offered automatically. Publish when ready (or leave it `COMING_SOON`).

## Score submission flow

```
Game.onScore(score, dur)
  → GameShell  (shows the end screen, stores session best)
  → GamePlayClient.onEnd
  → POST /api/v1/games/:id/score      rate-limited 40/min, zod-validated
  → game.service.submitScore()        CLAMPS score to SCORE_CAPS[componentKey]
  → GamePlay row                      → leaderboard refetches
```

Anonymous plays are allowed (`GamePlay.userId` is nullable → rendered as
"Anonymous"). Deleting a user sets their plays' `userId` to NULL rather than
deleting the rows, so leaderboards don't silently rewrite themselves.

`playCount` is separate from scores: `POST /api/v1/games/:id/play` fires once
per session per game (guarded client-side with `sessionStorage`).

## Non-React games

Set the game's `kind` to `IFRAME` and its `iframeSrc` to a path under
`/public` (e.g. `/games/love-me-game/love-me.html`). It renders in a sandboxed
iframe and does not participate in scoring — there's no `onScore` channel.
