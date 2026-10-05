import type { StudyEvent } from "../../packages/domain/src/index.js";
import type { FsrsCardSnapshot } from "../../packages/scheduler/src/index.js";

export const JAPANESE_CURRENT_REPOSITORY_BASELINE = {
  repositoryRevision: "45d03f5b027bdb36fcf5a7f7df3c063e1ba09893",
  baseSeedBlobSha: "e15c8ae44e3aac08750e8fa7e34ec0ad7d333927",
  sourceRegistryBlobSha: "c80e561b5a56da5a1ea027a56d43b2839d91fc58",
  c1LexiconBlobSha: "76bcdbc077141f0f23548eb54878423e12a00f38",
  c1LanguageBlobSha: "2963715e7f502f4417518980f8cf36fe3bbb8ff7",
  c1CourseBlobSha: "6ef0df4f71edb3851c9fbf65b92aae14840e1bb8",
  assembledVersion: "0.10.0",
  assembledCounts: {
    lexemes: 658, senses: 658, kanji: 37, grammar: 118, sentences: 375,
    audioAssets: 203, canDos: 68, courseUnits: 68, readingTexts: 50,
    productiveTasks: 44, lexicalChunks: 152
  }
} as const;

export interface JapaneseLegacySource {
  readonly id: string; readonly title: string;
  readonly role?: readonly string[]; readonly roles?: readonly string[];
  readonly publicExport?: boolean; readonly license?: string;
  readonly licenseName?: string; readonly canonicalUrl?: string;
  readonly version?: string; readonly attribution?: string;
}
export interface JapaneseSourceRegistry {
  readonly schemaVersion?: number;
  readonly sources: readonly JapaneseLegacySource[];
}
export interface JapaneseEntityRef { readonly kind: string; readonly id: string; }
export interface JapaneseLexeme {
  readonly id: string; readonly canonicalForm?: string;
  readonly senseIds?: readonly string[];
  readonly kanjiLinks?: readonly { readonly kanjiId: string; readonly position?: number }[];
  readonly audioIds?: readonly string[]; readonly sourceIds?: readonly string[];
}
export interface JapaneseSense {
  readonly id: string; readonly lexemeId: string; readonly sourceIds?: readonly string[];
}
export interface JapaneseKanji { readonly id: string; readonly sourceIds?: readonly string[]; }
export interface JapaneseGrammar {
  readonly id: string; readonly level?: string;
  readonly prerequisiteIds?: readonly string[]; readonly contrastIds?: readonly string[];
  readonly sourceIds?: readonly string[];
}
export interface JapaneseSentence {
  readonly id: string; readonly level?: string;
  readonly grammarIds?: readonly string[]; readonly entityRefs?: readonly JapaneseEntityRef[];
  readonly sourceIds?: readonly string[];
}
export interface JapaneseAudioAsset {
  readonly id: string; readonly sourceIds?: readonly string[];
  readonly credit?: string; readonly licenseName?: string;
  readonly attributionUrl?: string; readonly nativeSpeaker?: boolean;
}
export interface JapaneseCanDo {
  readonly id: string; readonly level?: string; readonly languageActivity?: string;
  readonly grammarIds?: readonly string[]; readonly sentenceIds?: readonly string[];
  readonly prerequisiteIds?: readonly string[]; readonly sourceIds?: readonly string[];
}
export interface JapaneseCourseUnit {
  readonly id: string; readonly level?: string; readonly canDoId?: string;
  readonly prerequisiteUnitIds?: readonly string[]; readonly grammarIds?: readonly string[];
  readonly sentenceIds?: readonly string[]; readonly vocabularyIds?: readonly string[];
  readonly conjugationLexemeIds?: readonly string[]; readonly sourceIds?: readonly string[];
}
export interface JapaneseReadingText {
  readonly id: string; readonly level?: string; readonly sentenceIds?: readonly string[];
  readonly targetLexemeIds?: readonly string[]; readonly grammarIds?: readonly string[];
  readonly audioMode?: string; readonly audioAssetId?: string;
  readonly sourceIds?: readonly string[];
}
export interface JapaneseProductiveTask {
  readonly id: string; readonly level?: string;
  readonly mode?: "writing" | "speaking" | string;
  readonly targetGrammarIds?: readonly string[]; readonly targetLexemeIds?: readonly string[];
  readonly targetChunkIds?: readonly string[]; readonly sourceIds?: readonly string[];
}
export interface JapaneseLexicalChunk {
  readonly id: string; readonly level?: string; readonly lexemeIds?: readonly string[];
  readonly grammarIds?: readonly string[]; readonly exampleSentenceIds?: readonly string[];
  readonly sourceIds?: readonly string[];
}
export interface JapaneseSeedPackage {
  readonly schemaVersion?: number; readonly version?: string; readonly sourceIds?: readonly string[];
  readonly lexemes?: readonly JapaneseLexeme[]; readonly senses?: readonly JapaneseSense[];
  readonly kanji?: readonly JapaneseKanji[]; readonly grammar?: readonly JapaneseGrammar[];
  readonly sentences?: readonly JapaneseSentence[]; readonly audioAssets?: readonly JapaneseAudioAsset[];
  readonly canDos?: readonly JapaneseCanDo[]; readonly courseUnits?: readonly JapaneseCourseUnit[];
  readonly readingTexts?: readonly JapaneseReadingText[];
  readonly productiveTasks?: readonly JapaneseProductiveTask[];
  readonly lexicalChunks?: readonly JapaneseLexicalChunk[];
}
export interface JapaneseRepositoryAdapterInput {
  readonly baseSeed: JapaneseSeedPackage; readonly sourceRegistry: JapaneseSourceRegistry;
  readonly c1Lexicon?: JapaneseSeedPackage; readonly c1Language?: JapaneseSeedPackage;
  readonly c1Course?: JapaneseSeedPackage; readonly repositoryRevision?: string;
  readonly assembledVersion?: string;
}
export interface JapaneseLegacyStudyEvent {
  readonly id: string; readonly userId: string; readonly deviceId: string;
  readonly occurredAt: string; readonly receivedAt?: string;
  readonly activity: StudyEvent["activity"]; readonly primaryTarget?: JapaneseEntityRef;
  readonly secondaryTargets?: readonly JapaneseEntityRef[]; readonly skillDimension?: string;
  readonly promptFamily?: string; readonly responseMode?: string;
  readonly result?: StudyEvent["result"]; readonly responseTimeMs?: number;
  readonly hintsUsed?: number; readonly attempts?: number; readonly confidence?: number;
  readonly contextId?: string; readonly sourceId?: string; readonly schedulerVersion?: string;
  readonly contentVersion?: string; readonly learnerModelVersion?: string;
  readonly baseRevision?: number; readonly metadata?: Readonly<Record<string, unknown>>;
}
export interface JapaneseLegacyMemoryTrace {
  readonly id: string; readonly userId: string; readonly entity: JapaneseEntityRef;
  readonly skillDimension: string; readonly cueFamily: string;
  readonly schedulerFamily: string; readonly schedulerVersion: string;
  readonly revision: number; readonly card: FsrsCardSnapshot;
}
