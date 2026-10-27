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
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance,hasUnsubmittedWriting} from "../apps/learner/src/lesson-player.ts";

const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const original=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>read("fixtures/"+p+".json").bundles);
const receipts=read("phase16-source-evidence.json").originalSourceQuotes;
const readings=read("phase25-chinese-readings.json");
const previous=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,
 ...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES,
 ...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS,...PHASE33_CHINESE_COUNTERFACTUALS,
 ...PHASE34_CHINESE_FINAL_ORDERS,...PHASE35_CHINESE_EVIDENCE_SWITCHES];
const compile=(specs=PHASE36_CHINESE_DELAYED_VERIFICATIONS,fixtures=original)=>
 compilePinnedSourceIntake(fixtures,specs);
const names=["independent-third-witness","independent-original-return","independent-after-witness-hanzi","independent-after-witness-pinyin","independent-fourteenth-dialogue"];

test("Phase 36 adds four 57-exercise internal lessons while preserving 61 predecessor candidates and original 12/126",()=>{
 const before=compile(previous),after=compile([...previous,...PHASE36_CHINESE_DELAYED_VERIFICATIONS]);
 assert.deepEqual(before.issues,[]);assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,61);assert.equal(after.candidates.length,65);
 assert.deepEqual(after.candidates.slice(0,61),before.candidates);
 assert.equal(original.length,12);
 assert.equal(original.reduce((n,b)=>n+b.exercises.length,0),126);
 const existing=new Set([...original,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 const lessons=new Set([...original,...before.candidates].map(b=>b.lesson.id));
 for(const b of after.candidates.slice(61)){
  assert.ok(!lessons.has(b.lesson.id));lessons.add(b.lesson.id);
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.lesson.contentVersion,"phase36-chinese-source-authored-internal-v1");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,57);
  assert.equal(framesFor(b).length,62);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,14);
  for(const e of b.exercises){
   assert.ok(!existing.has(e.id),"Exercise ID may not replace earlier version: "+e.id);
   existing.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(src=>src.repository===readings.sourceRepository&&
    src.revision===readings.sourceRevision&&src.path===readings.sourcePath&&
    src.rights==="review-required"&&src.editorialReview==="pending"&&
    src.redistributionVerified===false));
 }
 assert.equal(after.candidates.slice(61).reduce((total,b)=>total+b.exercises.length,0),228);
});

test("new witness decisions, returns and typed Hanzi are three distinct original excerpts with exact source receipts",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],spec=PHASE36_CHINESE_DELAYED_VERIFICATIONS[i],d=spec.chineseDelayedVerification;
  assert.equal(new Set([d.witness.correctQuote,d.returnDecision.correctQuote,d.finalHanzi.quote]).size,3);
  assert.equal(d.witness.correctQuote,spec.chineseEvidenceSwitch.remaining.quote);
  assert.equal(d.returnDecision.correctQuote,spec.chineseEvidenceSwitch.first.correctQuote);
  assert.equal(d.finalHanzi.quote,spec.chineseEvidenceSwitch.reconsider.correctQuote);
  assert.ok(b.lesson.steps[0].examples.length===3);
  for(const example of b.lesson.steps[0].examples){
   const provenance=spec.encounters.find(x=>x.quote===example.targetText);
   assert.ok(provenance);
   assert.ok(receipts[provenance.sourceId].includes(provenance.quote));
   assert.equal(example.reading,readings.readings[provenance.sourceId][provenance.quote]);
  }
  assert.equal(readings.readings[d.writtenPinyin.sourceId][d.writtenPinyin.quote],d.writtenPinyin.reading);
  assert.ok(b.lesson.steps[0].examples.some(e=>e.targetText!==d.writtenPinyin.quote&&e.reading===d.writtenPinyin.sourceMisreading));
  for(const suffix of names)assert.ok(b.exercises.some(e=>e.id===spec.id+":"+suffix));
 }
});

test("witness verification and return each reject two independently incorrect authentic excerpts with exact correction feedback",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],d=PHASE36_CHINESE_DELAYED_VERIFICATIONS[i].chineseDelayedVerification;
  for(const [part,suffix] of [[d.witness,names[0]],[d.returnDecision,names[1]]]){
   const e=b.exercises.find(x=>x.id.endsWith(suffix));
   assert.equal(e.kind,"reading");assert.equal(e.normalization,"literal");
   assert.deepEqual(e.acceptedAnswers,[part.correctQuote]);
   assert.match(e.passage,/editorial scene, not source transcript/);
   assert.equal(evaluateExercise(e,part.correctQuote).kind,"correct");
   for(let j=0;j<2;j++){
    const wrong=evaluateExercise(e,part.wrongQuotes[j]);
    assert.equal(wrong.kind,"incorrect");
    assert.equal(wrong.explanation,part.feedback[j]);
   }
   for(const original of b.lesson.steps[0].examples)
    assert.ok(e.passage.includes(original.targetText+" — "+original.reading));
  }
 }
});

test("post-witness exact Hanzi and exact original written Pinyin retain separate meaning-specific wrong-source feedback",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const d=PHASE36_CHINESE_DELAYED_VERIFICATIONS[i].chineseDelayedVerification,b=candidates[i];
  const hanzi=b.exercises.find(e=>e.id.endsWith(names[2]));
  assert.equal(hanzi.kind,"typed");assert.equal(hanzi.normalization,"unicode-nfc");
  assert.deepEqual(hanzi.acceptedAnswers,[d.finalHanzi.quote]);
  assert.equal(evaluateExercise(hanzi,d.finalHanzi.quote).kind,"correct");
  if(/[。！？]$/u.test(d.finalHanzi.quote))
   assert.equal(evaluateExercise(hanzi,d.finalHanzi.quote.slice(0,-1)).kind,"incorrect");
  for(let j=0;j<2;j++){
   const r=evaluateExercise(hanzi,d.finalHanzi.wrongQuotes[j]);
   assert.equal(r.kind,"incorrect");assert.equal(r.explanation,d.finalHanzi.feedback[j]);
  }
  const roman=b.exercises.find(e=>e.id.endsWith(names[3]));
  assert.equal(roman.kind,"typed");assert.equal(roman.normalization,"pinyin-tone-marked");
  assert.deepEqual(roman.acceptedAnswers,[d.writtenPinyin.reading]);
  assert.equal(roman.sourceAid.targetText,d.writtenPinyin.quote);
  assert.equal(evaluateExercise(roman,d.writtenPinyin.reading).kind,"correct");
  const other=evaluateExercise(roman,d.writtenPinyin.sourceMisreading);
  assert.equal(other.kind,"incorrect");assert.equal(other.explanation,d.writtenPinyin.sourceFeedback);
  const plain=d.writtenPinyin.reading.normalize("NFD").replace(/\p{M}/gu,"").normalize("NFC");
  const unmarked=evaluateExercise(roman,plain);
  assert.equal(unmarked.kind,"incorrect");
  assert.equal(unmarked.explanation,d.writtenPinyin.unmarkedFeedback);
 }
});

test("original Phase 05 player keeps at most three unique submitted revisions and supports selective historical restoration across all 14 writing tasks",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const bundle of candidates){
  const frames=framesFor(bundle),writings=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(writings.length,14);
  for(const f of writings){
   let p=createLessonPlayerState(bundle,frames.findIndex(frame=>frame.id===f.id));
   const drafts=[
    "第一稿：先报告团队，然后让听者发言。",
    "第二稿：新增一位听者核对原文。",
    "第三稿：修正了团体与个人的区别。",
    "第四稿：重新安排最后一位证人的发言。"
   ];
   for(let i=0;i<drafts.length;i++){
    if(i>0)p=reduceLessonPlayer(p,{type:"revise"});
    p=reduceLessonPlayer(p,{type:"draft",value:drafts[i]});
    p=reduceLessonPlayer(p,{type:"submit"});
    assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   }
   assert.equal(activeAttempt(p).submissions,4);
   assert.equal(activeAttempt(p).firstSubmittedDraft,drafts[0]);
   assert.equal(activeAttempt(p).latestRevisedDraft,drafts[3]);
   assert.deepEqual(activeAttempt(p).submittedRevisions,drafts.slice(1));
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:-1}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:2}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0.5}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:NaN}),p);
   p=reduceLessonPlayer(p,{type:"restore-revision",index:0});
   assert.equal(activeAttempt(p).draft,drafts[1]);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(mayAdvance(p),false);
   assert.equal(hasUnsubmittedWriting(p),true);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
   p=reduceLessonPlayer(p,{type:"restore-last-revision"});
   assert.equal(activeAttempt(p).draft,drafts[3]);
   assert.equal(activeAttempt(p).outcome,undefined);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.deepEqual(activeAttempt(p).submittedRevisions,drafts.slice(1));
   p=reduceLessonPlayer(p,{type:"restore-first-draft"});
   assert.equal(activeAttempt(p).draft,drafts[0]);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(activeAttempt(p).firstSubmittedDraft,drafts[0]);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:1}).attempts[f.id].draft,drafts[2]);
   assert.deepEqual(reduceLessonPlayer(p,{type:"reset"}).attempts,{});
   assert.deepEqual(reduceLessonPlayer(p,{type:"load",bundle,restoredIndex:0}).attempts,{});
   assert.equal(f.exercise.evidence.mayScheduleReview,false);
  }
 }
});

test("historical restore is inert before independently distinct revised submissions and on all recognition tasks",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b);
  for(const f of frames.filter(x=>x.exercise&&x.exercise.kind!=="free-production")){
   let p=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
   p=reduceLessonPlayer(p,{type:"draft",value:"not an authentic excerpt"});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).submittedRevisions,undefined);
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
  }
  const idx=frames.findIndex(x=>x.exercise?.kind==="free-production");
  let p=createLessonPlayerState(b,idx);
  p=reduceLessonPlayer(p,{type:"draft",value:"初稿"});
  p=reduceLessonPlayer(p,{type:"submit"});
  assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
  p=reduceLessonPlayer(p,{type:"revise"});
  p=reduceLessonPlayer(p,{type:"draft",value:"修订稿"});
  p=reduceLessonPlayer(p,{type:"submit"});
  assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
 }
});

test("source spoofing, false referents, exact reading drift, shallow authoring, changed locale and original rights mutations all fail closed",()=>{
 const mutated=[
  a=>{a[0].chineseDelayedVerification.witness.correctQuote="杜撰字";},
  a=>{a[1].chineseDelayedVerification.witness.wrongQuotes[0]=a[1].chineseDelayedVerification.witness.correctQuote;},
  a=>{a[2].chineseDelayedVerification.witness.feedback[1]="";},
  a=>{a[3].chineseDelayedVerification.returnDecision.correctQuote=a[3].chineseDelayedVerification.witness.correctQuote;},
  a=>{a[0].chineseDelayedVerification.returnDecision.wrongQuotes[1]=a[0].chineseDelayedVerification.returnDecision.correctQuote;},
  a=>{a[1].chineseDelayedVerification.returnDecision.feedback[0]="";},
  a=>{a[2].chineseDelayedVerification.finalHanzi.quote=a[2].chineseDelayedVerification.witness.correctQuote;},
  a=>{a[3].chineseDelayedVerification.finalHanzi.sourceId="unverified-source";},
  a=>{a[0].chineseDelayedVerification.finalHanzi.wrongQuotes[0]=a[0].chineseDelayedVerification.finalHanzi.quote;},
  a=>{a[1].chineseDelayedVerification.writtenPinyin.reading="bu shi";},
  a=>{a[2].chineseDelayedVerification.writtenPinyin.sourceMisreading="unverified pinyin";},
  a=>{a[3].chineseDelayedVerification.writtenPinyin.sourceId="unverified";},
  a=>{a[0].chineseDelayedVerification.dialogue.criteria[2]="";},
  a=>{a[1].languageId="fr";},
  a=>{delete a[2].chineseEvidenceSwitch;}
 ];
 for(const mutation of mutated){
  const copy=structuredClone(PHASE36_CHINESE_DELAYED_VERIFICATIONS);
  mutation(copy);
  assert.ok(compile(copy).issues.length);
 }
 for(const mutation of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].editorialReview="approved";},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0000000000000000000000000000000000000000";},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="invented";}
 ]){
  const copy=structuredClone(original);mutation(copy);
  assert.ok(compile(PHASE36_CHINESE_DELAYED_VERIFICATIONS,copy).issues.length);
 }
});

test("checkpoint-only persistence contains neither Phase 36 candidates nor historical writing, native events or invented grades",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 const positions=Object.fromEntries(original.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const stored=serializeDemoCheckpoint(positions,original);
 assert.deepEqual(parseDemoCheckpoint(stored,original),positions);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(stored,/submittedRevisions|firstSubmittedDraft|latestRevisedDraft|sourceMisreading|draft|schedule|grade|fsrs|proficiency/);
});
