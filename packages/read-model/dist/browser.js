;(function(global){
"use strict";
const VERSION="0.8.0",MODEL="p8-read-model-v1",PLANE="p8-hub-data-plane-v1";
const forbidden=new Set(["studyEvents","memoryTraces","rawEvents","rawStudyEvents","answers","responses","recordings","rawContent","privateDocuments","privateVocabulary","privateSentences","accountId","userId"]);
const enroll=new Set(["active","paused","completed","inactive"]);
const claims=new Set(["internal","external","none"]);
const kinds=new Set(["study","review","learn","practice","course","assessment","immerse","maintain","none"]);
function str(v,n){const s=String(v??"").trim();if(!s)throw new Error("MISSING_"+n);return s}
function opt(v){const s=String(v??"").trim();return s||undefined}
function num(v,d=0){const n=Number(v);return Number.isFinite(n)?n:d}
function nn(v){return Math.max(0,num(v,0))}
function iso(v,n){const d=new Date(v);if(!Number.isFinite(d.getTime()))throw new Error("INVALID_"+n);return d.toISOString()}
function validIso(v){return typeof v==="string"&&v&&Number.isFinite(new Date(v).getTime())}
function clamp(v){return Math.max(0,Math.min(1,num(v,0)))}
function freeze(v){if(!v||typeof v!=="object"||Object.isFrozen(v))return v;Object.freeze(v);for(const x of Object.values(v))freeze(x);return v}
function reject(v,issues,path){if(!v||typeof v!=="object")return;for(const [k,x] of Object.entries(v)){const p=path?path+"."+k:k;if(forbidden.has(k))issues.push("forbidden raw/private field: "+p);if(x&&typeof x==="object")reject(x,issues,p)}}
function validate(value){
 const issues=[];
 if(!value||typeof value!=="object")return {ok:false,issues:["read model must be an object"]};
 if(value.schema!=="thiepn-language-read-model")issues.push("unexpected schema");
 if(value.schemaVersion!==1)issues.push("unsupported schema version");
 if(value.readModelVersion!==MODEL)issues.push("unexpected read model version");
 if(!validIso(value.generatedAt))issues.push("generatedAt must be ISO timestamp");
 for(const k of ["appId","languageId","producerRevision"])if(!String(value[k]??"").trim())issues.push(k+" is required");
 if(!enroll.has(value.enrollment?.status))issues.push("invalid enrollment status");
 for(const [k,v] of Object.entries(value.workload||{}))if(["dueItems","newItems","practiceItems","courseItems","totalItems","estimatedMinutes"].includes(k)&&(!Number.isFinite(Number(v))||Number(v)<0))issues.push("workload."+k+" must be non-negative");
 for(const [k,v] of Object.entries(value.activity||{}))if(["todayEvents","sevenDayEvents","streakDays"].includes(k)&&(!Number.isFinite(Number(v))||Number(v)<0))issues.push("activity."+k+" must be non-negative");
 if(value.activity?.lastStudiedAt!=null&&!validIso(value.activity.lastStudiedAt))issues.push("activity.lastStudiedAt must be ISO timestamp or null");
 if(!claims.has(value.proficiency?.claim??"none"))issues.push("invalid proficiency claim");
 for(const d of value.proficiency?.dimensions||[]){if(!String(d?.id??"").trim())issues.push("proficiency dimension id required");if(d?.score!=null&&(Number(d.score)<0||Number(d.score)>1))issues.push("proficiency dimension score out of range");if(d?.confidence!=null&&(Number(d.confidence)<0||Number(d.confidence)>1))issues.push("proficiency dimension confidence out of range")}
 if(!kinds.has(value.nextAction?.kind??"none"))issues.push("invalid next action kind");
 if(!Number.isFinite(value.nextAction?.priority)||value.nextAction.priority<0||value.nextAction.priority>100)issues.push("nextAction.priority must be 0..100");
 reject(value,issues,"");return {ok:issues.length===0,issues};
}
function create(input){
 const status=String(input?.enrollment?.status??"active");if(!enroll.has(status))throw new Error("INVALID_ENROLLMENT_STATUS");
 const due=nn(input?.workload?.dueItems),nw=nn(input?.workload?.newItems),practice=nn(input?.workload?.practiceItems),course=nn(input?.workload?.courseItems);
 const claim=String(input?.proficiency?.claim??"none");if(!claims.has(claim))throw new Error("INVALID_PROFICIENCY_CLAIM");
 const kind=String(input?.nextAction?.kind??"none");if(!kinds.has(kind))throw new Error("INVALID_NEXT_ACTION_KIND");
 const m={
 schema:"thiepn-language-read-model",schemaVersion:1,readModelVersion:MODEL,packageVersion:VERSION,
 generatedAt:iso(input?.generatedAt??new Date().toISOString(),"GENERATED_AT"),
 appId:str(input?.appId,"APP_ID"),languageId:str(input?.languageId,"LANGUAGE_ID"),producerRevision:str(input?.producerRevision,"PRODUCER_REVISION"),
 presentation:{displayName:str(input?.presentation?.displayName??input?.languageId,"DISPLAY_NAME"),...(opt(input?.presentation?.nativeName)?{nativeName:opt(input.presentation.nativeName)}:{}),...(opt(input?.presentation?.appRoute)?{appRoute:opt(input.presentation.appRoute)}:{})},
 enrollment:{status,...(opt(input?.enrollment?.startedAt)?{startedAt:iso(input.enrollment.startedAt,"STARTED_AT")}:{}) ,...(opt(input?.enrollment?.targetBand)?{targetBand:opt(input.enrollment.targetBand)}:{})},
 workload:{dueItems:due,newItems:nw,practiceItems:practice,courseItems:course,totalItems:input?.workload?.totalItems==null?due+nw+practice+course:nn(input.workload.totalItems),...(input?.workload?.estimatedMinutes!=null?{estimatedMinutes:nn(input.workload.estimatedMinutes)}:{})},
 activity:{todayEvents:nn(input?.activity?.todayEvents),sevenDayEvents:nn(input?.activity?.sevenDayEvents),streakDays:nn(input?.activity?.streakDays),lastStudiedAt:input?.activity?.lastStudiedAt?iso(input.activity.lastStudiedAt,"LAST_STUDIED_AT"):null},
 progress:{metrics:Array.isArray(input?.progress?.metrics)?input.progress.metrics.map(x=>({id:str(x?.id,"PROGRESS_ID"),label:str(x?.label??x?.id,"PROGRESS_LABEL"),current:num(x?.current,0),...(x?.total!=null?{total:num(x.total,0)}:{}),...(opt(x?.unit)?{unit:opt(x.unit)}:{})})):[]},
 proficiency:{framework:str(input?.proficiency?.framework??"unspecified","FRAMEWORK"),claim,...(opt(input?.proficiency?.currentBand)?{currentBand:opt(input.proficiency.currentBand)}:{}),...(opt(input?.proficiency?.frontierBand)?{frontierBand:opt(input.proficiency.frontierBand)}:{}),maintenanceNeeded:input?.proficiency?.maintenanceNeeded===true,dimensions:Array.isArray(input?.proficiency?.dimensions)?input.proficiency.dimensions.map(d=>({id:str(d?.id,"DIMENSION_ID"),label:str(d?.label??d?.id,"DIMENSION_LABEL"),...(d?.score!=null?{score:clamp(d.score)}:{}),...(d?.confidence!=null?{confidence:clamp(d.confidence)}:{}),...(opt(d?.band)?{band:opt(d.band)}:{}),...(d?.evidenceCount!=null?{evidenceCount:nn(d.evidenceCount)}:{})})):[]},
 nextAction:{id:str(input?.nextAction?.id??"none","ACTION_ID"),label:str(input?.nextAction?.label??"No action","ACTION_LABEL"),kind,priority:Math.max(0,Math.min(100,num(input?.nextAction?.priority,0))),...(opt(input?.nextAction?.reason)?{reason:opt(input.nextAction.reason)}:{}),...(opt(input?.nextAction?.route)?{route:opt(input.nextAction.route)}:{})},
 source:{authority:"consumer",...(opt(input?.source?.stateRevision)?{stateRevision:opt(input.source.stateRevision)}:{}),...(opt(input?.source?.contentVersion)?{contentVersion:opt(input.source.contentVersion)}:{})}
 };
 const v=validate(m);if(!v.ok)throw new Error("INVALID_LANGUAGE_READ_MODEL:"+v.issues.join("|"));return freeze(m)
}
function plane(models,options={}){
 const now=new Date(options.now??Date.now());if(!Number.isFinite(now.getTime()))throw new Error("INVALID_HUB_NOW");const maxAgeMs=num(options.maxAgeMs,21600000);
 const accepted=[],rejected=[];for(const candidate of Array.isArray(models)?models:[]){const v=validate(candidate);if(!v.ok){rejected.push({appId:String(candidate?.appId??"unknown"),languageId:String(candidate?.languageId??"unknown"),issues:v.issues});continue}const ageMs=Math.max(0,now.getTime()-new Date(candidate.generatedAt).getTime());accepted.push({...candidate,hubFreshness:ageMs<=maxAgeMs?"fresh":"stale",ageMs})}
 const active=accepted.filter(x=>x.enrollment.status==="active");const actionable=active.filter(x=>x.hubFreshness==="fresh"&&x.nextAction.kind!=="none").sort((a,b)=>b.nextAction.priority-a.nextAction.priority||b.workload.dueItems-a.workload.dueItems||a.presentation.displayName.localeCompare(b.presentation.displayName));
 return freeze({schema:"thiepn-language-hub-data-plane",schemaVersion:1,dataPlaneVersion:PLANE,generatedAt:now.toISOString(),languages:accepted,rejected,summary:{activeLanguages:active.length,staleLanguages:accepted.filter(x=>x.hubFreshness==="stale").length,dueItems:active.reduce((s,x)=>s+x.workload.dueItems,0),plannedItems:active.reduce((s,x)=>s+x.workload.totalItems,0),todayEvents:active.reduce((s,x)=>s+x.activity.todayEvents,0),...(active.every(x=>x.workload.estimatedMinutes!=null)?{estimatedMinutes:active.reduce((s,x)=>s+(x.workload.estimatedMinutes??0),0)}:{})},nextLanguageAction:actionable.length?{appId:actionable[0].appId,languageId:actionable[0].languageId,presentation:actionable[0].presentation,action:actionable[0].nextAction}:null,comparisonPolicy:{aggregatesWorkloadCounts:true,aggregatesActivityCounts:true,averagesMastery:false,averagesProficiency:false,convertsFrameworkBands:false,recomputesNextAction:false}})
}
global.THIEPN_LANGUAGE_READ_MODEL=Object.freeze({packageVersion:VERSION,readModelVersion:MODEL,dataPlaneVersion:PLANE,createLanguageReadModel:create,validateLanguageReadModel:validate,buildHubLanguageDataPlane:plane,serializeLanguageReadModel:function(m){const v=validate(m);if(!v.ok)throw new Error("INVALID_LANGUAGE_READ_MODEL:"+v.issues.join("|"));return JSON.stringify(m)},parseLanguageReadModel:function(s){return create(JSON.parse(s))}});
})(globalThis);
