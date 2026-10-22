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
pnpm --filter @thiepn/visual-lexicon copy:assets -- /absolute/path/to/app/public/visual-lexicon
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
