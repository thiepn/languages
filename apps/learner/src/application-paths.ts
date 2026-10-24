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

export interface ApplicationReviewCriterion {
 readonly prompt:string;
 readonly sourceId:string;
 readonly quote:string;
}
export interface ApplicationReviewGuide {
 /** New application contexts are authored transfer tasks, not original quotations. */
 readonly changedSituation:string;
 readonly revisionInstruction:string;
 readonly criteria:readonly ApplicationReviewCriterion[];
}
/** Author-edited source-backed self-review prompts. Never generated grading. */
export const APPLICATION_REVIEWS:Readonly<Record<string,ApplicationReviewGuide>>={
"fr-object-reference":{changedSituation:"The listener now knows which book and pens you introduced.",revisionInstruction:"Rewrite to distinguish first mention (un, une, des) from definite reference (le, la, les). Explain gender and number.",criteria:[{"prompt":"Check that a newly introduced object uses an indefinite article.","sourceId":"fr-a1-03-original","quote":"C’est un livre."},{"prompt":"Check that plural objects are introduced with des.","sourceId":"fr-a1-03-original","quote":"Voici des stylos."},{"prompt":"Check that a known book uses the definite article in its location.","sourceId":"fr-a1-03-original","quote":"Le livre est sur la table."}]},
"fr-introduce-and-describe":{changedSituation:"A new classmate asks your name, then occupation, then which book you mean.",revisionInstruction:"Revise the exchange to distinguish je m’appelle, je suis and reference to a known object.",criteria:[{"prompt":"Check that your name uses the je m’appelle model.","sourceId":"fr-a1-01-original","quote":"Je m’appelle Inès."},{"prompt":"Check that your profession uses je suis rather than an object introduction.","sourceId":"fr-a1-02-original","quote":"Je suis professeur."},{"prompt":"Check that a known book takes the correct article in the location sentence.","sourceId":"fr-a1-03-original","quote":"Le livre est sur la table."}]},
"ja-first-meeting":{changedSituation:"Meet a neighbor for the first time today, then encounter the same person again tomorrow.",revisionInstruction:"Revise the first introduction, then explain why はじめまして does not belong in tomorrow's familiar meeting.",criteria:[{"prompt":"Check that はじめまして marks a genuine first meeting.","sourceId":"ja-cf-a1-01-03-original","quote":"はじめまして。"},{"prompt":"Check that your name follows the noun + です model.","sourceId":"ja-cf-a1-01-03-original","quote":"ミナです。"},{"prompt":"Check that goodwill is expressed separately from the name.","sourceId":"ja-cf-a1-01-03-original","quote":"よろしくお願いします。"}]},
"ja-first-contact-help":{changedSituation:"Introduce yourself to someone new; later another person helps after you ask for assistance.",revisionInstruction:"Separate introductory goodwill from an attention request and gratitude after help. Revise both exchanges.",criteria:[{"prompt":"Check that an attention request is not mistaken for a first-meeting greeting.","sourceId":"ja-cf-a1-01-02-original","quote":"すみません。"},{"prompt":"Check that gratitude follows assistance rather than replacing goodwill.","sourceId":"ja-cf-a1-01-02-original","quote":"ありがとうございます。"},{"prompt":"Check that introductory goodwill has a different purpose from thanks.","sourceId":"ja-cf-a1-01-03-original","quote":"よろしくお願いします。"}]},
"zh-speaker-identity":{changedSituation:"First describe yourself as a student, then identify another person as a teacher.",revisionInstruction:"Write distinct source-supported noun identity sentences for 我 and 他 and explain the referent of each subject.",criteria:[{"prompt":"Check that 我 identifies the speaker.","sourceId":"zh-wo-demo","quote":"我"},{"prompt":"Check that the student identity is in the first person.","sourceId":"zh-wo-demo","quote":"我是学生。"},{"prompt":"Check that the teacher statement describes another person.","sourceId":"zh-shi-demo","quote":"他是老师。"}]},
"zh-negative-or-also":{changedSituation:"One claim about a teacher must be corrected; in a separate conversation someone shares the same identity.",revisionInstruction:"Revise to contrast 不是 with 也是; explain why 'also' needs an established comparison.",criteria:[{"prompt":"Check that 不是 negates identity rather than adding 'also'.","sourceId":"zh-shi-demo","quote":"不是"},{"prompt":"Check that 也是 adds 'also' rather than negating.","sourceId":"zh-shi-demo","quote":"也是"},{"prompt":"Check that 是 links a subject with a noun identity in the source sentence.","sourceId":"zh-shi-demo","quote":"他是老师。"}]}
};

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
    const review=APPLICATION_REVIEWS[path.id];
    if(!review||!review.changedSituation.trim()||!review.revisionInstruction.trim()||
      review.changedSituation===path.situation||review.criteria.length!==3||
      new Set(review.criteria.map(c=>c.sourceId+"|"+c.quote)).size!==3)
      append(path,path.steps[path.steps.length-1]!,"invalid-review-guide");
    else for(const criterion of review.criteria){
      const original=path.steps.some(s=>s.sourceId===criterion.sourceId)&&bundles.some(bundle=>
        bundle.lesson.sources.some(source=>source.id===criterion.sourceId&&
          source.editorialReview==="pending"&&!source.redistributionVerified)&&
        bundle.lesson.steps.some(s=>s.type==="encounter"&&s.examples.some(example=>example.targetText===criterion.quote)));
      if(!criterion.prompt.trim()||!original||
        !(receipts.originalSourceQuotes as Record<string,string[]>)[criterion.sourceId]?.includes(criterion.quote))
        append(path,path.steps[path.steps.length-1]!,"unverified-review-criterion");
    }
  }
  return issues;
}
