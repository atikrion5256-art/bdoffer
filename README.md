# bdoffer.online

`bdoffer.online` is a responsive Bengali offer-directory site for internet and minute offers. This repository now uses a **PHP + MySQL backend designed for Namecheap shared hosting**. The previous Node.js backend has been removed.

## What is included

The public pages include the homepage, standalone offer page, contact page, FAQ, recharge instructions, privacy policy, refund policy, and terms and conditions. Hero artwork, operator logos, and the favicon are stored under `assets/`.

The admin system includes:

- `admin.html` and `admin.js` for the browser dashboard.
- `api.php` for the PHP JSON API.
- `database.sql` for MySQL tables and default affiliate links.
- `config.sample.php` as the safe configuration template.
- `.htaccess` to route `/api/...` requests to PHP and protect sensitive files.

The dashboard supports affiliate-link creation, URL updates, activation changes, deletion, and placement assignment. Links can be assigned to the Hero CTA, operator buttons, offer cards, section CTAs, or countdown CTA. Contact inquiries are stored in MySQL and are available through the authenticated inquiry endpoint.

## Namecheap shared-hosting deployment

1. Create a MySQL database and database user in cPanel.
2. Open phpMyAdmin and import `database.sql`.
3. Copy `config.sample.php` to `config.php`.
4. Enter the cPanel database name, database username, database password, admin username, and a password hash in `config.php`.
5. Upload the repository contents to the domain document root, usually `public_html`. For an addon domain, use the document root shown in **cPanel → Domains**.
6. Confirm that `.htaccess`, `api.php`, `admin.html`, `admin.js`, `assets/`, and the public HTML files are uploaded.
7. Enable HTTPS through Namecheap SSL or cPanel SSL/TLS.
8. Open `/api/health` and confirm that it returns a JSON success response.
9. Open `/admin.html` and sign in with the configured admin credentials.

Generate a password hash locally with:

```bash
php -r "echo password_hash('YOUR_LONG_UNIQUE_PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
```

Never commit `config.php` or place database credentials in JavaScript. The repository ignores `config.php`, and `.htaccess` denies direct access to it if it is stored under the document root.

For the full Bengali/English cPanel walkthrough, see [`NAMECHEAP_PHP_MYSQL.md`](NAMECHEAP_PHP_MYSQL.md).

## Local PHP verification

Create a local configuration from the sample and provide a MySQL database. Then run:

```bash
cp config.sample.php config.php
php -S 127.0.0.1:8080
```

For Apache-style `/api/...` rewrites, use the uploaded `.htaccess` on Namecheap. PHP's built-in server does not process `.htaccess`; direct local API testing can use `/api.php` with an appropriate request URI or an Apache/PHP local server.

## GitHub Pages

The GitHub Pages workflow still publishes the public static pages only. GitHub Pages cannot execute PHP or provide the MySQL API, so `/admin.html` is not a working admin deployment on the GitHub Pages URL. Use Namecheap shared hosting for the complete site and admin system.

## Data and security

MySQL stores affiliate links, admin sessions, and contact inquiries. The application uses PDO prepared statements, password hashes, hashed bearer tokens, HTTPS-only affiliate URL validation, and protected configuration files. Use a long unique admin password, keep HTTPS enabled, and back up the MySQL database regularly.

The application is intended for a small shared-hosting site. If traffic or write volume becomes high, add rate limiting, centralized logging, and a managed database backup policy.
