document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("article-detail");
  try {
    await loadArticles();
    const id = new URLSearchParams(location.search).get("id");
    const article = publishedArticles().find(item => item.id === id);
    if (!article) {
      showEmpty(target, t("articleNotFound"));
      return;
    }
    document.title = `${article.title} — UMKU Proceedings`;
    const pdf = pdfUrl(article.pdf);
    const keywords = Array.isArray(article.keywords) ? article.keywords.join(", ") : (article.keywords || "—");
    target.innerHTML = `
      <article class="detail-layout">
        <div class="detail-main">
          <p class="eyebrow">${escapeHTML(article.event || "UMKU Proceedings")} · ${escapeHTML(article.year || "")}</p>
          <h1>${escapeHTML(article.title || "")}</h1>
          <p class="detail-authors">${escapeHTML(formatAuthors(article.authors))}</p>
          <div class="detail-actions">
            <a class="button button-dark" href="${escapeHTML(pdf)}" target="_blank" rel="noopener">${t("readPdf")}</a>
            <a class="button button-light" href="${escapeHTML(pdf)}" download>${t("downloadPdf")}</a>
          </div>
          <section class="abstract-block"><h2>${t("abstract")}</h2><p>${escapeHTML(article.abstract || "—")}</p></section>
        </div>
        <aside class="metadata-card">
          <h2>Article information</h2>
          <dl>
            <dt>${t("authors")}</dt><dd>${escapeHTML(formatAuthors(article.authors))}</dd>
            <dt>${t("event")}</dt><dd>${escapeHTML(article.event || "—")}</dd>
            <dt>${t("keywords")}</dt><dd>${escapeHTML(keywords)}</dd>
            <dt>Article ID</dt><dd>${escapeHTML(article.id || "—")}</dd>
          </dl>
        </aside>
      </article>
      <section class="pdf-section"><div class="section-heading"><h2>PDF</h2><a class="text-link" href="${escapeHTML(pdf)}" target="_blank" rel="noopener">${t("readPdf")} ↗</a></div>
        <iframe class="pdf-frame" src="${escapeHTML(pdf)}#toolbar=1" title="PDF article viewer"></iframe>
      </section>`;
  } catch (error) {
    showEmpty(target, "Data artikel belum dapat dimuat.");
    console.error(error);
  }
});
