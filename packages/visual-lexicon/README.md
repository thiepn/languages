# @thiepn/visual-lexicon

103 original Japanese SVGs with language-neutral semantic concept IDs and source-preserving Japanese/Chinese/French bindings. Independent apps can use the compiled package or copy a local JSON/SVG catalog. See [Visual Lexicon contract](../../docs/VISUAL_LEXICON.md).

```sh
pnpm --filter @thiepn/visual-lexicon build
node packages/visual-lexicon/scripts/copy-assets.mjs ./my-app/public/visual-lexicon
```

`@thiepn/visual-lexicon/consumer` exports `localVocabularyImage` for optional, same-origin, lazy images in word introductions, reference and guided practice. It returns `null` for independent recall. Consumer apps keep their own text fallback and bounded offline image handling.

The packed package includes the `scripts/copy-assets.mjs` and `scripts/write-manifest.mjs` tools, not just the SVGs and compiled code. From a repository checkout:

```sh
pnpm --filter @thiepn/visual-lexicon build
node packages/visual-lexicon/scripts/copy-assets.mjs ./my-app/public/visual-lexicon
```
