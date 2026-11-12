document.addEventListener("DOMContentLoaded", async () => {
  const searchForm = document.getElementById("hero-search");
  searchForm?.addEventListener("submit", event => {
    event.preventDefault();
    const query = document.getElementById("hero-query").value.trim();
    window.location.href = archiveUrl({ q: query });
  });

  const latestGrid = document.getElementById("latest-articles");
  const issueSpot = document.getElementById("home-issue");
  const archiveList = document.getElementById("home-archive");
  const [articles, issues] = await Promise.all([loadList("articles"), loadList("issues")]);

  if (articles === null || issues === null) {
    document.getElementById("loading-note")?.remove();
    showError(latestGrid);
    document.getElementById("current-issue-section")?.setAttribute("hidden", "");
    document.getElementById("home-archive-section")?.setAttribute("hidden", "");
    return;
  }

  const published = sortArticles(publishedArticles(articles));
  const pubIssues = sortIssues(publishedIssues(issues));

  const statArticles = document.getElementById("stat-articles");
  const statYears = document.getElementById("stat-years");
  const statIssues = document.getElementById("stat-issues");
  if (statArticles) statArticles.textContent = published.length;
  if (statYears) statYears.textContent = new Set(published.map(a => cleanValue(a.year)).filter(Boolean)).size;
  if (statIssues) statIssues.textContent = pubIssues.length;

  const issue = pubIssues[0];
  const issueSection = document.getElementById("current-issue-section");
  if (!issue) {
    issueSection?.setAttribute("hidden", "");
  } else {
    const issueArticles = articlesForIssue(articles, issue.id);
    if (issueSpot) {
      issueSpot.innerHTML = `<div class="issue-spotlight">
        <div>
          <p class="eyebrow">${t("currentIssueTitle")}</p>
          <h3><a href="${issueUrl(issue.id)}">${escapeHTML(issueDisplayTitle(issue))}</a></h3>
          <p class="meta-line">
            ${issueNumberText(issue) ? `<span>${escapeHTML(issueNumberText(issue))}</span>` : ""}
            ${cleanValue(issue.year) ? `<span>${escapeHTML(issue.year)}</span>` : ""}
            ${cleanValue(issue.publication_date) ? `<span>${escapeHTML(formatDate(issue.publication_date, currentLanguage))}</span>` : ""}
            <span>${issueArticles.length} ${t("articleCount")}</span>
          </p>
          ${cleanValue(issue.description) ? `<p class="muted">${escapeHTML(issue.description)}</p>` : ""}
        </div>
        <a class="btn btn-primary" href="${issueUrl(issue.id)}">${t("viewIssue")}</a>
      </div>`;
    }
  }

  if (!published.length) {
    showEmpty(latestGrid, t("emptyArticles"));
  } else {
    latestGrid.innerHTML = published.slice(0, 6).map(articleCard).join("");
  }

  const archiveSection = document.getElementById("home-archive-section");
  const groups = groupIssuesByYear(pubIssues);
  if (!groups.length) {
    archiveSection?.setAttribute("hidden", "");
  } else if (archiveList) {
    archiveList.innerHTML = groups.map(group => `<li>
      <a href="${archiveUrl({ year: group.year })}">
        <span class="year">${escapeHTML(group.year)}</span>
        <span class="muted">${group.issues.length} ${t("editions")}</span>
      </a>
    </li>`).join("");
  }

  document.getElementById("loading-note")?.remove();
});
