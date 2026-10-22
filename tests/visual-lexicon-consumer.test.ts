import {describe,expect,it} from "vitest";
import {existsSync,mkdtempSync,readFileSync,readdirSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join,resolve} from "node:path";
import {spawnSync} from "node:child_process";

// Smoke-test the built, packed package as an isolated real consumer; no network or learner writes.
describe("visual lexicon packaged consumer",()=>{
 it("installs the real tarball, imports its public API and copies original local assets",()=>{
  const root=resolve(import.meta.dirname,"../packages/visual-lexicon");
  expect(existsSync(join(root,"dist/index.js")),"Run pnpm build:visuals before tests").toBe(true);
  const temp=mkdtempSync(join(tmpdir(),"visual-lexicon-consumer-"));
  const run=(bin:string,args:string[],cwd=temp)=>spawnSync(bin,args,{cwd,encoding:"utf8",timeout:120000,env:{...process.env,npm_config_update_notifier:"false"}});
  try{
   const packed=run("pnpm",["pack","--pack-destination",temp],root);
   expect(packed.status,packed.stderr||packed.stdout).toBe(0);
   const archives=readdirSync(temp).filter(n=>n.endsWith(".tgz"));
   expect(archives).toHaveLength(1);
   const installed=run("npm",["install","--offline","--ignore-scripts","--no-audit","--no-fund","--no-package-lock",join(temp,archives[0]!)]);
   expect(installed.status,installed.stderr||installed.stdout).toBe(0);
   const script=`
import {localVocabularyImage} from "@thiepn/visual-lexicon/consumer";
import {CHINESE_VISUAL_BINDINGS,visualForLexeme,validateVisualBindings} from "@thiepn/visual-lexicon";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
const image=localVocabularyImage({languageId:"chinese",lexemeId:"书|shu",usage:"reference"});
if(image?.src!=="/visual-lexicon/assets/book.svg"||image.loading!=="lazy"||image.decoding!=="async")throw Error("Packaged consumer image contract");
if(localVocabularyImage({languageId:"chinese",lexemeId:"书|shu",usage:"independent-recall"})!==null)throw Error("Independent recall leaked image");
if(localVocabularyImage({languageId:"chinese",lexemeId:"missing",usage:"reference"})!==null)throw Error("Unapproved key leaked image");
if(localVocabularyImage({languageId:"chinese",lexemeId:"书|shu",usage:"reference",assetBase:"https://outside.example"})!==null)throw Error("External asset accepted");
if(CHINESE_VISUAL_BINDINGS.length!==12||validateVisualBindings(CHINESE_VISUAL_BINDINGS).length||!visualForLexeme("chinese","水|shui"))throw Error("Packaged Chinese bindings invalid");
const require=createRequire(import.meta.url);
const manifest=JSON.parse(readFileSync(require.resolve("@thiepn/visual-lexicon/manifest"),"utf8"));
if(manifest.concepts.length!==103||manifest.bindings.length!==121)throw Error("Packaged manifest incomplete");
`;
   const exercised=run(process.execPath,["--input-type=module","-e",script]);
   expect(exercised.status,exercised.stderr||exercised.stdout).toBe(0);
   const packageScript=join(temp,"node_modules","@thiepn","visual-lexicon","scripts","copy-assets.mjs");
   expect(existsSync(packageScript)).toBe(true);
   const target=join(temp,"static","visual-lexicon");
   const copied=run(process.execPath,[packageScript,target]);
   expect(copied.status,copied.stderr||copied.stdout).toBe(0);
   expect(readdirSync(join(target,"assets"))).toHaveLength(103);
   const manifest=JSON.parse(readFileSync(join(target,"visual-catalog.json"),"utf8"));
   expect(manifest.concepts).toHaveLength(103);
   expect(manifest.bindings).toHaveLength(121);
  }finally{rmSync(temp,{force:true,recursive:true});}
 },120000);
});
