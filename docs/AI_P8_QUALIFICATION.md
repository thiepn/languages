# AI P8 — Real-World Languages Qualification

Status: Integration implemented; live production certification pending service credentials and deployment.

## Browser boundary

Language products must call the shared AI pilot through the authenticated Core gateway:

```text
browser
  -> THIEPN Account bearer token
  -> https://api.thiepn.dev/v1/languages/ai/*
  -> Core verifies Account identity
  -> Core signs an internal request as appId=languages
  -> thiepn/ai
  -> GPT-6 Luna
```

The browser must never receive:

- the OpenAI API key;
- the `languages` HMAC app secret;
- Upstash credentials;
- any other server credential.

The shared browser-safe adapter is exported as:

```ts
import { createLanguagesAiClient } from "@thiepn/languages/ai-client";
```

## Available operations

```text
correct()
explain()
generateExercise()
conversation()
```

The client maps these to four fixed Core routes. There is no browser-side generic capability proxy.

## Account requirement

AI features require a current THIEPN Account access token.

Signed-out behavior:

- do not send an AI request;
- return `AUTH_REQUIRED`;
- product UI should offer sign-in rather than a broken retry loop.

## Degraded behavior

AI is an enhancement, not a prerequisite for core study data.

The client exposes stable failure classes:

```text
AUTH_REQUIRED
INVALID_REQUEST
LIMITED
UNAVAILABLE
INVALID_RESPONSE
TIMEOUT
```

Recommended product behavior:

| Error | Product behavior |
| --- | --- |
| AUTH_REQUIRED | Offer sign-in |
| INVALID_REQUEST | Preserve learner work; show a concise retry/edit message |
| LIMITED | Preserve learner work; explain that AI is temporarily limited |
| UNAVAILABLE | Continue deterministic study flow without AI |
| INVALID_RESPONSE | Hide malformed AI content; preserve learner work |
| TIMEOUT | Offer retry; do not duplicate progress/evidence |

No AI failure may erase an answer, create a StudyEvent, change mastery, or block access to deterministic learning content.

## Authority boundary

AI results remain advisory.

The authoritative systems remain:

- StudyEvents;
- learner evidence;
- proficiency gates;
- mastery projections;
- scheduler/orchestrator;
- course progress.

A correction or conversation signal may be displayed immediately, but persistence into learner evidence requires an explicit Languages-owned interaction rule.

## Context policy

Send only request-scoped context.

Correction:
- learner text;
- language;
- proficiency framework/level;
- small local task context.

Explanation:
- selected issue;
- source/corrected text;
- learner question.

Exercise generation:
- explicit product-owned skill/category targets;
- small optional learner notes.

Conversation:
- scenario;
- current message;
- maximum 16 selected prior messages;
- explicit targets.

Do not send account UUID, email, bearer token, global learner history, or unrelated notes to `thiepn/ai`.

## Activation checklist

Before surfacing AI controls in a production language consumer:

- [ ] `ai.thiepn.dev` (or the configured production AI origin) is deployed and healthy.
- [ ] OpenAI provider credential is configured only in `thiepn/ai`.
- [ ] persistent guardrail storage is configured in `thiepn/ai`.
- [ ] a unique `languages` HMAC secret is configured in `thiepn/ai`.
- [ ] the matching secret is configured only as a Core Worker secret.
- [ ] Core is configured with the production AI origin.
- [ ] the P7 18-case live Luna suite passes its release gate.
- [ ] Core gateway tests pass.
- [ ] Languages client tests pass.
- [ ] one signed-in physical/browser study session exercises all four capabilities.
- [ ] error states are checked with learner work preserved.
- [ ] correction false positives are manually reviewed.
- [ ] French level appropriateness is manually reviewed.
- [ ] Japanese register/naturalness is manually reviewed.

Until every activation item is satisfied, AI UI should remain experimental or hidden.

## Real-study acceptance session

A qualification session should include:

1. one correct French sentence that must not be overcorrected;
2. one French sentence with a clear A1/A2 error;
3. one focused explanation request;
4. one generated practice set from an actual product-owned weakness;
5. a five-to-ten-turn French conversation;
6. one correct Japanese sentence;
7. one Japanese correction/explanation;
8. one Japanese generated exercise set;
9. one Japanese conversation turn;
10. forced timeout/unavailable/429 states.

Record:

- request IDs;
- subjective usefulness;
- false corrections;
- confusing explanations;
- answer-key defects;
- conversation derailment;
- approximate latency;
- whether learner work was preserved on failure.

Do not record bearer tokens or server secrets.

## P8 exit condition

P8 is fully certified only when both layers pass:

```text
code/integration qualification
+
live production-like learner qualification
```

The repository currently satisfies the first layer. The second requires real service credentials/deployment and human use, so it must not be marked complete merely from unit tests.
