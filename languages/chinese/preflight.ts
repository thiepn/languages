/** E0 only: Chinese is not yet an authenticated Languages producer.
 * A preflight is not a projection, enrollment, Account identity or content import.
 */
export interface ChineseEcosystemPreflight {
 readonly lessonCount:number;
 readonly pathwayMissionCount:number;
 readonly ungradedTransferCount:number;
 readonly demonstrationQualified:boolean;
 readonly historicalIdsPreserved:boolean;
}
export interface ChineseIntegrationReadiness {
 readonly appId:"chinese";
 readonly languageId:"chinese";
 readonly mode:"read-only-preflight";
 readonly publishAllowed:false;
 readonly officialHskClaim:false;
 readonly issues:readonly string[];
}
export function inspectChineseEcosystemPreflight(input:ChineseEcosystemPreflight):ChineseIntegrationReadiness {
 const issues:string[]=[];
 for(const key of ["lessonCount","pathwayMissionCount","ungradedTransferCount"] as const){
  if(!Number.isInteger(input[key])||input[key]<0)issues.push("INVALID_"+key);
 }
 if(!input.demonstrationQualified)issues.push("UNQUALIFIED_ORIGINAL_DEMO_SOURCE");
 if(!input.historicalIdsPreserved)issues.push("HISTORICAL_LESSON_ID_DRIFT");
 if(input.ungradedTransferCount>input.pathwayMissionCount)
  issues.push("UNSCORED_TRANSFER_EXCEEDS_SOURCE_MISSIONS");
 issues.push("ACCOUNT_AUTHORIZATION_NOT_INTEGRATED");
 issues.push("CHINESE_OWNER_SCOPED_P8_PRODUCER_NOT_VERIFIED");
 return {appId:"chinese",languageId:"chinese",mode:"read-only-preflight",
  publishAllowed:false,officialHskClaim:false,issues};
}
