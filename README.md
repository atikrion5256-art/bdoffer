# bdoffer.online

bdoffer.online is a responsive Bengali offer-directory site for internet and minute offers. The public website is configured for free GitHub Pages hosting at:

`https://atikrion5256-art.github.io/bdoffer/`

## What is included

The public pages include the homepage, standalone offer page, contact page, FAQ, recharge instructions, privacy policy, refund policy, and terms and conditions. The supplied hero artwork is served as `assets/hero/hero-image-v2.png`. Operator logos and the branded favicon are stored under `assets/`.

The homepage includes a repeating twelve-hour countdown, a mobile-optimized operator filter, responsive offer cards, current-date rendering on information pages, and cache-safe asset references.

The repository also contains `admin.html`, `admin.js`, and `server.js` for a separate Node.js backend deployment. These files are intentionally excluded from the GitHub Pages artifact because GitHub Pages cannot execute Node.js or provide API routes.

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` builds a clean `_site` artifact containing only public static files. It excludes the backend, admin source, runtime data, credentials, and development artifacts. `.nojekyll` is included. No custom domain or DNS configuration is required in the current free-hosting mode.

To use the free GitHub Pages URL, open **Settings → Pages** and select **GitHub Actions** as the source if GitHub has not already enabled it. The site is then available at the `github.io/bdoffer` URL above.

A custom domain can be added later by restoring a `CNAME` file and configuring DNS, but it is intentionally disabled for now.

## Admin and affiliate links

The admin dashboard supports link creation, URL updates, activation changes, deletion, and placement assignment. A link can be assigned to the Hero CTA, operator buttons, offer cards, section CTAs, or the countdown CTA.

The admin dashboard requires the Node backend. Deploy `server.js` to a Node-compatible host such as Render, Railway, a VPS, or another service that supports persistent Node processes. Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD` as host secrets. Do not commit `.admin-env` or any password to Git.

After deploying the API, update the frontend API origin if the API is hosted on a different domain and configure CORS for the GitHub Pages origin.

## Local verification

The public site can be served with a static server. The complete admin/API flow requires the Node server and environment variables:

```bash
set -a
. ./.admin-env
set +a
node server.js
```

The public site is available at `http://127.0.0.1:8080/`. The admin dashboard is at `http://127.0.0.1:8080/admin.html`.

## Repository hygiene

Legacy source modules, duplicate hero assets, unused CSS modules, the old build script, the logo source demo, and unused package metadata were removed from the deployable repository. The Pages workflow now publishes only the verified public site.
