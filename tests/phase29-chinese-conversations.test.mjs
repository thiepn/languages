import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE22_AUTHORING,compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {PHASE26_CHINESE_DEPTH} from "../apps/learner/src/phase26-chinese-depth.ts";
import {PHASE27_CHINESE_TRANSFER} from "../apps/learner/src/phase27-chinese-transfer.ts";
import {PHASE28_CHINESE_SEQUENCES} from "../apps/learner/src/phase28-chinese-sequences.ts";
import {PHASE29_CHINESE_CONVERSATIONS} from "../apps/learner/src/phase29-chinese-conversations.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,revealExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";

const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const originalQuotes=read("phase16-source-evidence.json").originalSourceQuotes;
const verified=read("phase25-chinese-readings.json");
const prior=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,...PHASE28_CHINESE_SEQUENCES];
const all=[...prior,...PHASE29_CHINESE_CONVERSATIONS];
const compile=()=>compilePinnedSourceIntake(originals,all);
const index=(tokens,ordered)=>ordered.map(q=>tokens.indexOf(q)).join(",");

test("Phase 29 adds four 19-exercise Chinese lessons while preserving every original and previous 33 editorial candidate bundles",()=>{
 const before=compilePinnedSourceIntake(originals,prior),after=compile();
 assert.deepEqual(before.issues,[]);assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,33);assert.equal(after.candidates.length,37);
 assert.deepEqual(after.candidates.slice(0,33),before.candidates);
 assert.equal(PHASE29_CHINESE_CONVERSATIONS.length,4);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const oldIds=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of after.candidates.slice(33)){
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.contentVersion,"phase29-chinese-source-authored-internal-v1");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.exercises.length,19);assert.equal(framesFor(b).length,24);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,5);
  assert.ok(b.lesson.sources.every(s=>s.repository===verified.sourceRepository&&
   s.path===verified.sourcePath&&s.revision===verified.sourceRevision&&
   s.editorialReview==="pending"&&s.rights==="review-required"&&!s.redistributionVerified));
  for(const ex of b.exercises){
   assert.ok(!oldIds.has(ex.id),ex.id);oldIds.add(ex.id);
   assert.equal(ex.evidence.mayScheduleReview,false);
   assert.equal(ex.evidence.mayAssertProficiency,false);
  }
 }
 assert.equal(after.candidates.slice(33).reduce((n,b)=>n+b.exercises.length,0),76);
});

test("every new Hanzi and tone-marked Pinyin reading remains identical to its original admitted and rights-held source",()=>{
 const x=compilePinnedSourceIntake(originals,PHASE29_CHINESE_CONVERSATIONS);
 assert.deepEqual(x.issues,[]);
 for(const [i,bundle] of x.candidates.entries()){
  const spec=PHASE29_CHINESE_CONVERSATIONS[i];
  for(const ref of spec.encounters){
   assert.ok(originalQuotes[ref.sourceId].includes(ref.quote));
   const source=originals.find(b=>b.lesson.id===ref.lessonId);
   const example=source.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[])
    .find(e=>e.targetText===ref.quote);
   assert.equal(example.reading,verified.readings[ref.sourceId][ref.quote]);
   assert.ok(bundle.lesson.steps[0].examples.some(e=>
     e.targetText===example.targetText&&e.meaning===example.meaning&&e.reading===example.reading));
  }
  const tone=bundle.exercises.find(e=>e.id.endsWith(":independent-tone"));
  assert.deepEqual(tone.acceptedAnswers,[spec.chineseExpansion.tone.reading]);
  assert.equal(evaluateExercise(tone,spec.chineseExpansion.tone.reading).kind,"correct");
  assert.equal(evaluateExercise(tone,spec.chineseExpansion.tone.reading.normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
 }
});

test("guided Chinese context repair distinguishes two separate original-source misconceptions with precise feedback",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE29_CHINESE_CONVERSATIONS);assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE29_CHINESE_CONVERSATIONS[i].chineseConversation.repair;
  const ex=b.exercises.find(e=>e.id.endsWith(":guided-turn-repair"));
  assert.ok(ex&&ex.kind==="choice");
  assert.deepEqual(new Set([s.correctQuote,s.firstWrong,s.secondWrong]),new Set(ex.options));
  assert.equal(evaluateExercise(ex,s.correctQuote).kind,"correct");
  assert.equal(evaluateExercise(ex,s.firstWrong).explanation,s.firstFeedback);
  assert.equal(evaluateExercise(ex,s.secondWrong).explanation,s.secondFeedback);
  assert.equal(evaluateExercise(ex,s.firstWrong).kind,"incorrect");
  assert.equal(evaluateExercise(ex,s.secondWrong).kind,"incorrect");
  assert.equal(ex.sourceAid.targetText,s.correctQuote);
 }
});

test("new order truly reverses a previous exercise under source-derived indexes, and old order triggers contextual explanation",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE29_CHINESE_CONVERSATIONS);assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=PHASE29_CHINESE_CONVERSATIONS[i];
  const previous=spec.chineseSequence.order;
  const changed=spec.chineseConversation.reversedSequence;
  const ex=b.exercises.find(e=>e.id.endsWith(":independent-reordered-roles"));
  assert.ok(ex&&ex.kind==="ordering");
  const accepted=index(previous.tokens,changed.expected),incorrect=index(previous.tokens,previous.expected);
  assert.notEqual(accepted,incorrect);
  assert.deepEqual(ex.acceptedAnswers,[accepted]);
  assert.equal(evaluateExercise(ex,accepted).kind,"correct");
  assert.equal(evaluateExercise(ex,incorrect).kind,"incorrect");
  assert.equal(evaluateExercise(ex,incorrect).explanation,changed.feedback);
  assert.deepEqual(revealExercise(ex).expected,[changed.expected.join(" ")]);
  assert.ok(previous.tokens.every(t=>ex.tokens.includes(t)));
 }
});

test("new final reading is an explicitly authored context with source-backed options and exact incorrect-source correction",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE29_CHINESE_CONVERSATIONS);assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE29_CHINESE_CONVERSATIONS[i].chineseConversation.finalReading;
  const ex=b.exercises.find(e=>e.id.endsWith(":independent-final-reading"));
  assert.ok(ex&&ex.kind==="reading");
  assert.ok(ex.passage.startsWith("Independent changed-intention scene (new writing, not original dialogue):"));
  assert.ok(ex.passage.includes("Exact original Hanzi and attested written Pinyin:"));
  for(const e of b.lesson.steps[0].examples)assert.ok(ex.passage.includes(e.targetText+" — "+e.reading));
  assert.equal(ex.sourceAid.targetText,s.correctQuote);
  assert.equal(evaluateExercise(ex,s.correctQuote).kind,"correct");
  assert.equal(evaluateExercise(ex,s.wrongQuote).kind,"incorrect");
  assert.equal(evaluateExercise(ex,s.wrongQuote).explanation,s.feedback);
 }
});

test("five distinct ungraded dialogues support original player submit and independent revise without grading or persistence",()=>{
 const {candidates,issues}=compilePinnedSourceIntake(originals,PHASE29_CHINESE_CONVERSATIONS);assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),written=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(written.length,5);
  for(const frame of written){
   let player=createLessonPlayerState(b,frames.findIndex(f=>f.id===frame.id));
   player=reduceLessonPlayer(player,{type:"draft",value:"这是一段独立练习。我是学生。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   player=reduceLessonPlayer(player,{type:"revise"});
   player=reduceLessonPlayer(player,{type:"draft",value:"我调整另一位听者之后独立修改写作。"});
   player=reduceLessonPlayer(player,{type:"submit"});
   assert.equal(activeAttempt(player).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(player).submissions,2);
   assert.equal(activeAttempt(player).outcome?.rubric.length,3);
  }
 }
});

test("source, wrong-answer, order, text, and rights adversaries fail without weakening original compiler policy",()=>{
 const mutations=[
  a=>{a[0].chineseConversation.repair.firstWrong=a[0].chineseConversation.repair.correctQuote;},
  a=>{a[1].chineseConversation.repair.secondWrong=a[1].chineseConversation.repair.firstWrong;},
  a=>{a[2].chineseConversation.repair.secondWrong="没有来源的句子";},
  a=>{a[3].chineseConversation.reversedSequence.expected=[...a[3].chineseSequence.order.expected];},
  a=>{a[0].chineseConversation.reversedSequence.expected[1]=a[0].chineseConversation.reversedSequence.expected[0];},
  a=>{a[1].chineseConversation.finalReading.wrongQuote=a[1].chineseConversation.finalReading.correctQuote;},
  a=>{a[2].chineseConversation.finalReading.correctQuote="中文新编造";},
  a=>{a[3].chineseConversation.independentDialogue.criteria[0]="";},
  a=>{a[0].chineseConversation.repair.firstFeedback="";},
  a=>{a[1].chineseExpansion.tone.reading="Ni xihuan he cha ma?";},
  a=>{a[2].languageId="fr";}
 ];
 for(const mutate of mutations){
  const changed=structuredClone(PHASE29_CHINESE_CONVERSATIONS);mutate(changed);
  assert.ok(compilePinnedSourceIntake(originals,changed).issues.length>0);
 }
 for(const mutate of [
  x=>{x.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  x=>{x.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  x=>{x.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  x=>{x.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const altered=structuredClone(originals);mutate(altered);
  assert.ok(compilePinnedSourceIntake(altered,PHASE29_CHINESE_CONVERSATIONS).issues.length>0);
 }
 const collision=compilePinnedSourceIntake(originals,[PHASE29_CHINESE_CONVERSATIONS[0],PHASE29_CHINESE_CONVERSATIONS[0]]);
 assert.ok(collision.issues.some(x=>x.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("original twelve lessons, 126 exercises and versioned checkpoint-only persistence remain unchanged",()=>{
 assert.equal(originals.length,12);assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const saved=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(saved,originals),positions);
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(saved,/"(?:draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
