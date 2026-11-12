const BASE_URL = new URL("./", window.location.href);
const ENDPOINTS = {
  articles: "data/articles.json",
  issues: "data/issues.json",
  site: "data/site.json",
  editors: "data/editors.json",
  reviewers: "data/reviewers.json",
  about: "data/page-about.json",
  ethics: "data/page-ethics.json",
  guidelines: "data/page-guidelines.json"
};

const I18N = {
  id: {
    navHome: "Beranda", navAbout: "Tentang", navCurrent: "Edisi Terkini", navArchive: "Arsip",
    navEditorial: "Dewan Editor", navReviewers: "Reviewer", navGuidelines: "Panduan Penulis",
    navEthics: "Etika Publikasi", navContact: "Kontak",
    skipToContent: "Lewati ke konten", menu: "Menu", closeMenu: "Tutup menu",
    languageLabel: "Ganti bahasa", language: "EN",
    home: "Beranda", loading: "Memuat…", loadError: "Data tidak dapat dimuat.",
    loadErrorHint: "Periksa berkas data atau coba muat ulang halaman.",
    notFound: "Tidak ditemukan.", emptyArticles: "Belum ada artikel yang dipublikasikan.",
    untitled: "Tanpa judul", viewArticle: "Lihat artikel", openPdf: "Buka PDF",
    downloadPdf: "Unduh PDF", searchArticles: "Cari artikel", searchPlaceholder: "Cari judul, penulis, atau kata kunci…",
    searchButton: "Cari", clearFilters: "Reset", proceedings: "Prosiding",
    heroEyebrow: "Prosiding Universitas Muhammadiyah Kudus",
    heroTitle: "E-Prosiding Universitas Muhammadiyah Kudus",
    heroCopy: "Kumpulan artikel ilmiah dari seminar, konferensi, dan forum akademik UMKU. Telusuri, baca, dan unduh karya yang telah dipublikasikan.",
    browseArchive: "Jelajahi arsip", guidelinesButton: "Panduan penulis", journalInfo: "Informasi terbitan",
    publisherLabel: "Penerbit", frequencyLabel: "Frekuensi", openAccessLabel: "Akses terbuka", contactLabel: "Kontak",
    currentIssueTitle: "Edisi terkini", currentIssueCopy: "Terbitan terbaru yang tersedia di repository.",
    currentIssueEmpty: "Belum ada edisi yang dipublikasikan.",
    latestTitle: "Artikel terbaru", latestCopy: "Publikasi terbaru dari seluruh edisi.",
    latestEmpty: "Belum ada artikel terbaru.", latestAll: "Lihat semua artikel",
    statsLabel: "Statistik publikasi", statsArticles: "Artikel terbit", statsYears: "Tahun terbit", statsIssues: "Edisi",
    editions: "edisi", issuesCount: "edisi",
    archiveTitle: "Arsip", archiveCopy: "Telusuri terbitan berdasarkan tahun, volume, dan nomor.",
    archiveLink: "Lihat arsip lengkap", aboutTitle: "Tentang prosiding",
    aboutMore: "Selengkapnya", contactButton: "Hubungi kami", footerExplore: "Jelajahi",
    footerPublisher: "Penerbit", footerContact: "Kontak", footerRights: "Hak cipta dilindungi.",
    footerManaged: "Dikelola oleh Universitas Muhammadiyah Kudus.",
    archiveEyebrow: "Arsip", archiveHeading: "Arsip terbitan",
    issuesTitle: "Terbitan", issuesCopy: "Prosiding dikelompokkan menurut tahun terbit.",
    noIssues: "Belum ada edisi yang dipublikasikan.", viewIssue: "Lihat edisi",
    searchTitle: "Cari artikel", searchCopy: "Cari berdasarkan judul, penulis, abstrak, atau kata kunci.",
    filterYear: "Tahun", allYears: "Semua tahun", filterVolume: "Volume", allVolumes: "Semua volume",
    filterIssue: "Nomor", allIssues: "Semua nomor", resultsFound: "artikel ditemukan",
    noResults: "Tidak ada artikel yang cocok dengan pencarian.", showMore: "Tampilkan {n} artikel lagi",
    issueEyebrow: "Edisi", issueNotFound: "Edisi tidak ditemukan atau belum dipublikasikan.",
    issueArticles: "Artikel dalam edisi ini", issueEmpty: "Belum ada artikel dalam edisi ini.",
    articleCount: "artikel", publishedOn: "Terbit", volume: "Volume", issueNumber: "Nomor",
    articleEyebrow: "Artikel", articleNotFound: "Artikel tidak ditemukan atau belum dipublikasikan.",
    abstract: "Abstrak", authors: "Penulis", keywords: "Kata kunci", affiliations: "Afiliasi",
    publicationDate: "Tanggal terbit", pages: "Halaman", doi: "DOI", articleId: "ID artikel",
    metadata: "Informasi artikel", citationTitle: "Sitasi", citationAPA: "APA", citationIEEE: "IEEE",
    copy: "Salin", copied: "Tersalin", copyFailed: "Gagal menyalin", pdfTitle: "Dokumen PDF",
    pdfFallback: "Jika PDF tidak tampil di peramban Anda, gunakan tautan buka atau unduh di atas.",
    pdfUnavailable: "Dokumen PDF belum tersedia untuk artikel ini.",
    backToArchive: "Kembali ke arsip", backToIssue: "Kembali ke edisi",
    editorialEyebrow: "Editorial", editorialTitle: "Dewan editor",
    editorialCopy: "Susunan dewan editor yang mengelola terbitan.",
    editorInChief: "Pemimpin Redaksi", managingEditor: "Editor Pelaksana", editorialBoard: "Dewan Editor",
    reviewersTitle: "Reviewer", reviewersCopy: "Direktori reviewer yang terlibat dalam penelaahan naskah.",
    noEditors: "Susunan dewan editor belum dipublikasikan.", noReviewers: "Direktori reviewer belum dipublikasikan.",
    affiliation: "Afiliasi", expertise: "Bidang keahlian", email: "Email",
    aboutEyebrow: "Tentang", aboutPageTitle: "Tentang prosiding",
    aboutPageCopy: "Informasi mengenai fokus, cakupan, dan penyelenggaraan prosiding.",
    ethicsEyebrow: "Etika Publikasi", ethicsTitle: "Etika publikasi",
    ethicsCopy: "Pedoman perilaku bagi penulis, editor, dan reviewer.",
    guidelinesEyebrow: "Panduan Penulis", guidelinesTitle: "Panduan penulis",
    guidelinesCopy: "Ketentuan penyiapan dan pengiriman naskah.",
    adminMarker: "Bagian ini belum diisi oleh pengelola.",
    contactEyebrow: "Kontak", contactTitle: "Kontak",
    contactCopy: "Informasi resmi penerbit dan pengelola prosiding.",
    contactInstitution: "Institusi", contactPublisher: "Penerbit", contactAddress: "Alamat",
    contactEmail: "Email", contactPhone: "Telepon", contactWebsite: "Situs web",
    contactEmpty: "Informasi kontak belum tersedia.",
    issueDateMissing: "Tanggal terbit belum tersedia.",
    notAvailable: "Belum tersedia"
  },
  en: {
    navHome: "Home", navAbout: "About", navCurrent: "Current Issue", navArchive: "Archives",
    navEditorial: "Editorial Team", navReviewers: "Reviewers", navGuidelines: "Author Guidelines",
    navEthics: "Publication Ethics", navContact: "Contact",
    skipToContent: "Skip to content", menu: "Menu", closeMenu: "Close menu",
    languageLabel: "Change language", language: "ID",
    home: "Home", loading: "Loading…", loadError: "Data could not be loaded.",
    loadErrorHint: "Check the data files or reload the page.",
    notFound: "Not found.", emptyArticles: "No articles have been published yet.",
    untitled: "Untitled", viewArticle: "View article", openPdf: "Open PDF",
    downloadPdf: "Download PDF", searchArticles: "Search articles", searchPlaceholder: "Search title, author, or keyword…",
    searchButton: "Search", clearFilters: "Reset", proceedings: "Proceedings",
    heroEyebrow: "Proceedings of Universitas Muhammadiyah Kudus",
    heroTitle: "E-Prosiding Universitas Muhammadiyah Kudus",
    heroCopy: "A collection of scholarly articles from UMKU seminars, conferences, and academic forums. Browse, read, and download published work.",
    browseArchive: "Browse archives", guidelinesButton: "Author guidelines", journalInfo: "Journal information",
    publisherLabel: "Publisher", frequencyLabel: "Frequency", openAccessLabel: "Open access", contactLabel: "Contact",
    currentIssueTitle: "Current issue", currentIssueCopy: "The most recent issue available in the repository.",
    currentIssueEmpty: "No issue has been published yet.",
    latestTitle: "Latest articles", latestCopy: "Recent publications across all issues.",
    latestEmpty: "No recent articles yet.", latestAll: "View all articles",
    statsLabel: "Publication statistics", statsArticles: "Published articles", statsYears: "Publication years", statsIssues: "Issues",
    editions: "issues", issuesCount: "issues",
    archiveTitle: "Archives", archiveCopy: "Browse issues by year, volume, and number.",
    archiveLink: "View full archive", aboutTitle: "About the proceedings",
    aboutMore: "Read more", contactButton: "Contact us", footerExplore: "Explore",
    footerPublisher: "Publisher", footerContact: "Contact", footerRights: "All rights reserved.",
    footerManaged: "Managed by Universitas Muhammadiyah Kudus.",
    archiveEyebrow: "Archives", archiveHeading: "Issue archive",
    issuesTitle: "Issues", issuesCopy: "Proceedings grouped by publication year.",
    noIssues: "No issue has been published yet.", viewIssue: "View issue",
    searchTitle: "Search articles", searchCopy: "Search by title, author, abstract, or keyword.",
    filterYear: "Year", allYears: "All years", filterVolume: "Volume", allVolumes: "All volumes",
    filterIssue: "Number", allIssues: "All numbers", resultsFound: "articles found",
    noResults: "No article matches your search.", showMore: "Show {n} more articles",
    issueEyebrow: "Issue", issueNotFound: "Issue not found or not yet published.",
    issueArticles: "Articles in this issue", issueEmpty: "No articles in this issue yet.",
    articleCount: "articles", publishedOn: "Published", volume: "Volume", issueNumber: "Number",
    articleEyebrow: "Article", articleNotFound: "Article not found or not yet published.",
    abstract: "Abstract", authors: "Authors", keywords: "Keywords", affiliations: "Affiliations",
    publicationDate: "Publication date", pages: "Pages", doi: "DOI", articleId: "Article ID",
    metadata: "Article information", citationTitle: "Cite this article", citationAPA: "APA", citationIEEE: "IEEE",
    copy: "Copy", copied: "Copied", copyFailed: "Copy failed", pdfTitle: "PDF document",
    pdfFallback: "If the PDF does not display in your browser, use the open or download link above.",
    pdfUnavailable: "No PDF document is available for this article.",
    backToArchive: "Back to archives", backToIssue: "Back to issue",
    editorialEyebrow: "Editorial", editorialTitle: "Editorial team",
    editorialCopy: "The editorial team responsible for the proceedings.",
    editorInChief: "Editor-in-Chief", managingEditor: "Managing Editor", editorialBoard: "Editorial Board",
    reviewersTitle: "Reviewers", reviewersCopy: "Directory of reviewers involved in manuscript review.",
    noEditors: "The editorial team has not been published yet.", noReviewers: "The reviewer directory has not been published yet.",
    affiliation: "Affiliation", expertise: "Expertise", email: "Email",
    aboutEyebrow: "About", aboutPageTitle: "About the proceedings",
    aboutPageCopy: "Information about the focus, scope, and organisation of the proceedings.",
    ethicsEyebrow: "Publication Ethics", ethicsTitle: "Publication ethics",
    ethicsCopy: "Guidance for authors, editors, and reviewers.",
    guidelinesEyebrow: "Author Guidelines", guidelinesTitle: "Author guidelines",
    guidelinesCopy: "Requirements for preparing and submitting manuscripts.",
    adminMarker: "This section has not been filled in by the administrator.",
    contactEyebrow: "Contact", contactTitle: "Contact",
    contactCopy: "Official information from the publisher and proceedings office.",
    contactInstitution: "Institution", contactPublisher: "Publisher", contactAddress: "Address",
    contactEmail: "Email", contactPhone: "Phone", contactWebsite: "Website",
    contactEmpty: "Contact information is not available yet.",
    issueDateMissing: "Publication date not available.",
    notAvailable: "Not available"
  }
};

let currentLanguage = "id";
try {
  const stored = localStorage.getItem("umku-language");
  if (stored && I18N[stored]) currentLanguage = stored;
} catch (error) {
  /* Storage can be blocked; fall back to Indonesian. */
}
const dataCache = {};
let siteData = {};

function t(key) {
  return (I18N[currentLanguage] && I18N[currentLanguage][key]) || I18N.id[key] || key;
}

function asset(path) {
  return new URL(String(path || "").replace(/^\/+/, ""), BASE_URL).href;
}

function articleUrl(id) {
  return new URL(`article.html?id=${encodeURIComponent(id)}`, BASE_URL).href;
}

function issueUrl(id) {
  return new URL(`issue.html?id=${encodeURIComponent(id)}`, BASE_URL).href;
}

function archiveUrl(params = {}) {
  const url = new URL("archive.html", BASE_URL);
  Object.keys(params).forEach(key => {
    if (params[key]) url.searchParams.set(key, params[key]);
  });
  return url.href;
}

function pdfUrl(path) {
  const value = cleanValue(path);
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return "";
  return asset(value);
}

function siteField(key) {
  return cleanValue(siteData[key]);
}

async function loadJSON(name) {
  if (name in dataCache) return dataCache[name];
  const response = await fetch(asset(ENDPOINTS[name]));
  if (!response.ok) throw new Error(`${response.status} ${ENDPOINTS[name]}`);
  dataCache[name] = await response.json();
  return dataCache[name];
}

async function loadList(name) {
  try {
    const value = await loadJSON(name);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function loadObject(name) {
  try {
    const value = await loadJSON(name);
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function loadSite() {
  if (Object.keys(siteData).length) return siteData;
  const value = await loadObject("site");
  siteData = value || {};
  return siteData;
}

function publishedArticles(articles) {
  return (Array.isArray(articles) ? articles : []).filter(article => article && article.published === true);
}

function publishedIssues(issues) {
  return (Array.isArray(issues) ? issues : []).filter(issue => issue && issue.published === true);
}

function issueNumberText(issue) {
  if (!issue) return "";
  const parts = [];
  if (cleanValue(issue.volume)) parts.push(`${t("volume")} ${cleanValue(issue.volume)}`);
  if (cleanValue(issue.issue)) parts.push(`${t("issueNumber")} ${cleanValue(issue.issue)}`);
  return parts.join(", ");
}

function issueDisplayTitle(issue) {
  if (!issue) return t("proceedings");
  return cleanValue(issue.title) || `${t("proceedings")} ${cleanValue(issue.year)}`.trim();
}

function issueContainer(issue) {
  return [issueDisplayTitle(issue), issueNumberText(issue)].filter(Boolean).join(", ");
}

function currentIssue(issues) {
  return sortIssues(publishedIssues(issues))[0] || null;
}

function articlesForIssue(articles, issueId) {
  return sortArticles(publishedArticles(articles).filter(article => cleanValue(article.issue_id) === cleanValue(issueId)));
}

function showEmpty(container, message, hint = "") {
  if (!container) return;
  container.innerHTML = `<div class="empty-state"><p>${escapeHTML(message)}</p>${hint ? `<p class="empty-state__hint">${escapeHTML(hint)}</p>` : ""}</div>`;
}

function showError(container, message = t("loadError")) {
  showEmpty(container, message, t("loadErrorHint"));
}

function articleCard(article) {
  const href = articleUrl(article.id);
  const year = cleanValue(article.year);
  return `<article class="article-card">
    <p class="meta-line">${year ? `<span>${escapeHTML(year)}</span>` : ""}${cleanValue(article.pages) ? `<span>${escapeHTML(t("pages"))} ${escapeHTML(article.pages)}</span>` : ""}</p>
    <h3><a href="${href}">${escapeHTML(cleanValue(article.title) || t("untitled"))}</a></h3>
    <p class="article-card__authors">${escapeHTML(formatAuthors(article.authors))}</p>
    <a class="link-arrow" href="${href}">${t("viewArticle")} <span aria-hidden="true">→</span></a>
  </article>`;
}

function articleRow(article) {
  const href = articleUrl(article.id);
  const pdf = pdfUrl(article.pdf);
  const abstract = truncate(article.abstract, 280);
  return `<article class="article-row">
    <div>
      <p class="meta-line">${cleanValue(article.year) ? `<span>${escapeHTML(article.year)}</span>` : ""}${cleanValue(article.issue_id) ? `<span>${escapeHTML(cleanValue(article.event) || t("proceedings"))}</span>` : ""}</p>
      <h3><a href="${href}">${escapeHTML(cleanValue(article.title) || t("untitled"))}</a></h3>
      <p class="article-row__authors">${escapeHTML(formatAuthors(article.authors))}</p>
      ${abstract ? `<p class="article-row__abstract">${escapeHTML(abstract)}</p>` : ""}
      <div class="action-row">
        <a class="link-arrow" href="${href}">${t("viewArticle")} <span aria-hidden="true">→</span></a>
        ${pdf ? `<a class="link-arrow" href="${escapeHTML(pdf)}" target="_blank" rel="noopener">${t("openPdf")} <span aria-hidden="true">↗</span></a>` : ""}
      </div>
    </div>
  </article>`;
}

function metaRow(label, value) {
  if (!cleanValue(value)) return "";
  return `<dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd>`;
}

function setPageMeta({ title, description, url }) {
  if (title) document.title = title;
  if (description) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && url) canonical.setAttribute("href", url);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute("content", title);
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription && description) ogDescription.setAttribute("content", description);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && url) ogUrl.setAttribute("content", url);
}

function injectArticleSchema(article, issue) {
  const pdf = pdfUrl(article.pdf);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: cleanValue(article.title),
    author: formatAuthors(article.authors) || undefined,
    datePublished: cleanValue(article.publication_date) || undefined,
    identifier: cleanValue(article.id) || undefined,
    abstract: cleanValue(article.abstract) || undefined,
    url: window.location.href,
    isPartOf: issue ? {
      "@type": "PublicationIssue",
      name: issueDisplayTitle(issue),
      issueNumber: cleanValue(issue.issue) || undefined,
      datePublished: cleanValue(issue.publication_date) || undefined
    } : undefined,
    encoding: pdf ? { "@type": "MediaObject", contentUrl: pdf, encodingFormat: "application/pdf" } : undefined
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

async function copyText(text, button) {
  const label = button.textContent;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    button.textContent = t("copied");
  } catch (error) {
    button.textContent = t("copyFailed");
  }
  window.setTimeout(() => { button.textContent = label; }, 2000);
}

function translateStatic() {
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(element => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
}

function setupMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;
  toggle.querySelector("[data-menu-label]").textContent = t("menu");
  const setOpen = open => {
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    toggle.querySelector("[data-menu-label]").textContent = open ? t("closeMenu") : t("menu");
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  nav.addEventListener("click", event => {
    if (event.target.closest("a")) setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) setOpen(false);
  });
}

function setupLanguage() {
  document.querySelectorAll("[data-lang-toggle]").forEach(button => {
    button.textContent = t("language");
    button.addEventListener("click", () => {
      const next = currentLanguage === "id" ? "en" : "id";
      try { localStorage.setItem("umku-language", next); } catch (error) { /* ignore blocked storage */ }
      window.location.reload();
    });
  });
}

async function applySite() {
  const site = await loadSite();
  if (!site) return;
  document.querySelectorAll("[data-site]").forEach(element => {
    const value = siteField(element.dataset.site);
    if (!value) {
      element.hidden = true;
      return;
    }
    element.textContent = value;
    if (element.tagName === "A") {
      if (element.dataset.site === "contact_email") element.href = `mailto:${value}`;
      if (element.dataset.site === "website") element.href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    }
  });
  document.querySelectorAll("[data-site-item]").forEach(item => {
    const field = item.querySelector("[data-site]");
    if (field && (!siteField(field.dataset.site) || field.hidden)) item.hidden = true;
  });
  const logo = siteField("logo");
  const slot = document.querySelector("[data-logo]");
  if (logo && slot) slot.innerHTML = `<img src="${escapeHTML(asset(logo))}" alt="" width="40" height="40">`;
}

function initShell() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-year]").forEach(element => {
    element.textContent = new Date().getFullYear();
  });
  translateStatic();
  setupMenu();
  setupLanguage();
  applySite();
}

document.addEventListener("DOMContentLoaded", initShell);
