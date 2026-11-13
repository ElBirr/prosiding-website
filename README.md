# E-Prosiding Universitas Muhammadiyah Kudus

Academic proceedings repository for Universitas Muhammadiyah Kudus. Static
website (HTML, CSS, vanilla JavaScript), JSON content, Pages CMS for editing,
PDF files stored in the repository, hosted on GitHub Pages.

- Public URL: `https://elbirr.github.io/prosiding-website/`
- No build step and no runtime server: the files you see are the files deployed.
- Bilingual interface (Indonesian/English) via the language switch in the top bar.
  Editorial and policy content is written by the administrator in Indonesian.

## Site map

| File | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, search, statistics, current issue, latest articles, archive years |
| `archive.html` | Issue archive grouped by year plus article search/filter |
| `issue.html` | One issue and its article list (`?id=<issue id>`) |
| `article.html` | Article detail, metadata, APA/IEEE citations, PDF viewer (`?id=<article id>`) |
| `about.html` | About the proceedings (`data/page-about.json`) |
| `editorial-team.html` | Editorial team (`data/editors.json`) |
| `reviewers.html` | Reviewer directory (`data/reviewers.json`) |
| `ethics.html` | Publication ethics (`data/page-ethics.json`) |
| `author-guidelines.html` | Author guidelines (`data/page-guidelines.json`) |
| `contact.html` | Contact details from `data/site.json` |

Supporting files:

- `assets/css/style.css` — all styles and responsive behaviour.
- `assets/js/lib.js` — pure helpers (filtering, sorting, citations). Also loaded by tests.
- `assets/js/app.js` — shared shell: language switch, menu, data loading, cards, metadata.
- `assets/js/<page>.js` — one script per page.
- `data/*.json` — all editable content.
- `files/pdf/` — article PDFs. **Do not move or rename this folder.**
- `scripts/validate_data.py` — data check used locally and in CI.
- `scripts/generate_sitemap.py` — writes `sitemap.xml` during deployment.
- `tests/lib.test.cjs` — Node tests for the helpers.

## Article and issue data

`data/articles.json` is an array. Fields:

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Stable unique ID, e.g. `001`. Used in `article.html?id=001`, never reuse it. |
| `title` | yes | Full article title. |
| `authors` | yes | List of author objects. Each needs `name`; `affiliation`, `country`, `orcid`, `email` and `bio` are optional and shown in the Author Biographies section. |
| `abstract` | yes | Plain text. |
| `year` | yes | Number. |
| `pdf` | yes | Relative path, e.g. `files/pdf/260315900v1.pdf`. |
| `published` | yes | Boolean. Only `true` records are shown. |
| `subtitle` | no | Shown under the title. |
| `language` | no | Article language, e.g. `en` or `id`. |
| `issue_id` | no | Must match an `id` in `data/issues.json`. |
| `affiliations`, `keywords`, `volume`, `issue`, `pages`, `doi`, `publication_date`, `event` | no | Empty values are hidden in the interface. |

`doi` is stored without the `https://doi.org/` prefix. `keywords` is a
comma-separated string. `publication_date` is ISO `YYYY-MM-DD`.

`data/issues.json` fields: `id`, `title`, `year`, `volume`, `issue`,
`publication_date`, `description`, `published`. Volume and issue may be empty;
they are omitted from the interface when blank.

Article `001` ("The Internet of Physical AI Agents…", Roberto Morabito and
Mallik Tatipamula, 2026, `files/pdf/260315900v1.pdf`) is live content. Do not
delete it, rename its `id`, or change its `pdf` path.

## Editing with Pages CMS

1. Sign in at <https://app.pagescms.org/> with GitHub.
2. Install the Pages CMS GitHub App for this repository only.
3. Open the repository in Pages CMS. It reads `.pages.yml` from the root.
4. Available sections:
   - **Articles** — metadata, issue assignment and PDF upload (`files/pdf`).
   - **Issues** — issue title, year, volume, number, description, published flag.
   - **Site settings** — institution, publisher, contact, frequency, open access, logo.
   - **Editorial team** and **Reviewers** — repeatable person entries.
   - **Page — About / Publication ethics / Author guidelines** — repeatable
     heading + body sections.
5. Set **Published** to true only when content is ready to appear publicly.
6. Save. Pages CMS commits to `main` and GitHub Actions redeploys the site.

Only give CMS/GitHub access to trusted editors. Everything in a public
repository is public: never upload confidential manuscripts or personal data.

## Administrator checklist (currently incomplete)

The site intentionally hides empty data and marks unfinished policy sections
with *"Bagian ini belum diisi oleh pengelola."* Fill these in Pages CMS:

- [ ] `data/site.json`: `contact_email`, `contact_phone`, `address`, `website`,
      `frequency`, `open_access`, optional `logo`.
- [ ] `data/editors.json`: editor-in-chief, managing editor, editorial board (name, affiliation, country, ORCID, email, expertise, bio).
- [ ] `data/reviewers.json`: reviewer names, affiliations, expertise, country, ORCID, email, bio.
- [ ] `data/page-about.json`: focus and scope, open access policy, frequency.
- [ ] `data/page-ethics.json`: all seven ethics sections.
- [ ] `data/page-guidelines.json`: all seven guideline sections.
- [ ] Confirm permission to publish every PDF and verify each article's metadata.
- [ ] Create real issues before assigning `issue_id` to new articles.

Do not fill these fields with placeholder institution names, invented editors,
invented reviewers, or invented policy text.

## Local development

The pages fetch JSON, so use a local web server (not `file://`):

```bash
python -m http.server 8000
```

Open <http://localhost:8000/>. The site also works from the
`/prosiding-website/` subpath because all links are relative.

Checks (same as CI):

```bash
python scripts/validate_data.py
python scripts/generate_sitemap.py
node --test tests/lib.test.cjs
```

`validate_data.py` checks JSON syntax, required fields, duplicate IDs, issue
references, and that every referenced PDF exists. `generate_sitemap.py` writes
`sitemap.xml` from the published articles and issues. Deploy the site only from
the repository root; the JSON and PDF paths are part of the public contract.

## Deployment

1. Repository **Settings → Pages → Build and deployment → Source**:
   **GitHub Actions**.
2. Push to `main` or run **Actions → Deploy UMKU Proceedings to GitHub Pages**
   manually.
3. The workflow validates data, runs the helper tests, builds `sitemap.xml`,
   uploads the repository root, and deploys it.

If the repository name or owner changes, update:

- `data/site.json` → `base_url`
- `robots.txt` → `Sitemap:` line
- canonical/Open Graph URLs in the HTML files (search for
  `https://elbirr.github.io/prosiding-website/`).
- `scripts/generate_sitemap.py` → `FALLBACK_BASE` (only used when
  `base_url` is empty).

## SEO and accessibility

- Every page has a unique title, meta description, canonical URL, Open Graph
  tags, and the site language attribute.
- Article and issue pages update title, description, canonical/OG URL, and
  article JSON-LD from the data.
- One `h1` per page, landmarks (`header`, `nav`, `main`, `footer`), skip link,
  keyboard-operable menu, visible focus styles, `aria-current` navigation,
  live search result count, and a `<noscript>` notice.
- The PDF viewer is an `<iframe>` with Open/Download links as fallback.

## Known limitations

- Static hosting only: no server-side login, submission workflow, or private files.
- No DOI/ISSN/ISBN assignment. DOI is displayed only when entered in the data.
- Citation strings are generated in the browser; they are not peer-reviewed metadata.
- Interface translations cover navigation and UI labels. Page content and
  abstracts are shown as written (Indonesian or English).
- PDF rendering depends on the visitor's browser and device.
- GitHub Pages limits: 1 GB published site, ~100 GB/month bandwidth. Keep PDFs optimized.
