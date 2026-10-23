import type {LessonBundleV1,ExerciseV1} from "../../../packages/content-schema/src/lesson-v1.js";
import receipts from "../../../contracts/phase16-source-evidence.json" with {type:"json"};
import {framesFor} from "./lesson-model.ts";

export interface ApplicationStep {
  readonly lessonId:string;
  readonly exerciseId:string;
  readonly sourceId:string;
  readonly quote:string;
}
export interface ApplicationPath {
  readonly id:string;
  readonly languageId:string;
  readonly title:string;
  readonly situation:string;
  readonly steps:readonly ApplicationStep[];
}
/** Authored application tasks are navigation through existing, admitted original lessons.
 * They never evaluate answers, infer grades or create new historical learner evidence. */
export const APPLICATION_PATHS:readonly ApplicationPath[]=[
  {
    "id": "fr-object-reference",
    "languageId": "fr",
    "title": "Introduce and locate objects",
    "situation": "A classroom has new objects. Introduce one, identify a familiar book, and describe the objects independently.",
    "steps": [
      {
        "lessonId": "fr:a1-03:shared-pilot",
        "exerciseId": "fr-p18-article",
        "sourceId": "fr-a1-03-original",
        "quote": "C’est un livre."
      },
      {
        "lessonId": "fr:a1-03:shared-pilot",
        "exerciseId": "fr-p18-definite",
        "sourceId": "fr-a1-03-original",
        "quote": "Le livre est sur la table."
      },
      {
        "lessonId": "fr:a1-03:shared-pilot",
        "exerciseId": "fr-p18-write",
        "sourceId": "fr-a1-03-original",
        "quote": "L’école est ouverte."
      }
    ]
  },
  {
    "id": "fr-introduce-and-describe",
    "languageId": "fr",
    "title": "Introduce yourself and a room",
    "situation": "Distinguish your name and profession from statements about objects in a room.",
    "steps": [
      {
        "lessonId": "fr:a1-01-02:cross-transfer",
        "exerciseId": "fr-p17-name",
        "sourceId": "fr-a1-01-original",
        "quote": "Bonjour ! Je m’appelle Inès."
      },
      {
        "lessonId": "fr:a1-01-02:cross-transfer",
        "exerciseId": "fr-p17-etre",
        "sourceId": "fr-a1-02-original",
        "quote": "Je suis professeur."
      },
      {
        "lessonId": "fr:a1-03:shared-pilot",
        "exerciseId": "fr-p18-write",
        "sourceId": "fr-a1-03-original",
        "quote": "Le livre est sur la table."
      }
    ]
  },
  {
    "id": "ja-first-meeting",
    "languageId": "ja",
    "title": "Introduce yourself to someone new",
    "situation": "Decide whether it is a first meeting, recall the opener, then draft an appropriate introduction.",
    "steps": [
      {
        "lessonId": "ja:cf-a1-01-03:shared-pilot",
        "exerciseId": "ja-p18-familiar",
        "sourceId": "ja-cf-a1-01-03-original",
        "quote": "はじめまして。"
      },
      {
        "lessonId": "ja:cf-a1-01-03:shared-pilot",
        "exerciseId": "ja-p18-recall",
        "sourceId": "ja-cf-a1-01-03-original",
        "quote": "はじめまして。"
      },
      {
        "lessonId": "ja:cf-a1-01-03:shared-pilot",
        "exerciseId": "ja-p18-write",
        "sourceId": "ja-cf-a1-01-03-original",
        "quote": "よろしくお願いします。"
      }
    ]
  },
  {
    "id": "ja-first-contact-help",
    "languageId": "ja",
    "title": "A meeting followed by assistance",
    "situation": "Distinguish thanks for help from goodwill in a new introduction; compose a separate assistance exchange.",
    "steps": [
      {
        "lessonId": "ja:cf-a1-01-01-02:cross-transfer",
        "exerciseId": "ja-p17-thank",
        "sourceId": "ja-cf-a1-01-02-original",
        "quote": "ありがとうございます。"
      },
      {
        "lessonId": "ja:cf-a1-01-03:shared-pilot",
        "exerciseId": "ja-p18-goodwill",
        "sourceId": "ja-cf-a1-01-03-original",
        "quote": "よろしくお願いします。"
      },
      {
        "lessonId": "ja:cf-a1-01-01-02:cross-transfer",
        "exerciseId": "ja-p17-compose",
        "sourceId": "ja-cf-a1-01-02-original",
        "quote": "すみません。"
      }
    ]
  },
  {
    "id": "zh-speaker-identity",
    "languageId": "zh",
    "title": "Who is speaking and who is described?",
    "situation": "Identify the speaker, reconstruct the teacher identity sentence, then write your own contrasting identity statements.",
    "steps": [
      {
        "lessonId": "zh:ni-hao-wo:cross-transfer",
        "exerciseId": "zh-p17-speaker",
        "sourceId": "zh-wo-demo",
        "quote": "我"
      },
      {
        "lessonId": "zh:shi:shared-pilot",
        "exerciseId": "zh-p18-link",
        "sourceId": "zh-shi-demo",
        "quote": "他是老师。"
      },
      {
        "lessonId": "zh:shi:shared-pilot",
        "exerciseId": "zh-p18-write",
        "sourceId": "zh-shi-demo",
        "quote": "他是老师。"
      }
    ]
  },
  {
    "id": "zh-negative-or-also",
    "languageId": "zh",
    "title": "Negation or addition?",
    "situation": "Distinguish additive 也是 from negative 不是, recall the source copula, and explain the change in an identity statement.",
    "steps": [
      {
        "lessonId": "zh:shi:shared-pilot",
        "exerciseId": "zh-p18-also",
        "sourceId": "zh-shi-demo",
        "quote": "也是"
      },
      {
        "lessonId": "zh:shi:shared-pilot",
        "exerciseId": "zh-p18-pinyin",
        "sourceId": "zh-shi-demo",
        "quote": "是"
      },
      {
        "lessonId": "zh:shi:shared-pilot",
        "exerciseId": "zh-p18-write",
        "sourceId": "zh-shi-demo",
        "quote": "不是"
      }
    ]
  }
] as const;

export function resolveApplicationStep(bundles:readonly LessonBundleV1[],step:ApplicationStep):
  {bundle:LessonBundleV1;frameIndex:number;exercise:ExerciseV1}|undefined {
  const bundle=bundles.find(b=>b.lesson.id===step.lessonId);
  if(!bundle)return undefined;
  const frameIndex=framesFor(bundle).findIndex(f=>f.exercise?.id===step.exerciseId);
  const exercise=framesFor(bundle)[frameIndex]?.exercise;
  if(!exercise||exercise.purpose!=="independent"||!exercise.sourceIds.includes(step.sourceId))return undefined;
  return {bundle,frameIndex,exercise};
}
export interface ApplicationIssue {readonly pathId:string;readonly exerciseId:string;readonly problem:string}
/** Static editorial check on every original source and activity reference, NOT a release permission. */
export function auditApplicationPaths(bundles:readonly LessonBundleV1[]):readonly ApplicationIssue[] {
  const issues:ApplicationIssue[]=[];
  const append=(p:ApplicationPath,step:ApplicationStep,problem:string)=>
    issues.push({pathId:p.id,exerciseId:step.exerciseId,problem});
  const seen=new Set<string>();
  for(const path of APPLICATION_PATHS){
    if(seen.has(path.id)||path.steps.length<2||!path.title.trim()||!path.situation.trim())
      append(path,path.steps[0]??{exerciseId:"",lessonId:"",sourceId:"",quote:""},"invalid-path");
    seen.add(path.id);
    let foundWriting=false;
    for(const step of path.steps){
      const resolved=resolveApplicationStep(bundles,step);
      if(!resolved){append(path,step,"missing-independent-exercise");continue;}
      const {bundle,exercise}=resolved;
      if(bundle.lesson.languageId!==path.languageId)append(path,step,"language-mismatch");
      if(bundle.lesson.publication!=="internal-fixture")append(path,step,"not-internal");
      const source=bundle.lesson.sources.find(s=>s.id===step.sourceId);
      if(!source||source.editorialReview!=="pending"||source.redistributionVerified)
        append(path,step,"source-rights-drift");
      const encountered=bundle.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples:[]);
      if(!encountered.some(e=>e.targetText===step.quote)||
          !(receipts.originalSourceQuotes as Record<string,string[]>)[step.sourceId]?.includes(step.quote))
        append(path,step,"unverified-original-quote");
      if(exercise.kind==="free-production")foundWriting=true;
    }
    if(!foundWriting)append(path,path.steps[path.steps.length-1]!,"missing-independent-writing");
  }
  return issues;
}
