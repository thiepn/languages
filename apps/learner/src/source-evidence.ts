import evidence from "../../../contracts/phase16-source-evidence.json" with {type:"json"};
import type {LessonBundleV1} from "../../../packages/content-schema/src/lesson-v1.js";

export interface SourceEvidenceIssue {
 readonly code:"missing-receipt"|"extra-receipt"|"wrong-source"|"unverified-quote"|"missing-encounter";
 readonly exerciseId:string;
 readonly sourceId:string;
}
/** Manually pinned original-source excerpts; not rights, approval or live upstream verification. */
export function auditSourceEvidence(bundle:LessonBundleV1):readonly SourceEvidenceIssue[]{
 const issues:SourceEvidenceIssue[]=[];
 const put=(code:SourceEvidenceIssue["code"],exerciseId:string,sourceId:string)=>
   issues.push({code,exerciseId,sourceId});
 const receipts=evidence.exerciseReceipts as Record<string,Record<string,string|Record<string,string>>>;
 const whitelist=evidence.originalSourceQuotes as Record<string,readonly string[]>;
 const byExercise=receipts[bundle.lesson.id];
 if(!byExercise){put("missing-receipt",bundle.lesson.id,"");return issues;}
 const encountered=new Set(bundle.lesson.steps.flatMap(s=>s.type==="encounter"?s.examples.map(e=>e.targetText):[]));
 for(const ex of bundle.exercises){
  const record=byExercise[ex.id];
  if(!record){put("missing-receipt",ex.id,"");continue;}
  const anchored:Record<string,string>=typeof record==="string"?
    Object.fromEntries(ex.sourceIds.map(id=>[id,record])):record;
  for(const id of ex.sourceIds){
   const quote=anchored[id];
   if(!quote){put("wrong-source",ex.id,id);continue;}
   if(!whitelist[id]?.includes(quote))put("unverified-quote",ex.id,id);
   if(!encountered.has(quote))put("missing-encounter",ex.id,id);
  }
  for(const id of Object.keys(anchored))
    if(!ex.sourceIds.includes(id)||!bundle.lesson.sourceIds.includes(id))put("wrong-source",ex.id,id);
 }
 for(const id of Object.keys(byExercise))
  if(!bundle.exercises.some(ex=>ex.id===id))put("extra-receipt",id,"");
 return issues;
}
