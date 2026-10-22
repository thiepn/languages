import {useEffect,useMemo,useRef,useState} from "react";
import type {AnswerResult, LearningFrame} from "./lesson-model";
import {
  checkpointId, DEMO_CHECKPOINT_KEY, evaluateExercise, revealExercise, canContinueAfterAnswer,
  framesFor, parseDemoCheckpoint, serializeDemoCheckpoint
} from "./lesson-model";
import {DEMO_BUNDLES,LANGUAGES,languageLabel,type LanguageChoice} from "./catalog";

type Destination = "home" | "course" | "review" | "profile";
const NAV: readonly {id:Destination;label:string}[] = [
  {id:"home",label:"Home"},{id:"course",label:"Course"},
  {id:"review",label:"Review"},{id:"profile",label:"Profile"}
];
const ALL_BUNDLES=Object.values(DEMO_BUNDLES);

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
function ExerciseView({
  frame,draft,result,onDraft,onSubmit,onRetry,onReveal
}:{
  frame:LearningFrame;
  draft:string;
  result:AnswerResult|undefined;
  onDraft:(value:string)=>void;
  onSubmit:()=>void;
  onRetry:()=>void;
  onReveal:()=>void;
}){
  const exercise=frame.exercise;
  if(!exercise)return null;
  return <form className="activity" aria-label={stageName(frame)} onSubmit={event=>{event.preventDefault();onSubmit();}}>
    <p className="phase">{stageName(frame)}</p>
    <h2>{exercise.instruction}</h2>
    {exercise.kind==="choice"?
      <fieldset className="choice-list" disabled={result!==undefined}>
        <legend className="sr-only">{exercise.instruction}</legend>
        {exercise.options.map((option,i)=><label key={option} className={"choice"+(draft===option?" selected":"")}>
          <input type="radio" name={"answer-"+exercise.id} value={option} checked={draft===option} onChange={()=>onDraft(option)}/>
          <span className="choice-num" aria-hidden="true">{String(i+1).padStart(2,"0")}</span>
          <span>{option}</span>
        </label>)}
      </fieldset>:
      <label className="answer-field">
        <span>{exercise.kind==="typed"?"Your answer":"Your response"}</span>
        {exercise.kind==="typed"?
          <input value={draft} onChange={event=>onDraft(event.target.value)}
            disabled={result!==undefined} autoComplete="off" spellCheck={false} lang={exercise.languageId} />:
          <textarea value={draft} onChange={event=>onDraft(event.target.value)}
            disabled={result!==undefined} rows={4} lang={exercise.languageId}/>}
      </label>}
    {result!==undefined?<div className={"feedback "+result.kind} role="status" aria-live="polite">
      <strong>{result.kind==="correct"?"Answer accepted":result.kind==="incorrect"?"Not quite — try again":result.kind==="revealed"?"Answer revealed — not credited":"Ungraded practice"}</strong>
      <p>{result.explanation}</p>
      {result.kind==="revealed" && <p>Expected: <span lang={exercise.languageId}>{result.expected.join(" / ")}</span></p>}
      {result.kind==="ungraded" && <ul>{result.rubric.map(item=><li key={item}>{item}</li>)}</ul>}
    </div>:<p className="scoring-note">
      {exercise.kind==="free-production"?"This response is not automatically graded.":"Practice feedback only — no review grade is recorded."}
    </p>}
    {result?.kind==="incorrect"&&<div className="retry-actions"><button className="secondary-action" type="button" onClick={onRetry}>Try again</button><button className="text-button" type="button" onClick={onReveal}>Show answer</button></div>}
    {result===undefined&&<button className="check-button" type="submit" disabled={!draft.trim()}>Check answer</button>}
  </form>;
}

function TeachingView({frame,languageId}:{frame:LearningFrame;languageId:string}){
  const step=frame.step;
  if(!step)return null;
  return <section className="activity">
    <p className="phase">{stageName(frame)}</p>
    {step.type==="encounter"?<>
      <h2>Read these expressions</h2>
      <div className="example-list">{step.examples.map((example,i)=><article className="example" key={i}>
        <p className="target" lang={languageId}>{example.targetText}</p>
        {example.reading&&<p className="reading" lang="zh-Latn-pinyin">{example.reading}</p>}
        <p className="translation">{example.meaning}</p>
      </article>)}</div>
    </>:step.type==="explain"?<>
      <h2>{step.heading??"Understand the pattern"}</h2>
      <p className="explanation">{step.explanation}</p>
    </>:step.type==="reflect"?<>
      <h2>{step.heading??"Reflection"}</h2>
      <p className="explanation">{step.feedback}</p>
    </>:null}
  </section>;
}

export function App(){
  const [selected,setSelected]=useState<LanguageChoice>(readSelected);
  const [destination,setDestination]=useState<Destination>("home");
  const [lessonOpen,setLessonOpen]=useState(false);
  const [positions,setPositions]=useState<Record<string,number>>(readPositions);
  const [drafts,setDrafts]=useState<Record<string,string>>({});
  const [results,setResults]=useState<Record<string,AnswerResult>>({});
  const titleRef=useRef<HTMLHeadingElement>(null);
  const bundle=DEMO_BUNDLES[selected];
  const frames=useMemo(()=>framesFor(bundle),[bundle]);
  const key=checkpointId(bundle);
  const index=positions[key]??0;
  const complete=index===frames.length;
  const frame=frames[index];
  const answerKey=frame?key+":"+frame.id:"";
  const currentResult=results[answerKey];
  const currentDraft=drafts[answerKey]??"";
  const canAdvance=!!frame&&(frame.type==="teaching"||canContinueAfterAnswer(currentResult));

  useEffect(()=>{
    try{window.sessionStorage.setItem(DEMO_LANGUAGE_KEY,selected);}catch{/* Optional tab-only language choice. */}
  },[selected]);
  useEffect(()=>{
    try{window.sessionStorage.setItem(DEMO_CHECKPOINT_KEY,serializeDemoCheckpoint(positions,ALL_BUNDLES));}
    catch{/* The preview still works in memory if browser tab storage is unavailable. */}
  },[positions]);
  useEffect(()=>{
    if(lessonOpen)titleRef.current?.focus();
  },[lessonOpen,index,selected]);

  function selectLanguage(id:LanguageChoice){
    setSelected(id);
    setLessonOpen(false);
    setDestination("course");
  }
  function navigate(id:Destination){
    setLessonOpen(false);
    setDestination(id);
  }
  function startLesson(){
    setDestination("course");
    setLessonOpen(true);
  }
  function move(next:number){
    setPositions(old=>({...old,[key]:Math.max(0,Math.min(frames.length,next))}));
  }
  function restart(){
    setPositions(old=>({...old,[key]:0}));
    setDrafts(old=>Object.fromEntries(Object.entries(old).filter(([id])=>!id.startsWith(key+":"))));
    setResults(old=>Object.fromEntries(Object.entries(old).filter(([id])=>!id.startsWith(key+":"))));
    startLesson();
  }
  function submit(){
    if(!frame?.exercise||!currentDraft.trim()||currentResult!==undefined)return;
    setResults(old=>({...old,[answerKey]:evaluateExercise(frame.exercise!,currentDraft)}));
  }
  function retry(){
    setResults(old=>{const next={...old};delete next[answerKey];return next;});
    setDrafts(old=>{const next={...old};delete next[answerKey];return next;});
  }
  function reveal(){
    if(!frame?.exercise||currentResult?.kind!=="incorrect")return;
    setResults(old=>({...old,[answerKey]:revealExercise(frame.exercise!)}));
  }
  function clearPreview(){
    setPositions({});
    setDrafts({});
    setResults({});
    setLessonOpen(false);
    setSelected("fr");
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
              <label className="progress-label" htmlFor="lesson-progress">Lesson preview: {complete?frames.length:Math.min(index+1,frames.length)} / {frames.length} activities</label>
              <progress id="lesson-progress" value={index} max={frames.length}/>
            </div>
            {complete?<section className="completion" aria-live="polite">
              <h2>Preview complete</h2>
              <p>You reached the end of this internal lesson fixture. No learning grade or review progress was recorded.</p>
              <div className="completion-actions">
                <button type="button" className="primary-action" onClick={restart}>Repeat lesson</button>
                <button type="button" className="secondary-action" onClick={()=>setLessonOpen(false)}>Back to Course</button>
              </div>
            </section>:frame?.type==="teaching"?<TeachingView frame={frame} languageId={selected}/>:frame?
              <ExerciseView frame={frame} draft={currentDraft} result={currentResult}
                onDraft={value=>setDrafts(old=>({...old,[answerKey]:value}))} onSubmit={submit} onRetry={retry} onReveal={reveal}/>:null}
          </div>
          {!complete&&<div className="lesson-actions" aria-label="Lesson controls">
            <button className="secondary-action" type="button" disabled={index===0} onClick={()=>move(index-1)}>Previous</button>
            <button className="primary-action" type="button" disabled={!canAdvance} onClick={()=>move(index+1)}>
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
            <span className="course-state">1 demo lesson</span>
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
