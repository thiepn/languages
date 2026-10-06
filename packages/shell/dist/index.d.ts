import type { LanguageDashboardPayload } from "../../dashboard/dist/index.js";
import type { HubLanguageDataPlane, LanguageReadModel } from "../../read-model/dist/index.js";

export type LanguageShellStatus = "loading" | "signed-out" | "ready" | "empty" | "error";
export type LanguageShellConnectivity = "online" | "offline";

export interface LanguageCatalogEntry {
  readonly appId: string;
  readonly languageId: string;
  readonly displayName: string;
  readonly nativeName?: string;
  readonly appRoute: string;
}

export interface LanguageShellCard {
  readonly appId: string;
  readonly languageId: string;
  readonly displayName: string;
  readonly nativeName?: string;
  readonly appRoute?: string;
  readonly continueHref?: string;
  readonly continueLabel: string;
  readonly freshness: "fresh" | "stale";
  readonly enrollmentStatus: LanguageReadModel["enrollment"]["status"];
  readonly targetBand?: string;
  readonly dueItems: number;
  readonly totalItems: number;
  readonly estimatedMinutes?: number;
  readonly todayEvents: number;
  readonly streakDays: number;
  readonly progressMetrics: LanguageReadModel["progress"]["metrics"];
  readonly proficiency: LanguageReadModel["proficiency"];
  readonly visibilityAction: {
    readonly mode: "hide";
    readonly label: "Hide from dashboard";
  };
}

export interface LanguageShellAddEntry extends LanguageCatalogEntry {
  readonly mode: "show" | "open-product";
  readonly actionLabel: string;
}

export interface LanguageShellHero {
  readonly appId: string;
  readonly languageId: string;
  readonly languageLabel: string;
  readonly title: string;
  readonly kind: LanguageReadModel["nextAction"]["kind"];
  readonly reason?: string;
  readonly href?: string;
}

export interface LanguageShellNotice {
  readonly kind: "offline" | "stale" | "error";
  readonly message: string;
}

export interface LanguageShellModel {
  readonly schema: "thiepn-language-shell";
  readonly schemaVersion: 1;
  readonly contractVersion: "p10-shell-v1";
  readonly generatedAt: string;
  readonly status: LanguageShellStatus;
  readonly connectivity: LanguageShellConnectivity;
  readonly nav: readonly {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly active: boolean;
  }[];
  readonly hero: LanguageShellHero | null;
  readonly cards: readonly LanguageShellCard[];
  readonly addLanguages: readonly LanguageShellAddEntry[];
  readonly notices: readonly LanguageShellNotice[];
  readonly summary: HubLanguageDataPlane["summary"] | null;
  readonly errorCode?: string;
}

export type LanguageShellState =
  | { readonly status: "loading" }
  | { readonly status: "signed-out" }
  | { readonly status: "error"; readonly code?: string }
  | { readonly status: "ready"; readonly remote: LanguageDashboardPayload };

export interface BuildLanguageShellOptions {
  readonly state: LanguageShellState;
  readonly catalog?: readonly LanguageCatalogEntry[];
  readonly online?: boolean;
  readonly activeHref?: string;
  readonly now?: string | number | Date;
  readonly maxAgeMs?: number;
}

export declare const LANGUAGE_SHELL_PACKAGE_VERSION: "0.10.0";
export declare const LANGUAGE_SHELL_CONTRACT_VERSION: "p10-shell-v1";
export declare const DEFAULT_LANGUAGE_CATALOG: readonly LanguageCatalogEntry[];
export declare function buildLanguageShellModel(options: BuildLanguageShellOptions): LanguageShellModel;
