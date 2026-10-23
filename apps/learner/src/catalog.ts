import raw from "../../../contracts/fixtures/phase02-source-lessons.json";
import nextRaw from "../../../contracts/fixtures/phase15-source-lessons.json";
import bridgeRaw from "../../../contracts/fixtures/phase17-cross-source-lessons.json";
import continuationRaw from "../../../contracts/fixtures/phase18-next-source-lessons.json";
import {admitInternalPilot,sourceCoverage,type SourceCoverage} from "./source-coverage";
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

const originalBundles = raw.bundles as unknown as LessonBundleV1[];
const newBundles = nextRaw.bundles as unknown as LessonBundleV1[];
const bridgeBundles=bridgeRaw.bundles as unknown as LessonBundleV1[];
const continuationBundles=continuationRaw.bundles as unknown as LessonBundleV1[];
const bundles = [...originalBundles,...newBundles,...bridgeBundles,...continuationBundles];
if (raw.purpose !== "internal-contract-testing-only" ||
    nextRaw.purpose !== "internal-contract-testing-only" ||
    bridgeRaw.purpose !== "internal-contract-testing-only" ||
    continuationRaw.purpose !== "internal-contract-testing-only" ||
    originalBundles.length !== LANGUAGES.length ||
    newBundles.length !== LANGUAGES.length ||
    bridgeBundles.length !== LANGUAGES.length ||
    continuationBundles.length !== LANGUAGES.length ||
    bundles.length !== LANGUAGES.length*4 ||
    new Set(bundles.map(bundle=>bundle.lesson.id)).size !== bundles.length ||
    bundles.some(bundle =>
      bundle.lesson.publication !== "internal-fixture" ||
      bundle.lesson.sources.some(source => source.redistributionVerified || source.editorialReview !== "pending") ||
      !admitInternalPilot(bundle).length
    ) ||
    LANGUAGES.some(language => originalBundles.filter(bundle => bundle.lesson.languageId === language.id).length !== 1 ||
      newBundles.filter(bundle => bundle.lesson.languageId === language.id).length !== 1 ||
      bridgeBundles.filter(bundle => bundle.lesson.languageId === language.id).length !== 1 ||
      continuationBundles.filter(bundle => bundle.lesson.languageId === language.id).length !== 1)) {
  throw new Error("The internal learner requires exactly four admitted internal lessons per language.");
}

export const DEMO_BUNDLES: Readonly<Record<LanguageChoice, LessonBundleV1>> =
  Object.freeze(Object.fromEntries(originalBundles.map(bundle => [bundle.lesson.languageId, bundle])) as Record<LanguageChoice, LessonBundleV1>);

export function languageLabel(id: LanguageChoice): string {
  return LANGUAGES.find(language => language.id === id)?.label ?? id;
}

/** Authoring coverage is never learner progress or a review/scheduling count. */
export const DEMO_SOURCE_COVERAGE:Readonly<Record<LanguageChoice,readonly SourceCoverage[]>> =
  Object.freeze(Object.fromEntries(originalBundles.map(bundle=>[
    bundle.lesson.languageId,sourceCoverage(bundle)
  ])) as Record<LanguageChoice,readonly SourceCoverage[]>);

/** Read-only authoring catalog. Original pilot remains first for every language. */
export const COURSE_BUNDLES:Readonly<Record<LanguageChoice,readonly LessonBundleV1[]>> =
  Object.freeze(Object.fromEntries(LANGUAGES.map(language=>[
    language.id,Object.freeze(bundles.filter(bundle=>bundle.lesson.languageId===language.id))
  ])) as Record<LanguageChoice,readonly LessonBundleV1[]>);
export const SOURCE_COVERAGE_BY_LESSON:Readonly<Record<string,readonly SourceCoverage[]>> =
  Object.freeze(Object.fromEntries(bundles.map(bundle=>[bundle.lesson.id,sourceCoverage(bundle)])));
