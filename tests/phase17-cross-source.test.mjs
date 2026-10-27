import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {admitInternalPilot,editorialPreflight,sourceCoverage} from "../apps/learner/src/source-coverage.ts";
import {auditSourceEvidence} from "../apps/learner/src/source-evidence.ts";
import {framesFor,evaluateExercise,serializeDemoCheckpoint,parseDemoCheckpoint,checkpointId} from "../apps/learner/src/lesson-model.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
const read=f=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+f,import.meta.url)),"utf8"));
const initial=read("fixtures/phase02-source-lessons.json").bundles;
const next=read("fixtures/phase15-source-lessons.json").bundles;
const bridges=read("fixtures/phase17-cross-source-lessons.json").bundles;
const originalEvidence=read("phase16-source-evidence.json");
test("three true source-linked bridges reuse one schema and retain six existing lessons",()=>{
 assert.deepEqual(bridges.map(b=>b.lesson.languageId),["fr","ja","zh"]);
 assert.equal(initial.length+next.length,6);
 assert.equal(initial.concat(next).reduce((n,b)=>n+b.exercises.length,0),84);
 for(const bundle of bridges){
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.deepEqual(auditSourceEvidence(bundle),[]);
  assert.deepEqual(admitInternalPilot(bundle),sourceCoverage(bundle));
  assert.equal(framesFor(bundle).length,11);
  assert.equal(bundle.exercises.length,7);
  assert.equal(bundle.lesson.prerequisiteLessonIds.length,2);
  assert.ok(bundle.lesson.prerequisiteLessonIds.includes(initial.find(b=>b.lesson.languageId===bundle.lesson.languageId).lesson.id));
  assert.ok(bundle.lesson.prerequisiteLessonIds.includes(next.find(b=>b.lesson.languageId===bundle.lesson.languageId).lesson.id));
  assert.ok(bundle.lesson.sources.length>=2);
  for(const entry of sourceCoverage(bundle)){
   assert.equal(entry.guided.length,3);
   assert.equal(entry.independent.length,4);
  }
  assert.equal(editorialPreflight(bundle).readyForSeparateReview,false);
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.ok(bundle.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
 }
});
test("French transfer contrasts name, role, greeting and departure with conservative feedback",()=>{
 const b=bridges[0],ex=s=>b.exercises.find(e=>e.id==="fr-p17-"+s);
 assert.equal(evaluateExercise(ex("opening"),"Bonsoir, monsieur.").kind,"correct");
 assert.equal(evaluateExercise(ex("opening"),"Je suis professeur.").kind,"incorrect");
 assert.equal(evaluateExercise(ex("identify"),"Je suis professeur.").kind,"correct");
 assert.equal(evaluateExercise(ex("name"),"Bonjour ! Je m’appelle Inès.").kind,"correct");
 assert.equal(evaluateExercise(ex("etre"),"suis").kind,"correct");
 assert.equal(evaluateExercise(ex("etre"),"appelle").kind,"incorrect");
 assert.equal(evaluateExercise(ex("compose"),"Je m’appelle quelqu’un").kind,"ungraded");
});
test("Japanese request and gratitude transfer keeps distinct purposes",()=>{
 const b=bridges[1],ex=s=>b.exercises.find(e=>e.id==="ja-p17-"+s);
 assert.equal(evaluateExercise(ex("attention"),"すみません。").kind,"correct");
 assert.equal(evaluateExercise(ex("attention"),"ありがとうございます。").kind,"incorrect");
 assert.equal(evaluateExercise(ex("sequence"),"2,1,0").kind,"correct");
 assert.equal(evaluateExercise(ex("sequence"),"0,1,2").kind,"incorrect");
 assert.equal(evaluateExercise(ex("typed"),"ありがとうございます。").kind,"correct");
 assert.equal(evaluateExercise(ex("compose"),"すみません。").kind,"ungraded");
});
test("Mandarin greeting, pronoun, identity and taste transfer remains non-official",()=>{
 const b=bridges[2],ex=s=>b.exercises.find(e=>e.id==="zh-p17-"+s);
 assert.equal(b.lesson.sources.length,3);
 assert.equal(evaluateExercise(ex("identity"),"我是学生。").kind,"correct");
 assert.equal(evaluateExercise(ex("greet"),"我").kind,"incorrect");
 assert.equal(evaluateExercise(ex("greet"),"你好").kind,"correct");
 assert.equal(evaluateExercise(ex("pinyin"),"wǒ").kind,"correct");
 assert.equal(evaluateExercise(ex("pinyin"),"wo").kind,"incorrect");
 assert.equal(evaluateExercise(ex("compose"),"我").kind,"ungraded");
});
test("admission detects bridge provenance drift, exercise swaps, and premature approval",()=>{
 for(const b of bridges){
  const mutation=[
   x=>{x.lesson.sources[0].revision="0".repeat(40);},
   x=>{x.lesson.sources[0].redistributionVerified=true;},
   x=>{x.lesson.sources[0].editorialReview="approved";},
   x=>{x.lesson.publication="public";},
   x=>{x.exercises[0].sourceIds=[x.lesson.sources[0].id];},
   x=>{x.exercises[0].id="unreviewed-bridge-exercise";}
  ];
  for(const mut of mutation){const altered=structuredClone(b);mut(altered);assert.throws(()=>admitInternalPilot(altered));}
  assert.ok(Object.keys(originalEvidence.exerciseReceipts[b.lesson.id]).length===7);
 }
});
test("nine distinct tab checkpoints preserve the prior six IDs and no learner response data",()=>{
 const all=[...initial,...next,...bridges];
 assert.equal(new Set(all.map(b=>checkpointId(b))).size,9);
 const checkpoint=serializeDemoCheckpoint(Object.fromEntries(all.map((b,i)=>[checkpointId(b),i+1])),all);
 assert.equal(Object.keys(parseDemoCheckpoint(checkpoint,all)).length,9);
 assert.ok(!checkpoint.includes("acceptedAnswers")&&!checkpoint.includes("grade"));
 for(const b of all)for(const e of b.exercises)assert.equal(e.evidence.mayScheduleReview||e.evidence.mayAssertProficiency,false);
});
