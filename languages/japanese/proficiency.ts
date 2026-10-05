import type {
  ExternalFrameworkDefinition,
  ProficiencyPolicy,
  PromotionGateDefinition
} from "../../packages/proficiency/src/index.js";

function gates(
  level: string,
  scoreThreshold: number,
  confidenceThreshold: number,
  evidenceMinimum: number
): readonly PromotionGateDefinition[] {
  return [
    {
      id: "lexical-script",
      label: "Vocabulary and script",
      competence: "lexical",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `vocabulary:${level}`, minimumCount: 1 },
        { key: `script:${level}`, minimumCount: 1 }
      ],
      remediationSkillId: "vocabulary",
      remediationActivityId: "vocabulary-review"
    },
    {
      id: "reading",
      label: "Reading",
      competence: "reading",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `reading:${level}`, minimumCount: 3 }
      ],
      remediationSkillId: "sentence-reading",
      remediationActivityId: "sentence-reading"
    },
    {
      id: "listening",
      label: "Listening",
      competence: "listening",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `listening:${level}`, minimumCount: 3 }
      ],
      remediationSkillId: "listening",
      remediationActivityId: "listening"
    },
    {
      id: "spoken-production",
      label: "Spoken production",
      competence: "spoken_production",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `speaking:${level}`, minimumCount: 3 }
      ],
      remediationSkillId: "spoken-production",
      remediationActivityId: "speaking"
    },
    {
      id: "interaction",
      label: "Spoken interaction",
      competence: "spoken_interaction",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `interaction:${level}`, minimumCount: 3 }
      ],
      remediationSkillId: "interaction",
      remediationActivityId: "interaction"
    },
    {
      id: "writing",
      label: "Writing",
      competence: "writing",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: Math.max(2, evidenceMinimum - 1),
      minimumIndependentEvidenceCount: 1,
      coverageRequirements: [
        { key: `writing:${level}`, minimumCount: 2 }
      ]
    },
    {
      id: "functional-can-do",
      label: "Functional Can-do performance",
      competence: "functional",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: Math.max(2, evidenceMinimum - 1),
      minimumIndependentEvidenceCount: 1,
      coverageRequirements: [
        { key: `can-do:${level}`, minimumCount: 1 }
      ]
    }
  ];
}

export const japaneseProficiencyPolicy = {
  schemaVersion: 1,
  languageId: "japanese",
  frameworkId: "cefr",
  levels: [
    {
      level: "A1",
      gates: gates("A1", 0.55, 0.30, 3)
    },
    {
      level: "A2",
      prerequisiteLevel: "A1",
      gates: gates("A2", 0.60, 0.38, 4)
    },
    {
      level: "B1",
      prerequisiteLevel: "A2",
      gates: gates("B1", 0.66, 0.46, 5)
    },
    {
      level: "B2",
      prerequisiteLevel: "B1",
      gates: gates("B2", 0.72, 0.54, 6)
    }
  ]
} as const satisfies ProficiencyPolicy;

export const japaneseExternalFrameworks = [
  {
    frameworkId: "jf-standard",
    role: "mapping",
    coveredCompetences: [
      "reading",
      "listening",
      "spoken_production",
      "spoken_interaction",
      "writing",
      "functional"
    ]
  },
  {
    frameworkId: "jlpt",
    role: "exam_overlay",
    coveredCompetences: ["lexical", "grammar", "reading", "listening"],
    excludedCompetences: [
      "spoken_production",
      "spoken_interaction",
      "writing",
      "mediation"
    ]
  }
] as const satisfies readonly ExternalFrameworkDefinition[];
