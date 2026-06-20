# Character Forge

A D&D 5.5 character builder, initiative tracker, and (eventually) full character
manager. React + TypeScript + Vite + Tailwind v4.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command            | What it does                                                |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Start the dev server with hot reload                         |
| `npm run build`     | Type-check (`tsc -b`) then produce a production build        |
| `npm run lint`      | Run ESLint over the project                                  |
| `npm run test`      | Run the full test suite once (used in CI / pre-commit)       |
| `npm run test:watch`| Run tests in watch mode (re-runs on save — use this while developing) |
| `npm run test:ui`   | Open Vitest's interactive browser UI for debugging tests     |

Before pushing or opening a PR, `lint`, `test`, and `build` should all pass
clean. `npm run build` runs `tsc -b` in project mode, which is the
authoritative type check — it has caught real type errors (e.g. DOM API
overload narrowing in test files) that a quick `tsc --noEmit` against a
single tsconfig missed, so don't treat `--noEmit` alone as sufficient before
a commit.

## Project structure

```
src/
  types/       Domain types: Character (state, incl. CharacterDetails
               free-text fields) vs. content.ts (rules data shapes,
               UserContent for homebrew)
  data/        Built-in D&D content: classes, species, backgrounds, equipment
  content/     Content registry: merges built-in data/ with user homebrew
               (UserContent) into a single lookup surface for components
  engine/      Pure functions, no React/DOM: dice rolling (chargen-specific
               and general-purpose notation like "2d6+3"), ability score
               derivation, initiative comparison
  state/       Persistence: localStorage load/save for both character/roster
               state and homebrew content, each with its own versioned
               schema and migration path
  components/
    ui/          Shared primitives: Card, Button, SelectInput, AbilityBadge
    builder/     The 5-step character builder (Identity -> Background ->
                 Abilities -> Equipment -> Summary). Step 5 also hosts the
                 free-text character detail fields.
    initiative/  Initiative tracker + tie-breaker modal
    roster/      Saved-character list, import/export
    dice/        Standalone dice roller tab: quick dice, custom notation,
                 d20 advantage/disadvantage, roll history
    homebrew/    Homebrew content management (custom equipment for now)
  test/        Shared test setup and fixture factories (not test files
               themselves -- those live in __tests__/ next to the code
               they cover)
```

## Testing

**Stack:** [Vitest](https://vitest.dev) (test runner, shares the Vite config)
+ [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
(component rendering/interaction) + jsdom (DOM environment).

**Layout:** tests live in a `__tests__/` folder next to the code they cover
(e.g. `engine/derive.ts` -> `engine/__tests__/derive.test.ts`), not in a
separate top-level `tests/` tree. Keeping a test next to its source makes it
obvious when a file has no coverage yet, and survives folder reorganization
better than a parallel tree that has to be kept in sync by hand.

### What to test, and how

**Pure logic (`engine/`, `state/`, `data/`)** -- plain Vitest, no rendering.
This is the highest-value, cheapest layer: deterministic in, deterministic
out, and it's where a silent regression (a wrong ability modifier, a broken
tiebreak rule) is most dangerous because nothing *looks* wrong on screen.
Cover every branch, not just the happy path -- `getMod`'s boundary scores,
`compareCombatants`'s full tiebreak chain, `migrate()`'s pre-versioning
upgrade path. Randomness (dice rolls) is made deterministic for tests by
mocking `Math.random` with `vi.spyOn`; see `engine/__tests__/dice.test.ts`
for the pattern.

**Components** -- React Testing Library, query and interact the way a user
would: find elements by visible label/role/text (`getByLabelText`,
`getByRole`), drive them with `@testing-library/user-event`, assert on what's
rendered. Avoid reaching into component internals (state, instance methods,
snapshot diffs of markup) -- those tests break on refactors that don't change
behavior, and pass through bugs that do. If a query can't find an element by
label or role, that's usually a real accessibility gap in the component
(missing `htmlFor`/`id`, missing ARIA), not a reason to fall back to an
implementation-detail query -- fix the markup.

Builder step components (`Step1Identity`, `Step2Background`, etc.) are
"controlled": they take `character` + `updateCharacter` as props and own no
state themselves. Tests render them inside a small stateful harness that
mirrors what `App.tsx` does (see `renderStep2` in
`components/builder/__tests__/Step2Background.test.tsx`), so the test
exercises the real prop -> update -> re-render data flow rather than mocking
`updateCharacter` and asserting on call arguments.

**Fixtures:** `src/test/factories.ts` has `makeCharacter()` / `makeCombatant()`
-- minimal valid objects with any field overridable. Use these instead of
hand-writing object literals in every test; when `Character` gains new
fields later (skills, spells, etc.), only the factory needs updating.

### What's intentionally not covered yet

- **End-to-end / full-flow tests** (driving the actual multi-step builder
  through the browser, localStorage persistence across a reload) -- not set
  up yet. Worth adding with [Playwright](https://playwright.dev) once the
  app has enough surface area that integration gaps (not just per-unit
  correctness) become a real risk.
- Most components only have engine-level coverage via the functions they
  call, not their own dedicated component test. `Step2Background` is the
  worked example to copy from when adding tests for the others.
