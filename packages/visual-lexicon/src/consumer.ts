import {visualForLexeme,visualAssetPath} from "./index.js";

/** Independent recall must not be accidentally cued by a picture. */
export type VisualUsage="introduction"|"reference"|"guided-practice"|"independent-recall";
export interface LocalVocabularyImage {
 readonly src:string;
 readonly alt:string;
 readonly conceptId:string;
 readonly width:320;
 readonly height:240;
 readonly loading:"lazy";
 readonly decoding:"async";
}
/** Optional image attributes for React or plain DOM. Does not fetch, cache, grade or retain state. */
export function localVocabularyImage(input:{
 readonly languageId:string;
 readonly lexemeId:string;
 readonly usage:VisualUsage;
 readonly assetBase?:string;
 readonly senseId?:string;
}):LocalVocabularyImage|null{
 if(input.usage==="independent-recall")return null;
 const base=(input.assetBase??"/visual-lexicon").trim().replace(/\/+$/,"");
 // Relative or origin-local URL paths only: no external servers, queries or traversal.
 if(!/^(?:\/|\.\/)?[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(base))return null;
 const visual=visualForLexeme(input.languageId,input.lexemeId,undefined,input.senseId);
 const path=visual?visualAssetPath(visual.id):null;
 if(!visual||!path)return null;
 return {src:base+"/"+path,alt:visual.alt,conceptId:visual.id,width:320,height:240,loading:"lazy",decoding:"async"};
}
