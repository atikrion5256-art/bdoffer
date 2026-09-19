# Next AI Agent Handoff

## Current state

The repository is `atikrion5256-art/bdoffer` on branch `main`. The public static site remains available through the GitHub Pages workflow, but the complete production deployment is now designed for Namecheap shared hosting with PHP + MySQL.

## What was completed

The public pages and assets remain intact. The admin dashboard supports affiliate URL creation, update, activation, deletion, and placement assignment.

The Node.js backend was removed. The replacement backend consists of `api.php`, `database.sql`, `config.sample.php`, and `.htaccess`. MySQL stores affiliate links, admin sessions, and contact inquiries.

The available affiliate placements are `hero_cta`, `operator_buttons`, `offer_cards`, `section_ctas`, and `countdown_cta`.

## Production setup

1. Create a MySQL database and user in Namecheap cPanel.
2. Import `database.sql` in phpMyAdmin.
3. Copy `config.sample.php` to `config.php` and set the database credentials and password hash.
4. Upload the repository to the domain document root, usually `public_html`.
5. Keep `.htaccess` enabled so `/api/...` routes to `api.php` and sensitive files are blocked.
6. Enable HTTPS.
7. Test `/api/health` and `/admin.html`.

Read `NAMECHEAP_PHP_MYSQL.md` for the full deployment procedure. Never commit `config.php` or credentials.

## Verification commands

```bash
python3 scripts/validate-static-assets.py
node --check admin.js
```

On a server with PHP CLI, also run:

```bash
php -l api.php
```

## Do not do

Do not reintroduce `server.js`, `.admin-env`, the JSON runtime store, or Node deployment instructions. Do not publish credentials, sessions, or database passwords. Do not claim that the admin functionality works on GitHub Pages, because GitHub Pages cannot execute PHP or connect to MySQL.
