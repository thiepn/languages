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
      id: "lexical-retention",
      label: "Lexical retention",
      competence: "lexical",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `vocabulary:${level}`, minimumCount: 1 }
      ],
      remediationSkillId: "vocabulary",
      remediationActivityId: "mixed-review"
    },
    {
      id: "active-transfer",
      label: "Active transfer",
      competence: "grammar",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `transfer:${level}`, minimumCount: 1 }
      ],
      remediationSkillId: "sentence-transfer",
      remediationActivityId: "sentence"
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
      remediationSkillId: "reading",
      remediationActivityId: "reading"
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
      id: "speaking",
      label: "Spoken production",
      competence: "spoken_production",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: evidenceMinimum,
      minimumIndependentEvidenceCount: 2,
      coverageRequirements: [
        { key: `speaking:${level}`, minimumCount: 3 }
      ],
      remediationSkillId: "speaking",
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
      remediationSkillId: "conversation",
      remediationActivityId: "conversation"
    },
    {
      id: "functional-missions",
      label: "Functional missions",
      competence: "functional",
      scoreThreshold,
      confidenceThreshold,
      minimumEvidenceCount: Math.max(2, evidenceMinimum - 1),
      minimumIndependentEvidenceCount: 1,
      coverageRequirements: [
        { key: `missions:${level}`, minimumCount: 1 }
      ],
      remediationSkillId: "missions",
      remediationActivityId: "mission"
    }
  ];
}

export const frenchProficiencyPolicy = {
  schemaVersion: 1,
  languageId: "french",
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

export const frenchExternalFrameworks = [
  {
    frameworkId: "delf-dalf",
    role: "exam_overlay",
    coveredCompetences: [
      "reading",
      "listening",
      "spoken_production",
      "spoken_interaction",
      "writing"
    ]
  }
] as const satisfies readonly ExternalFrameworkDefinition[];
