import type { HubLanguageDataPlane, LanguageReadModel } from "../../read-model/dist/index.js";

export interface HubEnrollmentRecord {
  readonly appId:string;
  readonly languageId:string;
  readonly visible:boolean;
  readonly connectedAt:string;
  readonly updatedAt:string;
}
export interface PersistedLanguageSnapshot {
  readonly appId:string;
  readonly languageId:string;
  readonly revision:number;
  readonly storedAt:string;
  readonly snapshot:LanguageReadModel;
}
export interface LanguageDashboardPayload {
  readonly schema:"thiepn-language-dashboard";
  readonly schemaVersion:1;
  readonly contractVersion:"p9-dashboard-v1";
  readonly generatedAt:string;
  readonly enrollments:readonly HubEnrollmentRecord[];
  readonly snapshots:readonly PersistedLanguageSnapshot[];
}
export interface LanguageDashboardClient {
  publish(snapshot:LanguageReadModel):Promise<PersistedLanguageSnapshot>;
  load():Promise<LanguageDashboardPayload>;
  setVisible(appId:string,languageId:string,visible:boolean):Promise<HubEnrollmentRecord>;
}
export interface DashboardClientOptions {
  readonly baseUrl:string;
  readonly getAccessToken:()=>Promise<string|null>|string|null;
  readonly fetchImpl?:typeof fetch;
}
export declare const LANGUAGE_DASHBOARD_PACKAGE_VERSION:"0.9.0";
export declare const LANGUAGE_DASHBOARD_CONTRACT_VERSION:"p9-dashboard-v1";
export declare function validateLanguageDashboardPayload(value:unknown):{readonly ok:boolean;readonly issues:readonly string[]};
export declare function visibleLanguageSnapshots(payload:LanguageDashboardPayload):readonly LanguageReadModel[];
export declare function buildPersistedHubDataPlane(payload:LanguageDashboardPayload,options?:{readonly now?:string|number|Date;readonly maxAgeMs?:number}):HubLanguageDataPlane;
export declare function createCoreLanguageDashboardClient(options:DashboardClientOptions):LanguageDashboardClient;
