import {test} from "node:test";
import assert from "node:assert/strict";
import {buildSixLevelCatalog,CEFR_LEVELS} from "../packages/curriculum/src/level-catalog.ts";

const unit=(id,level,order)=>({id,level,order,title:"Original "+id,sourceIds:["original-source"],entry:{kind:"canonical-unit",unitId:id},availability:"available"});
test("A1 through C2 remain selectable, empty levels are honestly planned",()=>{
  const result=buildSixLevelCatalog([unit("b1-original","B1",9),unit("a1-original","A1",2)]);
  assert.deepEqual(result.map(x=>x.level),[...CEFR_LEVELS]);
  assert.deepEqual(result[2].lessons.map(x=>x.id),["b1-original"]);
  assert.deepEqual(result[5],{level:"C2",availability:"planned",lessons:[]});
});
test("source-owned IDs survive sort and numbering without mutating input",()=>{
  const input=[unit("second","A1",25),unit("first","A1",2)];
  const output=buildSixLevelCatalog(input);
  assert.deepEqual(output[0].lessons.map(x=>[x.id,x.lessonNumber,x.entry.unitId]),[["first",1,"first"],["second",2,"second"]]);
  assert.equal(input[0].id,"second");
});
test("fail closed for duplicate IDs, duplicate local order, missing source and corrupted aliases",()=>{
  assert.throws(()=>buildSixLevelCatalog([unit("same","A1",1),unit("same","B1",1)]),/COURSE_DUPLICATE_ID/);
  assert.throws(()=>buildSixLevelCatalog([unit("a","A1",1),unit("b","A1",1)]),/COURSE_DUPLICATE_ORDER/);
  assert.throws(()=>buildSixLevelCatalog([{...unit("a","A1",1),sourceIds:[]}]),/COURSE_SOURCE_REQUIRED/);
  assert.throws(()=>buildSixLevelCatalog([{...unit("a","A1",1),entry:{kind:"lesson",lessonId:"wrong"}}]),/COURSE_IDENTITY_MISMATCH/);
});
test("do not treat JLPT/HSK as CEFR and do not accept invalid positions",()=>{
  assert.throws(()=>buildSixLevelCatalog([unit("n5","N5",1)]),/COURSE_UNKNOWN_LEVEL/);
  assert.throws(()=>buildSixLevelCatalog([unit("bad","A1",0)]),/COURSE_BAD_ORDER/);
});
test("explicitly planned entries cannot create an available level",()=>{
  const result=buildSixLevelCatalog([{...unit("future","C2",1),availability:"planned",sourceIds:[]}]);
  assert.equal(result[5].availability,"planned");
  assert.equal(result[5].lessons[0].availability,"planned");
});
