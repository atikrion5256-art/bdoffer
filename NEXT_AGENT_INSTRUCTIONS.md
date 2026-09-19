# Next AI Agent Handoff

## Current state

The repository is `atikrion5256-art/bdoffer` on branch `main`. The latest source of truth is the newest commit on `main`. The public static site is configured for free GitHub Pages hosting at `https://atikrion5256-art.github.io/bdoffer/`. No custom domain is active in the current mode.

## What was completed

The repository was cleaned of unused legacy source modules, unused CSS modules, the old build script, the logo source demo, unused package metadata, the duplicate unversioned hero image, and the custom-domain `CNAME` file. The public site uses `assets/hero/hero-image-v2.png` and `assets/favicon.svg`.

The homepage has a no-crop responsive hero image, compact mobile operator filtering, a repeating twelve-hour countdown, a countdown CTA, automatically rendered current dates, and public-link hydration. The admin dashboard supports affiliate URL creation, update, activation, deletion, and placement assignment.

The available affiliate placements are `hero_cta`, `operator_buttons`, `offer_cards`, `section_ctas`, and `countdown_cta`.

## Remaining work

1. Confirm GitHub Pages is set to **GitHub Actions** in **Settings → Pages** if the repository has not already been enabled.
2. Verify the free URL: `https://atikrion5256-art.github.io/bdoffer/`.
3. Deploy `server.js` to a Node-compatible host if the admin dashboard and affiliate APIs must work in production. GitHub Pages cannot execute `server.js`.
4. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` as production secrets on the API host. Never commit `.admin-env` or credentials.
5. If the API uses a separate origin, update the frontend API base URL and allow only the GitHub Pages origin through CORS.
6. A custom domain can be configured later, but that is outside the current free-hosting setup.

## Verification commands

```bash
node --check server.js
node --check admin.js
curl -I https://atikrion5256-art.github.io/bdoffer/
gh run list --repo atikrion5256-art/bdoffer --limit 5
```

For the backend:

```bash
set -a
. ./.admin-env
set +a
node server.js
curl http://127.0.0.1:8080/api/health
curl http://127.0.0.1:8080/api/public-links
```

## Do not do

Do not reintroduce the removed legacy files, publish `.admin-env`, runtime data, sessions, tokens, or passwords to GitHub Pages, or claim that admin functionality works on GitHub Pages without a separate API deployment.
