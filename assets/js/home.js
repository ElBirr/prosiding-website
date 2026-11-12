document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("latest-articles");
  try {
    await loadArticles();
    const articles = publishedArticles().sort((a,b) => Number(b.year || 0) - Number(a.year || 0));
    document.getElementById("stat-articles").textContent = articles.length;
    document.getElementById("stat-years").textContent = new Set(articles.map(a => a.year).filter(Boolean)).size;
    document.getElementById("stat-events").textContent = new Set(articles.map(a => a.event).filter(Boolean)).size;
    if (!articles.length) showEmpty(grid, t("noArticles"));
    else grid.innerHTML = articles.slice(0,6).map(articleCard).join("");
  } catch (error) {
    showEmpty(grid, "Data artikel belum dapat dimuat. Periksa data/articles.json.");
    console.error(error);
  }
  document.getElementById("hero-search")?.addEventListener("submit", event => {
    event.preventDefault();
    const query = document.getElementById("hero-query").value.trim();
    location.href = new URL(`archive.html?q=${encodeURIComponent(query)}`, BASE_URL).href;
  });
});
