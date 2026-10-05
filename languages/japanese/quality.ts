import type {
  CoverageRequirement,
  LanguageQualityPolicy
} from "../../packages/content-validation/src/index.js";

const levels = ["A1", "A2", "B1", "B2"] as const;

const nativeAudioCoverage: CoverageRequirement[] = levels.map((level) => ({
  key: `native-audio:${level}`,
  minimumCount: 1,
  level,
  label: `${level} independently licensed native-audio inventory`,
  promotionCritical: false,
  severity: "warning" as const
}));

export const japaneseQualityPolicy = {
  schemaVersion: 1,
  languageId: "japanese",
  additionalCoverageRequirements: nativeAudioCoverage,
  qualityMetrics: [
    {
      id: "native-audio-metadata-coverage",
      label: "Native-audio source/credit/license metadata coverage",
      minimum: 1,
      severity: "warning"
    }
  ]
} as const satisfies LanguageQualityPolicy;
