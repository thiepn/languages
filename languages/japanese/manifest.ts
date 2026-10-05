import type { LanguagePackManifest } from "../../packages/language-registry/src/index.js";

export const japaneseLanguagePack = {
  schemaVersion: 1,
  packVersion: "0.1.0",
  contentPackageId: "japanese-core",
  contentSchemaVersion: 1,
  definition: {
    schemaVersion: 1,
    id: "japanese",
    languageTag: "ja-JP",
    displayName: "Japanese",
    nativeName: "日本語",
    scripts: [
      { id: "Jpan", name: "Japanese", direction: "ltr", primary: true }
    ],
    frameworks: [
      {
        id: "cefr",
        name: "Common European Framework of Reference",
        role: "primary",
        levels: ["pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]
      },
      {
        id: "jf-standard",
        name: "JF Standard for Japanese-Language Education",
        role: "mapping",
        levels: ["A1", "A2", "B1", "B2", "C1", "C2"]
      },
      {
        id: "jlpt",
        name: "Japanese-Language Proficiency Test",
        role: "exam_overlay",
        levels: ["N5", "N4", "N3", "N2", "N1"]
      }
    ],
    primaryFrameworkId: "cefr",
    modules: [
      { id: "vocabulary", required: true },
      { id: "grammar", required: true },
      { id: "pronunciation", required: true },
      { id: "listening", required: true },
      { id: "reading", required: true },
      { id: "speaking", required: true },
      { id: "writing", required: true },
      { id: "kana", required: true, description: "Hiragana and katakana literacy" },
      { id: "kanji", required: true, description: "Kanji recognition, readings and contextual use" },
      { id: "furigana", required: true, description: "Reading support policy for kanji text" },
      { id: "pitch-accent", required: false, description: "Optional pitch-accent metadata and practice" }
    ],
    adapters: [
      { capability: "segmentation", adapterId: "japanese-segmentation", required: true },
      { capability: "morphology", adapterId: "japanese-morphology", required: true },
      { capability: "transliteration", adapterId: "hepburn-romaji", required: false },
      { capability: "pronunciation", adapterId: "japanese-pronunciation", required: true },
      { capability: "sorting", adapterId: "cldr/ja-JP", required: true },
      { capability: "input", adapterId: "japanese-ime", required: true }
    ]
  }
} as const satisfies LanguagePackManifest;
