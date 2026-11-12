const BASE_URL = new URL("./", window.location.href);
const DATA_URL = new URL("data/articles.json", BASE_URL);

const I18N = {
  id: {
    navHome:"Beranda", navArchive:"Arsip", navAbout:"Tentang", language:"EN",
    eyebrow:"UNIVERSITAS MUHAMMADIYAH KUDUS",
    heroTitle:"Gagasan, penelitian, dan inovasi dalam satu ruang.",
    heroCopy:"Jelajahi kumpulan artikel ilmiah yang diterbitkan dalam prosiding kegiatan akademik UMKU.",
    searchLabel:"Cari artikel", searchPlaceholder:"Cari judul, penulis, atau kata kunci...",
    searchButton:"Cari artikel", browseArchive:"Jelajahi seluruh arsip →",
    heroNote:"Knowledge grows when research is shared.",
    statArticles:"Artikel terbit", statYears:"Tahun publikasi", statEvents:"Nama prosiding",
    latestEyebrow:"PUBLIKASI", latestTitle:"Artikel terbaru", viewAll:"Lihat semua →",
    aboutEyebrow:"TENTANG REPOSITORY", aboutTitle:"Mendokumentasikan pengetahuan untuk masa depan.",
    aboutButton:"Tentang repository", archiveEyebrow:"PUSAT PUBLIKASI",
    archiveTitle:"Arsip prosiding", archiveCopy:"Telusuri artikel berdasarkan judul, penulis, tahun, atau kata kunci.",
    filterYear:"Tahun", allYears:"Semua tahun", filterEvent:"Prosiding", allEvents:"Semua prosiding",
    newestFirst:"Terbaru lebih dahulu", backArchive:"← Kembali ke arsip",
    abstract:"Abstrak", authors:"Penulis", keywords:"Kata kunci", event:"Prosiding",
    readPdf:"Buka PDF", downloadPdf:"Unduh PDF", viewArticle:"Lihat artikel",
    noArticles:"Belum ada artikel yang dipublikasikan.", noResults:"Tidak ada artikel yang cocok.",
    articleNotFound:"Artikel tidak ditemukan atau belum dipublikasikan.",
    footerText:"Repository publikasi prosiding Universitas Muhammadiyah Kudus.",
    aboutPageTitle:"Tentang UMKU Proceedings",
    aboutPageCopy:"UMKU Proceedings merupakan repository publikasi ilmiah yang menghimpun artikel-artikel dari kegiatan seminar, konferensi, dan forum akademik Universitas Muhammadiyah Kudus.",
    publisherTitle:"Penerbit",
    aboutDisclaimer:"Informasi bibliografi pada setiap artikel mengikuti metadata yang disediakan oleh pengelola prosiding. Silakan merujuk ke dokumen PDF untuk informasi lengkap.",
    resultCount:"artikel ditemukan"
  },
  en: {
    navHome:"Home", navArchive:"Archive", navAbout:"About", language:"ID",
    eyebrow:"UNIVERSITAS MUHAMMADIYAH KUDUS",
    heroTitle:"Ideas, research, and innovation in one place.",
    heroCopy:"Explore scholarly articles published in the proceedings of UMKU academic events.",
    searchLabel:"Search articles", searchPlaceholder:"Search title, author, or keyword...",
    searchButton:"Search articles", browseArchive:"Browse all archives →",
    heroNote:"Knowledge grows when research is shared.",
    statArticles:"Published articles", statYears:"Publication years", statEvents:"Proceedings",
    latestEyebrow:"PUBLICATIONS", latestTitle:"Latest articles", viewAll:"View all →",
    aboutEyebrow:"ABOUT THE REPOSITORY", aboutTitle:"Preserving knowledge for the future.",
    aboutButton:"About repository", archiveEyebrow:"PUBLICATION CENTER",
    archiveTitle:"Proceedings archive", archiveCopy:"Browse articles by title, author, year, or keyword.",
    filterYear:"Year", allYears:"All years", filterEvent:"Proceedings", allEvents:"All proceedings",
    newestFirst:"Newest first", backArchive:"← Back to archive",
    abstract:"Abstract", authors:"Authors", keywords:"Keywords", event:"Proceedings",
    readPdf:"Open PDF", downloadPdf:"Download PDF", viewArticle:"View article",
    noArticles:"No articles have been published yet.", noResults:"No matching articles found.",
    articleNotFound:"Article not found or not yet published.",
    footerText:"Proceedings publication repository of Universitas Muhammadiyah Kudus.",
    aboutPageTitle:"About UMKU Proceedings",
    aboutPageCopy:"UMKU Proceedings is a scholarly publication repository that collects articles from seminars, conferences, and academic forums organized by Universitas Muhammadiyah Kudus.",
    publisherTitle:"Publisher",
    aboutDisclaimer:"Bibliographic information follows the metadata supplied by the proceedings manager. Please refer to the PDF for complete information.",
    resultCount:"articles found"
  }
};

let currentLanguage = localStorage.getItem("umku-language") || "id";
let allArticles = [];

function t(key) { return I18N[currentLanguage][key] || key; }
function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}
function asset(path) { return new URL(path.replace(/^\/+/, ""), BASE_URL).href; }
function articleUrl(id) { return new URL(`article.html?id=${encodeURIComponent(id)}`, BASE_URL).href; }
function pdfUrl(path) {
  if (!path) return "#";
  if (/^https?:\/\//i.test(path)) return path;
  return asset(path);
}
function renderShell() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  if (header) header.innerHTML = `
    <header class="site-header"><div class="container nav-wrap">
      <a class="brand" href="${asset("index.html")}"><span class="brand-symbol">U</span><span><strong>UMKU</strong><small>PROCEEDINGS</small></span></a>
      <nav class="main-nav" aria-label="Main navigation">
        <a href="${asset("index.html")}">${t("navHome")}</a>
        <a href="${asset("archive.html")}">${t("navArchive")}</a>
        <a href="${asset("about.html")}">${t("navAbout")}</a>
      </nav>
      <button class="language-toggle" id="language-toggle" type="button" aria-label="Change language">${t("language")}</button>
    </div></header>`;
  if (footer) footer.innerHTML = `
    <footer class="site-footer"><div class="container footer-inner">
      <a class="brand brand-footer" href="${asset("index.html")}"><span class="brand-symbol">U</span><span><strong>UMKU</strong><small>PROCEEDINGS</small></span></a>
      <p>${t("footerText")}</p><span>© ${new Date().getFullYear()} UMKU</span>
    </div></footer>`;
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[currentLanguage][key]) el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  document.getElementById("language-toggle")?.addEventListener("click", () => {
    currentLanguage = currentLanguage === "id" ? "en" : "id";
    localStorage.setItem("umku-language", currentLanguage);
    location.reload();
  });
}
async function loadArticles() {
  if (allArticles.length) return allArticles;
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error("Gagal membaca data artikel.");
  const data = await response.json();
  allArticles = Array.isArray(data) ? data : [];
  return allArticles;
}
function publishedArticles() {
  return allArticles.filter(item => item.published === true);
}
function formatAuthors(authors) {
  if (Array.isArray(authors)) return authors.join(", ");
  return authors || "—";
}
function articleCard(article) {
  const title = escapeHTML(article.title || "Untitled");
  const authors = escapeHTML(formatAuthors(article.authors));
  const event = escapeHTML(article.event || "UMKU Proceedings");
  const year = escapeHTML(article.year || "");
  return `<article class="article-card">
    <div class="article-card-meta"><span>${year}</span><span>${event}</span></div>
    <h3><a href="${articleUrl(article.id)}">${title}</a></h3>
    <p class="article-authors">${authors}</p>
    <a class="text-link" href="${articleUrl(article.id)}">${t("viewArticle")} →</a>
  </article>`;
}
function showEmpty(container, message) {
  container.innerHTML = `<div class="empty-state">${escapeHTML(message)}</div>`;
}
renderShell();
