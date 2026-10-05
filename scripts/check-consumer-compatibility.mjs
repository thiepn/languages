import { readFile } from "node:fs/promises";

const baseline = JSON.parse(
  await readFile(new URL("../contracts/p7-consumer-baselines.json", import.meta.url), "utf8")
);
const token = process.env.GITHUB_TOKEN?.trim();
const headers = {
  accept: "application/vnd.github+json",
  "x-github-api-version": "2022-11-28",
  ...(token ? { authorization: "Bearer " + token } : {})
};

const failures = [];
const observations = [];

for (const consumer of baseline.consumers) {
  const branch = await getJson(
    "https://api.github.com/repos/" +
      consumer.repository +
      "/branches/" +
      encodeURIComponent(consumer.branch)
  );
  const head = branch?.commit?.sha ?? "";
  observations.push({
    appId: consumer.appId,
    repository: consumer.repository,
    sourceBaselineRevision: consumer.sourceBaselineRevision ?? consumer.repositoryRevision,
    expectedRevision: consumer.repositoryRevision,
    observedRevision: head,
    revisionMatch: head === consumer.repositoryRevision,
    sourceFingerprints: []
  });

  if (head !== consumer.repositoryRevision) {
    failures.push(
      consumer.appId +
        ": main revision drifted from " +
        consumer.repositoryRevision +
        " to " +
        (head || "<missing>")
    );
  }

  const observation = observations.at(-1);
  for (const fingerprint of consumer.sourceFingerprints ?? []) {
    const content = await getJson(
      "https://api.github.com/repos/" +
        consumer.repository +
        "/contents/" +
        fingerprint.path.split("/").map(encodeURIComponent).join("/") +
        "?ref=" +
        encodeURIComponent(consumer.branch)
    );
    const observedSha = content?.sha ?? "";
    const match = observedSha === fingerprint.sha;
    observation.sourceFingerprints.push({
      path: fingerprint.path,
      expectedSha: fingerprint.sha,
      observedSha,
      match
    });
    if (!match) {
      failures.push(
        consumer.appId +
          ": source fingerprint drifted for " +
          fingerprint.path +
          " from " +
          fingerprint.sha +
          " to " +
          (observedSha || "<missing>")
      );
    }
  }
}

console.log(
  JSON.stringify(
    {
      schema: "thiepn-language-cross-repo-compatibility-report",
      schemaVersion: 1,
      checkedAt: new Date().toISOString(),
      platformPackageVersion: baseline.platformPackageVersion,
      platformContractVersion: baseline.platformContractVersion,
      compatible: failures.length === 0,
      failures,
      observations
    },
    null,
    2
  )
);

if (failures.length) process.exitCode = 1;

async function getJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(
      "GITHUB_API_" + response.status + ": " + url + " " + (await response.text())
    );
  }
  return response.json();
}
