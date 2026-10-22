import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {VISUAL_CONCEPTS,JAPANESE_VISUAL_BINDINGS,CHINESE_VISUAL_BINDINGS,FRENCH_VISUAL_BINDINGS,visualForConcept,visualForLexeme,visualAssetPath,validateVisualBindings} from "../packages/visual-lexicon/src/index.js";
import {localVocabularyImage} from "../packages/visual-lexicon/src/consumer.js";

describe("cross-language first-party visual lexicon",()=>{
 it("includes 103 unique source-preserving SVGs with validated provenance",()=>{
  expect(VISUAL_CONCEPTS).toHaveLength(103);
  expect(new Set(VISUAL_CONCEPTS.map(x=>x.id)).size).toBe(103);
  expect(new Set(VISUAL_CONCEPTS.map(x=>x.asset)).size).toBe(103);
  for(const image of VISUAL_CONCEPTS){
   expect(image.id).toMatch(/^[a-z]+\.[a-z0-9-]+$/);
   expect(image.asset).toMatch(/^[a-z0-9-]+\.svg$/);
   expect(image.rights).toBe("Original THIEPN illustration");
   expect(image.origin.repository).toBe("thiepn/japanese");
   expect(image.origin.legacyImageId+".svg").toBe(image.asset);
   expect(image.origin.blobSha).toMatch(/^[0-9a-f]{40}$/);
   expect(image.alt.trim().length).toBeGreaterThan(10);
   const bytes=readFileSync(new URL("../packages/visual-lexicon/assets/"+image.asset,import.meta.url));
   const sha=createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
   expect(sha).toBe(image.origin.blobSha);
   expect(bytes.length).toBeLessThan(8192);
   const svg=bytes.toString("utf8");
   expect(svg).toContain('viewBox="0 0 320 240"');
   expect(svg).not.toMatch(/<script\b|<foreignObject\b|<image\b|\son[a-z]+\s*=|\shref\s*=|url\s*\(/i);
  }
 });
 it("retains all Japanese lexemes and twelve attested Chinese original canonical keys",()=>{
  expect(JAPANESE_VISUAL_BINDINGS).toHaveLength(103);
  expect(CHINESE_VISUAL_BINDINGS).toHaveLength(21);
  expect(FRENCH_VISUAL_BINDINGS).toHaveLength(6);
  const all=[...JAPANESE_VISUAL_BINDINGS,...CHINESE_VISUAL_BINDINGS,...FRENCH_VISUAL_BINDINGS];
  expect(validateVisualBindings(all)).toEqual([]);
  expect(new Set(JAPANESE_VISUAL_BINDINGS.map(x=>x.lexemeId)).size).toBe(103);
  expect(visualForLexeme("japanese","lex-ringo")?.id).toBe("food.apple");
  expect(visualForLexeme("japanese","lex-mizu")?.id).toBe("beverage.water");
  expect(visualForLexeme("japanese","lex-shizuka")?.id).toBe("gesture.request-quiet");
  expect(visualForLexeme("japanese","lex-gohan")?.id).toBe("food.cooked-rice-bowl");
  expect(visualForLexeme("chinese","商店|shangdian")?.id).toBe("place.retail-shop");
  expect(visualForLexeme("chinese","书|shu")?.id).toBe("object.book");
  expect(visualForLexeme("chinese","绿茶|lucha")?.id).toBe("beverage.green-tea");
  expect(visualForLexeme("chinese","冬天|dongtian")?.id).toBe("season.winter-snow");
  expect(visualForLexeme("chinese","看书|kanshu")?.id).toBe("action.read-book");
  expect(visualForLexeme("chinese","写字|xiezi")?.id).toBe("action.write-with-pencil");
  expect(visualForLexeme("chinese","吃饭|chifan")?.id).toBe("action.eat-food");
  expect(visualForLexeme("chinese","喝水|heshui")?.id).toBe("action.drink-from-cup");
  expect(visualForLexeme("chinese","水果|shuiguo")?.id).toBe("food.mixed-fruit");
  expect(visualForLexeme("chinese","汽车|qiche")?.id).toBe("vehicle.car");
  expect(visualForLexeme("chinese","火车|huoche")?.id).toBe("vehicle.train");
  expect(visualForLexeme("chinese","飞机|feiji")?.id).toBe("vehicle.airplane");
  expect(visualForLexeme("chinese","学生|xuesheng")?.id).toBe("person.student-with-book");
 });
 it("fails closed without approved language/sense, avoiding translating lexical homographs",()=>{
  expect(visualForConcept("food.apple")?.alt).toContain("apple");
  expect(visualAssetPath("food.apple")).toBe("assets/apple.svg");
  expect(visualForLexeme("french","pomme")).toBeNull();
  expect(visualForLexeme("chinese","苹果|pingguo")).toBeNull();
  expect(visualForLexeme("chinese","茶|cha")).toBeNull();
  expect(visualForLexeme("japanese","lex-nonexistent")).toBeNull();
  expect(visualAssetPath("../secret")).toBeNull();
 });
 it("rejects invalid, duplicated and ambiguous sense-specific mappings",()=>{
  const a={languageId:"french",lexemeId:"source:example",conceptId:"food.apple"};
  expect(validateVisualBindings([a,a])).toContain("Duplicate binding: french:source:example");
  expect(validateVisualBindings([{...a,conceptId:"missing"}])).toContain("Unknown concept: missing");
  expect(visualForLexeme("french",a.lexemeId,[a,{...a,conceptId:"food.bread",senseId:"b"}])).toBeNull();
  expect(visualForLexeme("french",a.lexemeId,[a,{...a,conceptId:"food.bread",senseId:"b"}],"b")?.id).toBe("food.bread");
 });
 it("maps six verified French original U28 lexeme IDs without using generic translations",()=>{
  const base="fru1:original@unified-u1-original-v1:session:u6-";
  expect(visualForLexeme("french",base+"a1-02#vocab-08")?.id).toBe("person.student-with-book");
  expect(visualForLexeme("french",base+"a1-02#vocab-09")?.id).toBe("person.student-with-book");
  expect(visualForLexeme("french",base+"a1-02#vocab-10")?.id).toBe("person.teacher-at-board");
  expect(visualForLexeme("french",base+"a1-03#vocab-01")?.id).toBe("object.book");
  expect(visualForLexeme("french",base+"a1-03#vocab-04")?.id).toBe("place.school");
  expect(visualForLexeme("french",base+"a1-03#vocab-05")?.id).toBe("object.handled-bag");
  expect(visualForLexeme("french","livre")).toBeNull();
 });
 it("exposes opt-in lazy local image attributes, never a picture during independent recall",()=>{
  const reference=localVocabularyImage({languageId:"japanese",lexemeId:"lex-ringo",usage:"reference"});
  expect(reference).toEqual({src:"/visual-lexicon/assets/apple.svg",alt:"Illustration of a red apple",
    conceptId:"food.apple",width:320,height:240,loading:"lazy",decoding:"async"});
  expect(localVocabularyImage({languageId:"chinese",lexemeId:"书|shu",usage:"introduction",assetBase:"./visual-lexicon"})?.src)
    .toBe("./visual-lexicon/assets/book.svg");
  expect(localVocabularyImage({languageId:"french",lexemeId:"fru1:original@unified-u1-original-v1:session:u6-a1-03#vocab-01",usage:"guided-practice"})?.conceptId)
    .toBe("object.book");
  expect(localVocabularyImage({languageId:"japanese",lexemeId:"lex-ringo",usage:"independent-recall"})).toBeNull();
  expect(localVocabularyImage({languageId:"chinese",lexemeId:"苹果|pingguo",usage:"reference"})).toBeNull();
  for(const base of ["https://remote.example","//remote","../up","/a/../b","/a?q=x","javascript:x","/double//slash"])
    expect(localVocabularyImage({languageId:"japanese",lexemeId:"lex-ringo",usage:"reference",assetBase:base})).toBeNull();
 });
 it("declares standalone compiled JavaScript and local offline assets in the package",()=>{
  const manifest=JSON.parse(readFileSync(new URL("../packages/visual-lexicon/package.json",import.meta.url),"utf8"));
  expect(manifest.exports["."].import).toBe("./dist/index.js");
  expect(manifest.files).toContain("assets/**");
  expect(manifest.files).toContain("scripts/**");
  expect(manifest.exports["./consumer"].import).toBe("./dist/consumer.js");
  expect(manifest.exports["./french-bindings"].import).toBe("./dist/french.js");
  expect(manifest.scripts.build).toContain("write-manifest.mjs");
  expect(manifest.scripts["copy:assets"]).toContain("copy-assets.mjs");
 });
});
