#!/usr/bin/env python3
"""Validate the JSON data files before deployment. No third-party dependencies."""

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ERRORS = []


def load(name):
    path = os.path.join(ROOT, "data", name)
    try:
        with open(path, encoding="utf-8") as handle:
            return json.load(handle), path
    except FileNotFoundError:
        ERRORS.append(f"missing file: data/{name}")
    except json.JSONDecodeError as error:
        ERRORS.append(f"invalid JSON in data/{name}: {error}")
    return None, path


def require(value, label):
    if value is None or (isinstance(value, str) and not value.strip()):
        ERRORS.append(f"{label} is required")
        return False
    return True


def check_list(name, required_fields):
    items, path = load(name)
    if not isinstance(items, list):
        if items is not None:
            ERRORS.append(f"{path} must contain a JSON array")
        return []
    seen = set()
    for index, item in enumerate(items):
        if not isinstance(item, dict):
            ERRORS.append(f"data/{name}[{index}] must be an object")
            continue
        for field in required_fields:
            require(item.get(field), f"data/{name}[{index}].{field}")
        item_id = item.get("id")
        if item_id:
            if item_id in seen:
                ERRORS.append(f"data/{name}: duplicate id '{item_id}'")
            seen.add(item_id)
    return items


def check_sections(name):
    value, path = load(name)
    if not isinstance(value, dict):
        if value is not None:
            ERRORS.append(f"{path} must contain a JSON object")
        return
    sections = value.get("sections")
    if not isinstance(sections, list):
        ERRORS.append(f"data/{name}.sections must be an array")
        return
    for index, section in enumerate(sections):
        if not isinstance(section, dict):
            ERRORS.append(f"data/{name}.sections[{index}] must be an object")
            continue
        require(section.get("heading"), f"data/{name}.sections[{index}].heading")


def main():
    articles = check_list("articles.json", ["id", "title", "authors", "year", "pdf"])
    issues = check_list("issues.json", ["id", "title", "year"])
    check_list("editors.json", ["name"])
    check_list("reviewers.json", ["name"])
    for page in ("page-about.json", "page-ethics.json", "page-guidelines.json"):
        check_sections(page)

    site, site_path = load("site.json")
    if site is not None and not isinstance(site, dict):
        ERRORS.append(f"{site_path} must contain a JSON object")

    issue_ids = {issue.get("id") for issue in issues if isinstance(issue, dict)}
    for index, article in enumerate(articles):
        if not isinstance(article, dict):
            continue
        label = f"data/articles.json[{index}] ('{article.get('id', '?')}')"
        pdf = article.get("pdf")
        if pdf and not os.path.isfile(os.path.join(ROOT, pdf)):
            ERRORS.append(f"{label}: pdf file not found: {pdf}")
        issue_id = article.get("issue_id")
        if issue_id and issue_id not in issue_ids:
            ERRORS.append(f"{label}: issue_id '{issue_id}' does not match any issue")
        if not isinstance(article.get("published"), bool):
            ERRORS.append(f"{label}: published must be true or false")

    for issue in issues:
        if isinstance(issue, dict) and not isinstance(issue.get("published"), bool):
            ERRORS.append(f"data/issues.json ('{issue.get('id', '?')}'): published must be true or false")

    if ERRORS:
        print("Data validation failed:")
        for error in ERRORS:
            print(f"  - {error}")
        return 1
    print(
        f"Data OK: {len(articles)} article(s), {len(issues)} issue(s), "
        f"{len(issue_ids)} issue id(s)."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
