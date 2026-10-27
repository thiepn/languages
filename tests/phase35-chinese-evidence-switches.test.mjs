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
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint,revealExercise} from "../apps/learner/src/lesson-model.ts";
import {activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance,hasUnsubmittedWriting} from "../apps/learner/src/lesson-player.ts";
const json=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const canonical=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>json("fixtures/"+p+".json").bundles);
const quotes=json("phase16-source-evidence.json").originalSourceQuotes;
const readings=json("phase25-chinese-readings.json");
const earlier=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,
 ...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES,
 ...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS,...PHASE33_CHINESE_COUNTERFACTUALS,
 ...PHASE34_CHINESE_FINAL_ORDERS];
const compile=(specs=PHASE35_CHINESE_EVIDENCE_SWITCHES,fixtures=canonical)=>
 compilePinnedSourceIntake(fixtures,specs);
const extraNames=["independent-evidence-before","independent-evidence-after","independent-third-source-recall","independent-thirteenth-dialogue"];

test("Phase 35 creates four 52-exercise source-bound learner lessons without changing any previous 57 candidate, original 12 lessons or 126 exercises",()=>{
 const old=compile(earlier),newer=compile([...earlier,...PHASE35_CHINESE_EVIDENCE_SWITCHES]);
 assert.deepEqual(old.issues,[]);assert.deepEqual(newer.issues,[]);
 assert.equal(old.candidates.length,57);assert.equal(newer.candidates.length,61);
 assert.deepEqual(newer.candidates.slice(0,57),old.candidates);
 assert.equal(canonical.length,12);
 assert.equal(canonical.reduce((n,b)=>n+b.exercises.length,0),126);
 const existingIds=new Set([...canonical,...old.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 const lessonIds=new Set([...canonical,...old.candidates].map(b=>b.lesson.id));
 for(const b of newer.candidates.slice(57)){
  assert.ok(!lessonIds.has(b.lesson.id));lessonIds.add(b.lesson.id);
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.lesson.contentVersion,"phase35-chinese-source-authored-internal-v1");
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.exercises.length,52);
  assert.equal(framesFor(b).length,57);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,13);
  for(const e of b.exercises){
   assert.ok(!existingIds.has(e.id),"Duplicate canonical/editorial exercise "+e.id);
   existingIds.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  assert.ok(b.lesson.sources.every(s=>s.repository===readings.sourceRepository&&
    s.path===readings.sourcePath&&s.revision===readings.sourceRevision&&
    s.rights==="review-required"&&s.editorialReview==="pending"&&
    s.redistributionVerified===false));
 }
 assert.equal(newer.candidates.slice(57).reduce((n,b)=>n+b.exercises.length,0),208);
});

test("authentic source Hanzi/Pinyin and quote receipts persist across two different speaker decisions with three distinct source meanings",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const b=candidates[i],s=PHASE35_CHINESE_EVIDENCE_SWITCHES[i];
  assert.equal(b.lesson.id,s.id);
  assert.ok(b.lesson.steps[0].examples.length===3);
  for(const example of b.lesson.steps[0].examples){
   const entry=s.encounters.find(x=>x.quote===example.targetText);
   assert.ok(entry,"No original quote custody: "+example.targetText);
   assert.ok(quotes[entry.sourceId].includes(entry.quote));
   assert.equal(example.reading,readings.readings[entry.sourceId][entry.quote]);
  }
  const authored=s.chineseEvidenceSwitch;
  assert.equal(authored.reconsider.correctQuote,authored.first.wrongQuotes[0]);
  assert.ok(authored.reconsider.wrongQuotes.includes(authored.first.correctQuote));
  assert.equal(authored.remaining.quote,authored.first.wrongQuotes[1]);
  assert.equal(new Set([authored.first.correctQuote,authored.reconsider.correctQuote,authored.remaining.quote]).size,3);
  assert.equal(s.encounters.find(x=>x.quote===authored.remaining.quote).sourceId,authored.remaining.sourceId);
  for(const suffix of extraNames){
   assert.ok(b.exercises.some(e=>e.id===s.id+":"+suffix));
  }
 }
});

test("each contextual source reversal has two independently corrected authentic distractors, with full source and original Pinyin evidence visible",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const b=candidates[i],authored=PHASE35_CHINESE_EVIDENCE_SWITCHES[i].chineseEvidenceSwitch;
  for(const [part,suffix] of [[authored.first,extraNames[0]],[authored.reconsider,extraNames[1]]]){
   const e=b.exercises.find(x=>x.id.endsWith(suffix));
   assert.equal(e.kind,"reading");
   assert.deepEqual(e.acceptedAnswers,[part.correctQuote]);
   assert.equal(evaluateExercise(e,part.correctQuote).kind,"correct");
   for(let j=0;j<2;j++){
    const incorrect=evaluateExercise(e,part.wrongQuotes[j]);
    assert.equal(incorrect.kind,"incorrect");
    assert.equal(incorrect.explanation,part.feedback[j]);
   }
   assert.equal(e.sourceAid.targetText,part.correctQuote);
   for(const ex of b.lesson.steps[0].examples){
    assert.ok(e.passage.includes(ex.targetText+" — "+ex.reading));
   }
   assert.match(e.passage,/newly authored|scenario only/);
  }
 }
});

test("the third original Hanzi written reconstruction refuses both competing source answers and does not strip terminal punctuation",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const spec=PHASE35_CHINESE_EVIDENCE_SWITCHES[i].chineseEvidenceSwitch.remaining;
  const e=candidates[i].exercises.find(x=>x.id.endsWith(extraNames[2]));
  assert.equal(e.kind,"typed");
  assert.equal(e.normalization,"unicode-nfc");
  assert.deepEqual(e.acceptedAnswers,[spec.quote]);
  assert.equal(e.sourceAid.targetText,spec.quote);
  assert.equal(evaluateExercise(e,spec.quote).kind,"correct");
  for(let j=0;j<2;j++){
   const wrong=evaluateExercise(e,spec.wrongQuotes[j]);
   assert.equal(wrong.kind,"incorrect");
   assert.equal(wrong.explanation,spec.feedback[j]);
  }
  if(/[。？！]$/u.test(spec.quote)){
   assert.equal(evaluateExercise(e,spec.quote.slice(0,-1)).kind,"incorrect");
  }
  assert.ok(revealExercise(e).expected.includes(spec.quote));
 }
});

test("all thirteen source-conscious writing tasks support voluntary latest-revision recovery after first-draft restoration without giving a grade",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const bundle of candidates){
  const writing=framesFor(bundle).filter(f=>f.exercise?.kind==="free-production");
  assert.equal(writing.length,13);
  for(const frame of writing){
   const i=framesFor(bundle).findIndex(f=>f.id===frame.id);
   let p=createLessonPlayerState(bundle,i);
   const first="第一稿：说明发言人与听者的角色。";
   const second="第二稿：根据新问题重新选择角色。";
   const third="第三稿：保留第一稿来源和新的独立对话。";
   assert.equal(reduceLessonPlayer(p,{type:"restore-last-revision"}),p);
   p=reduceLessonPlayer(p,{type:"draft",value:first});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).latestRevisedDraft,undefined);
   assert.equal(reduceLessonPlayer(p,{type:"restore-last-revision"}),p);
   p=reduceLessonPlayer(p,{type:"revise"});
   p=reduceLessonPlayer(p,{type:"draft",value:second});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).latestRevisedDraft,second);
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   assert.equal(activeAttempt(p).submissions,2);
   p=reduceLessonPlayer(p,{type:"restore-first-draft"});
   assert.equal(activeAttempt(p).draft,first);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(activeAttempt(p).latestRevisedDraft,second);
   assert.equal(mayAdvance(p),false);
   assert.equal(hasUnsubmittedWriting(p),true);
   p=reduceLessonPlayer(p,{type:"restore-last-revision"});
   assert.equal(activeAttempt(p).draft,second);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(mayAdvance(p),false);
   assert.equal(reduceLessonPlayer(p,{type:"restore-last-revision"}),p);
   p=reduceLessonPlayer(p,{type:"draft",value:third});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).outcome.rubric.length,3);
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   assert.equal(activeAttempt(p).latestRevisedDraft,third);
   assert.equal(activeAttempt(p).submissions,3);
   assert.equal(mayAdvance(p),true);
   assert.deepEqual(reduceLessonPlayer(p,{type:"reset"}).attempts,{});
   assert.deepEqual(reduceLessonPlayer(p,{type:"load",bundle,restoredIndex:i}).attempts,{});
  }
 }
});

test("latest revision restore is rejected for recognition, unsent, first-submit, and forced grading events",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b);
  for(const frame of frames.filter(f=>f.exercise?.kind!=="free-production"&&f.exercise)){
   let p=createLessonPlayerState(b,frames.findIndex(f=>f.id===frame.id));
   const before=reduceLessonPlayer(p,{type:"restore-last-revision"});
   assert.equal(before,p);
   p=reduceLessonPlayer(p,{type:"draft",value:"wrong quote"});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).latestRevisedDraft,undefined);
   assert.equal(reduceLessonPlayer(p,{type:"restore-last-revision"}),p);
  }
 }
});

test("source spoofing, quote reversal failure, wrong provenance and rights/Pinyin/locale tampering fail closed",()=>{
 const tamper=[
  a=>{a[0].chineseEvidenceSwitch.first.correctQuote="虚构的句子";},
  a=>{a[1].chineseEvidenceSwitch.first.wrongQuotes[0]=a[1].chineseEvidenceSwitch.first.correctQuote;},
  a=>{a[2].chineseEvidenceSwitch.first.feedback[1]="";},
  a=>{a[3].chineseEvidenceSwitch.reconsider.correctQuote=a[3].chineseEvidenceSwitch.first.correctQuote;},
  a=>{a[0].chineseEvidenceSwitch.reconsider.wrongQuotes[0]=a[0].chineseEvidenceSwitch.reconsider.correctQuote;},
  a=>{a[1].chineseEvidenceSwitch.reconsider.feedback[0]="";},
  a=>{a[2].chineseEvidenceSwitch.remaining.quote=a[2].chineseEvidenceSwitch.first.correctQuote;},
  a=>{a[3].chineseEvidenceSwitch.remaining.sourceId="invalid";},
  a=>{a[0].chineseEvidenceSwitch.remaining.wrongQuotes[1]=a[0].chineseEvidenceSwitch.remaining.quote;},
  a=>{a[1].chineseEvidenceSwitch.remaining.feedback[0]="";},
  a=>{a[2].chineseEvidenceSwitch.dialogue.criteria[1]="";},
  a=>{a[3].languageId="ja";},
  a=>{delete a[0].chineseSixthTransfer;}
 ];
 for(const mutation of tamper){
  const copies=structuredClone(PHASE35_CHINESE_EVIDENCE_SWITCHES);mutation(copies);
  assert.ok(compile(copies).issues.length);
 }
 for(const mutate of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].editorialReview="approved";},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0000000000000000000000000000000000000000";},
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="fake";}
 ]){
  const copies=structuredClone(canonical);mutate(copies);
  assert.ok(compile(PHASE35_CHINESE_EVIDENCE_SWITCHES,copies).issues.length);
 }
});

test("canonical checkpoint roundtrip excludes all additional authored lessons, latest revision, drafts and native learner authorities",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 const positions=Object.fromEntries(canonical.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(positions,canonical);
 assert.deepEqual(parseDemoCheckpoint(serialized,canonical),positions);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(serialized,/firstSubmittedDraft|latestRevisedDraft|speaker|draft|studyEvent|fsrs|reviewGrade|proficiency|languageLevel/);
});
