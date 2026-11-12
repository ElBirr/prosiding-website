document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  const target = document.getElementById("page-sections");
  if (!target || !page) return;

  if (page === "contact") {
    const site = await loadSite();
    if (!site) {
      showError(target);
      return;
    }
    const rows = [
      ["contactInstitution", site.institution],
      ["contactPublisher", site.publisher],
      ["contactAddress", site.address],
      ["contactEmail", site.contact_email, site.contact_email ? `mailto:${cleanValue(site.contact_email)}` : ""],
      ["contactPhone", site.contact_phone, cleanValue(site.contact_phone) ? `tel:${cleanValue(site.contact_phone).replace(/\s+/g, "")}` : ""],
      ["contactWebsite", site.website, cleanValue(site.website) ? (/^https?:\/\//i.test(cleanValue(site.website)) ? cleanValue(site.website) : `https://${cleanValue(site.website)}`) : ""]
    ].filter(row => cleanValue(row[1]));
    if (!rows.length) {
      showEmpty(target, t("contactEmpty"));
      return;
    }
    target.innerHTML = `<div class="panel"><dl class="meta-list">
      ${rows.map(([label, value, href]) => `<dt>${escapeHTML(t(label))}</dt><dd>${href ? `<a href="${escapeHTML(href)}">${escapeHTML(value)}</a>` : escapeHTML(value)}</dd>`).join("")}
    </dl></div>`;
    return;
  }

  const [data, site] = await Promise.all([loadObject(page), loadSite()]);
  if (data === null) {
    showError(target);
    return;
  }

  const sections = Array.isArray(data.sections) ? data.sections.filter(section => section && cleanValue(section.heading)) : [];
  if (!sections.length) {
    showEmpty(target, t("notAvailable"));
  } else {
    target.innerHTML = sections.map(section => {
      const body = cleanValue(section.body);
      const isMarker = !body || /^\[TO BE COMPLETED/i.test(body);
      const paragraphs = isMarker
        ? `<p class="admin-marker">${t("adminMarker")}</p>`
        : body.split(/\n{2,}/).map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join("");
      return `<section class="prose-block"><h2>${escapeHTML(section.heading)}</h2>${paragraphs}</section>`;
    }).join("");
  }

  if (page !== "about" || !site) return;
  const info = [
    ["publisherLabel", site.publisher],
    ["frequencyLabel", site.frequency],
    ["openAccessLabel", site.open_access],
    ["contactLabel", site.contact_email],
    ["contactWebsite", site.website]
  ].filter(row => cleanValue(row[1]));
  const aside = document.getElementById("page-aside");
  if (!aside || !info.length) return;
  aside.innerHTML = `<div class="panel">
    <h2 class="panel__title">${t("journalInfo")}</h2>
    <dl class="meta-list">
      ${info.map(([label, value]) => `<dt>${escapeHTML(t(label))}</dt><dd>${escapeHTML(value)}</dd>`).join("")}
    </dl>
  </div>`;
});
