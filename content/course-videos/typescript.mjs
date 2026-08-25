/**
 * Curated YouTube track for the "TypeScript" course.
 * ─────────────────────────────────────────────────────────────────────────────
 * One entry per non-quiz lesson slug → the third-party lecture shown on the YT
 * pill of the learn page, until the Vietnamese/English recordings are made.
 * The `credit` line names the author under the player.
 *
 * Every id was resolved through YouTube's oEmbed endpoint (live title+channel,
 * 404s on dead/private/non-embeddable). Re-check any time with:
 *   node scripts/verify-youtube-videos.mjs --file ./content/course-videos/typescript.mjs
 * Apply to the DB:
 *   node scripts/course-video-seed.mjs --file ./content/course-videos/typescript.mjs --apply
 * QUIZ lessons are deliberately absent — they have no video frame.
 */
export default {
  courseSlug: 'typescript',
  defaultVideoTrack: 'YT',
  lessons: {
    /* ── Mục 0 ── */
    "typescript-0-1-gioi-thieu": { yt: "zQnBQ4tB3ZA", credit: "Fireship — TypeScript in 100 Seconds" },
    "typescript-0-2-cach-hoc": { yt: "gp5H0Vw39yw", credit: "freeCodeCamp.org — Learn TypeScript - Full Course for Beginners" },
    "typescript-0-3-cai-dat": { yt: "2pZmKW9-I_k", credit: "Net Ninja — TypeScript Tutorial #1 - Introduction & Setup" },
    "typescript-0-4-mo-hinh": { yt: "iTZ1-85I77c", credit: "Net Ninja — TypeScript Tutorial #2 - Compiling TypeScript" },
    /* ── Chương 1 ── */
    "typescript-1-1-ba-con-bug": { yt: "jFUVbiZrwlY", credit: "Kodaps Academy — Why Learn TypeScript (vs JavaScript)?" },
    "typescript-1-2-chung-minh-gi": { yt: "d56mG7DezGs", credit: "Programming with Mosh — TypeScript Tutorial for Beginners" },
    "typescript-1-3-suy-luan-kieu": { yt: "vFpY2JYjpb4", credit: "Free Tutorial Wale — TypeScript Tutorial #4 - Type Inference" },
    "typescript-1-4-any-unknown": { yt: "kWmUNChlzVw", credit: "Andrew Burgess — any vs unknown vs never: TypeScript demystified" },
    /* ── Chương 2 ── */
    "typescript-2-1-primitive": { yt: "0DzDqtcxnz0", credit: "Net Ninja — TypeScript Tutorial #3 - Type Basics" },
    "typescript-2-2-mang-tuple": { yt: "1QgEdeejdDY", credit: "Codevolution — ES6 and Typescript Tutorial - 46 - Arrays and Tuples" },
    "typescript-2-3-kieu-dac-biet": { yt: "YpT0rCWdCaE", credit: "TypeScript with Benny Code — Any, unknown, never, and void in TypeScript" },
    "typescript-2-4-literal-as-const": { yt: "jxSh-RZTCws", credit: "Matt Pocock — Literal types are SO USEFUL in TS - Advanced TypeScript" },
    /* ── Chương 3 ── */
    "typescript-3-1-tham-so": { yt: "jXoSaX_yFh4", credit: "Net Ninja — TypeScript Tutorial #8 - Function Basics" },
    "typescript-3-2-callback": { yt: "m8O-Bo3I8pc", credit: "Smartherd — Functions as Type | TypeScript Tutorial" },
    "typescript-3-3-overload-void": { yt: "322L8At_sBo", credit: "nevsky.programming — Function Overloading in TypeScript  - TypeScript Tutorial" },
    "typescript-3-4-this": { yt: "wueQKy86aSY", credit: "Typed Rocks — The Secret THIS Parameter: TypeScript’s overlooked Superpower Explained!" },
    /* ── Chương 4 ── */
    "typescript-4-1-dang-object": { yt: "9dw2ik9N8wo", credit: "Dave Gray — Typescript Objects, Arrays, Tuples & Enums | Basics Tutorial" },
    "typescript-4-2-interface-vs-type": { yt: "IXAT3If0pGI", credit: "basarat — TypeScript TYPES vs INTERFACES (Key Differences)" },
    "typescript-4-3-extends-intersection": { yt: "ozUaIWSFGX0", credit: "Train To Code — Advanced TypeScript | Union and Intersection Types" },
    "typescript-4-4-index-record": { yt: "2eAqXLi8q70", credit: "Dave Gray — Typescript Index Signatures, keyof Assertions & the Record Utility Type" },
    /* ── Chương 5 ── */
    "typescript-5-1-union-narrowing": { yt: "HUZhBJL0Dv4", credit: "Tech With Piotr — TypeScript Crash Course Part 2 – Union Types & Type Narrowing" },
    "typescript-5-2-literal-union": { yt: "2HJHRqThWRQ", credit: "Eulier Gonzalez — Typescript Essentials : Union and Narrowing Types examples with string, literals and maps" },
    "typescript-5-3-discriminated-union": { yt: "5V-y911AO5c", credit: "Coder Foundry — Level Up Your TypeScript: Discriminated Unions Explained" },
    "typescript-5-4-exhaustiveness": { yt: "safz1yCVYxo", credit: "Hitesh Choudhary — Discriminated Union and Exhaustiveness Checking with never" },
    /* ── Chương 6 ── */
    "typescript-6-1-why-generics": { yt: "IOzkOXSz9gE", credit: "Net Ninja — TypeScript Tutorial #18 - Generics" },
    "typescript-6-2-constraints-keyof": { yt: "kTKYpkLb3u8", credit: "Dmytro Danylov — Indexed Access Types (Lookup Types) in TypeScript (plus keyof and generics)" },
    "typescript-6-3-generic-types-classes": { yt: "EcCTIExsqmI", credit: "Web Dev Simplified — Learn TypeScript Generics In 13 Minutes" },
    "typescript-6-4-generics-in-practice": { yt: "lMfGp29Ht8c", credit: "Matt Pocock — WHEN should I use a Generic? - Advanced TypeScript" },
    /* ── Chương 7 ── */
    "typescript-7-1-mapped-types": { yt: "lYQZPXrbEbg", credit: "Array Blog — Mapped Types in TypeScript  | readonly, Optional Modifiers & Use Cases" },
    "typescript-7-2-mapping-modifiers": { yt: "lYQZPXrbEbg", credit: "Array Blog — Mapped Types in TypeScript  | readonly, Optional Modifiers & Use Cases" },
    "typescript-7-3-conditional-infer": { yt: "hLZXJTm7TEk", credit: "Matt Pocock — Infer is easier than you think" },
    "typescript-7-4-template-literal-types": { yt: "8KIkLPQPt98", credit: "basarat — TypeScript Template Literal Types // So much power ☢️" },
    /* ── Chương 8 ── */
    "typescript-8-1-partial-required-readonly": { yt: "BhNSauna0eo", credit: "Web Dev Simplified — You are a Junior Dev if You Don’t Know These 18 TypeScript Utility Types" },
    "typescript-8-2-pick-omit": { yt: "vBLOBDksjq4", credit: "Mohit Decodes — TypeScript Tutorial #39 - Partial, Pick & Omit Utility Types" },
    "typescript-8-3-record": { yt: "E1C00MZXhQ4", credit: "Fabio Biondi — Typescript: utility Types (Partial, Omit, Pick, Record,  keyof)" },
    "typescript-8-4-exclude-returntype-awaited": { yt: "BhNSauna0eo", credit: "Web Dev Simplified — You are a Junior Dev if You Don’t Know These 18 TypeScript Utility Types" },
    /* ── Chương 9 ── */
    "typescript-9-1-tsc-and-tsconfig": { yt: "FGYwsnItyDs", credit: "Net Ninja — TypeScript Crash Course #4 - Better Workflow with tsconfig" },
    "typescript-9-2-strict-mode": { yt: "eJXVEju3XLM", credit: "Matt Pocock — The TSConfig Cheat Sheet" },
    "typescript-9-3-extra-safety-flags": { yt: "eJXVEju3XLM", credit: "Matt Pocock — The TSConfig Cheat Sheet" },
    "typescript-9-4-target-lib-module": { yt: "8oblmpcn3pU", credit: "Smartherd — Configuration options in tsconfig.js file | TypeScript Tutorial" },
    /* ── Chương 10 ── */
    "typescript-10-1-es-modules": { yt: "EpOPR03z4Vw", credit: "Net Ninja — TypeScript Tutorial #14 - Modules" },
    "typescript-10-2-declaration-files": { yt: "06ygIwV8CkI", credit: "ProgramArtist — TypeScript Declaration Files" },
    "typescript-10-3-augmentation": { yt: "byCYSXVmH6E", credit: "Matt Pocock — Using DECLARE GLOBAL for amazing inference - Advanced TypeScript" },
    "typescript-10-4-types-from-packages": { yt: "LeWgPsLTOyg", credit: "Angular University — 💥 Typescript 2 @types - Installing Type Definitions For 3rd Party Libraries" },
    /* ── Chương 11 ── */
    "typescript-11-1-express-handlers": { yt: "bYgphDEWwvs", credit: "freeCodeCamp.org — TypeScript in Express – TypeScript Tutorial" },
    "typescript-11-2-typed-responses": { yt: "BWUi6BS9T5Y", credit: "TomDoesTech — Build a REST API with Node.js, Express, TypeScript, MongoDB & Zod" },
    "typescript-11-3-api-envelope-errors": { yt: "BWUi6BS9T5Y", credit: "TomDoesTech — Build a REST API with Node.js, Express, TypeScript, MongoDB & Zod" },
    "typescript-11-4-services-and-config": { yt: "PkwM39Vn6_0", credit: "Techstack Media — Express + TypeScript - Fast Dev Setup with Env, Watch & ts-node-dev - Express Series Ep. 5" },
    /* ── Chương 12 ── */
    "typescript-12-1-components-props": { yt: "KpA6oEaCHtk", credit: "Codevolution — React TypeScript Tutorial - 3 - Typing Props" },
    "typescript-12-2-hooks": { yt: "hA4i1RTbZ2A", credit: "Codevolution — React TypeScript Tutorial - 16 - useRef Hook" },
    "typescript-12-3-events": { yt: "aJP1AbZSqz8", credit: "freeCodeCamp.org — TypeScript in React - Full Tutorial" },
    "typescript-12-4-context-generics": { yt: "aJP1AbZSqz8", credit: "freeCodeCamp.org — TypeScript in React - Full Tutorial" },
    /* ── Chương 13 ── */
    "typescript-13-1-boundary-zod": { yt: "L6BE-U3oy80", credit: "Web Dev Simplified — Learn Zod In 30 Minutes" },
    "typescript-13-2-parse-safeparse": { yt: "IcyjtsAdKRs", credit: "Patel MernStack — Zod Validation Tutorial for Beginners [FULL COURSE in 40 Minutes!]" },
    "typescript-13-3-schema-source-of-truth": { yt: "L6BE-U3oy80", credit: "Web Dev Simplified — Learn Zod In 30 Minutes" },
    "typescript-13-4-types-from-prisma": { yt: "3_K841jF0FM", credit: "Prisma — Getting up and running with TypeScript and Prisma" },
    /* ── Chương 14 ── */
    "typescript-14-1-classes-access": { yt: "5ixtGi3n-Tg", credit: "Technical Rajni — Typescript Tutorial  #24  Private and Public Access Modifiers Typescript" },
    "typescript-14-2-abstract-implements": { yt: "62J_eQsK0e0", credit: "TypeScript with Benny Code — TypeScript Interfaces & Abstract Classes Tutorial" },
    "typescript-14-3-hash-private-static": { yt: "59jen6P7RFo", credit: "FED Learning — Static Members in TypeScript | Static Properties | Static Methods" },
    "typescript-14-4-decorators": { yt: "O6A-u_FoEX8", credit: "Fireship — The Magic of TypeScript Decorators" },
    /* ── Chương 15 ── */
    "typescript-15-1-where-time-goes": { yt: "eJXVEju3XLM", credit: "Matt Pocock — The TSConfig Cheat Sheet" },
    "typescript-15-2-incremental-references": { yt: "YX5yoApjI3M", credit: "Vercel — Turborepo Demo and Walkthrough (High-Performance Monorepos)" },
    "typescript-15-3-isolated-modules": { yt: "eJXVEju3XLM", credit: "Matt Pocock — The TSConfig Cheat Sheet" },
    "typescript-15-4-import-type": { yt: "eJXVEju3XLM", credit: "Matt Pocock — The TSConfig Cheat Sheet" },
    /* ── Chương 16 ── */
    "typescript-16-1-illegal-states": { yt: "T7i2wlCqgJk", credit: "Yuriy Bogomolov — Making Illegal States Unrepresentable in TypeScript" },
    "typescript-16-2-any-unknown-never": { yt: "YpT0rCWdCaE", credit: "TypeScript with Benny Code — Any, unknown, never, and void in TypeScript" },
    "typescript-16-3-organizing-types": { yt: "IXAT3If0pGI", credit: "basarat — TypeScript TYPES vs INTERFACES (Key Differences)" },
    "typescript-16-4-whole-picture": { yt: "QSIXYMIJkQg", credit: "Matt Pocock — 8 TypeScript Tips To Expand Your Mind (and improve your code)" },
  },
};
