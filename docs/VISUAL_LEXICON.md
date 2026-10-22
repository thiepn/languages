# THIEPN Visual Lexicon

An **opt-in, cross-language visual concept package** in `thiepn/languages`, sourced from original Japanese first-party SVGs. First batch: **19 of the 103** validated Japanese illustrations. The Japanese app and its current 103 originals are not modified or redirected. No copied textbook imagery, generated substitute content, learner state, grading engine, scheduler, tracking or credentials.

## Architecture

- **Illustration-specific concept IDs** (e.g. `food.apple`, `place.retail-shop`, `action.board-train`) are stable across target languages. They are not Japanese word IDs and are never matched by English glosses.
- Each SVG is physically included under `packages/visual-lexicon/assets/`. Every source matches the Git blob SHA from `thiepn/japanese` revision `0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458`.
- `VisualConcept` stores description, relative asset filename, the first-party rights label and original revision. The source label is not a blanket public-license grant; keep use within user-owned ecosystem until distribution permission is reviewed.
- Japanese's **original** IDs are explicit bindings; the first Chinese original P31 binding is `商店|shangdian` (shāngdiàn) → `place.retail-shop`, derived from the app's canonical `hanzi + "|" + plain(pinyin)` key rule. No Chinese learner data or app files were changed.
- French remains unbound until source-specific canonical word IDs and senses are reviewed; do not infer from translation or normalize French into fake IDs. Korean and Turkish can add independent bindings later.
- `visualForLexeme()` fails closed for absent or multiply mapped senses; `visualAssetPath()` only returns local relative paths. No calls to remote servers; consumers bundle assets and control lazy-loading, text-only fallback, optional cache and offline availability.

```ts
import {visualForLexeme,visualAssetPath} from "@thiepn/visual-lexicon";
const visual=visualForLexeme("japanese","lex-ringo");
const assetPath=visual && visualAssetPath(visual.id); // assets/apple.svg
// Your app's static build makes assetPath available locally; image is never a grading hint.
```

## Rollout

1. Verify asset checks and original vocabulary provenance in this draft.
2. Extend the collection beyond the first 19, retaining exact Git source SHA, semantic suitability and mobile readability.
3. Integrate the shared package and **explicit** bindings into each app separately, beginning with Japanese/Chinese and then source-verified French. Original Japanese assets remain served locally until explicit consumer adoption; never swap filenames or learner IDs.
4. Keep image hints out of independent recall grading by default. Allow pictures in introductions, word references and appropriate guided learning. Maintain local image error fallback and bounded PWA caches.

This draft is only a reusable source catalog. No merge, deployment, migration or production update has been performed.
