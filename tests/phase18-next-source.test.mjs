import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {admitInternalPilot,editorialPreflight,sourceCoverage} from "../apps/learner/src/source-coverage.ts";
import {auditSourceEvidence} from "../apps/learner/src/source-evidence.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const old=read("fixtures/phase02-source-lessons.json").bundles;
const middle=read("fixtures/phase15-source-lessons.json").bundles;
const bridges=read("fixtures/phase17-cross-source-lessons.json").bundles;
const next=read("fixtures/phase18-next-source-lessons.json").bundles;
const receipts=read("phase16-source-evidence.json");
test("authentic next entities and original-source receipts admit three internal-only new lessons",()=>{
 assert.deepEqual(next.map(b=>b.lesson.id),["fr:a1-03:shared-pilot","ja:cf-a1-01-03:shared-pilot","zh:shi:shared-pilot"]);
 for(const b of next){
  assert.deepEqual(validateLessonBundleV1(b),[]);
  assert.deepEqual(auditSourceEvidence(b),[]);
  assert.deepEqual(admitInternalPilot(b),sourceCoverage(b));
  assert.equal(framesFor(b).length,11);
  assert.equal(b.exercises.length,7);
  assert.equal(b.lesson.prerequisiteLessonIds.length,2);
  assert.equal(sourceCoverage(b)[0].guided.length,3);
  assert.equal(sourceCoverage(b)[0].independent.length,4);
  assert.equal(editorialPreflight(b).readyForSeparateReview,false);
  assert.ok(b.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.equal(Object.keys(receipts.exerciseReceipts[b.lesson.id]).length,7);
 }
});
test("French original noun gender, plural and definite references remain distinct",()=>{
 const e=id=>next[0].exercises.find(x=>x.id==="fr-p18-"+id);
 assert.equal(evaluateExercise(e("gender"),"Une table est ici.").kind,"correct");
 assert.equal(evaluateExercise(e("gender"),"C’est un livre.").kind,"incorrect");
 assert.equal(evaluateExercise(e("plural"),"des").kind,"correct");
 assert.equal(evaluateExercise(e("elision"),"L’école est ouverte.").kind,"correct");
 assert.equal(evaluateExercise(e("definite"),"Le livre est sur la table.").kind,"correct");
 assert.equal(evaluateExercise(e("article"),"un").kind,"correct");
 assert.equal(evaluateExercise(e("write"),"Un livre, une table").kind,"ungraded");
});
test("Japanese original first meeting is not identical with daily greeting or farewell",()=>{
 const e=id=>next[1].exercises.find(x=>x.id==="ja-p18-"+id);
 assert.equal(evaluateExercise(e("opening"),"はじめまして。").kind,"correct");
 assert.equal(evaluateExercise(e("opening"),"おやすみなさい。").kind,"incorrect");
 assert.equal(evaluateExercise(e("sequence"),"2,1,0").kind,"correct");
 assert.equal(evaluateExercise(e("goodwill"),"よろしくお願いします。").kind,"correct");
 assert.equal(evaluateExercise(e("recall"),"はじめまして。").kind,"correct");
 assert.equal(evaluateExercise(e("write"),"ミナです。").kind,"ungraded");
});
test("Chinese original 是 stays nonofficial with negative and additive distinction",()=>{
 const e=id=>next[2].exercises.find(x=>x.id==="zh-p18-"+id);
 assert.equal(next[2].lesson.sources[0].rights,"review-required");
 assert.equal(evaluateExercise(e("copula"),"是").kind,"correct");
 assert.equal(evaluateExercise(e("negative"),"不是").kind,"correct");
 assert.equal(evaluateExercise(e("negative"),"也是").kind,"incorrect");
 assert.equal(evaluateExercise(e("also"),"也是").kind,"correct");
 assert.equal(evaluateExercise(e("link"),"是").kind,"correct");
 assert.equal(evaluateExercise(e("pinyin"),"shì").kind,"correct");
 assert.equal(evaluateExercise(e("pinyin"),"shi").kind,"incorrect");
 assert.equal(evaluateExercise(e("write"),"他是老师。").kind,"ungraded");
});
test("every next-source exercise receipt points to the actually relevant original evidence",()=>{
 const expected={"fr:a1-03:shared-pilot":{"fr-p18-gender":"Une table est ici.","fr-p18-plural":"Voici des stylos.","fr-p18-elision":"L’école est ouverte.","fr-p18-definite":"Le livre est sur la table.","fr-p18-location":"Le livre est sur la table.","fr-p18-article":"C’est un livre.","fr-p18-write":"Regarde : les stylos sont sur la table."},"ja:cf-a1-01-03:shared-pilot":{"ja-p18-opening":"はじめまして。","ja-p18-name":"ミナです。","ja-p18-sequence":"はじめまして。","ja-p18-goodwill":"よろしくお願いします。","ja-p18-familiar":"はじめまして。","ja-p18-recall":"はじめまして。","ja-p18-write":"ミナです。"},"zh:shi:shared-pilot":{"zh-p18-copula":"是","zh-p18-teacher":"他是老师。","zh-p18-negative":"不是","zh-p18-also":"也是","zh-p18-link":"他是老师。","zh-p18-pinyin":"是","zh-p18-write":"他是老师。"}};
 for(const [lessonId,items] of Object.entries(expected))
  assert.deepEqual(receipts.exerciseReceipts[lessonId],items);
});
test("source drift, approval, rights, and unreviewed exercise additions fail closed",()=>{
 for(const b of next){
  for(const change of [
   x=>{x.lesson.sources[0].revision="0".repeat(40);},
   x=>{x.lesson.sources[0].originalEntityId="invented";},
   x=>{x.lesson.sources[0].redistributionVerified=true;},
   x=>{x.lesson.sources[0].editorialReview="approved";},
   x=>{x.lesson.publication="public";},
   x=>{x.exercises[0].id="invented-exercise";}
  ]){const x=structuredClone(b);change(x);assert.throws(()=>admitInternalPilot(x));}
 }
});
test("old nine lessons and all 105 existing exercise IDs retain checkpoint identity",()=>{
 const prior=[...old,...middle,...bridges],all=[...prior,...next];
 assert.equal(prior.reduce((n,b)=>n+b.exercises.length,0),105);
 assert.equal(all.reduce((n,b)=>n+b.exercises.length,0),126);
 assert.equal(new Set(all.map(b=>checkpointId(b))).size,12);
 const serialized=serializeDemoCheckpoint(Object.fromEntries(all.map((b,i)=>[checkpointId(b),i+1])),all);
 const decoded=parseDemoCheckpoint(serialized,all);
 for(const [i,b]of prior.entries())assert.equal(decoded[checkpointId(b)],i+1);
 assert.ok(!serialized.includes("grade")&&!serialized.includes("answer"));
});
