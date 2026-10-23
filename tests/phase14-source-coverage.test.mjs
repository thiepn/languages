import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {admitInternalPilot,editorialPreflight,sourceCoverage} from "../apps/learner/src/source-coverage.ts";
import {framesFor} from "../apps/learner/src/lesson-model.ts";
const data=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const copy=b=>structuredClone(b);
const byLanguage=Object.fromEntries(data.bundles.map(b=>[b.lesson.languageId,b]));

test("four original source entities retain traceable practice and exact frame positions",()=>{
 assert.equal(data.bundles.length,3);
 for(const bundle of data.bundles){
  const entries=admitInternalPilot(bundle);
  assert.equal(entries.length,bundle.lesson.sources.length);
  for(const item of entries){
   assert.ok(item.guided.length+item.independent.length>0);
   assert.ok(item.independent.length>0);
   assert.equal(item.ungradedIndependent,item.independent.filter(x=>x.kind==="free-production").length);
   for(const activity of [...item.guided,...item.independent]){
    const frame=framesFor(bundle)[activity.frameIndex];
    assert.equal(frame.exercise.id,activity.id);
    assert.ok(frame.exercise.sourceIds.includes(item.source.id));
    assert.equal(frame.stage,activity.purpose);
   }
   assert.ok(item.independent.some(x=>x.kind!=="free-production"));
  }
 }
 assert.equal(sourceCoverage(byLanguage.zh).length,2);
 const hao=sourceCoverage(byLanguage.zh).find(x=>x.source.originalEntityId==="好");
 assert.equal(hao.guided.length,4); // Existing original exercises now explicitly cite 好.
 assert.ok(hao.independent.length>0);
 assert.ok(sourceCoverage(byLanguage.zh).every(x=>x.independent.length>0));
});

test("preview admission rejects unreviewed owner, identity, revision and publication drift",()=>{
 const original=byLanguage.fr;
 const changes=[
  x=>{x.lesson.id="fr:unreviewed";},
  x=>{x.lesson.sources[0].revision="0".repeat(40);},
  x=>{x.lesson.sources[0].path="another/file.ts";},
  x=>{x.lesson.sources[0].originalEntityId="a1-02";},
  x=>{x.lesson.sources[0].rights="review-required";},
  x=>{x.lesson.sources[0].redistributionVerified=true;},
  x=>{x.lesson.sources[0].editorialReview="approved";},
  x=>{x.lesson.publication="candidate";},
  x=>{x.exercises=x.exercises.filter(e=>e.id!=="fr-p13-independent-etre");},
  x=>{x.exercises[0].sourceIds=["other-source"];},
  x=>{x.lesson.sources[0].repository="thiepn/japanese";}
 ];
 for(const mutate of changes){
  const candidate=copy(original);
  mutate(candidate);
  assert.throws(()=>admitInternalPilot(candidate),{name:"Error"});
 }
 assert.equal(admitInternalPilot(original).length,1);
});

test("editorial preflight is source-specific and never approves current internal pilots",()=>{
 for(const bundle of data.bundles){
  const preflight=editorialPreflight(bundle);
  assert.equal(preflight.readyForSeparateReview,false);
  assert.ok(preflight.blockers.some(s=>s.includes("Internal fixture")));
  for(const source of bundle.lesson.sources){
   assert.ok(preflight.blockers.some(s=>s.includes(source.id+": redistribution rights")));
   assert.ok(preflight.blockers.some(s=>s.includes(source.id+": editorial review")));
  }
 }
 const candidate=copy(byLanguage.fr);
 candidate.lesson.sources[0].editorialReview="approved";
 candidate.lesson.sources[0].redistributionVerified=true;
 assert.equal(editorialPreflight(candidate).readyForSeparateReview,false);
});

test("coverage is authored metadata rather than a grade, response or review history",()=>{
 for(const bundle of data.bundles){
  const report=JSON.stringify(sourceCoverage(bundle));
  assert.ok(!/"(answer|attempts|submissions|grades|score|progress|userId)":/i.test(report));
  assert.ok(!/"(?:studyEvents|fsrs|proficiency|cefr|hsk|jlpt)"\s*:/i.test(report));
 }
});
