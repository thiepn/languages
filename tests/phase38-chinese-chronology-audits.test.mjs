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
import {PHASE38_CHINESE_CHRONOLOGY_AUDITS} from "../apps/learner/src/phase38-chinese-chronology-audits.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint,revealExercise} from "../apps/learner/src/lesson-model.ts";
import {
 activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance,
 canProtectSecondUnsubmittedDraft,canRestoreSecondProtectedDraft,canRestoreProtectedDraft,
 hasUnsubmittedWriting
} from "../apps/learner/src/lesson-player.ts";

const json=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>json("fixtures/"+p+".json").bundles);
const quotations=json("phase16-source-evidence.json").originalSourceQuotes;
const pinyin=json("phase25-chinese-readings.json");
const previous=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING,
 ...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,
 ...PHASE30_ENRICHED_PERSPECTIVES,...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS,
 ...PHASE33_CHINESE_COUNTERFACTUALS,...PHASE34_CHINESE_FINAL_ORDERS,...PHASE35_CHINESE_EVIDENCE_SWITCHES,
 ...PHASE36_CHINESE_DELAYED_VERIFICATIONS,...PHASE37_CHINESE_CONTESTED_CLAIMS];
const compile=(specs=PHASE38_CHINESE_CHRONOLOGY_AUDITS,fixtures=originals)=>
 compilePinnedSourceIntake(fixtures,specs);
const names=["independent-time-first","independent-time-corroboration","independent-timestamp-order",
 "independent-final-exact-hanzi","independent-first-original-pinyin","independent-sixteenth-dialogue"];
const otherOrders=([a,b,c])=>[[a,c,b],[b,a,c],[b,c,a],[c,a,b],[c,b,a]];
const orderKey=(tokens,order)=>order.map(q=>tokens.indexOf(q)).join(",");

test("all 69 existing candidate bundles and the original 12/126 remain identical while four new 68-exercise lessons are source-bound",()=>{
 const before=compile(previous),after=compile([...previous,...PHASE38_CHINESE_CHRONOLOGY_AUDITS]);
 assert.deepEqual(before.issues,[]);assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,69);assert.equal(after.candidates.length,73);
 assert.deepEqual(after.candidates.slice(0,69),before.candidates);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const used=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 const lessonIds=new Set([...originals,...before.candidates].map(b=>b.lesson.id));
 assert.ok(before.candidates.slice(65).every(b=>b.exercises.length===62&&framesFor(b).length===67&&b.exercises.filter(e=>e.kind==="free-production").length===15));
 for(const b of after.candidates.slice(69)){
  assert.ok(!lessonIds.has(b.lesson.id));lessonIds.add(b.lesson.id);
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.lesson.contentVersion,"phase38-chinese-source-authored-internal-v1");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,68);
  assert.equal(framesFor(b).length,73);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,16);
  for(const e of b.exercises){
   assert.equal(used.has(e.id),false,"Duplicate original exercise ID "+e.id);
   used.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(s=>s.repository===pinyin.sourceRepository&&
    s.path===pinyin.sourcePath&&s.revision===pinyin.sourceRevision&&
    s.rights==="review-required"&&s.editorialReview==="pending"&&
    s.redistributionVerified===false));
 }
 assert.equal(after.candidates.slice(69).reduce((sum,b)=>sum+b.exercises.length,0),272);
});

test("all new original Hanzi and tone-marked source Pinyin retain Phase 16 exact-quote receipts and unique Phase 38 custody",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],spec=PHASE38_CHINESE_CHRONOLOGY_AUDITS[i],chron=spec.chineseChronologyAudit;
  assert.equal(b.lesson.id,spec.id);
  const originalExamples=b.lesson.steps[0].examples;
  assert.equal(originalExamples.length,3);
  for(const e of originalExamples){
   const receipt=spec.encounters.find(x=>x.quote===e.targetText);
   assert.ok(receipt);
   assert.ok(quotations[receipt.sourceId].includes(receipt.quote));
   assert.equal(e.reading,pinyin.readings[receipt.sourceId][receipt.quote]);
  }
  assert.deepEqual(
   new Set([chron.opening.correctQuote,chron.newEvidence.correctQuote,chron.hanzi.quote]),
   new Set([spec.chineseContestedClaim.dispute.correctQuote,
    spec.chineseContestedClaim.appeal.correctQuote,spec.chineseContestedClaim.thirdSource.quote])
  );
  assert.deepEqual(chron.chronology.expected,[chron.opening.correctQuote,chron.newEvidence.correctQuote,chron.hanzi.quote]);
  assert.equal(spec.encounters.find(e=>e.quote===chron.hanzi.quote).sourceId,chron.hanzi.sourceId);
  assert.equal(pinyin.readings[chron.pinyin.sourceId][chron.pinyin.quote],chron.pinyin.reading);
  assert.ok(originalExamples.some(e=>e.targetText!==chron.pinyin.quote&&e.reading===chron.pinyin.sourceMisreading));
  for(const name of names)assert.ok(b.exercises.some(e=>e.id===spec.id+":"+name));
 }
});

test("two changed-timestamp readings each reject both other authentic source excerpts with independent feedback, while displaying all original Pinyin",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],data=PHASE38_CHINESE_CHRONOLOGY_AUDITS[i].chineseChronologyAudit;
  for(const [part,suffix] of [[data.opening,names[0]],[data.newEvidence,names[1]]]){
   const e=b.exercises.find(ex=>ex.id.endsWith(suffix));
   assert.equal(e.kind,"reading");
   assert.deepEqual(e.acceptedAnswers,[part.correctQuote]);
   assert.match(e.passage,/new editorial scene/);
   assert.equal(evaluateExercise(e,part.correctQuote).kind,"correct");
   for(let j=0;j<2;j++){
    const wrong=evaluateExercise(e,part.wrongQuotes[j]);
    assert.equal(wrong.kind,"incorrect");assert.equal(wrong.explanation,part.feedback[j]);
   }
   for(const original of b.lesson.steps[0].examples)
    assert.ok(e.passage.includes(original.targetText+" — "+original.reading));
  }
 }
});

test("the temporal audit orders original source excerpts by a NEW timestamp, explaining all five distinct wrong permutations",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const spec=PHASE38_CHINESE_CHRONOLOGY_AUDITS[i],chron=spec.chineseChronologyAudit.chronology;
  const ex=candidates[i].exercises.find(e=>e.id.endsWith(names[2]));
  assert.equal(ex.kind,"ordering");assert.deepEqual(ex.tokens,spec.chineseSequence.order.tokens);
  const right=orderKey(ex.tokens,chron.expected);
  assert.deepEqual(ex.acceptedAnswers,[right]);
  assert.equal(evaluateExercise(ex,right).kind,"correct");
  const wrong=otherOrders(chron.expected);
  assert.equal(new Set([right,...wrong.map(a=>orderKey(ex.tokens,a))]).size,6);
  for(let j=0;j<5;j++){
   const result=evaluateExercise(ex,orderKey(ex.tokens,wrong[j]));
   assert.equal(result.kind,"incorrect");assert.equal(result.explanation,chron.wrongFeedback[j]);
  }
  const revealed=revealExercise(ex);
  assert.ok(revealed.expected.includes(chron.expected.join(" ")));
 }
});

test("exact original Hanzi including final punctuation and exact source Pinyin reject meaning-confused and unmarked alternatives",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<4;i++){
  const b=candidates[i],d=PHASE38_CHINESE_CHRONOLOGY_AUDITS[i].chineseChronologyAudit;
  const h=b.exercises.find(e=>e.id.endsWith(names[3]));
  assert.equal(h.kind,"typed");assert.equal(h.normalization,"unicode-nfc");
  assert.deepEqual(h.acceptedAnswers,[d.hanzi.quote]);
  assert.equal(evaluateExercise(h,d.hanzi.quote).kind,"correct");
  if(/[。！？]$/u.test(d.hanzi.quote))assert.equal(evaluateExercise(h,d.hanzi.quote.slice(0,-1)).kind,"incorrect");
  for(let j=0;j<2;j++){
   const x=evaluateExercise(h,d.hanzi.wrongQuotes[j]);
   assert.equal(x.kind,"incorrect");assert.equal(x.explanation,d.hanzi.feedback[j]);
  }
  const p=b.exercises.find(e=>e.id.endsWith(names[4]));
  assert.equal(p.kind,"typed");assert.equal(p.normalization,"pinyin-tone-marked");
  assert.deepEqual(p.acceptedAnswers,[d.pinyin.reading]);
  assert.equal(p.sourceAid.targetText,d.pinyin.quote);
  assert.equal(evaluateExercise(p,d.pinyin.reading).kind,"correct");
  const other=evaluateExercise(p,d.pinyin.sourceMisreading);
  assert.equal(other.kind,"incorrect");assert.equal(other.explanation,d.pinyin.sourceFeedback);
  const unmarked=d.pinyin.reading.normalize("NFD").replace(/\p{M}/gu,"").normalize("NFC");
  const marked=evaluateExercise(p,unmarked);
  assert.equal(marked.kind,"incorrect");assert.equal(marked.explanation,d.pinyin.unmarkedFeedback);
 }
});

test("all sixteen original-player writing tasks can recover two independently authored unsent drafts and preserve three submitted revisions without grades",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),written=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(written.length,16);
  for(const f of written){
   let p=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   const drafts=[
    "第一稿：新角色的时间顺序来自不同的书面证据。",
    "第二稿：换一种说话人观点并重新确认原文。",
    "第三稿：后来记录了访客加入时的角色转换。",
    "第四稿：重新核对来源及其真实时间。"
   ];
   for(let i=0;i<drafts.length;i++){
    if(i>0)p=reduceLessonPlayer(p,{type:"revise"});
    p=reduceLessonPlayer(p,{type:"draft",value:drafts[i]});
    p=reduceLessonPlayer(p,{type:"submit"});
    assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   }
   assert.deepEqual(activeAttempt(p).submittedRevisions,drafts.slice(1));
   assert.equal(activeAttempt(p).submissions,4);
   p=reduceLessonPlayer(p,{type:"revise"});
   const a="未提交甲：第一份独立证人记录还需要修改。";
   const c="未提交乙：第二份纠正来源的独立草稿。";
   const d="未提交丙：两份保存后第三份不能悄悄覆盖。";
   p=reduceLessonPlayer(p,{type:"draft",value:a});
   p=reduceLessonPlayer(p,{type:"restore-revision",index:0});
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,a);
   assert.equal(activeAttempt(p).draft,drafts[1]);
   assert.equal(activeAttempt(p).outcome,undefined);
   p=reduceLessonPlayer(p,{type:"restore-protected-draft"});
   assert.equal(activeAttempt(p).draft,a);
   p=reduceLessonPlayer(p,{type:"draft",value:c});
   assert.equal(canProtectSecondUnsubmittedDraft(activeAttempt(p)),true);
   assert.equal(reduceLessonPlayer(p,{type:"restore-last-revision"}),p);
   p=reduceLessonPlayer(p,{type:"protect-second-unsent-draft"});
   assert.equal(activeAttempt(p).secondProtectedUnsubmittedDraft,c);
   assert.equal(canProtectSecondUnsubmittedDraft(activeAttempt(p)),false);
   p=reduceLessonPlayer(p,{type:"restore-last-revision"});
   assert.equal(activeAttempt(p).draft,drafts[3]);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(mayAdvance(p),false);
   assert.equal(hasUnsubmittedWriting(p),true);
   assert.equal(canRestoreProtectedDraft(activeAttempt(p)),true);
   assert.equal(canRestoreSecondProtectedDraft(activeAttempt(p)),true);
   p=reduceLessonPlayer(p,{type:"restore-second-protected-draft"});
   assert.equal(activeAttempt(p).draft,c);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(canRestoreProtectedDraft(activeAttempt(p)),true);
   p=reduceLessonPlayer(p,{type:"restore-protected-draft"});
   assert.equal(activeAttempt(p).draft,a);
   assert.equal(canRestoreSecondProtectedDraft(activeAttempt(p)),true);
   p=reduceLessonPlayer(p,{type:"restore-second-protected-draft"});
   assert.equal(activeAttempt(p).draft,c);
   p=reduceLessonPlayer(p,{type:"draft",value:d});
   assert.equal(reduceLessonPlayer(p,{type:"restore-revision",index:0}),p);
   assert.equal(reduceLessonPlayer(p,{type:"protect-second-unsent-draft"}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-second-protected-draft"}),p);
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,a);
   assert.equal(activeAttempt(p).secondProtectedUnsubmittedDraft,c);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   p=reduceLessonPlayer(p,{type:"restore-protected-draft"});
   assert.equal(activeAttempt(p).draft,a);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(mayAdvance(p),false);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).firstSubmittedDraft,drafts[0]);
   assert.equal(activeAttempt(p).protectedUnsubmittedDraft,a);
   assert.equal(activeAttempt(p).secondProtectedUnsubmittedDraft,c);
   assert.ok(activeAttempt(p).submittedRevisions.length<=3);
   assert.deepEqual(reduceLessonPlayer(p,{type:"reset"}).attempts,{});
   assert.deepEqual(reduceLessonPlayer(p,{type:"load",bundle:b,restoredIndex:0}).attempts,{});
  }
 }
});

test("two-slot protection is inert for unsent first drafts, graded tasks, invalid restores and occupied slots",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b);
  for(const f of frames.filter(x=>x.exercise&&x.exercise.kind!=="free-production")){
   let p=createLessonPlayerState(b,frames.findIndex(x=>x.id===f.id));
   assert.equal(reduceLessonPlayer(p,{type:"protect-second-unsent-draft"}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-second-protected-draft"}),p);
   p=reduceLessonPlayer(p,{type:"draft",value:"incorrect"});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(reduceLessonPlayer(p,{type:"protect-second-unsent-draft"}),p);
   assert.equal(reduceLessonPlayer(p,{type:"restore-second-protected-draft"}),p);
  }
  const idx=frames.findIndex(x=>x.exercise?.kind==="free-production");
  let p=createLessonPlayerState(b,idx);
  p=reduceLessonPlayer(p,{type:"draft",value:"未提交甲"});
  assert.equal(reduceLessonPlayer(p,{type:"protect-second-unsent-draft"}),p);
  assert.equal(reduceLessonPlayer(p,{type:"restore-second-protected-draft"}),p);
  p=reduceLessonPlayer(p,{type:"submit"});
  assert.equal(reduceLessonPlayer(p,{type:"protect-second-unsent-draft"}),p);
 }
});

test("hostile source/rights/locale/Pinyin data and mismatched timeline fail closed instead of producing unverifiable Chinese lessons",()=>{
 const mutants=[
  a=>{a[0].chineseChronologyAudit.opening.correctQuote="虚假的短语";},
  a=>{a[1].chineseChronologyAudit.opening.wrongQuotes[0]=a[1].chineseChronologyAudit.opening.correctQuote;},
  a=>{a[2].chineseChronologyAudit.opening.feedback[1]="";},
  a=>{a[3].chineseChronologyAudit.newEvidence.correctQuote=a[3].chineseChronologyAudit.opening.correctQuote;},
  a=>{a[0].chineseChronologyAudit.newEvidence.feedback[1]="";},
  a=>{const v=a[1].chineseChronologyAudit.chronology.expected;a[1].chineseChronologyAudit.chronology.expected=[v[1],v[0],v[2]];},
  a=>{a[2].chineseChronologyAudit.chronology.expected[0]=a[2].chineseChronologyAudit.chronology.expected[1];},
  a=>{a[3].chineseChronologyAudit.chronology.wrongFeedback[4]="";},
  a=>{a[0].chineseChronologyAudit.hanzi.quote="未有来源";},
  a=>{a[1].chineseChronologyAudit.hanzi.sourceId="not-attested";},
  a=>{a[2].chineseChronologyAudit.hanzi.wrongQuotes[0]=a[2].chineseChronologyAudit.hanzi.quote;},
  a=>{a[3].chineseChronologyAudit.pinyin.reading="wo de";},
  a=>{a[0].chineseChronologyAudit.pinyin.sourceMisreading="fake pinyin";},
  a=>{a[1].chineseChronologyAudit.pinyin.sourceId="fake";},
  a=>{a[2].chineseChronologyAudit.dialogue.criteria[2]="";},
  a=>{a[3].languageId="fr";},
  a=>{delete a[0].chineseContestedClaim;}
 ];
 for(const mutate of mutants){
  const copies=structuredClone(PHASE38_CHINESE_CHRONOLOGY_AUDITS);
  mutate(copies);
  assert.ok(compile(copies).issues.length);
 }
 for(const mutate of [
  a=>{a.find(x=>x.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(x=>x.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].editorialReview="approved";},
  a=>{a.find(x=>x.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0000000000000000000000000000000000000000";},
  a=>{a.find(x=>x.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="not original";}
 ]){
  const fixtures=structuredClone(originals);mutate(fixtures);
  assert.ok(compile(PHASE38_CHINESE_CHRONOLOGY_AUDITS,fixtures).issues.length);
 }
});

test("source-only demo checkpoints exclude both unsent rescue copies, submitted versions and all 73 unpublished candidates",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(serialized,originals),positions);
 assert.ok(candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(serialized,/protectedUnsubmittedDraft|secondProtectedUnsubmittedDraft|firstSubmittedDraft|latestRevisedDraft|submittedRevisions|dialogue|sourceMisreading|draft|fsrs|reviewGrade|proficiency/);
});
