import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {
  framesFor,evaluateExercise,normalizeAnswer,parseDemoCheckpoint,
  serializeDemoCheckpoint,checkpointId,DEMO_CHECKPOINT_KEY
} from "../apps/learner/src/lesson-model.ts";

const raw=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const bundles=raw.bundles;
test("all three original language packs become five frames through one renderer model",()=>{
  assert.deepEqual(bundles.map(b=>b.lesson.languageId),["fr","ja","zh"]);
  for(const bundle of bundles){
    const frames=framesFor(bundle);
    assert.equal(frames.length,5);
    assert.deepEqual(frames.map(f=>f.stage),["encounter","explain","guided","guided","independent"]);
    assert.equal(new Set(frames.map(f=>f.id)).size,frames.length);
    assert.equal(frames[4].exercise.kind,"free-production");
  }
});
test("deterministic exact or permitted normalization does not invent linguistic equivalence",()=>{
  const fr=bundles[0].exercises[1],ja=bundles[1].exercises[1],zh=bundles[2].exercises[1];
  assert.equal(evaluateExercise(fr,"  appelle  ").kind,"correct");
  assert.equal(evaluateExercise(fr,"appelles").kind,"incorrect");
  assert.equal(evaluateExercise(ja,"おはようございます。").kind,"correct");
  assert.equal(evaluateExercise(zh,"你好").kind,"correct");
  assert.equal(evaluateExercise(zh,"你们").kind,"incorrect");
  assert.equal(normalizeAnswer(" é ","unicode-nfc")," é ");
});
test("ungraded writing and errors cannot generate scheduler/proficiency events",()=>{
 for(const b of bundles){
  const ex=b.exercises[2];
  assert.equal(evaluateExercise(ex,"some answer").kind,"ungraded");
  assert.equal(ex.evidence.mayScheduleReview,false);
  assert.equal(ex.evidence.mayAssertProficiency,false);
 }
});
test("tab checkpoint contains only pinned lesson activity indices",()=>{
 const positions={};
 for(const b of bundles)positions[checkpointId(b)]=2;
 const encoded=serializeDemoCheckpoint(positions,bundles);
 assert.equal(DEMO_CHECKPOINT_KEY,"thiepn-languages-phase03-preview-v1");
 assert.deepEqual(parseDemoCheckpoint(encoded,bundles),positions);
 assert.ok(!encoded.includes("answer")&&!encoded.includes("grade")&&!encoded.includes("account"));
 const malicious={...positions,"foreign-account":3,[checkpointId(bundles[0])]:999};
 assert.equal(Object.hasOwn(parseDemoCheckpoint(JSON.stringify({version:1,positions:malicious}),bundles),checkpointId(bundles[0])),false);
 assert.deepEqual(parseDemoCheckpoint('{"version":2,"positions":{}}',bundles),{});
 assert.deepEqual(parseDemoCheckpoint("invalid json",bundles),{});
});
