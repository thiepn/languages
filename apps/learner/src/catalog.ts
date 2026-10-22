import raw from "../../../contracts/fixtures/phase02-source-lessons.json";
import {
  validateLessonBundleV1,
  type LessonBundleV1
} from "../../../packages/content-schema/src/index.js";

/** This is an internal fixture catalog only: never a live course registry. */
export const LANGUAGES = [
  {id: "fr", label: "French", nativeLabel: "Français"},
  {id: "ja", label: "Japanese", nativeLabel: "日本語"},
  {id: "zh", label: "Chinese", nativeLabel: "中文"}
] as const;

export type LanguageChoice = typeof LANGUAGES[number]["id"];

const bundles = raw.bundles as unknown as LessonBundleV1[];
if (raw.purpose !== "internal-contract-testing-only" ||
    bundles.length !== LANGUAGES.length ||
    bundles.some(bundle =>
      bundle.lesson.publication !== "internal-fixture" ||
      bundle.lesson.sources.some(source => source.redistributionVerified || source.editorialReview !== "pending") ||
      validateLessonBundleV1(bundle).length !== 0
    ) ||
    LANGUAGES.some(language => bundles.filter(bundle => bundle.lesson.languageId === language.id).length !== 1)) {
  throw new Error("The Phase 03 preview requires exactly three valid, unpublished source fixtures.");
}

export const DEMO_BUNDLES: Readonly<Record<LanguageChoice, LessonBundleV1>> =
  Object.freeze(Object.fromEntries(bundles.map(bundle => [bundle.lesson.languageId, bundle])) as Record<LanguageChoice, LessonBundleV1>);

export function languageLabel(id: LanguageChoice): string {
  return LANGUAGES.find(language => language.id === id)?.label ?? id;
}
