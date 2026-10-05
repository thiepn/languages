import {buildHubLanguageDataPlane,validateLanguageReadModel} from "../../read-model/dist/index.js";
export const LANGUAGE_DASHBOARD_PACKAGE_VERSION="0.9.0";
export const LANGUAGE_DASHBOARD_CONTRACT_VERSION="p9-dashboard-v1";

export function validateLanguageDashboardPayload(value){
 const issues=[];
 if(!value||typeof value!=="object")return {ok:false,issues:["dashboard payload must be an object"]};
 if(value.schema!=="thiepn-language-dashboard")issues.push("unexpected dashboard schema");
 if(value.schemaVersion!==1)issues.push("unsupported dashboard schema version");
 if(value.contractVersion!==LANGUAGE_DASHBOARD_CONTRACT_VERSION)issues.push("unexpected dashboard contract version");
 if(!validIso(value.generatedAt))issues.push("generatedAt must be ISO timestamp");
 if(!Array.isArray(value.enrollments))issues.push("enrollments must be an array");
 if(!Array.isArray(value.snapshots))issues.push("snapshots must be an array");
 const enrollKeys=new Set();
 for(const row of Array.isArray(value.enrollments)?value.enrollments:[]){
   const key=identity(row,issues,"enrollment");
   if(typeof row?.visible!=="boolean")issues.push("enrollment.visible must be boolean");
   if(!validIso(row?.connectedAt))issues.push("enrollment.connectedAt must be ISO timestamp");
   if(!validIso(row?.updatedAt))issues.push("enrollment.updatedAt must be ISO timestamp");
   if(key){if(enrollKeys.has(key))issues.push("duplicate enrollment: "+key);enrollKeys.add(key)}
 }
 const snapshotKeys=new Set();
 for(const row of Array.isArray(value.snapshots)?value.snapshots:[]){
   const key=identity(row,issues,"snapshot");
   if(!Number.isInteger(row?.revision)||row.revision<1)issues.push("snapshot.revision must be positive integer");
   if(!validIso(row?.storedAt))issues.push("snapshot.storedAt must be ISO timestamp");
   const check=validateLanguageReadModel(row?.snapshot);
   if(!check.ok)issues.push(...check.issues.map(x=>"snapshot: "+x));
   if(key&&row?.snapshot){
     if(row.snapshot.appId!==row.appId||row.snapshot.languageId!==row.languageId)issues.push("snapshot identity mismatch: "+key);
     if(snapshotKeys.has(key))issues.push("duplicate snapshot: "+key);
     snapshotKeys.add(key);
   }
 }
 rejectIdentityFields(value,issues,"");
 return {ok:issues.length===0,issues};
}
export function visibleLanguageSnapshots(payload){
 const check=validateLanguageDashboardPayload(payload);
 if(!check.ok)throw new Error("INVALID_LANGUAGE_DASHBOARD:"+check.issues.join("|"));
 const visible=new Set(payload.enrollments.filter(x=>x.visible).map(x=>x.appId+"\u0000"+x.languageId));
 return payload.snapshots.filter(x=>visible.has(x.appId+"\u0000"+x.languageId)).map(x=>x.snapshot);
}
export function buildPersistedHubDataPlane(payload,options={}){
 return buildHubLanguageDataPlane(visibleLanguageSnapshots(payload),options);
}
export function createCoreLanguageDashboardClient(options){
 const baseUrl=required(options?.baseUrl,"baseUrl").replace(/\/+$/,"");
 const fetchImpl=options?.fetchImpl??globalThis.fetch;
 if(typeof fetchImpl!=="function")throw new Error("FETCH_UNAVAILABLE");
 if(typeof options?.getAccessToken!=="function")throw new Error("TOKEN_PROVIDER_REQUIRED");
 async function request(path,init={}){
   const token=await options.getAccessToken();
   if(!token)throw new Error("AUTH_REQUIRED");
   const response=await fetchImpl(baseUrl+path,{...init,headers:{Accept:"application/json",Authorization:"Bearer "+token,...(init.body?{"Content-Type":"application/json"}:{}),...(init.headers??{})}});
   const payload=await response.json().catch(()=>null);
   if(!response.ok||!payload?.ok){
     const error=new Error(String(payload?.error?.code||("HTTP_"+response.status)));
     error.code=String(payload?.error?.code||("HTTP_"+response.status));error.status=response.status;throw error;
   }
   return payload.data;
 }
 return Object.freeze({
   async publish(snapshot){
     const check=validateLanguageReadModel(snapshot);
     if(!check.ok)throw new Error("INVALID_LANGUAGE_READ_MODEL:"+check.issues.join("|"));
     return request("/v1/languages/read-models/"+encodeURIComponent(snapshot.appId),{method:"POST",body:JSON.stringify({snapshot})});
   },
   async load(){
     const data=await request("/v1/languages/dashboard");
     const check=validateLanguageDashboardPayload(data);
     if(!check.ok)throw new Error("INVALID_LANGUAGE_DASHBOARD:"+check.issues.join("|"));
     return data;
   },
   async setVisible(appId,languageId,visible){
     return request("/v1/languages/enrollments/"+encodeURIComponent(required(appId,"appId")),{method:"POST",body:JSON.stringify({languageId:required(languageId,"languageId"),visible:Boolean(visible)})});
   }
 });
}
function identity(row,issues,label){const a=String(row?.appId??"").trim(),l=String(row?.languageId??"").trim();if(!a)issues.push(label+".appId is required");if(!l)issues.push(label+".languageId is required");return a&&l?a+"\u0000"+l:null}
function validIso(v){return typeof v==="string"&&v.length>0&&Number.isFinite(new Date(v).getTime())}
function required(v,n){const s=String(v??"").trim();if(!s)throw new Error("MISSING_"+n.toUpperCase());return s}
function rejectIdentityFields(value,issues,path){if(!value||typeof value!=="object")return;for(const [key,nested] of Object.entries(value)){const next=path?path+"."+key:key;if(key==="accountId"||key==="userId")issues.push("forbidden identity field: "+next);if(nested&&typeof nested==="object")rejectIdentityFields(nested,issues,next)}}
