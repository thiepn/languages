import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {PHASE30_CHINESE_PERSPECTIVES} from "../apps/learner/src/phase30-chinese-perspectives.ts";
import {PHASE30_ENRICHED_PERSPECTIVES} from "../apps/learner/src/phase30-revision-overlay.ts";
import {compilePinnedSourceIntake} from "../apps/learner/src/source-intake.ts";
import {validateLessonBundleV1} from "../packages/content-schema/src/lesson-v1.ts";
import {framesFor,evaluateExercise,revealExercise,checkpointId,serializeDemoCheckpoint,parseDemoCheckpoint} from "../apps/learner/src/lesson-model.ts";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt} from "../apps/learner/src/lesson-player.ts";
import {PHASE22_AUTHORING} from "../apps/learner/src/source-intake.ts";
import {PHASE23_FRENCH_AUTHORING} from "../apps/learner/src/phase23-french-authoring.ts";
import {PHASE24_JAPANESE_AUTHORING} from "../apps/learner/src/phase24-japanese-authoring.ts";
import {PHASE25_CHINESE_AUTHORING} from "../apps/learner/src/phase25-chinese-authoring.ts";
import {PHASE26_CHINESE_DEPTH} from "../apps/learner/src/phase26-chinese-depth.ts";
import {PHASE27_CHINESE_TRANSFER} from "../apps/learner/src/phase27-chinese-transfer.ts";
import {PHASE28_CHINESE_SEQUENCES} from "../apps/learner/src/phase28-chinese-sequences.ts";
import {PHASE29_CHINESE_CONVERSATIONS} from "../apps/learner/src/phase29-chinese-conversations.ts";
const load=p=>JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/"+p,import.meta.url)),"utf8"));
const originals=["phase02-source-lessons","phase15-source-lessons","phase17-cross-source-lessons","phase18-next-source-lessons"].flatMap(p=>load("fixtures/"+p+".json").bundles);
const manifest=load("phase25-chinese-readings.json");
const quotes=load("phase16-source-evidence.json").originalSourceQuotes;
const previous=[...PHASE22_AUTHORING,...PHASE23_FRENCH_AUTHORING,...PHASE24_JAPANESE_AUTHORING,...PHASE25_CHINESE_AUTHORING,
 ...PHASE26_CHINESE_DEPTH,...PHASE27_CHINESE_TRANSFER,...PHASE28_CHINESE_SEQUENCES,...PHASE29_CHINESE_CONVERSATIONS];
const compiled=(spec=PHASE30_ENRICHED_PERSPECTIVES)=>compilePinnedSourceIntake(originals,[...previous,...spec]);
const indices=(tokens,sequence)=>sequence.map(q=>tokens.indexOf(q)).join(",");

test("Phase 30 supplemental third-context batch preserves original 12/126, 37 historical candidates and all four newer Phase 30 lessons",()=>{
 const earlier=compilePinnedSourceIntake(originals,previous);
 const phase30=compiled(PHASE30_CHINESE_PERSPECTIVES);
 const enriched=compiled();
 assert.deepEqual(earlier.issues,[]);
 assert.deepEqual(phase30.issues,[]);
 assert.deepEqual(enriched.issues,[]);
 assert.equal(earlier.candidates.length,37);
 assert.equal(phase30.candidates.length,41);
 assert.equal(enriched.candidates.length,41);
 assert.deepEqual(enriched.candidates.slice(0,37),earlier.candidates);
 assert.equal(originals.length,12);
 assert.equal(originals.reduce((n,b)=>n+b.exercises.length,0),126);
 for(let i=0;i<4;i++){
  const before=phase30.candidates[37+i],after=enriched.candidates[37+i];
  assert.equal(after.lesson.id,before.lesson.id);
  assert.equal(after.lesson.title,before.lesson.title);
  assert.equal(after.lesson.languageId,"zh");
  assert.equal(after.lesson.contentVersion,"phase30-chinese-source-authored-internal-v1");
  assert.equal(after.lesson.publication,"internal-fixture");
  assert.deepEqual(after.lesson.sources,before.lesson.sources);
  assert.deepEqual(after.plugin,before.plugin);
  assert.deepEqual(after.exercises.slice(0,23),before.exercises);
  assert.deepEqual(validateLessonBundleV1(after),[]);
  assert.equal(after.exercises.length,27);
  assert.equal(framesFor(after).length,32);
  assert.equal(after.exercises.filter(e=>e.kind==="free-production").length,7);
  assert.equal(new Set(after.exercises.map(e=>e.id)).size,27);
  for(const e of after.exercises){
   assert.equal(e.evidence.mayScheduleReview,false);
   assert.equal(e.evidence.mayAssertProficiency,false);
  }
  assert.ok(after.lesson.sources.every(s=>s.repository===manifest.sourceRepository&&s.path===manifest.sourcePath&&
    s.revision===manifest.sourceRevision&&s.rights==="review-required"&&s.editorialReview==="pending"&&!s.redistributionVerified));
 }
});

test("source-attested Hanzi, original tone-marked Pinyin and rights remain identical in every preserved encounter",()=>{
 const {candidates,issues}=compiled();assert.deepEqual(issues,[]);
 for(let i=37;i<41;i++){
  const s=PHASE30_ENRICHED_PERSPECTIVES[i-37],b=candidates[i];
  for(const pin of s.encounters){
   assert.ok(quotes[pin.sourceId].includes(pin.quote));
   const origin=originals.find(o=>o.lesson.id===pin.lessonId);
   const ex=origin.lesson.steps.flatMap(st=>st.type==="encounter"?st.examples:[]).find(e=>e.targetText===pin.quote);
   assert.equal(ex.reading,manifest.readings[pin.sourceId][pin.quote]);
   assert.ok(b.lesson.steps[0].examples.some(e=>e.targetText===ex.targetText&&e.reading===ex.reading&&e.meaning===ex.meaning));
  }
  const tone=b.exercises.find(e=>e.id.endsWith(":independent-tone"));
  const second=b.exercises.find(e=>e.id.endsWith(":independent-second-pinyin"));
  for(const ex of [tone,second]){
   assert.equal(evaluateExercise(ex,ex.acceptedAnswers[0]).kind,"correct");
   assert.equal(evaluateExercise(ex,ex.acceptedAnswers[0].normalize("NFD").replace(/[\u0300-\u036f]/gu,"")).kind,"incorrect");
  }
 }
});

test("third-context choice and complete-Hanzi typed questions distinguish two independently wrong attested source excerpts",()=>{
 const {candidates,issues}=compiled();assert.deepEqual(issues,[]);
 for(let i=37;i<41;i++){
  const b=candidates[i],spec=PHASE30_ENRICHED_PERSPECTIVES[i-37].chineseRevision;
  const pairs=[
   [b.exercises.find(e=>e.id.endsWith(":independent-role-reading")),spec.revisedReading],
   [b.exercises.find(e=>e.id.endsWith(":independent-source-reconstruction")),spec.sourceReconstruction]
  ];
  for(const [ex,r] of pairs){
   assert.deepEqual(ex.acceptedAnswers,[r.correctQuote]);
   assert.equal(ex.sourceAid.targetText,r.correctQuote);
   assert.equal(evaluateExercise(ex,r.correctQuote).kind,"correct");
   for(const [wrong,feedback] of [[r.firstWrong,r.firstFeedback],[r.secondWrong,r.secondFeedback]]){
    assert.equal(evaluateExercise(ex,wrong).kind,"incorrect");
    assert.equal(evaluateExercise(ex,wrong).explanation,feedback);
   }
  }
  assert.ok(pairs[0][0].passage.includes("Third authored scenario (not an original source dialogue):"));
  for(const e of b.lesson.steps[0].examples)assert.ok(pairs[0][0].passage.includes(e.targetText+" — "+e.reading));
  assert.equal(pairs[1][0].kind,"typed");
  assert.equal(pairs[1][0].normalization,"unicode-nfc");
  assert.deepEqual(pairs[1][0].sourceIds,[spec.sourceReconstruction.sourceId]);
 }
});

test("third independently authored ordering rejects *both* previously correct situation orders and supports original reveal",()=>{
 const {candidates,issues}=compiled();assert.deepEqual(issues,[]);
 for(let i=37;i<41;i++){
  const b=candidates[i],spec=PHASE30_ENRICHED_PERSPECTIVES[i-37];
  const o=spec.chineseSequence.order,n=spec.chineseConversation.reversedSequence,r=spec.chineseRevision.thirdSequence;
  const ex=b.exercises.find(e=>e.id.endsWith(":independent-third-sequence"));
  assert.equal(ex.kind,"ordering");
  assert.deepEqual(ex.tokens,o.tokens);
  const first=indices(o.tokens,o.expected),second=indices(o.tokens,n.expected),third=indices(o.tokens,r.expected);
  assert.equal(new Set([first,second,third]).size,3);
  assert.deepEqual(ex.acceptedAnswers,[third]);
  assert.equal(evaluateExercise(ex,third).kind,"correct");
  assert.equal(evaluateExercise(ex,first).explanation,r.firstFeedback);
  assert.equal(evaluateExercise(ex,second).explanation,r.secondFeedback);
  assert.equal(evaluateExercise(ex,first).kind,"incorrect");
  assert.equal(evaluateExercise(ex,second).kind,"incorrect");
  assert.deepEqual(revealExercise(ex).expected,[r.expected.join(" ")]);
 }
});

test("seven independently authored ungraded dialogues remain on original Phase 05 player and support revisions",()=>{
 const {candidates,issues}=compiled();assert.deepEqual(issues,[]);
 for(const b of candidates.slice(37)){
  const frames=framesFor(b);
  const written=frames.filter(f=>f.exercise?.kind==="free-production");
  assert.equal(written.length,7);
  for(const frame of written){
   let state=createLessonPlayerState(b,frames.findIndex(f=>f.id===frame.id));
   state=reduceLessonPlayer(state,{type:"draft",value:"我先写出独立中文练习。"});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
   state=reduceLessonPlayer(state,{type:"revise"});
   state=reduceLessonPlayer(state,{type:"draft",value:"换个听者，再独立修订对话。"});
   state=reduceLessonPlayer(state,{type:"submit"});
   assert.equal(activeAttempt(state).outcome?.kind,"ungraded");
   assert.equal(activeAttempt(state).submissions,2);
   assert.equal(activeAttempt(state).outcome?.rubric.length,3);
  }
 }
});

test("unverified Hanzi, wrong source, duplicate answer, old sequence collision, and rights attacks fail closed",()=>{
 const changes=[
  a=>{a[0].chineseRevision.revisedReading.firstWrong=a[0].chineseRevision.revisedReading.correctQuote;},
  a=>{a[1].chineseRevision.revisedReading.secondWrong=a[1].chineseRevision.revisedReading.firstWrong;},
  a=>{a[2].chineseRevision.sourceReconstruction.correctQuote="假的来源句子";},
  a=>{a[3].chineseRevision.sourceReconstruction.sourceId="zh-ni-demo";},
  a=>{a[0].chineseRevision.sourceReconstruction.firstFeedback="";},
  a=>{a[1].chineseRevision.thirdSequence.expected=[...a[1].chineseSequence.order.expected];},
  a=>{a[2].chineseRevision.thirdSequence.expected=[...a[2].chineseConversation.reversedSequence.expected];},
  a=>{a[3].chineseRevision.thirdSequence.expected[0]=a[3].chineseRevision.thirdSequence.expected[1];},
  a=>{a[0].chineseRevision.independentRevision.criteria[2]="";},
  a=>{a[1].chinesePerspective.secondPinyin.reading="bu shi";},
  a=>{a[2].languageId="fr";}
 ];
 for(const mutate of changes){
  const edited=structuredClone(PHASE30_ENRICHED_PERSPECTIVES);
  mutate(edited);assert.ok(compilePinnedSourceIntake(originals,edited).issues.length);
 }
 for(const mutate of [
  a=>{a.find(b=>b.lesson.id==="zh:wo:shared-pilot").lesson.sources[0].rights="original-owned";},
  a=>{a.find(b=>b.lesson.id==="zh:shi:shared-pilot").lesson.sources[0].redistributionVerified=true;},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.sources[0].revision="0".repeat(40);},
  a=>{a.find(b=>b.lesson.id==="zh:ni-hao:shared-pilot").lesson.steps.find(s=>s.type==="encounter").examples[0].reading="ni hao";}
 ]){
  const copied=structuredClone(originals);mutate(copied);
  assert.ok(compilePinnedSourceIntake(copied,PHASE30_ENRICHED_PERSPECTIVES).issues.length);
 }
});

test("all editorial extensions preserve canonical versioned checkpoints and never take over Chinese FSRS/history",()=>{
 const positions=Object.fromEntries(originals.map((b,i)=>[checkpointId(b),Math.min(i,framesFor(b).length)]));
 const serialized=serializeDemoCheckpoint(positions,originals);
 assert.deepEqual(parseDemoCheckpoint(serialized,originals),positions);
 assert.ok(compiled().candidates.every(c=>!Object.hasOwn(positions,checkpointId(c))));
 assert.doesNotMatch(serialized,/"(?:draft|writing|userId|fsrs|officialHskLevel|grade|proficiency|publication|tone|approval)":/);
});
