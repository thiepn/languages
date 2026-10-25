import type {LessonBundleV1,LessonExampleV1,LessonSourceV1,ExerciseV1} from "../../../packages/content-schema/src/lesson-v1.js";
import {validateLessonBundleV1} from "../../../packages/content-schema/src/lesson-v1.ts";
import {admitInternalPilot} from "./source-coverage.ts";
import ownership from "../../../contracts/phase01-source-ownership.json" with {type:"json"};
import evidence from "../../../contracts/phase16-source-evidence.json" with {type:"json"};
import chineseReadings from "../../../contracts/phase25-chinese-readings.json" with {type:"json"};

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
export interface ChineseExpansionV1 extends FrenchExpansionV1 {
  /** Original source-owned written reading, not TTS, speaking score, or HSK status. */
  readonly tone:{readonly question:string;readonly quote:string;readonly reading:string;readonly sourceId:string};
  readonly toneCue:string;
}
export interface ChineseDepthV1 {
  readonly guidedRepair:{
    readonly question:string;readonly correctQuote:string;readonly wrongQuote:string;readonly feedback:string;
  };
  readonly readingRepair:{
    readonly context:string;readonly question:string;readonly correctQuote:string;
    readonly wrongQuote:string;readonly feedback:string;
  };
  readonly writingTransfer:{
    readonly instruction:string;readonly criteria:readonly [string,string,string];
  };
}
export interface ChineseReconstructionV1 {
  readonly reconstruct:{
    readonly instruction:string;readonly quote:string;readonly sourceId:string;
    readonly wrongQuote:string;readonly feedback:string;
  };
  readonly changedContext:{
    readonly context:string;readonly question:string;readonly correctQuote:string;
    readonly wrongQuote:string;readonly feedback:string;
  };
  readonly independentDialogue:{
    readonly instruction:string;readonly criteria:readonly [string,string,string];
  };
}
export interface ChineseSequenceV1 {
  /** A newly authored practical context, never a claim of a source conversation. */
  readonly order:{
    readonly instruction:string;
    readonly tokens:readonly [string,string,string];
    readonly expected:readonly [string,string,string];
    readonly misconception:readonly [string,string,string];
    readonly feedback:string;
  };
  readonly shiftedReading:{
    readonly context:string;readonly question:string;
    readonly correctQuote:string;readonly wrongQuote:string;readonly feedback:string;
  };
  readonly independentDialogue:{
    readonly instruction:string;readonly criteria:readonly [string,string,string];
  };
}
export interface ChineseConversationV1 {
  /** All answers and distractors are original encountered expressions. */
  readonly repair:{
    readonly question:string;readonly correctQuote:string;
    readonly firstWrong:string;readonly firstFeedback:string;
    readonly secondWrong:string;readonly secondFeedback:string;
  };
  /** The earlier sequence is now the wrong answer for a changed situation. */
  readonly reversedSequence:{
    readonly instruction:string;readonly expected:readonly [string,string,string];
    readonly feedback:string;
  };
  readonly finalReading:{
    readonly context:string;readonly question:string;
    readonly correctQuote:string;readonly wrongQuote:string;readonly feedback:string;
  };
  readonly independentDialogue:{
    readonly instruction:string;readonly criteria:readonly [string,string,string];
  };
}
export interface ChinesePerspectiveV1 {
  readonly changedListener:{
    readonly question:string;readonly correctQuote:string;
    readonly wrongQuote:string;readonly feedback:string;
  };
  readonly laterReading:{
    readonly context:string;readonly question:string;
    readonly correctQuote:string;readonly wrongQuote:string;readonly feedback:string;
  };
  readonly secondPinyin:{
    readonly question:string;readonly quote:string;readonly sourceId:string;readonly reading:string;
    readonly cue:string;
  };
  readonly sixthDialogue:{
    readonly instruction:string;readonly criteria:readonly [string,string,string];
  };
}
export interface ChineseRevisionV1 {
  /** Source text is the three already-admitted Hanzi encounter examples only. */
  readonly revisedReading:{
    readonly context:string;readonly question:string;
    readonly correctQuote:string;readonly firstWrong:string;readonly firstFeedback:string;
    readonly secondWrong:string;readonly secondFeedback:string;
  };
  readonly sourceReconstruction:{
    readonly instruction:string;readonly correctQuote:string;readonly sourceId:string;
    readonly firstWrong:string;readonly firstFeedback:string;
    readonly secondWrong:string;readonly secondFeedback:string;
  };
  /** A third new situation requiring a different order from both earlier accepted orders. */
  readonly thirdSequence:{
    readonly instruction:string;readonly expected:readonly [string,string,string];
    readonly firstFeedback:string;readonly secondFeedback:string;
  };
  readonly independentRevision:{
    readonly instruction:string;readonly criteria:readonly [string,string,string];
  };
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
  readonly chineseExpansion?:ChineseExpansionV1;
  readonly chineseDepth?:ChineseDepthV1;
  readonly chineseReconstruction?:ChineseReconstructionV1;
  readonly chineseSequence?:ChineseSequenceV1;
  readonly chineseConversation?:ChineseConversationV1;
  readonly chinesePerspective?:ChinesePerspectiveV1;
  readonly chineseRevision?:ChineseRevisionV1;
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
 const admitted=new Map<string,boolean>();
 const isAdmitted=(bundle:LessonBundleV1):boolean=>{
  const key=bundle.lesson.id;
  const cached=admitted.get(key);
  if(cached!==undefined)return cached;
  try{admitInternalPilot(bundle);admitted.set(key,true);return true;}
  catch{admitted.set(key,false);return false;}
 };
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
       original.lesson.publication!=="internal-fixture"||!isAdmitted(original)||source.editorialReview!=="pending"||
       source.redistributionVerified||!approvedPin(source)||
       !sourceQuotes[entry.sourceId]?.includes(entry.quote)){
    fail("SOURCE_QUOTE_RIGHTS_OR_REVISION_DRIFT");failed=true;break;
   }
   if(spec.chineseExpansion){
    const verified=(chineseReadings.readings as Record<string,Record<string,string>>)[entry.sourceId]?.[entry.quote];
    if(!verified||example.reading!==verified||
       source.revision!==chineseReadings.sourceRevision||
       source.repository!==chineseReadings.sourceRepository||
       source.path!==chineseReadings.sourcePath){
     fail("UNVERIFIED_CHINESE_SOURCE_READING");failed=true;break;
    }
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
  if(new Set(examples.map(x=>x.targetText)).size!==3||sources.length<(spec.frenchExpansion||spec.japaneseExpansion||spec.chineseExpansion?1:2)){
   fail("NO_DISTINCT_SOURCE_CONTEXTS");continue;
  }
  const french=spec.frenchExpansion;
  const japanese=spec.japaneseExpansion;
  const chinese=spec.chineseExpansion;
  const expansion=french??japanese??chinese;
  if(expansion){
   const cloze=expansion.cloze;
   const situ=expansion.situationalChoice;
   if((french&&spec.languageId!=="fr")||(japanese&&spec.languageId!=="ja")||
      (chinese&&spec.languageId!=="zh")||
      Number(french!==undefined)+Number(japanese!==undefined)+Number(chinese!==undefined)!==1||
      [expansion.grammarHeading,expansion.grammarExplanation,expansion.contrastCue,expansion.dialogueBrief,
       cloze.instruction,situ.question].some(t=>typeof t!=="string"||t.trim().length<20)||
      (!cloze.before?.trim()&&!cloze.after?.trim())||(!chinese&&(!cloze.before?.trim()||!cloze.after?.trim()))||!cloze.answer?.trim()||
      cloze.before+cloze.answer+cloze.after!==cloze.quote||
      !examples.some(e=>e.targetText===cloze.quote)||
      exerciseRefs[cloze.quote]!==cloze.sourceId||
      !examples.some(e=>e.targetText===situ.correctQuote)){
    fail(chinese?"INVALID_CHINESE_SOURCE_EXERCISES":japanese?"INVALID_JAPANESE_SOURCE_EXERCISES":"INVALID_FRENCH_SOURCE_EXERCISES");continue;
   }
  }
  if(chinese){
   const tone=chinese.tone;
   const attested=examples.find(e=>e.targetText===tone.quote);
   if(!chinese.toneCue?.trim()||chinese.toneCue.length<24||
      !tone.question?.trim()||tone.question.length<24||
      !tone.reading?.trim()||!/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/iu.test(tone.reading)||
      !attested?.reading||attested.reading!==tone.reading||
      exerciseRefs[tone.quote]!==tone.sourceId||
      !examples.every(e=>e.reading?.trim())){
    fail("INVALID_CHINESE_TONE_SOURCE");continue;
   }
  }
  const depth=spec.chineseDepth;
  if(depth){
   const a=depth.guidedRepair,b=depth.readingRepair,c=depth.writingTransfer;
   const attested=(quote:string)=>examples.some(e=>e.targetText===quote);
   if(!chinese||spec.languageId!=="zh"||
      !attested(a.correctQuote)||!attested(a.wrongQuote)||
      !attested(b.correctQuote)||!attested(b.wrongQuote)||
      a.correctQuote===a.wrongQuote||b.correctQuote===b.wrongQuote||
      [a.question,a.feedback,b.context,b.question,b.feedback,c.instruction,...c.criteria]
        .some(t=>typeof t!=="string"||t.trim().length<36)||
      !Array.isArray(c.criteria)||c.criteria.length!==3){
    fail("INVALID_CHINESE_DEPTH_SOURCE");continue;
   }
  }
  const reconstruction=spec.chineseReconstruction;
  if(reconstruction){
   const a=reconstruction.reconstruct,b=reconstruction.changedContext,c=reconstruction.independentDialogue;
   const attested=(quote:string)=>examples.some(e=>e.targetText===quote);
   if(!chinese||!depth||spec.languageId!=="zh"||
      !attested(a.quote)||!attested(a.wrongQuote)||
      !attested(b.correctQuote)||!attested(b.wrongQuote)||
      a.quote===a.wrongQuote||b.correctQuote===b.wrongQuote||
      exerciseRefs[a.quote]!==a.sourceId||
      !Array.isArray(c.criteria)||c.criteria.length!==3||
      [a.instruction,a.feedback,b.context,b.question,b.feedback,c.instruction,...c.criteria]
        .some(t=>typeof t!=="string"||t.trim().length<36)){
    fail("INVALID_CHINESE_RECONSTRUCTION_SOURCE");continue;
   }
  }
  const sequence=spec.chineseSequence;
  if(sequence){
   const a=sequence.order,b=sequence.shiftedReading,c=sequence.independentDialogue;
   const recognized=(quote:string)=>examples.some(e=>e.targetText===quote);
   const permutes=(items:readonly string[])=>items.length===3&&
     new Set(items).size===3&&items.every(recognized);
   if(!chinese||!depth||!reconstruction||spec.languageId!=="zh"||
      !permutes(a.tokens)||!permutes(a.expected)||!permutes(a.misconception)||
      !a.expected.every(q=>a.tokens.includes(q))||
      !a.misconception.every(q=>a.tokens.includes(q))||
      a.expected.every((q,i)=>q===a.misconception[i])||
      !recognized(b.correctQuote)||!recognized(b.wrongQuote)||
      b.correctQuote===b.wrongQuote||
      !Array.isArray(c.criteria)||c.criteria.length!==3||
      [a.instruction,a.feedback,b.context,b.question,b.feedback,c.instruction,...c.criteria]
        .some(t=>typeof t!=="string"||t.trim().length<36)){
    fail("INVALID_CHINESE_SOURCE_SEQUENCE");continue;
   }
  }
  const conversation=spec.chineseConversation;
  if(conversation){
   const a=conversation.repair,b=conversation.reversedSequence,
     c=conversation.finalReading,d=conversation.independentDialogue;
   const recognized=(quote:string)=>examples.some(e=>e.targetText===quote);
   const expected=sequence?.order.expected;
   const tokens=sequence?.order.tokens;
   if(!chinese||!depth||!reconstruction||!sequence||spec.languageId!=="zh"||
      !recognized(a.correctQuote)||!recognized(a.firstWrong)||!recognized(a.secondWrong)||
      new Set([a.correctQuote,a.firstWrong,a.secondWrong]).size!==3||
      !Array.isArray(b.expected)||b.expected.length!==3||
      new Set(b.expected).size!==3||!b.expected.every(q=>recognized(q)&&tokens!.includes(q))||
      b.expected.every((q,i)=>q===expected![i])||
      !recognized(c.correctQuote)||!recognized(c.wrongQuote)||c.correctQuote===c.wrongQuote||
      !Array.isArray(d.criteria)||d.criteria.length!==3||
      [a.question,a.firstFeedback,a.secondFeedback,b.instruction,b.feedback,
       c.context,c.question,c.feedback,d.instruction,...d.criteria]
        .some(t=>typeof t!=="string"||t.trim().length<36)){
    fail("INVALID_CHINESE_CONVERSATION_SOURCE");continue;
   }
  }
  const perspective=spec.chinesePerspective;
  if(perspective){
   const a=perspective.changedListener,b=perspective.laterReading,
     c=perspective.secondPinyin,d=perspective.sixthDialogue;
   const recognized=(quote:string)=>examples.some(e=>e.targetText===quote);
   const attested=examples.find(e=>e.targetText===c.quote);
   if(!chinese||!depth||!reconstruction||!sequence||!conversation||spec.languageId!=="zh"||
      !recognized(a.correctQuote)||!recognized(a.wrongQuote)||a.correctQuote===a.wrongQuote||
      !recognized(b.correctQuote)||!recognized(b.wrongQuote)||b.correctQuote===b.wrongQuote||
      !attested?.reading||attested.reading!==c.reading||
      exerciseRefs[c.quote]!==c.sourceId||c.quote===chinese.tone.quote||
      !Array.isArray(d.criteria)||d.criteria.length!==3||
      [a.question,a.feedback,b.context,b.question,b.feedback,c.question,c.cue,
        d.instruction,...d.criteria].some(t=>typeof t!=="string"||t.trim().length<36)){
    fail("INVALID_CHINESE_PERSPECTIVE_SOURCE");continue;
   }
  }
  const revision=spec.chineseRevision;
  if(revision){
   const a=revision.revisedReading,b=revision.sourceReconstruction,
     c=revision.thirdSequence,d=revision.independentRevision;
   const recognized=(quote:string)=>examples.some(e=>e.targetText===quote);
   const tokens=sequence?.order.tokens;
   const firstOrder=sequence?.order.expected;
   const secondOrder=conversation?.reversedSequence.expected;
   const threeDifferent=(a:string,b:string,c:string)=>new Set([a,b,c]).size===3&&
      [a,b,c].every(recognized);
   if(!chinese||!depth||!reconstruction||!sequence||!conversation||!perspective||spec.languageId!=="zh"||
      !threeDifferent(a.correctQuote,a.firstWrong,a.secondWrong)||
      !threeDifferent(b.correctQuote,b.firstWrong,b.secondWrong)||
      exerciseRefs[b.correctQuote]!==b.sourceId||
      !Array.isArray(c.expected)||c.expected.length!==3||new Set(c.expected).size!==3||
      !c.expected.every(q=>recognized(q)&&tokens!.includes(q))||
      c.expected.every((q,i)=>q===firstOrder![i])||
      c.expected.every((q,i)=>q===secondOrder![i])||
      !Array.isArray(d.criteria)||d.criteria.length!==3||
      [a.context,a.question,a.firstFeedback,a.secondFeedback,
       b.instruction,b.firstFeedback,b.secondFeedback,
       c.instruction,c.firstFeedback,c.secondFeedback,d.instruction,...d.criteria]
         .some(t=>typeof t!=="string"||t.trim().length<36)){
    fail("INVALID_CHINESE_REVISION_SOURCE");continue;
   }
  }
  const original=bundles.find(b=>b.lesson.id===spec.encounters[0].lessonId)!;
  if(original.plugin.languageId!==spec.languageId){fail("PLUGIN_LANGUAGE_DRIFT");continue;}
  const suffix=["guided-choice","independent-reading","independent-writing",
    ...(expansion?["guided-cloze","independent-situation"]:[]),...(chinese?["independent-tone"]:[]),
    ...(depth?["guided-repair","independent-context-reading","independent-rewrite"]:[]),
    ...(reconstruction?["guided-reconstruct","independent-role-switch","independent-new-dialogue"]:[]),
    ...(sequence?["independent-sequence","independent-shifted-reading","independent-fourth-dialogue"]:[]),
    ...(conversation?["guided-turn-repair","independent-reordered-roles","independent-final-reading","independent-fifth-dialogue"]:[]),
    ...(perspective?["guided-final-repair","independent-after-switch-reading","independent-second-pinyin","independent-sixth-dialogue"]:[]),
    ...(revision?["independent-role-reading","independent-source-reconstruction","independent-third-sequence","independent-seventh-dialogue"]:[])] as const;
  const guidedId=spec.id+":guided-choice";
  const readingId=spec.id+":independent-reading";
  const writingId=spec.id+":independent-writing";
  if(suffix.some(part=>usedExerciseIds.has(spec.id+":"+part))) {fail("EXERCISE_ID_COLLISION");continue;}
  const eBase=(id:string,purpose:"guided"|"independent",instruction:string,sourceIds:string[],classification:"formative-recognition"|"formative-recall"|"ungraded-production",skillDimension:"comprehension"|"writing")=>({
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
   ...(chinese?{reading:examples.map(e=>e.reading!).join(" · ")}:{}),
   acceptedAnswers:[spec.independentAnswer],normalization:"literal",grading:"exact",
   explanation:"Select only the original expression matching the requested communicative situation."};
  const writing:ExerciseV1={...eBase(writingId,"independent",expansion?spec.writingInstruction+" "+expansion.dialogueBrief:spec.writingInstruction,sources,"ungraded-production","writing"),
   kind:"free-production",grading:"ungraded",explanation:"No automatic grammar, speaking or proficiency grade is assigned.",
   rubric:[...spec.writingChecks]};
  const shortChineseSource=Boolean(chinese&&expansion&&
    (!expansion.cloze.before.trim()||!expansion.cloze.after.trim()));
  const sourceAid=expansion?{
    targetText:expansion.cloze.quote,
    meaning:examples.find(e=>e.targetText===expansion.cloze.quote)!.meaning,
    cue:expansion.contrastCue
  }:undefined;
  const extraGuided:ExerciseV1[]=expansion?shortChineseSource?[{
    ...eBase(spec.id+":guided-cloze","guided",expansion.cloze.instruction,[expansion.cloze.sourceId],
      "formative-recognition","comprehension"),
    kind:"typed",normalization:"unicode-nfc",grading:"exact",
    acceptedAnswers:[expansion.cloze.quote],
    explanation:"Type the complete original Hanzi expression and compare it with the attested source.",
    sourceAid:sourceAid!
  }]:[{
    ...eBase(spec.id+":guided-cloze","guided",expansion.cloze.instruction,[expansion.cloze.sourceId],
      "formative-recognition","comprehension"),
    kind:"cloze",before:expansion.cloze.before,after:expansion.cloze.after,
    acceptedAnswers:[expansion.cloze.answer],normalization:japanese?"japanese-terminal-punctuation":chinese?"unicode-nfc":"french-apostrophe",
    grading:"exact",
    explanation:"Restore the attested original expression in this context.",
    sourceAid:sourceAid!
  }]:[];
  const extraIndependent:ExerciseV1[]=expansion?[{
    ...eBase(spec.id+":independent-situation","independent",expansion.situationalChoice.question,
      [exerciseRefs[expansion.situationalChoice.correctQuote]!],"formative-recognition","comprehension"),
    kind:"choice",options:allQuotes,acceptedAnswers:[expansion.situationalChoice.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Choose the attested original expression appropriate to the changed context."
  }]:[];
  const extraTone:ExerciseV1[]=chinese?[{
    ...eBase(spec.id+":independent-tone","independent",chinese.tone.question,
       [chinese.tone.sourceId],"formative-recall","writing"),
    kind:"typed",normalization:"pinyin-tone-marked",grading:"exact",
    acceptedAnswers:[chinese.tone.reading],
    explanation:"Compare your written Pinyin with the unchanged tone-marked reading from the original source. This is not a spoken evaluation.",
    sourceAid:{
      targetText:chinese.tone.quote,
      meaning:examples.find(e=>e.targetText===chinese.tone.quote)!.meaning,
      cue:chinese.toneCue
    }
  }]:[];
  const depthGuided:ExerciseV1[]=depth?[{
   ...eBase(spec.id+":guided-repair","guided",depth.guidedRepair.question,
      [exerciseRefs[depth.guidedRepair.correctQuote]!],"formative-recognition","comprehension"),
   kind:"choice",options:allQuotes,acceptedAnswers:[depth.guidedRepair.correctQuote],
   normalization:"literal",grading:"exact",
   explanation:"Review the original source roles and the changed communicative situation.",
   misconceptions:[{answer:depth.guidedRepair.wrongQuote,feedback:depth.guidedRepair.feedback}],
   sourceComparison:{
    first:examples.find(e=>e.targetText===depth.guidedRepair.correctQuote)!,
    second:examples.find(e=>e.targetText===depth.guidedRepair.wrongQuote)!,
    cue:depth.guidedRepair.feedback
   },
   sourceAid:{
    targetText:depth.guidedRepair.correctQuote,
    meaning:examples.find(e=>e.targetText===depth.guidedRepair.correctQuote)!.meaning,
    cue:depth.guidedRepair.feedback
   }
  }]:[];
  const depthReading:ExerciseV1[]=depth?[{
   ...eBase(spec.id+":independent-context-reading","independent",
      depth.readingRepair.question,[exerciseRefs[depth.readingRepair.correctQuote]!],
      "formative-recognition","comprehension"),
   kind:"reading",passage:"New practice situation (not a source transcript): "+
     depth.readingRepair.context+"\nOriginal source excerpts:\n"+
     examples.map(e=>e.targetText+" — "+e.reading).join("\n"),
   question:depth.readingRepair.question,options:allQuotes,
   acceptedAnswers:[depth.readingRepair.correctQuote],
   normalization:"literal",grading:"exact",
   explanation:"Choose the original excerpt that fits the authored situation.",
   misconceptions:[{answer:depth.readingRepair.wrongQuote,feedback:depth.readingRepair.feedback}],
   sourceAid:{
    targetText:depth.readingRepair.correctQuote,
    meaning:examples.find(e=>e.targetText===depth.readingRepair.correctQuote)!.meaning,
    cue:depth.readingRepair.feedback
   }
  }]:[];
  const depthWriting:ExerciseV1[]=depth?[{
   ...eBase(spec.id+":independent-rewrite","independent",depth.writingTransfer.instruction,
      sources,"ungraded-production","writing"),
   kind:"free-production",grading:"ungraded",
   explanation:"Original learner-authored scene revision. No automatic Chinese level, fluency or pronunciation grade.",
   rubric:[...depth.writingTransfer.criteria]
  }]:[];
  const reconstructedGuided:ExerciseV1[]=reconstruction?[{
    ...eBase(spec.id+":guided-reconstruct","guided",reconstruction.reconstruct.instruction,
      [reconstruction.reconstruct.sourceId],"formative-recall","writing"),
    kind:"typed",normalization:"unicode-nfc",grading:"exact",
    acceptedAnswers:[reconstruction.reconstruct.quote],
    explanation:"Reconstruct the full unchanged Hanzi quotation for this role and situation.",
    misconceptions:[{answer:reconstruction.reconstruct.wrongQuote,feedback:reconstruction.reconstruct.feedback}],
    sourceAid:{
      targetText:reconstruction.reconstruct.quote,
      meaning:examples.find(e=>e.targetText===reconstruction.reconstruct.quote)!.meaning,
      cue:reconstruction.reconstruct.feedback
    }
  }]:[];
  const reconstructedReading:ExerciseV1[]=reconstruction?[{
    ...eBase(spec.id+":independent-role-switch","independent",reconstruction.changedContext.question,
      [exerciseRefs[reconstruction.changedContext.correctQuote]!],"formative-recognition","comprehension"),
    kind:"reading",passage:"New changed-role context (not an original source conversation): "+
      reconstruction.changedContext.context+"\nOriginal source snippets and pinned written Pinyin:\n"+
      examples.map(e=>e.targetText+" — "+e.reading).join("\n"),
    question:reconstruction.changedContext.question,options:allQuotes,
    acceptedAnswers:[reconstruction.changedContext.correctQuote],normalization:"literal",grading:"exact",
    explanation:"Find the exact original source expression whose function fits the changed role.",
    misconceptions:[{answer:reconstruction.changedContext.wrongQuote,feedback:reconstruction.changedContext.feedback}],
    sourceAid:{
      targetText:reconstruction.changedContext.correctQuote,
      meaning:examples.find(e=>e.targetText===reconstruction.changedContext.correctQuote)!.meaning,
      cue:reconstruction.changedContext.feedback
    }
  }]:[];
  const reconstructedWriting:ExerciseV1[]=reconstruction?[{
    ...eBase(spec.id+":independent-new-dialogue","independent",
      reconstruction.independentDialogue.instruction,sources,"ungraded-production","writing"),
    kind:"free-production",grading:"ungraded",
    explanation:"Third original learner-authored dialogue. No automatic grammar, pronunciation, HSK or proficiency grade.",
    rubric:[...reconstruction.independentDialogue.criteria]
  }]:[];
  const orderedEvidence:ExerciseV1[]=sequence?[{
    ...eBase(spec.id+":independent-sequence","independent",
      sequence.order.instruction,sources,"formative-recall","comprehension"),
    kind:"ordering",tokens:[...sequence.order.tokens],normalization:"literal",grading:"exact",
    acceptedAnswers:[sequence.order.expected.map(q=>sequence.order.tokens.indexOf(q)).join(",")],
    explanation:"Compare the intended new scenario order with each unmodified, originally attested source excerpt.",
    misconceptions:[{
      answer:sequence.order.misconception.map(q=>sequence.order.tokens.indexOf(q)).join(","),
      feedback:sequence.order.feedback
    }],
    sourceAid:{
      targetText:sequence.order.expected[0],
      meaning:examples.find(e=>e.targetText===sequence.order.expected[0])!.meaning,
      cue:sequence.order.feedback
    }
  }]:[];
  const shiftedReading:ExerciseV1[]=sequence?[{
    ...eBase(spec.id+":independent-shifted-reading","independent",
      sequence.shiftedReading.question,
      [exerciseRefs[sequence.shiftedReading.correctQuote]!],
      "formative-recognition","comprehension"),
    kind:"reading",passage:"New authored follow-up, not a source dialogue: "+
      sequence.shiftedReading.context+"\nThree original Chinese snippets with verified written Pinyin:\n"+
      examples.map(e=>e.targetText+" — "+e.reading).join("\n"),
    question:sequence.shiftedReading.question,
    options:allQuotes,acceptedAnswers:[sequence.shiftedReading.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Use the original source expressions for a changed communicative purpose.",
    misconceptions:[{
      answer:sequence.shiftedReading.wrongQuote,
      feedback:sequence.shiftedReading.feedback
    }],
    sourceAid:{
      targetText:sequence.shiftedReading.correctQuote,
      meaning:examples.find(e=>e.targetText===sequence.shiftedReading.correctQuote)!.meaning,
      cue:sequence.shiftedReading.feedback
    }
  }]:[];
  const fourthDialogue:ExerciseV1[]=sequence?[{
    ...eBase(spec.id+":independent-fourth-dialogue","independent",
      sequence.independentDialogue.instruction,sources,
      "ungraded-production","writing"),
    kind:"free-production",grading:"ungraded",
    explanation:"Original learner-authored dialogue for the new situation; no proficiency, speaking or review grade.",
    rubric:[...sequence.independentDialogue.criteria]
  }]:[];
  const conversationRepair:ExerciseV1[]=conversation?[{
    ...eBase(spec.id+":guided-turn-repair","guided",conversation.repair.question,
      [exerciseRefs[conversation.repair.correctQuote]!],"formative-recognition","comprehension"),
    kind:"choice",options:allQuotes,acceptedAnswers:[conversation.repair.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Check which original expression suits the new listener, question or identity.",
    misconceptions:[
      {answer:conversation.repair.firstWrong,feedback:conversation.repair.firstFeedback},
      {answer:conversation.repair.secondWrong,feedback:conversation.repair.secondFeedback}
    ],
    sourceAid:{
      targetText:conversation.repair.correctQuote,
      meaning:examples.find(e=>e.targetText===conversation.repair.correctQuote)!.meaning,
      cue:conversation.repair.firstFeedback
    }
  }]:[];
  const conversationOrder:ExerciseV1[]=conversation&&sequence?[{
    ...eBase(spec.id+":independent-reordered-roles","independent",
      conversation.reversedSequence.instruction,sources,"formative-recall","comprehension"),
    kind:"ordering",tokens:[...sequence.order.tokens],
    normalization:"literal",grading:"exact",
    acceptedAnswers:[conversation.reversedSequence.expected.map(q=>sequence.order.tokens.indexOf(q)).join(",")],
    explanation:"The earlier source-sequence order does not necessarily fit the changed authored dialogue.",
    misconceptions:[{
      answer:sequence.order.expected.map(q=>sequence.order.tokens.indexOf(q)).join(","),
      feedback:conversation.reversedSequence.feedback
    }],
    sourceAid:{
      targetText:conversation.reversedSequence.expected[0],
      meaning:examples.find(e=>e.targetText===conversation.reversedSequence.expected[0])!.meaning,
      cue:conversation.reversedSequence.feedback
    }
  }]:[];
  const conversationReading:ExerciseV1[]=conversation?[{
    ...eBase(spec.id+":independent-final-reading","independent",conversation.finalReading.question,
      [exerciseRefs[conversation.finalReading.correctQuote]!],"formative-recognition","comprehension"),
    kind:"reading",passage:"Independent changed-intention scene (new writing, not original dialogue): "+
      conversation.finalReading.context+"\nExact original Hanzi and attested written Pinyin:\n"+
      examples.map(e=>e.targetText+" — "+e.reading).join("\n"),
    question:conversation.finalReading.question,options:allQuotes,
    acceptedAnswers:[conversation.finalReading.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Distinguish the communicative function from the previous reconstructed scene.",
    misconceptions:[{answer:conversation.finalReading.wrongQuote,feedback:conversation.finalReading.feedback}],
    sourceAid:{
      targetText:conversation.finalReading.correctQuote,
      meaning:examples.find(e=>e.targetText===conversation.finalReading.correctQuote)!.meaning,
      cue:conversation.finalReading.feedback
    }
  }]:[];
  const fifthDialogue:ExerciseV1[]=conversation?[{
    ...eBase(spec.id+":independent-fifth-dialogue","independent",
      conversation.independentDialogue.instruction,sources,"ungraded-production","writing"),
    kind:"free-production",grading:"ungraded",
    explanation:"Fifth learner-authored practical dialogue; no native scheduler, audio, HSK or proficiency grade.",
    rubric:[...conversation.independentDialogue.criteria]
  }]:[];
  const perspectiveGuided:ExerciseV1[]=perspective?[{
    ...eBase(spec.id+":guided-final-repair","guided",perspective.changedListener.question,
      [exerciseRefs[perspective.changedListener.correctQuote]!],
      "formative-recognition","comprehension"),
    kind:"choice",options:allQuotes,acceptedAnswers:[perspective.changedListener.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Resolve the newly changed listener using only the admitted original expressions.",
    misconceptions:[{answer:perspective.changedListener.wrongQuote,feedback:perspective.changedListener.feedback}],
    sourceAid:{
      targetText:perspective.changedListener.correctQuote,
      meaning:examples.find(e=>e.targetText===perspective.changedListener.correctQuote)!.meaning,
      cue:perspective.changedListener.feedback
    }
  }]:[];
  const perspectiveReading:ExerciseV1[]=perspective?[{
    ...eBase(spec.id+":independent-after-switch-reading","independent",
      perspective.laterReading.question,
      [exerciseRefs[perspective.laterReading.correctQuote]!],
      "formative-recognition","comprehension"),
    kind:"reading",
    passage:"New independent scene with a changed listener (not a source transcript): "+
      perspective.laterReading.context+"\nSource-attested Hanzi and written Pinyin:\n"+
      examples.map(e=>e.targetText+" — "+e.reading).join("\n"),
    question:perspective.laterReading.question,options:allQuotes,
    acceptedAnswers:[perspective.laterReading.correctQuote],
    normalization:"literal",grading:"exact",
    explanation:"Check who speaks and what the listener actually asks in the later original practice scenario.",
    misconceptions:[{answer:perspective.laterReading.wrongQuote,feedback:perspective.laterReading.feedback}],
    sourceAid:{
      targetText:perspective.laterReading.correctQuote,
      meaning:examples.find(e=>e.targetText===perspective.laterReading.correctQuote)!.meaning,
      cue:perspective.laterReading.feedback
    }
  }]:[];
  const perspectivePinyin:ExerciseV1[]=perspective?[{
    ...eBase(spec.id+":independent-second-pinyin","independent",perspective.secondPinyin.question,
      [perspective.secondPinyin.sourceId],"formative-recall","writing"),
    kind:"typed",normalization:"pinyin-tone-marked",grading:"exact",
    acceptedAnswers:[perspective.secondPinyin.reading],
    explanation:"Only the second exact attested tone-marked original written Pinyin is accepted; no speaking grade.",
    sourceAid:{
      targetText:perspective.secondPinyin.quote,
      meaning:examples.find(e=>e.targetText===perspective.secondPinyin.quote)!.meaning,
      cue:perspective.secondPinyin.cue
    }
  }]:[];
  const perspectiveWriting:ExerciseV1[]=perspective?[{
    ...eBase(spec.id+":independent-sixth-dialogue","independent",
      perspective.sixthDialogue.instruction,sources,"ungraded-production","writing"),
    kind:"free-production",grading:"ungraded",
    explanation:"Final independent changed-listener writing and self-review, without automatic proficiency credit.",
    rubric:[...perspective.sixthDialogue.criteria]
  }]:[];
  const revisionReading:ExerciseV1[]=revision?[{
    ...eBase(spec.id+":independent-role-reading","independent",revision.revisedReading.question,
       [exerciseRefs[revision.revisedReading.correctQuote]!],"formative-recognition","comprehension"),
    kind:"reading",
    passage:"Third authored scenario (not an original source dialogue): "+
      revision.revisedReading.context+"\nOriginal Hanzi with unchanged, source-verified written Pinyin:\n"+
      examples.map(e=>e.targetText+" — "+e.reading).join("\n"),
    question:revision.revisedReading.question,options:allQuotes,
    acceptedAnswers:[revision.revisedReading.correctQuote],normalization:"literal",grading:"exact",
    explanation:"Separate the new role, addressee or sentence purpose from both earlier cases.",
    misconceptions:[
      {answer:revision.revisedReading.firstWrong,feedback:revision.revisedReading.firstFeedback},
      {answer:revision.revisedReading.secondWrong,feedback:revision.revisedReading.secondFeedback}
    ],
    sourceAid:{
      targetText:revision.revisedReading.correctQuote,
      meaning:examples.find(e=>e.targetText===revision.revisedReading.correctQuote)!.meaning,
      cue:revision.revisedReading.firstFeedback
    }
  }]:[];
  const revisionReconstruction:ExerciseV1[]=revision?[{
    ...eBase(spec.id+":independent-source-reconstruction","independent",
      revision.sourceReconstruction.instruction,[revision.sourceReconstruction.sourceId],
      "formative-recall","writing"),
    kind:"typed",normalization:"unicode-nfc",grading:"exact",
    acceptedAnswers:[revision.sourceReconstruction.correctQuote],
    explanation:"Reproduce only the exact pinned original Hanzi text, retaining its punctuation.",
    misconceptions:[
      {answer:revision.sourceReconstruction.firstWrong,
        feedback:revision.sourceReconstruction.firstFeedback},
      {answer:revision.sourceReconstruction.secondWrong,
        feedback:revision.sourceReconstruction.secondFeedback}
    ],
    sourceAid:{
      targetText:revision.sourceReconstruction.correctQuote,
      meaning:examples.find(e=>e.targetText===revision.sourceReconstruction.correctQuote)!.meaning,
      cue:revision.sourceReconstruction.firstFeedback
    }
  }]:[];
  const revisionSequence:ExerciseV1[]=revision&&sequence&&conversation?[{
    ...eBase(spec.id+":independent-third-sequence","independent",
      revision.thirdSequence.instruction,sources,"formative-recall","comprehension"),
    kind:"ordering",tokens:[...sequence.order.tokens],normalization:"literal",grading:"exact",
    acceptedAnswers:[revision.thirdSequence.expected.map(q=>sequence.order.tokens.indexOf(q)).join(",")],
    explanation:"Only this third independently authored scenario determines the correct sequence of three authentic excerpts.",
    misconceptions:[
      {answer:sequence.order.expected.map(q=>sequence.order.tokens.indexOf(q)).join(","),
        feedback:revision.thirdSequence.firstFeedback},
      {answer:conversation.reversedSequence.expected.map(q=>sequence.order.tokens.indexOf(q)).join(","),
        feedback:revision.thirdSequence.secondFeedback}
    ],
    sourceAid:{
      targetText:revision.thirdSequence.expected[0],
      meaning:examples.find(e=>e.targetText===revision.thirdSequence.expected[0])!.meaning,
      cue:revision.thirdSequence.firstFeedback
    }
  }]:[];
  const revisionDialogue:ExerciseV1[]=revision?[{
    ...eBase(spec.id+":independent-seventh-dialogue","independent",
      revision.independentRevision.instruction,sources,"ungraded-production","writing"),
    kind:"free-production",grading:"ungraded",
    explanation:"Independent authored dialogue revision and self-review; no grade, HSK, audio or native scheduler result.",
    rubric:[...revision.independentRevision.criteria]
  }]:[];
  const candidate:LessonBundleV1={
   lesson:{schemaVersion:1,id:spec.id,languageId:spec.languageId,contentVersion:french?"phase23-french-source-authored-internal-v1":japanese?"phase24-japanese-source-authored-internal-v1":perspective?"phase30-chinese-source-authored-internal-v1":conversation?"phase29-chinese-source-authored-internal-v1":sequence?"phase28-chinese-source-authored-internal-v1":reconstruction?"phase27-chinese-source-authored-internal-v1":depth?"phase26-chinese-source-authored-internal-v1":chinese?"phase25-chinese-source-authored-internal-v1":"phase22-source-authored-internal-v1",
    title:spec.title,objective:{statement:spec.objective,skillDimension:"comprehension"},
    prerequisiteLessonIds:[...new Set(spec.encounters.map(x=>x.lessonId))],publication:"internal-fixture",
    sourceIds:sources,sources:provenance,steps:[
     {id:spec.id+":encounter",type:"encounter",examples},
     {id:spec.id+":explanation",type:"explain",heading:"Use the source in context",explanation:spec.explanation,conceptIds:[]},
      ...(expansion?[{id:spec.id+":situation",type:"explain" as const,heading:"Practice the new situation",
        explanation:spec.transferSituation,conceptIds:[]}]:[]),
      ...(expansion?[{id:spec.id+":grammar",type:"explain" as const,heading:expansion.grammarHeading,
        explanation:expansion.grammarExplanation,conceptIds:[]}]:[]),
     {id:spec.id+":guided",type:"guided",exerciseIds:[guidedId,...extraGuided.map(e=>e.id),...depthGuided.map(e=>e.id),...reconstructedGuided.map(e=>e.id),...conversationRepair.map(e=>e.id),...perspectiveGuided.map(e=>e.id)]},
     {id:spec.id+":independent",type:"independent",exerciseIds:[readingId,...depthReading.map(e=>e.id),...reconstructedReading.map(e=>e.id),...orderedEvidence.map(e=>e.id),...shiftedReading.map(e=>e.id),...conversationOrder.map(e=>e.id),...conversationReading.map(e=>e.id),...perspectiveReading.map(e=>e.id),...extraIndependent.map(e=>e.id),...extraTone.map(e=>e.id),...perspectivePinyin.map(e=>e.id),writingId,...depthWriting.map(e=>e.id),...reconstructedWriting.map(e=>e.id),...fourthDialogue.map(e=>e.id),...fifthDialogue.map(e=>e.id),...perspectiveWriting.map(e=>e.id),...revisionReading.map(e=>e.id),...revisionReconstruction.map(e=>e.id),...revisionSequence.map(e=>e.id),...revisionDialogue.map(e=>e.id)]},
     {id:spec.id+":reflection",type:"reflect",feedback:spec.reflection}
    ]},
   plugin:original.plugin,exercises:[guided,...extraGuided,...depthGuided,...reconstructedGuided,...conversationRepair,...perspectiveGuided,reading,...depthReading,...reconstructedReading,...orderedEvidence,...shiftedReading,...conversationOrder,...conversationReading,...perspectiveReading,...extraIndependent,...extraTone,...perspectivePinyin,writing,...depthWriting,...reconstructedWriting,...fourthDialogue,...fifthDialogue,...perspectiveWriting,...revisionReading,...revisionReconstruction,...revisionSequence,...revisionDialogue]
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
