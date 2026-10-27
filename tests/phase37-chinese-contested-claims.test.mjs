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
import {PHASE33_CHINESE_COUNTERFACTUALS} from "../apps/learner/src/phase33-chinese-counterfactuals.ts";
import {PHASE34_CHINESE_FINAL_ORDERS} from "../apps/learner/src/phase34-chinese-final-orders.ts";
import {PHASE35_CHINESE_EVIDENCE_SWITCHES} from "../apps/learner/src/phase35-chinese-evidence-switches.ts";
import {PHASE36_CHINESE_DELAYED_VERIFICATIONS} from "../apps/learner/src/phase36-chinese-delayed-verifications.ts";
import {PHASE37_CHINESE_CONTESTED_CLAIMS} from "../apps/learner/src/phase37-chinese-contested-claims.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance,canRestoreProtectedDraft,hasUnsubmittedWriting} from "../apps/learner/src/lesson-player.ts";

const json=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>json("fixtures/"+p+".json").bundles);
const quotations=json("phase16-source-evidence.json").originalSourceQuotes;
const pinyin=json("phase25-chinese-readings.json");
const previous=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING,
 ...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,
 ...PHASE30_ENRICHED_PERSPECTIVES,...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS,
 ...PHASE33_CHINESE_COUNTERFACTUALS,...PHASE34_CHINESE_FINAL_ORDERS,...PHASE35_CHINESE_EVIDENCE_SWITCHES,
 ...PHASE36_CHINESE_DELAYED_VERIFICATIONS];
const compile=(specs=PHASE37_CHINESE_CONTESTED_CLAIMS,fixtures=originals)=>compilePinnedSourceIntake(fixtures,specs);
const suffixes=["independent-contested-report","independent-corrected-claim",
 "independent-third-claim-hanzi","independent-contested-pinyin","independent-fifteenth-dialogue"];

test("Phase 37 preserves all 65 previous candidate bundles and all original 12 canonical lessons/126 exercises",()=>{
 const before=compile(previous),after=compile([...previous,...PHASE37_CHINESE_CONTESTED_CLAIMS]);
 assert.deepEqual(before.issues,[]);
 assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,65);
 assert.equal(after.candidates.length,69);
 assert.deepEqual(after.candidates.slice(0,65),before.candidates);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 assert.equal(before.candidates.slice(-4).every(b=>b.exercises.length===57&&framesFor(b).length===62),true);
 const oldExerciseIds=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 const oldLessonIds=new Set([...originals,...before.candidates].map(b=>b.lesson.id));
 for(const b of after.candidates.slice(65)){
  assert.ok(!oldLessonIds.has(b.lesson.id));
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.contentVersion,"phase37-chinese-source-authored-internal-v1");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,62);
  assert.equal(framesFor(b).length,67);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,15);
  for(const exercise of b.exercises){
   assert.ok(!oldExerciseIds.has(exercise.id),"exercise id changed or overwritten: "+exercise.id);
   oldExerciseIds.add(exercise.id);
   assert.equal(exercise.evidence.mayScheduleReview,false);
   assert.equal(exercise.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(s=>s.repository===pinyin.sourceRepository&&
   s.revision===pinyin.sourceRevision&&s.path===pinyin.sourcePath&&
   s.rights==="review-required"&&s.editorialReview==="pending"&&s.redistributionVerified===false));
 }
 assert.equal(after.candidates.slice(65).reduce((n,b)=>n+b.exercises.length,0),248);
});

test("conflicting and corrected original-source meanings are all distinct and preserve quote, ID, written Pinyin and original rights",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],spec=PHASE37_CHINESE_CONTESTED_CLAIMS[i],v=spec.chineseContestedClaim;
  assert.equal(v.dispute.correctQuote,spec.chineseDelayedVerification.returnDecision.correctQuote);
  assert.equal(v.appeal.correctQuote,spec.chineseDelayedVerification.finalHanzi.quote);
  assert.equal(v.thirdSource.quote,spec.chineseDelayedVerification.witness.correctQuote);
  assert.equal(new Set([v.dispute.correctQuote,v.appeal.correctQuote,v.thirdSource.quote]).size,3);
  for(const example of b.lesson.steps[0].examples){
   const original=spec.encounters.find(e=>e.quote===example.targetText);
   assert.ok(original);
   assert.ok(quotations[original.sourceId].includes(original.quote));
   assert.equal(example.reading,pinyin.readings[original.sourceId][original.quote]);
  }
  assert.equal(pinyin.readings[v.pinyin.sourceId][v.pinyin.quote],v.pinyin.reading);
  for(const suffix of suffixes)assert.ok(b.exercises.find(e=>e.id===spec.id+":"+suffix));
 }
});

test("every new contested report and appeal repairs both authentic contextual wrong answers with different grounded feedback",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],spec=PHASE37_CHINESE_CONTESTED_CLAIMS[i].chineseContestedClaim;
  for(const [part,name] of [[spec.dispute,suffixes[0]],[spec.appeal,suffixes[1]]]){
   const e=b.exercises.find(x=>x.id.endsWith(name));
   assert.equal(e.kind,"reading");
   assert.deepEqual(e.acceptedAnswers,[part.correctQuote]);
   assert.equal(evaluateExercise(e,part.correctQuote).kind,"correct");
   assert.match(e.passage,/new editorial practice/);
   for(let j=0;j<2;j++){
    const outcome=evaluateExercise(e,part.wrongQuotes[j]);
    assert.equal(outcome.kind,"incorrect");
    assert.equal(outcome.explanation,part.feedback[j]);
   }
   assert.notEqual(part.feedback[0],part.feedback[1]);
   for(const attested of b.lesson.steps[0].examples)
    assert.ok(e.passage.includes(attested.targetText+" — "+attested.reading));
  }
 }
});

test("third-speaker exact original Hanzi and tone-marked written Pinyin reject original-source confusion and lost punctuation",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const spec=PHASE37_CHINESE_CONTESTED_CLAIMS[i].chineseContestedClaim,b=candidates[i];
  const hanzi=b.exercises.find(x=>x.id.endsWith(suffixes[2]));
  assert.equal(hanzi.kind,"typed");
  assert.equal(hanzi.normalization,"unicode-nfc");
  assert.deepEqual(hanzi.acceptedAnswers,[spec.thirdSource.quote]);
  assert.equal(evaluateExercise(hanzi,spec.thirdSource.quote).kind,"correct");
  if(/[。？]$/u.test(spec.thirdSource.quote))
   assert.equal(evaluateExercise(hanzi,spec.thirdSource.quote.slice(0,-1)).kind,"incorrect");
  for(let j=0;j<2;j++){
   const out=evaluateExercise(hanzi,spec.thirdSource.wrongQuotes[j]);
   assert.equal(out.kind,"incorrect");
   assert.equal(out.explanation,spec.thirdSource.feedback[j]);
  }
  const typed=b.exercises.find(x=>x.id.endsWith(suffixes[3]));
  assert.equal(typed.kind,"typed");
  assert.equal(typed.normalization,"pinyin-tone-marked");
  assert.deepEqual(typed.acceptedAnswers,[spec.pinyin.reading]);
  assert.equal(typed.sourceAid.targetText,spec.pinyin.quote);
  assert.equal(evaluateExercise(typed,spec.pinyin.reading).kind,"correct");
  const falseSource=evaluateExercise(typed,spec.pinyin.sourceMisreading);
  assert.equal(falseSource.kind,"incorrect");
  assert.equal(falseSource.explanation,spec.pinyin.sourceFeedback);
  const plain=spec.pinyin.reading.normalize("NFD").replace(/\p{M}/gu,"").normalize("NFC");
  const unmarked=evaluateExercise(typed,plain);
  assert.equal(unmarked.kind,"incorrect");
  assert.equal(unmarked.explanation,spec.pinyin.unmarkedFeedback);
 }
});

test("every fifteenth independent writing task preserves its submitted history and protects unsent work during historical restore",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),writing=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(writing.length,15);
  for(const f of writing){
   let p=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   const drafts=[
    "第一稿：学生记录了原文和提出问题的人。",
    "第二稿：不同听众改变了原文的意思。",
    "第三稿：第二位证人纠正了上下文。",
    "第四稿：最终版本保留原文且修正了角色。"
   ];
   for(let i=0;i<drafts.length;i++){
    if(i)p=reduceLessonPlayer(p,{type:"revise"});
    p=reduceLessonPlayer(p,{type:"draft",value:drafts[i]});
    p=reduceLessonPlayer(p,{type:"submit"});
    assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   }
   assert.equal(activeAttempt(p).submissions,4);
   assert.equal(activeAttempt(p).firstSubmittedDraft,drafts[0]);
   assert.deepEqual(activeAttempt(p).submittedRevisions,drafts.slice(1));
   p=reduceLessonPlayer(p,{type:"revise"});
   const unsent="未提交的独立稿件：应该保留而非悄悄覆盖。";
   p=reduceLessonPlayer(p,{type:"draft",value:unsent});
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,undefined);
   p=reduceLessonPlayer(p,{type:"restore-revision",index:0});
   assert.equal(activeAttempt(p).draft,drafts[1]);
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,unsent);
   assert.equal(mayAdvance(p),false);
   assert.equal(canRestoreProtectedDraft(activeAttempt(p)),true);
   p=reduceLessonPlayer(p,{type:"restore-protected-draft"});
   assert.equal(activeAttempt(p).draft,unsent);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(canRestoreProtectedDraft(activeAttempt(p)),false);
   const otherUnsent="另一份独立未提交稿件：不能覆盖保护的旧稿。";
   p=reduceLessonPlayer(p,{type:"draft",value:otherUnsent});
   assert.equal(reduceLessonPlayer(p,{type:"restore-last-revision"}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:1}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-protected-draft"}),p);
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,unsent);
   assert.equal(hasUnsubmittedWriting(p),true);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   p=reduceLessonPlayer(p,{type:"restore-protected-draft"});
   assert.equal(activeAttempt(p).draft,unsent);
   assert.equal(activeAttempt(p).outcome,undefined);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).firstSubmittedDraft,drafts[0]);
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,unsent);
   assert.ok(activeAttempt(p).submittedRevisions.length<=3);
   assert.deepEqual(reduceLessonPlayer(p,{type:"reset"}).attempts,{});
   assert.deepEqual(reduceLessonPlayer(p,{type:"load",bundle:b,restoredIndex:0}).attempts,{});
   assert.equal(f.exercise.evidence.mayScheduleReview,false);
  }
 }
});

test("historical protection cannot be fabricated through nonwriting attempts, invalid indexes or first submission",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b);
  for(const f of frames.filter(x=>x.exercise&&x.exercise.kind!=="free-production")){
   let p=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   assert.equal(reduceLessonPlayer(p,{type:"restore-protected-draft"}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
   p=reduceLessonPlayer(p,{type:"draft",value:"unverified"});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,undefined);
   assert.equal(reduceLessonPlayer(p,{type:"restore-protected-draft"}),p);
  }
  const i=frames.findIndex(x=>x.exercise?.kind==="free-production");
  let p=createLessonPlayerState(b,i);
  p=reduceLessonPlayer(p,{type:"draft",value:"第一稿"});
  assert.equal(reduceLessonPlayer(p,{type:"restore-protected-draft"}),p);
  assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
  p=reduceLessonPlayer(p,{type:"submit"});
  assert.equal(reduceLessonPlayer(p,{type:"restore-protected-draft"}),p);
 }
});

test("adversarial mistaken quotes, switched source IDs, source Pinyin, shallow corrections, mismatched rights and locale fail closed",()=>{
 const mutations=[
  a=>{a[0].chineseContestedClaim.dispute.correctQuote="伪造的词";},
  a=>{a[1].chineseContestedClaim.dispute.wrongQuotes[1]=a[1].chineseContestedClaim.dispute.correctQuote;},
  a=>{a[2].chineseContestedClaim.dispute.feedback[0]="";},
  a=>{a[3].chineseContestedClaim.appeal.correctQuote=a[3].chineseContestedClaim.dispute.correctQuote;},
  a=>{a[0].chineseContestedClaim.appeal.wrongQuotes[0]=a[0].chineseContestedClaim.appeal.correctQuote;},
  a=>{a[1].chineseContestedClaim.appeal.feedback[1]="";},
  a=>{a[2].chineseContestedClaim.thirdSource.quote=a[2].chineseContestedClaim.appeal.correctQuote;},
  a=>{a[3].chineseContestedClaim.thirdSource.sourceId="invented";},
  a=>{a[0].chineseContestedClaim.thirdSource.wrongQuotes[0]=a[0].chineseContestedClaim.thirdSource.quote;},
  a=>{a[1].chineseContestedClaim.pinyin.reading="fake";},
  a=>{a[2].chineseContestedClaim.pinyin.sourceMisreading="wrong";},
  a=>{a[3].chineseContestedClaim.pinyin.sourceId="fake";},
  a=>{a[0].chineseContestedClaim.dialogue.criteria[1]="";},
  a=>{a[1].languageId="ja";},
  a=>{delete a[2].chineseDelayedVerification;}
 ];
 for(const mutate of mutations){
  const copy=structuredClone(PHASE37_CHINESE_CONTESTED_CLAIMS);mutate(copy);
  assert.ok(compile(copy).issues.length);
 }
 for(const mutate of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].editorialReview="approved";},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0000000000000000000000000000000000000000";},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(x=>x.type==="encounter").examples[0].reading="invented";}
 ]){
  const changed=structuredClone(originals);mutate(changed);
  assert.ok(compile(PHASE37_CHINESE_CONTESTED_CLAIMS,changed).issues.length);
 }
});

test("canonical checkpoint roundtrip never serializes protected unsent text, historical drafts, rights decisions or native learner status",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const stored=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(stored,originals),positions);
 assert.ok(candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(stored,/firstSubmittedDraft|latestRevisedDraft|protectedUnsubmittedDraft|submittedRevisions|sourceMisreading|draft|fsrs|grade|proficiency/);
});
