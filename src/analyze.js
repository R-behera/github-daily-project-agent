const GENERATED_TOPIC = "daily-agent-generated";

const normalizeTopic = (topic) =>
  topic
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const increment = (map, key, amount = 1) => {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + amount);
};

const sortMap = (map) =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, weight]) => ({ name, weight }));

export async function analyzeProfile(client, viewer, repositories) {
  const sourceRepositories = repositories
    .filter((repo) => !repo.fork)
    .filter((repo) => !(repo.topics || []).includes(GENERATED_TOPIC))
    .slice(0, 25);

  const languageWeights = new Map();
  const topicWeights = new Map();

  for (const repo of sourceRepositories) {
    for (const topic of repo.topics || []) {
      increment(topicWeights, normalizeTopic(topic), 1);
    }

    if (repo.language) {
      increment(languageWeights, repo.language, 1);
    }
  }

  const detailedRepos = sourceRepositories.slice(0, 10);
  const languageResults = await Promise.allSettled(
    detailedRepos.map((repo) => client.getLanguages(viewer.login, repo.name))
  );

  languageResults.forEach((result) => {
    if (result.status !== "fulfilled") return;
    for (const [language, bytes] of Object.entries(result.value)) {
      increment(languageWeights, language, Math.max(1, Math.log10(bytes + 1)));
    }
  });

  const languages = sortMap(languageWeights);
  const topics = sortMap(topicWeights);
  const descriptions = sourceRepositories
    .map((repo) => repo.description)
    .filter(Boolean)
    .slice(0, 12);

  return {
    login: viewer.login,
    name: viewer.name || viewer.login,
    bio: viewer.bio || "",
    publicRepositoryCount: repositories.filter((repo) => !repo.private).length,
    sourceRepositoryCount: sourceRepositories.length,
    languages,
    topics,
    descriptions,
    recentRepositories: sourceRepositories.slice(0, 8).map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
      updatedAt: repo.updated_at
    }))
  };
}

export { GENERATED_TOPIC };
