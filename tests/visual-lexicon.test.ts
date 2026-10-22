import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import {VISUAL_CONCEPTS,JAPANESE_VISUAL_BINDINGS,CHINESE_VISUAL_BINDINGS,visualForConcept,visualForLexeme,visualAssetPath,validateVisualBindings} from "../packages/visual-lexicon/src/index.js";

describe("first-party shared visual lexicon",()=>{
 it("ships 19 byte-verified original local SVGs with stable semantic concept identities",()=>{
  expect(VISUAL_CONCEPTS).toHaveLength(19);
  expect(new Set(VISUAL_CONCEPTS.map(x=>x.id)).size).toBe(19);
  expect(new Set(VISUAL_CONCEPTS.map(x=>x.asset)).size).toBe(19);
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
 it("preserves 19 authentic Japanese lexeme IDs and one attested Chinese canonical key",()=>{
  expect(JAPANESE_VISUAL_BINDINGS).toHaveLength(19);
  expect(CHINESE_VISUAL_BINDINGS).toHaveLength(1);
  expect(validateVisualBindings([...JAPANESE_VISUAL_BINDINGS,...CHINESE_VISUAL_BINDINGS])).toEqual([]);
  expect(visualForLexeme("japanese","lex-ringo")?.id).toBe("food.apple");
  expect(visualForLexeme("japanese","lex-mizu")?.id).toBe("beverage.water");
  expect(visualForLexeme("chinese","商店|shangdian")?.id).toBe("place.retail-shop");
 });
 it("uses exact sense-approved links rather than automatic translation and leaves missing concepts text-only",()=>{
  expect(visualForConcept("food.apple")?.alt).toContain("apple");
  expect(visualAssetPath("food.apple")).toBe("assets/apple.svg");
  expect(visualForLexeme("french","pomme")).toBeNull();
  expect(visualForLexeme("chinese","苹果|pingguo")).toBeNull();
  expect(visualForLexeme("japanese","lex-nonexistent")).toBeNull();
  expect(visualAssetPath("../secret")).toBeNull();
 });
 it("rejects broken, duplicated and ambiguous sense mappings",()=>{
  const a={languageId:"french",lexemeId:"source:example",conceptId:"food.apple"};
  expect(validateVisualBindings([a,a])).toContain("Duplicate binding: french:source:example");
  expect(validateVisualBindings([{...a,conceptId:"missing"}])).toContain("Unknown concept: missing");
  expect(visualForLexeme("french",a.lexemeId,[a,{...a,conceptId:"food.bread",senseId:"b"}])).toBeNull();
  expect(visualForLexeme("french",a.lexemeId,[a,{...a,conceptId:"food.bread",senseId:"b"}],"b")?.id).toBe("food.bread");
 });
});
