# P7 Integrated Consumer Baseline

This file records the first completed read-only consumer integration after the P7 package was merged.

## Platform contract

- repository: `thiepn/languages`
- package commit consumed by both apps: `56bb7fda23ca179ae233cbc8d6f1c17b2f8cbc49`
- package version: `0.7.0`
- contract version: `p7-readonly-v1`

The consumer package commit is immutable.

## Two revisions are tracked intentionally

P7 separates:

1. **source baseline revision** — the production app revision P6 audited before adding the P7 compatibility glue;
2. **tracked repository revision** — the current app head after the read-only integration was merged.

This avoids a circular dependency where updating the platform baseline would require updating the consumer package pin, which would itself change the consumer head again.

The P7 package descriptor continues to describe the audited source baseline.

The cross-repository drift watch follows the current integrated consumer head and its critical file fingerprints.

## French

Audited source baseline:

`28a39ce1c59ab02301b408f016522dbddc28d0c0`

Integrated repository head:

`9ae75de4cb05fe781066e7d916f4325e991f256b`

Integration adds only:

- the vendored P7 browser compatibility artifact;
- read-only descriptor creation;
- boot-time authority validation;
- service-worker caching of that artifact;
- a smoke-test workflow and documentation.

French remains authoritative for all learning behavior.

## Japanese

Audited source baseline:

`45d03f5b027bdb36fcf5a7f7df3c063e1ba09893`

Integrated repository head:

`984d897cc99fe070089f9257f07a16eef82a8123`

Integration adds only:

- a Git dependency pinned to the P7 platform commit;
- a read-only compatibility descriptor;
- a release-operations diagnostic;
- authority regression tests.

The existing Japanese content seeds are unchanged from the P6 audit.

Japanese remains authoritative for all learning behavior.

## Drift-watch rule

The compatibility watch now verifies the integrated heads and both kinds of critical fingerprint:

- language/content files whose change may invalidate P6/P7 assumptions;
- P7 integration files whose change may remove or alter the read-only contract.

A future head change is a review trigger, not an automatic compatibility failure in product semantics.
