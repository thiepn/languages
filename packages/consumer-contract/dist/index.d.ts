export interface ReadOnlyAuthorityMatrix {
  readonly content: "consumer";
  readonly learnerState: "consumer";
  readonly studyEvents: "consumer";
  readonly memory: "consumer";
  readonly mastery: "consumer";
  readonly proficiency: "consumer";
  readonly orchestration: "consumer";
  readonly sync: "consumer";
}

export interface ConsumerBaseline {
  readonly appId: string;
  readonly languageId: string;
  readonly repository: string;
  readonly repositoryRevision: string;
  readonly sourceFingerprint: string;
  readonly appVersion?: string;
  readonly contentVersion?: string;
}

export interface ReadOnlyConsumerDescriptor {
  readonly schema: "thiepn-language-consumer-compatibility";
  readonly schemaVersion: 1;
  readonly platformPackageVersion: string;
  readonly platformContractVersion: string;
  readonly appId: string;
  readonly languageId: string;
  readonly integrationMode: "read-only";
  readonly consumerRevision: string;
  readonly baselineRevision: string | null;
  readonly baselineCompatible: boolean;
  readonly authority: ReadOnlyAuthorityMatrix;
  readonly capabilities: {
    readonly sharedDomainReadable: true;
    readonly sharedCompatibilityReadable: true;
    readonly sharedStateAuthoritative: false;
    readonly consumerWritesSharedState: false;
    readonly consumerUsesSharedScheduler: false;
    readonly consumerUsesSharedMastery: false;
    readonly consumerUsesSharedPromotion: false;
  };
}

export declare const LANGUAGE_PLATFORM_PACKAGE_VERSION: "0.7.0";
export declare const LANGUAGE_PLATFORM_CONTRACT_VERSION: "p7-readonly-v1";
export declare const LANGUAGE_PLATFORM_BASELINES: Readonly<Record<string, ConsumerBaseline>>;
export declare const READ_ONLY_AUTHORITY: ReadOnlyAuthorityMatrix;

export declare function createReadOnlyConsumerDescriptor(input: {
  readonly appId: string;
  readonly languageId: string;
  readonly consumerRevision: string;
}): ReadOnlyConsumerDescriptor;

export declare function validateReadOnlyConsumerDescriptor(
  value: unknown
): { readonly ok: boolean; readonly issues: readonly string[] };

export declare function isBaselineRevisionCompatible(
  appId: string,
  revision: string
): boolean;
