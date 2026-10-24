import type {LessonBundleV1,LessonExampleV1,LessonSourceV1,ExerciseV1} from "../../../packages/content-schema/src/lesson-v1.js";
import {validateLessonBundleV1} from "../../../packages/content-schema/src/lesson-v1.ts";
import ownership from "../../../contracts/phase01-source-ownership.json" with {type:"json"};
import evidence from "../../../contracts/phase16-source-evidence.json" with {type:"json"};

export interface PinnedSourceQuote {
  readonly lessonId:string;
  readonly sourceId:string;
  readonly quote:string;
}
export interface FrenchExpansionV1 {
  readonly grammarHeading:string;
  readonly grammarExplanation:string;
  readonly contrastCue:string;
  readonly cloze:{
    readonly instruction:string;readonly quote:string;readonly before:string;
    readonly answer:string;readonly after:string;readonly sourceId:string;
  };
  readonly situationalChoice:{readonly question:string;readonly correctQuote:string};
  readonly dialogueBrief:string;
}
export interface SourceAuthoredIntake {
  readonly id:string;
  readonly languageId:"fr"|"ja"|"zh";
  readonly title:string;
  readonly objective:string;
  readonly explanation:string;
  readonly transferSituation:string;
  readonly writingInstruction:string;
  readonly reflection:string;
  readonly writingChecks:readonly [string,string,string];
  readonly encounters:readonly [PinnedSourceQuote,PinnedSourceQuote,PinnedSourceQuote];
  readonly guidedQuestion:string;
  readonly guidedAnswer:string;
  readonly independentQuestion:string;
  readonly independentAnswer:string;
  readonly frenchExpansion?:FrenchExpansionV1;
  /** Same evidence-checked exercise forms, without a separate Japanese player or grader. */
  readonly japaneseExpansion?:FrenchExpansionV1;
}
const ref=(lessonId:string,sourceId:string,quote:string):PinnedSourceQuote=>({lessonId,sourceId,quote});
/** New authorial situations and tasks reference *existing* verified original encounters, not newly invented source text. */
export const PHASE22_AUTHORING:readonly SourceAuthoredIntake[]=[
 {
  id:"fr:phase22-name-versus-role",languageId:"fr",title:"Meeting someone: name or role?",
  objective:"Distinguish a polite evening greeting, a name introduction and a statement of professional identity.",
  explanation:"Bonsoir opens an evening encounter; je m’appelle identifies a name; je suis identifies a profession or role. These examples teach different functions, not a single interchangeable formula.",
  transferSituation:"At an evening orientation, a newcomer needs both your name and what you do. Later another attendee asks only about your role.",
  writingInstruction:"Write two short original French interactions for these different listeners. Distinguish the greeting, the self-introduction and the occupation, and explain your verb choice.",
  reflection:"What changes when you give a name instead of a profession?",
  writingChecks:["Choose the evening greeting for arrival, not farewell.","Use je m’appelle to introduce a name.","Use an attested form of être for a profession."],
  encounters:[
   ref("fr:a1-01:shared-pilot","fr-a1-01-original","Bonsoir, monsieur."),
   ref("fr:a1-01:shared-pilot","fr-a1-01-original","Je m’appelle Inès."),
   ref("fr:a1-02:shared-pilot","fr-a1-02-original","Je suis professeur.")
  ],
  guidedQuestion:"Which exact original line introduces a person's name?",
  guidedAnswer:"Je m’appelle Inès.",
  independentQuestion:"Which original line states an occupation rather than a name?",
  independentAnswer:"Je suis professeur."
 },
 {
  id:"ja:phase22-introduction-versus-help",languageId:"ja",title:"First meeting and asking for help",
  objective:"Distinguish first-contact goodwill from requesting assistance and thanking someone after receiving it.",
  explanation:"はじめまして belongs to a genuine first meeting. すみません attracts attention to request help. ありがとうございます expresses gratitude after help. The same polite tone does not make these expressions interchangeable.",
  transferSituation:"You meet a new study partner at a library, then ask a different person at the service counter for directions.",
  writingInstruction:"Write two separate short Japanese exchanges: an opening for the new partner and an assistance request followed by gratitude. Explain why the purposes differ.",
  reflection:"Which statement initiates a relationship, and which acknowledges help already received?",
  writingChecks:["Reserve はじめまして for a first encounter.","Use すみません to attract attention in the assistance exchange.","Place gratitude after help rather than using it as the opening request."],
  encounters:[
   ref("ja:cf-a1-01-03:shared-pilot","ja-cf-a1-01-03-original","はじめまして。"),
   ref("ja:cf-a1-01-02:shared-pilot","ja-cf-a1-01-02-original","すみません。"),
   ref("ja:cf-a1-01-02:shared-pilot","ja-cf-a1-01-02-original","ありがとうございます。")
  ],
  guidedQuestion:"Which original expression is reserved for meeting someone for the first time?",
  guidedAnswer:"はじめまして。",
  independentQuestion:"Which original expression expresses gratitude after receiving help?",
  independentAnswer:"ありがとうございます。"
 },
 {
  id:"zh:phase22-speaker-third-person",languageId:"zh",title:"Speaker, teacher and correction",
  objective:"Separate first-person identity from a third-person description and a negated identity claim using attested characters.",
  explanation:"我 marks the speaker in 我是学生。; 他 marks another person in 他是老师。. 不是 negates a noun-identity claim. This written practice does not establish spoken-tone accuracy or official HSK attainment.",
  transferSituation:"At registration, you describe your own role and identify a teacher across the room. Someone has also made a mistaken identity assumption.",
  writingInstruction:"Write two original Hanzi statements identifying yourself and another person, then explain in English how 不是 changes an identity statement. Do not invent vocabulary without marking it for review.",
  reflection:"Who speaks in the first statement, who is referred to in the second, and which part marks a correction?",
  writingChecks:["Keep the subject 我 distinct from 他.","Use source-supported noun identity patterns.","Explain 不是 as negation rather than addition or pronunciation evidence."],
  encounters:[
   ref("zh:wo:shared-pilot","zh-wo-demo","我是学生。"),
   ref("zh:shi:shared-pilot","zh-shi-demo","他是老师。"),
   ref("zh:shi:shared-pilot","zh-shi-demo","不是")
  ],
  guidedQuestion:"Which original sentence refers to the speaker as a student?",
  guidedAnswer:"我是学生。",
  independentQuestion:"Which source sentence identifies another person as the teacher?",
  independentAnswer:"他是老师。"
 }
] as const;

const sourceQuotes=evidence.originalSourceQuotes as Record<string,string[]>;
const sourceBaseline=new Map(ownership.sources.map(s=>[s.repo,s.mainSha]));
const alternateJapanesePilot="1e3667ebdcb0cd50491c126b948c11f47414decb";
const approvedPin=(src:LessonSourceV1)=>src.repository==="thiepn/japanese"
  ?src.revision===alternateJapanesePilot
  :src.revision===sourceBaseline.get(src.repository);
function sameSource(a:LessonSourceV1,b:LessonSourceV1):boolean {
 return ["id","repository","revision","path","originalEntityId","rights","redistributionVerified","editorialReview"]
   .every(key=>a[key as keyof LessonSourceV1]===b[key as keyof LessonSourceV1]);
}
function sameExample(a:LessonExampleV1,b:LessonExampleV1):boolean {
 return a.targetText===b.targetText&&a.meaning===b.meaning&&a.reading===b.reading;
}
export interface IntakeDiagnostic {readonly id:string;readonly issue:string}
export function compilePinnedSourceIntake(
 bundles:readonly LessonBundleV1[],specs:readonly SourceAuthoredIntake[]=PHASE22_AUTHORING
):{readonly candidates:readonly LessonBundleV1[];readonly issues:readonly IntakeDiagnostic[]}{
 const issues:IntakeDiagnostic[]=[];
 const candidates:LessonBundleV1[]=[];
 const usedLessonIds=new Set(bundles.map(b=>b.lesson.id));
 const usedExerciseIds=new Set(bundles.flatMap(b=>b.exercises.map(e=>e.id)));
 const seenSpecs=new Set<string>();
 for(const spec of specs){
  const fail=(issue:string)=>issues.push({id:spec.id,issue});
  if(seenSpecs.has(spec.id)||usedLessonIds.has(spec.id)) {fail("DUPLICATE_OR_EXISTING_LESSON");continue;}
  seenSpecs.add(spec.id);
  if(!["fr","ja","zh"].includes(spec.languageId)||spec.encounters.length!==3||
      [spec.objective,spec.explanation,spec.transferSituation,spec.writingInstruction,spec.reflection,...spec.writingChecks]
        .some(t=>typeof t!=="string"||t.trim().length<22)||
      spec.guidedAnswer===spec.independentAnswer||
      !spec.encounters.some(x=>x.quote===spec.guidedAnswer)||
      !spec.encounters.some(x=>x.quote===spec.independentAnswer)) {fail("INVALID_AUTHORING_TASK");continue;}
  const examples:LessonExampleV1[]=[];
  const provenance:LessonSourceV1[]=[];
  const exerciseRefs:Record<string,string>={};
  let failed=false;
  for(const entry of spec.encounters){
   const original=bundles.find(b=>b.lesson.id===entry.lessonId);
   const source=original?.lesson.sources.find(s=>s.id===entry.sourceId);
   const example=original?.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[])
     .find(e=>e.targetText===entry.quote);
   if(!original||!source||!example||original.lesson.languageId!==spec.languageId||
       original.lesson.publication!=="internal-fixture"||source.editorialReview!=="pending"||
       source.redistributionVerified||!approvedPin(source)||
       !sourceQuotes[entry.sourceId]?.includes(entry.quote)){
    fail("SOURCE_QUOTE_RIGHTS_OR_REVISION_DRIFT");failed=true;break;
   }
   const duplicate=provenance.find(s=>s.id===source.id);
   if(duplicate&&!sameSource(duplicate,source)){fail("CONFLICTING_SOURCE_RECORD");failed=true;break;}
   if(!duplicate)provenance.push({...source});
   examples.push({...example});
   exerciseRefs[entry.quote]=entry.sourceId;
  }
  if(failed)continue;
  const originals=Object.values(exerciseRefs);
  const sources=Array.from(new Set(originals));
  if(new Set(examples.map(x=>x.targetText)).size!==3||sources.length<(spec.frenchExpansion||spec.japaneseExpansion?1:2)){
   fail("NO_DISTINCT_SOURCE_CONTEXTS");continue;
  }
  const french=spec.frenchExpansion;
  const japanese=spec.japaneseExpansion;
  const expansion=french??japanese;
  if(expansion){
   const cloze=expansion.cloze;
   const situ=expansion.situationalChoice;
   if((french&&spec.languageId!=="fr")||(japanese&&spec.languageId!=="ja")||
      (french!==undefined&&japanese!==undefined)||
      [expansion.grammarHeading,expansion.grammarExplanation,expansion.contrastCue,expansion.dialogueBrief,
       cloze.instruction,situ.question].some(t=>typeof t!=="string"||t.trim().length<20)||
      !cloze.before?.trim()||!cloze.after?.trim()||!cloze.answer?.trim()||
      cloze.before+cloze.answer+cloze.after!==cloze.quote||
      !examples.some(e=>e.targetText===cloze.quote)||
      exerciseRefs[cloze.quote]!==cloze.sourceId||
      !examples.some(e=>e.targetText===situ.correctQuote)){
    fail(japanese?"INVALID_JAPANESE_SOURCE_EXERCISES":"INVALID_FRENCH_SOURCE_EXERCISES");continue;
   }
  }
  const original=bundles.find(b=>b.lesson.id===spec.encounters[0].lessonId)!;
  if(original.plugin.languageId!==spec.languageId){fail("PLUGIN_LANGUAGE_DRIFT");continue;}
  const suffix=["guided-choice","independent-reading","independent-writing",
    ...(expansion?["guided-cloze","independent-situation"]:[])] as const;
  const guidedId=spec.id+":guided-choice";
  const readingId=spec.id+":independent-reading";
  const writingId=spec.id+":independent-writing";
  if(suffix.some(part=>usedExerciseIds.has(spec.id+":"+part))) {fail("EXERCISE_ID_COLLISION");continue;}
  const eBase=(id:string,purpose:"guided"|"independent",instruction:string,sourceIds:string[],classification:"formative-recognition"|"ungraded-production",skillDimension:"comprehension"|"writing")=>({
   id,languageId:spec.languageId,purpose,instruction,
   primaryTarget:{languageId:spec.languageId,kind:"curriculum_unit" as const,id:sourceIds[0]!},
   skillDimension,sourceIds,evidence:{classification,independent:purpose==="independent",
    mayScheduleReview:false as const,mayAssertProficiency:false as const}
  });
  const allQuotes=examples.map(e=>e.targetText);
  const guided:ExerciseV1={...eBase(guidedId,"guided",spec.guidedQuestion,[exerciseRefs[spec.guidedAnswer]!],"formative-recognition","comprehension"),
   kind:"choice",options:allQuotes,acceptedAnswers:[spec.guidedAnswer],normalization:"literal",grading:"exact",
   explanation:"Compare the distinct meanings and purposes of the original encountered expressions.",
   ...(expansion?{sourceComparison:{first:examples[0]!,second:examples[1]!,cue:expansion.contrastCue}}:{})};
  const reading:ExerciseV1={...eBase(readingId,"independent",spec.independentQuestion,[exerciseRefs[spec.independentAnswer]!],"formative-recognition","comprehension"),
   kind:"reading",passage:expansion?"Original source excerpts:\n"+allQuotes.join("\n"):allQuotes.join("\n"),question:spec.independentQuestion,options:allQuotes,
   acceptedAnswers:[spec.independentAnswer],normalization:"literal",grading:"exact",
   explanation:"Select only the original expression matching the requested communicative situation."};
  const writing:ExerciseV1={...eBase(writingId,"independent",expansion?spec.writingInstruction+" "+expansion.dialogueBrief:spec.writingInstruction,sources,"ungraded-production","writing"),
   kind:"free-production",grading:"ungraded",explanation:"No automatic grammar, speaking or proficiency grade is assigned.",
   rubric:[...spec.writingChecks]};
  const extraGuided:ExerciseV1[]=expansion?[{
    ...eBase(spec.id+":guided-cloze","guided",expansion.cloze.instruction,[expansion.cloze.sourceId],
      "formative-recognition","comprehension"),
    kind:"cloze",before:expansion.cloze.before,after:expansion.cloze.after,
    acceptedAnswers:[expansion.cloze.answer],normalization:japanese?"japanese-terminal-punctuation":"french-apostrophe",
    grading:"exact",
    explanation:"Restore the attested original expression in this context.",
    sourceAid:{targetText:expansion.cloze.quote,
      meaning:examples.find(e=>e.targetText===expansion.cloze.quote)!.meaning,
      cue:expansion.contrastCue}
  }]:[];
  const extraIndependent:ExerciseV1[]=expansion?[{
    ...eBase(spec.id+":independent-situation","independent",expansion.situationalChoice.question,
      [exerciseRefs[expansion.situationalChoice.correctQuote]!],"formative-recognition","comprehension"),
    kind:"choice",options:allQuotes,acceptedAnswers:[expansion.situationalChoice.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Choose the attested original expression appropriate to the changed context."
  }]:[];
  const candidate:LessonBundleV1={
   lesson:{schemaVersion:1,id:spec.id,languageId:spec.languageId,contentVersion:french?"phase23-french-source-authored-internal-v1":japanese?"phase24-japanese-source-authored-internal-v1":"phase22-source-authored-internal-v1",
    title:spec.title,objective:{statement:spec.objective,skillDimension:"comprehension"},
    prerequisiteLessonIds:[...new Set(spec.encounters.map(x=>x.lessonId))],publication:"internal-fixture",
    sourceIds:sources,sources:provenance,steps:[
     {id:spec.id+":encounter",type:"encounter",examples},
     {id:spec.id+":explanation",type:"explain",heading:"Use the source in context",explanation:spec.explanation,conceptIds:[]},
      ...(expansion?[{id:spec.id+":situation",type:"explain" as const,heading:"Practice the new situation",
        explanation:spec.transferSituation,conceptIds:[]}]:[]),
      ...(expansion?[{id:spec.id+":grammar",type:"explain" as const,heading:expansion.grammarHeading,
        explanation:expansion.grammarExplanation,conceptIds:[]}]:[]),
     {id:spec.id+":guided",type:"guided",exerciseIds:[guidedId,...extraGuided.map(e=>e.id)]},
     {id:spec.id+":independent",type:"independent",exerciseIds:[readingId,...extraIndependent.map(e=>e.id),writingId]},
     {id:spec.id+":reflection",type:"reflect",feedback:spec.reflection}
    ]},
   plugin:original.plugin,exercises:[guided,...extraGuided,reading,...extraIndependent,writing]
  };
  const validation=validateLessonBundleV1(candidate);
  if(validation.length){fail("LESSON_SCHEMA_INVALID:"+validation[0]?.code);continue;}
  // The candidate's text comes only from the admitted source encounters; authoring
  // content remains unreviewed and cannot be treated as an original source quote.
  if(!candidate.lesson.steps[0]||candidate.lesson.steps[0].type!=="encounter"||
     candidate.lesson.steps[0].examples.some(ex=>!bundles.some(b=>b.lesson.steps.some(st=>
       st.type==="encounter"&&st.examples.some(origin=>sameExample(origin,ex)))))){
   fail("AUTHORING_SOURCE_NOT_ENCOUNTERED");continue;
  }
  if(!candidate.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false)) {
   fail("ILLEGAL_LEARNER_AUTHORITY");continue;
  }
  candidates.push(candidate);
  usedLessonIds.add(spec.id);
  for(const s of suffix)usedExerciseIds.add(spec.id+":"+s);
 }
 return {candidates,issues};
}
