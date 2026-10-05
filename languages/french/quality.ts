import type {
  CoverageRequirement,
  LanguageQualityPolicy
} from "../../packages/content-validation/src/index.js";

const levels = ["A1", "A2", "B1", "B2"] as const;
const everydayDomains = [
  "greetings",
  "people-family",
  "home",
  "food-drink",
  "travel-transport",
  "work-study",
  "shopping-clothing",
  "time-routine",
  "town-services",
  "communication",
  "health-body",
  "nature-weather",
  "feelings-opinions",
  "connectors-function-words"
] as const;

const domainCoverage: CoverageRequirement[] = levels.flatMap((level) =>
  everydayDomains.map((domain) => ({
    key: `domain:${level}:${domain}`,
    minimumCount: 1,
    level,
    label: `${level} everyday-domain coverage · ${domain}`,
    promotionCritical: false,
    severity: "warning" as const
  }))
);

export const frenchQualityPolicy = {
  schemaVersion: 1,
  languageId: "french",
  additionalCoverageRequirements: domainCoverage,
  qualityMetrics: [
    {
      id: "example-pair-coverage",
      label: "Vocabulary example-pair coverage",
      minimum: 0.9,
      severity: "warning"
    },
    {
      id: "ipa-coverage",
      label: "IPA coverage",
      minimum: 0.8,
      severity: "warning"
    },
    {
      id: "noun-article-coverage",
      label: "Noun article coverage",
      minimum: 0.95,
      severity: "warning"
    },
    {
      id: "noun-gender-coverage",
      label: "Noun gender coverage",
      minimum: 0.95,
      severity: "warning"
    }
  ]
} as const satisfies LanguageQualityPolicy;
