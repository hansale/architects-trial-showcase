"""Validate the static showcase's entry point, anchors and asset references."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1] / "site"


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs = set(), []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs["id"])
        for name in ("src", "href", "data-gif"):
            if attrs.get(name):
                self.refs.append(attrs[name])
        if tag == "img":
            assert "alt" in attrs, "Image without alt attribute"


page = References()
page.feed((ROOT / "index.html").read_text(encoding="utf-8"))
page.refs += re.findall(r"url\(['\"]?([^)'\"]+)", (ROOT / "styles.css").read_text(encoding="utf-8"))
for ref in page.refs:
    url = urlsplit(ref)
    if url.scheme or url.netloc:
        continue
    if not url.path:
        assert not url.fragment or unquote(url.fragment) in page.ids, f"Missing anchor: {ref}"
        continue
    assert not url.path.startswith("/"), f"Root-relative URL breaks project Pages: {ref}"
    target = ROOT / unquote(url.path)
    assert target.is_file() and target.resolve().is_relative_to(ROOT.resolve()), f"Missing or unsafe asset: {ref}"
    # Check on Windows too: Pages runs on a case-sensitive filesystem.
    current = ROOT
    for part in Path(unquote(url.path)).parts:
        assert part in {p.name for p in current.iterdir()}, f"Filename case mismatch: {ref}"
        current = current / part
for file in ROOT.rglob("*"):
    assert not file.is_symlink(), f"Unexpected symlink: {file}"
    if file.is_file():
        assert file.stat().st_size < 100_000_000, f"Asset exceeds GitHub file limit: {file}"
assert (ROOT / ".nojekyll").is_file()
print(f"Showcase OK: {len(page.ids)} unique IDs and {len(page.refs)} valid references.")
