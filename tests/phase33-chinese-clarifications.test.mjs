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
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const load=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>load("fixtures/"+p+".json").bundles);
const receipts=load("phase16-source-evidence.json").originalSourceQuotes;
const pinyin=load("phase25-chinese-readings.json");
const earlier=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,
 ...PHASE25_CHINESE_AUTHORING,...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,
 ...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS,...PHASE30_ENRICHED_PERSPECTIVES,
 ...PHASE31_CHINESE_HANDOFFS,...PHASE32_CHINESE_NEGOTIATIONS];
const compile=(specs=PHASE33_CHINESE_CLARIFICATIONS,fixtures=originals)=>compilePinnedSourceIntake(fixtures,specs);

test("four distinct Phase 33 clarification lessons preserve exactly all 49 prior candidates and canonical 12/126",()=>{
 const before=compile(earlier),after=compile([...earlier,...PHASE33_CHINESE_CLARIFICATIONS]);
 assert.deepEqual(before.issues,[]);assert.deepEqual(after.issues,[]);
 assert.equal(before.candidates.length,49);assert.equal(after.candidates.length,53);
 assert.deepEqual(after.candidates.slice(0,49),before.candidates);
 assert.equal(originals.length,12);assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 const ids=new Set([...originals,...before.candidates].flatMap(b=>b.exercises.map(e=>e.id)));
 for(const b of after.candidates.slice(49)){
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.equal(b.lesson.languageId,"zh");
  assert.equal(b.lesson.publication,"internal-fixture");
  assert.equal(b.lesson.contentVersion,"phase33-chinese-source-authored-internal-v1");
  assert.equal(b.exercises.length,40);
  assert.equal(framesFor(b).length,45);
  assert.equal(b.exercises.filter(e=>e.kind==="free-production").length,10);
  assert.ok(b.lesson.sources.every(s=>s.repository===pinyin.sourceRepository&&
    s.path===pinyin.sourcePath&&s.revision===pinyin.sourceRevision&&
    s.rights==="review-required"&&s.editorialReview==="pending"&&
    s.redistributionVerified===false));
  for(const e of b.exercises){
   assert.equal(ids.has(e.id),false,e.id);ids.add(e.id);
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
 }
 assert.equal(after.candidates.slice(49).reduce((n,b)=>n+b.exercises.length,0),160);
});

test("exact original Hanzi and source-authorized tone-marked Pinyin survive the new listener interpretations",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const spec=PHASE33_CHINESE_CLARIFICATIONS[i];
  for(const pin of spec.encounters){
   assert.ok(receipts[pin.sourceId].includes(pin.quote));
   const original=originals.find(o=>o.lesson.id===pin.lessonId).lesson.steps
    .flatMap(s=>s.type==="encounter"?s.examples:[]).find(e=>e.targetText===pin.quote);
   assert.equal(original.reading,pinyin.readings[pin.sourceId][pin.quote]);
   assert.ok(b.lesson.steps[0].examples.some(e=>e.targetText===original.targetText&&
     e.reading===original.reading&&e.meaning===original.meaning));
  }
  for(const e of b.exercises.filter(e=>e.id.endsWith(":independent-tone")||e.id.endsWith(":independent-second-pinyin"))){
   assert.equal(evaluateExercise(e,e.acceptedAnswers[0]).kind,"correct");
   assert.equal(evaluateExercise(e,e.acceptedAnswers[0].normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
  }
 }
});

test("listener diagnosis uses TWO genuinely different wrong original-source meanings and exact authored correction",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE33_CHINESE_CLARIFICATIONS[i].chineseClarification.misunderstood;
  const e=b.exercises.find(x=>x.id.endsWith(":independent-listener-diagnosis"));
  assert.equal(e.kind,"reading");
  assert.ok(e.passage.includes("A listener detects an error in newly authored dialogue"));
  for(const ex of b.lesson.steps[0].examples)assert.ok(e.passage.includes(ex.targetText+" — "+ex.reading));
  assert.deepEqual(new Set(e.options),new Set([s.correctQuote,...s.wrongQuotes]));
  assert.deepEqual(e.acceptedAnswers,[s.correctQuote]);
  assert.equal(evaluateExercise(e,s.correctQuote).kind,"correct");
  for(let k=0;k<2;k++){
   assert.equal(evaluateExercise(e,s.wrongQuotes[k]).kind,"incorrect");
   assert.equal(evaluateExercise(e,s.wrongQuotes[k]).explanation,s.feedback[k]);
  }
 }
});

test("source-authentic typed Hanzi repair rejects each independent competing original phrase",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const r=PHASE33_CHINESE_CLARIFICATIONS[i].chineseClarification.writtenRepair;
  const e=b.exercises.find(x=>x.id.endsWith(":independent-attested-repair"));
  assert.equal(e.kind,"typed");assert.equal(e.normalization,"unicode-nfc");
  assert.deepEqual(e.sourceIds,[r.sourceId]);
  assert.deepEqual(e.acceptedAnswers,[r.quote]);
  assert.equal(e.sourceAid.targetText,r.quote);
  assert.equal(evaluateExercise(e,r.quote).kind,"correct");
  assert.equal(evaluateExercise(e,r.firstWrong).kind,"incorrect");
  assert.equal(evaluateExercise(e,r.firstWrong).explanation,r.firstFeedback);
  assert.equal(evaluateExercise(e,r.secondWrong).kind,"incorrect");
  assert.equal(evaluateExercise(e,r.secondWrong).explanation,r.secondFeedback);
 }
});

test("changed addressee makes a previously incorrect phrase exactly correct while the former correct one becomes wrong",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const [i,b] of candidates.entries()){
  const s=PHASE33_CHINESE_CLARIFICATIONS[i].chineseClarification;
  const e=b.exercises.find(x=>x.id.endsWith(":independent-changed-addressee"));
  assert.equal(e.kind,"reading");
  assert.ok(e.passage.includes("Following the correction, the listener and purpose change"));
  assert.equal(s.changedConsequence.correctQuote,s.misunderstood.wrongQuotes[0]);
  assert.equal(s.changedConsequence.wrongQuote,s.misunderstood.correctQuote);
  assert.equal(evaluateExercise(e,s.changedConsequence.correctQuote).kind,"correct");
  assert.equal(evaluateExercise(e,s.changedConsequence.wrongQuote).kind,"incorrect");
  assert.equal(evaluateExercise(e,s.changedConsequence.wrongQuote).explanation,s.changedConsequence.feedback);
 }
});

test("ten originally ungraded writing tasks support first draft comparison, restore, and independent revision in unchanged player",()=>{
 const {issues,candidates}=compile();assert.deepEqual(issues,[]);
 for(const b of candidates){
  const frames=framesFor(b),production=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(production.length,10);
  for(const frame of production){
   let p=createLessonPlayerState(b,frames.findIndex(f=>f.id===frame.id));
   const first="第一份独立对话：听者纠正原来的误会。";
   p=reduceLessonPlayer(p,{type:"draft",value:first});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome?.kind,"ungraded");
   p=reduceLessonPlayer(p,{type:"revise"});
   p=reduceLessonPlayer(p,{type:"draft",value:"第二份独立对话：新说话者更换听者。"});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).submissions,2);
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   p=reduceLessonPlayer(p,{type:"restore-first-draft"});
   assert.equal(activeAttempt(p).draft,first);
   assert.equal(activeAttempt(p).outcome,undefined);
   assert.equal(mayAdvance(p),false);
   p=reduceLessonPlayer(p,{type:"draft",value:"第三份独立对话：验证新解释。"});
   p=reduceLessonPlayer(p,{type:"submit"});
   assert.equal(activeAttempt(p).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(p).firstSubmittedDraft,first);
   assert.equal(activeAttempt(p).submissions,3);
  }
 }
});

test("fail closed on invented original, misattributed source, wrong-answer collisions, irreconcilable addressee change and stripped prompts",()=>{
 const mutations=[
  a=>{a[0].chineseClarification.misunderstood.correctQuote="凭空编造新句子";},
  a=>{a[0].chineseClarification.misunderstood.wrongQuotes[0]=a[0].chineseClarification.misunderstood.correctQuote;},
  a=>{a[1].chineseClarification.misunderstood.wrongQuotes[1]=a[1].chineseClarification.misunderstood.wrongQuotes[0];},
  a=>{a[2].chineseClarification.misunderstood.feedback[1]="";},
  a=>{a[3].chineseClarification.writtenRepair.quote="没有版权证据";},
  a=>{a[0].chineseClarification.writtenRepair.sourceId="zh-shi-demo";},
  a=>{a[1].chineseClarification.writtenRepair.secondWrong=a[1].chineseClarification.writtenRepair.firstWrong;},
  a=>{a[2].chineseClarification.writtenRepair.firstFeedback="";},
  a=>{a[3].chineseClarification.changedConsequence.correctQuote=a[3].chineseClarification.misunderstood.correctQuote;},
  a=>{a[0].chineseClarification.changedConsequence.wrongQuote="我";},
  a=>{a[1].chineseClarification.changedConsequence.feedback="";},
  a=>{a[2].chineseClarification.independentDialogue.criteria[1]="";},
  a=>{a[3].chineseExpansion.tone.reading="wo de";},
  a=>{a[0].languageId="ja";}
 ];
 for(const mutate of mutations){
  const clone=structuredClone(PHASE33_CHINESE_CLARIFICATIONS);mutate(clone);
  assert.ok(compile(clone).issues.length);
 }
 for(const mutate of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const modified=structuredClone(originals);mutate(modified);
  assert.ok(compile(PHASE33_CHINESE_CLARIFICATIONS,modified).issues.length);
 }
 assert.ok(compile([PHASE33_CHINESE_CLARIFICATIONS[0],PHASE33_CHINESE_CLARIFICATIONS[0]])
  .issues.some(x=>x.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});

test("unpublished Phase 33 writing, explanations and new-source contexts never enter canonical checkpoint serialization",()=>{
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const saved=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(saved,originals),positions);
 const {issues,candidates}=compile([...earlier,...PHASE33_CHINESE_CLARIFICATIONS]);assert.deepEqual(issues,[]);
 assert.ok(candidates.every(b=>!Object.hasOwn(positions,checkpointId(b))));
 assert.doesNotMatch(saved,/firstSubmittedDraft|author|draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval/);
});
