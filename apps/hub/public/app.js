;(function(global){"use strict";
const root=document.getElementById("app");
const Dashboard=global.THIEPN_LANGUAGE_DASHBOARD;
const Shell=global.THIEPN_LANGUAGE_SHELL;
const config=global.THIEPN_LANGUAGES_CONFIG||{};
let client=null;
let state={status:"loading"};
let lastRemote=null;
let busy=false;
let actionError="";

if(!Dashboard||!Shell){
  renderFatal("The Languages runtime did not load.");
  return;
}

if(config.coreBaseUrl&&typeof config.getAccessToken==="function"){
  client=Dashboard.createCoreLanguageDashboardClient({
    baseUrl:config.coreBaseUrl,
    getAccessToken:config.getAccessToken,
    fetchImpl:global.fetch.bind(global)
  });
}else{
  state={status:"signed-out"};
}

global.addEventListener("online",()=>refresh());
global.addEventListener("offline",()=>render());

if(client)refresh();else render();

async function refresh(){
  if(!client){state={status:"signed-out"};render();return}
  if(global.navigator&&global.navigator.onLine===false&&lastRemote){
    state={status:"ready",remote:lastRemote};render();return;
  }
  state={status:"loading"};actionError="";render();
  try{
    const remote=await client.load();
    lastRemote=remote;
    state={status:"ready",remote};
  }catch(error){
    const code=String(error?.code||error?.message||"LANGUAGE_DASHBOARD_LOAD_FAILED");
    state=code==="AUTH_REQUIRED"?{status:"signed-out"}:{status:"error",code};
  }
  render();
}

function buildModel(){
  return Shell.buildLanguageShellModel({
    state,
    online:global.navigator?global.navigator.onLine!==false:true,
    activeHref:"/",
    now:Date.now()
  });
}

function render(){
  const model=buildModel();
  root.replaceChildren(page(model));
}

function page(model){
  const shell=h("div",{class:"shell"});
  shell.append(topbar(model));
  shell.append(heroIntro(model));
  if(model.notices.length||actionError)shell.append(noticeList(model));
  if(model.status==="loading")shell.append(loadingState());
  else if(model.status==="signed-out")shell.append(signedOut(model));
  else if(model.status==="error")shell.append(errorState(model));
  else shell.append(readyState(model));
  shell.append(h("footer",{class:"footer"},
    h("span",{},"THIEPN Languages · Shared shell only"),
    h("span",{},"Study state stays in each language product.")
  ));
  if(busy)shell.classList.add("busy");
  return shell;
}

function topbar(model){
  const brand=h("a",{class:"brand",href:"/","aria-label":"THIEPN Languages home"},
    h("span",{class:"brand-mark","aria-hidden":"true"},icon("language")),
    h("span",{},"Languages")
  );
  const nav=h("nav",{class:"nav","aria-label":"Language navigation"});
  model.nav.forEach(item=>nav.append(h("a",{href:item.href,...(item.active?{"aria-current":"page"}:{})},item.label)));
  const actions=h("div",{class:"top-actions"});
  if(config.accountUrl){
    actions.append(h("a",{class:"icon-button",href:config.accountUrl,"aria-label":"Account"},icon("user")));
  }
  const refreshButton=h("button",{class:"icon-button",type:"button","aria-label":"Refresh language progress",disabled:busy},icon("refresh"));
  refreshButton.addEventListener("click",refresh);
  actions.append(refreshButton);
  return h("header",{class:"topbar"},brand,nav,actions);
}

function heroIntro(model){
  const copy=model.status==="signed-out"
    ?["Your languages, one place.","Continue each language without merging their learning systems."]
    :["Keep every language moving.","See what needs attention, then continue inside the language product that owns the study state."];
  return h("section",{class:"hero-wrap"},
    h("p",{class:"kicker"},"THIEPN language family"),
    h("h1",{class:"page-title"},copy[0]),
    h("p",{class:"page-subtitle"},copy[1])
  );
}

function noticeList(model){
  const wrap=h("div",{class:"notices"});
  model.notices.forEach(item=>wrap.append(h("div",{class:"notice "+item.kind},
    h("span",{class:"notice-dot","aria-hidden":"true"}),
    h("span",{},item.message)
  )));
  if(actionError)wrap.append(h("div",{class:"notice error"},
    h("span",{class:"notice-dot","aria-hidden":"true"}),
    h("span",{},actionError)
  ));
  return wrap;
}

function loadingState(){
  return h("div",{class:"loading-grid","aria-label":"Loading language dashboard"},
    h("div",{class:"loading-panel skeleton"}),
    h("div",{class:"loading-panel skeleton"})
  );
}

function signedOut(model){
  const actions=h("div",{class:"state-actions"});
  if(config.signInUrl)actions.append(h("a",{class:"primary-button",href:config.signInUrl},"Sign in"));
  model.addLanguages.slice(0,2).forEach(entry=>actions.append(h("a",{class:"secondary-button",href:entry.appRoute},entry.displayName)));
  return h("section",{class:"state-card"},
    h("h2",{},"Sign in to load your language dashboard"),
    h("p",{},config.signInUrl
      ?"Your Account session unlocks the same privacy-minimal French and Japanese summary on every signed-in device."
      :"This host has not connected the THIEPN Account session adapter yet. You can still open each language product directly."),
    actions
  );
}

function errorState(model){
  const retry=h("button",{class:"primary-button",type:"button",disabled:busy},"Retry");
  retry.addEventListener("click",refresh);
  return h("section",{class:"state-card"},
    h("h2",{},"Progress is temporarily unavailable"),
    h("p",{},"The Hub could not load its read-only language projection. No study state was changed. Error: "+String(model.errorCode||"unknown")),
    h("div",{class:"state-actions"},retry)
  );
}

function readyState(model){
  const wrap=h("main",{});
  if(model.status==="empty"){
    wrap.append(h("div",{class:"empty-hero"},
      h("div",{},h("h2",{},"No languages are shown yet"),h("p",{},"Show an existing language or open a product to get started."))
    ));
  }else{
    wrap.append(dashboardTop(model));
    wrap.append(languageSection(model));
  }
  if(model.addLanguages.length)wrap.append(addSection(model));
  return wrap;
}

function dashboardTop(model){
  const left=model.hero?continueCard(model.hero):h("section",{class:"continue-card"},
    h("div",{class:"continue-inner"},
      h("div",{},h("p",{class:"kicker"},"All caught up"),h("h2",{class:"continue-title"},"No fresh study action is waiting."),h("p",{class:"continue-reason"},"Open a language whenever you want to continue."))
    )
  );
  const summary=model.summary||{};
  const right=h("aside",{class:"summary-card"},
    h("h2",{},"Today"),
    h("div",{class:"summary-list"},
      summaryRow("Active languages",summary.activeLanguages??0),
      summaryRow("Due items",summary.dueItems??0),
      summaryRow("Planned items",summary.plannedItems??0),
      summaryRow("Study events",summary.todayEvents??0),
      ...(summary.estimatedMinutes!=null?[summaryRow("Estimated time",summary.estimatedMinutes+" min")]:[])
    )
  );
  return h("div",{class:"dashboard-grid"},left,right);
}

function continueCard(hero){
  const content=h("div",{class:"continue-inner"},
    h("div",{},
      h("p",{class:"kicker"},"Up next · "+hero.languageLabel),
      h("h2",{class:"continue-title"},hero.title),
      ...(hero.reason?[h("p",{class:"continue-reason"},hero.reason)]:[])
    )
  );
  const footer=h("div",{class:"continue-footer"});
  if(hero.href)footer.append(h("a",{class:"primary-button",href:hero.href},"Continue",icon("arrow")));
  content.append(footer);
  return h("section",{class:"continue-card"},content);
}

function summaryRow(label,value){
  return h("div",{class:"summary-row"},
    h("span",{class:"summary-label"},label),
    h("strong",{class:"summary-value"},String(value))
  );
}

function languageSection(model){
  const grid=h("div",{class:"language-grid"});
  model.cards.forEach(card=>grid.append(languageCard(card)));
  return h("section",{class:"section"},
    h("div",{class:"section-head"},
      h("div",{},h("h2",{class:"section-title"},"Your languages"),h("p",{class:"section-subtitle"},"Progress is reported by each language product."))
    ),
    grid
  );
}

function languageCard(card){
  const cardEl=h("article",{class:"language-card"});
  const header=h("div",{class:"language-header"},
    h("div",{},h("h3",{class:"language-name"},card.displayName),...(card.nativeName?[h("p",{class:"native-name"},card.nativeName)]:[])),
    h("span",{class:"pill "+(card.freshness==="stale"?"stale":"")},h("span",{class:"pill-dot"}),card.freshness)
  );
  const stats=h("div",{class:"card-stats"},
    stat(card.dueItems,"due"),
    stat(card.todayEvents,"today"),
    stat(card.streakDays,"day streak")
  );
  const current=card.proficiency?.currentBand||"—";
  const target=card.targetBand||card.proficiency?.frontierBand||"—";
  const levels=h("div",{class:"level-row"},
    h("div",{},h("span",{class:"level-label"},"Current "),h("strong",{class:"level-value"},current)),
    h("div",{},h("span",{class:"level-label"},"Target "),h("strong",{class:"level-value"},target))
  );
  const progress=h("div",{class:"progress-list"});
  card.progressMetrics.slice(0,3).forEach(metric=>progress.append(progressItem(metric)));
  const actions=h("div",{class:"card-actions"});
  if(card.continueHref)actions.append(h("a",{class:"secondary-button",href:card.continueHref},card.continueLabel));
  const hide=h("button",{class:"text-button",type:"button",disabled:busy},"Hide");
  hide.addEventListener("click",()=>setVisibility(card.appId,card.languageId,false));
  actions.append(hide);
  cardEl.append(header,stats,levels,progress,actions);
  return cardEl;
}

function progressItem(metric){
  const hasTotal=Number.isFinite(Number(metric.total))&&Number(metric.total)>0;
  const percent=hasTotal?Math.max(0,Math.min(100,(Number(metric.current)/Number(metric.total))*100)):0;
  const value=hasTotal?formatNumber(metric.current)+" / "+formatNumber(metric.total):formatNumber(metric.current)+(metric.unit?" "+metric.unit:"");
  return h("div",{class:"progress-item"},
    h("div",{class:"progress-meta"},h("strong",{},metric.label),h("span",{},value)),
    ...(hasTotal?[h("div",{class:"progress-track","aria-hidden":"true"},h("div",{class:"progress-fill",style:"width:"+percent.toFixed(1)+"%"}))]:[])
  );
}

function addSection(model){
  const grid=h("div",{class:"add-grid"});
  model.addLanguages.forEach(entry=>{
    let action;
    if(entry.mode==="show"&&client){
      action=h("button",{class:"secondary-button",type:"button",disabled:busy},entry.actionLabel);
      action.addEventListener("click",()=>setVisibility(entry.appId,entry.languageId,true));
    }else{
      action=h("a",{class:"secondary-button",href:entry.appRoute},entry.actionLabel);
    }
    grid.append(h("article",{class:"add-card"},
      h("div",{},h("div",{class:"add-name"},entry.displayName),...(entry.nativeName?[h("p",{class:"add-native"},entry.nativeName)]:[])),
      action
    ));
  });
  return h("section",{class:"section"},
    h("div",{class:"section-head"},h("div",{},h("h2",{class:"section-title"},"Languages"),h("p",{class:"section-subtitle"},"Showing a card changes only this Hub, never the language course itself."))),
    grid
  );
}

async function setVisibility(appId,languageId,visible){
  if(!client||busy)return;
  busy=true;actionError="";render();
  try{
    await client.setVisible(appId,languageId,visible);
    const remote=await client.load();
    lastRemote=remote;
    state={status:"ready",remote};
  }catch(error){
    actionError="Dashboard visibility could not be updated: "+String(error?.code||error?.message||"unknown error");
  }finally{
    busy=false;render();
  }
}

function stat(value,label){
  return h("div",{class:"stat"},h("span",{class:"stat-value"},String(value)),h("span",{class:"stat-label"},label));
}

function formatNumber(value){
  return Number(value).toLocaleString(undefined,{maximumFractionDigits:1});
}

function h(tag,attrs,...children){
  const node=document.createElement(tag);
  for(const [key,value] of Object.entries(attrs||{})){
    if(value==null||value===false)continue;
    if(key==="class")node.className=value;
    else if(key==="style")node.setAttribute("style",value);
    else if(key==="disabled")node.disabled=Boolean(value);
    else node.setAttribute(key,String(value));
  }
  for(const child of children.flat()){
    if(child==null||child===false)continue;
    node.append(child instanceof Node?child:document.createTextNode(String(child)));
  }
  return node;
}

function icon(name){
  const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("fill","none");svg.setAttribute("stroke","currentColor");svg.setAttribute("stroke-width","1.8");svg.setAttribute("stroke-linecap","round");svg.setAttribute("stroke-linejoin","round");
  const paths={
    language:["M5 8h8","M9 5v3c0 4-2 7-5 9","M6 13c1.5 1.7 3.2 3 5.2 3.9","M15 19l3.2-8 3.2 8","M16.2 16h4"],
    user:["M20 21a8 8 0 0 0-16 0","M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8"],
    refresh:["M20 6v5h-5","M4 18v-5h5","M18.5 9A7 7 0 0 0 6.2 6.2L4 9","M5.5 15A7 7 0 0 0 17.8 17.8L20 15"],
    arrow:["M5 12h14","m13-6 6 6-6 6"]
  };
  (paths[name]||[]).forEach(d=>{const p=document.createElementNS("http://www.w3.org/2000/svg","path");p.setAttribute("d",d);svg.append(p)});
  return svg;
}

function renderFatal(message){
  root.replaceChildren(h("main",{class:"noscript-card"},h("h1",{},"THIEPN Languages"),h("p",{},message)));
}
})(globalThis);
