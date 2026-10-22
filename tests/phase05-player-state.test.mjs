import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {
  activeFrame,activeAttempt,createLessonPlayerState,isLessonComplete,
  mayAdvance,reduceLessonPlayer
} from "../apps/learner/src/lesson-player.ts";
import {
  checkpointId,parseDemoCheckpoint,serializeDemoCheckpoint
} from "../apps/learner/src/lesson-model.ts";

const fixture=JSON.parse(readFileSync(fileURLToPath(new URL("../contracts/fixtures/phase02-source-lessons.json",import.meta.url)),"utf8"));
const byLang=Object.fromEntries(fixture.bundles.map(bundle=>[bundle.lesson.languageId,bundle]));
function moveTeaching(state,n){
  for(let i=0;i<n;i++)state=reduceLessonPlayer(state,{type:"next"});
  return state;
}

test("one typed reducer owns all three complete source lesson journeys",()=>{
  for(const language of ["fr","ja","zh"]){
    let state=createLessonPlayerState(byLang[language]);
    assert.equal(state.index,0);
    for(let i=0;i<16;i++){
      const frame=activeFrame(state);
      assert.ok(frame);
      if(frame.exercise){
        const exercise=frame.exercise;
        const value=exercise.kind==="free-production"?"Original example composed independently":exercise.acceptedAnswers[0];
        state=reduceLessonPlayer(state,{type:"draft",value});
        assert.equal(mayAdvance(state),false);
        state=reduceLessonPlayer(state,{type:"submit"});
        assert.equal(activeAttempt(state).outcome.kind,exercise.kind==="free-production"?"ungraded":"correct");
      }
      assert.equal(mayAdvance(state),true);
      state=reduceLessonPlayer(state,{type:"next"});
      assert.equal(state.index,i+1);
    }
    assert.equal(isLessonComplete(state),true);
    assert.equal(activeFrame(state),undefined);
    assert.equal(reduceLessonPlayer(state,{type:"next"}),state);
    assert.equal(state.attempts[Object.keys(state.attempts)[0]].submissions,1);
    assert.equal(JSON.stringify(state).includes("mayScheduleReview"),true); // fixture data only, not emitted evidence
  }
});

test("incorrect results are blocking; retry reopens editing and reveal is uncredited",()=>{
  let state=moveTeaching(createLessonPlayerState(byLang.fr),3);
  assert.equal(activeFrame(state).exercise.kind,"choice");
  const blank=state;
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(state,blank);
  state=reduceLessonPlayer(state,{type:"draft",value:"Salut, madame."});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome.kind,"incorrect");
  assert.equal(activeAttempt(state).submissions,1);
  assert.equal(mayAdvance(state),false);
  assert.equal(reduceLessonPlayer(state,{type:"next"}),state);
  assert.equal(reduceLessonPlayer(state,{type:"submit"}),state);
  assert.equal(reduceLessonPlayer(state,{type:"draft",value:"Bonjour, madame."}),state);
  state=reduceLessonPlayer(state,{type:"retry"});
  assert.equal(activeAttempt(state).outcome,undefined);
  assert.equal(activeAttempt(state).draft,"");
  assert.equal(activeAttempt(state).submissions,1);
  state=reduceLessonPlayer(state,{type:"draft",value:"Salut, madame."});
  state=reduceLessonPlayer(state,{type:"submit"});
  state=reduceLessonPlayer(state,{type:"reveal"});
  assert.equal(activeAttempt(state).outcome.kind,"revealed");
  assert.equal(mayAdvance(state),true);
  assert.deepEqual(activeAttempt(state).outcome.expected,["Bonjour, madame."]);
  assert.equal(activeAttempt(state).submissions,2);
  assert.equal(reduceLessonPlayer(state,{type:"reveal"}),state);
  assert.equal(reduceLessonPlayer(state,{type:"retry"}),state);
});

test("previous/next preserves in-memory outcomes within lesson; reset discards them",()=>{
  let state=moveTeaching(createLessonPlayerState(byLang.ja),3);
  const id=activeFrame(state).id;
  state=reduceLessonPlayer(state,{type:"draft",value:"おはようございます。"});
  state=reduceLessonPlayer(state,{type:"submit"});
  assert.equal(activeAttempt(state).outcome.kind,"correct");
  const withAnswer=state;
  state=reduceLessonPlayer(state,{type:"previous"});
  assert.equal(state.index,2);
  assert.equal(reduceLessonPlayer(state,{type:"previous"}).index,1);
  assert.equal(activeAttempt(state).outcome,undefined);
  state=reduceLessonPlayer(state,{type:"next"});
  assert.equal(state.index,3);
  assert.deepEqual(state.attempts[id],withAnswer.attempts[id]);
  state=reduceLessonPlayer(state,{type:"reset"});
  assert.equal(state.index,0);
  assert.deepEqual(state.attempts,{});
});

test("language switching isolates attempts and never carries foreign source evidence",()=>{
  let state=moveTeaching(createLessonPlayerState(byLang.fr),3);
  state=reduceLessonPlayer(state,{type:"draft",value:"Bonsoir, madame."});
  state=reduceLessonPlayer(state,{type:"load",bundle:byLang.zh,restoredIndex:3});
  assert.equal(state.bundle.lesson.languageId,"zh");
  assert.equal(state.index,3);
  assert.deepEqual(state.attempts,{});
  assert.equal(activeAttempt(state).draft,"");
  state=reduceLessonPlayer(state,{type:"load",bundle:byLang.ja,restoredIndex:999});
  assert.equal(state.index,0);
  state=reduceLessonPlayer(state,{type:"load",bundle:byLang.fr,restoredIndex:NaN});
  assert.equal(state.index,0);
});

test("interruptions restore only validated frame position, never answers or feedback",()=>{
  const bundles=Object.values(byLang);
  let state=moveTeaching(createLessonPlayerState(byLang.zh),3);
  state=reduceLessonPlayer(state,{type:"draft",value:"你们"});
  state=reduceLessonPlayer(state,{type:"submit"});
  const versioned=checkpointId(byLang.zh);
  const serialized=serializeDemoCheckpoint({[versioned]:state.index},bundles);
  assert.ok(!serialized.includes("你们"));
  assert.ok(!serialized.includes("incorrect"));
  const parsed=parseDemoCheckpoint(serialized,bundles);
  state=createLessonPlayerState(byLang.zh,parsed[versioned]);
  assert.equal(state.index,3);
  assert.deepEqual(state.attempts,{});
  assert.equal(mayAdvance(state),false);
  assert.equal(reduceLessonPlayer(state,{type:"next"}),state);
});

test("version changes reject stale checkpoints, and completed recovery makes no award",()=>{
  const previous=byLang.fr;
  const oldKey=checkpointId(previous);
  const old=serializeDemoCheckpoint({[oldKey]:10},[previous]);
  const updated=structuredClone(previous);
  updated.lesson.contentVersion+="-next-edition";
  const restored=parseDemoCheckpoint(old,[updated]);
  assert.deepEqual(restored,{});
  let state=createLessonPlayerState(updated,restored[checkpointId(updated)]);
  assert.equal(state.index,0);
  state=createLessonPlayerState(previous,16);
  assert.equal(isLessonComplete(state),true);
  assert.deepEqual(state.attempts,{});
  assert.equal(mayAdvance(state),false);
});

test("blank, overlength, invalid-transition and boundary actions are inert",()=>{
  const init=createLessonPlayerState(byLang.fr);
  assert.equal(reduceLessonPlayer(init,{type:"previous"}),init);
  assert.equal(reduceLessonPlayer(init,{type:"draft",value:"ignored"}),init);
  assert.equal(reduceLessonPlayer(init,{type:"reveal"}),init);
  let active=moveTeaching(init,3);
  assert.equal(reduceLessonPlayer(active,{type:"draft",value:"x".repeat(8193)}),active);
  assert.equal(reduceLessonPlayer(active,{type:"retry"}),active);
  assert.equal(reduceLessonPlayer(active,{type:"reveal"}),active);
  assert.equal(reduceLessonPlayer(active,{type:"next"}),active);
});

test("ungraded independent production remains ungraded even when submitted repeatedly",()=>{
  let state=createLessonPlayerState(byLang.zh,12);
  assert.equal(activeFrame(state).exercise.kind,"free-production");
  state=reduceLessonPlayer(state,{type:"draft",value:"你好，你们！"});
  state=reduceLessonPlayer(state,{type:"submit"});
  const result=activeAttempt(state);
  assert.equal(result.outcome.kind,"ungraded");
  assert.equal(mayAdvance(state),true);
  assert.equal(reduceLessonPlayer(state,{type:"submit"}),state);
  assert.equal(reduceLessonPlayer(state,{type:"reveal"}),state);
  assert.equal(result.submissions,1);
});
