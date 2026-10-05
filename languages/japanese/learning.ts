import type { LanguageLearningProfile } from "../../packages/orchestrator/src/index.js";

export const japaneseLearningProfile = {
  schemaVersion: 1,
  languageId: "japanese",
  graph: {
    schemaVersion: 1,
    languageId: "japanese",
    nodes: [
      {
        id: "kana",
        label: "Kana literacy",
        evidenceDimensions: ["kana_recognition", "orthography"],
        minimumEvidenceCount: 12
      },
      {
        id: "vocabulary",
        label: "Core vocabulary",
        evidenceDimensions: ["meaning_recognition", "meaning_recall"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 12
      },
      {
        id: "kanji",
        label: "Kanji literacy",
        evidenceDimensions: ["kanji_recognition", "word_recognition"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 12
      },
      {
        id: "word-reading",
        label: "Word reading",
        evidenceDimensions: ["word_reading", "reading"],
        minimumEvidenceCount: 10
      },
      {
        id: "sentence-reading",
        label: "Sentence reading",
        evidenceDimensions: ["reading", "comprehension"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 10
      },
      {
        id: "listening",
        label: "Listening",
        evidenceDimensions: ["listening"],
        minimumEvidenceCount: 8
      },
      {
        id: "spoken-production",
        label: "Spoken production",
        evidenceDimensions: ["spoken_production", "pronunciation"],
        aggregation: "weakest_link",
        minimumEvidenceCount: 8
      },
      {
        id: "interaction",
        label: "Spoken interaction",
        evidenceDimensions: ["spoken_interaction"],
        minimumEvidenceCount: 8
      }
    ],
    edges: [
      { from: "kana", to: "word-reading", kind: "prerequisite", weight: 0.9 },
      { from: "vocabulary", to: "word-reading", kind: "prerequisite", weight: 0.75 },
      { from: "kanji", to: "word-reading", kind: "prerequisite", weight: 0.8 },
      { from: "word-reading", to: "sentence-reading", kind: "prerequisite", weight: 0.85 },
      { from: "vocabulary", to: "sentence-reading", kind: "transfer", weight: 0.7 },
      { from: "word-reading", to: "sentence-reading", kind: "transfer", weight: 0.8 },
      { from: "vocabulary", to: "listening", kind: "transfer", weight: 0.7 },
      { from: "listening", to: "spoken-production", kind: "transfer", weight: 0.75 },
      { from: "vocabulary", to: "spoken-production", kind: "prerequisite", weight: 0.65 },
      { from: "spoken-production", to: "interaction", kind: "prerequisite", weight: 0.8 },
      { from: "listening", to: "interaction", kind: "prerequisite", weight: 0.75 },
      { from: "spoken-production", to: "interaction", kind: "transfer", weight: 0.8 }
    ]
  },
  activities: [
    { id: "kana-review", label: "Kana review", targetSkillIds: ["kana"], estimatedMinutes: 6, basePriority: 0.7, category: "script" },
    { id: "vocabulary-review", label: "Vocabulary review", targetSkillIds: ["vocabulary"], estimatedMinutes: 10, basePriority: 0.75, category: "retrieval" },
    { id: "kanji-study", label: "Kanji study", targetSkillIds: ["kanji"], estimatedMinutes: 8, basePriority: 0.65, category: "script" },
    { id: "word-reading", label: "Word reading", targetSkillIds: ["word-reading"], estimatedMinutes: 7, basePriority: 0.55, category: "reading" },
    { id: "sentence-reading", label: "Sentence reading", targetSkillIds: ["sentence-reading"], estimatedMinutes: 8, basePriority: 0.55, category: "reading" },
    { id: "listening", label: "Listening practice", targetSkillIds: ["listening"], estimatedMinutes: 7, basePriority: 0.55, category: "input" },
    { id: "speaking", label: "Speaking practice", targetSkillIds: ["spoken-production"], estimatedMinutes: 8, basePriority: 0.55, category: "production" },
    { id: "interaction", label: "Conversation practice", targetSkillIds: ["interaction"], estimatedMinutes: 10, basePriority: 0.5, category: "interaction" }
  ]
} as const satisfies LanguageLearningProfile;
