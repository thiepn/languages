export type EnrollmentStatus="active"|"paused"|"completed"|"inactive";
export type ProficiencyClaim="internal"|"external"|"none";
export type NextActionKind="study"|"review"|"learn"|"practice"|"course"|"assessment"|"immerse"|"maintain"|"none";

export interface LanguageReadModel {
  readonly schema:"thiepn-language-read-model";
  readonly schemaVersion:1;
  readonly readModelVersion:string;
  readonly packageVersion:string;
  readonly generatedAt:string;
  readonly appId:string;
  readonly languageId:string;
  readonly producerRevision:string;
  readonly presentation:{
    readonly displayName:string;
    readonly nativeName?:string;
    readonly appRoute?:string;
  };
  readonly enrollment:{
    readonly status:EnrollmentStatus;
    readonly startedAt?:string;
    readonly targetBand?:string;
  };
  readonly workload:{
    readonly dueItems:number;
    readonly newItems:number;
    readonly practiceItems:number;
    readonly courseItems:number;
    readonly totalItems:number;
    readonly estimatedMinutes?:number;
  };
  readonly activity:{
    readonly todayEvents:number;
    readonly sevenDayEvents:number;
    readonly streakDays:number;
    readonly lastStudiedAt:string|null;
  };
  readonly progress:{
    readonly metrics:readonly {
      readonly id:string;
      readonly label:string;
      readonly current:number;
      readonly total?:number;
      readonly unit?:string;
    }[];
  };
  readonly proficiency:{
    readonly framework:string;
    readonly claim:ProficiencyClaim;
    readonly currentBand?:string;
    readonly frontierBand?:string;
    readonly maintenanceNeeded:boolean;
    readonly dimensions:readonly {
      readonly id:string;
      readonly label:string;
      readonly score?:number;
      readonly confidence?:number;
      readonly band?:string;
      readonly evidenceCount?:number;
    }[];
  };
  readonly nextAction:{
    readonly id:string;
    readonly label:string;
    readonly kind:NextActionKind;
    readonly priority:number;
    readonly reason?:string;
    readonly route?:string;
  };
  readonly source:{
    readonly authority:"consumer";
    readonly stateRevision?:string;
    readonly contentVersion?:string;
  };
}

export interface HubLanguageDataPlane {
  readonly schema:"thiepn-language-hub-data-plane";
  readonly schemaVersion:1;
  readonly dataPlaneVersion:string;
  readonly generatedAt:string;
  readonly languages:readonly (LanguageReadModel & {
    readonly hubFreshness:"fresh"|"stale";
    readonly ageMs:number;
  })[];
  readonly rejected:readonly {
    readonly appId:string;
    readonly languageId:string;
    readonly issues:readonly string[];
  }[];
  readonly summary:{
    readonly activeLanguages:number;
    readonly staleLanguages:number;
    readonly dueItems:number;
    readonly plannedItems:number;
    readonly todayEvents:number;
    readonly estimatedMinutes?:number;
  };
  readonly nextLanguageAction:{
    readonly appId:string;
    readonly languageId:string;
    readonly presentation:LanguageReadModel["presentation"];
    readonly action:LanguageReadModel["nextAction"];
  }|null;
  readonly comparisonPolicy:{
    readonly aggregatesWorkloadCounts:true;
    readonly aggregatesActivityCounts:true;
    readonly averagesMastery:false;
    readonly averagesProficiency:false;
    readonly convertsFrameworkBands:false;
    readonly recomputesNextAction:false;
  };
}

export declare const LANGUAGE_READ_MODEL_PACKAGE_VERSION:"0.8.0";
export declare const LANGUAGE_READ_MODEL_VERSION:"p8-read-model-v1";
export declare const LANGUAGE_HUB_DATA_PLANE_VERSION:"p8-hub-data-plane-v1";

export declare function createLanguageReadModel(input:{
  readonly generatedAt?:string|number|Date;
  readonly appId:string;
  readonly languageId:string;
  readonly producerRevision:string;
  readonly presentation:{readonly displayName:string;readonly nativeName?:string;readonly appRoute?:string};
  readonly enrollment?:{readonly status?:EnrollmentStatus;readonly startedAt?:string;readonly targetBand?:string};
  readonly workload?:Partial<LanguageReadModel["workload"]>;
  readonly activity?:Partial<LanguageReadModel["activity"]>;
  readonly progress?:{readonly metrics?:readonly {readonly id:string;readonly label?:string;readonly current:number;readonly total?:number;readonly unit?:string}[]};
  readonly proficiency?:Partial<Omit<LanguageReadModel["proficiency"],"maintenanceNeeded"|"dimensions">> & {
    readonly maintenanceNeeded?:boolean;
    readonly dimensions?:readonly {readonly id:string;readonly label?:string;readonly score?:number;readonly confidence?:number;readonly band?:string;readonly evidenceCount?:number}[];
  };
  readonly nextAction?:Partial<LanguageReadModel["nextAction"]>;
  readonly source?:Omit<LanguageReadModel["source"],"authority">;
}):LanguageReadModel;

export declare function validateLanguageReadModel(value:unknown):{
  readonly ok:boolean;
  readonly issues:readonly string[];
};

export declare function buildHubLanguageDataPlane(
  models:readonly unknown[],
  options?:{readonly now?:string|number|Date;readonly maxAgeMs?:number}
):HubLanguageDataPlane;

export declare function serializeLanguageReadModel(model:unknown):string;
export declare function parseLanguageReadModel(serialized:string):LanguageReadModel;
