/**
 * Phase 02: one language-neutral lesson/exercise/plugin contract.
 * This module is deliberately pure: it does not import native app schedulers,
 * access storage, write StudyEvents, call Account/Core or publish content.
 * Japanese StudyPrompt/StudyLesson are source design references, not runtime dependencies.
 */
import type { EntityRef, SkillDimension } from "../../domain/src/index.js";
import type { ProvenancedContent } from "./index.js";

export type LessonStageV1 = "encounter" | "explain" | "guided" | "independent" | "reflect";
export type ExercisePurposeV1 = "guided" | "independent";
export type AnswerNormalizationV1 = "literal" | "unicode-nfc" | "trim-whitespace";
export type EvidenceClassificationV1 = "formative-recognition" | "formative-recall" | "ungraded-production";
export type LessonPublicationV1 = "internal-fixture" | "candidate" | "public";

export interface LessonSourceV1 {
  readonly id: string;
  readonly repository: string;
  readonly revision: string;
  readonly path: string;
  readonly originalEntityId: string;
  readonly rights: "original-owned" | "review-required";
  readonly redistributionVerified: boolean;
  readonly editorialReview: "pending" | "approved";
}

export interface LessonObjectiveV1 {
  readonly statement: string;
  readonly skillDimension: SkillDimension;
  readonly canDoId?: string;
}

export interface LessonExampleV1 {
  readonly targetText: string;
  readonly meaning: string;
  readonly reading?: string;
}

export interface LessonStepBaseV1 {
  readonly id: string;
  readonly type: LessonStageV1;
}
export interface EncounterStepV1 extends LessonStepBaseV1 {
  readonly type: "encounter";
  readonly examples: readonly LessonExampleV1[];
}
export interface ExplainStepV1 extends LessonStepBaseV1 {
  readonly type: "explain";
  readonly explanation: string;
  readonly conceptIds: readonly string[];
}
export interface ExerciseStepV1 extends LessonStepBaseV1 {
  readonly type: "guided" | "independent";
  readonly exerciseIds: readonly string[];
}
export interface ReflectStepV1 extends LessonStepBaseV1 {
  readonly type: "reflect";
  readonly feedback: string;
}
export type LessonStepV1 = EncounterStepV1 | ExplainStepV1 | ExerciseStepV1 | ReflectStepV1;

export interface LessonV1 extends ProvenancedContent {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly languageId: string;
  readonly contentVersion: string;
  readonly title: string;
  readonly level?: string;
  readonly objective: LessonObjectiveV1;
  readonly prerequisiteLessonIds: readonly string[];
  readonly publication: LessonPublicationV1;
  readonly sources: readonly LessonSourceV1[];
  readonly steps: readonly LessonStepV1[];
}

export interface ExerciseEvidenceV1 {
  /** A formative response is not a scheduler grade or accredited proficiency. */
  readonly classification: EvidenceClassificationV1;
  readonly independent: boolean;
  readonly mayScheduleReview: false;
  readonly mayAssertProficiency: false;
}

export interface ExerciseBaseV1 extends ProvenancedContent {
  readonly id: string;
  readonly languageId: string;
  readonly purpose: ExercisePurposeV1;
  readonly instruction: string;
  readonly primaryTarget: EntityRef;
  readonly skillDimension: SkillDimension;
  readonly evidence: ExerciseEvidenceV1;
  readonly explanation: string;
}

export interface ChoiceExerciseV1 extends ExerciseBaseV1 {
  readonly kind: "choice";
  readonly options: readonly string[];
  readonly acceptedAnswers: readonly string[];
  readonly normalization: "literal";
  readonly grading: "exact";
}
export interface TypedExerciseV1 extends ExerciseBaseV1 {
  readonly kind: "typed";
  readonly acceptedAnswers: readonly string[];
  readonly normalization: AnswerNormalizationV1;
  readonly grading: "exact";
}
export interface ProductionExerciseV1 extends ExerciseBaseV1 {
  readonly kind: "free-production";
  readonly grading: "ungraded";
  readonly rubric: readonly string[];
}
export type ExerciseV1 = ChoiceExerciseV1 | TypedExerciseV1 | ProductionExerciseV1;

export interface LanguagePluginV1 {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly languageId: string;
  readonly writingSystems: readonly string[];
  readonly capabilities: readonly (
    "latin-orthography" | "morphology" | "kana" | "kanji" | "furigana" |
    "hanzi" | "pinyin" | "lexical-tones" | "contextual-reading"
  )[];
  readonly answerNormalizations: readonly AnswerNormalizationV1[];
  readonly recordedAudio: "none" | "source-verified";
  readonly speechSynthesis: "disabled" | "device-optional";
  /** Phase 02 declares capabilities; it never manufactures language proficiency results. */
  readonly nativeAssessmentAuthority: false;
}
export interface LessonBundleV1 {
  readonly lesson: LessonV1;
  readonly exercises: readonly ExerciseV1[];
  readonly plugin: LanguagePluginV1;
}
export interface LessonContractIssueV1 {
  readonly code: string;
  readonly path: string;
  readonly message: string;
}
const hasText=(s:unknown):s is string=>typeof s==="string"&&s.trim().length>0;
const unique=(xs:readonly string[])=>new Set(xs).size===xs.length;
const SHA=/^[0-9a-f]{40}$/;
const STAGES:readonly LessonStageV1[]=["encounter","explain","guided","independent","reflect"];
const ALLOWED_NORMALIZATIONS:readonly AnswerNormalizationV1[]=["literal","unicode-nfc","trim-whitespace"];
const CAPABILITIES:readonly LanguagePluginV1["capabilities"][number][]=[
 "latin-orthography","morphology","kana","kanji","furigana",
 "hanzi","pinyin","lexical-tones","contextual-reading"
];

/** Fail-closed structural validation, not a linguistic review or release certificate. */
export function validateLessonBundleV1(bundle:LessonBundleV1):readonly LessonContractIssueV1[]{
 const {lesson,exercises,plugin}=bundle;
 const issues:LessonContractIssueV1[]=[];
 const add=(code:string,path:string,message:string)=>issues.push({code,path,message});
 if(lesson.schemaVersion!==1||plugin.schemaVersion!==1)add("schema","schemaVersion","Unsupported contract version");
 if(!hasText(lesson.id)||!hasText(lesson.contentVersion)||!hasText(lesson.title))add("identity","lesson","Missing stable lesson identity, title or content version");
 if(!hasText(lesson.objective?.statement)||!hasText(lesson.objective?.skillDimension))add("objective","lesson.objective","Missing meaningful objective and dimension");
 if(!hasText(plugin.id)||!hasText(lesson.languageId)||plugin.languageId!==lesson.languageId)add("language","plugin.languageId","Plugin and lesson languages disagree");
 if(!Array.isArray(plugin.writingSystems)||!plugin.writingSystems.length||
   plugin.writingSystems.some(s=>!hasText(s))||!unique(plugin.writingSystems))add("plugin-writing-systems","plugin.writingSystems","Missing or repeated writing systems");
 if(!Array.isArray(plugin.capabilities)||!unique(plugin.capabilities)||plugin.capabilities.some(c=>!CAPABILITIES.includes(c)))add("plugin-capabilities","plugin.capabilities","Unknown or duplicated capability");
 if(!Array.isArray(plugin.answerNormalizations)||!plugin.answerNormalizations.includes("literal")||
   !unique(plugin.answerNormalizations)||plugin.answerNormalizations.some(m=>!ALLOWED_NORMALIZATIONS.includes(m)))add("plugin-normalization","plugin.answerNormalizations","At least literal normalization is required");
 if(!["none","source-verified"].includes(plugin.recordedAudio)||
   !["disabled","device-optional"].includes(plugin.speechSynthesis)||plugin.nativeAssessmentAuthority!==false)add("plugin-evidence","plugin","Unsupported media or assessment claims");
 if(!["internal-fixture","candidate","public"].includes(lesson.publication))add("publication","lesson.publication","Unknown publication state");
 if(!Array.isArray(lesson.prerequisiteLessonIds)||!unique(lesson.prerequisiteLessonIds)||
   lesson.prerequisiteLessonIds.some(x=>!hasText(x)||x===lesson.id))add("prerequisites","lesson.prerequisiteLessonIds","Invalid lesson prerequisites");
 if(!Array.isArray(lesson.sources)||!lesson.sources.length||!Array.isArray(lesson.sourceIds)||
   !lesson.sourceIds.length||!unique(lesson.sourceIds))add("provenance","lesson.sources","No unique provenance sources");
 const sourceIds=new Set(lesson.sources.map(s=>s.id));
 if(!lesson.sourceIds.every(id=>sourceIds.has(id))||lesson.sources.length!==sourceIds.size||
   lesson.sources.some(s=>!lesson.sourceIds.includes(s.id)))add("source-link","lesson.sourceIds","Source identifiers disagree");
 for(const [i,s] of lesson.sources.entries()){
  if(!hasText(s.id)||!/^thiepn\/(?:french|japanese|chinese)$/.test(s.repository)||
     !SHA.test(s.revision)||!hasText(s.path)||s.path.startsWith("/")||s.path.split("/").includes("..")||
     !hasText(s.originalEntityId)||!["original-owned","review-required"].includes(s.rights)||
     !["pending","approved"].includes(s.editorialReview)||
     typeof s.redistributionVerified!=="boolean")add("source-record",`lesson.sources[${i}]`,"Invalid or unverified source provenance structure");
  if(lesson.publication==="public"&&
    (!s.redistributionVerified||s.editorialReview!=="approved"||s.rights!=="original-owned"))
    add("public-rights",`lesson.sources[${i}]`,"Public publication requires independently verified rights and editorial approval");
 }
 if(!Array.isArray(exercises)||!exercises.length||!unique(exercises.map(e=>e.id)))add("exercise-identity","exercises","No exercises or duplicate IDs");
 const exerciseById=new Map(exercises.map(e=>[e.id,e]));
 const used=new Set<string>();
 let lastStage=-1;
 let independentCount=0, guidedCount=0;
 if(!Array.isArray(lesson.steps)||!lesson.steps.length||!unique(lesson.steps.map(s=>s.id)))add("steps","lesson.steps","Steps are missing or IDs are repeated");
 for(const [i,step] of (lesson.steps||[]).entries()){
  const path=`lesson.steps[${i}]`;
  const order=STAGES.indexOf(step.type);
  if(!hasText(step.id)||order<0||order<lastStage)add("step-order",path,"Steps must be uniquely ordered encounter → explain → guided → independent → reflect");
  lastStage=order;
  if(step.type==="encounter"&&(!step.examples.length||step.examples.some(x=>!hasText(x.targetText)||!hasText(x.meaning))))
   add("encounter",path,"Missing readable, translated authentic source examples");
  if(step.type==="explain"&&(!hasText(step.explanation)||!Array.isArray(step.conceptIds)))
   add("explanation",path,"Missing explicit instruction or concept list");
  if(step.type==="guided"||step.type==="independent"){
   if(step.type==="guided")guidedCount++;else independentCount++;
   if(!Array.isArray(step.exerciseIds)||!step.exerciseIds.length)add("empty-practice",path,"Exercise step has no linked activities");
   for(const id of Array.isArray(step.exerciseIds)?step.exerciseIds:[]){
    const ex=exerciseById.get(id);
    if(!ex)add("missing-exercise",path,"Missing linked exercise "+id);
    else if(used.has(id))add("duplicate-exercise-use",path,"Exercise reused in the same lesson "+id);
    else used.add(id);
    if(ex&&ex.purpose!==step.type)add("purpose-mismatch",path,"Exercise does not match stage "+id);
   }
  }
  if(step.type==="reflect"&&!hasText(step.feedback))add("reflection",path,"No reflection content");
 }
 const stages=new Set((lesson.steps||[]).map(s=>s.type));
 for(const required of ["encounter","explain","guided","independent"]){
  if(!stages.has(required as LessonStageV1))add("missing-stage","lesson.steps","Missing educational stage "+required);
 }
 if(!guidedCount||!independentCount)add("practice-balance","lesson.steps","Guided and independent work are both required");
 for(const ex of exercises){
  const path="exercises."+ex.id;
  if(!hasText(ex.id)||!used.has(ex.id))add("orphan-exercise",path,"Exercise has no unique lesson step");
  if(ex.languageId!==lesson.languageId||ex.primaryTarget?.languageId!==lesson.languageId||
     !hasText(ex.primaryTarget?.id)||!hasText(ex.primaryTarget?.kind)||
     !hasText(ex.skillDimension))add("target-language",path,"Invalid or foreign-language target");
  if(!hasText(ex.instruction)||!hasText(ex.explanation)||!Array.isArray(ex.sourceIds)||
      !ex.sourceIds.length||!ex.sourceIds.every(id=>sourceIds.has(id)))
      add("exercise-provenance",path,"Missing instructions, feedback or source provenance");
  const ev=ex.evidence;
  if(!ev||ev.mayScheduleReview!==false||ev.mayAssertProficiency!==false||
     ev.independent!==(ex.purpose==="independent")||
     !["formative-recognition","formative-recall","ungraded-production"].includes(ev.classification))
     add("evidence-policy",path,"Unverified learning evidence or authority escalation");
  if(ex.kind==="choice"||ex.kind==="typed"){
   if(ex.grading!=="exact"||!Array.isArray(ex.acceptedAnswers)||!ex.acceptedAnswers.length||
      !unique(ex.acceptedAnswers)||ex.acceptedAnswers.some(a=>!hasText(a))||
      ev?.classification==="ungraded-production")add("answer-key",path,"Invalid deterministic grading definition");
   if(ex.kind==="choice"&&(!Array.isArray(ex.options)||ex.options.length<2||
      !unique(ex.options)||!ex.acceptedAnswers.every(a=>ex.options.includes(a))||ex.normalization!=="literal"))
      add("choice-options",path,"Ambiguous or missing choice key");
   if(ex.kind==="typed"&&!plugin.answerNormalizations.includes(ex.normalization))
      add("unsupported-normalizer",path,"Language plugin does not declare normalization "+ex.normalization);
  }else if(ex.kind==="free-production"){
   if(ex.grading!=="ungraded"||ev?.classification!=="ungraded-production"||
       !Array.isArray(ex.rubric)||!ex.rubric.length||ex.rubric.some(x=>!hasText(x)))
     add("production-grading",path,"Free production must remain ungraded with a useful rubric");
  }else add("exercise-kind",path,"Unknown exercise kind");
 }
 return issues;
}
