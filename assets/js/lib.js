/* Pure helpers. No DOM access: loaded by the browser and by node tests. */

function cleanValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(cleanValue).filter(Boolean).join(", ");
  return String(value).trim();
}

function escapeHTML(value = "") {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function formatAuthors(authors) {
  if (Array.isArray(authors)) return authors.map(cleanValue).filter(Boolean).join(", ");
  return cleanValue(authors);
}

function formatKeywords(keywords) {
  return cleanValue(keywords);
}

function truncate(text, length = 260) {
  const value = cleanValue(text).replace(/\s+/g, " ");
  return value.length > length ? `${value.slice(0, length).trimEnd()}…` : value;
}

function formatDate(value, lang = "id") {
  const raw = cleanValue(value);
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "id-ID", {
    day: "numeric", month: "long", year: "numeric"
  }).format(date);
}

function articleHaystack(article) {
  if (article && article._search) return article._search;
  return [
    article.title, formatAuthors(article.authors), article.abstract,
    formatKeywords(article.keywords), article.event
  ].map(cleanValue).join(" ").toLowerCase();
}

function filterArticles(articles, filters = {}) {
  const query = cleanValue(filters.query).toLowerCase();
  const year = cleanValue(filters.year);
  const volume = cleanValue(filters.volume);
  const issue = cleanValue(filters.issue);
  return (Array.isArray(articles) ? articles : []).filter(article => {
    if (query && !articleHaystack(article).includes(query)) return false;
    if (year && cleanValue(article.year) !== year) return false;
    if (volume && cleanValue(article.volume) !== volume) return false;
    if (issue && cleanValue(article.issue) !== issue) return false;
    return true;
  });
}

function dateValue(article) {
  const parsed = Date.parse(cleanValue(article.publication_date));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortArticles(articles) {
  return [...(Array.isArray(articles) ? articles : [])].sort((a, b) =>
    (dateValue(b) - dateValue(a)) ||
    (Number(b.year || 0) - Number(a.year || 0)) ||
    String(a.id || "").localeCompare(String(b.id || ""), undefined, { numeric: true })
  );
}

function sortIssues(issues) {
  return [...(Array.isArray(issues) ? issues : [])].sort((a, b) =>
    (Number(b.year || 0) - Number(a.year || 0)) ||
    (Number(b.volume || 0) - Number(a.volume || 0)) ||
    (Number(b.issue || 0) - Number(a.issue || 0)) ||
    String(a.id || "").localeCompare(String(b.id || ""), undefined, { numeric: true })
  );
}

function groupIssuesByYear(issues) {
  const groups = new Map();
  sortIssues(issues).forEach(issue => {
    const year = cleanValue(issue.year);
    if (!year) return;
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(issue);
  });
  return [...groups.entries()].map(([year, items]) => ({ year, issues: items }));
}

function citationAPA(article, container = "", url = "") {
  const authors = formatAuthors(article.authors);
  const year = cleanValue(article.year);
  const title = cleanValue(article.title).replace(/\.$/, "");
  const pages = cleanValue(article.pages);
  const doi = cleanValue(article.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  const parts = [];
  if (authors) parts.push(`${authors}${/[.!?]$/.test(authors) ? "" : "."}`);
  parts.push(year ? `(${year}).` : "(n.d.).");
  if (title) parts.push(`${title}.`);
  if (container) parts.push(`${container}${pages ? `, ${pages}` : ""}.`);
  if (doi) parts.push(`https://doi.org/${doi}`);
  else if (url) parts.push(url);
  return parts.join(" ").trim();
}

function citationIEEE(article, container = "", url = "") {
  const authors = formatAuthors(article.authors);
  const year = cleanValue(article.year);
  const title = cleanValue(article.title).replace(/[.,]$/, "");
  const pages = cleanValue(article.pages);
  const doi = cleanValue(article.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  const tail = [
    container ? `in ${container}` : "",
    year,
    pages ? `pp. ${pages}` : "",
    doi ? `doi: ${doi}` : url ? `[Online]. Available: ${url}` : ""
  ].filter(Boolean).join(", ");
  if (!tail) return [authors, title ? `"${title}."` : ""].filter(Boolean).join(" ");
  return [authors ? `${authors},` : "", title ? `"${title},"` : "", tail]
    .filter(Boolean).join(" ").replace(/\s+/g, " ").trim() + ".";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    cleanValue, escapeHTML, formatAuthors, formatKeywords, truncate, formatDate,
    articleHaystack, filterArticles, sortArticles, sortIssues, groupIssuesByYear,
    citationAPA, citationIEEE
  };
}
