import type { LanguageDashboardClient, LanguageDashboardPayload } from "@thiepn/language-dashboard";
import { visibleLanguageSnapshots } from "@thiepn/language-dashboard";
import { buildHubHomeReadModel, type HubHomeReadModel } from "./data-plane";

export type LiveHubDashboardState =
  | { readonly status:"signed-out" }
  | { readonly status:"ready"; readonly remote:LanguageDashboardPayload; readonly home:HubHomeReadModel }
  | { readonly status:"error"; readonly code:string };

export async function loadLiveHubDashboard(
  client:LanguageDashboardClient|null,
  options?:{readonly now?:string|number|Date;readonly maxAgeMs?:number}
):Promise<LiveHubDashboardState>{
  if(!client)return {status:"signed-out"};
  try{
    const remote=await client.load();
    return {status:"ready",remote,home:buildHubHomeReadModel(visibleLanguageSnapshots(remote),options)};
  }catch(error){
    return {status:"error",code:error instanceof Error?error.message:"LANGUAGE_DASHBOARD_LOAD_FAILED"};
  }
}
