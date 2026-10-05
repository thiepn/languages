import type { LanguagePackManifest } from "../../packages/language-registry/src/index.js";

export const frenchLanguagePack = {
  schemaVersion: 1,
  packVersion: "0.1.0",
  contentPackageId: "french-core",
  contentSchemaVersion: 1,
  definition: {
    schemaVersion: 1,
    id: "french",
    languageTag: "fr-FR",
    displayName: "French",
    nativeName: "Français",
    scripts: [
      { id: "Latn", name: "Latin", direction: "ltr", primary: true }
    ],
    frameworks: [
      {
        id: "cefr",
        name: "Common European Framework of Reference",
        role: "primary",
        levels: ["pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]
      },
      {
        id: "delf-dalf",
        name: "DELF/DALF",
        role: "exam_overlay",
        levels: ["A1", "A2", "B1", "B2", "C1", "C2"]
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
      { id: "conjugation", required: true, description: "French verb morphology and productive conjugation practice" },
      { id: "liaison", required: false, description: "French connected-speech behavior" }
    ],
    adapters: [
      { capability: "segmentation", adapterId: "unicode-word-segmentation/fr", required: true },
      { capability: "morphology", adapterId: "french-morphology", required: true },
      { capability: "pronunciation", adapterId: "french-pronunciation", required: true },
      { capability: "sorting", adapterId: "cldr/fr-FR", required: true },
      { capability: "input", adapterId: "latin-input/fr", required: false }
    ]
  }
} as const satisfies LanguagePackManifest;
