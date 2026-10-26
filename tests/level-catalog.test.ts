import {describe,expect,it} from "vitest";
import {buildSixLevelCatalog,CEFR_LEVELS,type CourseCatalogEntry} from "../packages/curriculum/src/level-catalog.js";
const make=(id:string,level:"A1"|"B1",order:number):CourseCatalogEntry=>({id,level,order,title:id,sourceIds:["original-approved"],entry:{kind:"canonical-unit",unitId:id},availability:"available"});
describe("six-level course contract",()=>{
  it("always exposes A1 through C2, including honest empty levels",()=>{
    const levels=buildSixLevelCatalog([make("original-b1","B1",99),make("original-a1","A1",3)]);
    expect(levels.map(v=>v.level)).toEqual([...CEFR_LEVELS]);
    expect(levels[2].lessons[0]).toMatchObject({id:"original-b1",lessonNumber:1,order:99});
    expect(levels[5]).toMatchObject({level:"C2",availability:"planned",lessons:[]});
  });
  it("sorts without mutating inputs or changing canonical identities",()=>{
    const input=[make("two","A1",20),make("one","A1",10)];
    expect(buildSixLevelCatalog(input)[0].lessons.map(x=>[x.id,x.lessonNumber])).toEqual([["one",1],["two",2]]);
    expect(input[0].id).toBe("two");
  });
  it("rejects duplicate IDs, positions, wrong source ownership and identity remapping",()=>{
    expect(()=>buildSixLevelCatalog([make("one","A1",1),make("one","B1",1)])).toThrow("COURSE_DUPLICATE_ID");
    expect(()=>buildSixLevelCatalog([make("one","A1",1),make("two","A1",1)])).toThrow("COURSE_DUPLICATE_ORDER");
    expect(()=>buildSixLevelCatalog([{...make("x","A1",1),sourceIds:[]}])).toThrow("COURSE_SOURCE_REQUIRED");
    expect(()=>buildSixLevelCatalog([{...make("x","A1",1),entry:{kind:"lesson",lessonId:"wrong"}}])).toThrow("COURSE_IDENTITY_MISMATCH");
  });
  it("does not silently hide unknown levels or corrupt ordering",()=>{
    expect(()=>buildSixLevelCatalog([{...make("x","A1",1),level:"N5" as "A1"}])).toThrow("COURSE_UNKNOWN_LEVEL");
    expect(()=>buildSixLevelCatalog([{...make("x","A1",1),order:0}])).toThrow("COURSE_BAD_ORDER");
  });
  it("planned entries are not counted as released lessons",()=>{
    const catalog=buildSixLevelCatalog([{...make("future","B1",1),sourceIds:[],availability:"planned"}]);
    expect(catalog[2].availability).toBe("planned");
    expect(catalog[2].lessons[0].availability).toBe("planned");
  });
});
