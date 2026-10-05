;(function(global){
  "use strict";
  const packageVersion="0.7.0";
  const contractVersion="p7-readonly-v1";
  const baselines=Object.freeze({
    french:Object.freeze({appId:"french",languageId:"french",repository:"thiepn/french",repositoryRevision:"28a39ce1c59ab02301b408f016522dbddc28d0c0",sourceFingerprint:"dee1b5108054aab8a5d42ab5ee733a0697e026f5",appVersion:"5.18.0"}),
    japanese:Object.freeze({appId:"japanese",languageId:"japanese",repository:"thiepn/japanese",repositoryRevision:"45d03f5b027bdb36fcf5a7f7df3c063e1ba09893",sourceFingerprint:"e15c8ae44e3aac08750e8fa7e34ec0ad7d333927",contentVersion:"0.10.0"})
  });
  const authority=Object.freeze({content:"consumer",learnerState:"consumer",studyEvents:"consumer",memory:"consumer",mastery:"consumer",proficiency:"consumer",orchestration:"consumer",sync:"consumer"});
  function requiredString(value,name){const text=String(value??"").trim();if(!text)throw new Error("MISSING_"+name.toUpperCase());return text;}
  function createReadOnlyConsumerDescriptor(input){
    const appId=requiredString(input&&input.appId,"appId");
    const languageId=requiredString(input&&input.languageId,"languageId");
    const consumerRevision=requiredString(input&&input.consumerRevision,"consumerRevision");
    const baseline=baselines[appId]||null;
    return Object.freeze({
      schema:"thiepn-language-consumer-compatibility",schemaVersion:1,
      platformPackageVersion:packageVersion,platformContractVersion:contractVersion,
      appId,languageId,integrationMode:"read-only",consumerRevision,
      baselineRevision:baseline?baseline.repositoryRevision:null,
      baselineCompatible:Boolean(baseline&&baseline.repositoryRevision===consumerRevision),
      authority,
      capabilities:Object.freeze({
        sharedDomainReadable:true,sharedCompatibilityReadable:true,
        sharedStateAuthoritative:false,consumerWritesSharedState:false,
        consumerUsesSharedScheduler:false,consumerUsesSharedMastery:false,
        consumerUsesSharedPromotion:false
      })
    });
  }
  function validateReadOnlyConsumerDescriptor(value){
    const issues=[];
    if(!value||typeof value!=="object")return {ok:false,issues:["descriptor must be an object"]};
    if(value.schema!=="thiepn-language-consumer-compatibility")issues.push("unexpected schema");
    if(value.schemaVersion!==1)issues.push("unsupported schema version");
    if(value.integrationMode!=="read-only")issues.push("integration mode must remain read-only");
    for(const key of Object.keys(value.authority||{}))if(value.authority[key]!=="consumer")issues.push("authority transfer is not allowed in P7: "+key);
    if(value.capabilities&&value.capabilities.sharedStateAuthoritative!==false)issues.push("shared state must not be authoritative in P7");
    if(value.capabilities&&value.capabilities.consumerWritesSharedState!==false)issues.push("P7 consumer must not write shared state");
    return {ok:issues.length===0,issues};
  }
  global.THIEPN_LANGUAGES_PLATFORM=Object.freeze({
    packageVersion,contractVersion,baselines,authority,
    createReadOnlyConsumerDescriptor,validateReadOnlyConsumerDescriptor,
    isBaselineRevisionCompatible:function(appId,revision){return Boolean(baselines[appId]&&baselines[appId].repositoryRevision===revision);}
  });
})(globalThis);
