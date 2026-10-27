import test from "node:test";
import assert from "node:assert/strict";
import {moveOrderingToken,parseOrderingDraft,evaluateExercise} from "../apps/learner/src/lesson-model.ts";
import {compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {PHASE32_CHINESE_NEGOTIATIONS} from "../apps/learner/src/phase32-chinese-negotiations.ts";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
const load=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>load("fixtures/"+p+".json").bundles);
test("source excerpt ordering lets a learner move an already selected item earlier or later while retaining the rest",()=>{
 for(const count of [3,4,5]){
  let draft=Array.from({length:count},(_,i)=>i).join(",");
  const moved=moveOrderingToken(draft,count,1,-1);
  assert.deepEqual(parseOrderingDraft(moved,count),[1,0,...Array.from({length:count-2},(_,i)=>i+2)]);
  assert.equal(moveOrderingToken(moved,count,0,1),draft);
  const end=moveOrderingToken(draft,count,count-2,1);
  assert.deepEqual(parseOrderingDraft(end,count),[...Array.from({length:count-2},(_,i)=>i),count-1,count-2]);
  assert.equal(moveOrderingToken(end,count,count-1,-1),draft);
  assert.equal(moveOrderingToken(draft,count,0,-1),draft);
  assert.equal(moveOrderingToken(draft,count,count-1,1),draft);
 }
});
test("partial and malformed ordering moves fail closed without inventing, erasing or duplicating source tokens",()=>{
 assert.equal(moveOrderingToken("0,1",3,1,-1),"1,0");
 assert.equal(moveOrderingToken("0",3,0,1),"0");
 assert.equal(moveOrderingToken("",3,0,1),"");
 for(const invalid of ["0,0","2,4","-1,0","a,1","0,1,2,3",",0","01,2","1.0,2"]){
  assert.equal(moveOrderingToken(invalid,3,0,1),invalid);
 }
 for(const i of [-3,-1,3,Infinity,NaN,0.5]){
  assert.equal(moveOrderingToken("0,1,2",3,i,1),"0,1,2");
 }
 assert.equal(moveOrderingToken("0,1,2",3,1,2),"0,1,2");
 assert.equal(moveOrderingToken("0,1,2",0,1,-1),"0,1,2");
});
test("moving authentic Phase 32 Hanzi evidence changes only the user draft, not pinned lessons, answers or grading",()=>{
 const result=compilePinnedSourceIntake(originals,PHASE32_CHINESE_NEGOTIATIONS);
 assert.deepEqual(result.issues,[]);
 for(const b of result.candidates){
  const ex=b.exercises.find(e=>e.id.endsWith(":independent-fifth-sequence"));
  assert.ok(ex&&ex.kind==="ordering");
  const expected=ex.acceptedAnswers[0];
  const idx=expected.split(",").map(Number);
  const wrong=[idx[1],idx[0],idx[2]].join(",");
  const correct=moveOrderingToken(wrong,ex.tokens.length,1,-1);
  assert.equal(correct,expected);
  assert.equal(evaluateExercise(ex,wrong).kind,"incorrect");
  assert.equal(evaluateExercise(ex,correct).kind,"correct");
  assert.deepEqual(ex.acceptedAnswers,[expected]);
  assert.equal(ex.evidence.mayScheduleReview,false);
  assert.equal(ex.evidence.mayAssertProficiency,false);
 }
});
