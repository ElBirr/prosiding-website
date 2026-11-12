document.addEventListener("DOMContentLoaded", async () => {
  const detail = document.getElementById("issue-detail");
  const list = document.getElementById("issue-articles");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const [articles, issues] = await Promise.all([loadList("articles"), loadList("issues")]);

  if (articles === null || issues === null) {
    showError(detail);
    list?.setAttribute("hidden", "");
    return;
  }

  const pubIssues = sortIssues(publishedIssues(issues));
  const requested = new URLSearchParams(window.location.search).get("id");
  const issue = requested
    ? pubIssues.find(item => cleanValue(item.id) === requested)
    : pubIssues[0];

  if (!issue) {
    showEmpty(detail, requested ? t("issueNotFound") : t("noIssues"));
    list?.setAttribute("hidden", "");
    document.title = `${t("issueNotFound")} — E-Prosiding UMKU`;
    return;
  }

  const items = articlesForIssue(articles, issue.id);
  const title = issueDisplayTitle(issue);
  const closure = [issueContainer(issue), formatDate(issue.publication_date, currentLanguage), `${items.length} ${t("articleCount")}`]
    .filter(Boolean).join(" · ");

  if (breadcrumbs) {
    breadcrumbs.innerHTML = `<ol>
      <li><a href="${asset("index.html")}">${t("home")}</a></li>
      <li><a href="${asset("archive.html")}">${t("navArchive")}</a></li>
      <li aria-current="page">${escapeHTML(title)}</li>
    </ol>`;
  }

  detail.innerHTML = `<header class="page-head">
    <p class="eyebrow">${t("issueEyebrow")}</p>
    <h1>${escapeHTML(title)}</h1>
    <p class="meta-line"><span>${escapeHTML(closure)}</span></p>
    ${cleanValue(issue.description) ? `<p class="page-lead">${escapeHTML(issue.description)}</p>` : ""}
  </header>`;

  setPageMeta({
    title: `${title} — E-Prosiding UMKU`,
    description: cleanValue(issue.description) || `${title} — ${t("issueArticles")}.`,
    url: `${asset("issue.html")}?id=${encodeURIComponent(cleanValue(issue.id))}`
  });

  if (!list) return;
  if (!items.length) {
    showEmpty(list, t("issueEmpty"));
    return;
  }
  list.innerHTML = `<h2 class="section-title">${t("issueArticles")}</h2>
    <div class="article-rows">${items.map(articleRow).join("")}</div>`;
});
