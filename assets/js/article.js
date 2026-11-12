document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("article-detail");
  const breadcrumbs = document.getElementById("breadcrumbs");
  const [articles, issues] = await Promise.all([loadList("articles"), loadList("issues")]);

  if (articles === null || issues === null) {
    showError(target);
    return;
  }

  const id = new URLSearchParams(window.location.search).get("id");
  const article = publishedArticles(articles).find(item => cleanValue(item.id) === id);
  if (!article) {
    showEmpty(target, t("articleNotFound"));
    document.title = `${t("articleNotFound")} — E-Prosiding UMKU`;
    return;
  }

  const issue = sortIssues(publishedIssues(issues)).find(item => cleanValue(item.id) === cleanValue(article.issue_id));
  const pdf = pdfUrl(article.pdf);
  const title = cleanValue(article.title) || t("untitled");
  const authors = formatAuthors(article.authors);
  const affiliation = formatKeywords(article.affiliations);
  const keywords = Array.isArray(article.keywords)
    ? article.keywords.map(cleanValue).filter(Boolean)
    : cleanValue(article.keywords).split(",").map(value => value.trim()).filter(Boolean);
  const pageUrl = `${asset("article.html")}?id=${encodeURIComponent(cleanValue(article.id))}`;
  const doi = cleanValue(article.doi).replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  const container = issue ? issueContainer(issue) : "";

  if (breadcrumbs) {
    breadcrumbs.innerHTML = `<ol>
      <li><a href="${asset("index.html")}">${t("home")}</a></li>
      <li><a href="${asset("archive.html")}">${t("navArchive")}</a></li>
      ${issue ? `<li><a href="${issueUrl(issue.id)}">${escapeHTML(issueDisplayTitle(issue))}</a></li>` : ""}
      <li aria-current="page">${escapeHTML(title)}</li>
    </ol>`;
  }

  const actions = pdf ? `<div class="action-row">
      <a class="btn btn-primary" href="${escapeHTML(pdf)}" target="_blank" rel="noopener">${t("openPdf")}</a>
      <a class="btn btn-outline" href="${escapeHTML(pdf)}" download>${t("downloadPdf")}</a>
    </div>` : "";

  const citations = [
    { label: t("citationAPA"), text: citationAPA(article, container, pageUrl) },
    { label: t("citationIEEE"), text: citationIEEE(article, container, pageUrl) }
  ];

  target.innerHTML = `<article class="detail">
    <div class="detail-main">
      <p class="eyebrow">${issue ? `<a href="${issueUrl(issue.id)}">${escapeHTML(issueDisplayTitle(issue))}</a>` : t("articleEyebrow")}${cleanValue(article.year) ? ` · ${escapeHTML(article.year)}` : ""}</p>
      <h1>${escapeHTML(title)}</h1>
      ${authors ? `<p class="detail-authors">${escapeHTML(authors)}</p>` : ""}
      ${affiliation ? `<p class="detail-affiliations">${escapeHTML(affiliation)}</p>` : ""}
      ${actions}
      <section class="content-section">
        <h2>${t("abstract")}</h2>
        <p class="abstract-text">${escapeHTML(cleanValue(article.abstract) || t("notAvailable"))}</p>
      </section>
      ${keywords.length ? `<section class="content-section">
        <h2>${t("keywords")}</h2>
        <ul class="tag-list">${keywords.map(keyword => `<li>${escapeHTML(keyword)}</li>`).join("")}</ul>
      </section>` : ""}
      <section class="content-section">
        <h2>${t("citationTitle")}</h2>
        <div class="citation-list">
          ${citations.map((citation, index) => `<div class="citation">
            <div class="citation__head">
              <h3>${escapeHTML(citation.label)}</h3>
              <button class="btn btn-ghost btn-small" type="button" data-copy="${index}">${t("copy")}</button>
            </div>
            <p class="citation__text">${escapeHTML(citation.text)}</p>
          </div>`).join("")}
        </div>
      </section>
    </div>
    <aside class="detail-side">
      <div class="panel">
        <h2 class="panel__title">${t("metadata")}</h2>
        <dl class="meta-list">
          ${metaRow(t("volume"), issue ? issue.volume : article.volume)}
          ${metaRow(t("issueNumber"), issue ? issue.issue : article.issue)}
          ${metaRow(t("filterYear"), article.year)}
          ${metaRow(t("publicationDate"), formatDate(article.publication_date, currentLanguage))}
          ${metaRow(t("pages"), article.pages)}
          ${metaRow(t("articleId"), article.id)}
          ${doi ? `<dt>${t("doi")}</dt><dd><a href="https://doi.org/${escapeHTML(doi)}" target="_blank" rel="noopener">${escapeHTML(doi)}</a></dd>` : ""}
          ${issue ? `<dt>${t("issueEyebrow")}</dt><dd><a href="${issueUrl(issue.id)}">${escapeHTML(issueDisplayTitle(issue))}</a></dd>` : ""}
        </dl>
      </div>
    </aside>
  </article>
  <section class="pdf-section">
    <div class="section-heading"><h2>${t("pdfTitle")}</h2>${pdf ? `<a class="link-arrow" href="${escapeHTML(pdf)}" target="_blank" rel="noopener">${t("openPdf")} <span aria-hidden="true">↗</span></a>` : ""}</div>
    ${pdf ? `<div class="pdf-frame-wrap"><iframe class="pdf-frame" loading="lazy" src="${escapeHTML(pdf)}#toolbar=1&amp;navpanes=0" title="${escapeHTML(t("pdfTitle"))}"></iframe></div>
      <p class="muted small">${t("pdfFallback")}</p>`
    : `<p class="notice">${t("pdfUnavailable")}</p>`}
  </section>`;

  target.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", () => copyText(citations[Number(button.dataset.copy)].text, button));
  });

  const description = truncate(article.abstract, 180) || `${title} — ${authors}`;
  setPageMeta({ title: `${title} — E-Prosiding UMKU`, description, url: pageUrl });
  injectArticleSchema(article, issue);
});
