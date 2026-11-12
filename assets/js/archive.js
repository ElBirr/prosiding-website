document.addEventListener("DOMContentLoaded", async () => {
  const queryInput = document.getElementById("archive-query");
  const yearFilter = document.getElementById("year-filter");
  const eventFilter = document.getElementById("event-filter");
  const list = document.getElementById("archive-list");
  const count = document.getElementById("result-count");
  try {
    await loadArticles();
    const articles = publishedArticles();
    [...new Set(articles.map(a => String(a.year || "")).filter(Boolean))].sort((a,b)=>Number(b)-Number(a)).forEach(year => {
      yearFilter.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(year)}">${escapeHTML(year)}</option>`);
    });
    [...new Set(articles.map(a => a.event).filter(Boolean))].sort().forEach(eventName => {
      eventFilter.insertAdjacentHTML("beforeend", `<option value="${escapeHTML(eventName)}">${escapeHTML(eventName)}</option>`);
    });
    const params = new URLSearchParams(location.search);
    queryInput.value = params.get("q") || "";
    function render() {
      const q = queryInput.value.toLowerCase().trim();
      const year = yearFilter.value;
      const eventName = eventFilter.value;
      const filtered = articles.filter(a => {
        const haystack = [a.title, formatAuthors(a.authors), a.abstract, a.keywords, a.event, a.year].join(" ").toLowerCase();
        return (!q || haystack.includes(q)) && (!year || String(a.year) === year) && (!eventName || a.event === eventName);
      }).sort((a,b)=>Number(b.year || 0)-Number(a.year || 0));
      count.textContent = `${filtered.length} ${t("resultCount")}`;
      if (!filtered.length) return showEmpty(list, articles.length ? t("noResults") : t("noArticles"));
      list.innerHTML = filtered.map(a => `<article class="list-item">
        <div class="list-year">${escapeHTML(a.year || "")}</div>
        <div><p class="eyebrow">${escapeHTML(a.event || "UMKU Proceedings")}</p>
          <h2><a href="${articleUrl(a.id)}">${escapeHTML(a.title || "")}</a></h2>
          <p class="article-authors">${escapeHTML(formatAuthors(a.authors))}</p>
          <a class="text-link" href="${articleUrl(a.id)}">${t("viewArticle")} →</a>
        </div>
      </article>`).join("");
    }
    [queryInput, yearFilter, eventFilter].forEach(el => el.addEventListener("input", render));
    render();
  } catch (error) {
    showEmpty(list, "Data artikel belum dapat dimuat.");
    console.error(error);
  }
});
