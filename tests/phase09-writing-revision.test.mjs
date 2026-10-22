import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {checkpointId,framesFor,parseDemoCheckpoint,serializeDemoCheckpoint,evaluateExercise} from "../apps/learner/src/lesson-model.ts";
import {activeFrame,activeAttempt,createLessonPlayerState,reduceLessonPlayer,mayAdvance} from "../apps/learner/src/lesson-player.ts";

const raw=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const bundles=raw.bundles,langs=["fr","ja","zh"];
const selected=lang=>bundles.find(b=>b.lesson.languageId===lang);
const clone=object=>JSON.parse(JSON.stringify(object));
const writing=(bundle)=>bundle.exercises.filter(e=>e.kind==="free-production");

test("all languages add one genuinely contextual second writing activity without grades",()=>{
 for(const lang of langs){
   const bundle=selected(lang),frames=framesFor(bundle),items=writing(bundle);
   assert.deepEqual(validateLessonBundleV1(bundle),[]);
   assert.equal(frames.length,20);
   assert.equal(frames.filter(frame=>frame.stage==="independent").length,8);
   assert.equal(items.length,2);
   assert.equal(items[1].id,lang+"-p09-context-composition");
   assert.ok(items[1].instruction.length>175);
   assert.ok(items[1].rubric.length>=4);
   assert.ok(items[0].sourceAid&&items[1].sourceAid);
   assert.ok(bundle.lesson.contentVersion.endsWith("-p09"));
   assert.ok(bundle.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
   for(const item of items){
     assert.equal(item.grading,"ungraded");
     assert.equal(item.evidence.mayScheduleReview,false);
     assert.equal(item.evidence.mayAssertProficiency,false);
     assert.equal(item.evidence.independent,true);
     assert.equal(item.evidence.classification,"ungraded-production");
     const originals=bundle.lesson.steps.find(step=>step.type==="encounter").examples;
     assert.ok(originals.some(ex=>ex.targetText===item.sourceAid.targetText&&ex.meaning===item.sourceAid.meaning));
     assert.equal(evaluateExercise(item,"my own composed text").kind,"ungraded");
   }
 }
});

test("existing Phase 05 reducer supports writing revisions without creating a second evaluator",()=>{
 for(const lang of langs){
   const bundle=selected(lang);
   let state=createLessonPlayerState(bundle,18);
   assert.equal(activeFrame(state).exercise.id,lang+"-p09-context-composition");
   assert.equal(reduceLessonPlayer(state,{type:"revise"}),state);
   const own=lang==="fr"?"Bonjour, madame. Je m’appelle Inès. Au revoir.":
     lang==="ja"?"朝：おはようございます。昼：こんにちは。":
     "你好。你喜欢喝茶吗？";
   state=reduceLessonPlayer(state,{type:"draft",value:own});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"ungraded");
   assert.equal(activeAttempt(state).submissions,1);
   assert.equal(mayAdvance(state),true);
   assert.equal(reduceLessonPlayer(state,{type:"draft",value:"unapproved mutation"}),state);
   state=reduceLessonPlayer(state,{type:"revise"});
   assert.equal(activeAttempt(state).outcome,undefined);
   assert.equal(activeAttempt(state).draft,own);
   assert.equal(activeAttempt(state).submissions,1);
   assert.equal(mayAdvance(state),false);
   const revision=own+" "+(lang==="zh"?"这个苹果很好吃。":"Revised second context.");
   state=reduceLessonPlayer(state,{type:"draft",value:revision});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"ungraded");
   assert.equal(activeAttempt(state).submissions,2);
   state=reduceLessonPlayer(state,{type:"next"});
   assert.equal(activeFrame(state).stage,"reflect");
   assert.equal(state.index,19);
 }
});

test("ungraded revision is fail-closed for correct, incorrect, revealed, teaching and empty states",()=>{
 for(const lang of langs){
   const bundle=selected(lang);
   const first=createLessonPlayerState(bundle);
   assert.equal(reduceLessonPlayer(first,{type:"revise"}),first);
   const blank=createLessonPlayerState(bundle,18);
   assert.equal(reduceLessonPlayer(blank,{type:"revise"}),blank);
   let exact=createLessonPlayerState(bundle,15);
   exact=reduceLessonPlayer(exact,{type:"draft",value:activeFrame(exact).exercise.acceptedAnswers[0]});
   exact=reduceLessonPlayer(exact,{type:"submit"});
   assert.equal(activeAttempt(exact).outcome.kind,"correct");
   assert.equal(reduceLessonPlayer(exact,{type:"revise"}),exact);
   const bad=createLessonPlayerState(bundle,15);
   assert.equal(reduceLessonPlayer(bad,{type:"revise"}),bad);
 }
});

test("within-tab previous and course interruption retain volatile drafts; refresh checkpoints do not",()=>{
 for(const lang of langs){
   const bundle=selected(lang);
   let state=createLessonPlayerState(bundle,18);
   state=reduceLessonPlayer(state,{type:"draft",value:"source-grounded private writing"});
   const protectedDraft=activeAttempt(state).draft;
   state=reduceLessonPlayer(state,{type:"previous"});
   assert.equal(state.index,17);
   // Simulate returning to the writing activity after the previous checked task.
   state={...state,index:18};
   assert.equal(activeAttempt(state).draft,protectedDraft);
   const output=serializeDemoCheckpoint({[checkpointId(bundle)]:18},bundles);
   assert.ok(!output.includes(protectedDraft));
   assert.ok(!/grades?|answers?|responseText|submissions/.test(output));
   const loaded=parseDemoCheckpoint(output,bundles);
   const restored=createLessonPlayerState(bundle,loaded[checkpointId(bundle)]);
   assert.equal(restored.index,18);
   assert.equal(activeAttempt(restored).draft,"");
   assert.equal(activeAttempt(restored).outcome,undefined);
   const incompatible=clone(bundle);
   incompatible.lesson.contentVersion+="-different";
   assert.deepEqual(parseDemoCheckpoint(output,[incompatible]),{});
 }
});

test("source references must be pinned or contract validation rejects the writing task",()=>{
 for(const lang of langs){
   const bundle=clone(selected(lang));
   writing(bundle)[1].sourceAid.targetText="invented unsourced utterance";
   assert.ok(validateLessonBundleV1(bundle).some(issue=>issue.code==="source-aid"));
 }
});

test("mistake-specific retry keeps typed/cloze text editable and resets discrete selections",()=>{
 for(const lang of langs){
   const bundle=selected(lang);
   const typed=bundle.exercises.find(ex=>ex.kind==="typed");
   const typedIndex=framesFor(bundle).findIndex(frame=>frame.exercise?.id===typed.id);
   let state=createLessonPlayerState(bundle,typedIndex);
   const invalid="an original incorrect draft";
   state=reduceLessonPlayer(state,{type:"draft",value:invalid});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"incorrect");
   state=reduceLessonPlayer(state,{type:"retry"});
   assert.equal(activeAttempt(state).outcome,undefined);
   assert.equal(activeAttempt(state).draft,invalid);
   assert.equal(mayAdvance(state),false);
   state=reduceLessonPlayer(state,{type:"draft",value:typed.acceptedAnswers[0]});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome.kind,"correct");
   const choice=bundle.exercises.find(ex=>ex.kind==="choice");
   const choiceIndex=framesFor(bundle).findIndex(frame=>frame.exercise?.id===choice.id);
   let discrete=createLessonPlayerState(bundle,choiceIndex);
   const wrong=choice.options.find(option=>!choice.acceptedAnswers.includes(option));
   discrete=reduceLessonPlayer(discrete,{type:"draft",value:wrong});
   discrete=reduceLessonPlayer(discrete,{type:"submit"});
   discrete=reduceLessonPlayer(discrete,{type:"retry"});
   assert.equal(activeAttempt(discrete).draft,"");
 }
});
