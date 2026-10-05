export const LANGUAGE_READ_MODEL_PACKAGE_VERSION = "0.8.0";
export const LANGUAGE_READ_MODEL_VERSION = "p8-read-model-v1";
export const LANGUAGE_HUB_DATA_PLANE_VERSION = "p8-hub-data-plane-v1";

const ENROLLMENT = new Set(["active","paused","completed","inactive"]);
const PROFICIENCY_CLAIMS = new Set(["internal","external","none"]);
const NEXT_ACTION_KINDS = new Set([
  "study","review","learn","practice","course","assessment","immerse","maintain","none"
]);
const FORBIDDEN_KEYS = new Set([
  "studyEvents","memoryTraces","rawEvents","rawStudyEvents","answers",
  "responses","recordings","rawContent","privateDocuments","privateVocabulary",
  "privateSentences","accountId","userId"
]);

export function createLanguageReadModel(input) {
  const generatedAt = iso(input?.generatedAt ?? new Date().toISOString(),"generatedAt");
  const appId = requiredString(input?.appId,"appId");
  const languageId = requiredString(input?.languageId,"languageId");
  const producerRevision = requiredString(input?.producerRevision,"producerRevision");
  const enrollmentStatus = String(input?.enrollment?.status ?? "active");

  if (!ENROLLMENT.has(enrollmentStatus)) {
    throw new Error("INVALID_ENROLLMENT_STATUS");
  }

  const model = {
    schema: "thiepn-language-read-model",
    schemaVersion: 1,
    readModelVersion: LANGUAGE_READ_MODEL_VERSION,
    packageVersion: LANGUAGE_READ_MODEL_PACKAGE_VERSION,
    generatedAt,
    appId,
    languageId,
    producerRevision,
    presentation: {
      displayName: requiredString(input?.presentation?.displayName ?? languageId,"displayName"),
      ...(optionalString(input?.presentation?.nativeName) ? {nativeName: optionalString(input.presentation.nativeName)} : {}),
      ...(optionalString(input?.presentation?.appRoute) ? {appRoute: optionalString(input.presentation.appRoute)} : {})
    },
    enrollment: {
      status: enrollmentStatus,
      ...(optionalString(input?.enrollment?.startedAt) ? {startedAt: iso(input.enrollment.startedAt,"startedAt")} : {}),
      ...(optionalString(input?.enrollment?.targetBand) ? {targetBand: optionalString(input.enrollment.targetBand)} : {})
    },
    workload: normalizeWorkload(input?.workload),
    activity: normalizeActivity(input?.activity),
    progress: normalizeProgress(input?.progress),
    proficiency: normalizeProficiency(input?.proficiency),
    nextAction: normalizeNextAction(input?.nextAction),
    source: normalizeSource(input?.source)
  };

  const validation = validateLanguageReadModel(model);
  if (!validation.ok) {
    throw new Error("INVALID_LANGUAGE_READ_MODEL:" + validation.issues.join("|"));
  }
  return deepFreeze(model);
}

export function validateLanguageReadModel(value) {
  const issues = [];
  if (!value || typeof value !== "object") {
    return {ok:false,issues:["read model must be an object"]};
  }
  if (value.schema !== "thiepn-language-read-model") issues.push("unexpected schema");
  if (value.schemaVersion !== 1) issues.push("unsupported schema version");
  if (value.readModelVersion !== LANGUAGE_READ_MODEL_VERSION) issues.push("unexpected read model version");
  if (!validIso(value.generatedAt)) issues.push("generatedAt must be ISO timestamp");
  for (const key of ["appId","languageId","producerRevision"]) {
    if (!String(value[key] ?? "").trim()) issues.push(key + " is required");
  }
  if (!ENROLLMENT.has(value.enrollment?.status)) issues.push("invalid enrollment status");
  validateNonNegative(issues,value.workload?.dueItems,"workload.dueItems");
  validateNonNegative(issues,value.workload?.newItems,"workload.newItems");
  validateNonNegative(issues,value.workload?.practiceItems,"workload.practiceItems");
  validateNonNegative(issues,value.workload?.courseItems,"workload.courseItems");
  validateNonNegative(issues,value.workload?.totalItems,"workload.totalItems");
  if (value.workload?.estimatedMinutes != null) {
    validateNonNegative(issues,value.workload.estimatedMinutes,"workload.estimatedMinutes");
  }
  validateNonNegative(issues,value.activity?.todayEvents,"activity.todayEvents");
  validateNonNegative(issues,value.activity?.sevenDayEvents,"activity.sevenDayEvents");
  validateNonNegative(issues,value.activity?.streakDays,"activity.streakDays");
  if (value.activity?.lastStudiedAt != null && !validIso(value.activity.lastStudiedAt)) {
    issues.push("activity.lastStudiedAt must be ISO timestamp or null");
  }
  if (!PROFICIENCY_CLAIMS.has(value.proficiency?.claim ?? "none")) {
    issues.push("invalid proficiency claim");
  }
  for (const dimension of value.proficiency?.dimensions ?? []) {
    if (!String(dimension?.id ?? "").trim()) issues.push("proficiency dimension id required");
    if (dimension?.score != null && !ratio(dimension.score)) issues.push("proficiency dimension score out of range");
    if (dimension?.confidence != null && !ratio(dimension.confidence)) issues.push("proficiency dimension confidence out of range");
    if (dimension?.evidenceCount != null) validateNonNegative(issues,dimension.evidenceCount,"proficiency dimension evidenceCount");
  }
  const action = value.nextAction;
  if (!NEXT_ACTION_KINDS.has(action?.kind ?? "none")) issues.push("invalid next action kind");
  if (!Number.isFinite(action?.priority) || action.priority < 0 || action.priority > 100) {
    issues.push("nextAction.priority must be 0..100");
  }
  rejectForbidden(value,issues,"");
  return {ok:issues.length===0,issues};
}

export function buildHubLanguageDataPlane(models, options={}) {
  const now = new Date(options.now ?? Date.now());
  if (!Number.isFinite(now.getTime())) throw new Error("INVALID_HUB_NOW");
  const maxAgeMs = finite(options.maxAgeMs, 6*60*60*1000);
  const accepted = [];
  const rejected = [];

  for (const candidate of Array.isArray(models) ? models : []) {
    const validation = validateLanguageReadModel(candidate);
    if (!validation.ok) {
      rejected.push({
        appId: String(candidate?.appId ?? "unknown"),
        languageId: String(candidate?.languageId ?? "unknown"),
        issues: validation.issues
      });
      continue;
    }
    const ageMs = Math.max(0, now.getTime() - new Date(candidate.generatedAt).getTime());
    accepted.push({
      ...candidate,
      hubFreshness: ageMs <= maxAgeMs ? "fresh" : "stale",
      ageMs
    });
  }

  const active = accepted.filter((model)=>model.enrollment.status==="active");
  const actionable = active
    .filter((model)=>model.hubFreshness==="fresh" && model.nextAction.kind!=="none")
    .sort((a,b)=>
      b.nextAction.priority-a.nextAction.priority ||
      b.workload.dueItems-a.workload.dueItems ||
      a.presentation.displayName.localeCompare(b.presentation.displayName)
    );

  return deepFreeze({
    schema: "thiepn-language-hub-data-plane",
    schemaVersion: 1,
    dataPlaneVersion: LANGUAGE_HUB_DATA_PLANE_VERSION,
    generatedAt: now.toISOString(),
    languages: accepted,
    rejected,
    summary: {
      activeLanguages: active.length,
      staleLanguages: accepted.filter((model)=>model.hubFreshness==="stale").length,
      dueItems: active.reduce((sum,model)=>sum+model.workload.dueItems,0),
      plannedItems: active.reduce((sum,model)=>sum+model.workload.totalItems,0),
      todayEvents: active.reduce((sum,model)=>sum+model.activity.todayEvents,0),
      ...(active.every((model)=>model.workload.estimatedMinutes != null)
        ? {estimatedMinutes: active.reduce((sum,model)=>sum+(model.workload.estimatedMinutes ?? 0),0)}
        : {})
    },
    nextLanguageAction: actionable.length ? {
      appId: actionable[0].appId,
      languageId: actionable[0].languageId,
      presentation: actionable[0].presentation,
      action: actionable[0].nextAction
    } : null,
    comparisonPolicy: {
      aggregatesWorkloadCounts: true,
      aggregatesActivityCounts: true,
      averagesMastery: false,
      averagesProficiency: false,
      convertsFrameworkBands: false,
      recomputesNextAction: false
    }
  });
}

export function serializeLanguageReadModel(model) {
  const validation = validateLanguageReadModel(model);
  if (!validation.ok) throw new Error("INVALID_LANGUAGE_READ_MODEL:" + validation.issues.join("|"));
  return JSON.stringify(model);
}

export function parseLanguageReadModel(serialized) {
  return createLanguageReadModel(JSON.parse(serialized));
}

function normalizeWorkload(value={}) {
  const dueItems = nonNegative(value?.dueItems);
  const newItems = nonNegative(value?.newItems);
  const practiceItems = nonNegative(value?.practiceItems);
  const courseItems = nonNegative(value?.courseItems);
  const totalItems = value?.totalItems == null
    ? dueItems+newItems+practiceItems+courseItems
    : nonNegative(value.totalItems);
  return {
    dueItems,newItems,practiceItems,courseItems,totalItems,
    ...(value?.estimatedMinutes != null ? {estimatedMinutes: nonNegative(value.estimatedMinutes)} : {})
  };
}
function normalizeActivity(value={}) {
  return {
    todayEvents: nonNegative(value?.todayEvents),
    sevenDayEvents: nonNegative(value?.sevenDayEvents),
    streakDays: nonNegative(value?.streakDays),
    ...(value?.lastStudiedAt ? {lastStudiedAt: iso(value.lastStudiedAt,"lastStudiedAt")} : {lastStudiedAt:null})
  };
}
function normalizeProgress(value={}) {
  const metrics = Array.isArray(value?.metrics) ? value.metrics.map((metric)=>{
    const current = finite(metric?.current,0);
    const total = metric?.total == null ? undefined : finite(metric.total,0);
    return {
      id: requiredString(metric?.id,"progress metric id"),
      label: requiredString(metric?.label ?? metric?.id,"progress metric label"),
      current,
      ...(total != null ? {total} : {}),
      ...(optionalString(metric?.unit) ? {unit: optionalString(metric.unit)} : {})
    };
  }) : [];
  return {metrics};
}
function normalizeProficiency(value={}) {
  const claim = String(value?.claim ?? "none");
  if (!PROFICIENCY_CLAIMS.has(claim)) throw new Error("INVALID_PROFICIENCY_CLAIM");
  return {
    framework: requiredString(value?.framework ?? "unspecified","proficiency framework"),
    claim,
    ...(optionalString(value?.currentBand) ? {currentBand: optionalString(value.currentBand)} : {}),
    ...(optionalString(value?.frontierBand) ? {frontierBand: optionalString(value.frontierBand)} : {}),
    maintenanceNeeded: value?.maintenanceNeeded === true,
    dimensions: Array.isArray(value?.dimensions) ? value.dimensions.map((dimension)=>({
      id: requiredString(dimension?.id,"proficiency dimension id"),
      label: requiredString(dimension?.label ?? dimension?.id,"proficiency dimension label"),
      ...(dimension?.score != null ? {score: clampRatio(dimension.score)} : {}),
      ...(dimension?.confidence != null ? {confidence: clampRatio(dimension.confidence)} : {}),
      ...(optionalString(dimension?.band) ? {band: optionalString(dimension.band)} : {}),
      ...(dimension?.evidenceCount != null ? {evidenceCount: nonNegative(dimension.evidenceCount)} : {})
    })) : []
  };
}
function normalizeNextAction(value={}) {
  const kind = String(value?.kind ?? "none");
  if (!NEXT_ACTION_KINDS.has(kind)) throw new Error("INVALID_NEXT_ACTION_KIND");
  return {
    id: requiredString(value?.id ?? "none","next action id"),
    label: requiredString(value?.label ?? "No action","next action label"),
    kind,
    priority: Math.max(0,Math.min(100,finite(value?.priority,0))),
    ...(optionalString(value?.reason) ? {reason: optionalString(value.reason)} : {}),
    ...(optionalString(value?.route) ? {route: optionalString(value.route)} : {})
  };
}
function normalizeSource(value={}) {
  return {
    authority: "consumer",
    ...(optionalString(value?.stateRevision) ? {stateRevision: optionalString(value.stateRevision)} : {}),
    ...(optionalString(value?.contentVersion) ? {contentVersion: optionalString(value.contentVersion)} : {})
  };
}
function rejectForbidden(value,issues,path) {
  if (!value || typeof value !== "object") return;
  for (const [key,nested] of Object.entries(value)) {
    const next = path ? path+"."+key : key;
    if (FORBIDDEN_KEYS.has(key)) issues.push("forbidden raw/private field: "+next);
    if (nested && typeof nested === "object") rejectForbidden(nested,issues,next);
  }
}
function requiredString(value,name) {
  const text = String(value ?? "").trim();
  if (!text) throw new Error("MISSING_"+String(name).toUpperCase().replace(/[^A-Z0-9]+/g,"_"));
  return text;
}
function optionalString(value) {
  const text=String(value ?? "").trim();
  return text || undefined;
}
function iso(value,name) {
  const date=new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error("INVALID_"+String(name).toUpperCase());
  return date.toISOString();
}
function validIso(value) {
  if (typeof value!=="string" || !value) return false;
  return Number.isFinite(new Date(value).getTime());
}
function finite(value,fallback=0) {
  const number=Number(value);
  return Number.isFinite(number) ? number : fallback;
}
function nonNegative(value) {
  return Math.max(0,finite(value,0));
}
function ratio(value) {
  return Number.isFinite(Number(value)) && Number(value)>=0 && Number(value)<=1;
}
function clampRatio(value) {
  return Math.max(0,Math.min(1,finite(value,0)));
}
function validateNonNegative(issues,value,path) {
  if (!Number.isFinite(Number(value)) || Number(value)<0) issues.push(path+" must be non-negative");
}
function deepFreeze(value) {
  if (!value || typeof value!=="object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const nested of Object.values(value)) deepFreeze(nested);
  return value;
}
