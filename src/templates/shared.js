export const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

export const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

export const profileSnapshot = (profile, date) => ({
  generatedAt: `${date}T09:17:00`,
  developer: profile.name,
  github: profile.login,
  sourceRepositoryCount: profile.sourceRepositoryCount,
  topLanguages: profile.languages.slice(0, 6).map(({ name, weight }) => ({
    name,
    score: Number(weight.toFixed(2))
  })),
  topTopics: profile.topics.slice(0, 8).map(({ name, weight }) => ({
    name,
    score: Number(weight.toFixed(2))
  })),
  recentRepositories: profile.recentRepositories
});

export const license = (owner, year) => `MIT License

Copyright (c) ${year} ${owner}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;
