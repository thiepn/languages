# THIEPN Visual Lexicon — cross-language first-party images

## Completed source preservation

**103 of 103** original Japanese authored SVG assets are byte-identical to `thiepn/japanese` commit `0cb9533f2bd6d438cc03de7e4f2399dbbe6b9458` (Git blob SHA per catalog entry). All 103 original Japanese lexical IDs, meaningful alt descriptions, filenames and author-rights labels are preserved. This includes `lex-mizu`, a canonical legacy pilot not directly listed in the A1/A2 unit vocabularies.

Semantic concept IDs describe the **illustrated sense**, not a translation: `food.cooked-rice-bowl`, `relation.tree-behind-house`, `condition.worn-shoe`, `script.japanese-kanji-examples`. Neither a general word like "rice" nor Chinese characters are automatically mapped to a picture showing a different sense. Unmapped or ambiguous words remain text-only.

## Supported mappings

Japanese: all 103 original `lex-*` IDs. Chinese: 12 original, explicitly verified words at `thiepn/chinese` commit `9688e7354142b7127fd5f6eb69b03b595a437008` from `src/demo-lessons.mjs`, `src/p31-vocabulary-a.mjs` and `src/p31-vocabulary-b.mjs`. Chinese uses the app's **unchanged canonical key** `hanzi + "|" + plain(pinyin)` where `plain` removes tone and Unicode diacritic marks; notably `绿茶|lucha` for `lǜchá` rather than a guessed `lvcha`.

Selected examples: `书|shu` → `object.book`; `水|shui` → `beverage.water`; `商店|shangdian` → `place.retail-shop`; `吃|chi` → `action.eat-food`; `冬天|dongtian` → `season.winter-snow`. Do not assert official HSK membership or linguistic certification.

French source identity **investigated but not yet bound**. The original U28 course vocabulary uses a stable source-qualified key `OriginalRegistryEntry.qualifiedId + "#vocab-" + 2-digit original unit vocabulary order` (see `thiepn/french/app/src/core/unified/u28-vocabulary.ts`). This key is **not** equivalent to the separate, source-loaded `VocabularyWord.id` / `VocabularySearchRow.id` in `app/src/core/content/loader.ts`, and is never a user-custom-card ID. French bindings require verified exact owner, source revision, sense and real original ID from the specific consumer surface before activation. No invented `pomme` or translated-key mappings.

## Package and asset distribution

The `packages/visual-lexicon` workspace package compiles to importable JavaScript and TypeScript declarations; it does not require the consuming app to bundle TypeScript source.

```sh
pnpm --filter @thiepn/visual-lexicon build
node packages/visual-lexicon/scripts/copy-assets.mjs /absolute/path/to/app/public/visual-lexicon
```

The copy command checks the **original Git SHA** of each source SVG before copying, then copies 103 local files plus a machine-readable `visual-catalog.json` with all approved bindings. It uses no network, accounts or databases. Consumers can use the compiled package API or load the locally bundled JSON and SVGs from their own origin, including installed offline PWAs when app caching/precache permits.

```ts
import {visualForLexeme,visualAssetPath} from "@thiepn/visual-lexicon";
const row=visualForLexeme("japanese","lex-ringo"); 
const localUrl=row && "/visual-lexicon/"+visualAssetPath(row.id);
// Image is optional: use loading="lazy", readable alt, text-only fallback.
```

`visualAssetPath` returns a local relative path only. Each app retains control of the static base route, offline image eviction, image failure handling, accessibility and whether a lesson is graded. The original Japanese image cache remains bounded at 48; no second cache/scheduler is introduced by this package. Do not present target-language images as answer hints on independent graded recall unless the existing pedagogy explicitly intends image prompts.

The source rights label `Original THIEPN illustration` is **not** an open-source license grant. Confirm distribution rights and suitable visual legibility before external publication or production migration. All target applications continue using their existing resources until explicitly integrated and qualified.

## Next consumers

Integrate with a bounded adapter per app: first prove exact source ID/sense match, then bundle local assets, use optional image lookup in vocabulary introductions/reference, and check offline/160–190px readability. Keep original app IDs, progress and grading intact. Never rewrite Chinese/French/Japanese learner-state records or duplicate engines.

This branch is a **draft implementation** only. No production deploy or merge.

## Phase 3 — verified French bridge and consumer-ready package

Six exact original French U28 **source-qualified** lexeme keys are bound without touching native content IDs. Original authoritative source: `thiepn/french@3fb5c720cfeceaf682ce53c897701b489b7eaf6f`; `u6-a1-01-04.ts` defines the original vocabulary positions, `u6-a1-model.ts` the `u6-` session provenance, `source.ts` the original source revision `unified-u1-original-v1`, and `u28-vocabulary.ts` the `#vocab-NN` ID formula:

| Source unit/position | Original word | Approved visual concept |
|---|---|---|
| `a1-02#vocab-08` | étudiant | `person.student-with-book` |
| `a1-02#vocab-09` | étudiante | `person.student-with-book` |
| `a1-02#vocab-10` | professeur | `person.teacher-at-board` |
| `a1-03#vocab-01` | un livre | `object.book` |
| `a1-03#vocab-04` | une école | `place.school` |
| `a1-03#vocab-05` | un sac | `object.handled-bag` |

Each table identity has full prefix `fru1:original@unified-u1-original-v1:session:u6-`. These are not native `VocabularyWord.id` entries, privately saved cards, or free-text strings. No unverified French word or automatically inferred translation is mapped. Catalog totals: **103 visual concepts, 103 Japanese + 12 Chinese + 6 French = 121 explicit bindings**.

The distributable package now includes its `scripts/**`, fixing the missing asset-copy command in the previous pack file allowlist. The root `pnpm verify` chain adds the shared visual package build after TypeScript and Vitest, so future non-draft qualification checks compiled JS, declarations and JSON catalog, not merely the source arrays. No CI has been forced on this draft.

### Local image descriptor for independent applications

```ts
import {localVocabularyImage} from "@thiepn/visual-lexicon/consumer";
const image=localVocabularyImage({
 languageId:"chinese",lexemeId:"书|shu",usage:"reference",
 assetBase:"/visual-lexicon"
});
// image?.src is /visual-lexicon/assets/book.svg
// A consumer can render <img ...image> and retain the word itself on error.
```

The descriptor returns intrinsic 320×240 dimensions, original meaningful alt text, `loading:"lazy"` and `decoding:"async"`, or `null` for an unknown word, an unsafe/nonlocal asset path or `usage:"independent-recall"`. This is read-only metadata, **not** a second image fetch engine or persistent cache. Native apps retain authority for presentation, failure/reconnect handling and PWA caching.

**First recommended consumer: Chinese's existing read-only Word Library**, `src/libraries-c9.mjs` displaying `WORDS` from `src/lexicon.mjs`. The stable exact `w.key` identity can join the 12 approved mappings, and its DOM cards can optionally load the locally copied SVG beside the word and meaning. Do not add image hints to answer-graded drills; Chinese's original lesson/progress/navigation engines remain unchanged. This is a **proposed integration point**, not a claim that Chinese is already consuming this draft package. Japanese already displays its own locally cached 103 illustrations; it should switch asset ownership only after consumer tests prove parity, including its existing 48-entry image-only cache and offline fallback. The French U28 source vocabulary panel is the next candidate; the French word-corpus panel requires separate `VocabularyWord.id` review.

### Verification boundaries

Static Git comparison previously confirmed **103/103 exact Japanese SVG blob hashes** and 103 original canonical Japanese mappings. An isolated Node 22 fixture executed both packaging scripts, exported 103 synthetic assets and 121 bindings, and a synthetic npm pack dry run included the SVGs and both scripts. A synthetic earlier corrupted-file case confirms the integrity gate rejects bad source before writing output. An isolated TypeScript 5.8/Node 22 check passed 11 assertions for the optional image descriptor. None of these are a substitute for an **authentic full Node 24.15+/pnpm 11.19/TypeScript 7/Vitest build or real browser/PWA acceptance**. Original app repositories are unchanged. Keep this PR draft, unmerged and undeployed.
