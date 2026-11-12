# UMKU Proceedings — Starter Project

Static bilingual proceedings repository for Universitas Muhammadiyah Kudus.

## Stack
- Static frontend: HTML, CSS, vanilla JavaScript
- Content store: `data/articles.json`
- PDF files: `files/pdf/`
- Admin CMS: [Pages CMS](https://app.pagescms.org/)
- Hosting: GitHub Pages + GitHub Actions

## 1. Create / use a GitHub repository
Use a repository named `umku-proceedings` (or any name you prefer).
Upload all files and folders from this project to the repository root.
The default branch should be `main`.

## 2. Enable GitHub Pages
1. Open repository **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main`, or run the workflow manually under **Actions**.
4. The public URL will look like `https://YOUR-USERNAME.github.io/umku-proceedings/`.

The included workflow validates the JSON and deploys the root directory.

## 3. Connect Pages CMS
1. Open https://app.pagescms.org/ and sign in with GitHub.
2. Install/authorize the Pages CMS GitHub App for this repository only.
3. Open the repository in Pages CMS.
4. It reads `.pages.yml` from the repository root.
5. Open **Articles** to add/edit/delete article records.
6. Upload PDFs through the PDF field. Files are saved in `files/pdf/`.
7. Set **Published** to true when the article is ready to appear publicly.
8. Save/commit. GitHub Actions will publish the update.

Important: the CMS uses GitHub access. Only authorize trusted UMKU repository editors. Do not publish confidential manuscripts or personal data that should not be public.

## 4. Article data
`data/articles.json` is a JSON array. Each object has:
- `id`: unique stable ID, e.g. `UMKU-2026-001`
- `title`
- `authors`: author names as a single string
- `year`
- `event`
- `abstract`
- `keywords`: comma-separated string
- `pdf`: relative path such as `files/pdf/umku-2026-001.pdf`
- `published`: boolean

Start with `[]`. The website only displays records where `published` is `true`.

## 5. Test locally
Because the frontend fetches JSON, open it through a local web server rather than double-clicking HTML.

With Python installed:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000/`.

## 6. Project Pages path handling
The JavaScript resolves assets and PDF paths relative to the deployed site root. This supports project URLs under `/umku-proceedings/` without hardcoding the GitHub username.

## 7. Important limitations
- GitHub Pages is static hosting: no PHP, MySQL, server-side login, or private file access.
- Pages CMS is a separate hosted admin service that commits content into GitHub.
- Files in a public repository and published site are public. Do not upload unpublished/confidential documents to a public repository.
- GitHub Pages has a published-site size limit of 1 GB and a soft bandwidth limit of 100 GB/month. Keep PDFs optimized and monitor repository size.
- This starter does not assign DOI, ISSN, ISBN, or generate formal citation identifiers.
- Browser PDF embedding depends on the visitor's browser. The Open PDF and Download PDF links remain available as fallbacks.

## 8. Before institutional launch
- Replace/confirm the official UMKU logo and institutional identity.
- Confirm permission to publish every PDF.
- Confirm article metadata against source proceedings.
- Add editorial contact and repository policy.
- Consider an institution-controlled domain later.
