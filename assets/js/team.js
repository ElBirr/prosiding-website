document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  const target = document.getElementById("team-list");
  if (!target) return;

  const isEditors = page === "editorial-team";
  const people = (await loadList(isEditors ? "editors" : "reviewers") || [])
    .filter(person => person && cleanValue(person.name));

  if (!people.length) {
    showEmpty(target, isEditors ? t("noEditors") : t("noReviewers"));
    return;
  }

  if (!isEditors) {
    target.innerHTML = `<div class="person-grid">${people.map(person => `<article class="person-card">
      <h3>${escapeHTML(person.name)}</h3>
      ${cleanValue(person.affiliation) ? `<p class="muted">${escapeHTML(person.affiliation)}</p>` : ""}
      ${cleanValue(person.expertise) ? `<p class="person-card__meta"><span>${t("expertise")}:</span> ${escapeHTML(person.expertise)}</p>` : ""}
    </article>`).join("")}</div>`;
    return;
  }

  const roles = [
    ["editor-in-chief", t("editorInChief")],
    ["managing-editor", t("managingEditor")],
    ["editorial-board", t("editorialBoard")]
  ];
  const known = roles.map(([role, label]) => [role, label, people.filter(person => cleanValue(person.role) === role)]);
  const other = people.filter(person => !roles.some(([role]) => cleanValue(person.role) === role));
  if (other.length) known.push(["", t("editorialBoard"), other]);

  target.innerHTML = known.filter(([, , members]) => members.length).map(([, label, members]) => `<section class="team-group">
    <h2 class="section-title">${escapeHTML(label)}</h2>
    <div class="person-grid">${members.map(person => `<article class="person-card">
      <h3>${escapeHTML(person.name)}</h3>
      ${cleanValue(person.affiliation) ? `<p class="muted">${escapeHTML(person.affiliation)}</p>` : ""}
      ${cleanValue(person.email) ? `<p class="person-card__meta"><a href="mailto:${escapeHTML(cleanValue(person.email))}">${escapeHTML(person.email)}</a></p>` : ""}
    </article>`).join("")}</div>
  </section>`).join("");
});
