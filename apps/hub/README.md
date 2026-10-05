# Language Hub

`languages.thiepn.dev` is the multi-language presentation/orchestration boundary.

P8 introduces its first real data plane.

The Hub consumes `@thiepn/languages/read-model` snapshots from independent language products and maps them through `src/data-plane.ts`.

## What the Hub may do

- show enrolled languages;
- show due/planned workload;
- show recent study activity and streaks;
- show each app's own progress metrics;
- show each app's own proficiency projection with its framework/claim label intact;
- surface the highest-priority fresh next action supplied by a language app;
- link back into the authoritative language product.

## What the Hub may not do

- read raw StudyEvents;
- read FSRS traces;
- recompute mastery;
- recompute proficiency;
- convert CEFR/JLPT/etc. into a single global score;
- decide French/Japanese within-language study order;
- become a second curriculum or scheduler;
- write learner state during P8.

P8 remains a read-oriented projection boundary. Authenticated cross-device persistence is deferred to P9.
