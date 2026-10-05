# P7 — Shared Package Distribution, Cross-Repo Compatibility Harness & First Read-Only Integration

Status: **implemented in the platform repository; consumer wiring follows this package merge**

## Objective

Move THIEPN Languages from a shared architecture repository into a consumable platform boundary without transferring authority away from the existing French or Japanese products.

P7 establishes:

- a versioned zero-dependency consumer contract;
- deterministic package distribution;
- exact consumer-revision baselines;
- a scheduled cross-repository drift harness;
- a browser-safe distribution path for the static French app;
- a package-import distribution path for the TypeScript Japanese app;
- explicit read-only authority guarantees.

## Distribution surface

The repository root is versioned as:

```text
@thiepn/languages 0.7.0
```

The first supported consumer export is:

```text
@thiepn/languages/consumer-contract
```

with a browser artifact at:

```text
@thiepn/languages/consumer-contract/browser
```

The consumer contract is intentionally plain JavaScript plus `.d.ts` declarations.

It has no runtime dependency on:

- React;
- Supabase;
- IndexedDB;
- FSRS;
- the learner engine;
- the orchestrator;
- app-specific content.

This is deliberate. P7 integrates the **contract boundary** before integrating shared learning authority.

## Read-only authority matrix

Every valid P7 consumer descriptor says that the existing product remains authoritative for:

| Domain | P7 authority |
| --- | --- |
| Canonical app content | consumer app |
| Learner state | consumer app |
| StudyEvents | consumer app |
| Memory scheduling | consumer app |
| Mastery | consumer app |
| Proficiency/promotion | consumer app |
| Orchestration | consumer app |
| Sync | consumer app |

The platform may be read, inspected and compared.

The P7 contract explicitly forbids:

- shared state becoming authoritative;
- consumer writes into a shared language-state store;
- silently replacing the app scheduler;
- silently replacing app mastery;
- silently replacing promotion logic.

Any descriptor that attempts authority transfer fails validation.

## Consumer baselines

P7 stores exact audited baselines in:

`contracts/p7-consumer-baselines.json`

Initial baselines are the repositories audited by P6:

### French

- repository: `thiepn/french`
- main: `28a39ce1c59ab02301b408f016522dbddc28d0c0`
- canonical single-file fingerprint: `index.html@dee1b510...`

### Japanese

- repository: `thiepn/japanese`
- main: `45d03f5b027bdb36fcf5a7f7df3c063e1ba09893`
- base seed and all C1 supplement fingerprints are pinned.

These are compatibility baselines, not permanent production locks.

When a consumer moves forward, the drift harness must force an explicit adapter/baseline review rather than silently assuming compatibility.

## Cross-repository compatibility watch

`scripts/check-consumer-compatibility.mjs` checks:

1. the configured consumer branch head;
2. each migration-critical source fingerprint;
3. the expected audited revision.

The corresponding GitHub Actions workflow runs:

- manually;
- once per day.

It is separate from ordinary platform PR verification.

This prevents an unrelated French/Japanese update from making every THIEPN Languages development PR fail, while still providing continuous drift detection.

## Package artifact

On a successful push to `main`, after the normal P1–P7 verification suite passes, CI creates a package artifact:

```text
thiepn-languages-consumer-0.7.0
```

The package is intentionally not automatically published to npm.

This keeps release control explicit while still giving other repositories a deterministic distributable artifact.

Git consumers may also pin a specific THIEPN Languages commit.

## Consumer integration modes

### Japanese

Japanese is a normal TypeScript/pnpm consumer.

The first integration should import the pinned `consumer-contract` package and expose the resulting descriptor through product diagnostics/release operations.

It must not import shared scheduler, mastery, proficiency or orchestrator implementations in P7.

### French

French is still a static/single-file application.

Its first integration uses the exact browser artifact from `packages/consumer-contract/dist/browser.js`, vendored into the repository so:

- the app remains offline-capable;
- boot does not depend on GitHub/CDN availability;
- the artifact can be pinned to a platform commit;
- no package manager/build-system migration is required just to consume P7.

The French app may display/read compatibility metadata, but existing app state remains authoritative.

## Source drift semantics

A revision mismatch is **not** automatically evidence that an app is incompatible.

It means:

```text
consumer changed
      ↓
previous compatibility assumption is stale
      ↓
run adapter/tests/review
      ↓
update baseline if compatible
```

This distinguishes drift detection from compatibility judgment.

## Package scope

P7 deliberately does **not** package the full shared learner platform for immediate consumer authority.

P1–P6 packages remain available inside this repository for platform development.

The stable cross-repo surface starts narrowly with the compatibility contract.

Later phases may expose additional versioned package surfaces after:

- API stability is demonstrated;
- app parity tests exist;
- rollback paths exist;
- authority transfer is explicitly approved.

## Exit criteria

P7 is complete when:

1. a consumer-safe versioned package surface exists;
2. the package can be consumed without compiling the platform monorepo;
3. browser/static and TypeScript consumers both have supported integration paths;
4. every P7 descriptor is explicitly read-only;
5. authority transfer fails validation;
6. exact French/Japanese audited revisions and source fingerprints are recorded;
7. a cross-repo drift harness checks those fingerprints;
8. the drift harness is scheduled independently of normal PR CI;
9. `main` produces a controlled package artifact after verification;
10. French and Japanese each consume the P7 contract without changing authoritative learner behavior.

## Next phase

**P8 — Shared Read Models, Cross-Language Progress Contract & Hub Data Plane**

P8 should define the first standardized data that individual apps may expose upward to the THIEPN Languages Hub: enrollment state, due workload, recent activity, proficiency summaries and next-action summaries.

That data plane should remain read-oriented initially. The Hub must not become a second scheduler, mastery engine or curriculum authority.
