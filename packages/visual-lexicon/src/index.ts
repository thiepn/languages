import {VISUAL_CONCEPTS,type VisualConcept} from "./catalog.js";
import {JAPANESE_VISUAL_BINDINGS} from "./japanese.js";
import {CHINESE_VISUAL_BINDINGS} from "./chinese.js";
import type {VisualBinding} from "./types.js";
export {VISUAL_CONCEPTS} from "./catalog.js";
export {JAPANESE_VISUAL_BINDINGS} from "./japanese.js";
export {CHINESE_VISUAL_BINDINGS} from "./chinese.js";
export type {VisualConcept} from "./catalog.js";
export type {VisualBinding} from "./types.js";

const byConcept=new Map<string,VisualConcept>(VISUAL_CONCEPTS.map(row=>[row.id,row]));
export const ALL_APPROVED_BINDINGS:readonly VisualBinding[]=[...JAPANESE_VISUAL_BINDINGS,...CHINESE_VISUAL_BINDINGS];

/** Opt-in picture lookup. A missing or ambiguous binding intentionally returns null. */
export function visualForConcept(conceptId:string):VisualConcept|null{
 return byConcept.get(conceptId)??null;
}
export function visualForLexeme(
 languageId:string,lexemeId:string,bindings:readonly VisualBinding[]=ALL_APPROVED_BINDINGS,senseId?:string
):VisualConcept|null{
 const candidates=bindings.filter(row=>row.languageId===languageId&&row.lexemeId===lexemeId&&(senseId===undefined||row.senseId===senseId));
 // Never guess from orthography/translation or choose an arbitrary polysemous sense.
 return candidates.length===1?visualForConcept(candidates[0]!.conceptId):null;
}
/** Relative path only; consumer controls bundling, base URL, lazy image loading and cache. */
export function visualAssetPath(conceptId:string):string|null{
 const visual=visualForConcept(conceptId);
 return visual?`assets/${visual.asset}`:null;
}
export function validateVisualBindings(bindings:readonly VisualBinding[]):string[]{
 const failures:string[]=[];const keys=new Set<string>();
 for(const item of bindings){
  const key=[item.languageId,item.lexemeId,item.senseId??""].join("\u0000");
  if(!item.languageId||!item.lexemeId)failures.push("Missing language/lexeme identity");
  if(keys.has(key))failures.push("Duplicate binding: "+item.languageId+":"+item.lexemeId);
  keys.add(key);
  if(!byConcept.has(item.conceptId))failures.push("Unknown concept: "+item.conceptId);
 }
 return failures;
}
