import { describe, expect, it } from "vitest";
import { LanguageRegistry, validateLanguageDefinition } from "../packages/language-registry/src/index.js";
import { frenchLanguagePack } from "../languages/french/manifest.js";
import { japaneseLanguagePack } from "../languages/japanese/manifest.js";

describe("language-pack contract", () => {
  it("accepts French and Japanese through the same manifest validator", () => {
    expect(validateLanguageDefinition(frenchLanguagePack.definition)).toEqual([]);
    expect(validateLanguageDefinition(japaneseLanguagePack.definition)).toEqual([]);
  });

  it("allows language-specific modules without placing them in core", () => {
    const frenchModules = frenchLanguagePack.definition.modules.map((module) => module.id);
    const japaneseModules = japaneseLanguagePack.definition.modules.map((module) => module.id);

    expect(frenchModules).toContain("conjugation");
    expect(frenchModules).not.toContain("kanji");
    expect(japaneseModules).toContain("kanji");
    expect(japaneseModules).toContain("kana");
    expect(japaneseModules).not.toContain("liaison");
  });

  it("registers multiple languages and rejects duplicate identities", () => {
    const registry = new LanguageRegistry();
    registry.register(frenchLanguagePack.definition);
    registry.register(japaneseLanguagePack.definition);

    expect(registry.list().map((language) => language.id)).toEqual(["french", "japanese"]);
    expect(() => registry.register(frenchLanguagePack.definition)).toThrow(/already registered/);
  });
});
