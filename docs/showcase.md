# The Architect's Trial showcase

The complete static website is in `site/`. It has no npm dependencies, build
step, backend, analytics, external font requests, or game-runtime requirements.
All production media is checked in. The website does not load ignored QA files.

## Preview

From the repository root:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory site
```

Open <http://127.0.0.1:4173/>. Stop the server with Ctrl+C when finished.

## Publish on GitHub Pages

1. Push this repository, including `site/`, `scripts/check-showcase.py`, and
   `.github/workflows/pages.yml`, to your GitHub repository. Merge the showcase
   onto `main` or `master` (or adjust the workflow's branch list).
2. In **Settings → Pages → Build and deployment**, set **Source** to
   **GitHub Actions**.
3. Open **Actions → Publish showcase to GitHub Pages → Run workflow**. Later
   changes to the website on `main` or `master` deploy automatically.
4. The completed deployment supplies the published URL. Only `site/` is
   uploaded; game binaries, saves, private QA reports, and development files
   are excluded.

These steps follow [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

An export ZIP is provided locally at
`artifacts/architects-trial-github-pages.zip`. It contains `site/`, the workflow,
the static checker, and these instructions, for a separate showcase repository.
Unzip it at the repository root, retaining the `.github` directory.

## Repository and release links

`site/site-config.js` points to `hansale/architects-trial-showcase`, the dedicated
website repository. Its `showReleases: false` setting keeps the mod-release
button hidden until a public mod release is available. The visible source link
is explicitly labeled Website source.

For another deployment, `repositoryUrl` is optional. On a normal
`OWNER.github.io/REPOSITORY/` address the site discovers the repository from the
URL. A custom domain, a separate showcase repository pointing to the mod repo,
or a local preview should set the explicit mod repository URL there. An optional
`releaseTag` directs visitors to a particular release.

Without an identifiable repository, release/source buttons stay hidden while
the installation instructions remain available. The site does not claim a
public release exists or fabricate a download URL. The mod is currently
`0.1.1-private.4`, and the page labels it as a private playtest.

## Content and media

- Edit the page content in `site/index.html` and the style in `site/styles.css`.
- Potion effects and gallery behavior are in `site/script.js`. Keep visible
  version numbers, effects, and compatibility information aligned with README.
- GIFs are three real screenshot sequences, not continuous video. Each has a
  static poster and a play/stop control, with no automatic motion.
- Media sources, capture limitations, and font licenses are documented in
  `site/media-credits.md` and `site/assets/media-manifest.json`.
- The hero is Mega Crit's official main-menu illustration, with attribution;
  no open license is claimed. Potion art is original to this mod.
- If the original ignored captures are available, regenerate the screenshot,
  GIF, and potion exports using `python scripts/prepare-showcase-media.py`
  (requires Pillow). Normal publishing needs only the checked-in assets.

## Checks

```powershell
python scripts/check-showcase.py
node --check site/script.js
node --check site/site-config.js
```

The publishing workflow checks local asset references, fragment targets,
filename casing, image alt attributes, and JavaScript syntax before upload.
Browser review should include a phone viewport, potion selections, screenshot
dialogs, Escape and focus return, each GIF's play/stop control, and the playtest
disclosure.
