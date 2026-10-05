import {
  buildHubLanguageDataPlane,
  type HubLanguageDataPlane,
  type LanguageReadModel
} from "@thiepn/language-read-model";

export interface HubLanguageCard {
  readonly appId: string;
  readonly languageId: string;
  readonly displayName: string;
  readonly nativeName?: string;
  readonly appRoute?: string;
  readonly freshness: "fresh" | "stale";
  readonly enrollmentStatus: LanguageReadModel["enrollment"]["status"];
  readonly dueItems: number;
  readonly totalItems: number;
  readonly todayEvents: number;
  readonly streakDays: number;
  readonly progressMetrics: LanguageReadModel["progress"]["metrics"];
  readonly proficiency: LanguageReadModel["proficiency"];
  readonly nextAction: LanguageReadModel["nextAction"];
}

export interface HubHomeReadModel {
  readonly dataPlane: HubLanguageDataPlane;
  readonly cards: readonly HubLanguageCard[];
  readonly nextAction: HubLanguageDataPlane["nextLanguageAction"];
}

export function buildHubHomeReadModel(
  snapshots: readonly unknown[],
  options?: { readonly now?: string | number | Date; readonly maxAgeMs?: number }
): HubHomeReadModel {
  const dataPlane = buildHubLanguageDataPlane(snapshots, options);

  const cards: HubLanguageCard[] = dataPlane.languages.map((language) => ({
    appId: language.appId,
    languageId: language.languageId,
    displayName: language.presentation.displayName,
    ...(language.presentation.nativeName
      ? { nativeName: language.presentation.nativeName }
      : {}),
    ...(language.presentation.appRoute
      ? { appRoute: language.presentation.appRoute }
      : {}),
    freshness: language.hubFreshness,
    enrollmentStatus: language.enrollment.status,
    dueItems: language.workload.dueItems,
    totalItems: language.workload.totalItems,
    todayEvents: language.activity.todayEvents,
    streakDays: language.activity.streakDays,
    progressMetrics: language.progress.metrics,
    proficiency: language.proficiency,
    nextAction: language.nextAction
  }));

  return {
    dataPlane,
    cards,
    nextAction: dataPlane.nextLanguageAction
  };
}
