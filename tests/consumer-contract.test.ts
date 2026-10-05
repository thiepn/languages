import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  LANGUAGE_PLATFORM_BASELINES,
  LANGUAGE_PLATFORM_CONTRACT_VERSION,
  LANGUAGE_PLATFORM_PACKAGE_VERSION,
  createReadOnlyConsumerDescriptor,
  isBaselineRevisionCompatible,
  validateReadOnlyConsumerDescriptor
} from "../packages/consumer-contract/dist/index.js";

describe("P7 consumer distribution contract", () => {
  it("exposes a versioned zero-dependency read-only contract", () => {
    expect(LANGUAGE_PLATFORM_PACKAGE_VERSION).toBe("0.7.0");
    expect(LANGUAGE_PLATFORM_CONTRACT_VERSION).toBe("p7-readonly-v1");

    const descriptor = createReadOnlyConsumerDescriptor({
      appId: "japanese",
      languageId: "japanese",
      consumerRevision:
        "45d03f5b027bdb36fcf5a7f7df3c063e1ba09893"
    });

    expect(descriptor.integrationMode).toBe("read-only");
    expect(descriptor.baselineCompatible).toBe(true);
    expect(descriptor.authority.memory).toBe("consumer");
    expect(descriptor.capabilities.sharedStateAuthoritative).toBe(false);
    expect(descriptor.capabilities.consumerUsesSharedScheduler).toBe(false);
    expect(validateReadOnlyConsumerDescriptor(descriptor)).toEqual({
      ok: true,
      issues: []
    });
  });

  it("fails closed if an integration descriptor attempts authority transfer", () => {
    const descriptor = {
      ...createReadOnlyConsumerDescriptor({
        appId: "french",
        languageId: "french",
        consumerRevision:
          "28a39ce1c59ab02301b408f016522dbddc28d0c0"
      }),
      authority: {
        ...createReadOnlyConsumerDescriptor({
          appId: "french",
          languageId: "french",
          consumerRevision:
            "28a39ce1c59ab02301b408f016522dbddc28d0c0"
        }).authority,
        memory: "platform"
      }
    };

    const result = validateReadOnlyConsumerDescriptor(descriptor);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.includes("memory"))).toBe(true);
  });

  it("keeps runtime baselines synchronized with the checked-in compatibility registry", async () => {
    const raw = await readFile(
      new URL("../contracts/p7-consumer-baselines.json", import.meta.url),
      "utf8"
    );
    const registry = JSON.parse(raw);

    expect(registry.platformPackageVersion).toBe(
      LANGUAGE_PLATFORM_PACKAGE_VERSION
    );
    expect(registry.platformContractVersion).toBe(
      LANGUAGE_PLATFORM_CONTRACT_VERSION
    );

    for (const consumer of registry.consumers) {
      const runtime = LANGUAGE_PLATFORM_BASELINES[consumer.appId];
      expect(runtime).toBeDefined();
      if (!runtime) throw new Error("MISSING_RUNTIME_BASELINE:" + consumer.appId);
      expect(runtime.repository).toBe(consumer.repository);
      expect(runtime.repositoryRevision).toBe(consumer.repositoryRevision);
      expect(
        isBaselineRevisionCompatible(
          consumer.appId,
          consumer.repositoryRevision
        )
      ).toBe(true);
    }
  });

  it("ships the browser artifact from the same contract version", async () => {
    const browser = await readFile(
      new URL(
        "../packages/consumer-contract/dist/browser.js",
        import.meta.url
      ),
      "utf8"
    );

    expect(browser).toContain('const packageVersion="0.7.0"');
    expect(browser).toContain('const contractVersion="p7-readonly-v1"');
    expect(browser).toContain("sharedStateAuthoritative:false");
    expect(browser).toContain("consumerWritesSharedState:false");
  });
});
