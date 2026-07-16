import { json, license, profileSnapshot } from "./shared.js";

const fallbackThemes = [
  "automation",
  "developer-tools",
  "data-quality",
  "monitoring",
  "productivity"
];

export function projectIdeaBoard({ profile, date, suffix, random }) {
  const name = `project-idea-board-${suffix}`;
  const description =
    "A lightweight idea board that turns public GitHub interests into concrete project prompts.";
  const themes = [
    ...profile.topics.map((topic) => topic.name),
    ...profile.languages.map((language) => language.name.toLowerCase()),
    ...fallbackThemes
  ].slice(0, 10);

  const verbs = ["Track", "Compare", "Explain", "Automate", "Visualize", "Audit"];
  const outcomes = [
    "with a zero-dependency CLI",
    "through a focused dashboard",
    "as a small local-first service",
    "with exportable JSON reports",
    "using transparent scoring rules"
  ];

  const ideas = Array.from({ length: 12 }, (_, index) => {
    const theme = themes[index % themes.length];
    const verb = verbs[Math.floor(random() * verbs.length)];
    const outcome = outcomes[Math.floor(random() * outcomes.length)];
    return {
      id: index + 1,
      title: `${verb} ${theme}`,
      description: `${verb} practical ${theme} signals ${outcome}.`,
      theme,
      effort: ["Small", "Medium", "Focused"][Math.floor(random() * 3)]
    };
  });

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Idea Board</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main>
      <header>
        <span>PUBLIC GITHUB SIGNALS / ${date}</span>
        <h1>Project<br />Idea Board</h1>
        <p>Filter practical build prompts derived from ${profile.login}'s public portfolio themes.</p>
      </header>
      <nav id="filters"></nav>
      <section id="ideas" class="grid"></section>
    </main>
    <script src="app.js"></script>
  </body>
</html>
`;

  const styles = `:root {
  --black: #141414;
  --cream: #fff5d6;
  --orange: #f05a28;
  --blue: #2345ff;
}

* { box-sizing: border-box; }

body {
  background: var(--cream);
  color: var(--black);
  font-family: "Arial Narrow", Impact, sans-serif;
  margin: 0;
}

main { width: min(1180px, 94vw); margin: auto; padding: 32px 0 70px; }
header { border-bottom: 8px solid var(--black); padding-bottom: 24px; }
header span { font-family: ui-monospace, monospace; }
h1 { font-size: clamp(4rem, 14vw, 10rem); line-height: .72; margin: 32px 0; text-transform: uppercase; }
header p { font-family: Georgia, serif; font-size: 1.2rem; max-width: 620px; }

nav { display: flex; flex-wrap: wrap; gap: 8px; padding: 22px 0; }
button {
  background: transparent;
  border: 2px solid var(--black);
  cursor: pointer;
  font: inherit;
  padding: 8px 13px;
  text-transform: uppercase;
}
button.active { background: var(--blue); color: white; }

.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; }
.idea { border: 3px solid var(--black); min-height: 220px; padding: 18px; position: relative; }
.idea:nth-child(3n+1) { background: var(--orange); }
.idea:nth-child(3n+2) { background: white; }
.idea:nth-child(3n) { background: #c8f06b; }
.idea h2 { font-size: 2rem; margin: 28px 0 14px; text-transform: uppercase; }
.idea p { font-family: Georgia, serif; line-height: 1.45; }
.meta { display: flex; justify-content: space-between; font-family: ui-monospace, monospace; font-size: .75rem; }
`;

  const app = `const ideas = ${JSON.stringify(ideas, null, 2)};
const ideasRoot = document.querySelector("#ideas");
const filtersRoot = document.querySelector("#filters");
const themes = ["all", ...new Set(ideas.map((idea) => idea.theme))];
let activeTheme = "all";

function render() {
  filtersRoot.innerHTML = themes.map((theme) => \`
    <button class="\${theme === activeTheme ? "active" : ""}" data-theme="\${theme}">\${theme}</button>
  \`).join("");

  ideasRoot.innerHTML = ideas
    .filter((idea) => activeTheme === "all" || idea.theme === activeTheme)
    .map((idea) => \`
      <article class="idea">
        <div class="meta"><span>#\${String(idea.id).padStart(2, "0")}</span><span>\${idea.effort}</span></div>
        <h2>\${idea.title}</h2>
        <p>\${idea.description}</p>
      </article>
    \`).join("");
}

filtersRoot.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeTheme = button.dataset.theme;
  render();
});

render();
`;

  const readme = `# Project Idea Board

A zero-dependency, local-first idea board generated from broad themes visible
on [${profile.login}'s public GitHub profile](https://github.com/${profile.login}).

The ideas are deterministic prompts, not AI-generated claims about private work.

## Run

Open \`index.html\` in a browser.

## Customize

Edit the \`ideas\` array in \`app.js\` or the profile snapshot in
\`data/profile-snapshot.json\`.
`;

  return {
    name,
    description,
    topics: ["project-ideas", "github", "portfolio", "vanilla-javascript"],
    files: {
      "index.html": html,
      "styles.css": styles,
      "app.js": app,
      "data/ideas.json": json(ideas),
      "data/profile-snapshot.json": json(profileSnapshot(profile, date)),
      "README.md": readme,
      "LICENSE": license(profile.login, date.slice(0, 4))
    }
  };
}
