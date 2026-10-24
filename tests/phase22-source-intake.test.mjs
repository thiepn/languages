import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {compilePinnedSourceIntake,PHASE22_AUTHORING} from "../apps/learner/src/source-intake.ts";
import {inspectChineseEcosystemPreflight} from "../languages/chinese/preflight.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
const get=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(x=>get("fixtures/"+x+".json").bundles);

test("reconciled E0 inventory self-test is executable; Chinese preflight never grants P8",async()=>{
 const {execFileSync}=await import("node:child_process");
 const {fileURLToPath}=await import("node:url");
 const run=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL("../scripts/ecosystem-inventory.mjs",import.meta.url)),"--self-test"],{encoding:"utf8"}));
 assert.equal(run.status,"PASS");
 const p=inspectChineseEcosystemPreflight({lessonCount:428,pathwayMissionCount:36,ungradedTransferCount:36,
  demonstrationQualified:true,historicalIdsPreserved:true});
 assert.equal(p.publishAllowed,false);
 assert.equal(p.officialHskClaim,false);
 assert.ok(p.issues.includes("CHINESE_OWNER_SCOPED_P8_PRODUCER_NOT_VERIFIED"));
});
test("three new source-pinned authored internal candidates compile under existing LessonV1/ExerciseV1/LanguagePluginV1",()=>{
 const built=compilePinnedSourceIntake(originals);
 assert.deepEqual(built.issues,[]);
 assert.deepEqual(built.candidates.map(b=>b.lesson.languageId),["fr","ja","zh"]);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 assert.equal(PHASE22_AUTHORING.length,3);
 const oldIDs=new Set(originals.map(b=>b.lesson.id));
 const oldExercises=new Set(originals.flatMap(b=>b.exercises.map(e=>e.id)));
 for(const candidate of built.candidates){
  assert.deepEqual(validateLessonBundleV1(candidate),[]);
  assert.equal(candidate.lesson.publication,"internal-fixture");
  assert.equal(candidate.lesson.sources.length,2);
  assert.equal(framesFor(candidate).length,7);
  assert.equal(candidate.exercises.length,3);
  assert.ok(!oldIDs.has(candidate.lesson.id));
  assert.ok(candidate.exercises.every(e=>!oldExercises.has(e.id)));
  assert.ok(candidate.lesson.sources.every(s=>s.editorialReview==="pending"&&!s.redistributionVerified));
  assert.ok(candidate.exercises.every(e=>e.evidence.mayScheduleReview===false&&e.evidence.mayAssertProficiency===false));
  const [guided,reading,writing]=candidate.exercises;
  assert.equal(evaluateExercise(guided,guided.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(reading,reading.acceptedAnswers[0]).kind,"correct");
  assert.equal(evaluateExercise(reading,reading.options.find(x=>x!==reading.acceptedAnswers[0])).kind,"incorrect");
  assert.equal(evaluateExercise(writing,"My own independent transfer").kind,"ungraded");
  let state=createLessonPlayerState(candidate,framesFor(candidate).findIndex(f=>f.exercise?.kind==="free-production"));
  state=reduceLessonPlayer(state,{type:"draft",value:"Original learner writing"});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
 }
});
test("source-intake pin mismatch, rights escalation, target substitution and duplicate candidate are blocked",()=>{
 const changed=structuredClone(originals);
 const first=changed.find(b=>b.lesson.id==="fr:a1-01:shared-pilot");
 first.lesson.sources[0].revision="0".repeat(40);
 assert.ok(compilePinnedSourceIntake(changed).issues.some(i=>i.id==="fr:phase22-name-versus-role"));
 const unapproved=structuredClone(originals);
 unapproved.find(b=>b.lesson.id==="ja:cf-a1-01-03:shared-pilot").lesson.sources[0].redistributionVerified=true;
 assert.ok(compilePinnedSourceIntake(unapproved).issues.some(i=>i.id==="ja:phase22-introduction-versus-help"));
 const spoof=structuredClone(PHASE22_AUTHORING);
 spoof[2].encounters[0].quote="未验证的文本";
 assert.ok(compilePinnedSourceIntake(originals,spoof).issues.some(i=>i.id==="zh:phase22-speaker-third-person"));
 const duplicate=compilePinnedSourceIntake(originals,[...PHASE22_AUTHORING,PHASE22_AUTHORING[0]]);
 assert.ok(duplicate.issues.some(i=>i.issue==="DUPLICATE_OR_EXISTING_LESSON"));
});
test("original checkpoints and evidence remain untouched; authored candidates have separate volatile identities",()=>{
 const before=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const encoded=serializeDemoCheckpoint(before,originals);
 assert.deepEqual(parseDemoCheckpoint(encoded,originals),before);
 const candidates=compilePinnedSourceIntake(originals).candidates;
 for(const candidate of candidates){
  assert.ok(!Object.hasOwn(before,checkpointId(candidate)));
  assert.deepEqual(parseDemoCheckpoint(encoded,originals),before);
  assert.ok(!/grade|draft|review|source-intake/i.test(encoded));
 }
});
