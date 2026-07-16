const API_ROOT = "https://api.github.com";

export class GitHubClient {
  constructor(token, fetchImpl = fetch) {
    if (!token) {
      throw new Error("DAILY_AGENT_TOKEN is required.");
    }

    this.token = token;
    this.fetch = fetchImpl;
  }

  async request(path, options = {}) {
    const response = await this.fetch(`${API_ROOT}${path}`, {
      ...options,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${this.token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "github-daily-project-agent",
        ...options.headers
      }
    });

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const detail = payload?.message || `${response.status} ${response.statusText}`;
      const error = new Error(
        `GitHub API ${options.method || "GET"} ${path}: ${detail}`
      );
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  getViewer() {
    return this.request("/user");
  }

  async listOwnedRepositories({ includePrivate = false } = {}) {
    const visibility = includePrivate ? "all" : "public";
    const repositories = [];

    for (let page = 1; page <= 5; page += 1) {
      const batch = await this.request(
        `/user/repos?affiliation=owner&visibility=${visibility}&sort=updated&per_page=100&page=${page}`
      );
      repositories.push(...batch);
      if (batch.length < 100) break;
    }

    return repositories;
  }

  getLanguages(owner, repository) {
    return this.request(`/repos/${owner}/${repository}/languages`);
  }

  getRepository(owner, repository) {
    return this.request(`/repos/${owner}/${repository}`);
  }

  createRepository({ name, description, visibility }) {
    return this.request("/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name,
        description,
        private: visibility === "private",
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        auto_init: true
      })
    });
  }

  getRef(owner, repository, ref = "heads/main") {
    return this.request(`/repos/${owner}/${repository}/git/ref/${ref}`);
  }

  getGitCommit(owner, repository, commitSha) {
    return this.request(`/repos/${owner}/${repository}/git/commits/${commitSha}`);
  }

  getTree(owner, repository, treeSha) {
    return this.request(`/repos/${owner}/${repository}/git/trees/${treeSha}`);
  }

  createBootstrapFile(owner, repository) {
    return this.request(`/repos/${owner}/${repository}/contents/.agent-bootstrap`, {
      method: "PUT",
      body: JSON.stringify({
        message: "Initialize repository",
        content: Buffer.from("Initializing generated project.\n").toString("base64"),
        branch: "main"
      })
    });
  }

  createBlob(owner, repository, content) {
    return this.request(`/repos/${owner}/${repository}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({ content, encoding: "utf-8" })
    });
  }

  createTree(owner, repository, tree, baseTree) {
    return this.request(`/repos/${owner}/${repository}/git/trees`, {
      method: "POST",
      body: JSON.stringify({
        tree,
        ...(baseTree ? { base_tree: baseTree } : {})
      })
    });
  }

  createCommit(owner, repository, treeSha, message, parents = []) {
    return this.request(`/repos/${owner}/${repository}/git/commits`, {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents
      })
    });
  }

  updateRef(owner, repository, commitSha) {
    return this.request(`/repos/${owner}/${repository}/git/refs/heads/main`, {
      method: "PATCH",
      body: JSON.stringify({
        sha: commitSha,
        force: false
      })
    });
  }

  updateRepository(owner, repository, values) {
    return this.request(`/repos/${owner}/${repository}`, {
      method: "PATCH",
      body: JSON.stringify(values)
    });
  }

  setTopics(owner, repository, names) {
    return this.request(`/repos/${owner}/${repository}/topics`, {
      method: "PUT",
      body: JSON.stringify({ names })
    });
  }

  async publishFiles(owner, repository, files, commitMessage) {
    let ref;

    try {
      ref = await this.getRef(owner, repository);
    } catch (error) {
      if (error.status !== 404 && error.status !== 409) throw error;
      const bootstrap = await this.createBootstrapFile(owner, repository);
      ref = { object: { sha: bootstrap.commit.sha } };
    }

    const parentCommit = await this.getGitCommit(
      owner,
      repository,
      ref.object.sha
    );
    const currentTree = await this.getTree(
      owner,
      repository,
      parentCommit.tree.sha
    );
    const hasBootstrap = currentTree.tree.some(
      (entry) => entry.path === ".agent-bootstrap"
    );
    const tree = hasBootstrap
      ? [{ path: ".agent-bootstrap", mode: "100644", type: "blob", sha: null }]
      : [];

    for (const [filePath, content] of Object.entries(files)) {
      const blob = await this.createBlob(owner, repository, content);
      tree.push({
        path: filePath,
        mode: "100644",
        type: "blob",
        sha: blob.sha
      });
    }

    const createdTree = await this.createTree(
      owner,
      repository,
      tree,
      parentCommit.tree.sha
    );
    const commit = await this.createCommit(
      owner,
      repository,
      createdTree.sha,
      commitMessage,
      [ref.object.sha]
    );
    await this.updateRef(owner, repository, commit.sha);
    await this.updateRepository(owner, repository, { default_branch: "main" });
    return commit;
  }
}
