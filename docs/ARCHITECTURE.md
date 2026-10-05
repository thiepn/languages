# THIEPN Languages Architecture

## Purpose

THIEPN Languages is the shared contract and platform layer beneath individual language products. It standardizes evidence, content boundaries, curriculum dependencies and language registration without forcing French, Japanese or future languages into identical pedagogy.

## P1 invariants

1. **One account, many language enrollments.**
2. **Learner evidence is language-namespaced.** An entity identity is never globally meaningful without its language.
3. **Memory, mastery and proficiency are separate concepts.**
4. **Study evidence is append-oriented.** Later phases may derive projections from events; UI state must not become authoritative learning evidence.
5. **Canonical linguistic content, pedagogical sequencing, source material and learner state are separate domains.**
6. **Language-specific capabilities are declared by language packs.** Core code must not accumulate `if (language === "...")` branches.
7. **Curriculum order is a dependency graph.** A flat lesson sequence may be a presentation, not the canonical dependency model.
8. **Course completion is not a proficiency claim.**
9. **External content keeps provenance and licensing policy.**
10. **Existing French and Japanese products remain authoritative until explicit migration phases.**

## Shared vs language-specific

Shared core owns:

- language/account identity
- entity references
- study-event vocabulary
- skill/evidence vocabulary
- mastery and memory contract shapes
- proficiency-evidence shape
- provenance and licensing primitives
- curriculum dependency integrity
- language registration and capability discovery

Language packs own:

- script-specific modules
- morphology behavior
- segmentation behavior
- pronunciation specifics
- transliteration
- writing-system pedagogy
- language-specific curriculum data
- language-specific content fields
- exam overlays and mappings

Examples:

- Japanese may register kana, kanji, furigana and Japanese morphology.
- French may register conjugation, liaison and French morphology.
- Neither concept is hard-coded into the shared registry.

## Proficiency

CEFR is the default cross-language coordinate system, but it is not treated as a universal language syllabus.

Language packs may add:

- language-specific mappings;
- official or unofficial reference-level descriptions;
- exam overlays such as JLPT or DELF/DALF.

An internal level estimate must remain distinguishable from an external examination result.

## Learner evidence

The canonical P1 event shape includes:

- account
- device
- language
- activity
- targets
- skill dimension
- outcome
- support level
- timing/context
- model/content versions

A successful hinted answer therefore remains distinguishable from independent retrieval.

P1 only defines the evidence contract. The production learner model and memory scheduler will be integrated in later phases after compatibility with both existing apps is established.

## Content

Canonical content uses provenance-aware primitives:

- lexeme
- sense
- grammar concept
- sentence
- lexical chunk
- writing unit
- can-do descriptor
- curriculum unit
- audio asset

Generic entities use typed `languageData` extension points rather than adding every language's morphology into the global schema.

## Repository boundary

`thiepn/languages` owns shared contracts and, later, shared implementations.

`thiepn/french` and `thiepn/japanese` remain separately deployable products. They should consume stable shared packages gradually rather than being copied wholesale into this repository.

The future Hub is a consumer of enrollment, progress and recommendation state. It must not create a parallel SRS, mastery model or curriculum.
