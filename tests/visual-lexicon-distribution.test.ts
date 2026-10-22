import {describe,expect,it} from "vitest";
import {createHash} from "node:crypto";
import {copyFileSync,existsSync,mkdirSync,mkdtempSync,readFileSync,readdirSync,rmSync,writeFileSync,appendFileSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

/** Runs the exact original copy/manifests scripts in a disposable Node fixture, no network or app data. */
describe("visual lexicon local packaging",()=>{
 it("exports all 103 assets and 130 source bindings, rejecting tampering before writes",()=>{
  const dir=mkdtempSync(join(tmpdir(),"thiepn-visual-lexicon-"));
  try{
   const scripts=join(dir,"scripts"),dist=join(dir,"dist"),assets=join(dir,"assets");
   for(const d of [scripts,dist,assets])mkdirSync(d,{recursive:true});
   writeFileSync(join(dir,"package.json"),'{"type":"module"}\n');
   for(const script of ["write-manifest.mjs","copy-assets.mjs"]){
    copyFileSync(new URL("../packages/visual-lexicon/scripts/"+script,import.meta.url),join(scripts,script));
   }
   const concepts=Array.from({length:103},(_,i)=>{
    const name="visual-"+String(i).padStart(3,"0")+".svg";
    const content=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><title>'+name+'</title></svg>');
    writeFileSync(join(assets,name),content);
    const blobSha=createHash("sha1").update("blob "+content.length+String.fromCharCode(0)).update(content).digest("hex");
    return {id:"fixture."+i,asset:name,origin:{blobSha}};
   });
   const japanese=concepts.map((c,i)=>({languageId:"japanese",lexemeId:"lex-"+i,conceptId:c.id}));
   const chinese=concepts.slice(0,21).map((c,i)=>({languageId:"chinese",lexemeId:"zh-"+i,conceptId:c.id}));
   const french=concepts.slice(0,6).map((c,i)=>({languageId:"french",lexemeId:"fr-"+i,conceptId:c.id}));
   for(const [name,exportName,rows] of [
    ["catalog","VISUAL_CONCEPTS",concepts],
    ["japanese","JAPANESE_VISUAL_BINDINGS",japanese],
    ["chinese","CHINESE_VISUAL_BINDINGS",chinese],
    ["french","FRENCH_VISUAL_BINDINGS",french]
   ] as const)writeFileSync(join(dist,name+".js"),"export const "+exportName+"="+JSON.stringify(rows)+";\n");
   const run=(script:string,args:string[]=[])=>spawnSync(process.execPath,[join(scripts,script),...args],{encoding:"utf8",timeout:15000});
   const generated=run("write-manifest.mjs");expect(generated.status,generated.stderr).toBe(0);
   const output=join(dir,"consumer","visual-lexicon"),copied=run("copy-assets.mjs",["--",output]);
   expect(copied.status,copied.stderr).toBe(0);
   expect(readdirSync(join(output,"assets"))).toHaveLength(103);
   const index=JSON.parse(readFileSync(join(output,"visual-catalog.json"),"utf8"));
   expect(index.schema).toBe("thiepn-visual-lexicon-v1");
   expect(index.concepts).toHaveLength(103);
   expect(index.bindings).toHaveLength(130);
   appendFileSync(join(assets,concepts[0]!.asset),"tampered");
   const rejectedTarget=join(dir,"must-not-exist");
   const rejected=run("copy-assets.mjs",[rejectedTarget]);
   expect(rejected.status).not.toBe(0);
   expect(rejected.stderr).toContain("Original SVG integrity mismatch");
   expect(existsSync(rejectedTarget)).toBe(false);
  }finally{rmSync(dir,{recursive:true,force:true});}
 });
});
