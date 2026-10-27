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
  /** Last independently revised submission, retained only in the current tab until reset/load. */
  readonly latestRevisedDraft?: string;
  /** Bounded distinct revisions, oldest to newest, volatile and never in checkpoints. */
  readonly submittedRevisions?: readonly string[];
  /** One protected unpublished working copy; never persisted or silently overwritten. */
  readonly protectedUnsubmittedDraft?: string;
  /** Explicitly protected second independent unsent draft, volatile and never checkpointed. */
  readonly secondProtectedUnsubmittedDraft?: string;
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
  | {readonly type:"restore-last-revision"}
  | {readonly type:"restore-revision";readonly index:number}
  | {readonly type:"restore-protected-draft"}
  | {readonly type:"protect-second-unsent-draft"}
  | {readonly type:"restore-second-protected-draft"}
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

/** Capture a genuinely unsent, independently edited response before any historical swap.
 * A second distinct unsent edit is never silently allowed to overwrite the first. */
function protectedHistoricalSwap(attempt:FrameAttempt,target:string):FrameAttempt|null {
  if(target===attempt.draft)return null;
  const isKnown=attempt.draft===attempt.firstSubmittedDraft||
    (attempt.submittedRevisions??[]).includes(attempt.draft);
  if(attempt.outcome===undefined&&attempt.draft.trim()&&!isKnown){
    if(attempt.protectedUnsubmittedDraft&&
       attempt.protectedUnsubmittedDraft!==attempt.draft&&
       attempt.secondProtectedUnsubmittedDraft!==attempt.draft)return null;
    const {outcome:_old,...editable}=attempt;
    return {...editable,protectedUnsubmittedDraft:attempt.protectedUnsubmittedDraft??attempt.draft,draft:target};
  }
  const {outcome:_old,...editable}=attempt;
  return {...editable,draft:target};
}

/** The original reducer stays the sole writer for volatile draft protection. */
export function canRestoreProtectedDraft(attempt:FrameAttempt):boolean {
  if(!attempt.protectedUnsubmittedDraft||
    attempt.protectedUnsubmittedDraft===attempt.draft)return false;
  const isKnown=attempt.draft===attempt.firstSubmittedDraft||
    (attempt.submittedRevisions??[]).includes(attempt.draft);
  return attempt.outcome?.kind==="ungraded"||
    (attempt.outcome===undefined&&(!attempt.draft.trim()||isKnown||
      attempt.draft===attempt.secondProtectedUnsubmittedDraft));
}

/** Explicit two-copy recovery: never replace the protected original, or overwrite a second copy. */
export function canProtectSecondUnsubmittedDraft(attempt:FrameAttempt):boolean {
  if(attempt.outcome!==undefined||!attempt.protectedUnsubmittedDraft||
    attempt.secondProtectedUnsubmittedDraft||!attempt.draft.trim()||
    attempt.draft===attempt.protectedUnsubmittedDraft)return false;
  return attempt.draft!==attempt.firstSubmittedDraft&&
    !(attempt.submittedRevisions??[]).includes(attempt.draft);
}

export function canRestoreSecondProtectedDraft(attempt:FrameAttempt):boolean {
  if(!attempt.secondProtectedUnsubmittedDraft||
    attempt.secondProtectedUnsubmittedDraft===attempt.draft)return false;
  const isKnown=attempt.draft===attempt.firstSubmittedDraft||
    (attempt.submittedRevisions??[]).includes(attempt.draft);
  return attempt.outcome?.kind==="ungraded"||
    (attempt.outcome===undefined&&(!attempt.draft.trim()||isKnown||
      attempt.draft===attempt.protectedUnsubmittedDraft));
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
        {firstSubmittedDraft:attempt.draft}:{}),
      ...(exercise.kind==="free-production"&&attempt.firstSubmittedDraft&&
        attempt.firstSubmittedDraft!==attempt.draft?{
          latestRevisedDraft:attempt.draft,
          submittedRevisions:[...(attempt.submittedRevisions??[]).filter(v=>v!==attempt.draft),attempt.draft].slice(-3)
        }:{})
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
  if(action.type==="restore-last-revision"){
    if(exercise.kind!=="free-production"||
      (attempt.outcome!==undefined&&attempt.outcome.kind!=="ungraded")||
      attempt.submissions<2||!attempt.latestRevisedDraft||
      attempt.latestRevisedDraft===attempt.draft)return state;
    const editable=protectedHistoricalSwap(attempt,attempt.latestRevisedDraft);
    return editable?updateAttempt(state,frame,editable):state;
  }
  if(action.type==="restore-revision"){
    const history=attempt.submittedRevisions;
    if(exercise.kind!=="free-production"||
      (attempt.outcome!==undefined&&attempt.outcome.kind!=="ungraded")||
      attempt.submissions<3||!history||history.length<2||
      !Number.isSafeInteger(action.index)||action.index<0||
      action.index>=history.length-1||history[action.index]===attempt.draft)return state;
    const editable=protectedHistoricalSwap(attempt,history[action.index]!);
    return editable?updateAttempt(state,frame,editable):state;
  }
  if(action.type==="restore-protected-draft"){
    if(exercise.kind!=="free-production"||!canRestoreProtectedDraft(attempt))return state;
    const {outcome:_old,...editable}=attempt;
    return updateAttempt(state,frame,{...editable,draft:attempt.protectedUnsubmittedDraft!});
  }
  if(action.type==="protect-second-unsent-draft"){
    if(exercise.kind!=="free-production"||!canProtectSecondUnsubmittedDraft(attempt))return state;
    return updateAttempt(state,frame,{...attempt,secondProtectedUnsubmittedDraft:attempt.draft});
  }
  if(action.type==="restore-second-protected-draft"){
    if(exercise.kind!=="free-production"||!canRestoreSecondProtectedDraft(attempt))return state;
    const {outcome:_old,...editable}=attempt;
    return updateAttempt(state,frame,{...editable,draft:attempt.secondProtectedUnsubmittedDraft!});
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
