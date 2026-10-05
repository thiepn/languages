import {describe,expect,it,vi} from "vitest";
import {createLanguageReadModel} from "../packages/read-model/dist/index.js";
import {
  LANGUAGE_DASHBOARD_CONTRACT_VERSION,
  buildPersistedHubDataPlane,
  createCoreLanguageDashboardClient,
  validateLanguageDashboardPayload,
  visibleLanguageSnapshots
} from "../packages/dashboard/dist/index.js";
import {loadLiveHubDashboard} from "../apps/hub/src/live-dashboard";

function model(appId:string,priority:number){
  return createLanguageReadModel({
    generatedAt:"2026-10-05T12:00:00.000Z",
    appId,
    languageId:appId,
    producerRevision:appId+"-p9",
    presentation:{displayName:appId},
    workload:{dueItems:1,totalItems:4},
    nextAction:{id:"next",label:"Continue",kind:"study",priority},
    source:{stateRevision:"r1"}
  });
}
function payload(){
  return {
    schema:"thiepn-language-dashboard" as const,
    schemaVersion:1 as const,
    contractVersion:LANGUAGE_DASHBOARD_CONTRACT_VERSION,
    generatedAt:"2026-10-05T12:05:00.000Z",
    enrollments:[
      {appId:"french",languageId:"french",visible:true,connectedAt:"2026-10-01T00:00:00.000Z",updatedAt:"2026-10-05T12:00:00.000Z"},
      {appId:"japanese",languageId:"japanese",visible:false,connectedAt:"2026-10-01T00:00:00.000Z",updatedAt:"2026-10-05T12:00:00.000Z"}
    ],
    snapshots:[
      {appId:"french",languageId:"french",revision:3,storedAt:"2026-10-05T12:00:10.000Z",snapshot:model("french",90)},
      {appId:"japanese",languageId:"japanese",revision:2,storedAt:"2026-10-05T12:00:20.000Z",snapshot:model("japanese",70)}
    ]
  };
}
describe("P9 authenticated language dashboard",()=>{
  it("keeps Hub visibility separate from product state",()=>{
    const p=payload();
    expect(validateLanguageDashboardPayload(p)).toEqual({ok:true,issues:[]});
    expect(visibleLanguageSnapshots(p).map(x=>x.appId)).toEqual(["french"]);
    expect(buildPersistedHubDataPlane(p,{now:"2026-10-05T12:05:00.000Z"}).nextLanguageAction?.appId).toBe("french");
  });
  it("rejects account identity leakage",()=>{
    const v=validateLanguageDashboardPayload({...payload(),userId:"nope"});
    expect(v.ok).toBe(false);
    expect(v.issues.some(x=>x.includes("userId"))).toBe(true);
  });
  it("keeps bearer identity out of the published projection",async()=>{
    const f=vi.fn(async(_u:RequestInfo|URL,i?:RequestInit)=>{
      expect((i?.headers as Record<string,string>).Authorization).toBe("Bearer secret-token");
      expect(JSON.stringify(JSON.parse(String(i?.body)))).not.toContain("secret-token");
      return Response.json({ok:true,data:{appId:"french",languageId:"french",revision:1,storedAt:"2026-10-05T12:00:10.000Z",snapshot:model("french",90)},meta:{requestId:"x"}});
    });
    const c=createCoreLanguageDashboardClient({baseUrl:"https://core.thiepn.dev/",getAccessToken:()=>"secret-token",fetchImpl:f});
    await c.publish(model("french",90));
    expect(f).toHaveBeenCalledWith("https://core.thiepn.dev/v1/languages/read-models/french",expect.objectContaining({method:"POST"}));
  });
  it("loads persisted visible snapshots through the existing P8 plane",async()=>{
    const p=payload();
    const state=await loadLiveHubDashboard({publish:vi.fn(),setVisible:vi.fn(),load:async()=>p},{now:"2026-10-05T12:05:00.000Z"});
    expect(state.status).toBe("ready");
    if(state.status==="ready"){
      expect(state.home.cards).toHaveLength(1);
      expect(state.home.nextAction?.appId).toBe("french");
    }
  });
});
