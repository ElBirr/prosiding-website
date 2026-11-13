document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  const target = document.getElementById("team-list");
  if (!target) return;

  const isEditors = page === "editorial-team";
  const people = await loadList(isEditors ? "editors" : "reviewers");
  if (people === null) {
    showError(target);
    return;
  }

  const valid = people.filter(person => person && cleanValue(person.name));
  if (!valid.length) {
    showEmpty(target, isEditors ? t("noEditors") : t("noReviewers"));
    return;
  }

  const personCard = person => {
    const meta = [
      cleanValue(person.expertise) ? `${t("expertise")}: ${escapeHTML(person.expertise)}` : "",
      cleanValue(person.country) ? escapeHTML(person.country) : ""
    ].filter(Boolean).join(" · ");
    const orcid = cleanValue(person.orcid);
    const email = cleanValue(person.email);
    const links = [
      orcid ? `<a href="https://orcid.org/${escapeHTML(orcid)}" target="_blank" rel="noopener">ORCID</a>` : "",
      email ? `<a href="mailto:${escapeHTML(email)}">${escapeHTML(email)}</a>` : ""
    ].filter(Boolean).join(" ");
    return `<article class="person-card">
      <h3>${escapeHTML(person.name)}</h3>
      ${cleanValue(person.affiliation) ? `<p class="muted">${escapeHTML(person.affiliation)}</p>` : ""}
      ${meta ? `<p class="person-card__meta">${meta}</p>` : ""}
      ${links ? `<p class="person-card__meta">${links}</p>` : ""}
      ${cleanValue(person.bio) ? `<p class="person-card__bio">${escapeHTML(person.bio)}</p>` : ""}
    </article>`;
  };

  if (!isEditors) {
    target.innerHTML = `<div class="person-grid">${valid.map(personCard).join("")}</div>`;
    return;
  }

  const roles = [
    ["editor-in-chief", t("editorInChief")],
    ["managing-editor", t("managingEditor")],
    ["editorial-board", t("editorialBoard")]
  ];
  const known = roles.map(([role, label]) => [role, label, valid.filter(person => cleanValue(person.role) === role)]);
  const other = valid.filter(person => !roles.some(([role]) => cleanValue(person.role) === role));
  if (other.length) known.push(["", t("editorialBoard"), other]);

  target.innerHTML = known.filter(([, , members]) => members.length).map(([, label, members]) => `<section class="team-group">
    <h2 class="section-title">${escapeHTML(label)}</h2>
    <div class="person-grid">${members.map(personCard).join("")}</div>
  </section>`).join("");
});
