import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {
  framesFor,normalizeAnswer,evaluateExercise,revealExercise,canContinueAfterAnswer,
  checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint
} from "../apps/learner/src/lesson-model.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";

const fixtures=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const byLang=Object.fromEntries(fixtures.bundles.map(bundle=>[bundle.lesson.languageId,bundle]));
const ex=(lang,id)=>byLang[lang].exercises.find(e=>e.id===id);

test("all three extended beginner lessons preserve source provenance and the teaching arc",()=>{
  assert.deepEqual(Object.keys(byLang),["fr","ja","zh"]);
  for(const bundle of Object.values(byLang)){
    assert.deepEqual(validateLessonBundleV1(bundle),[]);
    const frames=framesFor(bundle);
    assert.equal(frames.length,20);
    assert.deepEqual(frames.map(f=>f.stage),
      ["encounter","explain","explain","guided","guided","guided","guided","guided","guided","guided","guided","independent","independent","independent","independent","independent","independent","independent","independent","reflect"]);
    assert.equal(frames.filter(f=>f.exercise?.purpose==="independent").length,8);
    assert.equal(frames.at(-1).step.type,"reflect");
    assert.ok(bundle.lesson.contentVersion.includes("-p04"));
    assert.equal(bundle.lesson.publication,"internal-fixture");
    assert.ok(bundle.lesson.sources.every(s=>s.redistributionVerified===false && s.editorialReview==="pending"));
    assert.ok(bundle.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false));
  }
});

test("French apostrophe normalization is narrow: accepted typography, not missing letters or wrong identity",()=>{
  const e=ex("fr","fr-p04-apostrophe");
  assert.equal(e.normalization,"french-apostrophe");
  assert.equal(evaluateExercise(e,"  Je m'appelle Inès.  ").kind,"correct");
  assert.equal(evaluateExercise(e,"Je m’appelle Inès.").kind,"correct");
  assert.equal(evaluateExercise(e,"Je mappelle Inès.").kind,"incorrect");
  assert.equal(evaluateExercise(e,"Je m'appelle Ines.").kind,"incorrect");
});

test("Japanese accepts optional sentence-final 。 but does not confuse は and わ",()=>{
  const e=ex("ja","ja-p04-evening-arrival");
  assert.equal(evaluateExercise(e,"こんばんは。").kind,"correct");
  assert.equal(evaluateExercise(e,"こんばんは").kind,"correct");
  assert.equal(evaluateExercise(e,"こんばんわ").kind,"incorrect");
  assert.equal(evaluateExercise(e,"おやすみなさい").kind,"incorrect");
  assert.equal(normalizeAnswer(" こんばんは 。","japanese-terminal-punctuation"),"こんばんは");
});

test("Mandarin Pinyin requires tone marks while tolerating NFC and whitespace",()=>{
  const e=ex("zh","zh-p04-pinyin");
  assert.equal(evaluateExercise(e," nǐ   hǎo ").kind,"correct");
  assert.equal(evaluateExercise(e,"ni hao").kind,"incorrect");
  assert.equal(evaluateExercise(e,"nì hǎo").kind,"incorrect");
  assert.equal(evaluateExercise(e,"nǐ hào").kind,"incorrect");
});

test("incorrect attempts never count: learner must retry or explicitly reveal",()=>{
  const e=ex("fr","fr-p04-transfer");
  const wrong=evaluateExercise(e,"Bonsoir");
  assert.equal(wrong.kind,"incorrect");
  assert.equal(canContinueAfterAnswer(wrong),false);
  assert.equal(Object.hasOwn(wrong,"expected"),false);
  const reveal=revealExercise(e);
  assert.equal(reveal.kind,"revealed");
  assert.equal(canContinueAfterAnswer(reveal),true);
  assert.deepEqual(reveal.expected,e.acceptedAnswers);
  assert.equal(e.evidence.mayScheduleReview,false);
  assert.equal(e.evidence.mayAssertProficiency,false);
  assert.equal(canContinueAfterAnswer(evaluateExercise(e,e.acceptedAnswers[0])),true);
  for(const bundle of Object.values(byLang)){
    const writing=bundle.exercises.find(e=>e.kind==="free-production");
    const result=evaluateExercise(writing,"independently composed text");
    assert.equal(result.kind,"ungraded");
    assert.equal(canContinueAfterAnswer(result),true);
    assert.equal(revealExercise(writing).kind,"ungraded");
  }
});

test("versioned tab-only checkpoints invalidate old lesson versions without saving answers or grades",()=>{
 const b=Object.values(byLang);
 const positions=Object.fromEntries(b.map(x=>[checkpointId(x),4]));
 const output=serializeDemoCheckpoint(positions,b);
 assert.deepEqual(parseDemoCheckpoint(output,b),positions);
 assert.ok(!/accountId|answer|grade|memoryReview|responseText/.test(output));
 assert.deepEqual(parseDemoCheckpoint(JSON.stringify({version:1,positions:{"fr:a1-01:shared-pilot@unified-u1-original-v1":6}}),b),{});
 assert.deepEqual(parseDemoCheckpoint(JSON.stringify({version:1,positions:{"__proto__":1}}),b),{});
});
