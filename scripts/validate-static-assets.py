#!/usr/bin/env python3
"""Validate local asset references used by the public static site."""
from pathlib import Path
from urllib.parse import urlsplit
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PAGES = [
    'index.html', 'standalone.html', 'contact.html', 'faq.html',
    'how-to-recharge.html', 'privacy.html', 'refund.html', 'terms.html',
]
SKIP_PREFIXES = ('http://', 'https://', 'mailto:', 'tel:', 'data:', 'javascript:')
missing = []
checked = set()


def check_ref(raw: str, source: Path) -> None:
    raw = raw.strip().strip('"\'')
    if not raw or raw.startswith(('#', '/#')) or raw.startswith(SKIP_PREFIXES):
        return
    path = urlsplit(raw).path
    if not path:
        return
    target = ROOT / path.lstrip('/')
    checked.add(str(target.relative_to(ROOT)))
    if not target.is_file():
        missing.append(f'{source.relative_to(ROOT)} -> {raw}')


for page_name in PUBLIC_PAGES:
    page = ROOT / page_name
    if not page.is_file():
        missing.append(f'{page_name} -> page missing')
        continue
    text = page.read_text(encoding='utf-8')
    for match in re.finditer(r'\b(?:src|href)\s*=\s*["\']([^"\']+)', text, re.I):
        check_ref(match.group(1), page)
    for match in re.finditer(r'\bsrcset\s*=\s*["\']([^"\']+)', text, re.I):
        for candidate in match.group(1).split(','):
            check_ref(candidate.strip().split()[0], page)
    for match in re.finditer(r'url\(\s*["\']?([^\)"\']+)', text, re.I):
        check_ref(match.group(1), page)

if missing:
    print('Missing local asset references:', file=sys.stderr)
    print('\n'.join(sorted(set(missing))), file=sys.stderr)
    raise SystemExit(1)

print(f'Validated {len(PUBLIC_PAGES)} public pages and {len(checked)} local references; no missing assets.')
