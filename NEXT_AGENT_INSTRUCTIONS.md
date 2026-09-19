# Next AI Agent Handoff

## Current state

The repository is `atikrion5256-art/bdoffer` on branch `main`. The latest cleanup commit is created after the audit and should be treated as the source of truth. The public static site files are ready for GitHub Pages. The Node backend and admin source remain in the repository for a separate API deployment, but the Pages workflow excludes them.

## What was completed

The audit removed the unused legacy source modules, unused CSS modules, the old build script, the logo source demo, unused package metadata, and the duplicate unversioned hero image. The public site now uses `assets/hero/hero-image-v2.png` and `assets/favicon.svg`.

The homepage has a no-crop responsive hero image, compact mobile operator filtering, a repeating twelve-hour countdown, a countdown CTA, automatically rendered current dates, and public-link hydration. The admin dashboard supports affiliate URL creation, update, activation, deletion, and placement assignment.

The available affiliate placements are `hero_cta`, `operator_buttons`, `offer_cards`, `section_ctas`, and `countdown_cta`.

## Remaining work

The remaining production work is external configuration rather than source-code cleanup:

1. Enable GitHub Pages in **Settings → Pages** for the repository and select **GitHub Actions** as the source.
2. Confirm the custom domain `bdoffer.online` in GitHub Pages.
3. Configure the registrar DNS. Use A records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Use a CNAME for `www` pointing to `atikrion5256-art.github.io`.
4. Wait for DNS propagation, then enable HTTPS in GitHub Pages.
5. Deploy `server.js` to a Node-compatible host if the admin dashboard and affiliate APIs must work in production. GitHub Pages cannot execute `server.js`.
6. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` as production secrets on the API host. Never commit `.admin-env` or credentials.
7. If the API uses a separate origin, update the frontend API base URL and allow only `https://bdoffer.online` through CORS.

## Verification commands

```bash
node --check server.js
node --check admin.js
curl -I https://bdoffer.online/
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

Do not reintroduce the removed `app.js`, `build.js`, `client.js`, `components.js`, `data.js`, `icons.js`, legacy CSS modules, `logo-bobble-source.html`, `package.json`, or the unversioned `hero-image.png`. Do not publish `.admin-env`, `data/`, sessions, tokens, or passwords to GitHub Pages.
