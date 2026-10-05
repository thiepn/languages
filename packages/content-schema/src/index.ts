export interface ProvenancedContent {
  readonly sourceIds: readonly string[];
}

export interface LicensePolicy {
  readonly canStore: boolean;
  readonly canTransform: boolean;
  readonly canRedistributeRaw: boolean;
  readonly canRedistributeDerived: boolean;
  readonly canUseCommercially: boolean | null;
  readonly requiresAttribution: boolean;
  readonly requiresShareAlike: boolean;
  readonly privateOnly: boolean;
  readonly verifiedAt?: string;
}

export interface SourceRecord {
  readonly id: string;
  readonly title: string;
  readonly roles: readonly string[];
  readonly version?: string;
  readonly licenseName?: string;
  readonly canonicalUrl?: string;
  readonly attribution?: string;
  readonly policy: LicensePolicy;
}

export interface OrthographicForm {
  readonly text: string;
  readonly script?: string;
  readonly status?: string;
}

export interface Lexeme<TLanguageData = unknown> extends ProvenancedContent {
  readonly id: string;
  readonly canonicalForm: string;
  readonly forms: readonly OrthographicForm[];
  readonly senseIds: readonly string[];
  readonly level?: string;
  readonly tags?: readonly string[];
  readonly priority?: number;
  readonly languageData?: TLanguageData;
}

export interface Sense extends ProvenancedContent {
  readonly id: string;
  readonly lexemeId: string;
  readonly glosses: readonly string[];
  readonly partOfSpeech?: readonly string[];
}

export interface GrammarConcept<TLanguageData = unknown> extends ProvenancedContent {
  readonly id: string;
  readonly label: string;
  readonly summary: string;
  readonly prerequisiteIds: readonly string[];
  readonly contrastIds: readonly string[];
  readonly level?: string;
  readonly register?: string;
  readonly tags?: readonly string[];
  readonly languageData?: TLanguageData;
}

export interface SentenceToken {
  readonly surface: string;
  readonly reading?: string;
  readonly entityId?: string;
  readonly grammarRole?: string;
}

export interface Sentence<TLanguageData = unknown> extends ProvenancedContent {
  readonly id: string;
  readonly text: string;
  readonly normalizedText: string;
  readonly translation?: string;
  readonly level?: string;
  readonly register?: string;
  readonly grammarIds: readonly string[];
  readonly lexemeIds: readonly string[];
  readonly tokens?: readonly SentenceToken[];
  readonly tags?: readonly string[];
  readonly languageData?: TLanguageData;
}

export interface LexicalChunk<TLanguageData = unknown> extends ProvenancedContent {
  readonly id: string;
  readonly expression: string;
  readonly meaning: string;
  readonly level?: string;
  readonly register?: string;
  readonly lexemeIds: readonly string[];
  readonly grammarIds: readonly string[];
  readonly exampleSentenceIds: readonly string[];
  readonly languageData?: TLanguageData;
}

export interface WritingUnit<TLanguageData = unknown> extends ProvenancedContent {
  readonly id: string;
  readonly surface: string;
  readonly system: string;
  readonly level?: string;
  readonly meanings?: readonly string[];
  readonly readings?: readonly string[];
  readonly languageData?: TLanguageData;
}

export type LanguageActivity =
  | "listening"
  | "reading"
  | "spoken_interaction"
  | "spoken_production"
  | "writing"
  | "mediation";

export interface CanDoDescriptor extends ProvenancedContent {
  readonly id: string;
  readonly statement: string;
  readonly frameworkId: string;
  readonly level: string;
  readonly languageActivity: LanguageActivity;
  readonly prerequisiteIds: readonly string[];
}

export interface CurriculumUnit extends ProvenancedContent {
  readonly id: string;
  readonly title: string;
  readonly order: number;
  readonly level?: string;
  readonly canDoIds: readonly string[];
  readonly prerequisiteUnitIds: readonly string[];
  readonly grammarIds: readonly string[];
  readonly sentenceIds: readonly string[];
  readonly vocabularyIds: readonly string[];
  readonly writingUnitIds?: readonly string[];
}

export interface AudioAsset extends ProvenancedContent {
  readonly id: string;
  readonly languageTag: string;
  readonly text: string;
  readonly url: string;
  readonly format: "ogg" | "mp3" | "wav" | "m4a";
  readonly credit: string;
  readonly licenseName?: string;
  readonly attributionUrl?: string;
  readonly nativeSpeaker?: boolean;
  readonly register?: string;
  readonly speechRate?: "slow" | "natural" | "fast";
}

export interface LanguageContentPackage<TLexemeData = unknown, TGrammarData = unknown, TSentenceData = unknown, TWritingData = unknown> {
  readonly schemaVersion: number;
  readonly version: string;
  readonly languageId: string;
  readonly sourceIds: readonly string[];
  readonly lexemes: readonly Lexeme<TLexemeData>[];
  readonly senses: readonly Sense[];
  readonly grammar: readonly GrammarConcept<TGrammarData>[];
  readonly sentences: readonly Sentence<TSentenceData>[];
  readonly lexicalChunks: readonly LexicalChunk[];
  readonly writingUnits: readonly WritingUnit<TWritingData>[];
  readonly canDos: readonly CanDoDescriptor[];
  readonly curriculumUnits: readonly CurriculumUnit[];
  readonly audioAssets: readonly AudioAsset[];
}
