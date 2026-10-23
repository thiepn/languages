import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {auditSourceEvidence} from "../apps/learner/src/source-evidence.ts";
import {admitInternalPilot,sourceCoverage,editorialPreflight} from "../apps/learner/src/source-coverage.ts";
import {framesFor,evaluateExercise} from "../apps/learner/src/lesson-model.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL(p,import.meta.url)),"utf8"));
const old=read("../contracts/fixtures/phase02-source-lessons.json").bundles;
const next=read("../contracts/fixtures/phase15-source-lessons.json").bundles;
const receipts=read("../contracts/phase16-source-evidence.json");
const all=[...old,...next];
test("six originals retain all 84 explicit pinned source receipts and closed editorial rights",()=>{
 assert.equal(all.length,6);
 assert.equal(all.reduce((n,b)=>n+b.exercises.length,0),84);
 for(const b of all){
  assert.deepEqual(auditSourceEvidence(b),[]);
  assert.deepEqual(admitInternalPilot(b),sourceCoverage(b));
  assert.equal(Object.keys(receipts.exerciseReceipts[b.lesson.id]).length,b.exercises.length);
  assert.equal(editorialPreflight(b).readyForSeparateReview,false);
  assert.ok(b.lesson.sources.every(x=>x.editorialReview==="pending"&&!x.redistributionVerified));
 }
});
test("Chinese 好 has existing source-grounded guided and independent coverage, no padded activity",()=>{
 const b=old.find(x=>x.lesson.languageId==="zh");
 const hao=sourceCoverage(b).find(x=>x.source.id==="zh-hao-demo");
 assert.deepEqual(hao.guided.map(x=>x.id),["zh-ni-hao-choice","zh-p04-context-choice","zh-p06-cloze","zh-p06-reading"]);
 assert.ok(hao.independent.some(x=>x.id==="zh-ni-hao-production"));
 assert.equal(framesFor(b).length,22);
 assert.equal(framesFor(b)[4].id,"zh-ni-hao-typed");
 assert.equal(evaluateExercise(b.exercises.find(x=>x.id==="zh-p04-context-choice"),"好吃").kind,"correct");
});
test("admission fails closed on source revision, ownership, exercise attribution, or missing original quote",()=>{
 const b=old.find(x=>x.lesson.languageId==="zh");
 const mutations=[
  x=>{x.lesson.sources[1].revision="0".repeat(40);},
  x=>{x.lesson.sources[1].originalEntityId="fake";},
  x=>{x.exercises.find(e=>e.id==="zh-p06-cloze").sourceIds=["zh-ni-demo"];},
  x=>{x.exercises.find(e=>e.id==="zh-p13-plural-pinyin").sourceIds=["zh-hao-demo"];},
  x=>{x.exercises[0].id="invented";},
  x=>{x.lesson.steps[0].examples=x.lesson.steps[0].examples.filter(e=>e.targetText!=="这个苹果很好吃。");}
 ];
 for(const mutate of mutations){const candidate=structuredClone(b);mutate(candidate);assert.throws(()=>admitInternalPilot(candidate));}
});
test("preserves IDs, original 22 and 14 frames and conservative evidence policy",()=>{
 const ids=[
  "fr:a1-01:shared-pilot","ja:cf-a1-01-01:shared-pilot","zh:ni-hao:shared-pilot",
  "fr:a1-02:shared-pilot","ja:cf-a1-01-02:shared-pilot","zh:wo:shared-pilot"
 ];
 assert.deepEqual(all.map(b=>b.lesson.id),ids);
 assert.deepEqual(all.map(b=>framesFor(b).length),[22,22,22,14,14,14]);
 for(const b of all)for(const e of b.exercises){
  assert.equal(e.evidence.mayScheduleReview,false);
  assert.equal(e.evidence.mayAssertProficiency,false);
  assert.equal(e.grading,e.kind==="free-production"?"ungraded":"exact");
 }
});
test("source-aided misconception feedback remains uncredited and all contrasts match encounters",()=>{
 for(const b of next){
  const examples=b.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[]);
  for(const e of b.exercises){
   if(e.sourceAid)assert.ok(examples.some(x=>x.targetText===e.sourceAid.targetText&&x.meaning===e.sourceAid.meaning));
   if(e.sourceComparison)for(const x of [e.sourceComparison.first,e.sourceComparison.second])
    assert.ok(examples.some(y=>x.targetText===y.targetText&&x.meaning===y.meaning));
   for(const m of e.misconceptions??[]){
    const result=evaluateExercise(e,m.answer);
    assert.equal(result.kind,"incorrect");
    assert.equal(result.explanation,m.feedback);
   }
  }
 }
});
