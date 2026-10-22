import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateLessonBundleV1 } from "../packages/content-schema/src/lesson-v1.ts";

const fixturePath=fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json", import.meta.url));
const source=JSON.parse(readFileSync(fixturePath,"utf8"));
const bundleFor=id=>structuredClone(source.bundles.find(b=>b.lesson.languageId===id));
const invalid=(bundle,code)=>{
 const errors=validateLessonBundleV1(bundle);
 assert.ok(errors.some(e=>e.code===code),JSON.stringify({expected:code,errors}));
};
test("three immutable original-source fixtures compile under ONE teaching contract",()=>{
 assert.equal(source.schemaVersion,1);
 assert.equal(source.purpose,"internal-contract-testing-only");
 assert.deepEqual(source.bundles.map(b=>b.lesson.languageId),["fr","ja","zh"]);
 for(const bundle of source.bundles){
  assert.deepEqual(validateLessonBundleV1(bundle),[]);
  assert.equal(bundle.lesson.publication,"internal-fixture");
  assert.equal(bundle.lesson.steps.filter(s=>s.type==="independent").length,1);
  assert.ok(bundle.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.ok(bundle.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false));
 }
});
test("the same validator supports French, Japanese and Chinese orthographic capabilities",()=>{
 assert.ok(bundleFor("fr").plugin.capabilities.includes("morphology"));
 assert.ok(bundleFor("ja").plugin.capabilities.includes("furigana"));
 assert.ok(bundleFor("zh").plugin.capabilities.includes("lexical-tones"));
 for(const bundle of source.bundles)assert.deepEqual(validateLessonBundleV1(bundle),[]);
});
test("rejects missing source provenance and unsupported publication",()=>{
 const a=bundleFor("fr");a.lesson.sourceIds=["unverified"];
 invalid(a,"source-link");
 const b=bundleFor("zh");b.lesson.publication="public";
 invalid(b,"public-rights");
 const c=bundleFor("ja");c.lesson.sources[0].revision="main";
 invalid(c,"source-record");
});
test("rejects foreign-language plugins, targets and normalizers",()=>{
 const a=bundleFor("fr");a.plugin.languageId="ja";invalid(a,"language");
 const b=bundleFor("zh");b.exercises[0].primaryTarget.languageId="fr";invalid(b,"target-language");
 const c=bundleFor("ja");c.plugin.answerNormalizations=["literal"];invalid(c,"unsupported-normalizer");
});
test("rejects broken step/exercise linkage, repetition and orphan activities",()=>{
 const a=bundleFor("fr");a.lesson.steps[2].exerciseIds.push("missing");invalid(a,"missing-exercise");
 const b=bundleFor("fr");b.lesson.steps[2].exerciseIds.push("fr-a1-01-choice");invalid(b,"duplicate-exercise-use");
 const c=bundleFor("ja");c.lesson.steps[3].exerciseIds=[];invalid(c,"empty-practice");
 const d=bundleFor("zh");d.exercises.push({...d.exercises[0],id:"unlinked"});invalid(d,"orphan-exercise");
 const e=bundleFor("ja");e.lesson.steps[1].type="independent";invalid(e,"step-order");
});
test("rejects unsupported grading claims and misleading independent evidence",()=>{
 const a=bundleFor("fr");a.exercises[2].grading="exact";invalid(a,"production-grading");
 const b=bundleFor("ja");b.exercises[0].evidence.mayScheduleReview=true;invalid(b,"evidence-policy");
 const c=bundleFor("zh");c.exercises[1].evidence.mayAssertProficiency=true;invalid(c,"evidence-policy");
 const d=bundleFor("fr");d.exercises[2].evidence.independent=false;invalid(d,"evidence-policy");
});
test("enforces determinate choices and genuinely ungraded free production",()=>{
 const a=bundleFor("ja");a.exercises[0].acceptedAnswers=["unlisted response"];invalid(a,"choice-options");
 const b=bundleFor("zh");b.exercises[2].rubric=[];invalid(b,"production-grading");
 const c=bundleFor("fr");c.exercises[1].acceptedAnswers=[];invalid(c,"answer-key");
});
test("prevents fabricated lesson stages and self prerequisites",()=>{
 const a=bundleFor("ja");a.lesson.steps.shift();invalid(a,"missing-stage");
 const b=bundleFor("zh");b.lesson.prerequisiteLessonIds.push(b.lesson.id);invalid(b,"prerequisites");
});
