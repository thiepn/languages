import type {LessonBundleV1} from "../../../packages/content-schema/src/lesson-v1.js";
import {
  checkpointId, evaluateExercise, framesFor, revealExercise,
  canContinueAfterAnswer,
  type AnswerResult, type LearningFrame
} from "./lesson-model.ts";

/**
 * Pure, shared Phase 05 player state. Contains NO storage, timestamps, network,
 * StudyEvents, scheduler grades, identity or proficiency authority.
 *
 * React renders this state; the source-owned LessonV1 and ExerciseV1 remain
 * the ONLY lesson data and checking contracts. No second evaluator is introduced.
 */
export interface FrameAttempt {
  readonly draft: string;
  readonly outcome?: AnswerResult;
  readonly submissions: number;
  /** Volatile initial submitted writing, only used to compare a later independent revision. */
  readonly firstSubmittedDraft?: string;
}
export interface LessonPlayerState {
  readonly bundle: LessonBundleV1;
  readonly key: string;
  readonly index: number;
  /** Volatile, page-memory-only authored responses, never persisted. */
  readonly attempts: Readonly<Record<string,FrameAttempt>>;
}
export type LessonPlayerAction =
  | {readonly type:"load";readonly bundle:LessonBundleV1;readonly restoredIndex:number}
  | {readonly type:"draft";readonly value:string}
  | {readonly type:"submit"}
  | {readonly type:"retry"}
  | {readonly type:"revise"}
  | {readonly type:"restore-first-draft"}
  | {readonly type:"reveal"}
  | {readonly type:"next"}
  | {readonly type:"previous"}
  | {readonly type:"reset"};

const MAX_DRAFT_LENGTH=8192;
const EMPTY_ATTEMPT:FrameAttempt=Object.freeze({draft:"",submissions:0});

export function createLessonPlayerState(bundle:LessonBundleV1, restoredIndex=0):LessonPlayerState {
  const frames=framesFor(bundle);
  const index=Number.isSafeInteger(restoredIndex)&&restoredIndex>=0&&restoredIndex<=frames.length
    ?restoredIndex:0;
  return {bundle,key:checkpointId(bundle),index,attempts:{}};
}

export function activeFrame(state:LessonPlayerState):LearningFrame|undefined {
  return framesFor(state.bundle)[state.index];
}

export function activeAttempt(state:LessonPlayerState):FrameAttempt {
  const frame=activeFrame(state);
  return frame?state.attempts[frame.id]??EMPTY_ATTEMPT:EMPTY_ATTEMPT;
}

export function mayAdvance(state:LessonPlayerState):boolean {
  const frame=activeFrame(state);
  return !!frame&&(frame.type==="teaching"||canContinueAfterAnswer(activeAttempt(state).outcome));
}

export function isLessonComplete(state:LessonPlayerState):boolean {
  return state.index===framesFor(state.bundle).length;
}

/** A switch or reset destroys in-memory answers; protect only unsent authored writing. */
export function hasUnsubmittedWriting(state:LessonPlayerState):boolean {
  return framesFor(state.bundle).some(frame=>{
    if(frame.exercise?.kind!=="free-production")return false;
    const attempt=state.attempts[frame.id];
    return !!attempt?.draft.trim()&&attempt.outcome===undefined;
  });
}

function updateAttempt(state:LessonPlayerState,frame:LearningFrame,attempt:FrameAttempt):LessonPlayerState {
  return {...state,attempts:{...state.attempts,[frame.id]:attempt}};
}

/** Rejected events return the *same* state identity, making invalid transitions inert. */
export function reduceLessonPlayer(state:LessonPlayerState,action:LessonPlayerAction):LessonPlayerState {
  if(action.type==="load")return createLessonPlayerState(action.bundle,action.restoredIndex);
  if(action.type==="reset")return createLessonPlayerState(state.bundle);
  if(action.type==="previous")return state.index>0?{...state,index:state.index-1}:state;
  if(action.type==="next")return mayAdvance(state)?{...state,index:state.index+1}:state;
  const frame=activeFrame(state);
  if(!frame?.exercise)return state;
  const exercise=frame.exercise;
  const attempt=activeAttempt(state);
  if(action.type==="draft"){
    if(attempt.outcome!==undefined || action.value.length>MAX_DRAFT_LENGTH)return state;
    return action.value===attempt.draft?state:updateAttempt(state,frame,{...attempt,draft:action.value});
  }
  if(action.type==="submit"){
    if(attempt.outcome!==undefined||!attempt.draft.trim())return state;
    return updateAttempt(state,frame,{
      ...attempt,
      outcome:evaluateExercise(exercise,attempt.draft),
      submissions:attempt.submissions+1,
      ...(exercise.kind==="free-production"&&!attempt.firstSubmittedDraft?
        {firstSubmittedDraft:attempt.draft}:{})
    });
  }
  if(action.type==="revise"){
    if(exercise.kind!=="free-production"||attempt.outcome?.kind!=="ungraded")return state;
    const {outcome:_previousOutcome,...unsent}=attempt;
    return updateAttempt(state,frame,unsent);
  }
  if(action.type==="restore-first-draft"){
    if(exercise.kind!=="free-production"||attempt.outcome?.kind!=="ungraded"||
      attempt.submissions<2||!attempt.firstSubmittedDraft||
      attempt.firstSubmittedDraft===attempt.draft)return state;
    const {outcome:_previousOutcome,...editable}=attempt;
    return updateAttempt(state,frame,{...editable,draft:attempt.firstSubmittedDraft});
  }
  if(action.type==="retry"){
    if(attempt.outcome?.kind!=="incorrect")return state;
    return updateAttempt(state,frame,{draft:exercise.kind==="typed"||exercise.kind==="cloze"?attempt.draft:"",submissions:attempt.submissions});
  }
  if(action.type==="reveal"){
    if(attempt.outcome?.kind!=="incorrect")return state;
    return updateAttempt(state,frame,{...attempt,outcome:revealExercise(exercise)});
  }
  return state;
}
