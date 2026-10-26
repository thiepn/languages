/** Curriculum navigation contract. This layer never awards proficiency, mastery or memory credit. */
export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = typeof CEFR_LEVELS[number];
export type CourseEntryRef =
  | {readonly kind:"canonical-unit";readonly unitId:string}
  | {readonly kind:"lesson";readonly lessonId:string};

export interface CourseCatalogEntry {
  readonly id:string;
  readonly level:CefrLevel;
  readonly order:number;
  readonly title:string;
  readonly sourceIds:readonly string[];
  readonly entry:CourseEntryRef;
  readonly availability:"available"|"planned";
}

export interface NumberedCourseEntry extends CourseCatalogEntry {
  /** Presentation order within one level; never an identity or a completion counter. */
  readonly lessonNumber:number;
}

export interface CourseLevelCatalog {
  readonly level:CefrLevel;
  readonly availability:"available"|"planned";
  readonly lessons:readonly NumberedCourseEntry[];
}

/** Fail closed on invalid/ambiguous mappings. Existing source IDs stay unchanged. */
export function buildSixLevelCatalog(entries:readonly CourseCatalogEntry[]):readonly CourseLevelCatalog[]{
  const ids=new Set<string>();
  const orders=new Set<string>();
  for(const entry of entries){
    if(!CEFR_LEVELS.includes(entry.level))throw new Error("COURSE_UNKNOWN_LEVEL:"+entry.level);
    if(!entry.id.trim()||!entry.title.trim())throw new Error("COURSE_EMPTY_ID_OR_TITLE");
    if(ids.has(entry.id))throw new Error("COURSE_DUPLICATE_ID:"+entry.id);
    ids.add(entry.id);
    if(!Number.isSafeInteger(entry.order)||entry.order<1)throw new Error("COURSE_BAD_ORDER:"+entry.id);
    const slot=entry.level+":"+entry.order;
    if(orders.has(slot))throw new Error("COURSE_DUPLICATE_ORDER:"+slot);
    orders.add(slot);
    const target=entry.entry.kind==="canonical-unit"?entry.entry.unitId:entry.entry.lessonId;
    if(!target||target!==entry.id)throw new Error("COURSE_IDENTITY_MISMATCH:"+entry.id);
    if(entry.availability==="available"&&(!entry.sourceIds.length||entry.sourceIds.some(id=>!id.trim())))
      throw new Error("COURSE_SOURCE_REQUIRED:"+entry.id);
  }
  return CEFR_LEVELS.map(level=>{
    const lessons=entries.filter(item=>item.level===level)
      .sort((a,b)=>a.order-b.order)
      .map((item,index)=>({...item,lessonNumber:index+1}));
    return {level,availability:lessons.some(item=>item.availability==="available")?"available" as const:"planned" as const,lessons};
  });
}
