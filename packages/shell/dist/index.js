import {visibleLanguageSnapshots} from "../../dashboard/dist/index.js";
import {buildHubLanguageDataPlane} from "../../read-model/dist/index.js";

export const LANGUAGE_SHELL_PACKAGE_VERSION="0.10.1";
export const LANGUAGE_SHELL_CONTRACT_VERSION="p10-shell-v1";

export const DEFAULT_LANGUAGE_CATALOG=deepFreeze([
  {appId:"french",languageId:"french",displayName:"French",nativeName:"Français",appRoute:"https://french.thiepn.dev/"},
  {appId:"japanese",languageId:"japanese",displayName:"Japanese",nativeName:"日本語",appRoute:"https://thiepn.dev/japanese/"}
]);

export function buildLanguageShellModel(options){
  const state=options?.state??{status:"loading"};
  const catalog=normalizeCatalog(options?.catalog??DEFAULT_LANGUAGE_CATALOG);
  const online=options?.online!==false;
  const activeHref=String(options?.activeHref??"/");
  const now=new Date(options?.now??Date.now());
  if(!Number.isFinite(now.getTime()))throw new Error("INVALID_SHELL_NOW");
  const base={
    schema:"thiepn-language-shell",
    schemaVersion:1,
    contractVersion:LANGUAGE_SHELL_CONTRACT_VERSION,
    generatedAt:now.toISOString(),
    connectivity:online?"online":"offline"
  };

  if(state.status==="loading"){
    return deepFreeze({...base,status:"loading",nav:baseNav(activeHref),hero:null,cards:[],addLanguages:[],notices:offlineNotices(online),summary:null});
  }
  if(state.status==="signed-out"){
    return deepFreeze({...base,status:"signed-out",nav:baseNav(activeHref),hero:null,cards:[],addLanguages:catalog.map(entry=>({...entry,mode:"open-product",actionLabel:"Open product"})),notices:offlineNotices(online),summary:null});
  }
  if(state.status==="error"){
    const code=String(state.code??"LANGUAGE_DASHBOARD_LOAD_FAILED");
    return deepFreeze({...base,status:"error",nav:baseNav(activeHref),hero:null,cards:[],addLanguages:[],notices:[...offlineNotices(online),{kind:"error",message:"Language progress could not be loaded. Retry without changing study state."}],summary:null,errorCode:code});
  }
  if(state.status!=="ready"||!state.remote){
    throw new Error("INVALID_LANGUAGE_SHELL_STATE");
  }

  const visible=visibleLanguageSnapshots(state.remote);
  const plane=buildHubLanguageDataPlane(visible,{now:options?.now,maxAgeMs:options?.maxAgeMs});
  const catalogByKey=new Map(catalog.map(entry=>[key(entry.appId,entry.languageId),entry]));
  const enrollments=new Map((state.remote.enrollments??[]).map(row=>[key(row.appId,row.languageId),row]));
  const cards=plane.languages.map(language=>{
    const fallback=catalogByKey.get(key(language.appId,language.languageId));
    const appRoute=language.presentation.appRoute??fallback?.appRoute;
    const stale=language.hubFreshness==="stale";
    const continueHref=stale?appRoute:(language.nextAction.route??appRoute);
    return {
      appId:language.appId,
      languageId:language.languageId,
      displayName:language.presentation.displayName,
      ...(language.presentation.nativeName?{nativeName:language.presentation.nativeName}:fallback?.nativeName?{nativeName:fallback.nativeName}:{}),
      ...(appRoute?{appRoute}:{}),
      ...(continueHref?{continueHref}:{}),
      continueLabel:stale||language.nextAction.kind==="none"?"Open language":language.nextAction.label,
      freshness:language.hubFreshness,
      enrollmentStatus:language.enrollment.status,
      ...(language.enrollment.targetBand?{targetBand:language.enrollment.targetBand}:{}),
      dueItems:language.workload.dueItems,
      totalItems:language.workload.totalItems,
      ...(language.workload.estimatedMinutes!=null?{estimatedMinutes:language.workload.estimatedMinutes}:{}),
      todayEvents:language.activity.todayEvents,
      streakDays:language.activity.streakDays,
      progressMetrics:language.progress.metrics,
      proficiency:language.proficiency,
      visibilityAction:{mode:"hide",label:"Hide from dashboard"}
    };
  });

  const hero=plane.nextLanguageAction?buildHero(plane.nextLanguageAction,catalogByKey):null;
  const visibleKeys=new Set(cards.map(card=>key(card.appId,card.languageId)));
  const addLanguages=catalog.filter(entry=>!visibleKeys.has(key(entry.appId,entry.languageId))).map(entry=>{
    const enrollment=enrollments.get(key(entry.appId,entry.languageId));
    return {...entry,mode:enrollment?"show":"open-product",actionLabel:enrollment?"Show on dashboard":"Open product"};
  });

  const notices=offlineNotices(online);
  if(plane.summary.staleLanguages>0){
    notices.push({kind:"stale",message:plane.summary.staleLanguages===1?"1 language has stale progress. Open that product to refresh it.":plane.summary.staleLanguages+" languages have stale progress. Open those products to refresh them."});
  }

  const nav=[
    ...baseNav(activeHref),
    ...cards.filter(card=>card.appRoute).map(card=>({
      id:"language:"+card.appId,
      label:card.displayName,
      href:card.appRoute,
      active:isActive(activeHref,card.appRoute)
    }))
  ];

  return deepFreeze({...base,status:cards.length?"ready":"empty",nav,hero,cards,addLanguages,notices,summary:plane.summary});
}

function buildHero(next,catalogByKey){
  const fallback=catalogByKey.get(key(next.appId,next.languageId));
  const href=next.action.route??next.presentation.appRoute??fallback?.appRoute;
  return {
    appId:next.appId,
    languageId:next.languageId,
    languageLabel:next.presentation.displayName,
    title:next.action.label,
    kind:next.action.kind,
    ...(next.action.reason?{reason:next.action.reason}:{}),
    ...(href?{href}:{})
  };
}
function baseNav(activeHref){return [{id:"home",label:"Languages",href:"/",active:activeHref==="/"||activeHref===""}]}
function offlineNotices(online){return online?[]:[{kind:"offline",message:"You are offline. Showing the last loaded dashboard; live progress will refresh when the connection returns."}]}
function normalizeCatalog(value){
  const seen=new Set();
  return value.map(entry=>{
    const normalized={
      appId:required(entry?.appId,"appId"),
      languageId:required(entry?.languageId,"languageId"),
      displayName:required(entry?.displayName,"displayName"),
      ...(optional(entry?.nativeName)?{nativeName:optional(entry.nativeName)}:{}),
      appRoute:required(entry?.appRoute,"appRoute")
    };
    const identity=key(normalized.appId,normalized.languageId);
    if(seen.has(identity))throw new Error("DUPLICATE_LANGUAGE_CATALOG_ENTRY:"+identity);
    seen.add(identity);
    return normalized;
  });
}
function isActive(activeHref,href){return activeHref===href||activeHref.startsWith(href+"#")||activeHref.startsWith(href+"?")}
function key(appId,languageId){return String(appId)+"\u0000"+String(languageId)}
function required(value,name){const text=String(value??"").trim();if(!text)throw new Error("MISSING_"+name.toUpperCase());return text}
function optional(value){const text=String(value??"").trim();return text||undefined}
function deepFreeze(value){if(!value||typeof value!=="object"||Object.isFrozen(value))return value;Object.freeze(value);for(const nested of Object.values(value))deepFreeze(nested);return value}
