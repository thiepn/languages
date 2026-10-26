import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {compilePinnedSourceIntake,PHASE22_AUTHORING} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {PHASE26_CHINESE_DEPTH} from "../apps/learner/src/phase26-chinese-depth.ts";
import {PHASE27_CHINESE_TRANSFER} from "../apps/learner/src/phase27-chinese-transfer.ts";
import {PHASE28_CHINESE_SEQUENCES} from "../apps/learner/src/phase28-chinese-sequences.ts";
import {PHASE29_CHINESE_CONVERSATIONS} from "../apps/learner/src/phase29-chinese-conversations.ts";
import {PHASE30_ENRICHED_PERSPECTIVES} from "../apps/learner/src/phase30-revision-overlay.ts";
import {PHASE31_CHINESE_HANDOFFS} from "../apps/learner/src/phase31-chinese-handoffs.ts";
import {PHASE32_CHINESE_NEGOTIATIONS} from "../apps/learner/src/phase32-chinese-negotiations.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,revealExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const load=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>load("fixtures/"+p+".json").bundles);
const quoteWhitelist=load("phase16-source-evidence.json").originalSourceQuotes;
const readings=load("phase25-chinese-readings.json");
const before=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES,...PHASE31_CHINESE_HANDOFFS];
const compile=(specs=PHASE32_CHINESE_NEGOTIATIONS,fixtures=originals)=>compilePinnedSourceIntake(fixtures,specs);
const code=(tokens,arr)=>arr.map(q=>tokens.indexOf(q)).join(",");

test("Phase 32 produces four 36-exercise multi-person lessons while preserving 45 previous and canonical 12/126",()=>{
 const previous=compile(before),all=compile([...before,...PHASE32_CHINESE_NEGOTIATIONS]);
 assert.deepEqual(previous.issues,[]);assert.deepEqual(all.issues,[]);
 assert.equal(previous.candidates.length,45);assert.equal(all.candidates.length,49);
 assert.deepEqual(all.candidates.slice(0,45),previous.candidates);
 assert.equal(originals.length,12);assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const oldIds=new Set([...originals,...previous.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of all.candidates.slice(45)){
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.contentVersion,"phase32-chinese-source-authored-internal-v1");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.exercises.length,36);assert.equal(framesFor(b).length,41);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,9);
  assert.ok(b.lesson.sources.every(s=>s.repository===readings.sourceRepository&&
   s.path===readings.sourcePath&&s.revision===readings.sourceRevision&&s.rights==="review-required"&&
   s.editorialReview==="pending"&&!s.redistributionVerified));
  for(const e of b.exercises){
   assert.ok(!oldIds.has(e.id),e.id);oldIds.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
 }
 assert.equal(all.candidates.slice(45).reduce((n,b)=>n+b.exercises.length,0),144);
});

test("each independently authored scene contains the three exact original source encounters and pinned tone-marked Pinyin",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=PHASE32_CHINESE_NEGOTIATIONS[i];
  for(const entry of spec.encounters){
   assert.ok(quoteWhitelist[entry.sourceId].includes(entry.quote));
   const old=originals.find(o=>o.lesson.id===entry.lessonId);
   const original=old.lesson.steps.flatMap(st=>st.type==="encounter"?st.examples:[])
    .find(e=>e.targetText===entry.quote);
   assert.equal(original.reading,readings.readings[entry.sourceId][entry.quote]);
   assert.ok(b.lesson.steps[0].examples.some(e=>e.targetText===original.targetText&&e.meaning===original.meaning&&e.reading===original.reading));
  }
  for(const e of b.exercises.filter(e=>e.id.endsWith(":independent-tone")||e.id.endsWith(":independent-second-pinyin"))){
   assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
   assert.equal(evaluateExercise(e,e.acceptedAnswers[0].normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
  }
 }
});

test("speaker interruption swaps exact Chinese correct/wrong expression, then observer selects third real expression",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE32_CHINESE_NEGOTIATIONS[i].chineseNegotiation;
  assert.equal(s.opening.correctQuote,s.interruption.wrongQuote);
  assert.equal(s.opening.wrongQuote,s.interruption.correctQuote);
  const fields=[["independent-opening",s.opening],["independent-interruption",s.interruption]];
  for(const [suffix,part] of fields){
   const e=b.exercises.find(e=>e.id.endsWith(":"+suffix));
   assert.equal(e.kind,"reading");
   assert.equal(e.sourceAid.targetText,part.correctQuote);
   assert.equal(evaluateExercise(e,part.correctQuote).kind,"correct");
   assert.equal(evaluateExercise(e,part.wrongQuote).kind,"incorrect");
   assert.equal(evaluateExercise(e,part.wrongQuote).explanation,part.feedback);
   assert.ok(e.passage.includes("Exact original Hanzi with verified written Pinyin:"));
   for(const example of b.lesson.steps[0].examples)assert.ok(e.passage.includes(example.targetText+" — "+example.reading));
  }
  const third=b.exercises.find(e=>e.id.endsWith(":independent-third-speaker"));
  assert.equal(third.kind,"reading");
  assert.equal(third.sourceAid.targetText,s.thirdSpeaker.correctQuote);
  assert.deepEqual(new Set([s.thirdSpeaker.correctQuote,...s.thirdSpeaker.wrongQuotes]),new Set(third.options));
  assert.equal(evaluateExercise(third,s.thirdSpeaker.correctQuote).kind,"correct");
  for(let k=0;k<2;k++){
   const wrong=s.thirdSpeaker.wrongQuotes[k];
   assert.equal(evaluateExercise(third,wrong).kind,"incorrect");
   assert.equal(evaluateExercise(third,wrong).explanation,s.thirdSpeaker.feedback[k]);
  }
 }
});

test("fifth situation accepts a new permutation and rejects four independently previous correct sequences with source-based feedback",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE32_CHINESE_NEGOTIATIONS[i],a=s.chineseSequence.order,
   previous=[a.expected,s.chineseConversation.reversedSequence.expected,
    s.chineseRevision.thirdSequence.expected,s.chineseRoleHandoff.fourthSequence.expected],
   current=s.chineseNegotiation.fifthSequence;
  const e=b.exercises.find(e=>e.id.endsWith(":independent-fifth-sequence"));
  assert.equal(e.kind,"ordering");
  assert.deepEqual(e.tokens,a.tokens);
  assert.equal(new Set([...previous,current.expected].map(x=>code(a.tokens,x))).size,5);
  assert.deepEqual(e.acceptedAnswers,[code(a.tokens,current.expected)]);
  assert.equal(evaluateExercise(e,code(a.tokens,current.expected)).kind,"correct");
  for(let k=0;k<4;k++){
   const rejected=evaluateExercise(e,code(a.tokens,previous[k]));
   assert.equal(rejected.kind,"incorrect");
   assert.equal(rejected.explanation,current.previousFeedback[k]);
  }
  assert.deepEqual(revealExercise(e).expected,[current.expected.join(" ")]);
 }
});

test("nine original-player independent writing tasks preserve learner first-draft comparisons across genuine revisions",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),written=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(written.length,9);
  for(const f of written){
   let state=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   const original="第一稿：这是我单独写的对话。",revised="第二稿：另一人说话并修正来源表达。";
   state=reduceLessonPlayer(state,{type:"draft",value:original});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
   state=reduceLessonPlayer(state,{type:"revise"});
   state=reduceLessonPlayer(state,{type:"draft",value:revised});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).submissions,2);
   assert.equal(activeAttempt(state).firstSubmittedDraft,original);
   assert.equal(activeAttempt(state).draft,revised);
   assert.equal(activeAttempt(state).outcome?.rubric.length,3);
   assert.deepEqual(reduceLessonPlayer(state,{type:"load",bundle:b,restoredIndex:0}).attempts,{});
  }
 }
});

test("adversarial quote invention, false role reversal, observer collisions, duplicate order and rights escalation reject source intake",()=>{
 const attacks=[
  a=>{a[0].chineseNegotiation.opening.correctQuote="不存在的原始文字";},
  a=>{a[1].chineseNegotiation.interruption.correctQuote=a[1].chineseNegotiation.opening.correctQuote;},
  a=>{a[2].chineseNegotiation.thirdSpeaker.correctQuote=a[2].chineseNegotiation.opening.correctQuote;},
  a=>{a[3].chineseNegotiation.thirdSpeaker.wrongQuotes[1]=a[3].chineseNegotiation.thirdSpeaker.wrongQuotes[0];},
  a=>{a[0].chineseNegotiation.thirdSpeaker.feedback[1]="";},
  a=>{a[1].chineseNegotiation.fifthSequence.expected=[...a[1].chineseSequence.order.expected];},
  a=>{a[2].chineseNegotiation.fifthSequence.expected=[...a[2].chineseConversation.reversedSequence.expected];},
  a=>{a[3].chineseNegotiation.fifthSequence.expected=[...a[3].chineseRoleHandoff.fourthSequence.expected];},
  a=>{a[0].chineseNegotiation.fifthSequence.expected[1]=a[0].chineseNegotiation.fifthSequence.expected[0];},
  a=>{a[1].chineseNegotiation.fifthSequence.previousFeedback[3]="";},
  a=>{a[2].chineseNegotiation.independentDialogue.criteria[2]="";},
  a=>{a[3].chineseExpansion.tone.reading="wo de";},
  a=>{a[0].languageId="fr";}
 ];
 for(const mutate of attacks){
  const draft=structuredClone(PHASE32_CHINESE_NEGOTIATIONS);mutate(draft);
  assert.ok(compile(draft).issues.length);
 }
 for(const mutate of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const modified=structuredClone(originals);mutate(modified);
  assert.ok(compile(PHASE32_CHINESE_NEGOTIATIONS,modified).issues.length);
 }
 assert.ok(compile([PHASE32_CHINESE_NEGOTIATIONS[0],PHASE32_CHINESE_NEGOTIATIONS[0]])
  .issues.some(e=>e.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("canonical checkpoint serialization contains no unpublished scenario, submitted writing or review/HSK grades",()=>{
 const values=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const saved=serializeDemoCheckpoint(values,originals);
 assert.deepEqual(parseDemoCheckpoint(saved,originals),values);
 assert.ok(compile([...before,...PHASE32_CHINESE_NEGOTIATIONS]).candidates.every(c=>!Object.hasOwn(values,checkpointId(c))));
 assert.doesNotMatch(saved,/"(?:draft|firstSubmittedDraft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
