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
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,revealExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const load=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>load("fixtures/"+p+".json").bundles);
const receipts=load("phase16-source-evidence.json").originalSourceQuotes;
const readings=load("phase25-chinese-readings.json");
const earlier=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,
 ...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES];
const compile=(specs=PHASE31_CHINESE_HANDOFFS,bundles=originals)=>compilePinnedSourceIntake(bundles,specs);
const index=(tokens,order)=>order.map(q=>tokens.indexOf(q)).join(",");

test("Phase 31 provides four new handoff lessons while preserving all 41 old candidates and 12/126 canonical content",()=>{
 const before=compile(earlier),after=compile([...earlier,...PHASE31_CHINESE_HANDOFFS]);
 assert.deepEqual(before.issues,[]);
 assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,41);
 assert.equal(after.candidates.length,45);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 assert.deepEqual(after.candidates.slice(0,41),before.candidates);
 const seen=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of after.candidates.slice(41)){
  assert.equal(b.lesson.contentVersion,"phase31-chinese-source-authored-internal-v1");
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,31);
  assert.equal(framesFor(b).length,36);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,8);
  for(const e of b.exercises){
   assert.equal(seen.has(e.id),false);
   seen.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(s=>s.repository===readings.sourceRepository&&s.path===readings.sourcePath&&
    s.revision===readings.sourceRevision&&s.rights==="review-required"&&
    s.editorialReview==="pending"&&s.redistributionVerified===false));
 }
 assert.equal(after.candidates.slice(41).reduce((n,b)=>n+b.exercises.length,0),124);
});

test("original Hanzi quotations and tone-marked Pinyin are unchanged even in newly authored repair contexts",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=PHASE31_CHINESE_HANDOFFS[i];
  for(const pin of spec.encounters){
   assert.ok(receipts[pin.sourceId].includes(pin.quote));
   const base=originals.find(o=>o.lesson.id===pin.lessonId);
   const original=base.lesson.steps.flatMap(step=>step.type==="encounter"?step.examples:[])
     .find(e=>e.targetText===pin.quote);
   assert.equal(original.reading,readings.readings[pin.sourceId][pin.quote]);
   assert.ok(b.lesson.steps[0].examples.some(e=>e.targetText===original.targetText&&
     e.meaning===original.meaning&&e.reading===original.reading));
  }
  for(const e of b.exercises.filter(e=>e.id.endsWith(":independent-tone")||e.id.endsWith(":independent-second-pinyin"))){
   assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
   assert.equal(evaluateExercise(e,e.acceptedAnswers[0].normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
  }
 }
});

test("real listener/purpose handoff makes the first correct source item wrong for the second context and vice versa",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=PHASE31_CHINESE_HANDOFFS[i],h=spec.chineseRoleHandoff;
  assert.equal(h.firstIntent.correctQuote,h.secondIntent.wrongQuote);
  assert.equal(h.firstIntent.wrongQuote,h.secondIntent.correctQuote);
  for(const [part,name] of [[h.firstIntent,":independent-intent-before"],[h.secondIntent,":independent-intent-after"]]){
   const e=b.exercises.find(ex=>ex.id.endsWith(name));
   assert.equal(e.kind,"reading");
   assert.equal(e.sourceAid.targetText,part.correctQuote);
   assert.ok(e.passage.includes("authored scenario, not original dialogue"));
   for(const original of b.lesson.steps[0].examples)
    assert.ok(e.passage.includes(original.targetText+" — "+original.reading));
   assert.equal(evaluateExercise(e,part.correctQuote).kind,"correct");
   assert.equal(evaluateExercise(e,part.wrongQuote).kind,"incorrect");
   assert.equal(evaluateExercise(e,part.wrongQuote).explanation,part.feedback);
  }
 }
});

test("a fourth meaningful original-Hanzi ordering rejects all THREE previously correct authorial situations",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE31_CHINESE_HANDOFFS[i];
  const o=s.chineseSequence.order,second=s.chineseConversation.reversedSequence,
    third=s.chineseRevision.thirdSequence,last=s.chineseRoleHandoff.fourthSequence;
  const ex=b.exercises.find(e=>e.id.endsWith(":independent-fourth-sequence"));
  assert.equal(ex.kind,"ordering");
  assert.deepEqual(ex.tokens,o.tokens);
  const previous=[o.expected,second.expected,third.expected].map(p=>index(o.tokens,p));
  const correct=index(o.tokens,last.expected);
  assert.equal(new Set([...previous,correct]).size,4);
  assert.deepEqual(ex.acceptedAnswers,[correct]);
  assert.equal(evaluateExercise(ex,correct).kind,"correct");
  for(let x=0;x<3;x++){
   assert.equal(evaluateExercise(ex,previous[x]).kind,"incorrect");
   assert.equal(evaluateExercise(ex,previous[x]).explanation,last.previousFeedback[x]);
  }
  assert.deepEqual(revealExercise(ex).expected,[last.expected.join(" ")]);
 }
});

test("eight ungraded independent source-conscious writing tasks support genuine original-player revision",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),writings=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(writings.length,8);
  for(const frame of writings){
   let state=createLessonPlayerState(b,frames.findIndex(f=>f.id===frame.id));
   state=reduceLessonPlayer(state,{type:"draft",value:"第一稿：学生一和另一组人说话。"});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(state).firstSubmittedDraft,"第一稿：学生一和另一组人说话。");
   state=reduceLessonPlayer(state,{type:"revise"});
   state=reduceLessonPlayer(state,{type:"draft",value:"修改后：新说话者正确区分我们和你们。"});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(state).submissions,2);
   assert.equal(activeAttempt(state).outcome?.rubric.length,3);
   assert.equal(activeAttempt(state).firstSubmittedDraft,"第一稿：学生一和另一组人说话。");
  }
 }
});

test("reject fabricated Hanzi, reversed intent drift, repeated order, removed repair, bad permissions and readings",()=>{
 const mutants=[
  a=>{a[0].chineseRoleHandoff.firstIntent.correctQuote="这里是假的";},
  a=>{a[1].chineseRoleHandoff.secondIntent.wrongQuote=a[1].chineseRoleHandoff.secondIntent.correctQuote;},
  a=>{a[2].chineseRoleHandoff.secondIntent.correctQuote=a[2].chineseRoleHandoff.firstIntent.correctQuote;},
  a=>{a[3].chineseRoleHandoff.firstIntent.feedback="";},
  a=>{a[0].chineseRoleHandoff.fourthSequence.expected=[...a[0].chineseSequence.order.expected];},
  a=>{a[1].chineseRoleHandoff.fourthSequence.expected=[...a[1].chineseConversation.reversedSequence.expected];},
  a=>{a[2].chineseRoleHandoff.fourthSequence.expected=[...a[2].chineseRevision.thirdSequence.expected];},
  a=>{a[3].chineseRoleHandoff.fourthSequence.expected[0]=a[3].chineseRoleHandoff.fourthSequence.expected[1];},
  a=>{a[1].chineseRoleHandoff.fourthSequence.previousFeedback[2]="";},
  a=>{a[2].chineseRoleHandoff.independentDialogue.criteria[0]="";},
  a=>{a[3].chineseExpansion.tone.reading="wo de";},
  a=>{a[0].languageId="ja";}
 ];
 for(const mut of mutants){
  const specs=structuredClone(PHASE31_CHINESE_HANDOFFS);mut(specs);
  assert.ok(compile(specs).issues.length);
 }
 for(const mut of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const copies=structuredClone(originals);mut(copies);assert.ok(compile(PHASE31_CHINESE_HANDOFFS,copies).issues.length);
 }
 assert.ok(compile([PHASE31_CHINESE_HANDOFFS[0],PHASE31_CHINESE_HANDOFFS[0]]).issues.some(x=>x.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("canonical checkpoint serialization never saves candidate writing, attempts, first drafts or official learner progress",()=>{
 const map=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(map,originals);
 assert.deepEqual(parseDemoCheckpoint(serialized,originals),map);
 assert.ok(compile([...earlier,...PHASE31_CHINESE_HANDOFFS]).candidates.every(c=>!Object.hasOwn(map,checkpointId(c))));
 assert.doesNotMatch(serialized,/"(?:firstSubmittedDraft|draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
