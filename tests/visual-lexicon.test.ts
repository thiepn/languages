import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {VISUAL_CONCEPTS,JAPANESE_VISUAL_BINDINGS,CHINESE_VISUAL_BINDINGS,visualForConcept,visualForLexeme,visualAssetPath,validateVisualBindings} from "../packages/visual-lexicon/src/index.js";

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
  expect(CHINESE_VISUAL_BINDINGS).toHaveLength(12);
  const all=[...JAPANESE_VISUAL_BINDINGS,...CHINESE_VISUAL_BINDINGS];
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
 it("declares standalone compiled JavaScript and local offline assets in the package",()=>{
  const manifest=JSON.parse(readFileSync(new URL("../packages/visual-lexicon/package.json",import.meta.url),"utf8"));
  expect(manifest.exports["."].import).toBe("./dist/index.js");
  expect(manifest.files).toContain("assets/**");
  expect(manifest.scripts.build).toContain("write-manifest.mjs");
  expect(manifest.scripts["copy:assets"]).toContain("copy-assets.mjs");
 });
});
