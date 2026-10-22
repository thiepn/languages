import type {ExerciseV1,LessonBundleV1,LessonSourceV1} from "../../../packages/content-schema/src/lesson-v1.js";
import {validateLessonBundleV1} from "../../../packages/content-schema/src/lesson-v1.ts";
import {framesFor} from "./lesson-model.ts";

export interface SourcePracticeLink {
  readonly id:string;
  readonly frameIndex:number;
  readonly instruction:string;
  readonly kind:ExerciseV1["kind"];
  readonly purpose:"guided"|"independent";
}
export interface SourceCoverage {
  readonly source:LessonSourceV1;
  readonly guided:readonly SourcePracticeLink[];
  readonly independent:readonly SourcePracticeLink[];
  readonly ungradedIndependent:number;
}
/** Authored source links only. No learner response, completion or proficiency data. */
export function sourceCoverage(bundle:LessonBundleV1):readonly SourceCoverage[] {
  if(validateLessonBundleV1(bundle).length)throw new Error("Invalid original lesson bundle");
  const frames=framesFor(bundle);
  return bundle.lesson.sources.map(source=>{
    const referenced=frames.flatMap((frame,frameIndex)=>{
      const exercise=frame.exercise;
      return exercise?.sourceIds.includes(source.id)?[{
        id:exercise.id,frameIndex,instruction:exercise.instruction,
        kind:exercise.kind,purpose:exercise.purpose
      } satisfies SourcePracticeLink]:[];
    });
    const guided=referenced.filter(item=>item.purpose==="guided");
    const independent=referenced.filter(item=>item.purpose==="independent");
    return {source,guided,independent,
      ungradedIndependent:independent.filter(item=>item.kind==="free-production").length};
  });
}

/** Explicit original pilot and next-lesson preview allowances, never publication approval. */
const PINNED_INTERNAL_PILOTS:Readonly<Record<string,{language:string;sources:readonly string[]}>>={
  "fr:a1-01:shared-pilot":{language:"fr",sources:["fr-a1-01-original@3fb5c720cfeceaf682ce53c897701b489b7eaf6f"]},
  "fr:a1-02:shared-pilot":{language:"fr",sources:["fr-a1-02-original@3fb5c720cfeceaf682ce53c897701b489b7eaf6f"]},
  "ja:cf-a1-01-01:shared-pilot":{language:"ja",sources:["ja-cf-a1-01-01-original@1e3667ebdcb0cd50491c126b948c11f47414decb"]},
  "ja:cf-a1-01-02:shared-pilot":{language:"ja",sources:["ja-cf-a1-01-02-original@1e3667ebdcb0cd50491c126b948c11f47414decb"]},
  "zh:wo:shared-pilot":{language:"zh",sources:["zh-wo-demo@9688e7354142b7127fd5f6eb69b03b595a437008"]},
  "zh:ni-hao:shared-pilot":{language:"zh",sources:[
    "zh-hao-demo@9688e7354142b7127fd5f6eb69b03b595a437008",
    "zh-ni-demo@9688e7354142b7127fd5f6eb69b03b595a437008"
  ]}
};
const PINNED_LOCATIONS:Readonly<Record<string,string>>={
  "fr-a1-01-original":"thiepn/french|app/src/core/unified/u6-a1-01-04.ts|a1-01",
  "fr-a1-02-original":"thiepn/french|app/src/core/unified/u6-a1-01-04.ts|a1-02",
  "ja-cf-a1-01-01-original":"thiepn/japanese|apps/web/src/study/courseFirstA1.ts|cf-a1-01-01",
  "ja-cf-a1-01-02-original":"thiepn/japanese|apps/web/src/study/courseFirstA1.ts|cf-a1-01-02",
  "zh-ni-demo":"thiepn/chinese|src/demo-lessons.mjs|你",
  "zh-wo-demo":"thiepn/chinese|src/demo-lessons.mjs|我",
  "zh-hao-demo":"thiepn/chinese|src/demo-lessons.mjs|好"
};
const PINNED_RIGHTS:Readonly<Record<string,LessonSourceV1["rights"]>>={
  "fr-a1-01-original":"original-owned",
  "fr-a1-02-original":"original-owned",
  "ja-cf-a1-01-01-original":"original-owned",
  "ja-cf-a1-01-02-original":"original-owned",
  "zh-ni-demo":"review-required",
  "zh-wo-demo":"review-required",
  "zh-hao-demo":"review-required"
};
/** Fail closed before additional originals enter this internal-only learner preview. */
export function admitInternalPilot(bundle:LessonBundleV1):readonly SourceCoverage[] {
  const expected=PINNED_INTERNAL_PILOTS[bundle.lesson.id];
  if(!expected||bundle.lesson.languageId!==expected.language||
    bundle.lesson.publication!=="internal-fixture"||
    bundle.lesson.sources.some(s=>s.editorialReview!=="pending"||s.redistributionVerified||
      ([s.repository,s.path,s.originalEntityId].join("|")!==PINNED_LOCATIONS[s.id]||s.rights!==PINNED_RIGHTS[s.id]))||
    JSON.stringify(bundle.lesson.sources.map(s=>s.id+"@"+s.revision).sort())!==
      JSON.stringify([...expected.sources].sort())) {
    throw new Error("Unreviewed source identity or publication change requires separate admission");
  }
  const coverage=sourceCoverage(bundle);
  if(coverage.some(item=>!item.independent.length))
    throw new Error("Original source lacks independent source-linked coverage");
  return coverage;
}
export interface EditorialPreflight {
  readonly readyForSeparateReview:boolean;
  readonly blockers:readonly string[];
}
/** Metadata preflight, never a release grant, human approval or automatic publisher. */
export function editorialPreflight(bundle:LessonBundleV1):EditorialPreflight {
  const blockers:string[]=[];
  if(validateLessonBundleV1(bundle).length)blockers.push("Invalid lesson or provenance contract");
  else {
    for(const entry of sourceCoverage(bundle)){
      if(!entry.guided.length||!entry.independent.length)
        blockers.push(entry.source.id+": missing guided or independent source-linked practice");
      if(entry.source.rights!=="original-owned"||!entry.source.redistributionVerified)
        blockers.push(entry.source.id+": redistribution rights not verified");
      if(entry.source.editorialReview!=="approved")
        blockers.push(entry.source.id+": editorial review not approved");
    }
  }
  if(bundle.lesson.publication==="internal-fixture")blockers.push("Internal fixture is not a publication candidate");
  return {readyForSeparateReview:blockers.length===0,blockers};
}
