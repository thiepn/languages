import type { LanguageLearningProfile } from "../../packages/orchestrator/src/index.js";

export const frenchLearningProfile = {
  schemaVersion: 1,
  languageId: "french",
  graph: {
    schemaVersion: 1,
    languageId: "french",
    nodes: [
      {
        id: "vocabulary",
        label: "Durable vocabulary",
        evidenceDimensions: ["meaning_recognition", "meaning_recall"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 12
      },
      {
        id: "natural-usage",
        label: "Natural usage",
        evidenceDimensions: ["natural_usage"],
        minimumEvidenceCount: 6
      },
      {
        id: "phrase-transfer",
        label: "Phrase transfer",
        evidenceDimensions: ["phrase_production"],
        minimumEvidenceCount: 6
      },
      {
        id: "sentence-transfer",
        label: "Sentence production",
        evidenceDimensions: ["grammar_production", "writing"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 8
      },
      {
        id: "reading",
        label: "Reading comprehension",
        evidenceDimensions: ["reading", "comprehension"],
        minimumEvidenceCount: 8
      },
      {
        id: "listening",
        label: "Context listening",
        evidenceDimensions: ["listening"],
        minimumEvidenceCount: 8
      },
      {
        id: "speaking",
        label: "Spoken production",
        evidenceDimensions: ["spoken_production", "pronunciation"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 8
      },
      {
        id: "conversation",
        label: "Conversation independence",
        evidenceDimensions: ["spoken_interaction"],
        minimumEvidenceCount: 8
      },
      {
        id: "missions",
        label: "Functional missions",
        evidenceDimensions: ["functional_mission"],
        minimumEvidenceCount: 4
      }
    ],
    edges: [
      { from: "vocabulary", to: "natural-usage", kind: "prerequisite", weight: 0.8 },
      { from: "natural-usage", to: "phrase-transfer", kind: "prerequisite", weight: 0.8 },
      { from: "phrase-transfer", to: "sentence-transfer", kind: "prerequisite", weight: 0.8 },
      { from: "vocabulary", to: "reading", kind: "prerequisite", weight: 0.7 },
      { from: "reading", to: "listening", kind: "transfer", weight: 0.65 },
      { from: "sentence-transfer", to: "speaking", kind: "prerequisite", weight: 0.7 },
      { from: "listening", to: "speaking", kind: "transfer", weight: 0.7 },
      { from: "speaking", to: "conversation", kind: "prerequisite", weight: 0.8 },
      { from: "sentence-transfer", to: "conversation", kind: "transfer", weight: 0.6 },
      { from: "conversation", to: "missions", kind: "prerequisite", weight: 0.85 },
      { from: "vocabulary", to: "natural-usage", kind: "transfer", weight: 0.75 },
      { from: "natural-usage", to: "phrase-transfer", kind: "transfer", weight: 0.75 },
      { from: "phrase-transfer", to: "sentence-transfer", kind: "transfer", weight: 0.75 },
      { from: "sentence-transfer", to: "speaking", kind: "transfer", weight: 0.75 },
      { from: "speaking", to: "conversation", kind: "transfer", weight: 0.8 },
      { from: "conversation", to: "missions", kind: "transfer", weight: 0.8 }
    ]
  },
  activities: [
    { id: "mixed-review", label: "Mixed Review", targetSkillIds: ["vocabulary"], estimatedMinutes: 10, basePriority: 0.75, category: "retrieval" },
    { id: "usage", label: "Usage 10", targetSkillIds: ["natural-usage"], estimatedMinutes: 7, basePriority: 0.55, category: "production" },
    { id: "phrase-transfer", label: "Phrase transfer", targetSkillIds: ["phrase-transfer"], estimatedMinutes: 7, basePriority: 0.55, category: "production" },
    { id: "sentence", label: "Sentence production", targetSkillIds: ["sentence-transfer"], estimatedMinutes: 8, basePriority: 0.6, category: "production" },
    { id: "reading", label: "Contextual reading", targetSkillIds: ["reading"], estimatedMinutes: 6, basePriority: 0.5, category: "input" },
    { id: "listening", label: "Contextual listening", targetSkillIds: ["listening"], estimatedMinutes: 6, basePriority: 0.55, category: "input" },
    { id: "speaking", label: "Speak 10", targetSkillIds: ["speaking"], estimatedMinutes: 8, basePriority: 0.6, category: "production" },
    { id: "conversation", label: "Adaptive conversation", targetSkillIds: ["conversation"], estimatedMinutes: 10, basePriority: 0.55, category: "interaction" },
    { id: "mission", label: "Real-world mission", targetSkillIds: ["missions"], estimatedMinutes: 15, basePriority: 0.45, category: "interaction" }
  ]
} as const satisfies LanguageLearningProfile;
