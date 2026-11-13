const test = require("node:test");
const assert = require("node:assert/strict");
const {
  escapeHTML, filterArticles, sortArticles, groupIssuesByYear, citationAPA, citationIEEE, formatAuthors, authorName
} = require("../assets/js/lib.js");

const articles = [
  {
    id: "001",
    title: "The Internet of Physical AI Agents",
    authors: "Roberto Morabito and Mallik Tatipamula",
    abstract: "Physical AI agents perceive, reason, and act in real time.",
    keywords: "IoT, agents",
    year: 2026,
    volume: "",
    issue: "",
    pages: "",
    publication_date: "",
    pdf: "files/pdf/260315900v1.pdf"
  },
  {
    id: "002",
    title: "Edge Computing for Smart Cities",
    authors: "Ayu Lestari",
    abstract: "Edge nodes reduce latency in city services.",
    keywords: "edge, cities",
    year: 2025,
    volume: "1",
    issue: "2",
    publication_date: "2025-06-01"
  }
];

test("escapeHTML escapes markup characters", () => {
  assert.equal(escapeHTML('<a href="x">&\'</a>'), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
  assert.equal(escapeHTML(null), "");
});

test("formatAuthors joins arrays and trims strings", () => {
  assert.equal(formatAuthors(["A", " B "]), "A, B");
  assert.equal(formatAuthors("A and B "), "A and B");
  assert.equal(formatAuthors(undefined), "");
  assert.equal(formatAuthors([{ name: "Roberto Morabito" }, { name: "Mallik Tatipamula" }]), "Roberto Morabito, Mallik Tatipamula");
  assert.equal(authorName({ name: "A" }), "A");
  assert.equal(authorName(" A "), "A");
});

test("filterArticles matches query, year, volume, issue", () => {
  assert.deepEqual(filterArticles(articles, { query: "edge" }).map(a => a.id), ["002"]);
  assert.deepEqual(filterArticles(articles, { query: "PHYSICAL" }).map(a => a.id), ["001"]);
  assert.deepEqual(filterArticles(articles, { year: "2026" }).map(a => a.id), ["001"]);
  assert.deepEqual(filterArticles(articles, { volume: "1", issue: "2" }).map(a => a.id), ["002"]);
  assert.deepEqual(filterArticles(articles, { year: "1999" }), []);
  assert.deepEqual(filterArticles(articles, { query: "morabito" }).map(a => a.id), ["001"]);
  assert.deepEqual(
    filterArticles([{ id: "003", title: "X", authors: [{ name: "Siti Aminah" }], year: 2026 }], { query: "aminah" }).map(a => a.id),
    ["003"]
  );
});

test("sortArticles puts dated items first, then year, then id", () => {
  assert.deepEqual(sortArticles(articles).map(a => a.id), ["002", "001"]);
  const copy = sortArticles(articles);
  assert.notEqual(copy, articles);
});

test("groupIssuesByYear groups and sorts descending", () => {
  const issues = [
    { id: "a", year: 2025, volume: "1", issue: "1" },
    { id: "b", year: 2026, volume: "", issue: "" },
    { id: "c", year: 2025, volume: "1", issue: "2" },
    { id: "d", year: "" }
  ];
  const groups = groupIssuesByYear(issues);
  assert.deepEqual(groups.map(g => g.year), ["2026", "2025"]);
  assert.deepEqual(groups[1].issues.map(i => i.id), ["c", "a"]);
});

test("citationAPA uses year, container and DOI", () => {
  const text = citationAPA({ ...articles[0], pages: "1-10", doi: "10.1234/abc" }, "Prosiding 2026");
  assert.match(text, /^Roberto Morabito and Mallik Tatipamula\./);
  assert.match(text, /\(2026\)\./);
  assert.match(text, /Prosiding 2026, 1-10\./);
  assert.match(text, /https:\/\/doi\.org\/10\.1234\/abc$/);
});

test("citationIEEE quotes title and falls back to URL", () => {
  const text = citationIEEE(articles[0], "Prosiding 2026", "https://example.org/article");
  assert.match(text, /"The Internet of Physical AI Agents,"/);
  assert.match(text, /in Prosiding 2026, 2026/);
  assert.match(text, /\[Online\]\. Available: https:\/\/example\.org\/article\.$/);
});

test("citations degrade gracefully without year or container", () => {
  const article = { title: "Untitled work", authors: "" };
  assert.equal(citationAPA(article), "(n.d.). Untitled work.");
  assert.equal(citationIEEE(article), '"Untitled work."');
});
