import { readFile } from "node:fs/promises";
import { describe,expect,it } from "vitest";
import {
  LANGUAGE_HUB_DATA_PLANE_VERSION,
  LANGUAGE_READ_MODEL_PACKAGE_VERSION,
  LANGUAGE_READ_MODEL_VERSION,
  buildHubLanguageDataPlane,
  createLanguageReadModel,
  parseLanguageReadModel,
  serializeLanguageReadModel,
  validateLanguageReadModel
} from "../packages/read-model/dist/index.js";

function french(generatedAt="2026-10-05T12:00:00.000Z"){
  return createLanguageReadModel({
    generatedAt,
    appId:"french",
    languageId:"french",
    producerRevision:"fr-p8",
    presentation:{displayName:"French",nativeName:"Français",appRoute:"https://french.thiepn.dev/"},
    enrollment:{status:"active",targetBand:"B1"},
    workload:{dueItems:18,newItems:6,practiceItems:2,courseItems:0,totalItems:26,estimatedMinutes:30},
    activity:{todayEvents:24,sevenDayEvents:113,streakDays:8,lastStudiedAt:"2026-10-05T11:55:00.000Z"},
    progress:{metrics:[
      {id:"lexical",label:"Vocabulary mastered",current:812,total:3000,unit:"cards"},
      {id:"target",label:"B1 target curriculum",current:62,total:100,unit:"percent"}
    ]},
    proficiency:{
      framework:"THIEPN French internal CEFR-aligned gates",
      claim:"internal",
      currentBand:"A2",
      frontierBand:"B1",
      dimensions:[
        {id:"reading",label:"Reading",score:.7,confidence:.6,evidenceCount:42},
        {id:"speaking",label:"Speaking",score:.51,confidence:.45,evidenceCount:19}
      ]
    },
    nextAction:{id:"weakness",label:"Strengthen speaking",kind:"practice",priority:88,reason:"B1 speaking is the weakest current gate.",route:"https://french.thiepn.dev/#study"},
    source:{stateRevision:"fr-state-7",contentVersion:"5.18.0"}
  });
}

function japanese(generatedAt="2026-10-05T12:01:00.000Z"){
  return createLanguageReadModel({
    generatedAt,
    appId:"japanese",
    languageId:"japanese",
    producerRevision:"ja-p8",
    presentation:{displayName:"Japanese",nativeName:"日本語",appRoute:"https://japanese.thiepn.dev/"},
    enrollment:{status:"active",targetBand:"B1"},
    workload:{dueItems:6,newItems:7,practiceItems:3,courseItems:2,totalItems:18,estimatedMinutes:24},
    activity:{todayEvents:9,sevenDayEvents:61,streakDays:4,lastStudiedAt:"2026-10-05T11:40:00.000Z"},
    progress:{metrics:[
      {id:"kana",label:"Kana introduced",current:200,total:217,unit:"items"},
      {id:"vocabulary",label:"Vocabulary introduced",current:330,total:626,unit:"items"}
    ]},
    proficiency:{
      framework:"THIEPN Japanese internal communicative milestones",
      claim:"internal",
      currentBand:"A1",
      frontierBand:"B1",
      dimensions:[
        {id:"reading",label:"Reading",score:.58,confidence:.52,evidenceCount:30},
        {id:"listening",label:"Listening",score:.44,confidence:.41,evidenceCount:22}
      ]
    },
    nextAction:{id:"today",label:"Continue Japanese",kind:"study",priority:74,reason:"The authoritative Today queue has due and course work.",route:"https://japanese.thiepn.dev/"},
    source:{stateRevision:"ja-state-12",contentVersion:"0.10.0"}
  });
}

describe("P8 shared language read models",()=>{
  it("normalizes and round-trips a projection without raw learner state",()=>{
    const model=french();
    expect(model.schema).toBe("thiepn-language-read-model");
    expect(model.readModelVersion).toBe(LANGUAGE_READ_MODEL_VERSION);
    expect(model.packageVersion).toBe(LANGUAGE_READ_MODEL_PACKAGE_VERSION);
    expect(model.source.authority).toBe("consumer");
    expect(validateLanguageReadModel(model)).toEqual({ok:true,issues:[]});
    expect(parseLanguageReadModel(serializeLanguageReadModel(model))).toEqual(model);
  });

  it("rejects raw/private learner payloads at the Hub boundary",()=>{
    const unsafe={
      ...french(),
      studyEvents:[{id:"event-1"}]
    };
    const result=validateLanguageReadModel(unsafe);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue)=>issue.includes("studyEvents"))).toBe(true);
  });

  it("aggregates simple workload/activity counts but never averages proficiency or mastery",()=>{
    const plane=buildHubLanguageDataPlane([french(),japanese()],{
      now:"2026-10-05T12:05:00.000Z",
      maxAgeMs:60*60*1000
    });
    expect(plane.dataPlaneVersion).toBe(LANGUAGE_HUB_DATA_PLANE_VERSION);
    expect(plane.summary.activeLanguages).toBe(2);
    expect(plane.summary.dueItems).toBe(24);
    expect(plane.summary.todayEvents).toBe(33);
    expect(plane.summary.estimatedMinutes).toBe(54);
    expect(plane.nextLanguageAction?.languageId).toBe("french");
    expect(plane.comparisonPolicy.averagesMastery).toBe(false);
    expect(plane.comparisonPolicy.averagesProficiency).toBe(false);
    expect(plane.comparisonPolicy.convertsFrameworkBands).toBe(false);
    expect(plane).not.toHaveProperty("averageProficiency");
    expect(plane).not.toHaveProperty("averageMastery");
  });

  it("does not select stale snapshots as the next action",()=>{
    const plane=buildHubLanguageDataPlane([
      french("2026-10-04T00:00:00.000Z"),
      japanese("2026-10-05T12:01:00.000Z")
    ],{
      now:"2026-10-05T12:05:00.000Z",
      maxAgeMs:60*60*1000
    });
    expect(plane.summary.staleLanguages).toBe(1);
    expect(plane.nextLanguageAction?.languageId).toBe("japanese");
  });

  it("rejects malformed snapshots without poisoning valid Hub models",()=>{
    const plane=buildHubLanguageDataPlane([
      japanese(),
      {schema:"wrong",appId:"broken",languageId:"broken"}
    ],{now:"2026-10-05T12:05:00.000Z"});
    expect(plane.languages).toHaveLength(1);
    expect(plane.rejected).toHaveLength(1);
    expect(plane.rejected[0]?.appId).toBe("broken");
  });

  it("ships the browser artifact under the same version contract",async()=>{
    const browser=await readFile(
      new URL("../packages/read-model/dist/browser.js",import.meta.url),
      "utf8"
    );
    expect(browser).toContain('VERSION="0.8.0"');
    expect(browser).toContain('MODEL="p8-read-model-v1"');
    expect(browser).toContain('PLANE="p8-hub-data-plane-v1"');
    expect(browser).toContain("averagesProficiency:false");
    expect(browser).toContain("recomputesNextAction:false");
  });
  it("tracks the integrated French and Japanese P8 producers in the compatibility registry",async()=>{
    const raw=await readFile(
      new URL("../contracts/p7-consumer-baselines.json",import.meta.url),
      "utf8"
    );
    const registry=JSON.parse(raw);
    const french=registry.consumers.find((consumer:{appId:string})=>consumer.appId==="french");
    const japanese=registry.consumers.find((consumer:{appId:string})=>consumer.appId==="japanese");

    expect(french?.repositoryRevision).toBe(
      "b4755ae1f59f91b8552d5cfed425f5ff49e00ebc"
    );
    expect(french?.readModelVersion).toBe("p8-read-model-v1");
    expect(french?.readModelProducerRevision).toBe("french-p8-read-model-v2");
    expect(
      french?.sourceFingerprints.some(
        (entry:{path:string})=>entry.path==="vendor/thiepn-languages-read-model.js"
      )
    ).toBe(true);

    expect(japanese?.repositoryRevision).toBe(
      "e4c72347f16892c59a2ad94ab788c4157859a1ea"
    );
    expect(japanese?.readModelVersion).toBe("p8-read-model-v1");
    expect(japanese?.readModelProducerRevision).toBe("japanese-p8-read-model-v2");
    expect(
      japanese?.sourceFingerprints.some(
        (entry:{path:string})=>entry.path==="apps/web/src/languageReadModel.ts"
      )
    ).toBe(true);
    expect(
      japanese?.sourceFingerprints.some(
        (entry:{path:string})=>entry.path==="apps/web/src/study/c1Reliability.ts"
      )
    ).toBe(true);
  });

});
