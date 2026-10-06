;(function(global){"use strict";
const VERSION="0.10.0",CONTRACT="p10-shell-v1";
const CATALOG=freeze([
  {appId:"french",languageId:"french",displayName:"French",nativeName:"Français",appRoute:"https://french.thiepn.dev/"},
  {appId:"japanese",languageId:"japanese",displayName:"Japanese",nativeName:"日本語",appRoute:"https://japanese.thiepn.dev/"}
]);
function deps(){
  if(!global.THIEPN_LANGUAGE_DASHBOARD)throw new Error("THIEPN_LANGUAGE_DASHBOARD_REQUIRED");
  if(!global.THIEPN_LANGUAGE_READ_MODEL)throw new Error("THIEPN_LANGUAGE_READ_MODEL_REQUIRED");
  return {dashboard:global.THIEPN_LANGUAGE_DASHBOARD,readModel:global.THIEPN_LANGUAGE_READ_MODEL};
}
function build(options){
  const state=options?.state||{status:"loading"},catalog=normalize(options?.catalog||CATALOG),online=options?.online!==false,active=String(options?.activeHref||"/");
  const now=new Date(options?.now||Date.now());if(!Number.isFinite(now.getTime()))throw new Error("INVALID_SHELL_NOW");
  const base={schema:"thiepn-language-shell",schemaVersion:1,contractVersion:CONTRACT,generatedAt:now.toISOString(),connectivity:online?"online":"offline"};
  if(state.status==="loading")return freeze({...base,status:"loading",nav:nav0(active),hero:null,cards:[],addLanguages:[],notices:offline(online),summary:null});
  if(state.status==="signed-out")return freeze({...base,status:"signed-out",nav:nav0(active),hero:null,cards:[],addLanguages:catalog.map(x=>({...x,mode:"open-product",actionLabel:"Open product"})),notices:offline(online),summary:null});
  if(state.status==="error"){const code=String(state.code||"LANGUAGE_DASHBOARD_LOAD_FAILED");return freeze({...base,status:"error",nav:nav0(active),hero:null,cards:[],addLanguages:[],notices:[...offline(online),{kind:"error",message:"Language progress could not be loaded. Retry without changing study state."}],summary:null,errorCode:code})}
  if(state.status!=="ready"||!state.remote)throw new Error("INVALID_LANGUAGE_SHELL_STATE");
  const {dashboard,readModel}=deps(),visible=dashboard.visibleLanguageSnapshots(state.remote),plane=readModel.buildHubLanguageDataPlane(visible,{now:options?.now,maxAgeMs:options?.maxAgeMs});
  const byKey=new Map(catalog.map(x=>[key(x.appId,x.languageId),x])),enrollments=new Map((state.remote.enrollments||[]).map(x=>[key(x.appId,x.languageId),x]));
  const cards=plane.languages.map(language=>{const fallback=byKey.get(key(language.appId,language.languageId)),appRoute=language.presentation.appRoute||fallback?.appRoute,continueHref=language.nextAction.route||appRoute;return {appId:language.appId,languageId:language.languageId,displayName:language.presentation.displayName,...(language.presentation.nativeName?{nativeName:language.presentation.nativeName}:fallback?.nativeName?{nativeName:fallback.nativeName}:{}),...(appRoute?{appRoute}:{}),...(continueHref?{continueHref}:{}),continueLabel:language.nextAction.kind==="none"?"Open language":language.nextAction.label,freshness:language.hubFreshness,enrollmentStatus:language.enrollment.status,...(language.enrollment.targetBand?{targetBand:language.enrollment.targetBand}:{}),dueItems:language.workload.dueItems,totalItems:language.workload.totalItems,...(language.workload.estimatedMinutes!=null?{estimatedMinutes:language.workload.estimatedMinutes}:{}),todayEvents:language.activity.todayEvents,streakDays:language.activity.streakDays,progressMetrics:language.progress.metrics,proficiency:language.proficiency,visibilityAction:{mode:"hide",label:"Hide from dashboard"}}});
  const next=plane.nextLanguageAction,hero=next?(()=>{const fallback=byKey.get(key(next.appId,next.languageId)),href=next.action.route||next.presentation.appRoute||fallback?.appRoute;return {appId:next.appId,languageId:next.languageId,languageLabel:next.presentation.displayName,title:next.action.label,kind:next.action.kind,...(next.action.reason?{reason:next.action.reason}:{}),...(href?{href}:{})}})():null;
  const visibleKeys=new Set(cards.map(x=>key(x.appId,x.languageId))),addLanguages=catalog.filter(x=>!visibleKeys.has(key(x.appId,x.languageId))).map(x=>{const enrolled=enrollments.get(key(x.appId,x.languageId));return {...x,mode:enrolled?"show":"open-product",actionLabel:enrolled?"Show on dashboard":"Open product"}});
  const notices=offline(online);if(plane.summary.staleLanguages>0)notices.push({kind:"stale",message:plane.summary.staleLanguages===1?"1 language has stale progress. Open that product to refresh it.":plane.summary.staleLanguages+" languages have stale progress. Open those products to refresh them."});
  const nav=[...nav0(active),...cards.filter(x=>x.appRoute).map(x=>({id:"language:"+x.appId,label:x.displayName,href:x.appRoute,active:active===x.appRoute||active.startsWith(x.appRoute+"#")||active.startsWith(x.appRoute+"?")}))];
  return freeze({...base,status:cards.length?"ready":"empty",nav,hero,cards,addLanguages,notices,summary:plane.summary});
}
function nav0(active){return [{id:"home",label:"Languages",href:"/",active:active==="/"||active===""}]}
function offline(online){return online?[]:[{kind:"offline",message:"You are offline. Showing the last loaded dashboard; live progress will refresh when the connection returns."}]}
function normalize(value){const seen=new Set();return value.map(x=>{const v={appId:req(x?.appId,"appId"),languageId:req(x?.languageId,"languageId"),displayName:req(x?.displayName,"displayName"),...(opt(x?.nativeName)?{nativeName:opt(x.nativeName)}:{}),appRoute:req(x?.appRoute,"appRoute")},k=key(v.appId,v.languageId);if(seen.has(k))throw new Error("DUPLICATE_LANGUAGE_CATALOG_ENTRY:"+k);seen.add(k);return v})}
function key(a,l){return String(a)+"\0"+String(l)}function req(v,n){const s=String(v??"").trim();if(!s)throw new Error("MISSING_"+n.toUpperCase());return s}function opt(v){const s=String(v??"").trim();return s||undefined}function freeze(v){if(!v||typeof v!=="object"||Object.isFrozen(v))return v;Object.freeze(v);for(const n of Object.values(v))freeze(n);return v}
global.THIEPN_LANGUAGE_SHELL=freeze({packageVersion:VERSION,contractVersion:CONTRACT,defaultLanguageCatalog:CATALOG,buildLanguageShellModel:build});
})(globalThis);
