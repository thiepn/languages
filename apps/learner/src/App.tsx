import {useEffect,useMemo,useReducer,useRef,useState,type RefObject} from "react";
import type {AnswerResult, LearningFrame} from "./lesson-model";
import type {ExerciseSourceComparisonV1} from "../../../packages/content-schema/src/lesson-v1";
import {createLessonPlayerState,reduceLessonPlayer,activeAttempt,isLessonComplete,mayAdvance,hasUnsubmittedWriting} from "./lesson-player";
import {
  checkpointId, DEMO_CHECKPOINT_KEY,
  framesFor, parseOrderingDraft, parseDemoCheckpoint, serializeDemoCheckpoint
} from "./lesson-model";
import {DEMO_BUNDLES,COURSE_BUNDLES,SOURCE_COVERAGE_BY_LESSON,LANGUAGES,languageLabel,type LanguageChoice} from "./catalog";
import type {LessonBundleV1} from "../../../packages/content-schema/src/lesson-v1";
import {APPLICATION_PATHS,APPLICATION_REVIEWS,resolveApplicationStep,auditApplicationPaths,type ApplicationPath} from "./application-paths";

type Destination = "home" | "course" | "review" | "profile";
const NAV: readonly {id:Destination;label:string}[] = [
  {id:"home",label:"Home"},{id:"course",label:"Course"},
  {id:"review",label:"Review"},{id:"profile",label:"Profile"}
];
const ALL_BUNDLES=Object.values(COURSE_BUNDLES).flat();
if(auditApplicationPaths(ALL_BUNDLES).length)throw new Error("Unreviewed application path or original source attribution");

const DEMO_LANGUAGE_KEY="thiepn-languages-phase04-active-language";
function readSelected():LanguageChoice{
  try{
    const value=window.sessionStorage.getItem(DEMO_LANGUAGE_KEY);
    return LANGUAGES.some(language=>language.id===value)?value as LanguageChoice:"fr";
  }catch{return "fr";}
}
function readPositions():Record<string,number>{
  try{return parseDemoCheckpoint(window.sessionStorage.getItem(DEMO_CHECKPOINT_KEY),ALL_BUNDLES);}
  catch{return {};}
}
function stageName(frame:LearningFrame):string {
  if(frame.stage==="encounter")return "Encounter";
  if(frame.stage==="explain")return "Explanation";
  if(frame.stage==="guided")return "Guided practice";
  if(frame.stage==="independent")return "Independent practice";
  return "Reflection";
}
function SourceComparisonView({comparison,languageId}:{
  comparison:ExerciseSourceComparisonV1;
  languageId:string;
}){
  return <details className="source-comparison">
    <summary>Compare source contexts</summary>
    <div className="comparison-examples">
      {[comparison.first,comparison.second].map((example,i)=><blockquote key={i}>
        <p className="target" lang={languageId}>{example.targetText}</p>
        <p className="translation">{example.meaning}</p>
      </blockquote>)}
    </div>
    <p className="source-cue">{comparison.cue}</p>
  </details>;
}
function ExerciseView({
  frame,draft,result,onDraft,onSubmit,onRetry,onReveal,onRevise,headingRef
}:{
  frame:LearningFrame;
  draft:string;
  result:AnswerResult|undefined;
  onDraft:(value:string)=>void;
  onSubmit:()=>void;
  onRetry:()=>void;
  onReveal:()=>void;
  onRevise:()=>void;
  headingRef:RefObject<HTMLHeadingElement|null>;
}){
  const composing=useRef(false);
  const feedbackRef=useRef<HTMLDivElement>(null);
  const formRef=useRef<HTMLFormElement>(null);
  const hadIncorrect=useRef(false);
  const hadWritingFeedback=useRef(false);
  useEffect(()=>{
    if(result!==undefined)feedbackRef.current?.focus();
    else if(hadIncorrect.current||hadWritingFeedback.current)
      formRef.current?.querySelector<HTMLElement>('input:not(:disabled),textarea:not(:disabled),button.order-option:not(:disabled)')?.focus();
    hadIncorrect.current=result?.kind==="incorrect";
    hadWritingFeedback.current=result?.kind==="ungraded";
  },[result]);
  const exercise=frame.exercise;
  if(!exercise)return null;
  const order=exercise.kind==="ordering"?parseOrderingDraft(draft,exercise.tokens.length):[];
  const canCheck=exercise.kind==="ordering"?order.length===exercise.tokens.length:!!draft.trim();
  return <form ref={formRef} className="activity" aria-label={stageName(frame)}
    onKeyDown={event=>{
      if(event.key==="Enter"&&(composing.current||event.nativeEvent.isComposing||event.keyCode===229))
        event.preventDefault();
    }}
    onSubmit={event=>{event.preventDefault();if(!composing.current)onSubmit();}}>
    <p className="phase">{stageName(frame)}</p>
    <h2 tabIndex={-1} ref={headingRef}>{exercise.instruction}</h2>
    {exercise.kind==="reading"&&<div className="reading-passage">
      <p className="passage-text" lang={exercise.languageId}>{exercise.passage}</p>
      {exercise.reading&&<p className="reading" lang="zh-Latn-pinyin">{exercise.reading}</p>}
      <p className="reading-question">{exercise.question}</p>
    </div>}
    {exercise.kind==="cloze"&&<p className="cloze-prompt" lang={exercise.languageId}>{exercise.before}<span aria-label="missing word">_____</span>{exercise.after}</p>}
    {exercise.kind==="free-production"&&<div className="writing-references">
      <details>
        <summary>Writing criteria</summary>
        <ul>{exercise.rubric.map(item=><li key={item}>{item}</li>)}</ul>
      </details>
      {exercise.sourceComparison&&
        <SourceComparisonView comparison={exercise.sourceComparison} languageId={exercise.languageId}/>}
      {exercise.sourceAid&&<details>
        <summary>Original source example</summary>
        <blockquote>
          <p className="target" lang={exercise.languageId}>{exercise.sourceAid.targetText}</p>
          <p className="translation">{exercise.sourceAid.meaning}</p>
        </blockquote>
        <p>{exercise.sourceAid.cue}</p>
      </details>}
    </div>}
    {(exercise.kind==="choice"||exercise.kind==="reading")?
      <fieldset className="choice-list" disabled={result!==undefined}>
        <legend className="sr-only">{exercise.instruction}</legend>
        {exercise.options.map((option,i)=><label key={option} className={"choice"+(draft===option?" selected":"")}>
          <input type="radio" name={"answer-"+exercise.id} value={option} checked={draft===option} onChange={()=>onDraft(option)}/>
          <span className="choice-num" aria-hidden="true">{String(i+1).padStart(2,"0")}</span>
          <span>{option}</span>
        </label>)}
      </fieldset>:exercise.kind==="ordering"?
      <div className="order-activity" aria-label="Arrange the parts in order">
        <p className="order-label">Selected order</p>
        <ol className="chosen-tokens" aria-live="polite">
          {order.map(i=><li key={i} lang={exercise.languageId}>{exercise.tokens[i]}</li>)}
        </ol>
        <fieldset disabled={result!==undefined} className="order-options">
          <legend>Choose the next part</legend>
          {exercise.tokens.map((token,i)=><button key={i} type="button" className="order-option"
            disabled={order.includes(i)} onClick={()=>onDraft([...order,i].join(","))}
            aria-label={"Add "+token} lang={exercise.languageId}>{token}</button>)}
          <button type="button" className="secondary-action" disabled={!order.length}
            onClick={()=>onDraft(order.slice(0,-1).join(","))}>Undo last</button>
        </fieldset>
      </div>:
      <label className="answer-field">
        <span>{exercise.kind==="free-production"?"Your response":"Your answer"}</span>
        {exercise.kind!=="free-production"?
          <input value={draft} onChange={event=>onDraft(event.target.value)}
            onCompositionStart={()=>{composing.current=true;}}
            onCompositionEnd={()=>{composing.current=false;}}
            disabled={result!==undefined} autoComplete="off" autoCapitalize="off" spellCheck={false}
            inputMode="text" maxLength={8192} lang={exercise.languageId} />:
          <textarea value={draft} onChange={event=>onDraft(event.target.value)}
            onCompositionStart={()=>{composing.current=true;}}
            onCompositionEnd={()=>{composing.current=false;}}
            disabled={result!==undefined} maxLength={8192} rows={5} lang={exercise.languageId}/>}
        {exercise.kind==="free-production"&&result===undefined&&!!draft.trim()&&
          <span className="draft-warning">Unsubmitted writing stays on this page, but is lost if you reload.</span>}
      </label>}
    {result!==undefined?<div ref={feedbackRef} tabIndex={-1} className={"feedback "+result.kind} role="status" aria-live="polite">
      <strong>{result.kind==="correct"?"Answer accepted":result.kind==="incorrect"?"Not quite — try again":result.kind==="revealed"?"Answer revealed — not credited":"Ungraded practice"}</strong>
      <p>{result.explanation}</p>
      {result.kind==="incorrect"&&exercise.sourceAid&&<details className="source-aid">
        <summary>Review source example</summary>
        <blockquote>
          <p className="target" lang={exercise.languageId}>{exercise.sourceAid.targetText}</p>
          <p className="translation">{exercise.sourceAid.meaning}</p>
        </blockquote>
        <p className="source-cue">{exercise.sourceAid.cue}</p>
      </details>}
      {result.kind==="incorrect"&&exercise.sourceComparison&&
        <SourceComparisonView comparison={exercise.sourceComparison} languageId={exercise.languageId}/>}
      {result.kind==="revealed" && <p>Expected: <span lang={exercise.languageId}>{result.expected.join(" / ")}</span></p>}
      {result.kind==="ungraded" && <ul>{result.rubric.map(item=><li key={item}>{item}</li>)}</ul>}
    </div>:<p className="scoring-note">
      {exercise.kind==="free-production"?"This response is not automatically graded.":"Practice feedback only — no review grade is recorded."}
    </p>}
    {result?.kind==="ungraded"&&<button className="secondary-action revise-action" type="button" onClick={onRevise}>Revise writing</button>}
    {result?.kind==="incorrect"&&<div className="retry-actions"><button className="secondary-action" type="button" onClick={onRetry}>Try again</button><button className="text-button" type="button" onClick={onReveal}>Show answer</button></div>}
    {result===undefined&&<button className="check-button" type="submit" disabled={!canCheck}>{exercise.kind==="free-production"?"Review writing":"Check answer"}</button>}
  </form>;
}

function TeachingView({frame,languageId,headingRef}:{frame:LearningFrame;languageId:string;headingRef:RefObject<HTMLHeadingElement|null>}){
  const step=frame.step;
  if(!step)return null;
  return <section className="activity">
    <p className="phase">{stageName(frame)}</p>
    {step.type==="encounter"?<>
      <h2 tabIndex={-1} ref={headingRef}>Read these expressions</h2>
      <div className="example-list">{step.examples.map((example,i)=><article className="example" key={i}>
        <p className="target" lang={languageId}>{example.targetText}</p>
        {example.reading&&<p className="reading" lang="zh-Latn-pinyin">{example.reading}</p>}
        <p className="translation">{example.meaning}</p>
      </article>)}</div>
    </>:step.type==="explain"?<>
      <h2 tabIndex={-1} ref={headingRef}>{step.heading??"Understand the pattern"}</h2>
      <p className="explanation">{step.explanation}</p>
    </>:step.type==="reflect"?<>
      <h2 tabIndex={-1} ref={headingRef}>{step.heading??"Reflection"}</h2>
      <p className="explanation">{step.feedback}</p>
    </>:null}
  </section>;
}

export function App(){
  const [player,dispatch]=useReducer(reduceLessonPlayer,undefined,()=>{
    const source=DEMO_BUNDLES[readSelected()];
    return createLessonPlayerState(source,readPositions()[checkpointId(source)]??0);
  });
  const selected=player.bundle.lesson.languageId as LanguageChoice;
  const [destination,setDestination]=useState<Destination>("home");
  const [lessonOpen,setLessonOpen]=useState(false);
  const [positions,setPositions]=useState<Record<string,number>>(readPositions);
  const [activeApplication,setActiveApplication]=useState<{id:string;step:number}|null>(null);
  const [writingReview,setWritingReview]=useState<{
    pathId:string;exerciseId:string;firstDraft:string;checked:readonly boolean[];revised:boolean;
  }|null>(null);
  const titleRef=useRef<HTMLHeadingElement>(null);
  const activityHeadingRef=useRef<HTMLHeadingElement>(null);
  const bundle=player.bundle;
  const frames=useMemo(()=>framesFor(bundle),[bundle]);
  const index=player.index;
  const complete=isLessonComplete(player);
  const courseSequence=COURSE_BUNDLES[selected];
  const lessonPosition=courseSequence.findIndex(item=>item.lesson.id===bundle.lesson.id);
  const nextLesson=lessonPosition<0?undefined:courseSequence[lessonPosition+1];
  const frame=frames[index];
  const currentResult=activeAttempt(player).outcome;
  const currentDraft=activeAttempt(player).draft;
  const canAdvance=mayAdvance(player);
  const currentPath=APPLICATION_PATHS.find(p=>p.id===activeApplication?.id);
  const currentApplicationStep=currentPath?.steps[activeApplication?.step??0];
  const isAppliedFrame=currentApplicationStep?.lessonId===bundle.lesson.id&&currentApplicationStep.exerciseId===frame?.exercise?.id;
  const applicationWriting=isAppliedFrame&&frame?.exercise?.kind==="free-production";
  const reviewGuide=currentPath?APPLICATION_REVIEWS[currentPath.id]:undefined;
  const currentReview=applicationWriting&&writingReview?.pathId===currentPath?.id&&writingReview?.exerciseId===frame?.exercise?.id?writingReview:null;
  const reviewedWriting=currentReview?.checked.every(Boolean)===true&&currentResult?.kind==="ungraded";

  useEffect(()=>{
    try{window.sessionStorage.setItem(DEMO_LANGUAGE_KEY,selected);}catch{/* Optional tab-only language choice. */}
  },[selected]);
  useEffect(()=>{
    setPositions(old=>{
      if(old[player.key]===player.index||(old[player.key]===undefined&&player.index===0))return old;
      return {...old,[player.key]:player.index};
    });
  },[player.key,player.index]);
  useEffect(()=>{
    try{window.sessionStorage.setItem(DEMO_CHECKPOINT_KEY,serializeDemoCheckpoint(positions,ALL_BUNDLES));}
    catch{/* The preview still works in memory if browser tab storage is unavailable. */}
  },[positions]);
  useEffect(()=>{
    if(lessonOpen)(activityHeadingRef.current??titleRef.current)?.focus();
  },[lessonOpen,index,selected]);

  function confirmWritingDiscard():boolean {
    return !hasUnsubmittedWriting(player) ||
      window.confirm("Discard unsent writing? It is only held in this page and cannot be recovered after this action.");
  }
  function selectLanguage(id:LanguageChoice){
    if(id===selected||!confirmWritingDiscard())return;
    const next=DEMO_BUNDLES[id];
    dispatch({type:"load",bundle:next,restoredIndex:positions[checkpointId(next)]??0});
    setActiveApplication(null);
    setWritingReview(null);
    setLessonOpen(false);
    setDestination("course");
  }
  function navigate(id:Destination){
    setActiveApplication(null);
    setWritingReview(null);
    setLessonOpen(false);
    setDestination(id);
  }
  function startLesson(){
    setDestination("course");
    setLessonOpen(true);
  }
  function openSourcePractice(frameIndex:number){
    if(!confirmWritingDiscard())return;
    setActiveApplication(null);
    setWritingReview(null);
    dispatch({type:"load",bundle,restoredIndex:frameIndex});
    startLesson();
  }
  function openCourseLesson(next:LessonBundleV1){
    if(next.lesson.id===bundle.lesson.id){setActiveApplication(null);setWritingReview(null);startLesson();return;}
    if(!confirmWritingDiscard())return;
    setActiveApplication(null);
    setWritingReview(null);
    dispatch({type:"load",bundle:next,restoredIndex:positions[checkpointId(next)]??0});
    startLesson();
  }
  function startApplication(path:ApplicationPath,stepIndex=0){
    const step=path.steps[stepIndex];
    if(!step||!confirmWritingDiscard())return;
    const found=resolveApplicationStep(ALL_BUNDLES,step);
    if(!found)return;
    setActiveApplication({id:path.id,step:stepIndex});
    setWritingReview(null);
    dispatch({type:"load",bundle:found.bundle,restoredIndex:found.frameIndex});
    startLesson();
  }
  function completeApplicationStep(){
    if(!currentPath||!isAppliedFrame||!currentResult||currentResult.kind==="incorrect"||
      (applicationWriting&&!reviewedWriting))return;
    const next=(activeApplication?.step??0)+1;
    if(next>=currentPath.steps.length){setActiveApplication(null);setLessonOpen(false);setDestination("course");return;}
    startApplication(currentPath,next);
  }
  function openWritingReview(revised=false){
    if(!applicationWriting||!currentPath||!frame?.exercise||!reviewGuide||!currentDraft.trim())return;
    const exerciseId=frame.exercise.id;
    setWritingReview(previous=>previous?.pathId===currentPath.id&&previous.exerciseId===exerciseId
      ?{...previous,revised:previous.revised||revised,
        checked:revised?reviewGuide.criteria.map(()=>false):previous.checked}
      :{pathId:currentPath.id,exerciseId,firstDraft:currentDraft,checked:reviewGuide.criteria.map(()=>false),revised});
  }
  function reviseApplicationWriting(){
    openWritingReview(true);
    dispatch({type:"revise"});
  }
  function restart(){
    if(!confirmWritingDiscard())return;
    setActiveApplication(null);
    setWritingReview(null);
    dispatch({type:"reset"});
    startLesson();
  }
  function clearPreview(){
    if(!confirmWritingDiscard())return;
    setActiveApplication(null);
    setWritingReview(null);
    setPositions({});
    dispatch({type:"load",bundle:DEMO_BUNDLES.fr,restoredIndex:0});
    setLessonOpen(false);
    try{window.sessionStorage.removeItem(DEMO_LANGUAGE_KEY);window.sessionStorage.removeItem(DEMO_CHECKPOINT_KEY);}catch{/* No storage access. */}
  }

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Application navigation">
      <div className="brand"><span className="brand-word">THIEPN</span><span className="brand-sub">LANGUAGES</span></div>
      <nav className="primary-nav" aria-label="Primary">
        {NAV.map(item=><button key={item.id} type="button" aria-current={!lessonOpen&&destination===item.id?"page":undefined} onClick={()=>navigate(item.id)}>{item.label}</button>)}
      </nav>
      <p className="sidebar-status">Internal lesson preview</p>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <div className="topbar-title">LANGUAGES <span className="preview-tag">PREVIEW</span></div>
        <label className="language-switch">
          <span>Language</span>
          <select aria-label="Study language" value={selected} onChange={event=>selectLanguage(event.target.value as LanguageChoice)}>
            {LANGUAGES.map(language=><option key={language.id} value={language.id}>{language.label}</option>)}
          </select>
        </label>
      </header>
      <main className={"content "+(lessonOpen?"in-lesson":"")} id="main-content">
        {lessonOpen?<>
          <div className="lesson-bar">
            <button className="text-button" type="button" onClick={()=>setLessonOpen(false)}>← Course</button>
            <span>{languageLabel(selected)} · Internal fixture</span>
          </div>
          <div className="lesson-layout">
            <div className="lesson-heading">
              <p className="eyebrow">{bundle.lesson.level??"Introductory"} · {languageLabel(selected)}</p>
              <h1 ref={titleRef} tabIndex={-1}>{bundle.lesson.title}</h1>
              <p className="lesson-objective">{bundle.lesson.objective.statement}</p>
              <label className="progress-label" htmlFor="lesson-progress">{complete?`${frames.length} of ${frames.length} activities reached`:`Activity ${index+1} of ${frames.length}`}</label>
              <progress id="lesson-progress" value={index} max={frames.length}/>
            </div>
            {isAppliedFrame&&currentPath&&<p className="applied-progress">Application task {(activeApplication?.step??0)+1} of {currentPath.steps.length}: {currentPath.title}</p>}
            {complete?<section className="completion" aria-live="polite">
              <h2 ref={activityHeadingRef} tabIndex={-1}>Preview complete</h2>
              <p>You reached the end of this internal lesson fixture. No learning grade or review progress was recorded.</p>
              <div className="completion-actions">
                {nextLesson&&<button type="button" className="primary-action" onClick={()=>openCourseLesson(nextLesson)}>Next lesson: {nextLesson.lesson.title}</button>}
                <button type="button" className={nextLesson?"secondary-action":"primary-action"} onClick={restart}>Repeat lesson</button>
                <button type="button" className="secondary-action" onClick={()=>setLessonOpen(false)}>Back to Course</button>
              </div>
            </section>:frame?.type==="teaching"?<TeachingView frame={frame} languageId={selected} headingRef={activityHeadingRef}/>:frame?
              <ExerciseView frame={frame} draft={currentDraft} result={currentResult} headingRef={activityHeadingRef}
                onDraft={value=>dispatch({type:"draft",value})} onSubmit={()=>dispatch({type:"submit"})} onRetry={()=>dispatch({type:"retry"})} onReveal={()=>dispatch({type:"reveal"})} onRevise={()=>applicationWriting?reviseApplicationWriting():dispatch({type:"revise"})}/>:null}
            {applicationWriting&&currentResult?.kind==="ungraded"&&!currentReview&&
              <button type="button" className="secondary-action applied-review-launch" onClick={()=>openWritingReview()}>Review sources before finishing</button>}
            {applicationWriting&&currentPath&&currentReview&&reviewGuide&&<section className="applied-writing-review" aria-label="Source-backed writing review">
              <h3>Revise for a changed situation</h3>
              <p>{reviewGuide.changedSituation}</p>
              <p>{reviewGuide.revisionInstruction}</p>
              <div className="applied-draft-comparison">
                <div><strong>First draft</strong><blockquote lang={selected}>{currentReview.firstDraft}</blockquote></div>
                {currentReview.revised&&currentResult?.kind==="ungraded"&&
                  <div><strong>Current draft</strong><blockquote lang={selected}>{currentDraft}</blockquote></div>}
              </div>
              <fieldset>
                <legend>Check your writing against the original sources</legend>
                {reviewGuide.criteria.map((criterion,i)=><label key={criterion.sourceId+"|"+criterion.quote} className="review-criterion">
                  <input type="checkbox" checked={currentReview.checked[i]??false}
                    onChange={event=>setWritingReview(previous=>previous&&previous.pathId===currentReview.pathId&&previous.exerciseId===currentReview.exerciseId
                      ?{...previous,checked:previous.checked.map((value,n)=>n===i?event.target.checked:value)}:previous)}/>
                  <span><span>{criterion.prompt}</span><blockquote lang={selected}>{criterion.quote}</blockquote></span>
                </label>)}
              </fieldset>
              <p className="review-boundary">These are self-review checks, not verified grammar corrections or grades.</p>
              {currentResult?.kind==="ungraded"&&<div className="review-operations">
                <button type="button" className="secondary-action" onClick={reviseApplicationWriting}>Revise against sources</button>
                <button type="button" className="primary-action" disabled={!reviewedWriting} onClick={completeApplicationStep}>
                  {(activeApplication?.step??0)+1<currentPath.steps.length?"Next application task":"Finish application"}
                </button>
              </div>}
            </section>}
            {isAppliedFrame&&currentPath&&currentResult&&currentResult.kind!=="incorrect"&&!applicationWriting&&<div className="applied-next">
              <button type="button" className="secondary-action" onClick={completeApplicationStep}>{(activeApplication?.step??0)+1<currentPath.steps.length?"Next application task":"Return to Course"}</button>
            </div>}
          </div>
          {!complete&&<div className="lesson-actions" aria-label="Lesson controls">
            <button className="secondary-action" type="button" disabled={index===0} onClick={()=>dispatch({type:"previous"})}>Previous</button>
            <button className="primary-action" type="button" disabled={!canAdvance} onClick={()=>dispatch({type:"next"})}>
              {index===frames.length-1?"Finish preview":"Continue"}
            </button>
          </div>}
        </>:destination==="home"?<section className="page">
          <p className="eyebrow">YOUR LEARNING</p>
          <h1>Home</h1>
          <article className="hero-study">
            <div>
              <p className="course-kicker">{languageLabel(selected)} · {bundle.lesson.level??"Introductory"}</p>
              <h2>{bundle.lesson.title}</h2>
              <p>{bundle.lesson.objective.statement}</p>
              <button className="primary-action" type="button" onClick={startLesson}>{index>=frames.length?"Review completed preview":index?"Continue "+languageLabel(selected):"Start "+languageLabel(selected)+" lesson"}</button>
            </div>
            <div className="hero-progress" aria-label={"Activity "+Math.min(index,frames.length)+" of "+frames.length}>{index}<span>/{frames.length}</span></div>
          </article>
          <h2 className="section-title">Languages</h2>
          <div className="course-list">{LANGUAGES.map(language=><button key={language.id} className="course-entry" type="button" onClick={()=>selectLanguage(language.id)}>
            <span className="course-name">{language.label}<small>{language.nativeLabel}</small></span>
            <span className="course-state">{COURSE_BUNDLES[language.id].length} internal lessons</span>
            <span aria-hidden="true">→</span>
          </button>)}</div>
        </section>:destination==="course"?<section className="page">
          <p className="eyebrow">{languageLabel(selected)}</p>
          <h1>Course</h1>
          <div className="course-header">
            <div><p className="course-kicker">Internal lesson fixture</p><h2>{bundle.lesson.title}</h2><p>{bundle.lesson.objective.statement}</p></div>
            <button className="primary-action" type="button" onClick={startLesson}>{index>=frames.length?"View completed lesson":index?"Continue lesson":"Start lesson"}</button>
          </div>
          <div className="course-details">
            <span>{frames.length} activities</span>
            <span>Teaching · guided practice · independent writing</span>
            <span>{bundle.lesson.level??"Original beginner material"}</span>
          </div>
          <section className="course-sequence" aria-label="Available internal lessons">
            <h2 className="section-title">Lessons</h2>
            <ol>{COURSE_BUNDLES[selected].map(candidate=><li key={candidate.lesson.id}>
              <button type="button" aria-label={"Open "+candidate.lesson.title} aria-current={candidate.lesson.id===bundle.lesson.id?"true":undefined}
                onClick={()=>openCourseLesson(candidate)}>
                <span className="course-sequence-title">{candidate.lesson.title}</span>
                <span className="course-sequence-meta">{framesFor(candidate).length} activities</span>
              </button>
            </li>)}</ol>
          </section>
          <section className="application-paths" aria-label="Practical applications">
            <h2 className="section-title">Practical applications</h2>
            {APPLICATION_PATHS.filter(path=>path.languageId===selected).map(path=><article className="application-path" key={path.id}>
              <h3>{path.title}</h3>
              <p>{path.situation}</p>
              <ol>{path.steps.map((step,i)=><li key={step.exerciseId}>
                <span>{i+1}. {ALL_BUNDLES.find(b=>b.lesson.id===step.lessonId)?.exercises.find(e=>e.id===step.exerciseId)?.instruction}</span>
                <button type="button" onClick={()=>startApplication(path,i)} aria-label={"Open application task "+(i+1)+" of "+path.title}>Open task</button>
              </li>)}</ol>
              <button type="button" className="secondary-action" onClick={()=>startApplication(path)}>Start application</button>
            </article>)}
          </section>
          <section className="source-practice" aria-label="Original source practice">
            <h2 className="section-title">Practice by original source</h2>
            {(SOURCE_COVERAGE_BY_LESSON[bundle.lesson.id]??[]).map(entry=><div className="source-practice-group" key={entry.source.id}>
              <div className="source-practice-heading">
                <h3>{entry.source.originalEntityId}</h3>
                <span>{entry.independent.length} independent activities</span>
              </div>
              <p className="source-practice-status">Editorial review pending</p>
              <ul>{entry.independent.map(activity=><li key={activity.id}>
                <button type="button" onClick={()=>openSourcePractice(activity.frameIndex)}>
                  <span className="source-practice-link">Practice: {activity.instruction}</span>
                  {activity.kind==="free-production"&&<span className="source-practice-kind">Ungraded writing</span>}
                </button>
              </li>)}</ul>
            </div>)}
          </section>
          <p className="notice">This course is an internal preview. Content review and redistribution approval are pending; no grades or history are synced.</p>
        </section>:destination==="review"?<section className="page small-page">
          <h1>Review</h1>
          <h2>Scheduled reviews unavailable</h2>
          <p>This preview does not access vocabulary review queues or FSRS history. The existing French, Japanese and Chinese applications retain review authority.</p>
          <button className="secondary-action" type="button" onClick={()=>navigate("course")}>Open course</button>
        </section>:<section className="page small-page">
          <h1>Profile</h1>
          <dl className="profile-details"><div><dt>Account</dt><dd>Not connected in preview</dd></div><div><dt>Study progress</dt><dd>Demo activity positions only, stored in this browser tab</dd></div><div><dt>Cloud synchronization</dt><dd>Disabled</dd></div></dl>
          <button className="secondary-action" type="button" onClick={clearPreview}>Clear demo continuation</button>
        </section>}
      </main>
    </div>
    <nav className="mobile-nav" aria-label="Mobile primary">
      {NAV.map(item=><button key={item.id} type="button" aria-current={!lessonOpen&&destination===item.id?"page":undefined} onClick={()=>navigate(item.id)}>{item.label}</button>)}
    </nav>
  </div>;
}
