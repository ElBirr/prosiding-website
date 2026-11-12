document.addEventListener("DOMContentLoaded", async () => {
  const issueList = document.getElementById("issue-list");
  const list = document.getElementById("archive-list");
  const count = document.getElementById("result-count");
  const queryInput = document.getElementById("archive-query");
  const yearFilter = document.getElementById("year-filter");
  const volumeFilter = document.getElementById("volume-filter");
  const issueFilter = document.getElementById("issue-filter");
  const moreButton = document.getElementById("show-more");
  const params = new URLSearchParams(window.location.search);
  const [articles, issues] = await Promise.all([loadList("articles"), loadList("issues")]);

  if (articles === null || issues === null) {
    showError(issueList);
    showError(list);
    return;
  }

  const pubArticles = sortArticles(publishedArticles(articles));
  const pubIssues = sortIssues(publishedIssues(issues));
  pubArticles.forEach(article => { article._search = articleHaystack(article); });
  const counts = new Map();
  pubArticles.forEach(article => {
    const id = cleanValue(article.issue_id);
    if (id) counts.set(id, (counts.get(id) || 0) + 1);
  });

  function renderIssues() {
    if (!pubIssues.length) {
      showEmpty(issueList, t("noIssues"));
      return;
    }
    issueList.innerHTML = groupIssuesByYear(pubIssues).map(group => `<section class="year-group" id="year-${escapeHTML(group.year)}">
      <div class="year-group__head">
        <h3>${escapeHTML(group.year)}</h3>
        <span class="muted">${group.issues.length} ${t("editions")}</span>
      </div>
      ${group.issues.map(issue => `<article class="issue-card">
        <div>
          <h4><a href="${issueUrl(issue.id)}">${escapeHTML(issueDisplayTitle(issue))}</a></h4>
          <p class="meta-line">
            ${issueNumberText(issue) ? `<span>${escapeHTML(issueNumberText(issue))}</span>` : ""}
            ${cleanValue(issue.publication_date) ? `<span>${escapeHTML(formatDate(issue.publication_date, currentLanguage))}</span>` : `<span>${escapeHTML(issue.year || "")}</span>`}
            <span>${counts.get(cleanValue(issue.id)) || 0} ${t("articleCount")}</span>
          </p>
          ${cleanValue(issue.description) ? `<p class="muted">${escapeHTML(truncate(issue.description, 180))}</p>` : ""}
        </div>
        <a class="btn btn-outline btn-small" href="${issueUrl(issue.id)}">${t("viewIssue")}</a>
      </article>`).join("")}
    </section>`).join("");
  }

  function uniqueValues(key) {
    return [...new Set(pubIssues.map(issue => cleanValue(issue[key])).filter(Boolean))]
      .sort((a, b) => Number(b) - Number(a) || String(b).localeCompare(String(a)));
  }

  function fillSelect(select, values, allLabel) {
    if (!select) return;
    values.forEach(value => {
      select.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(value)}">${escapeHTML(value)}</option>`);
    });
    select.options[0].textContent = allLabel;
  }

  fillSelect(yearFilter, uniqueValues("year"), t("allYears"));
  fillSelect(volumeFilter, uniqueValues("volume"), t("allVolumes"));
  fillSelect(issueFilter, uniqueValues("issue"), t("allIssues"));

  if (params.get("year") && yearFilter) yearFilter.value = params.get("year");
  if (params.get("volume") && volumeFilter) volumeFilter.value = params.get("volume");
  if (params.get("issue") && issueFilter) issueFilter.value = params.get("issue");
  if (params.get("q") && queryInput) queryInput.value = params.get("q");

  let limit = 100;
  let current = [];

  function render(reset = false) {
    if (reset) limit = 100;
    current = sortArticles(filterArticles(pubArticles, {
      query: queryInput ? queryInput.value : "",
      year: yearFilter ? yearFilter.value : "",
      volume: volumeFilter ? volumeFilter.value : "",
      issue: issueFilter ? issueFilter.value : ""
    }));
    if (count) count.textContent = `${current.length} ${t("resultsFound")}`;
    if (!current.length) {
      showEmpty(list, pubArticles.length ? t("noResults") : t("emptyArticles"));
      if (moreButton) moreButton.hidden = true;
      return;
    }
    list.innerHTML = current.slice(0, limit).map(articleRow).join("");
    const remaining = current.length - limit;
    if (moreButton) {
      moreButton.hidden = remaining <= 0;
      moreButton.textContent = t("showMore").replace("{n}", Math.min(remaining, 100));
    }
  }

  let timer = null;
  function scheduleRender() {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => render(true), 150);
  }

  [queryInput, yearFilter, volumeFilter, issueFilter].forEach(element => {
    if (element) element.addEventListener("input", scheduleRender);
  });
  moreButton?.addEventListener("click", () => {
    limit += 100;
    render(false);
  });

  renderIssues();
  render(true);
});
