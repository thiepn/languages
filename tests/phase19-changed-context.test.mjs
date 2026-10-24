import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {APPLICATION_PATHS,APPLICATION_REVIEWS,auditApplicationPaths} from "../apps/learner/src/application-paths.ts";
const read=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const bundles=["fixtures/phase02-source-lessons.json","fixtures/phase15-source-lessons.json","fixtures/phase17-cross-source-lessons.json","fixtures/phase18-next-source-lessons.json"].flatMap(p=>read(p).bundles);
const receipts=read("phase16-source-evidence.json");
test("all six review guides have distinct transfer contexts and original-source anchors",()=>{
 assert.deepEqual(auditApplicationPaths(bundles),[]);
 assert.equal(bundles.length,12);
 assert.equal(bundles.flatMap(b=>b.exercises).length,126);
 for(const path of APPLICATION_PATHS){
  const r=APPLICATION_REVIEWS[path.id];
  assert.ok(r.changedSituation.length>30);
  assert.ok(r.revisionInstruction.length>35);
  assert.notEqual(r.changedSituation,path.situation);
  assert.equal(r.criteria.length,3);
  for(const c of r.criteria)assert.ok(receipts.originalSourceQuotes[c.sourceId]?.includes(c.quote));
 }
});
test("new prompts distinguish articles, social function and Chinese identity",()=>{
 assert.match(APPLICATION_REVIEWS["fr-object-reference"].revisionInstruction,/un, une, des/);
 assert.match(APPLICATION_REVIEWS["fr-introduce-and-describe"].revisionInstruction,/je m’appelle/);
 assert.match(APPLICATION_REVIEWS["ja-first-meeting"].revisionInstruction,/はじめまして/);
 assert.match(APPLICATION_REVIEWS["ja-first-contact-help"].revisionInstruction,/gratitude/);
 assert.match(APPLICATION_REVIEWS["zh-speaker-identity"].revisionInstruction,/我/);
 assert.match(APPLICATION_REVIEWS["zh-negative-or-also"].revisionInstruction,/不是/);
});
