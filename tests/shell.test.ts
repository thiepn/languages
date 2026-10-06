import {describe,expect,it} from "vitest";
import {createLanguageReadModel} from "../packages/read-model/dist/index.js";
import {LANGUAGE_DASHBOARD_CONTRACT_VERSION} from "../packages/dashboard/dist/index.js";
import {
  LANGUAGE_SHELL_CONTRACT_VERSION,
  LANGUAGE_SHELL_PACKAGE_VERSION,
  buildLanguageShellModel
} from "../packages/shell/dist/index.js";

function language(appId:string,priority:number,generatedAt="2026-10-06T10:00:00.000Z"){
  const french=appId==="french";
  return createLanguageReadModel({
    generatedAt,
    appId,
    languageId:appId,
    producerRevision:appId+"-p10",
    presentation:{
      displayName:french?"French":"Japanese",
      nativeName:french?"Français":"日本語",
      appRoute:french?"https://french.thiepn.dev/":"https://thiepn.dev/japanese/"
    },
    enrollment:{status:"active",targetBand:"B1"},
    workload:{dueItems:french?12:4,totalItems:french?20:9,estimatedMinutes:french?30:18},
    activity:{todayEvents:french?8:3,sevenDayEvents:30,streakDays:french?9:4,lastStudiedAt:"2026-10-06T09:30:00.000Z"},
    progress:{metrics:[{id:"course",label:"Course",current:french?64:21,total:100,unit:"percent"}]},
    proficiency:{framework:"internal",claim:"internal",currentBand:french?"A2":"A1",frontierBand:"B1"},
    nextAction:{id:"next",label:french?"Speaking practice":"Continue Japanese",kind:"study",priority,reason:"Authoritative product recommendation.",route:(french?"https://french.thiepn.dev/":"https://thiepn.dev/japanese/")+"#study"},
    source:{stateRevision:"r1"}
  });
}

function payload({japaneseVisible=true}:{japaneseVisible?:boolean}={}){
  return {
    schema:"thiepn-language-dashboard" as const,
    schemaVersion:1 as const,
    contractVersion:LANGUAGE_DASHBOARD_CONTRACT_VERSION,
    generatedAt:"2026-10-06T10:02:00.000Z",
    enrollments:[
      {appId:"french",languageId:"french",visible:true,connectedAt:"2026-10-01T00:00:00.000Z",updatedAt:"2026-10-06T10:00:00.000Z"},
      {appId:"japanese",languageId:"japanese",visible:japaneseVisible,connectedAt:"2026-10-01T00:00:00.000Z",updatedAt:"2026-10-06T10:00:00.000Z"}
    ],
    snapshots:[
      {appId:"french",languageId:"french",revision:4,storedAt:"2026-10-06T10:00:20.000Z",snapshot:language("french",90)},
      {appId:"japanese",languageId:"japanese",revision:3,storedAt:"2026-10-06T10:00:30.000Z",snapshot:language("japanese",70)}
    ]
  };
}

describe("P10 language product-family shell",()=>{
  it("builds a unified shell while keeping authoritative study routes",()=>{
    const shell=buildLanguageShellModel({state:{status:"ready",remote:payload()},now:"2026-10-06T10:05:00.000Z"});
    expect(LANGUAGE_SHELL_PACKAGE_VERSION).toBe("0.10.1");
    expect(shell.contractVersion).toBe(LANGUAGE_SHELL_CONTRACT_VERSION);
    expect(shell.status).toBe("ready");
    expect(shell.cards).toHaveLength(2);
    expect(shell.hero?.appId).toBe("french");
    expect(shell.hero?.href).toBe("https://french.thiepn.dev/#study");
    expect(shell.summary?.dueItems).toBe(16);
    expect(shell.cards[0]?.visibilityAction.mode).toBe("hide");
  });

  it("never exposes a stale product next action as an authoritative card action",()=>{
    const remote=payload();
    remote.snapshots[0]={...remote.snapshots[0],snapshot:language("french",99,"2026-10-05T00:00:00.000Z")};
    const shell=buildLanguageShellModel({
      state:{status:"ready",remote},
      now:"2026-10-06T10:05:00.000Z",
      maxAgeMs:6*60*60*1000
    });
    const french=shell.cards.find(card=>card.appId==="french");
    expect(french?.freshness).toBe("stale");
    expect(french?.continueHref).toBe("https://french.thiepn.dev/");
    expect(french?.continueLabel).toBe("Open language");
    expect(shell.hero?.appId).toBe("japanese");
  });

  it("turns hidden Hub visibility into a show action, not a learning enrollment",()=>{
    const shell=buildLanguageShellModel({state:{status:"ready",remote:payload({japaneseVisible:false})},now:"2026-10-06T10:05:00.000Z"});
    expect(shell.cards.map(card=>card.appId)).toEqual(["french"]);
    const japanese=shell.addLanguages.find(entry=>entry.appId==="japanese");
    expect(japanese?.mode).toBe("show");
    expect(japanese?.actionLabel).toBe("Show on dashboard");
  });

  it("routes a not-yet-connected catalog language to its product rather than fabricating learner state",()=>{
    const remote=payload({japaneseVisible:false});
    remote.enrollments.splice(1,1);
    remote.snapshots.splice(1,1);
    const shell=buildLanguageShellModel({state:{status:"ready",remote},now:"2026-10-06T10:05:00.000Z"});
    const japanese=shell.addLanguages.find(entry=>entry.appId==="japanese");
    expect(japanese?.mode).toBe("open-product");
    expect(japanese?.appRoute).toBe("https://thiepn.dev/japanese/");
  });

  it("preserves the last loaded model offline and surfaces connectivity explicitly",()=>{
    const shell=buildLanguageShellModel({state:{status:"ready",remote:payload()},online:false,now:"2026-10-06T10:05:00.000Z"});
    expect(shell.status).toBe("ready");
    expect(shell.connectivity).toBe("offline");
    expect(shell.notices.some(notice=>notice.kind==="offline")).toBe(true);
  });

  it("renders signed-out and error states without demo data",()=>{
    const signedOut=buildLanguageShellModel({state:{status:"signed-out"},now:"2026-10-06T10:05:00.000Z"});
    const error=buildLanguageShellModel({state:{status:"error",code:"AUTH_EXPIRED"},now:"2026-10-06T10:05:00.000Z"});
    expect(signedOut.cards).toEqual([]);
    expect(signedOut.status).toBe("signed-out");
    expect(error.cards).toEqual([]);
    expect(error.errorCode).toBe("AUTH_EXPIRED");
  });
});
