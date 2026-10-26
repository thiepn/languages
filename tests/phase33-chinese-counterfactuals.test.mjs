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
import {PHASE33_CHINESE_CLARIFICATIONS} from "../apps/learner/src/phase33-chinese-clarifications.ts";
import {PHASE33_CHINESE_COUNTERFACTUALS} from "../apps/learner/src/phase33-chinese-counterfactuals.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {evaluateExercise,framesFor,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt,mayAdvance} from "../apps/learner/src/lesson-player.ts";
const json=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>json("fixtures/"+p+".json").bundles);
const receipts=json("phase16-source-evidence.json").originalSourceQuotes;
const readings=json("phase25-chinese-readings.json");
const previous=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,
 ...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES,
 ...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS];
const compile=(specs=PHASE33_CHINESE_COUNTERFACTUALS,fixtures=originals)=>compilePinnedSourceIntake(fixtures,specs);
const names=["independent-third-voice-counterfactual","independent-reconsider-collective",
 "independent-exact-counterfactual","independent-eleventh-dialogue"];

test("original 49 earlier candidates, original 12/126 canonical, 4 Phase 33 IDs and their first 40 original exercises all remain unchanged",()=>{
 const prev=compile([...previous,...PHASE33_CHINESE_CLARIFICATIONS]);
 const next=compile([...previous,...PHASE33_CHINESE_COUNTERFACTUALS]);
 assert.deepEqual(prev.issues,[]);assert.deepEqual(next.issues,[]);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 assert.equal(prev.candidates.length,53);
 assert.equal(next.candidates.length,53);
 assert.deepEqual(next.candidates.slice(0,49),prev.candidates.slice(0,49));
 const ids=new Set([...originals,...prev.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(let i=0;i<4;i++){
  const before=prev.candidates[49+i],after=next.candidates[49+i];
  assert.equal(after.lesson.id,before.lesson.id);
  assert.equal(after.lesson.contentVersion,before.lesson.contentVersion);
  assert.deepEqual(after.exercises.slice(0,40),before.exercises);
  assert.equal(after.exercises.length,44);
  assert.equal(framesFor(after).length,49);
  assert.equal(after.exercises.filter(e=>e.kind==="free-production").length,11);
  assert.deepEqual(validateLessonBundleV1(after),[]);
  for(const ex of after.exercises.slice(40)){
   assert.equal(ids.has(ex.id),false,ex.id);
   ids.add(ex.id);
   assert.equal(ex.evidence.mayScheduleReview,false);
   assert.equal(ex.evidence.mayAssertProficiency,false);
  }
  assert.ok(after.lesson.sources.every(s=>
    s.repository===readings.sourceRepository&&s.revision===readings.sourceRevision&&
    s.path===readings.sourcePath&&s.rights==="review-required"&&
    s.editorialReview==="pending"&&s.redistributionVerified===false));
 }
});

test("three complementary counterfactual sources are independently attested with unchanged exact Hanzi and tone-marked Pinyin",()=>{
 const {candidates,issues}=compile();
 assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const b=candidates[i],s=PHASE33_CHINESE_COUNTERFACTUALS[i];
  const third=s.chineseCounterfactual;
  const referents=[
   third.thirdVoice.correctQuote,
   third.returnToOriginal.correctQuote,
   third.exactRepair.quote
  ];
  assert.equal(new Set(referents).size,3);
  assert.equal(third.thirdVoice.correctQuote,s.chineseClarification.misunderstood.wrongQuotes[1]);
  assert.equal(third.returnToOriginal.correctQuote,s.chineseClarification.misunderstood.correctQuote);
  assert.equal(third.exactRepair.quote,s.chineseClarification.misunderstood.wrongQuotes[0]);
  for(const e of b.lesson.steps[0].examples){
   const entry=s.encounters.find(x=>x.quote===e.targetText);
   assert.ok(entry);
   assert.ok(receipts[entry.sourceId].includes(entry.quote));
   assert.equal(e.reading,readings.readings[entry.sourceId][entry.quote]);
  }
  assert.ok(s.encounters.some(e=>e.quote===third.exactRepair.quote&&e.sourceId===third.exactRepair.sourceId));
 }
});

test("two changed-speaker readings penalize BOTH distinct authentic wrong source expressions with separate source-specific feedback",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const b=candidates[i],s=PHASE33_CHINESE_COUNTERFACTUALS[i].chineseCounterfactual;
  for(const [part,suffix] of [[s.thirdVoice,names[0]],[s.returnToOriginal,names[1]]]){
   const ex=b.exercises.find(e=>e.id.endsWith(suffix));
   assert.equal(ex.kind,"reading");
   assert.ok(ex.passage.includes("not source dialogue"));
   assert.deepEqual(ex.acceptedAnswers,[part.correctQuote]);
   assert.equal(evaluateExercise(ex,part.correctQuote).kind,"correct");
   for(let j=0;j<2;j++){
    const result=evaluateExercise(ex,part.wrongQuotes[j]);
    assert.equal(result.kind,"incorrect");
    assert.equal(result.explanation,part.feedback[j]);
   }
   for(const original of b.lesson.steps[0].examples)
    assert.ok(ex.passage.includes(original.targetText+" — "+original.reading));
   assert.equal(ex.sourceAid.targetText,part.correctQuote);
  }
 }
});

test("third distinct exact Hanzi reconstruction keeps original punctuation and has both authentic wrong-answer explanations",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(let i=0;i<candidates.length;i++){
  const s=PHASE33_CHINESE_COUNTERFACTUALS[i].chineseCounterfactual.exactRepair;
  const ex=candidates[i].exercises.find(e=>e.id.endsWith(names[2]));
  assert.equal(ex.kind,"typed");assert.equal(ex.normalization,"unicode-nfc");
  assert.deepEqual(ex.acceptedAnswers,[s.quote]);
  assert.equal(ex.sourceAid.targetText,s.quote);
  assert.equal(evaluateExercise(ex,s.quote).kind,"correct");
  if(s.quote.endsWith("。")||s.quote.endsWith("？")){
   assert.equal(evaluateExercise(ex,s.quote.slice(0,-1)).kind,"incorrect");
  }
  for(let j=0;j<2;j++){
   const outcome=evaluateExercise(ex,s.wrongQuotes[j]);
   assert.equal(outcome.kind,"incorrect");
   assert.equal(outcome.explanation,s.feedback[j]);
  }
 }
});

test("all eleven original-player ungraded writing tasks accept authored revision, comparison and first-draft restoration without grading",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b);
  const writings=frames.filter(frame=>frame.exercise?.kind==="free-production");
  assert.equal(writings.length,11);
  for(const frame of writings){
   let p=createLessonPlayerState(b,frames.findIndex(f=>f.id===frame.id));
   const first="第一稿：代表自己的观点。",second="第二稿：听者换了人。";
   p=reduceLessonPlayer(p,{type:"draft",value:first});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   p=reduceLessonPlayer(p,{type:"revise"});
   p=reduceLessonPlayer(p,{type:"draft",value:second});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   assert.equal(activeAttempt(p).submissions,2);
   p=reduceLessonPlayer(p,{type:"restore-first-draft"});
   assert.equal(activeAttempt(p).draft,first);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(mayAdvance(p),false);
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome.kind,"ungraded");
   assert.equal(activeAttempt(p).outcome.rubric.length,3);
   assert.equal(activeAttempt(p).submissions,3);
   assert.equal(p.bundle.exercises.find(e=>e.id===frame.id).evidence.mayScheduleReview,false);
   assert.deepEqual(reduceLessonPlayer(p,{type:"load",bundle:b,restoredIndex:p.index}).attempts,{});
  }
 }
});

test("reject source substitution, counterfeit permissions, false speaker inversion, invented Hanzi and shallow feedback",()=>{
 const mutants=[
  a=>{a[0].chineseCounterfactual.thirdVoice.correctQuote="虚假的句子";},
  a=>{a[1].chineseCounterfactual.thirdVoice.correctQuote=a[1].chineseClarification.misunderstood.correctQuote;},
  a=>{a[2].chineseCounterfactual.returnToOriginal.correctQuote=a[2].chineseCounterfactual.thirdVoice.correctQuote;},
  a=>{a[3].chineseCounterfactual.exactRepair.quote="没有来源的字";},
  a=>{a[0].chineseCounterfactual.exactRepair.sourceId="zh-nonexistent";},
  a=>{a[1].chineseCounterfactual.exactRepair.wrongQuotes[0]=a[1].chineseCounterfactual.exactRepair.quote;},
  a=>{a[2].chineseCounterfactual.thirdVoice.wrongQuotes[1]=a[2].chineseCounterfactual.thirdVoice.wrongQuotes[0];},
  a=>{a[3].chineseCounterfactual.returnToOriginal.feedback[0]="";},
  a=>{a[0].chineseCounterfactual.exactRepair.feedback[1]="";},
  a=>{a[1].chineseCounterfactual.independentDialogue.criteria[0]="";},
  a=>{a[2].languageId="ja";},
  a=>{delete a[3].chineseClarification;}
 ];
 for(const mutate of mutants){
  const copies=structuredClone(PHASE33_CHINESE_COUNTERFACTUALS);mutate(copies);
  assert.ok(compile(copies).issues.length);
 }
 for(const mutate of [
  a=>{a.find(x=>x.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(x=>x.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].editorialReview="approved";},
  a=>{a.find(x=>x.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0000000000000000000000000000000000000000";},
  a=>{a.find(x=>x.lesson.id==="zh:wo:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="unverified";}
 ]){
  const copies=structuredClone(originals);mutate(copies);
  assert.ok(compile(PHASE33_CHINESE_COUNTERFACTUALS,copies).issues.length);
 }
});

test("original canonical checkpoint roundtrip excludes all counterfactual candidate lesson IDs and all authored drafts",()=>{
 const {candidates,issues}=compile();assert.deepEqual(issues,[]);
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const stored=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(stored,originals),positions);
 assert.ok(candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(stored,/firstSubmittedDraft|counterfactual|draft|dialogue|userId|reviewGrade|fsrs|proficiency/);
});
