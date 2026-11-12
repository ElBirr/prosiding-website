#!/usr/bin/env python3
"""Generate sitemap.xml from the static pages and the published data."""

import json
import os
import sys
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FALLBACK_BASE = "https://elbirr.github.io/prosiding-website/"
STATIC_PAGES = [
    ("", "1.0"),
    ("archive.html", "0.9"),
    ("issue.html", "0.8"),
    ("about.html", "0.7"),
    ("author-guidelines.html", "0.7"),
    ("ethics.html", "0.6"),
    ("editorial-team.html", "0.6"),
    ("reviewers.html", "0.6"),
    ("contact.html", "0.5"),
]


def load(name):
    with open(os.path.join(ROOT, "data", name), encoding="utf-8") as handle:
        return json.load(handle)


def main():
    try:
        site = load("site.json")
        articles = load("articles.json")
        issues = load("issues.json")
    except (OSError, json.JSONDecodeError) as error:
        print(f"Cannot build sitemap: {error}")
        return 1

    base = (site.get("base_url") or FALLBACK_BASE).strip()
    if not base.endswith("/"):
        base += "/"

    urls = [(base + path, priority) for path, priority in STATIC_PAGES]
    for issue in issues:
        if isinstance(issue, dict) and issue.get("published") is True and issue.get("id"):
            urls.append((f"{base}issue.html?id={quote(str(issue['id']))}", "0.7"))
    for article in articles:
        if isinstance(article, dict) and article.get("published") is True and article.get("id"):
            urls.append((f"{base}article.html?id={quote(str(article['id']))}", "0.8"))

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for url, priority in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(url)}</loc>")
        lines.append(f"    <priority>{priority}</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")

    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as handle:
        handle.write("\n".join(lines) + "\n")
    print(f"Sitemap written: {len(urls)} URLs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
