# bdoffer.online

bdoffer.online is a responsive Bengali offer-directory site for internet and minute offers. The public website is static and is prepared for free GitHub Pages hosting with the custom domain `bdoffer.online`.

## What is included

The public pages include the homepage, standalone offer page, contact page, FAQ, recharge instructions, privacy policy, refund policy, and terms and conditions. The supplied hero artwork is served as the versioned asset `assets/hero/hero-image-v2.png`. Operator logos and the branded favicon are stored under `assets/`.

The homepage includes a repeating twelve-hour countdown, a mobile-optimized operator filter, responsive offer cards, current-date rendering on information pages, and cache-safe asset references.

The repository also contains `admin.html`, `admin.js`, and `server.js`. These files are retained for a separate Node.js backend deployment. They are intentionally excluded from the GitHub Pages artifact because GitHub Pages cannot execute Node.js or provide API routes.

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` builds a clean `_site` artifact containing only public static files. It excludes the backend, admin source, and development artifacts. `CNAME` is configured for `bdoffer.online`, and `.nojekyll` is included.

Before the first successful deployment, enable GitHub Pages in the repository settings:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Confirm the custom domain as `bdoffer.online`.
4. After DNS resolves, enable **Enforce HTTPS**.

The root domain should use GitHub Pages A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. The `www` host should be a CNAME to `atikrion5256-art.github.io`.

## Admin and affiliate links

The admin dashboard supports link creation, URL updates, activation changes, deletion, and placement assignment. A link can be assigned to the Hero CTA, operator buttons, offer cards, section CTAs, or the countdown CTA.

The admin dashboard requires the Node backend. Deploy `server.js` to a Node-compatible host such as Render, Railway, a VPS, or another service that supports persistent Node processes. Configure `ADMIN_USERNAME` and `ADMIN_PASSWORD` as host secrets. Do not commit `.admin-env` or any password to Git.

After deploying the API, update the frontend API origin if the API is hosted on a different domain and configure CORS for `https://bdoffer.online`.

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

Legacy source modules, duplicate hero assets, unused CSS modules, the old build script, the logo source demo, and the unused package metadata were removed from the deployable repository. The Pages workflow now publishes only the verified public site.
