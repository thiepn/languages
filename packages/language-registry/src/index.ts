export type TextDirection = "ltr" | "rtl" | "mixed";

export interface ScriptDefinition {
  readonly id: string;
  readonly name: string;
  readonly direction: TextDirection;
  readonly primary?: boolean;
}

export type FrameworkRole = "primary" | "mapping" | "exam_overlay";

export interface ProficiencyFrameworkDefinition {
  readonly id: string;
  readonly name: string;
  readonly role: FrameworkRole;
  readonly levels: readonly string[];
}

export interface LanguageModuleDefinition {
  readonly id: string;
  readonly required: boolean;
  readonly description?: string;
}

export interface LinguisticAdapterRef {
  readonly capability: "segmentation" | "morphology" | "transliteration" | "pronunciation" | "sorting" | "input";
  readonly adapterId: string;
  readonly required: boolean;
}

export interface LanguageDefinition {
  readonly schemaVersion: 1;
  readonly id: string;
  readonly languageTag: string;
  readonly displayName: string;
  readonly nativeName: string;
  readonly scripts: readonly ScriptDefinition[];
  readonly frameworks: readonly ProficiencyFrameworkDefinition[];
  readonly primaryFrameworkId: string;
  readonly modules: readonly LanguageModuleDefinition[];
  readonly adapters: readonly LinguisticAdapterRef[];
}

export interface LanguagePackManifest {
  readonly schemaVersion: 1;
  readonly packVersion: string;
  readonly definition: LanguageDefinition;
  readonly contentPackageId: string;
  readonly contentSchemaVersion: number;
}

export interface ManifestIssue {
  readonly severity: "error" | "warning";
  readonly code: string;
  readonly message: string;
}

function duplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

export function validateLanguageDefinition(definition: LanguageDefinition): ManifestIssue[] {
  const issues: ManifestIssue[] = [];

  if (!/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/.test(definition.languageTag)) {
    issues.push({
      severity: "error",
      code: "invalid-language-tag",
      message: `${definition.languageTag} is not an accepted platform language-tag shape`
    });
  }

  if (definition.scripts.length === 0) {
    issues.push({ severity: "error", code: "missing-script", message: "At least one script is required" });
  }

  for (const id of duplicateValues(definition.scripts.map((script) => script.id))) {
    issues.push({ severity: "error", code: "duplicate-script", message: `Duplicate script: ${id}` });
  }

  for (const id of duplicateValues(definition.frameworks.map((framework) => framework.id))) {
    issues.push({ severity: "error", code: "duplicate-framework", message: `Duplicate framework: ${id}` });
  }

  for (const id of duplicateValues(definition.modules.map((module) => module.id))) {
    issues.push({ severity: "error", code: "duplicate-module", message: `Duplicate module: ${id}` });
  }

  const primary = definition.frameworks.find((framework) => framework.id === definition.primaryFrameworkId);
  if (!primary) {
    issues.push({
      severity: "error",
      code: "missing-primary-framework",
      message: `Primary framework ${definition.primaryFrameworkId} is not registered`
    });
  } else if (primary.role !== "primary") {
    issues.push({
      severity: "error",
      code: "invalid-primary-framework-role",
      message: `Primary framework ${primary.id} must have role "primary"`
    });
  }

  const adapterCapabilities = definition.adapters.map((adapter) => adapter.capability);
  for (const capability of duplicateValues(adapterCapabilities)) {
    issues.push({
      severity: "error",
      code: "duplicate-adapter-capability",
      message: `Only one adapter may own capability ${capability} in P1`
    });
  }

  return issues;
}

export class LanguageRegistry {
  readonly #definitions = new Map<string, LanguageDefinition>();

  register(definition: LanguageDefinition): void {
    const errors = validateLanguageDefinition(definition).filter((issue) => issue.severity === "error");
    if (errors.length > 0) {
      throw new Error(errors.map((issue) => `${issue.code}: ${issue.message}`).join("; "));
    }
    if (this.#definitions.has(definition.id)) {
      throw new Error(`Language already registered: ${definition.id}`);
    }
    this.#definitions.set(definition.id, definition);
  }

  get(languageId: string): LanguageDefinition | undefined {
    return this.#definitions.get(languageId);
  }

  list(): readonly LanguageDefinition[] {
    return [...this.#definitions.values()];
  }
}
